const User = require("../models/User");

// Get user analytics
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user and populate analytics
    const user = await User.findById(userId).select("analytics");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize analytics if not exists
    if (!user.analytics) {
      user.analytics = {
        totalInteractions: 0,
        completedCourses: 0,
        appliedInternships: 0,
        appliedScholarships: 0,
        totalHours: 0,
        achievements: 0,
        lastUpdated: new Date(),
      };
      await user.save();
    }

    res.json({
      success: true,
      data: user.analytics,
    });
  } catch (error) {
    console.error("Get user analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user analytics
const updateUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { field, increment = 1 } = req.body;

    const validFields = [
      "totalInteractions",
      "completedCourses",
      "appliedInternships",
      "appliedScholarships",
      "totalHours",
      "achievements",
    ];

    if (!validFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid field name",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize analytics if not exists
    if (!user.analytics) {
      user.analytics = {
        totalInteractions: 0,
        completedCourses: 0,
        appliedInternships: 0,
        appliedScholarships: 0,
        totalHours: 0,
        achievements: 0,
        lastUpdated: new Date(),
      };
    }

    // Update the specific field
    user.analytics[field] = (user.analytics[field] || 0) + increment;
    user.analytics.lastUpdated = new Date();

    await user.save();

    res.json({
      success: true,
      data: user.analytics,
      message: `${field} updated successfully`,
    });
  } catch (error) {
    console.error("Update user analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset user analytics to 0
const resetUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Reset all analytics to 0
    user.analytics = {
      totalInteractions: 0,
      completedCourses: 0,
      appliedInternships: 0,
      appliedScholarships: 0,
      totalHours: 0,
      achievements: 0,
      lastUpdated: new Date(),
    };

    await user.save();

    res.json({
      success: true,
      data: user.analytics,
      message: "Analytics reset successfully",
    });
  } catch (error) {
    console.error("Reset user analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUserAnalytics,
  updateUserAnalytics,
  resetUserAnalytics,
};
