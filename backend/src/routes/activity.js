const express = require("express");
const router = express.Router();
const {
  createActivity,
  uploadAttachments,
  getStudentActivities,
  getActivity,
  updateActivity,
  submitForApproval,
  deleteActivity,
  getActivityStats,
  searchActivities,
  upload,
} = require("../controllers/activityController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Activity CRUD routes
router.post("/", createActivity);
router.get("/", getStudentActivities);
router.get("/search", searchActivities);
router.get("/stats", getActivityStats);
router.get("/:activityId", getActivity);
router.put("/:activityId", updateActivity);
router.delete("/:activityId", deleteActivity);

// Activity workflow routes
router.post("/:activityId/submit", submitForApproval);

// File upload routes
router.post(
  "/:activityId/attachments",
  upload.array("attachments", 10),
  uploadAttachments
);

module.exports = router;
