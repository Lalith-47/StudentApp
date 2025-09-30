const AuditLog = require("../models/AuditLog");

// Audit middleware factory
const createAuditMiddleware = (action, category, severity = "medium") => {
  return (req, res, next) => {
    // Store original response methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Override response methods to capture response data
    res.json = function (data) {
      // Log the audit entry after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logAuditEntry(req, res, action, category, severity, data);
      }
      return originalJson.call(this, data);
    };

    res.send = function (data) {
      // Log the audit entry after successful response
      if (res.statusCode >= 200 && res.statusCode < 300) {
        logAuditEntry(req, res, action, category, severity, data);
      }
      return originalSend.call(this, data);
    };

    next();
  };
};

// Function to log audit entry
const logAuditEntry = async (
  req,
  res,
  action,
  category,
  severity,
  responseData
) => {
  try {
    if (!req.user) return; // Skip if no authenticated user

    const auditData = {
      action,
      performedBy: req.user.id,
      performedByEmail: req.user.email,
      performedByRole: req.user.role,
      category,
      severity,
      details: {
        description: generateDescription(req, action, responseData),
        changes: extractChanges(req, action),
        metadata: {
          ipAddress: req.ip || req.connection.remoteAddress,
          userAgent: req.get("User-Agent"),
          sessionId: req.sessionID,
          requestId: req.id,
        },
      },
      timestamp: new Date(),
    };

    // Extract target resource information
    const targetResource = extractTargetResource(req, responseData);
    if (targetResource) {
      auditData.targetResource = targetResource;
    }

    // Add tags for better categorization
    auditData.tags = generateTags(req, action, category);

    await AuditLog.createLog(auditData);
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't throw error to avoid breaking the main operation
  }
};

// Generate description for audit log
const generateDescription = (req, action, responseData) => {
  const userEmail = req.user.email;
  const resourceType = extractResourceType(req);

  switch (action) {
    case "user_created":
      return `User created: ${responseData?.data?.user?.email || "Unknown"}`;
    case "user_updated":
      return `User updated: ${
        req.params.userId || responseData?.data?.user?.email || "Unknown"
      }`;
    case "user_deleted":
      return `User deleted: ${req.params.userId || "Unknown"}`;
    case "course_created":
      return `Course created: ${
        responseData?.data?.course?.title || "Unknown"
      }`;
    case "course_updated":
      return `Course updated: ${
        req.params.courseId || responseData?.data?.course?.title || "Unknown"
      }`;
    case "assignment_created":
      return `Assignment created: ${
        responseData?.data?.assignment?.title || "Unknown"
      }`;
    case "announcement_created":
      return `Announcement created: ${
        responseData?.data?.announcement?.title || "Unknown"
      }`;
    case "system_settings_updated":
      return `System settings updated`;
    case "bulk_grades_uploaded":
      return `Bulk grades uploaded: ${
        responseData?.data?.gradedCount || 0
      } submissions`;
    default:
      return `${action.replace(/_/g, " ")} performed on ${resourceType}`;
  }
};

// Extract changes from request
const extractChanges = (req, action) => {
  if (
    !["user_updated", "course_updated", "assignment_updated"].includes(action)
  ) {
    return null;
  }

  // For updates, we would need to store the "before" state
  // This is a simplified version - in production, you might want to
  // store the original state in a temporary cache or database
  return {
    after: req.body,
    before: null, // Would need to be populated from stored state
  };
};

// Extract target resource information
const extractTargetResource = (req, responseData) => {
  const resourceId =
    req.params.userId ||
    req.params.courseId ||
    req.params.assignmentId ||
    req.params.announcementId;

  if (!resourceId) return null;

  let resourceType = "unknown";
  let resourceName = "Unknown";

  if (req.params.userId) {
    resourceType = "user";
    resourceName =
      responseData?.data?.user?.name ||
      responseData?.data?.user?.email ||
      "User";
  } else if (req.params.courseId) {
    resourceType = "course";
    resourceName =
      responseData?.data?.course?.title ||
      responseData?.data?.course?.code ||
      "Course";
  } else if (req.params.assignmentId) {
    resourceType = "assignment";
    resourceName = responseData?.data?.assignment?.title || "Assignment";
  } else if (req.params.announcementId) {
    resourceType = "announcement";
    resourceName = responseData?.data?.announcement?.title || "Announcement";
  }

  return {
    type: resourceType,
    id: resourceId,
    name: resourceName,
  };
};

// Extract resource type from request
const extractResourceType = (req) => {
  if (req.params.userId) return "user";
  if (req.params.courseId) return "course";
  if (req.params.assignmentId) return "assignment";
  if (req.params.announcementId) return "announcement";
  if (req.originalUrl.includes("/users")) return "user";
  if (req.originalUrl.includes("/courses")) return "course";
  if (req.originalUrl.includes("/assignments")) return "assignment";
  if (req.originalUrl.includes("/announcements")) return "announcement";
  return "system";
};

// Generate tags for audit log
const generateTags = (req, action, category) => {
  const tags = [category, req.user.role];

  if (req.originalUrl.includes("/admin")) {
    tags.push("admin-operation");
  }

  if (
    ["user_deleted", "course_deleted", "assignment_deleted"].includes(action)
  ) {
    tags.push("destructive-operation");
  }

  if (action.includes("bulk")) {
    tags.push("bulk-operation");
  }

  return tags;
};

// Specific audit middlewares for common actions
const auditUserManagement = createAuditMiddleware(
  "user_updated",
  "user_management",
  "high"
);
const auditCourseManagement = createAuditMiddleware(
  "course_updated",
  "course_management",
  "medium"
);
const auditAssignmentManagement = createAuditMiddleware(
  "assignment_updated",
  "assignment_management",
  "medium"
);
const auditSystemManagement = createAuditMiddleware(
  "system_settings_updated",
  "system_management",
  "critical"
);

// Admin-specific audit middleware
const auditAdminAction = (action, category, severity = "medium") => {
  return (req, res, next) => {
    // Check if user is admin
    if (req.user && req.user.role !== "admin") {
      return next(); // Skip audit for non-admin users
    }

    return createAuditMiddleware(action, category, severity)(req, res, next);
  };
};

module.exports = {
  createAuditMiddleware,
  auditUserManagement,
  auditCourseManagement,
  auditAssignmentManagement,
  auditSystemManagement,
  auditAdminAction,
};
