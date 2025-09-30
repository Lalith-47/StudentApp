const Portfolio = require("../models/Portfolio");
const Activity = require("../models/Activity");
const User = require("../models/User");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs").promises;
const path = require("path");

// Create or update portfolio
const createOrUpdatePortfolio = async (req, res) => {
  try {
    const studentId = req.user.id;
    const portfolioData = req.body;

    // Check if portfolio exists
    let portfolio = await Portfolio.findOne({ studentId });

    if (portfolio) {
      // Update existing portfolio
      Object.keys(portfolioData).forEach((key) => {
        if (portfolioData[key] !== undefined) {
          portfolio[key] = portfolioData[key];
        }
      });
    } else {
      // Create new portfolio
      portfolio = new Portfolio({
        studentId,
        ...portfolioData,
      });
    }

    await portfolio.save();

    res.json({
      success: true,
      message: portfolio.isNew
        ? "Portfolio created successfully"
        : "Portfolio updated successfully",
      data: portfolio,
    });
  } catch (error) {
    console.error("Create/update portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving portfolio",
    });
  }
};

// Get student's portfolio
const getStudentPortfolio = async (req, res) => {
  try {
    const studentId = req.user.id;

    const portfolio = await Portfolio.findOne({ studentId })
      .populate("activities.activityId")
      .populate("studentId", "name email");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
    });
  }
};

// Get portfolio by shareable link
const getPortfolioByLink = async (req, res) => {
  try {
    const { link } = req.params;

    const portfolio = await Portfolio.getByShareableLink(link);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found or not public",
      });
    }

    // Increment view count
    portfolio.incrementView(req.ip, "shareable_link");
    await portfolio.save();

    res.json({
      success: true,
      data: portfolio,
    });
  } catch (error) {
    console.error("Get portfolio by link error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio",
    });
  }
};

// Add activity to portfolio
const addActivityToPortfolio = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { displayOrder = 0, isHighlighted = false } = req.body;
    const studentId = req.user.id;

    // Check if activity exists and belongs to student
    const activity = await Activity.findOne({
      _id: activityId,
      studentId,
      status: "approved",
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found or not approved",
      });
    }

    // Get or create portfolio
    let portfolio = await Portfolio.findOne({ studentId });
    if (!portfolio) {
      portfolio = new Portfolio({ studentId });
    }

    // Check if activity is already in portfolio
    const existingActivity = portfolio.activities.find(
      (a) => a.activityId.toString() === activityId
    );

    if (existingActivity) {
      return res.status(400).json({
        success: false,
        message: "Activity already in portfolio",
      });
    }

    // Add activity to portfolio
    portfolio.activities.push({
      activityId,
      displayOrder,
      isHighlighted,
    });

    await portfolio.save();

    res.json({
      success: true,
      message: "Activity added to portfolio",
      data: portfolio,
    });
  } catch (error) {
    console.error("Add activity to portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding activity to portfolio",
    });
  }
};

