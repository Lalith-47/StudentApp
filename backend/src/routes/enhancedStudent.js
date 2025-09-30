const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateFileUpload,
  validateRateLimit,
} = require("../middleware/validation");
const { cacheMiddleware } = require("../middleware/cache");
const {
  upload,
  getStudentDashboard,
  getEnrolledCourses,
  getCourseDetails,
  submitAssignment,
  getAssignmentSubmissions,
  startStudySession,
  endStudySession,
  getPerformanceAnalytics,
  generateReportCard,
} = require("../controllers/enhancedStudentController");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Apply rate limiting to all routes
router.use(validateRateLimit);

// Dashboard
router.get("/dashboard", cacheMiddleware.analytics, getStudentDashboard);

// Course Management
router.get(
  "/courses",
  validatePagination,
  cacheMiddleware.courses,
  getEnrolledCourses
);
router.get(
  "/courses/:courseId",
  validateObjectId("courseId"),
  getCourseDetails
);

// Assignment Management
router.post(
  "/assignments/:assignmentId/submit",
  validateObjectId("assignmentId"),
  upload.array("attachments", 10),
  submitAssignment
);
router.get(
  "/assignments/submissions",
  validatePagination,
  getAssignmentSubmissions
);

// Study Sessions
router.post("/study/sessions", startStudySession);
router.put(
  "/study/sessions/:sessionId",
  validateObjectId("sessionId"),
  endStudySession
);

// Performance Analytics
router.get(
  "/analytics/performance",
  validateDateRange,
  cacheMiddleware.analytics,
  getPerformanceAnalytics
);
router.get("/analytics/report-card", validateDateRange, generateReportCard);

module.exports = router;
