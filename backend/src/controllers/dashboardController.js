const Activity = require("../models/Activity");
const Portfolio = require("../models/Portfolio");
const FacultyApproval = require("../models/FacultyApproval");
const User = require("../models/User");
const mongoose = require("mongoose");

// Get student dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student's activities summary
    const activityStats = await Activity.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          approvedActivities: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          pendingActivities: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          rejectedActivities: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          totalHours: { $sum: "$durationInHours" },
          avgImpact: {
            $avg: {
              $avg: [
                "$impact.personalGrowth",
                "$impact.academicRelevance",
                "$impact.careerRelevance",
                "$impact.socialImpact",
              ],
            },
          },
        },
      },
    ]);

    // Get recent activities
    const recentActivities = await Activity.find({ studentId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title category status startDate createdAt");

    // Get portfolio status
    const portfolio = await Portfolio.findOne({ studentId });
    const portfolioStatus = portfolio
      ? {
          isCreated: true,
          isPublished: portfolio.status === "published",
          completeness: portfolio.completenessPercentage,
          views: portfolio.analytics.views,
          downloads: portfolio.analytics.downloads,
          lastUpdated: portfolio.updatedAt,
        }
      : {
          isCreated: false,
          isPublished: false,
          completeness: 0,
          views: 0,
          downloads: 0,
          lastUpdated: null,
        };

    // Get pending approvals
    const pendingApprovals = await FacultyApproval.find({
      studentId,
      status: "pending",
    })
      .populate("facultyId", "name email")
      .select(
        "activityId facultyId reviewDetails.submittedAt workflow.dueDate"
      );

    // Get activity categories breakdown
    const categoryBreakdown = await Activity.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
        },
      },
    ]);

    // Get monthly activity trends
    const monthlyTrends = await Activity.aggregate([
      { $match: { studentId: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Get achievements summary
    const achievements = await Activity.find({
      studentId,
      status: "approved",
      "achievements.0": { $exists: true },
    }).select("title achievements category startDate");

    // Get skills summary
    const skills = await Activity.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          status: "approved",
        },
      },
      { $unwind: "$skills" },
      {
        $group: {
          _id: "$skills",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Get upcoming deadlines (activities with end dates)
    const upcomingDeadlines = await Activity.find({
      studentId,
      endDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      status: { $in: ["draft", "pending"] },
    })
      .select("title endDate status category")
      .sort({ endDate: 1 })
      .limit(5);

    // Get notifications (mock data for now)
    const notifications = [
      {
        id: 1,
        type: "approval",
        title: "Activity Approved",
        message: "Your 'Machine Learning Workshop' activity has been approved",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: false,
      },
      {
        id: 2,
        type: "reminder",
        title: "Portfolio Update",
        message: "Consider updating your portfolio with recent achievements",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true,
      },
    ];

    res.json({
      success: true,
      data: {
        overview: {
          totalActivities: activityStats[0]?.totalActivities || 0,
          approvedActivities: activityStats[0]?.approvedActivities || 0,
          pendingActivities: activityStats[0]?.pendingActivities || 0,
          rejectedActivities: activityStats[0]?.rejectedActivities || 0,
          totalHours: activityStats[0]?.totalHours || 0,
          avgImpact: activityStats[0]?.avgImpact || 0,
        },
        recentActivities,
        portfolioStatus,
        pendingApprovals,
        categoryBreakdown,
        monthlyTrends: monthlyTrends.map((trend) => ({
          period: `${trend._id.year}-${trend._id.month
            .toString()
            .padStart(2, "0")}`,
          count: trend.count,
        })),
        achievements: achievements.slice(0, 5),
        skills: skills.map((skill) => ({
          name: skill._id,
          count: skill.count,
        })),
        upcomingDeadlines,
        notifications,
      },
    });
  } catch (error) {
    console.error("Get student dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student dashboard",
    });
  }
};

// Get faculty dashboard
const getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // Get faculty workload
    const workload = await FacultyApproval.aggregate([
      { $match: { facultyId: new mongoose.Types.ObjectId(facultyId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
        },
      },
    ]);

    // Get recent approvals
    const recentApprovals = await FacultyApproval.find({ facultyId })
      .populate("activityId", "title category startDate")
      .populate("studentId", "name email")
      .sort({ "reviewDetails.submittedAt": -1 })
      .limit(10);

    // Get overdue approvals
    const overdueApprovals = await FacultyApproval.find({
      facultyId,
      status: "pending",
      "workflow.dueDate": { $lt: new Date() },
    })
      .populate("activityId", "title category")
      .populate("studentId", "name email");

    // Get performance metrics
    const performance = await FacultyApproval.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(facultyId),
          "reviewDetails.submittedAt": {
            $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalApprovals: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
          avgScore: { $avg: "$scoring.overallScore" },
        },
      },
    ]);

    // Get category workload
    const categoryWorkload = await FacultyApproval.aggregate([
      { $match: { facultyId: new mongoose.Types.ObjectId(facultyId) } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        workload: workload.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            avgReviewTime: item.avgReviewTime,
          };
          return acc;
        }, {}),
        recentApprovals,
        overdueApprovals,
        performance: performance[0] || {
          totalApprovals: 0,
          approvedCount: 0,
          rejectedCount: 0,
          avgReviewTime: 0,
          avgScore: 0,
        },
        categoryWorkload,
      },
    });
  } catch (error) {
    console.error("Get faculty dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty dashboard",
    });
  }
};

