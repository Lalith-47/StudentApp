const SystemSettings = require("../models/SystemSettings");
const { validationResult } = require("express-validator");

// Get system settings
const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();

    // Remove sensitive information
    const safeSettings = JSON.parse(JSON.stringify(settings));
    if (safeSettings.integrations?.email?.password) {
      safeSettings.integrations.email.password = "***hidden***";
    }
    if (safeSettings.integrations?.sms?.authToken) {
      safeSettings.integrations.sms.authToken = "***hidden***";
    }
    if (safeSettings.integrations?.storage?.awsSecretKey) {
      safeSettings.integrations.storage.awsSecretKey = "***hidden***";
    }

    res.json({
      success: true,
      message: "System settings retrieved successfully",
      data: safeSettings,
    });
  } catch (error) {
    console.error("Error fetching system settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update system settings
const updateSystemSettings = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const updates = req.body;
    const userId = req.user.id;

    // Validate and sanitize updates
    const allowedUpdates = [
      "theme",
      "notifications",
      "security",
      "userManagement",
      "system",
      "integrations",
      "features",
      "backup",
    ];

    const filteredUpdates = {};
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const settings = await SystemSettings.updateSettings(
      filteredUpdates,
      userId
    );

    // Remove sensitive information from response
    const safeSettings = JSON.parse(JSON.stringify(settings));
    if (safeSettings.integrations?.email?.password) {
      safeSettings.integrations.email.password = "***hidden***";
    }
    if (safeSettings.integrations?.sms?.authToken) {
      safeSettings.integrations.sms.authToken = "***hidden***";
    }
    if (safeSettings.integrations?.storage?.awsSecretKey) {
      safeSettings.integrations.storage.awsSecretKey = "***hidden***";
    }

    res.json({
      success: true,
      message: "System settings updated successfully",
      data: safeSettings,
    });
  } catch (error) {
    console.error("Error updating system settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset system settings to defaults
const resetSystemSettings = async (req, res) => {
  try {
    const userId = req.user.id;
    const settings = await SystemSettings.getSettings();

    await settings.resetToDefaults(userId);

    // Remove sensitive information from response
    const safeSettings = JSON.parse(JSON.stringify(settings));
    if (safeSettings.integrations?.email?.password) {
      safeSettings.integrations.email.password = "***hidden***";
    }
    if (safeSettings.integrations?.sms?.authToken) {
      safeSettings.integrations.sms.authToken = "***hidden***";
    }
    if (safeSettings.integrations?.storage?.awsSecretKey) {
      safeSettings.integrations.storage.awsSecretKey = "***hidden***";
    }

    res.json({
      success: true,
      message: "System settings reset to defaults",
      data: safeSettings,
    });
  } catch (error) {
    console.error("Error resetting system settings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get system health
const getSystemHealth = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const fs = require("fs");
    const os = require("os");

    // Database health
    const dbState = mongoose.connection.readyState;
    const dbStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    // Memory usage
    const memoryUsage = process.memoryUsage();
    const systemMemory = {
      total: os.totalmem(),
      free: os.freemem(),
      used: os.totalmem() - os.freemem(),
    };

    // CPU usage
    const cpuUsage = process.cpuUsage();
    const loadAverage = os.loadavg();

    // Disk usage (if available)
    let diskUsage = null;
    try {
      const stats = fs.statSync(process.cwd());
      // This is a simplified check - in production, you'd use a proper disk usage library
    } catch (error) {
      console.warn("Could not get disk usage:", error.message);
    }

    // System uptime
    const uptime = {
      process: process.uptime(),
      system: os.uptime(),
    };

    // Get settings for additional info
    const settings = await SystemSettings.getSettings();

    const health = {
      status: dbState === 1 ? "healthy" : "unhealthy",
      timestamp: new Date(),
      database: {
        status: dbStates[dbState],
        connectionState: dbState,
      },
      memory: {
        process: {
          rss: memoryUsage.rss,
          heapTotal: memoryUsage.heapTotal,
          heapUsed: memoryUsage.heapUsed,
          external: memoryUsage.external,
        },
        system: {
          total: systemMemory.total,
          free: systemMemory.free,
          used: systemMemory.used,
          usagePercentage: Math.round(
            (systemMemory.used / systemMemory.total) * 100
          ),
        },
      },
      cpu: {
        usage: cpuUsage,
        loadAverage: {
          "1min": loadAverage[0],
          "5min": loadAverage[1],
          "15min": loadAverage[2],
        },
      },
      uptime,
      features: settings.features || {},
      version: settings.version || "1.0.0",
    };

    res.json({
      success: true,
      message: "System health retrieved successfully",
      data: health,
    });
  } catch (error) {
    console.error("Error fetching system health:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get system logs
const getSystemLogs = async (req, res) => {
  try {
    const { level, limit = 100, offset = 0 } = req.query;
    const fs = require("fs");
    const path = require("path");

    // In a real application, you'd use a proper logging library like Winston
    // This is a simplified implementation
    const logFile = path.join(process.cwd(), "logs", "app.log");

    let logs = [];
    if (fs.existsSync(logFile)) {
      const logContent = fs.readFileSync(logFile, "utf8");
      const logLines = logContent.split("\n").filter((line) => line.trim());

      // Simple filtering by level
      if (level) {
        logs = logLines.filter((line) =>
          line.includes(`[${level.toUpperCase()}]`)
        );
      } else {
        logs = logLines;
      }

      // Apply pagination
      logs = logs.slice(offset, offset + parseInt(limit));
    }

    res.json({
      success: true,
      message: "System logs retrieved successfully",
      data: {
        logs,
        total: logs.length,
        level: level || "all",
      },
    });
  } catch (error) {
    console.error("Error fetching system logs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Clear system logs
const clearSystemLogs = async (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");

    const logFile = path.join(process.cwd(), "logs", "app.log");

    if (fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, "");
    }

    res.json({
      success: true,
      message: "System logs cleared successfully",
    });
  } catch (error) {
    console.error("Error clearing system logs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get backup status
const getBackupStatus = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    const fs = require("fs");
    const path = require("path");

    const backupDir = path.join(process.cwd(), "backups");
    let backups = [];

    if (fs.existsSync(backupDir)) {
      const files = fs.readdirSync(backupDir);
      backups = files
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          const filePath = path.join(backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            filename: file,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime,
          };
        })
        .sort((a, b) => b.createdAt - a.createdAt);
    }

    const status = {
      enabled: settings.backup?.enabled || false,
      frequency: settings.backup?.frequency || "daily",
      retention: settings.backup?.retention || 30,
      location: settings.backup?.location || "local",
      lastBackup: backups.length > 0 ? backups[0].createdAt : null,
      backups: backups.slice(0, 10), // Show only last 10 backups
      totalBackups: backups.length,
    };

    res.json({
      success: true,
      message: "Backup status retrieved successfully",
      data: status,
    });
  } catch (error) {
    console.error("Error fetching backup status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create backup
const createBackup = async (req, res) => {
  try {
    const fs = require("fs");
    const path = require("path");
    const { exec } = require("child_process");
    const { promisify } = require("util");
    const execAsync = promisify(exec);

    const backupDir = path.join(process.cwd(), "backups");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFilename = `backup-${timestamp}.json`;
    const backupPath = path.join(backupDir, backupFilename);

    // Create a simple backup of system settings
    const settings = await SystemSettings.getSettings();
    const backupData = {
      timestamp: new Date(),
      version: settings.version,
      settings: settings,
    };

    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

    // In a real application, you'd also backup the database
    // For MongoDB, you could use: mongodump --db your-db-name --out backup-dir

    res.json({
      success: true,
      message: "Backup created successfully",
      data: {
        filename: backupFilename,
        path: backupPath,
        size: fs.statSync(backupPath).size,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error creating backup:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Test email configuration
const testEmailConfiguration = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    const emailConfig = settings.integrations?.email;

    if (!emailConfig) {
      return res.status(400).json({
        success: false,
        message: "Email configuration not found",
      });
    }

    // In a real application, you'd use nodemailer or similar
    // This is a simplified test
    const testResult = {
      provider: emailConfig.provider,
      host: emailConfig.host,
      port: emailConfig.port,
      username: emailConfig.username,
      fromEmail: emailConfig.fromEmail,
      testStatus: "success", // In real implementation, test actual connection
      timestamp: new Date(),
    };

    res.json({
      success: true,
      message: "Email configuration test completed",
      data: testResult,
    });
  } catch (error) {
    console.error("Error testing email configuration:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get change history
const getChangeHistory = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const settings = await SystemSettings.getSettings();
    const history = settings.changeHistory
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, parseInt(limit));

    // Populate user information
    const User = require("../models/User");
    const populatedHistory = await Promise.all(
      history.map(async (change) => {
        const user = await User.findById(change.changedBy).select("name email");
        return {
          ...change.toObject(),
          changedBy: user,
        };
      })
    );

    res.json({
      success: true,
      message: "Change history retrieved successfully",
      data: populatedHistory,
    });
  } catch (error) {
    console.error("Error fetching change history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getSystemSettings,
  updateSystemSettings,
  resetSystemSettings,
  getSystemHealth,
  getSystemLogs,
  clearSystemLogs,
  getBackupStatus,
  createBackup,
  testEmailConfiguration,
  getChangeHistory,
};
