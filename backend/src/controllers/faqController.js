const Faq = require("../models/Faq");
const { dummyFaqs } = require("../data/dummyData");
const aiService = require("../services/aiService");

// Get all FAQs
const getAllFaqs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      sortBy = "priority",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = { isActive: true };
    if (category) query.category = category;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Try to find in database first
    let faqs;
    try {
      const skip = (page - 1) * limit;
      faqs = await Faq.find(query).sort(sort).skip(skip).limit(parseInt(limit));
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faqs = [];
    }

    // If no data in database, use dummy data
    if (faqs.length === 0) {
      faqs = dummyFaqs.filter((faq) => {
        if (category && faq.category !== category) return false;
        return true;
      });

      // Apply sorting to dummy data
      faqs.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (sortOrder === "desc") {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Apply pagination
      const skip = (page - 1) * limit;
      faqs = faqs.slice(skip, skip + parseInt(limit));
    }

    res.json({
      success: true,
      data: faqs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: faqs.length,
      },
    });
  } catch (error) {
    console.error("Get all FAQs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get FAQ by ID
const getFaqById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find in database first
    let faq;
    try {
      faq = await Faq.findById(id);
      if (faq) {
        // Increment view count
        await faq.incrementViews();
      }
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faq = null;
    }

    // If not found in database, use dummy data
    if (!faq) {
      faq = dummyFaqs.find(
        (f) =>
          f._id === id || f.question.toLowerCase().includes(id.toLowerCase())
      );

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }
    }

    res.json({
      success: true,
      data: faq,
    });
  } catch (error) {
    console.error("Get FAQ by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Search FAQs
const searchFaqs = async (req, res) => {
  try {
    const { q, category, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Try to search in database first
    let faqs;
    try {
      const query = {
        $and: [
          { isActive: true },
          {
            $or: [
              { question: { $regex: q, $options: "i" } },
              { answer: { $regex: q, $options: "i" } },
              { tags: { $in: [new RegExp(q, "i")] } },
            ],
          },
        ],
      };

      if (category) query.$and.push({ category });

      faqs = await Faq.find(query)
        .sort({ priority: -1, views: -1 })
        .limit(parseInt(limit));
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faqs = [];
    }

    // If no data in database, search dummy data
    if (faqs.length === 0) {
      const searchTerm = q.toLowerCase();
      faqs = dummyFaqs.filter((faq) => {
        const matchesSearch =
          faq.question.toLowerCase().includes(searchTerm) ||
          faq.answer.toLowerCase().includes(searchTerm) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

        const matchesCategory = !category || faq.category === category;

        return matchesSearch && matchesCategory;
      });

      // Sort by priority and views
      faqs.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.views - a.views;
      });
    }

    res.json({
      success: true,
      data: faqs,
      query: q,
      results: faqs.length,
    });
  } catch (error) {
    console.error("Search FAQs error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get FAQ categories
const getFaqCategories = async (req, res) => {
  try {
    // Try to get from database first
    let categories;
    try {
      categories = await Faq.distinct("category", { isActive: true });
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      categories = [];
    }

    // If no data in database, use dummy data
    if (categories.length === 0) {
      categories = [...new Set(dummyFaqs.map((faq) => faq.category))];
    }

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Get FAQ categories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Submit FAQ query (for chatbot)
const submitFaqQuery = async (req, res) => {
  try {
    const { query, useAI = true, aiProvider } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // If AI is enabled, try to get AI response first
    if (useAI) {
      try {
        const bestProvider = aiProvider || aiService.getBestProvider();

        if (bestProvider) {
          console.log(`Using AI provider: ${bestProvider}`);
          const aiResponse = await aiService.generateResponse(
            query,
            bestProvider
          );

          // Also try to find related FAQs for additional context
          let relatedFaqs = [];
          try {
            const searchTerm = query.toLowerCase();
            relatedFaqs = dummyFaqs
              .filter((faq) => {
                return (
                  faq.question.toLowerCase().includes(searchTerm) ||
                  faq.answer.toLowerCase().includes(searchTerm) ||
                  faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
                );
              })
              .slice(0, 3);
          } catch (dbError) {
            console.log("Could not fetch related FAQs");
          }

          return res.json({
            success: true,
            data: {
              found: true,
              answer: aiResponse.response,
              aiProvider: aiResponse.provider,
              aiModel: aiResponse.model,
              relatedQuestions: relatedFaqs.map((faq) => ({
                question: faq.question,
                answer: faq.answer.substring(0, 200) + "...",
              })),
              suggestions: [
                "What are the admission requirements?",
                "How to prepare for entrance exams?",
                "What are the career opportunities?",
                "How to apply for scholarships?",
              ],
            },
          });
        } else {
          // No AI provider available, use enhanced fallback
          console.log("No AI provider available, using enhanced fallback");
          const enhancedResponse = generateEnhancedResponse(query);
          return res.json({
            success: true,
            data: {
              found: true,
              answer: enhancedResponse.answer,
              aiProvider: "AdhyayanMarg Assistant",
              aiModel: "Enhanced Knowledge Base",
              relatedQuestions: enhancedResponse.relatedQuestions,
              suggestions: enhancedResponse.suggestions,
            },
          });
        }
      } catch (aiError) {
        console.error("AI Service Error:", aiError);
        // Fall back to enhanced response
        const enhancedResponse = generateEnhancedResponse(query);
        return res.json({
          success: true,
          data: {
            found: true,
            answer: enhancedResponse.answer,
            aiProvider: "AdhyayanMarg Assistant",
            aiModel: "Enhanced Knowledge Base",
            relatedQuestions: enhancedResponse.relatedQuestions,
            suggestions: enhancedResponse.suggestions,
          },
        });
      }
    } else {
      // AI is disabled, use enhanced response
      const enhancedResponse = generateEnhancedResponse(query);
      return res.json({
        success: true,
        data: {
          found: true,
          answer: enhancedResponse.answer,
          aiProvider: "AdhyayanMarg Assistant",
          aiModel: "Enhanced Knowledge Base",
          relatedQuestions: enhancedResponse.relatedQuestions,
          suggestions: enhancedResponse.suggestions,
        },
      });
    }

    // Fallback to FAQ search if AI is disabled or fails
    let matchingFaqs;
    try {
      matchingFaqs = await Faq.find({
        $and: [
          { isActive: true },
          {
            $or: [
              { question: { $regex: query, $options: "i" } },
              { answer: { $regex: query, $options: "i" } },
              { tags: { $in: [new RegExp(query, "i")] } },
            ],
          },
        ],
      })
        .sort({ priority: -1, views: -1 })
        .limit(3);
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      matchingFaqs = [];
    }

    // If no data in database, search dummy data
    if (matchingFaqs.length === 0) {
      const searchTerm = query.toLowerCase();
      matchingFaqs = dummyFaqs.filter((faq) => {
        return (
          faq.question.toLowerCase().includes(searchTerm) ||
          faq.answer.toLowerCase().includes(searchTerm) ||
          faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        );
      });

      // Sort by priority and views
      matchingFaqs.sort((a, b) => {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.views - a.views;
      });

      matchingFaqs = matchingFaqs.slice(0, 3);
    }

    // Generate response
    let response;
    if (matchingFaqs.length > 0) {
      const topMatch = matchingFaqs[0];
      response = {
        found: true,
        answer: topMatch.answer,
        relatedQuestions: matchingFaqs.slice(1).map((faq) => ({
          question: faq.question,
          answer: faq.answer.substring(0, 200) + "...",
        })),
        confidence: calculateConfidence(query, topMatch),
      };
    } else {
      response = {
        found: false,
        answer:
          "I couldn't find a specific answer to your question. Please try rephrasing your query or contact our support team for assistance.",
        suggestions: [
          "What are the admission requirements?",
          "How to prepare for entrance exams?",
          "What are the career opportunities?",
          "How to apply for scholarships?",
        ],
      };
    }

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Submit FAQ query error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get available AI providers
const getAIProviders = async (req, res) => {
  try {
    const availableProviders = aiService.getAvailableProviders();
    const bestProvider = aiService.getBestProvider();

    res.json({
      success: true,
      data: {
        available: availableProviders,
        best: bestProvider,
        providers: {
          openai: {
            name: "OpenAI ChatGPT",
            available: availableProviders.includes("openai"),
            model: "gpt-3.5-turbo",
          },
          gemini: {
            name: "Google Gemini",
            available: availableProviders.includes("gemini"),
            model: "gemini-1.5-flash",
          },
          deepseek: {
            name: "DeepSeek",
            available: availableProviders.includes("deepseek"),
            model: "deepseek-chat",
          },
        },
      },
    });
  } catch (error) {
    console.error("Get AI providers error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Mark FAQ as helpful
const markFaqHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    const { isHelpful } = req.body;

    if (typeof isHelpful !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isHelpful must be a boolean value",
      });
    }

    // Try to find in database first
    let faq;
    try {
      faq = await Faq.findById(id);
      if (faq) {
        await faq.markHelpful(isHelpful);
      }
    } catch (dbError) {
      console.log("Database not connected, using dummy data");
      faq = null;
    }

    // If not found in database, use dummy data
    if (!faq) {
      faq = dummyFaqs.find((f) => f._id === id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }

      // Simulate helpful feedback
      if (isHelpful) {
        faq.helpful.yes += 1;
      } else {
        faq.helpful.no += 1;
      }
    }

    res.json({
      success: true,
      message: "Feedback recorded successfully",
      data: {
        helpful: faq.helpful,
        helpfulPercentage:
          faq.helpfulPercentage ||
          Math.round(
            (faq.helpful.yes / (faq.helpful.yes + faq.helpful.no)) * 100
          ),
      },
    });
  } catch (error) {
    console.error("Mark FAQ helpful error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helper function to calculate confidence score
function calculateConfidence(query, faq) {
  const queryWords = query.toLowerCase().split(" ");
  const questionWords = faq.question.toLowerCase().split(" ");
  const answerWords = faq.answer.toLowerCase().split(" ");

  let matches = 0;
  queryWords.forEach((word) => {
    if (questionWords.includes(word) || answerWords.includes(word)) {
      matches++;
    }
  });

  const confidence = Math.min(
    95,
    Math.round((matches / queryWords.length) * 100)
  );
  return confidence;
}

// Enhanced response generator for better chatbot experience
function generateEnhancedResponse(query) {
  const queryLower = query.toLowerCase();

  // Greeting responses
  if (
    queryLower.includes("hello") ||
    queryLower.includes("hi") ||
    queryLower.includes("helo") ||
    queryLower.includes("hey")
  ) {
    return {
      answer: `Hello! 👋 Welcome to AdhyayanMarg! I'm your career guidance assistant and I'm here to help you with:

🎓 **Education & Career Planning**
• College selection and admission guidance
• Course recommendations based on your interests
• Career exploration and planning
• Exam preparation strategies

💡 **What I Can Help You With:**
• Engineering colleges and admissions (IITs, NITs, Private colleges)
• Career options after 12th and graduation
• JEE, NEET, and other competitive exam preparation
• Skill development and job market insights
• Study abroad opportunities

Just ask me anything about your career or education journey, and I'll provide detailed, helpful information to guide your decisions! 

What would you like to know about today?`,
      relatedQuestions: [
        {
          question: "What are the best engineering colleges in India?",
          answer: "India has many excellent engineering colleges...",
        },
        {
          question: "How to prepare for JEE exam?",
          answer: "JEE preparation requires a systematic approach...",
        },
        {
          question: "What career options are available after 12th?",
          answer: "After 12th, you have multiple career paths...",
        },
      ],
      suggestions: [
        "What are the top engineering colleges?",
        "How to prepare for competitive exams?",
        "What are the best career options?",
        "How to choose the right college?",
      ],
    };
  }

  // Career guidance responses
  if (
    queryLower.includes("career") ||
    queryLower.includes("job") ||
    queryLower.includes("profession")
  ) {
    return {
      answer: `Great question about career guidance! Here's what I can help you with:

🎯 **Career Exploration**: Discover career paths that match your interests, skills, and values
📚 **Education Planning**: Find the right courses, colleges, and programs for your career goals
💼 **Job Market Insights**: Get information about job prospects, salary expectations, and industry trends
🎓 **Skill Development**: Learn about essential skills and certifications for your chosen field
📈 **Career Growth**: Plan your career progression and advancement opportunities

**Popular Career Fields:**
• Technology & IT (Software Development, Data Science, Cybersecurity)
• Healthcare (Medicine, Nursing, Allied Health)
• Business & Finance (Management, Accounting, Marketing)
• Engineering (Computer, Mechanical, Civil, Electrical)
• Creative Arts (Design, Media, Writing, Performing Arts)

Would you like me to help you explore any specific career field or answer questions about career planning?`,
      relatedQuestions: [
        {
          question: "What are the best career options after engineering?",
          answer: "Engineering graduates have diverse career opportunities...",
        },
        {
          question: "How to choose the right career path?",
          answer: "Choosing a career path involves self-assessment...",
        },
        {
          question: "What skills are in demand in 2024?",
          answer: "The job market is constantly evolving...",
        },
      ],
      suggestions: [
        "What are the highest paying careers?",
        "How to switch careers successfully?",
        "What are the best careers for introverts?",
        "How to start a career in tech?",
      ],
    };
  }

  // College and education responses
  if (
    queryLower.includes("college") ||
    queryLower.includes("university") ||
    queryLower.includes("admission") ||
    queryLower.includes("engineering college")
  ) {
    return {
      answer: `I'd be happy to help you with college and education information! Here's what I can assist you with:

🏛️ **Top Engineering Colleges in India:**
• **IITs**: IIT Delhi, IIT Bombay, IIT Madras, IIT Kanpur, IIT Kharagpur
• **NITs**: NIT Trichy, NIT Surathkal, NIT Warangal, NIT Rourkela
• **Private**: BITS Pilani, VIT Vellore, SRM University, Manipal Institute of Technology

📋 **Admission Process:**
• **JEE Main**: For NITs and other engineering colleges
• **JEE Advanced**: For IITs and IISc
• **State Entrance Exams**: For state government colleges
• **Direct Admission**: For private colleges based on 12th marks

🎯 **Selection Criteria:**
• Academic performance (10th and 12th marks)
• Entrance exam scores
• Personal interview (for some colleges)
• Extracurricular activities and achievements

**Popular Engineering Branches:**
• Computer Science Engineering (CSE)
• Electronics and Communication Engineering (ECE)
• Mechanical Engineering (ME)
• Civil Engineering (CE)
• Electrical Engineering (EE)

Would you like specific information about any particular college or admission process?`,
      relatedQuestions: [
        {
          question: "What is the JEE Main exam pattern?",
          answer: "JEE Main is conducted in two papers...",
        },
        {
          question: "How to prepare for JEE Advanced?",
          answer: "JEE Advanced preparation requires...",
        },
        {
          question: "What are the cutoffs for top engineering colleges?",
          answer: "Cutoffs vary each year based on...",
        },
      ],
      suggestions: [
        "What are the best engineering colleges in Bangalore?",
        "How to get admission in IIT?",
        "What is the fee structure for engineering colleges?",
        "Which engineering branch has best placement?",
      ],
    };
  }

  // Exam preparation responses
  if (
    queryLower.includes("exam") ||
    queryLower.includes("preparation") ||
    queryLower.includes("study") ||
    queryLower.includes("jee") ||
    queryLower.includes("neet")
  ) {
    return {
      answer: `I can help you with exam preparation strategies! Here's comprehensive guidance:

📚 **JEE Main Preparation:**
• **Syllabus**: Physics, Chemistry, Mathematics (Class 11-12)
• **Pattern**: 90 questions (30 each subject), 3 hours duration
• **Strategy**: Focus on NCERT books, practice previous year papers
• **Time Management**: Allocate time based on strengths and weaknesses

🎯 **JEE Advanced Preparation:**
• **Level**: Higher difficulty than JEE Main
• **Focus**: Problem-solving skills and conceptual understanding
• **Resources**: Advanced books, mock tests, coaching materials
• **Practice**: Solve complex problems and time-bound tests

📖 **Study Tips:**
• Create a study schedule and stick to it
• Regular revision is crucial
• Take mock tests to assess progress
• Focus on weak areas and improve them
• Maintain good health and adequate sleep

**Popular Study Resources:**
• NCERT textbooks (foundation)
• HC Verma (Physics)
• OP Tandon (Chemistry)
• RD Sharma (Mathematics)
• Online platforms: Khan Academy, Unacademy, Vedantu

Which exam are you preparing for? I can provide more specific guidance!`,
      relatedQuestions: [
        {
          question: "How to manage time during JEE preparation?",
          answer: "Time management is crucial for JEE success...",
        },
        {
          question: "What are the best books for JEE preparation?",
          answer: "Choosing the right study material...",
        },
        {
          question: "How to stay motivated during exam preparation?",
          answer: "Maintaining motivation throughout...",
        },
      ],
      suggestions: [
        "How to prepare for NEET exam?",
        "What is the best study schedule for JEE?",
        "How to improve problem-solving speed?",
        "What are the common mistakes in JEE preparation?",
      ],
    };
  }

  // General guidance response
  return {
    answer: `I'm here to help you with your career and education journey! Here's how I can assist you:

🎓 **Education Guidance:**
• College selection and admission process
• Course recommendations based on interests
• Scholarship and financial aid information
• Study abroad opportunities

💼 **Career Planning:**
• Career exploration and assessment
• Industry insights and job market trends
• Skill development recommendations
• Resume building and interview preparation

📚 **Academic Support:**
• Exam preparation strategies
• Study tips and techniques
• Subject-specific guidance
• Time management skills

**Popular Topics I Can Help With:**
• Engineering colleges and admissions
• Medical and healthcare careers
• Business and management programs
• Arts and humanities options
• Skill-based courses and certifications

Feel free to ask me about any specific topic, and I'll provide detailed, helpful information to guide your decisions!`,
    relatedQuestions: [
      {
        question: "What are the best career options after 12th?",
        answer: "After 12th, you have multiple career paths...",
      },
      {
        question: "How to choose the right college?",
        answer: "Choosing the right college involves considering...",
      },
      {
        question: "What are the emerging career fields?",
        answer: "Several new career fields are emerging...",
      },
    ],
    suggestions: [
      "What are the best courses after 12th science?",
      "How to prepare for competitive exams?",
      "What are the career options in technology?",
      "How to choose between different engineering branches?",
    ],
  };
}

module.exports = {
  getAllFaqs,
  getFaqById,
  searchFaqs,
  getFaqCategories,
  submitFaqQuery,
  getAIProviders,
  markFaqHelpful,
};
