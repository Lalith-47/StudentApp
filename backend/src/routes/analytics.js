const express = require("express");
const router = express.Router();
const {
  generateInstitutionalReport,
  getAnalyticsDashboard,
} = require("../controllers/analyticsController");
const { authenticateToken } = require("../middleware/auth");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Analytics routes
router.get("/dashboard", getAnalyticsDashboard);
router.post("/reports", generateInstitutionalReport);

module.exports = router;
