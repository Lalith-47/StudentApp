const express = require("express");
const router = express.Router();
const {
  createOrUpdatePortfolio,
  getStudentPortfolio,
  getPortfolioByLink,
  addActivityToPortfolio,
  removeActivityFromPortfolio,
  generateShareableLink,
  generatePDFPortfolio,
  getPortfolioAnalytics,
  updatePortfolioTheme,
  updatePortfolioSections,
  getPopularPortfolios,
  searchPortfolios,
} = require("../controllers/portfolioController");
const { authenticateToken } = require("../middleware/auth");

// Public routes (no authentication required)
router.get("/public/:link", getPortfolioByLink);
router.get("/popular", getPopularPortfolios);
router.get("/search", searchPortfolios);

// Protected routes (authentication required)
router.use(authenticateToken);

// Portfolio CRUD routes
router.post("/", createOrUpdatePortfolio);
router.get("/", getStudentPortfolio);
router.put("/theme", updatePortfolioTheme);
router.put("/sections", updatePortfolioSections);

// Activity management routes
router.post("/activities/:activityId", addActivityToPortfolio);
router.delete("/activities/:activityId", removeActivityFromPortfolio);

// Sharing and export routes
router.post("/share", generateShareableLink);
router.get("/pdf", generatePDFPortfolio);
router.get("/analytics", getPortfolioAnalytics);

module.exports = router;