// Remove activity from portfolio
const removeActivityFromPortfolio = async (req, res) => {
  try {
    const { activityId } = req.params;
    const studentId = req.user.id;

    const portfolio = await Portfolio.findOne({ studentId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // Remove activity from portfolio
    portfolio.activities = portfolio.activities.filter(
      (a) => a.activityId.toString() !== activityId
    );

    await portfolio.save();

    res.json({
      success: true,
      message: "Activity removed from portfolio",
      data: portfolio,
    });
  } catch (error) {
    console.error("Remove activity from portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing activity from portfolio",
    });
  }
};

// Generate shareable link
const generateShareableLink = async (req, res) => {
  try {
    const studentId = req.user.id;

    const portfolio = await Portfolio.findOne({ studentId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // Generate shareable link
    const shareableLink = portfolio.generateShareableLink();
    portfolio.status = "published";
    await portfolio.save();

    res.json({
      success: true,
      message: "Shareable link generated successfully",
      data: {
        shareableLink,
        publicUrl: `${process.env.FRONTEND_URL}/portfolio/${shareableLink}`,
      },
    });
  } catch (error) {
    console.error("Generate shareable link error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating shareable link",
    });
  }
};

// Generate PDF portfolio
const generatePDFPortfolio = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { theme = "modern" } = req.query;

    const portfolio = await Portfolio.findOne({ studentId })
      .populate("activities.activityId")
      .populate("studentId", "name email");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const filename = `portfolio-${studentId}-${Date.now()}.pdf`;
    const filepath = path.join("uploads", "portfolios", filename);

    // Ensure directory exists
    await fs.mkdir(path.dirname(filepath), { recursive: true });

    // Pipe PDF to file
    doc.pipe(fs.createWriteStream(filepath));

    // Add content to PDF
    doc
      .fontSize(24)
      .text(
        portfolio.personalInfo.fullName || portfolio.studentId.name,
        50,
        50
      );
    doc
      .fontSize(16)
      .text(portfolio.personalInfo.email || portfolio.studentId.email, 50, 80);

    if (portfolio.personalInfo.bio) {
      doc.fontSize(14).text("About Me", 50, 120);
      doc.fontSize(12).text(portfolio.personalInfo.bio, 50, 140);
    }

    // Add activities
    if (portfolio.activities.length > 0) {
      doc.fontSize(16).text("Activities & Achievements", 50, 200);

      let yPosition = 230;
      portfolio.activities.forEach((activityRef, index) => {
        const activity = activityRef.activityId;
        if (activity) {
          doc.fontSize(14).text(activity.title, 50, yPosition);
          doc.fontSize(12).text(activity.description, 50, yPosition + 20);
          doc
            .fontSize(10)
            .text(`Category: ${activity.category}`, 50, yPosition + 40);
          yPosition += 80;
        }
      });
    }

    // Add skills
    if (
      portfolio.skills.technical.length > 0 ||
      portfolio.skills.soft.length > 0
    ) {
      doc.fontSize(16).text("Skills", 50, yPosition + 20);
      yPosition += 50;

      if (portfolio.skills.technical.length > 0) {
        doc.fontSize(14).text("Technical Skills", 50, yPosition);
        portfolio.skills.technical.forEach((skill) => {
          doc
            .fontSize(12)
            .text(`• ${skill.name} (${skill.level})`, 70, yPosition + 20);
          yPosition += 30;
        });
      }
    }

    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      doc.on("end", resolve);
      doc.on("error", reject);
    });

    // Increment download count
    portfolio.incrementDownload();
    await portfolio.save();

    // Return PDF file
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.sendFile(path.resolve(filepath));
  } catch (error) {
    console.error("Generate PDF portfolio error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating PDF portfolio",
    });
  }
};

// Get portfolio analytics
const getPortfolioAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;

    const portfolio = await Portfolio.findOne({ studentId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    const analytics = {
      views: portfolio.analytics.views,
      downloads: portfolio.analytics.downloads,
      shares: portfolio.analytics.shares,
      lastViewed: portfolio.analytics.lastViewed,
      completeness: portfolio.completenessPercentage,
      summary: portfolio.getSummary(),
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Get portfolio analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching portfolio analytics",
    });
  }
};

// Update portfolio theme
const updatePortfolioTheme = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { theme } = req.body;

    const portfolio = await Portfolio.findOne({ studentId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    portfolio.portfolio.customTheme = {
      ...portfolio.portfolio.customTheme,
      ...theme,
    };

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio theme updated successfully",
      data: portfolio.portfolio.customTheme,
    });
  } catch (error) {
    console.error("Update portfolio theme error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating portfolio theme",
    });
  }
};

// Update portfolio sections visibility
const updatePortfolioSections = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { sections } = req.body;

    const portfolio = await Portfolio.findOne({ studentId });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    portfolio.portfolio.sections = {
      ...portfolio.portfolio.sections,
      ...sections,
    };

    await portfolio.save();

    res.json({
      success: true,
      message: "Portfolio sections updated successfully",
      data: portfolio.portfolio.sections,
    });
  } catch (error) {
    console.error("Update portfolio sections error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating portfolio sections",
    });
  }
};

// Get popular portfolios
const getPopularPortfolios = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const portfolios = await Portfolio.getPopular(parseInt(limit));

    res.json({
      success: true,
      data: portfolios,
    });
  } catch (error) {
    console.error("Get popular portfolios error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching popular portfolios",
    });
  }
};

// Search portfolios
const searchPortfolios = async (req, res) => {
  try {
    const { q, skills, category, page = 1, limit = 10 } = req.query;

    // Build search query
    const query = { status: "published", "portfolio.isPublic": true };

    if (q) {
      query.$or = [
        { "personalInfo.fullName": { $regex: q, $options: "i" } },
        { "personalInfo.bio": { $regex: q, $options: "i" } },
        { "career.objective": { $regex: q, $options: "i" } },
      ];
    }

    if (skills) {
      const skillArray = skills.split(",");
      query.$or = [
        { "skills.technical.name": { $in: skillArray } },
        { "skills.soft.name": { $in: skillArray } },
      ];
    }

    const portfolios = await Portfolio.find(query)
      .populate("studentId", "name email")
      .sort({ "analytics.views": -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Portfolio.countDocuments(query);

    res.json({
      success: true,
      data: {
        portfolios,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalPortfolios: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Search portfolios error:", error);
    res.status(500).json({
      success: false,
      message: "Error searching portfolios",
    });
  }
};

module.exports = {
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
};

