const { body, param, query, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const xss = require("xss");

// XSS Protection middleware
const sanitizeInput = (req, res, next) => {
  // Sanitize string fields in body
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    });
  }

  // Sanitize string fields in query
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === "string") {
        req.query[key] = xss(req.query[key]);
      }
    });
  }

  next();
};

// Custom validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Course validation rules
const validateCourse = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Course title must be between 3 and 200 characters"),

  body("code")
    .trim()
    .matches(/^[A-Z]{2,4}[0-9]{3,4}$/)
    .withMessage(
      "Course code must be in format: ABC123 (2-4 letters, 3-4 numbers)"
    ),

  body("description")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Description must be between 10 and 2000 characters"),

  body("credits")
    .isInt({ min: 1, max: 10 })
    .withMessage("Credits must be between 1 and 10"),

  body("department")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Department must be between 2 and 100 characters"),

  body("semester")
    .isIn(["Fall", "Spring", "Summer", "Winter"])
    .withMessage("Semester must be one of: Fall, Spring, Summer, Winter"),

  body("academicYear")
    .matches(/^\d{4}-\d{4}$/)
    .withMessage("Academic year must be in format: YYYY-YYYY"),

  body("schedule.startTime")
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),

  body("schedule.endTime")
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),

  body("schedule.days")
    .optional()
    .isArray()
    .withMessage("Schedule days must be an array"),

  body("schedule.days.*")
    .optional()
    .isIn([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .withMessage("Invalid day of week"),

  validateRequest,
];

// Assignment validation rules
const validateAssignment = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Assignment title must be between 3 and 200 characters"),

  body("description")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("courseId").isMongoId().withMessage("Invalid course ID"),

  body("type")
    .isIn(["assignment", "quiz", "exam", "project", "homework", "lab"])
    .withMessage("Invalid assignment type"),

  body("dueDate")
    .isISO8601()
    .withMessage("Due date must be a valid ISO 8601 date"),

  body("availableFrom")
    .optional()
    .isISO8601()
    .withMessage("Available from must be a valid ISO 8601 date"),

  body("timeLimit")
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage("Time limit must be between 1 and 480 minutes"),

  body("attempts")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Attempts must be between 1 and 10"),

  body("settings.latePenalty")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Late penalty must be between 0 and 100"),

  body("settings.maxFileSize")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Max file size must be between 1 and 100 MB"),

  body("rubric.totalPoints")
    .isInt({ min: 1 })
    .withMessage("Total points must be at least 1"),

  body("rubric.criteria")
    .isArray({ min: 1 })
    .withMessage("At least one rubric criteria is required"),

  body("rubric.criteria.*.name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Criteria name must be between 1 and 100 characters"),

  body("rubric.criteria.*.points")
    .isInt({ min: 0 })
    .withMessage("Criteria points must be non-negative"),

  validateRequest,
];

// Attendance validation rules
const validateAttendanceSession = [
  body("courseId").isMongoId().withMessage("Invalid course ID"),

  body("date").isISO8601().withMessage("Date must be a valid ISO 8601 date"),

  body("classNumber")
    .isInt({ min: 1, max: 100 })
    .withMessage("Class number must be between 1 and 100"),

  body("topic")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Topic must be between 1 and 200 characters"),

  body("location")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Location must be between 1 and 100 characters"),

  body("duration")
    .optional()
    .isInt({ min: 30, max: 180 })
    .withMessage("Duration must be between 30 and 180 minutes"),

  validateRequest,
];

// Grade validation rules
const validateGrade = [
  body("score").isFloat({ min: 0 }).withMessage("Score must be non-negative"),

  body("feedback")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Feedback must not exceed 1000 characters"),

  validateRequest,
];

// Announcement validation rules
const validateAnnouncement = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("content")
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage("Content must be between 10 and 5000 characters"),

  body("courseId").optional().isMongoId().withMessage("Invalid course ID"),

  body("targetAudience")
    .isIn([
      "all",
      "students",
      "faculty",
      "specific-course",
      "specific-students",
    ])
    .withMessage("Invalid target audience"),

  body("priority")
    .optional()
    .isIn(["low", "normal", "high", "urgent"])
    .withMessage("Invalid priority level"),

  body("type")
    .optional()
    .isIn(["general", "assignment", "exam", "course", "system", "emergency"])
    .withMessage("Invalid announcement type"),

  body("schedule.publishAt")
    .optional()
    .isISO8601()
    .withMessage("Publish date must be a valid ISO 8601 date"),

  body("schedule.expiresAt")
    .optional()
    .isISO8601()
    .withMessage("Expiration date must be a valid ISO 8601 date"),

  validateRequest,
];

