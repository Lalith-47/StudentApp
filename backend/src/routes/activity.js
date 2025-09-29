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
const {
  validateActivity,
  validateQueryParams,
  validateObjectId,
  validateFileUpload,
} = require("../middleware/validation");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Activity CRUD routes
router.post("/", validateActivity, createActivity);
router.get("/", validateQueryParams, getStudentActivities);
router.get("/search", validateQueryParams, searchActivities);
router.get("/stats", getActivityStats);
router.get("/:activityId", validateObjectId, getActivity);
router.put("/:activityId", validateObjectId, updateActivity);
router.delete("/:activityId", validateObjectId, deleteActivity);

// Activity workflow routes
router.post("/:activityId/submit", validateObjectId, submitForApproval);

// File upload routes
router.post(
  "/:activityId/attachments",
  validateObjectId,
  upload.array("attachments", 5),
  validateFileUpload,
  uploadAttachments
);

module.exports = router;
