const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { ensureDbConnection, isDbConnected } = require("../utils/database");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { sanitizeInput } = require("../middleware/validation");
const router = express.Router();

// Using imported authenticateToken middleware from ../middleware/auth

// Register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, password, role = "student" } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Validate role and restrict self-registration
      const validRoles = ["student", "faculty", "admin"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Must be 'student', 'faculty', or 'admin'",
        });
      }

      // Block Faculty and Admin self-registration through public API
      if (role === "faculty" || role === "admin") {
        return res.status(403).json({
          success: false,
          message:
            "Faculty and Admin accounts can only be created by administrators. Please contact your administrator for account access.",
        });
      }

      // Create new user (password will be hashed by pre-save hook)
      const user = new User({
        name,
        email,
        password,
        role,
        isActive: true,
        isVerified: true,
        analytics: {
          totalInteractions: 0,
          completedCourses: 0,
          appliedInternships: 0,
          appliedScholarships: 0,
          totalHours: 0,
          achievements: 0,
          lastUpdated: new Date(),
        },
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password, role } = req.body;

      // Check database connection
      if (!ensureDbConnection()) {
        return res.status(503).json({
          success: false,
          message:
            "Database service temporarily unavailable. Please try again later.",
        });
      }

      // Use MongoDB only
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "No user found in the system",
        });
      }

      // Check if user role matches the requested role
      if (role && user.role !== role) {
        return res.status(401).json({
          success: false,
          message: `Invalid credentials for ${role} login`,
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Compare password using bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id || user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // Use MongoDB only - remove dummy mode logic
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile || {},
        preferences: user.preferences || {},
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Logout (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Verify token
router.post("/verify", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    res.json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Admin-only route to create Faculty/Admin accounts
router.post(
  "/admin/create-user",
  sanitizeInput,
  authenticateToken,
  requireRole(["admin"]),
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("role")
      .isIn(["faculty", "admin"])
      .withMessage("Role must be 'faculty' or 'admin'"),
    body("department")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Department must be at least 2 characters"),
  ],
  async (req, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin privileges required.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, password, role, department } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Create new user
      const user = new User({
        name,
        email,
        password,
        role,
        department,
        isActive: true,
        isVerified: true,
        analytics: {
          totalInteractions: 0,
          completedCourses: 0,
          appliedInternships: 0,
          appliedScholarships: 0,
          totalHours: 0,
          achievements: 0,
          lastUpdated: new Date(),
        },
      });

      await user.save();

      res.status(201).json({
        success: true,
        message: `${role} account created successfully`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Admin user creation error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Admin-only route to get all Faculty/Admin accounts
router.get(
  "/admin/users",
  sanitizeInput,
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { role, page = 1, limit = 10 } = req.query;
      const query = role ? { role } : { role: { $in: ["faculty", "admin"] } };

      const users = await User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Admin-only route to update user account
router.put(
  "/admin/users/:userId",
  sanitizeInput,
  authenticateToken,
  requireRole(["admin"]),
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("role")
      .optional()
      .isIn(["faculty", "admin"])
      .withMessage("Role must be 'faculty' or 'admin'"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean"),
  ],
  async (req, res) => {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Admin privileges required.",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { userId } = req.params;
      const updates = req.body;

      // Don't allow updating the admin's own account to non-admin
      if (userId === req.user.id && updates.role && updates.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: "Cannot change your own admin role",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update user
      Object.keys(updates).forEach((key) => {
        if (updates[key] !== undefined) {
          user[key] = updates[key];
        }
      });

      await user.save();

      res.json({
        success: true,
        message: "User updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          isActive: user.isActive,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Admin-only route to delete user account
router.delete(
  "/admin/users/:userId",
  sanitizeInput,
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { userId } = req.params;

      // Don't allow deleting own account
      if (userId === req.user.id) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete your own account",
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      await User.findByIdAndDelete(userId);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;
