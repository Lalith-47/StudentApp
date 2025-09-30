const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { auditAdminAction } = require("../middleware/audit");
const { cacheMiddleware } = require("../middleware/cache");
const { paginationMiddleware } = require("../middleware/pagination");
const {
  getDashboardStats,
  getUsers,
  createUser,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
  getQuizData,
  getAuditLogs,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(["admin"]));

// Get dashboard statistics
router.get("/dashboard", cacheMiddleware.dashboard, getDashboardStats);

// Get users with pagination and filtering
router.get(
  "/users",
  paginationMiddleware.users,
  cacheMiddleware.users,
  getUsers
);

// Create new user
router.post(
  "/users",
  auditAdminAction("user_created", "user_management", "high"),
  createUser
);

// Update user status
router.patch(
  "/users/:userId/status",
  auditAdminAction("user_status_updated", "user_management", "high"),
  updateUserStatus
);

// Reset user password
router.patch(
  "/users/:userId/password",
  auditAdminAction("user_password_reset", "user_management", "critical"),
  resetUserPassword
);

// Delete user
router.delete(
  "/users/:userId",
  auditAdminAction("user_deleted", "user_management", "critical"),
  deleteUser
);

// Get quiz data for admin dashboard
router.get("/quiz-data", getQuizData);

// Get audit logs
router.get(
  "/audit-logs",
  paginationMiddleware.auditLogs,
  cacheMiddleware.auditLogs,
  getAuditLogs
);

module.exports = router;