// Content validation rules
const validateContent = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Description must be between 1 and 2000 characters"),

  body("type")
    .isIn([
      "document",
      "presentation",
      "video",
      "audio",
      "image",
      "link",
      "folder",
    ])
    .withMessage("Invalid content type"),

  body("category")
    .isIn([
      "lecture",
      "assignment",
      "reference",
      "multimedia",
      "resource",
      "other",
    ])
    .withMessage("Invalid content category"),

  body("courseId").optional().isMongoId().withMessage("Invalid course ID"),

  body("access.isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),

  body("access.requiresLogin")
    .optional()
    .isBoolean()
    .withMessage("requiresLogin must be a boolean"),

  body("access.expirationDate")
    .optional()
    .isISO8601()
    .withMessage("Expiration date must be a valid ISO 8601 date"),

  validateRequest,
];

// Bulk message validation rules
const validateBulkMessage = [
  body("recipients")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Recipients must be an array with 1-1000 items"),

  body("recipients.*").isMongoId().withMessage("Invalid recipient ID"),

  body("subject")
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Subject must be between 3 and 200 characters"),

  body("message")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),

  body("priority")
    .optional()
    .isIn(["low", "normal", "high", "urgent"])
    .withMessage("Invalid priority level"),

  validateRequest,
];

// Parameter validation
const validateObjectId = (paramName) => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName}`),
  validateRequest,
];

// Query validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  validateRequest,
];

// Date range validation
const validateDateRange = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  validateRequest,
];

// File validation middleware
const validateFileUpload = (allowedTypes, maxSize = 10 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    for (const file of req.files) {
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File ${file.originalname} exceeds maximum size of ${
            maxSize / (1024 * 1024)
          }MB`,
        });
      }

      // Check file type
      const fileExtension = file.originalname.split(".").pop().toLowerCase();
      if (!allowedTypes.includes(fileExtension)) {
        return res.status(400).json({
          success: false,
          message: `File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(
            ", "
          )}`,
        });
      }

      // Check MIME type
      const allowedMimeTypes = {
        pdf: "application/pdf",
        doc: "application/msword",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ppt: "application/vnd.ms-powerpoint",
        pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        xls: "application/vnd.ms-excel",
        xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        mp4: "video/mp4",
        avi: "video/x-msvideo",
        mov: "video/quicktime",
        zip: "application/zip",
        txt: "text/plain",
      };

      if (
        allowedMimeTypes[fileExtension] &&
        file.mimetype !== allowedMimeTypes[fileExtension]
      ) {
        return res.status(400).json({
          success: false,
          message: `File ${file.originalname} has invalid MIME type`,
        });
      }
    }

    next();
  };
};

// Query parameters validation
const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "title", "status"])
    .withMessage("Invalid sort field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be 'asc' or 'desc'"),
  query("status")
    .optional()
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Invalid status filter"),
  query("type")
    .optional()
    .isIn([
      "workshop",
      "certification",
      "volunteering",
      "competition",
      "internship",
    ])
    .withMessage("Invalid activity type"),
  validateRequest,
];

// User validation
const validateUser = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("role")
    .isIn(["student", "faculty", "admin", "mentor", "counselor"])
    .withMessage("Invalid role specified"),
  body("profile")
    .optional()
    .isObject()
    .withMessage("Profile must be an object"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
  validateRequest,
];

// Rate limiting validation
const validateRateLimit = (req, res, next) => {
  // This would typically integrate with a rate limiting library like express-rate-limit
  // For now, we'll implement basic rate limiting logic
  const key = `rate_limit_${req.user?.id || req.ip}`;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  // This is a simplified implementation - in production, use Redis or similar
  if (!req.rateLimitStore) {
    req.rateLimitStore = new Map();
  }

  const userRequests = req.rateLimitStore.get(key) || [];
  const recentRequests = userRequests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
      retryAfter: Math.ceil(windowMs / 1000),
    });
  }

  recentRequests.push(now);
  req.rateLimitStore.set(key, recentRequests);
  next();
};

module.exports = {
  sanitizeInput,
  validateRequest,
  validateUser,
  validateCourse,
  validateAssignment,
  validateAttendanceSession,
  validateGrade,
  validateAnnouncement,
  validateContent,
  validateBulkMessage,
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateFileUpload,
  validateQueryParams,
  validateRateLimit,
};
