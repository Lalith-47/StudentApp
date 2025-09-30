const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/auth");
const {
  sanitizeInput,
  validateAnnouncement,
  validateObjectId,
  validatePagination,
} = require("../middleware/validation");
const { cacheMiddleware } = require("../middleware/cache");
const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getPublishedAnnouncements,
  getScheduledAnnouncements,
  markAsRead,
  getUnreadAnnouncements,
  getAnnouncementsByPriority,
  getAnnouncementStatistics,
  processScheduledAnnouncements,
} = require("../controllers/announcementController");

// Apply security middleware to all routes
router.use(sanitizeInput);

// ==================== PUBLIC ROUTES ====================

// Get published announcements (public)
router.get("/published", cacheMiddleware.analytics, getPublishedAnnouncements);

// ==================== AUTHENTICATED ROUTES ====================

// Apply authentication to all routes below
router.use(authenticateToken);

// Get all announcements with filtering and pagination
router.get("/", validatePagination, cacheMiddleware.users, getAnnouncements);

// Get announcement by ID
router.get("/:id", validateObjectId, cacheMiddleware.users, getAnnouncementById);

// Get unread announcements for user
router.get("/user/unread", getUnreadAnnouncements);

// Get announcements by priority
router.get("/priority/:priority", getAnnouncementsByPriority);

// Mark announcement as read
router.post("/:id/read", validateObjectId, markAsRead);

// ==================== ADMIN/FACULTY ROUTES ====================

// Get scheduled announcements (Admin and Faculty only)
router.get("/admin/scheduled", requireRole(["admin", "faculty"]), getScheduledAnnouncements);

// Get announcement statistics (Admin only)
router.get("/admin/statistics", requireRole(["admin"]), getAnnouncementStatistics);

// Process scheduled announcements (Admin only)
router.post("/admin/process-scheduled", requireRole(["admin"]), processScheduledAnnouncements);

// ==================== ANNOUNCEMENT MANAGEMENT ROUTES ====================

// Create announcement (Admin and Faculty only)
router.post(
  "/",
  requireRole(["admin", "faculty"]),
  validateAnnouncement,
  createAnnouncement
);

// Update announcement (Admin, Faculty - own announcements only)
router.put(
  "/:id",
  requireRole(["admin", "faculty"]),
  validateObjectId,
  validateAnnouncement,
  updateAnnouncement
);

// Delete announcement (Admin only)
router.delete(
  "/:id",
  requireRole(["admin"]),
  validateObjectId,
  deleteAnnouncement
);

module.exports = router;
