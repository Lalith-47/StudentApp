const express = require("express");
const router = express.Router();
const {
  getFacultyDashboard,
  getPendingApprovals,
  getApproval,
  startReview,
  approveActivity,
  rejectActivity,
  requestChanges,
  getFacultyWorkload,
  assignApproval,
  getFacultyPerformance,
} = require("../controllers/facultyController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Faculty dashboard and overview
router.get("/dashboard", getFacultyDashboard);
router.get("/workload", getFacultyWorkload);
router.get("/performance", getFacultyPerformance);

// Approval management routes
router.get("/approvals", getPendingApprovals);
router.get("/approvals/:approvalId", getApproval);
router.post("/approvals/:approvalId/assign", assignApproval);
router.post("/approvals/:approvalId/start-review", startReview);
router.post("/approvals/:approvalId/approve", approveActivity);
router.post("/approvals/:approvalId/reject", rejectActivity);
router.post("/approvals/:approvalId/request-changes", requestChanges);

module.exports = router;
