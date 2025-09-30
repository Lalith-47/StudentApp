const express = require("express");
const router = express.Router();
const {
  getStudentDashboard,
  getFacultyDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Dashboard routes
router.get("/student", getStudentDashboard);
router.get("/faculty", getFacultyDashboard);
router.get("/admin", getAdminDashboard);

module.exports = router;

