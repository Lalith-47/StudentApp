const { body, param, query, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// Custom validation functions
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

const isValidDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

const isValidFutureDate = (value) => {
  const date = new Date(value);
  return date > new Date();
};

const isValidPastDate = (value) => {
  const date = new Date(value);
  return date < new Date();
};

const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return true;
  return new Date(startDate) <= new Date(endDate);
};

const isValidFileType = (allowedTypes) => {
  return (value) => {
    if (!value) return true;
    const fileExtension = value.split(".").pop().toLowerCase();
    return allowedTypes.includes(fileExtension);
  };
};

const isValidJSON = (value) => {
  if (!value) return true;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

const isValidArray = (value) => {
  if (!value) return true;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
};

const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const isValidPassword = (value) => {
  // At least 6 characters, contains at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(value);
};

const isValidRole = (value) => {
  const allowedRoles = ["student", "faculty", "admin", "mentor", "counselor"];
  return allowedRoles.includes(value);
};

const isValidActivityCategory = (value) => {
  const allowedCategories = [
    "academic",
    "extracurricular",
    "volunteering",
    "internship",
    "leadership",
    "certification",
    "seminar",
    "conference",
    "workshop",
    "competition",
    "research",
    "project",
    "sports",
    "cultural",
    "other",
  ];
  return allowedCategories.includes(value);
};

const isValidActivityStatus = (value) => {
  const allowedStatuses = [
    "draft",
    "pending",
    "approved",
    "rejected",
    "under_review",
  ];
  return allowedStatuses.includes(value);
};

const isValidPortfolioStatus = (value) => {
  const allowedStatuses = ["draft", "published", "archived"];
  return allowedStatuses.includes(value);
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
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

// Activity validation rules
const validateActivity = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters")
    .trim(),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters")
    .trim(),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .custom(isValidActivityCategory)
    .withMessage("Invalid activity category"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .custom(isValidDate)
    .withMessage("Invalid start date format")
    .custom((value) => !isValidFutureDate(value))
    .withMessage("Start date cannot be in the future"),

  body("endDate")
    .optional()
    .custom(isValidDate)
    .withMessage("Invalid end date format")
    .custom((value, { req }) => {
      if (value && req.body.startDate) {
        return isValidDateRange(req.body.startDate, value);
      }
      return true;
    })
    .withMessage("End date cannot be before start date"),

  body("location")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Location cannot exceed 100 characters")
    .trim(),

  body("organizer")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Organizer cannot exceed 100 characters")
    .trim(),

  body("skills")
    .optional()
    .custom(isValidJSON)
    .withMessage("Skills must be valid JSON")
    .custom((value) => {
      if (!value) return true;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) && parsed.length <= 10;
      } catch {
        return false;
      }
    })
    .withMessage("Skills must be an array with maximum 10 items"),

  body("achievements")
    .optional()
    .custom(isValidJSON)
    .withMessage("Achievements must be valid JSON")
    .custom((value) => {
      if (!value) return true;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) && parsed.length <= 10;
      } catch {
        return false;
      }
    })
    .withMessage("Achievements must be an array with maximum 10 items"),

  body("tags")
    .optional()
    .custom(isValidJSON)
    .withMessage("Tags must be valid JSON")
    .custom((value) => {
      if (!value) return true;
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) && parsed.length <= 5;
      } catch {
        return false;
      }
    })
    .withMessage("Tags must be an array with maximum 5 items"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean value"),

  body("isHighlighted")
    .optional()
    .isBoolean()
    .withMessage("isHighlighted must be a boolean value"),

  handleValidationErrors,
];

// User validation rules
const validateUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters")
    .trim(),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .custom(isValidEmail)
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(isValidPassword)
    .withMessage("Password must contain at least one letter and one number"),

  body("role").optional().custom(isValidRole).withMessage("Invalid user role"),

  handleValidationErrors,
];

// Login validation rules
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .custom(isValidEmail)
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  body("role").optional().custom(isValidRole).withMessage("Invalid user role"),

  handleValidationErrors,
];

// Portfolio validation rules
const validatePortfolio = [
  body("personalInfo.fullName")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters")
    .trim(),

  body("personalInfo.email")
    .optional()
    .custom(isValidEmail)
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("personalInfo.bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters")
    .trim(),

  body("academicInfo.currentInstitution.name")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Institution name cannot exceed 100 characters")
    .trim(),

  body("academicInfo.currentInstitution.course")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Course name cannot exceed 100 characters")
    .trim(),

  body("career.objective")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Career objective cannot exceed 1000 characters")
    .trim(),

  body("status")
    .optional()
    .custom(isValidPortfolioStatus)
    .withMessage("Invalid portfolio status"),

  handleValidationErrors,
];

// Faculty approval validation rules
const validateFacultyApproval = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .custom(isValidActivityStatus)
    .withMessage("Invalid approval status"),

  body("feedback")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Feedback cannot exceed 500 characters")
    .trim(),

  body("approvedCredits")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Approved credits must be between 0 and 100"),

  handleValidationErrors,
];

// Query parameter validation
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
    .isIn(["createdAt", "updatedAt", "title", "startDate", "endDate"])
    .withMessage("Invalid sort field"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),

  handleValidationErrors,
];

// ObjectId parameter validation
const validateObjectId = [
  param("id")
    .notEmpty()
    .withMessage("ID is required")
    .custom(isValidObjectId)
    .withMessage("Invalid ID format"),

  handleValidationErrors,
];

// File upload validation
const validateFileUpload = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No files uploaded",
    });
  }

  // Check file count
  if (req.files.length > 5) {
    return res.status(400).json({
      success: false,
      message: "Maximum 5 files allowed per upload",
    });
  }

  // Check total file size
  const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > 50 * 1024 * 1024) {
    // 50MB
    return res.status(400).json({
      success: false,
      message: "Total file size cannot exceed 50MB",
    });
  }

  // Check individual file sizes
  for (const file of req.files) {
    if (file.size > 10 * 1024 * 1024) {
      // 10MB per file
      return res.status(400).json({
        success: false,
        message: "Individual file size cannot exceed 10MB",
      });
    }
  }

  next();
};

module.exports = {
  validateActivity,
  validateUser,
  validateLogin,
  validatePortfolio,
  validateFacultyApproval,
  validateQueryParams,
  validateObjectId,
  validateFileUpload,
  handleValidationErrors,
  isValidObjectId,
  isValidDate,
  isValidEmail,
  isValidPassword,
  isValidRole,
  isValidActivityCategory,
  isValidActivityStatus,
  isValidPortfolioStatus,
};
