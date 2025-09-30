const FacultyApproval = require("../models/FacultyApproval");
const Activity = require("../models/Activity");
const User = require("../models/User");
const mongoose = require("mongoose");

// Get faculty dashboard
const getFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { department } = req.query;

    // Build filter
    const filter = { facultyId };
    if (department) filter.department = department;

    // Get approval statistics
    const stats = await FacultyApproval.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
        },
      },
    ]);

    // Get recent activities
    const recentActivities = await FacultyApproval.find(filter)
      .populate("activityId", "title category startDate")
      .populate("studentId", "name email")
      .sort({ "reviewDetails.submittedAt": -1 })
      .limit(10);

    // Get overdue approvals
    const overdueApprovals = await FacultyApproval.find({
      ...filter,
      status: "pending",
      "workflow.dueDate": { $lt: new Date() },
    })
      .populate("activityId", "title category")
      .populate("studentId", "name email");

    // Get workload by category
    const workloadByCategory = await FacultyApproval.aggregate([
      { $match: filter },
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
        stats: stats.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            avgReviewTime: item.avgReviewTime,
          };
          return acc;
        }, {}),
        recentActivities,
        overdueApprovals,
        workloadByCategory,
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

// Get pending approvals
const getPendingApprovals = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, priority, department } = req.query;
    const facultyId = req.user.id;

    // Build filter
    const filter = { facultyId, status: "pending" };
    if (category) filter.category = category;
    if (priority) filter["reviewDetails.priority"] = priority;
    if (department) filter.department = department;

    const approvals = await FacultyApproval.find(filter)
      .populate("activityId")
      .populate("studentId", "name email")
      .sort({ "reviewDetails.submittedAt": 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await FacultyApproval.countDocuments(filter);

    res.json({
      success: true,
      data: {
        approvals,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalApprovals: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get pending approvals error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending approvals",
    });
  }
};

// Get single approval
const getApproval = async (req, res) => {
  try {
    const { approvalId } = req.params;

    const approval = await FacultyApproval.findById(approvalId)
      .populate("activityId")
      .populate("studentId", "name email")
      .populate("facultyId", "name email");

    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found",
      });
    }

    // Check if faculty can view this approval
    if (
      approval.facultyId._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view your assigned approvals",
      });
    }

    res.json({
      success: true,
      data: approval,
    });
  } catch (error) {
    console.error("Get approval error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching approval",
    });
  }
};

// Start review
const startReview = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { notes } = req.body;

    const approval = await FacultyApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found",
      });
    }

    // Check if faculty can review this approval
    if (approval.facultyId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only review your assigned approvals",
      });
    }

    // Update approval status
    approval.status = "under_review";
    approval.workflow.currentStage = "initial_review";
    approval.facultyNotes.initialReview = notes;
    approval.addHistoryEntry("review_started", req.user.id, notes);

    await approval.save();

    res.json({
      success: true,
      message: "Review started successfully",
      data: approval,
    });
  } catch (error) {
    console.error("Start review error:", error);
    res.status(500).json({
      success: false,
      message: "Error starting review",
    });
  }
};

// Approve activity
const approveActivity = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { notes, scoring, verification } = req.body;

    const approval = await FacultyApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found",
      });
    }

    // Check if faculty can approve this
    if (approval.facultyId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only approve your assigned activities",
      });
    }

    // Update approval
    approval.status = "approved";
    approval.workflow.currentStage = "completed";
    approval.workflow.completedAt = new Date();
    approval.facultyNotes.detailedReview = notes;
    approval.scoring = scoring;
    approval.verification = verification;
    approval.reviewDetails.reviewedAt = new Date();
    approval.calculateReviewDuration();
    approval.addHistoryEntry("approved", req.user.id, notes);

    await approval.save();

    // Update activity status
    const activity = await Activity.findById(approval.activityId);
    if (activity) {
      activity.status = "approved";
      activity.approval.approvedBy = req.user.id;
      activity.approval.approvedAt = new Date();
      activity.approval.reviewNotes = notes;
      activity.verification = verification;
      await activity.save();
    }

    res.json({
      success: true,
      message: "Activity approved successfully",
      data: approval,
    });
  } catch (error) {
    console.error("Approve activity error:", error);
    res.status(500).json({
      success: false,
      message: "Error approving activity",
    });
  }
};

// Reject activity
const rejectActivity = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required",
      });
    }

    const approval = await FacultyApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found",
      });
    }

    // Check if faculty can reject this
    if (approval.facultyId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only reject your assigned activities",
      });
    }

    // Update approval
    approval.status = "rejected";
    approval.workflow.currentStage = "completed";
    approval.workflow.completedAt = new Date();
    approval.facultyNotes.detailedReview = notes;
    approval.approval.rejectionReason = reason;
    approval.reviewDetails.reviewedAt = new Date();
    approval.calculateReviewDuration();
    approval.addHistoryEntry("rejected", req.user.id, `Rejected: ${reason}`);

    await approval.save();

    // Update activity status
    const activity = await Activity.findById(approval.activityId);
    if (activity) {
      activity.status = "rejected";
      activity.approval.rejectedBy = req.user.id;
      activity.approval.rejectedAt = new Date();
      activity.approval.rejectionReason = reason;
      await activity.save();
    }

    res.json({
      success: true,
      message: "Activity rejected successfully",
      data: approval,
    });
  } catch (error) {
    console.error("Reject activity error:", error);
    res.status(500).json({
      success: false,
      message: "Error rejecting activity",
    });
  }
};