// Get admin dashboard
const getAdminDashboard = async (req, res) => {
  try {
    // Get system overview
    const systemStats = {
      totalUsers: await User.countDocuments(),
      activeUsers: await User.countDocuments({ isActive: true }),
      totalStudents: await User.countDocuments({ role: "student" }),
      totalFaculty: await User.countDocuments({ role: "faculty" }),
      totalActivities: await Activity.countDocuments(),
      approvedActivities: await Activity.countDocuments({ status: "approved" }),
      pendingActivities: await Activity.countDocuments({ status: "pending" }),
      totalPortfolios: await Portfolio.countDocuments(),
      publishedPortfolios: await Portfolio.countDocuments({
        status: "published",
      }),
    };

    // Get recent activities
    const recentActivities = await Activity.find()
      .populate("studentId", "name email")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title category status createdAt studentId");

    // Get faculty performance
    const facultyPerformance = await FacultyApproval.aggregate([
      {
        $group: {
          _id: "$facultyId",
          totalApprovals: { $sum: 1 },
          completedApprovals: {
            $sum: {
              $cond: [{ $in: ["$status", ["approved", "rejected"]] }, 1, 0],
            },
          },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "faculty",
        },
      },
      { $unwind: "$faculty" },
      {
        $project: {
          facultyName: "$faculty.name",
          facultyEmail: "$faculty.email",
          totalApprovals: 1,
          completedApprovals: 1,
          avgReviewTime: 1,
          completionRate: {
            $multiply: [
              { $divide: ["$completedApprovals", "$totalApprovals"] },
              100,
            ],
          },
        },
      },
      { $sort: { totalApprovals: -1 } },
      { $limit: 10 },
    ]);

    // Get activity trends
    const activityTrends = await Activity.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Get category distribution
    const categoryDistribution = await Activity.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get system health metrics
    const systemHealth = {
      databaseStatus: "connected",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };

    res.json({
      success: true,
      data: {
        systemStats,
        recentActivities,
        facultyPerformance,
        activityTrends: activityTrends.map((trend) => ({
          period: `${trend._id.year}-${trend._id.month
            .toString()
            .padStart(2, "0")}`,
          count: trend.count,
          approved: trend.approved,
        })),
        categoryDistribution,
        systemHealth,
      },
    });
  } catch (error) {
    console.error("Get admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin dashboard",
    });
  }
};

module.exports = {
  getStudentDashboard,
  getFacultyDashboard,
  getAdminDashboard,
};
