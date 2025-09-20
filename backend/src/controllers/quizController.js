const QuizResult = require('../models/QuizResult');
const { dummyAnalytics } = require('../data/dummyData');

// Submit quiz results
const submitQuiz = async (req, res) => {
  try {
    const { answers, completionTime } = req.body;

    // Validate input
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Quiz answers are required'
      });
    }

    // Calculate scores based on answers (dummy calculation)
    const scores = {
      technical: Math.floor(Math.random() * 40) + 20,
      creative: Math.floor(Math.random() * 40) + 20,
      analytical: Math.floor(Math.random() * 40) + 20,
      social: Math.floor(Math.random() * 40) + 20,
      leadership: Math.floor(Math.random() * 40) + 20
    };

    // Determine personality type based on highest score
    const personalityTypes = ['Analyst', 'Creator', 'Helper', 'Leader', 'Explorer'];
    const maxScore = Math.max(...Object.values(scores));
    const personalityType = personalityTypes[Object.values(scores).indexOf(maxScore)];

    // Generate recommended courses based on personality type
    const recommendedCourses = generateRecommendedCourses(personalityType, scores);

    // Create quiz result object
    const quizResult = {
      userId: req.user?.id || null,
      answers,
      scores,
      recommendedCourses,
      personalityType,
      strengths: generateStrengths(personalityType),
      areasForImprovement: generateAreasForImprovement(personalityType),
      completionTime: completionTime || Math.floor(Math.random() * 300) + 300, // 5-10 minutes
      version: '1.0'
    };

    // Save to database if connected
    let savedResult;
    try {
      savedResult = await QuizResult.create(quizResult);
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      savedResult = { ...quizResult, _id: 'dummy_id_' + Date.now() };
    }

    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        quizResult: savedResult,
        recommendations: {
          courses: recommendedCourses,
          nextSteps: generateNextSteps(personalityType),
          resources: generateResources(personalityType)
        }
      }
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get quiz results for a user
const getQuizResults = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const results = await QuizResult.find({ userId })
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Helper functions
function generateRecommendedCourses(personalityType, scores) {
  const courseRecommendations = {
    'Analyst': [
      {
        courseName: 'Data Science & Analytics',
        matchPercentage: 95,
        description: 'Perfect for analytical minds who love working with data',
        careerPaths: ['Data Scientist', 'Business Analyst', 'Research Scientist']
      },
      {
        courseName: 'Computer Science Engineering',
        matchPercentage: 88,
        description: 'Strong foundation in programming and algorithms',
        careerPaths: ['Software Engineer', 'System Analyst', 'Technical Architect']
      }
    ],
    'Creator': [
      {
        courseName: 'Graphic Design & Multimedia',
        matchPercentage: 92,
        description: 'Express your creativity through visual design',
        careerPaths: ['Graphic Designer', 'UI/UX Designer', 'Creative Director']
      },
      {
        courseName: 'Architecture',
        matchPercentage: 85,
        description: 'Combine creativity with technical skills',
        careerPaths: ['Architect', 'Interior Designer', 'Urban Planner']
      }
    ],
    'Helper': [
      {
        courseName: 'Medicine',
        matchPercentage: 90,
        description: 'Serve others through healthcare',
        careerPaths: ['Doctor', 'Nurse', 'Medical Researcher']
      },
      {
        courseName: 'Psychology',
        matchPercentage: 87,
        description: 'Help people with mental health and well-being',
        careerPaths: ['Psychologist', 'Counselor', 'Therapist']
      }
    ],
    'Leader': [
      {
        courseName: 'Business Administration',
        matchPercentage: 93,
        description: 'Develop leadership and management skills',
        careerPaths: ['Manager', 'Entrepreneur', 'Executive']
      },
      {
        courseName: 'Political Science',
        matchPercentage: 80,
        description: 'Lead and influence public policy',
        careerPaths: ['Politician', 'Policy Analyst', 'Public Administrator']
      }
    ],
    'Explorer': [
      {
        courseName: 'Journalism & Mass Communication',
        matchPercentage: 89,
        description: 'Explore the world and share stories',
        careerPaths: ['Journalist', 'Content Creator', 'Media Producer']
      },
      {
        courseName: 'Environmental Science',
        matchPercentage: 84,
        description: 'Explore and protect our planet',
        careerPaths: ['Environmental Scientist', 'Conservationist', 'Researcher']
      }
    ]
  };

  return courseRecommendations[personalityType] || courseRecommendations['Analyst'];
}

function generateStrengths(personalityType) {
  const strengths = {
    'Analyst': ['Problem Solving', 'Critical Thinking', 'Data Analysis', 'Logical Reasoning'],
    'Creator': ['Creativity', 'Innovation', 'Visual Thinking', 'Artistic Skills'],
    'Helper': ['Empathy', 'Communication', 'Patience', 'Teamwork'],
    'Leader': ['Leadership', 'Decision Making', 'Strategic Thinking', 'Motivation'],
    'Explorer': ['Curiosity', 'Adaptability', 'Communication', 'Research Skills']
  };
  return strengths[personalityType] || strengths['Analyst'];
}

function generateAreasForImprovement(personalityType) {
  const improvements = {
    'Analyst': ['Social Skills', 'Creativity', 'Public Speaking'],
    'Creator': ['Technical Skills', 'Time Management', 'Business Acumen'],
    'Helper': ['Technical Skills', 'Analytical Thinking', 'Leadership'],
    'Leader': ['Technical Skills', 'Patience', 'Detail Orientation'],
    'Explorer': ['Focus', 'Technical Skills', 'Planning']
  };
  return improvements[personalityType] || improvements['Analyst'];
}

function generateNextSteps(personalityType) {
  return [
    'Research recommended courses in detail',
    'Connect with professionals in your field of interest',
    'Start building relevant skills through online courses',
    'Consider internships or volunteer opportunities'
  ];
}

function generateResources(personalityType) {
  return [
    'Online courses on Coursera and Udemy',
    'Professional networking on LinkedIn',
    'Industry blogs and publications',
    'Mentorship programs'
  ];
}

module.exports = {
  submitQuiz,
  getQuizResults
};
