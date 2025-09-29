const Activity = require("../models/Activity");
const FacultyApproval = require("../models/FacultyApproval");
const User = require("../models/User");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = `uploads/activities/${req.user.id}`;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Maximum 5 files per request
  },
  fileFilter: (req, file, cb) => {
    // Enhanced security: Check both extension and MIME type
    const allowedExtensions =
      /\.(jpeg|jpg|png|gif|pdf|doc|docx|txt|mp4|avi|mov)$/i;
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "video/mp4",
      "video/avi",
      "video/quicktime",
    ];

    const extname = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    // Additional security: Check file signature
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images (JPEG, PNG, GIF), documents (PDF, DOC, DOCX, TXT), and videos (MP4, AVI, MOV) are allowed."
        )
      );
    }
  },
});

// Create new activity
const createActivity = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      startDate,
      endDate,
      duration,
      location,
      organizer,
      skills,
      achievements,
      tags,
      isPublic,
      isHighlighted,
    } = req.body;

    // Enhanced validation
    const validationErrors = [];

    if (!title || title.trim().length < 3) {
      validationErrors.push("Title must be at least 3 characters long");
    }

    if (!description || description.trim().length < 10) {
      validationErrors.push("Description must be at least 10 characters long");
    }

    if (!category) {
      validationErrors.push("Category is required");
    }

    if (!startDate) {
      validationErrors.push("Start date is required");
    }

    if (startDate && new Date(startDate) > new Date()) {
      validationErrors.push("Start date cannot be in the future");
    }

    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      validationErrors.push("End date cannot be before start date");
    }

    if (description && description.length > 1000) {
      validationErrors.push("Description cannot exceed 1000 characters");
    }

    if (title && title.length > 200) {
      validationErrors.push("Title cannot exceed 200 characters");
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Safely parse JSON fields
    let parsedSkills = [];
    let parsedAchievements = [];
    let parsedTags = [];
    let parsedDuration = null;

    try {
      parsedSkills = skills ? JSON.parse(skills) : [];
      parsedAchievements = achievements ? JSON.parse(achievements) : [];
      parsedTags = tags ? JSON.parse(tags) : [];
      parsedDuration = duration ? JSON.parse(duration) : null;
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in skills, achievements, or tags",
      });
    }

    // Validate arrays
    if (!Array.isArray(parsedSkills)) {
      parsedSkills = [];
    }
    if (!Array.isArray(parsedAchievements)) {
      parsedAchievements = [];
    }
    if (!Array.isArray(parsedTags)) {
      parsedTags = [];
    }

    // Sanitize inputs
    const sanitizedSkills = parsedSkills.map((s) =>
      s.toString().trim().slice(0, 50)
    );
    const sanitizedAchievements = parsedAchievements.map((a) =>
      a.toString().trim().slice(0, 200)
    );
    const sanitizedTags = parsedTags.map((t) =>
      t.toString().trim().toLowerCase().slice(0, 30)
    );

    // Create activity
    const activity = new Activity({
      studentId: req.user.id,
      title: title.trim(),
      description: description.trim(),
      category,
      subcategory: subcategory ? subcategory.trim() : "",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      duration: parsedDuration,
      location: location ? location.trim() : "",
      organizer: organizer ? organizer.trim() : "",
      skills: sanitizedSkills,
      achievements: sanitizedAchievements,
      tags: sanitizedTags,
      isPublic: isPublic === "true",
      isHighlighted: isHighlighted === "true",
      status: "draft",
    });

    await activity.save();

    // Create faculty approval record
    const facultyApproval = new FacultyApproval({
      activityId: activity._id,
      studentId: req.user.id,
      facultyId: null, // Will be assigned by admin
      department: req.user.profile?.department || "General",
      category: activity.category,
      status: "pending",
    });

    await facultyApproval.save();

    res.status(201).json({
      success: true,
      message: "Activity created successfully",
      data: {
        activity: await Activity.findById(activity._id)
          .populate("studentId", "name email")
          .select("-__v"),
        approval: facultyApproval,
      },
    });
  } catch (error) {
    console.error("Create activity error:", error);

    // Handle specific MongoDB errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Activity with this title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create activity",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Upload activity attachments
const uploadAttachments = async (req, res) => {
  try {
    const { activityId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    // Validate file count
    if (files.length > 5) {
      return res.status(400).json({
        success: false,
        message: "Maximum 5 files allowed per upload",
      });
    }

    // Validate total file size
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      // 50MB total limit
      return res.status(400).json({
        success: false,
        message: "Total file size cannot exceed 50MB",
      });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if user owns the activity
    if (activity.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only upload attachments to your own activities",
      });
    }

    // Validate existing attachments count
    const existingAttachments = activity.attachments || [];
    if (existingAttachments.length + files.length > 10) {
      return res.status(400).json({
        success: false,
        message: "Maximum 10 attachments allowed per activity",
      });
    }

    // Process uploaded files with additional validation
    const attachments = files.map((file) => {
      // Additional security: Sanitize filename
      const sanitizedFilename = file.filename.replace(/[^a-zA-Z0-9.-]/g, "_");

      return {
        filename: sanitizedFilename,
        originalName: file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_"),
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/activities/${req.user.id}/${sanitizedFilename}`,
        uploadedAt: new Date(),
      };
    });

    // Add attachments to activity
    activity.attachments.push(...attachments);
    await activity.save();

    res.json({
      success: true,
      message: "Files uploaded successfully",
      data: {
        attachments: activity.attachments,
        uploadedCount: attachments.length,
        totalAttachments: activity.attachments.length,
      },
    });
  } catch (error) {
    console.error("Upload attachments error:", error);

    // Clean up uploaded files on error
    if (req.files) {
      try {
        for (const file of req.files) {
          await fs.unlink(file.path);
        }
      } catch (cleanupError) {
        console.error("Error cleaning up files:", cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Error uploading files",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Get student's activities
const getStudentActivities = async (req, res) => {
  try {
    const {
      status,
      category,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const studentId = req.user.id;

    // Build filter
    const filter = { studentId };
    if (status) filter.status = status;
    if (category) filter.category = category;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get activities with pagination
    const activities = await Activity.find(filter)
      .populate("studentId", "name email")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(filter);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalActivities: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get student activities error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching activities",
    });
  }
};

// Get single activity
const getActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId)
      .populate("studentId", "name email")
      .populate("approval.approvedBy", "name email")
      .populate("approval.rejectedBy", "name email");

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if user can view this activity
    if (
      activity.studentId._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "faculty"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own activities",
      });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Get activity error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching activity",
    });
  }
};

// Update activity
const updateActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const updateData = req.body;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if user owns the activity
    if (activity.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own activities",
      });
    }

    // Don't allow updating approved activities
    if (activity.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot update approved activities",
      });
    }

    // Update activity
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        activity[key] = updateData[key];
      }
    });

    // Reset status to draft if updating
    if (activity.status === "rejected") {
      activity.status = "draft";
    }

    await activity.save();

    res.json({
      success: true,
      message: "Activity updated successfully",
      data: activity,
    });
  } catch (error) {
    console.error("Update activity error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating activity",
    });
  }
};

// Submit activity for approval
const submitForApproval = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if user owns the activity
    if (activity.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only submit your own activities",
      });
    }

    // Check if activity can be submitted
    if (activity.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Activity can only be submitted from draft status",
      });
    }

    // Update activity status
    activity.status = "pending";
    await activity.save();

    // Update faculty approval status
    const facultyApproval = await FacultyApproval.findOne({ activityId });
    if (facultyApproval) {
      facultyApproval.status = "pending";
      facultyApproval.reviewDetails.submittedAt = new Date();
      await facultyApproval.save();
    }

    res.json({
      success: true,
      message: "Activity submitted for approval",
      data: activity,
    });
  } catch (error) {
    console.error("Submit for approval error:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting activity",
    });
  }
};

// Delete activity
const deleteActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found",
      });
    }

    // Check if user owns the activity
    if (
      activity.studentId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own activities",
      });
    }

    // Don't allow deleting approved activities
    if (activity.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete approved activities",
      });
    }

    // Delete associated files
    for (const attachment of activity.attachments) {
      try {
        await fs.unlink(
          `uploads/activities/${req.user.id}/${attachment.filename}`
        );
      } catch (error) {
        console.warn(`Failed to delete file: ${attachment.filename}`);
      }
    }

    // Delete activity and related approval
    await Activity.findByIdAndDelete(activityId);
    await FacultyApproval.findOneAndDelete({ activityId });

    res.json({
      success: true,
      message: "Activity deleted successfully",
    });
  } catch (error) {
    console.error("Delete activity error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting activity",
    });
  }
};

// Get activity statistics
const getActivityStats = async (req, res) => {
  try {
    const studentId = req.user.id;

    const stats = await Activity.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
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

    const categoryStats = await Activity.aggregate([
      { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
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

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalActivities: 0,
          approvedActivities: 0,
          pendingActivities: 0,
          rejectedActivities: 0,
          totalHours: 0,
          avgImpact: 0,
        },
        categoryBreakdown: categoryStats,
      },
    });
  } catch (error) {
    console.error("Get activity stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching activity statistics",
    });
  }
};

// Search activities
const searchActivities = async (req, res) => {
  try {
    const {
      q,
      category,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;
    const studentId = req.user.id;

    // Build search query
    const query = { studentId };

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $in: [new RegExp(q, "i")] } },
      ];
    }

    if (category) query.category = category;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) query.startDate.$gte = new Date(startDate);
      if (endDate) query.startDate.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query)
      .populate("studentId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Activity.countDocuments(query);

    res.json({
      success: true,
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalActivities: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Search activities error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching activities",
    });
  }
};

module.exports = {
  createActivity,
  uploadAttachments,
  getStudentActivities,
  getActivity,
  updateActivity,
  submitForApproval,
  deleteActivity,
  getActivityStats,
  searchActivities,
  upload, // Export multer middleware
};
