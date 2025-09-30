const Announcement = require("../models/Announcement");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { createPaginatedResponse } = require("../middleware/pagination");

// Get all announcements with filtering and pagination
const getAnnouncements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      targetAudience,
      category,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (targetAudience) filter.targetAudience = targetAudience;
    if (category) filter.category = category;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const announcements = await Announcement.find(filter)
      .populate("author", "name email")
      .populate("lastModifiedBy", "name email")
      .populate("targetUsers", "name email")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Announcement.countDocuments(filter);

    const response = createPaginatedResponse(announcements, page, limit, total);

    res.json({
      success: true,
      message: "Announcements retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get announcement by ID
const getAnnouncementById = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findById(id)
      .populate("author", "name email")
      .populate("lastModifiedBy", "name email")
      .populate("targetUsers", "name email")
      .populate("readBy.user", "name email");

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      message: "Announcement retrieved successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const announcementData = {
      ...req.body,
      author: req.user.id,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      },
    };

    // If scheduled, set status to scheduled
    if (announcementData.isScheduled && announcementData.scheduledDate) {
      announcementData.status = "scheduled";
    } else {
      announcementData.status = "published";
      announcementData.publishedAt = new Date();
    }

    const announcement = new Announcement(announcementData);
    await announcement.save();

    await announcement.populate("author", "name email");

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update announcement
const updateAnnouncement = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user.id,
    };

    // If scheduled, set status to scheduled
    if (updateData.isScheduled && updateData.scheduledDate) {
      updateData.status = "scheduled";
    } else if (updateData.status === "published" && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const announcement = await Announcement.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("author", "name email")
      .populate("lastModifiedBy", "name email")
      .populate("targetUsers", "name email");

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete announcement
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await Announcement.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get published announcements
const getPublishedAnnouncements = async (req, res) => {
  try {
    const { audience } = req.query;
    const targetAudience = audience || "all";

    const announcements = await Announcement.findPublished(targetAudience);

    res.json({
      success: true,
      message: "Published announcements retrieved successfully",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching published announcements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get scheduled announcements
const getScheduledAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findScheduled();

    res.json({
      success: true,
      message: "Scheduled announcements retrieved successfully",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching scheduled announcements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Mark announcement as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    await announcement.markAsRead(userId);

    res.json({
      success: true,
      message: "Announcement marked as read",
    });
  } catch (error) {
    console.error("Error marking announcement as read:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get unread announcements for user
const getUnreadAnnouncements = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const query = {
      status: "published",
      isVisible: true,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } },
      ],
      $or: [
        { targetAudience: "all" },
        { targetAudience: userRole },
        { targetUsers: userId },
      ],
      "readBy.user": { $ne: userId },
    };

    const announcements = await Announcement.find(query)
      .populate("author", "name email")
      .sort({ isPinned: -1, publishedAt: -1 });

    res.json({
      success: true,
      message: "Unread announcements retrieved successfully",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching unread announcements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get announcements by priority
const getAnnouncementsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;

    const announcements = await Announcement.findByPriority(priority);

    res.json({
      success: true,
      message: `${priority} priority announcements retrieved successfully`,
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements by priority:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get announcement statistics
const getAnnouncementStatistics = async (req, res) => {
  try {
    const stats = await Announcement.aggregate([
      {
        $group: {
          _id: null,
          totalAnnouncements: { $sum: 1 },
          publishedAnnouncements: {
            $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
          },
          scheduledAnnouncements: {
            $sum: { $cond: [{ $eq: ["$status", "scheduled"] }, 1, 0] },
          },
          draftAnnouncements: {
            $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
          },
          pinnedAnnouncements: {
            $sum: { $cond: ["$isPinned", 1, 0] },
          },
          totalReads: { $sum: "$readCount" },
        },
      },
    ]);

    const priorityStats = await Announcement.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
          totalReads: { $sum: "$readCount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const categoryStats = await Announcement.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalReads: { $sum: "$readCount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const monthlyStats = await Announcement.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          reads: { $sum: "$readCount" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      message: "Announcement statistics retrieved successfully",
      data: {
        overview: stats[0] || {
          totalAnnouncements: 0,
          publishedAnnouncements: 0,
          scheduledAnnouncements: 0,
          draftAnnouncements: 0,
          pinnedAnnouncements: 0,
          totalReads: 0,
        },
        priorityDistribution: priorityStats,
        categoryDistribution: categoryStats,
        monthlyTrends: monthlyStats,
      },
    });
  } catch (error) {
    console.error("Error fetching announcement statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Process scheduled announcements (cron job)
const processScheduledAnnouncements = async (req, res) => {
  try {
    const scheduledAnnouncements = await Announcement.findScheduled();

    let processed = 0;
    for (const announcement of scheduledAnnouncements) {
      announcement.status = "published";
      announcement.publishedAt = new Date();
      await announcement.save();
      processed++;
    }

    res.json({
      success: true,
      message: `Processed ${processed} scheduled announcements`,
      data: { processed },
    });
  } catch (error) {
    console.error("Error processing scheduled announcements:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getPublishedAnnouncements,
  getScheduledAnnouncements,
  markAsRead,
  getUnreadAnnouncements,
  getAnnouncementsByPriority,
  getAnnouncementStatistics,
  processScheduledAnnouncements,
};
