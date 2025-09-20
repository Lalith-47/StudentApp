const express = require("express");
const router = express.Router();
const {
  getUserAnalytics,
  updateUserAnalytics,
  resetUserAnalytics,
} = require("../controllers/analyticsController");
const { authenticateToken } = require("../middleware/auth");

// @route   GET /api/analytics/user
// @desc    Get user analytics
// @access  Private
router.get("/user", authenticateToken, getUserAnalytics);

// @route   POST /api/analytics/user/update
// @desc    Update user analytics
// @access  Private
router.post("/user/update", authenticateToken, updateUserAnalytics);

// @route   POST /api/analytics/user/reset
// @desc    Reset user analytics to 0
// @access  Private
router.post("/user/reset", authenticateToken, resetUserAnalytics);

module.exports = router;
