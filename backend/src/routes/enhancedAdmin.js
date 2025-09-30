const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/auth");
const {
  sanitizeInput,
  validateUser,
  validateCourse,
  validateAnnouncement,
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateRateLimit,
} = require("../middleware/validation");
const { cacheMiddleware } = require("../middleware/cache");
const {
  getEnhancedAdminDashboard,
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
  getCourses,
  updateCourseStatus,
  assignFacultyToCourse,
  createSystemAnnouncement,
  getSystemAnnouncements,
  getSystemSettings,
  updateSystemSettings,
} = require("../controllers/enhancedAdminController");

// Apply security middleware to all routes
router.use(sanitizeInput);
router.use(authenticateToken);
router.use(requireRole(["admin"]));

// Apply rate limiting to all routes
router.use(validateRateLimit);

// ==================== DASHBOARD & ANALYTICS ====================

// Enhanced Admin Dashboard
router.get("/dashboard", cacheMiddleware.analytics, getEnhancedAdminDashboard);

// ==================== USER MANAGEMENT ====================

// Get all users with advanced filtering and pagination
router.get("/users", cacheMiddleware.users, getUsers);

// Create new user (Admin only)
router.post("/users", validateUser, createUser);

// Update user information
router.put("/users/:userId", validateObjectId, updateUser);

// Update user status (activate/deactivate)
router.patch("/users/:userId/status", validateObjectId, updateUserStatus);

// Reset user password
router.post(
  "/users/:userId/reset-password",
  validateObjectId,
  resetUserPassword
);

// Delete user
router.delete("/users/:userId", validateObjectId, deleteUser);

// ==================== COURSE MANAGEMENT ====================

// Get all courses with advanced filtering
router.get("/courses", cacheMiddleware.courses, getCourses);

// Update course status (archive/restore/suspend)
router.patch("/courses/:courseId/status", validateObjectId, updateCourseStatus);

// Assign faculty to course
router.post(
  "/courses/:courseId/assign-faculty",
  validateObjectId,
  assignFacultyToCourse
);

// ==================== SYSTEM-WIDE ANNOUNCEMENTS ====================

// Create system-wide announcement
router.post("/announcements", validateAnnouncement, createSystemAnnouncement);

// Get system announcements
router.get("/announcements", cacheMiddleware.settings, getSystemAnnouncements);

// ==================== SYSTEM SETTINGS ====================

// Get system settings
router.get("/settings", getSystemSettings);

// Update system settings
router.put("/settings", updateSystemSettings);

module.exports = router;
