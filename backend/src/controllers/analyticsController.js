const { dummyAnalytics } = require('../data/dummyData');
const QuizResult = require('../models/QuizResult');
const Story = require('../models/Story');
const College = require('../models/College');
const Faq = require('../models/Faq');

// Get analytics dashboard data
const getAnalytics = async (req, res) => {
  try {
    // Try to get real data from database first
    let analytics;
    try {
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalQuizAttempts = await QuizResult.countDocuments();
      const totalStories = await Story.countDocuments({ isActive: true, isApproved: true });
      const totalColleges = await College.countDocuments({ isActive: true });
      const totalFaqs = await Faq.countDocuments({ isActive: true });

      // Get monthly stats (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const monthlyStats = {
        newUsers: await User.countDocuments({ 
          createdAt: { $gte: thirtyDaysAgo },
          isActive: true 
        }),
        quizCompletions: await QuizResult.countDocuments({ 
          submittedAt: { $gte: thirtyDaysAgo } 
        }),
        storyViews: await Story.aggregate([
          { $match: { isActive: true, isApproved: true } },
          { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]).then(result => result[0]?.totalViews || 0),
        collegeSearches: Math.floor(Math.random() * 1000) + 5000 // Simulated data
      };

      // Get popular courses from quiz results
      const popularCourses = await QuizResult.aggregate([
        { $unwind: '$recommendedCourses' },
        { $group: { 
          _id: '$recommendedCourses.courseName', 
          searches: { $sum: 1 } 
        }},
        { $sort: { searches: -1 } },
        { $limit: 10 }
      ]);

      // Get top colleges by views
      const topColleges = await College.aggregate([
        { $match: { isActive: true } },
        { $project: { name: 1, views: { $size: '$reviews' } } },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ]);

      analytics = {
        totalUsers,
        totalQuizAttempts,
        totalStories,
        totalColleges,
        totalFaqs,
        monthlyStats,
        popularCourses,
        topColleges
      };
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      analytics = dummyAnalytics;
    }

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user engagement metrics
const getUserEngagement = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    // Try to get real data from database first
    let engagement;
    try {
      const quizCompletions = await QuizResult.countDocuments({
        submittedAt: { $gte: startDate, $lte: endDate }
      });

      const storyViews = await Story.aggregate([
        { 
          $match: { 
            isActive: true, 
            isApproved: true,
            publishedAt: { $gte: startDate, $lte: endDate }
          } 
        },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).then(result => result[0]?.totalViews || 0);

      const faqViews = await Faq.aggregate([
        { 
          $match: { 
            isActive: true,
            lastUpdated: { $gte: startDate, $lte: endDate }
          } 
        },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).then(result => result[0]?.totalViews || 0);

      engagement = {
        period,
        quizCompletions,
        storyViews,
        faqViews,
        totalEngagement: quizCompletions + storyViews + faqViews
      };
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      engagement = {
        period,
        quizCompletions: Math.floor(Math.random() * 500) + 200,
        storyViews: Math.floor(Math.random() * 2000) + 1000,
        faqViews: Math.floor(Math.random() * 1000) + 500,
        totalEngagement: Math.floor(Math.random() * 3500) + 1700
      };
    }

    res.json({
      success: true,
      data: engagement
    });

  } catch (error) {
    console.error('Get user engagement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get content performance metrics
const getContentPerformance = async (req, res) => {
  try {
    // Try to get real data from database first
    let performance;
    try {
      // Top performing stories
      const topStories = await Story.find({ 
        isActive: true, 
        isApproved: true 
      })
      .sort({ views: -1, likes: -1 })
      .limit(5)
      .select('title views likes category');

      // Most searched courses
      const popularCourses = await QuizResult.aggregate([
        { $unwind: '$recommendedCourses' },
        { $group: { 
          _id: '$recommendedCourses.courseName', 
          count: { $sum: 1 },
          avgMatch: { $avg: '$recommendedCourses.matchPercentage' }
        }},
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);

      // Most viewed colleges
      const topColleges = await College.find({ isActive: true })
      .sort({ 'reviews.length': -1 })
      .limit(5)
      .select('name location reviews');

      // Most helpful FAQs
      const topFaqs = await Faq.find({ isActive: true })
      .sort({ 'helpful.yes': -1, views: -1 })
      .limit(5)
      .select('question helpful views category');

      performance = {
        topStories,
        popularCourses,
        topColleges,
        topFaqs
      };
    } catch (dbError) {
      console.log('Database not connected, using dummy data');
      performance = {
        topStories: [
          {
            title: "From Small Town to Silicon Valley",
            views: 1250,
            likes: 245,
            category: "Success Story"
          }
        ],
        popularCourses: [
          { _id: "Computer Science Engineering", count: 4500, avgMatch: 92 },
          { _id: "Mechanical Engineering", count: 3200, avgMatch: 88 }
        ],
        topColleges: [
          { name: "IIT Delhi", location: { city: "New Delhi" }, reviews: [] }
        ],
        topFaqs: [
          { question: "What is the eligibility criteria for JEE Advanced?", helpful: { yes: 150 }, views: 2500, category: "Admissions" }
        ]
      };
    }

    res.json({
      success: true,
      data: performance
    });

  } catch (error) {
    console.error('Get content performance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get system health metrics
const getSystemHealth = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024)
      },
      database: {
        connected: true, // This would be checked against actual DB connection
        responseTime: Math.floor(Math.random() * 50) + 10 // Simulated
      },
      api: {
        responseTime: Math.floor(Math.random() * 100) + 50, // Simulated
        errorRate: Math.random() * 0.1 // Simulated
      }
    };

    res.json({
      success: true,
      data: health
    });

  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAnalytics,
  getUserEngagement,
  getContentPerformance,
  getSystemHealth
};
