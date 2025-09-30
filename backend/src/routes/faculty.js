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

const {
  generateDepartmentReport,
  generateNAACReport,
  generateAICTEReport,
} = require("../controllers/facultyReportingController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Faculty dashboard and overview
router.get("/dashboard", getFacultyDashboard);
router.get("/workload", getFacultyWorkload);
router.get("/performance", getFacultyPerformance);

// Approval management routes
router.get("/pending", getPendingApprovals);
router.get("/approval/:approvalId", getApproval);
router.post("/approve/:approvalId", approveActivity);
router.post("/reject/:approvalId", rejectActivity);
router.post("/request-changes/:approvalId", requestChanges);
router.post("/assign/:approvalId", assignApproval);

// Reporting routes
router.get("/export/department", generateDepartmentReport);
router.get("/export/naac", generateNAACReport);
router.get("/export/aicte", generateAICTEReport);

module.exports = router;
