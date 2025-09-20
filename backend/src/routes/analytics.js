const express = require('express');
const router = express.Router();
const { 
  getAnalytics, 
  getUserEngagement, 
  getContentPerformance, 
  getSystemHealth 
} = require('../controllers/analyticsController');

// @route   GET /api/analytics
// @desc    Get analytics dashboard data
// @access  Public (should be private in production)
router.get('/', getAnalytics);

// @route   GET /api/analytics/engagement
// @desc    Get user engagement metrics
// @access  Public (should be private in production)
router.get('/engagement', getUserEngagement);

// @route   GET /api/analytics/performance
// @desc    Get content performance metrics
// @access  Public (should be private in production)
router.get('/performance', getContentPerformance);

// @route   GET /api/analytics/health
// @desc    Get system health metrics
// @access  Public (should be private in production)
router.get('/health', getSystemHealth);

module.exports = router;