// Request changes
const requestChanges = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { changes, notes } = req.body;

    if (!changes) {
      return res.status(400).json({
        success: false,
        message: "Change requests are required",
      });
    }

    const approval = await FacultyApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found",
      });
    }

    // Check if faculty can request changes
    if (approval.facultyId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only request changes for your assigned activities",
      });
    }

    // Update approval
    approval.status = "requires_changes";
    approval.workflow.currentStage = "detailed_review";
    approval.facultyNotes.suggestions = changes;
    approval.facultyNotes.detailedReview = notes;
    approval.addHistoryEntry(
      "returned_for_changes",
      req.user.id,
      `Changes requested: ${changes}`
    );

    await approval.save();

    // Update activity status
    const activity = await Activity.findById(approval.activityId);
    if (activity) {
      activity.status = "draft";
      activity.approval.reviewNotes = notes;
      await activity.save();
    }

    res.json({
      success: true,
      message: "Change request sent successfully",
      data: approval,
    });
  } catch (error) {
    console.error("Request changes error:", error);
    res.status(500).json({
      success: false,
      message: "Error requesting changes",
    });
  }
};

// Get faculty workload
const getFacultyWorkload = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { period = "month" } = req.query;

    let startDate;
    const endDate = new Date();

    switch (period) {
      case "week":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const workload = await FacultyApproval.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(facultyId),
          "reviewDetails.submittedAt": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalApprovals: { $sum: 1 },
          completedApprovals: {
            $sum: {
              $cond: [{ $in: ["$status", ["approved", "rejected"]] }, 1, 0],
            },
          },
          pendingApprovals: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
          totalReviewTime: { $sum: "$reviewDetails.reviewDuration" },
        },
      },
    ]);

    const categoryWorkload = await FacultyApproval.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(facultyId),
          "reviewDetails.submittedAt": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgTime: { $avg: "$reviewDetails.reviewDuration" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        overview: workload[0] || {
          totalApprovals: 0,
          completedApprovals: 0,
          pendingApprovals: 0,
          avgReviewTime: 0,
          totalReviewTime: 0,
        },
        categoryBreakdown: categoryWorkload,
        period,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Get faculty workload error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty workload",
    });
  }
};

// Assign approval to faculty
const assignApproval = async (req, res) => {
  try {
    const { approvalId } = req.params;
    const { facultyId, dueDate, priority = "medium" } = req.body;

    if (!facultyId) {
      return res.status(400).json({
        success: false,
        message: "Faculty ID is required",
      });
    }

    // Check if faculty exists and has faculty role
    const faculty = await User.findById(facultyId);
    if (!faculty || faculty.role !== "faculty") {
      return res.status(400).json({
        success: false,
        message: "Invalid faculty member",
      });
    }

    const approval = await FacultyApproval.findById(approvalId);
    if (!approval) {
      return res.status(404).json({
        success: false,
        message: "Approval not found",
      });
    }

    // Update approval assignment
    approval.facultyId = facultyId;
    approval.workflow.assignedTo = facultyId;
    approval.workflow.dueDate = dueDate ? new Date(dueDate) : null;
    approval.reviewDetails.priority = priority;
    approval.addHistoryEntry(
      "assigned",
      req.user.id,
      `Assigned to ${faculty.name}`
    );

    await approval.save();

    res.json({
      success: true,
      message: "Approval assigned successfully",
      data: approval,
    });
  } catch (error) {
    console.error("Assign approval error:", error);
    res.status(500).json({
      success: false,
      message: "Error assigning approval",
    });
  }
};

// Get faculty performance
const getFacultyPerformance = async (req, res) => {
  try {
    const { facultyId, period = "month" } = req.query;
    const targetFacultyId = facultyId || req.user.id;

    let startDate;
    const endDate = new Date();

    switch (period) {
      case "week":
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "month":
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "quarter":
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const performance = await FacultyApproval.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(targetFacultyId),
          "reviewDetails.submittedAt": { $gte: startDate, $lte: endDate },
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

    const dailyPerformance = await FacultyApproval.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(targetFacultyId),
          "reviewDetails.submittedAt": { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$reviewDetails.submittedAt",
            },
          },
          approvals: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $in: ["$status", ["approved", "rejected"]] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: performance[0] || {
          totalApprovals: 0,
          approvedCount: 0,
          rejectedCount: 0,
          avgReviewTime: 0,
          avgScore: 0,
        },
        dailyPerformance,
        period,
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Get faculty performance error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty performance",
    });
  }
};

module.exports = {
  getFacultyDashboard,
  getPendingApprovals,
  getApproval,
  startReview,
  approveActivity,
  rejectActivity,
  requestChanges,
  getFacultyWorkload,
  assignApproval,
  getFacultyPerformance,
};
