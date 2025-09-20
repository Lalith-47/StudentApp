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
        }
      } catch (aiError) {
        console.error("AI Service Error:", aiError);
        // Fall back to FAQ search if AI fails
      }
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

module.exports = {
  getAllFaqs,
  getFaqById,
  searchFaqs,
  getFaqCategories,
  submitFaqQuery,
  getAIProviders,
  markFaqHelpful,
};
