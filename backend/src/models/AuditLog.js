const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      // User Management
      "user_created",
      "user_updated",
      "user_deleted",
      "user_activated",
      "user_deactivated",
      "user_role_changed",
      "user_password_reset",

      // Course Management
      "course_created",
      "course_updated",
      "course_deleted",
      "course_archived",
      "course_restored",
      "faculty_assigned_to_course",

      // Assignment Management
      "assignment_created",
      "assignment_updated",
      "assignment_deleted",
      "assignment_graded",
      "bulk_grades_uploaded",

      // Announcement Management
      "announcement_created",
      "announcement_updated",
      "announcement_deleted",
      "announcement_published",
      "announcement_unpublished",

      // System Management
      "system_settings_updated",
      "backup_created",
      "backup_restored",
      "maintenance_mode_enabled",
      "maintenance_mode_disabled",

      // Security
      "login_success",
      "login_failed",
      "logout",
      "password_changed",
      "permissions_changed",
      "security_settings_updated",

      // Content Management
      "content_uploaded",
      "content_deleted",
      "content_updated",

      // Analytics & Reports
      "report_generated",
      "analytics_accessed",
      "data_exported",
    ],
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  performedByEmail: {
    type: String,
    required: true,
  },
  performedByRole: {
    type: String,
    required: true,
    enum: ["student", "faculty", "admin", "counselor"],
  },
  targetResource: {
    type: {
      type: String,
      enum: [
        "user",
        "course",
        "assignment",
        "announcement",
        "system",
        "content",
        "analytics",
      ],
    },
    id: mongoose.Schema.Types.ObjectId,
    name: String, // Human-readable identifier
  },
  details: {
    description: {
      type: String,
      required: true,
    },
    changes: {
      before: mongoose.Schema.Types.Mixed,
      after: mongoose.Schema.Types.Mixed,
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      sessionId: String,
      requestId: String,
    },
  },
  severity: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
  },
  category: {
    type: String,
    enum: [
      "user_management",
      "course_management",
      "assignment_management",
      "announcement_management",
      "system_management",
      "security",
      "content_management",
      "analytics",
    ],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  status: {
    type: String,
    enum: ["success", "failure", "partial"],
    default: "success",
  },
  errorMessage: String,
  tags: [String], // For categorization and filtering
});

// Indexes for efficient querying
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ performedBy: 1, timestamp: -1 });
auditLogSchema.index({ action: 1, timestamp: -1 });
auditLogSchema.index({ category: 1, timestamp: -1 });
auditLogSchema.index({ severity: 1, timestamp: -1 });
auditLogSchema.index({ "targetResource.type": 1, "targetResource.id": 1 });

// Virtual for formatted timestamp
auditLogSchema.virtual("formattedTimestamp").get(function () {
  return this.timestamp.toISOString();
});

// Static method to create audit log entry
auditLogSchema.statics.createLog = async function (logData) {
  try {
    const auditLog = new this(logData);
    await auditLog.save();
    return auditLog;
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't throw error to avoid breaking the main operation
  }
};

// Static method to get audit logs with filtering
auditLogSchema.statics.getAuditLogs = async function (filters = {}) {
  const {
    startDate,
    endDate,
    action,
    performedBy,
    category,
    severity,
    targetResourceType,
    targetResourceId,
    page = 1,
    limit = 50,
  } = filters;

  const query = {};

  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  if (action) query.action = action;
  if (performedBy) query.performedBy = performedBy;
  if (category) query.category = category;
  if (severity) query.severity = severity;
  if (targetResourceType) query["targetResource.type"] = targetResourceType;
  if (targetResourceId) query["targetResource.id"] = targetResourceId;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    this.find(query)
      .populate("performedBy", "name email role")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    this.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

// Static method to get audit statistics
auditLogSchema.statics.getAuditStatistics = async function (
  startDate,
  endDate
) {
  const query = {};
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const [
    totalLogs,
    logsByAction,
    logsByCategory,
    logsBySeverity,
    logsByUser,
    recentLogs,
  ] = await Promise.all([
    this.countDocuments(query),
    this.aggregate([
      { $match: query },
      { $group: { _id: "$action", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    this.aggregate([
      { $match: query },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    this.aggregate([
      { $match: query },
      { $group: { _id: "$severity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    this.aggregate([
      { $match: query },
      { $group: { _id: "$performedBy", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]),
    this.find(query)
      .populate("performedBy", "name email role")
      .sort({ timestamp: -1 })
      .limit(5),
  ]);

  return {
    totalLogs,
    logsByAction,
    logsByCategory,
    logsBySeverity,
    logsByUser,
    recentLogs,
  };
};

module.exports = mongoose.model("AuditLog", auditLogSchema);
