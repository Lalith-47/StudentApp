const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const { body, validationResult } = require("express-validator");

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || "Too many requests, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message || "Too many requests, please try again later.",
        retryAfter: Math.round(windowMs / 1000),
      });
    },
  });
};

// General API rate limiting
const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  500, // 500 requests per window (increased for development)
  "Too many requests from this IP, please try again later."
);

// Authentication rate limiting (stricter)
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 login attempts per window (increased for development)
  "Too many authentication attempts, please try again later."
);

// Admin operations rate limiting
const adminRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  50, // 50 admin operations per window
  "Too many admin operations, please slow down."
);

// File upload rate limiting
const uploadRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // 10 uploads per hour
  "Too many file uploads, please try again later."
);

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Compression middleware
const compressionMiddleware = compression({
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers["x-no-compression"]) {
      return false;
    }
    // Use compression filter function
    return compression.filter(req, res);
  },
});

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://your-domain.com", // Add your production domain
    ];

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Input validation and sanitization
const validateAndSanitize = {
  // User input validation
  userInput: [
    body("name")
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters")
      .matches(/^[a-zA-Z\s\-'\.]+$/)
      .withMessage("Name contains invalid characters"),

    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email address"),

    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),

    body("role")
      .isIn(["student", "faculty", "admin", "mentor"])
      .withMessage("Invalid role specified"),
  ],

  // Course input validation
  courseInput: [
    body("title")
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage("Course title must be between 3 and 200 characters"),

    body("description")
      .trim()
      .isLength({ min: 10, max: 2000 })
      .withMessage("Course description must be between 10 and 2000 characters"),

    body("code")
      .trim()
      .isLength({ min: 3, max: 20 })
      .matches(/^[A-Z0-9\-]+$/)
      .withMessage(
        "Course code must be 3-20 characters and contain only uppercase letters, numbers, and hyphens"
      ),
  ],

  // Assignment input validation
  assignmentInput: [
    body("title")
      .trim()
      .isLength({ min: 3, max: 200 })
      .withMessage("Assignment title must be between 3 and 200 characters"),

    body("description")
      .trim()
      .isLength({ min: 10, max: 5000 })
      .withMessage(
        "Assignment description must be between 10 and 5000 characters"
      ),

    body("dueDate")
      .isISO8601()
      .withMessage("Due date must be a valid ISO 8601 date"),
  ],

  // Generic text input validation
  textInput: (fieldName, minLength = 1, maxLength = 1000) => [
    body(fieldName)
      .trim()
      .isLength({ min: minLength, max: maxLength })
      .withMessage(
        `${fieldName} must be between ${minLength} and ${maxLength} characters`
      )
      .escape(), // HTML escape
  ],
};

// SQL injection prevention (for MongoDB, this is mainly for NoSQL injection)
const preventNoSQLInjection = (req, res, next) => {
  // Remove MongoDB operators from query parameters
  const sanitizeObject = (obj) => {
    if (typeof obj !== "object" || obj === null) return obj;

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Block MongoDB operators
      if (key.startsWith("$") || key.startsWith("__")) {
        continue;
      }

      if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  next();
};

// Request size limiting
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.headers["content-length"] || "0");
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      message: "Request entity too large",
      maxSize: "10MB",
    });
  }

  next();
};

// Security logging
const securityLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log suspicious activities
  const suspiciousPatterns = [
    /script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  const checkSuspicious = (obj, path = "") => {
    if (typeof obj === "string") {
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(obj)) {
          console.warn(
            `🚨 Suspicious input detected at ${path}: ${obj.substring(0, 100)}`
          );
          break;
        }
      }
    } else if (typeof obj === "object" && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        checkSuspicious(value, `${path}.${key}`);
      }
    }
  };

  checkSuspicious(req.body, "body");
  checkSuspicious(req.query, "query");

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    // Log failed requests
    if (status >= 400) {
      console.warn(
        `⚠️  ${req.method} ${req.path} - ${status} - ${duration}ms - ${req.ip}`
      );
    }

    // Log slow requests
    if (duration > 5000) {
      console.warn(
        `🐌 Slow request: ${req.method} ${req.path} - ${duration}ms`
      );
    }
  });

  next();
};

// IP whitelist for admin operations
const adminIPWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    if (allowedIPs.length === 0) {
      return next(); // No whitelist configured
    }

    const clientIP = req.ip || req.connection.remoteAddress;

    if (allowedIPs.includes(clientIP)) {
      next();
    } else {
      console.warn(`🚫 Admin access denied for IP: ${clientIP}`);
      res.status(403).json({
        success: false,
        message: "Access denied from this IP address",
      });
    }
  };
};

// Session security
const sessionSecurity = (req, res, next) => {
  // Prevent session fixation
  if (req.session && req.sessionID) {
    req.session.regenerate((err) => {
      if (err) {
        console.error("Session regeneration error:", err);
      }
      next();
    });
  } else {
    next();
  }
};

module.exports = {
  // Rate limiting
  generalRateLimit,
  authRateLimit,
  adminRateLimit,
  uploadRateLimit,

  // Security middleware
  securityHeaders,
  corsOptions,
  compressionMiddleware,

  // Validation
  validateAndSanitize,
  preventNoSQLInjection,
  requestSizeLimit,

  // Monitoring
  securityLogger,
  adminIPWhitelist,
  sessionSecurity,
};
