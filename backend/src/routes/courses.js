const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/auth");
const {
  sanitizeInput,
  validateCourse,
  validateObjectId,
  validatePagination,
} = require("../middleware/validation");
const { cacheMiddleware } = require("../middleware/cache");
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
  getActiveCourses,
  enrollStudent,
  unenrollStudent,
  getCourseStatistics,
} = require("../controllers/courseController");

// Apply security middleware to all routes
router.use(sanitizeInput);

// ==================== PUBLIC ROUTES ====================

// Get active courses (public)
router.get("/active", cacheMiddleware.analytics, getActiveCourses);

// ==================== AUTHENTICATED ROUTES ====================

// Apply authentication to all routes below
router.use(authenticateToken);

// Get all courses with filtering and pagination
router.get("/", validatePagination, cacheMiddleware.users, getCourses);

// Get course by ID
router.get("/:id", validateObjectId, cacheMiddleware.users, getCourseById);

// Get courses by instructor
router.get(
  "/instructor/:instructorId",
  validateObjectId,
  getCoursesByInstructor
);

// Get course statistics
router.get(
  "/stats/overview",
  requireRole(["admin", "faculty"]),
  getCourseStatistics
);

// ==================== COURSE MANAGEMENT ROUTES ====================

// Create course (Admin and Faculty only)
router.post(
  "/",
  requireRole(["admin", "faculty"]),
  validateCourse,
  createCourse
);

// Update course (Admin, Faculty - own courses only)
router.put(
  "/:id",
  requireRole(["admin", "faculty"]),
  validateObjectId,
  validateCourse,
  updateCourse
);

// Delete course (Admin only)
router.delete("/:id", requireRole(["admin"]), validateObjectId, deleteCourse);

// ==================== ENROLLMENT ROUTES ====================

// Enroll student in course
router.post(
  "/:courseId/enroll",
  requireRole(["student", "admin"]),
  validateObjectId,
  enrollStudent
);

// Unenroll student from course
router.delete(
  "/:courseId/enroll/:userId",
  requireRole(["student", "admin"]),
  validateObjectId,
  unenrollStudent
);

module.exports = router;
