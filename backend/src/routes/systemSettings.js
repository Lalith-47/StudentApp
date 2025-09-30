const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/auth");
const { sanitizeInput } = require("../middleware/validation");
const { cacheMiddleware } = require("../middleware/cache");
const {
  getSystemSettings,
  updateSystemSettings,
  resetSystemSettings,
  getSystemHealth,
  getSystemLogs,
  clearSystemLogs,
  getBackupStatus,
  createBackup,
  testEmailConfiguration,
  getChangeHistory,
} = require("../controllers/systemSettingsController");

// Apply security middleware to all routes
router.use(sanitizeInput);
router.use(authenticateToken);
router.use(requireRole(["admin"]));

// ==================== SYSTEM SETTINGS ROUTES ====================

// Get system settings
router.get("/", cacheMiddleware.settings, getSystemSettings);

// Update system settings
router.put("/", updateSystemSettings);

// Reset system settings to defaults
router.post("/reset", resetSystemSettings);

// Get change history
router.get("/history", getChangeHistory);

// ==================== SYSTEM HEALTH ROUTES ====================

// Get system health
router.get("/health", getSystemHealth);

// ==================== LOGGING ROUTES ====================

// Get system logs
router.get("/logs", getSystemLogs);

// Clear system logs
router.delete("/logs", clearSystemLogs);

// ==================== BACKUP ROUTES ====================

// Get backup status
router.get("/backup/status", getBackupStatus);

// Create backup
router.post("/backup/create", createBackup);

// ==================== INTEGRATION TESTING ROUTES ====================

// Test email configuration
router.post("/test/email", testEmailConfiguration);

module.exports = router;
