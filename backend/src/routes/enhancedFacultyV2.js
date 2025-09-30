const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
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
  validateRateLimit,
} = require("../middleware/validation");
const {
  cacheAnalytics,
  cacheCourses,
  cacheAssignments,
  cacheAttendance,
  cacheContent,
} = require("../middleware/cache");
const {
  upload,
  uploadGrades,
  uploadContent,
  createCourse,
  getFacultyCourses,
  handleBulkGradeUpload,
  createAttendanceSession,
  getStudentProgressDashboard,
  createAnnouncement,
  handleContentUpload,
} = require("../controllers/enhancedFacultyControllerV2");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Apply rate limiting to all routes
router.use(validateRateLimit);

// Dashboard with caching
router.get("/dashboard", cacheAnalytics, getEnhancedFacultyDashboard);

// Course Management Routes with validation and caching
router.post("/courses", validateCourse, createCourse);
router.get("/courses", validatePagination, cacheCourses, getFacultyCourses);

// Assignment Management Routes with validation and caching
router.post(
  "/assignments/:assignmentId/bulk-grade",
  validateObjectId("assignmentId"),
  uploadGrades,
  handleBulkGradeUpload
);

// Attendance Management Routes with validation and caching
router.post("/attendance", validateAttendanceSession, createAttendanceSession);

// Student Analytics Routes with caching
router.get(
  "/courses/:courseId/analytics",
  validateObjectId("courseId"),
  validateDateRange,
  cacheAnalytics,
  getStudentProgressDashboard
);

// Announcement Management Routes with validation and rate limiting
router.post("/announcements", validateAnnouncement, createAnnouncement);

// Content Management Routes with validation and caching
router.post("/content", validateContent, uploadContent, handleContentUpload);

module.exports = router;

