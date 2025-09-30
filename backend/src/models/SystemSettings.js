const mongoose = require("mongoose");

const systemSettingsSchema = new mongoose.Schema(
  {
    // Theme Settings
    theme: {
      primaryColor: {
        type: String,
        default: "#3B82F6",
        match: [/^#[0-9A-F]{6}$/i, "Invalid hex color format"],
      },
      secondaryColor: {
        type: String,
        default: "#8B5CF6",
        match: [/^#[0-9A-F]{6}$/i, "Invalid hex color format"],
      },
      darkMode: {
        type: Boolean,
        default: false,
      },
      customCSS: {
        type: String,
        maxlength: [10000, "Custom CSS cannot exceed 10000 characters"],
      },
      logo: {
        url: String,
        alt: String,
      },
      favicon: {
        url: String,
      },
    },

    // Notification Settings
    notifications: {
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      pushNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      systemAlerts: {
        type: Boolean,
        default: true,
      },
      weeklyReports: {
        type: Boolean,
        default: true,
      },
      maintenanceAlerts: {
        type: Boolean,
        default: true,
      },
      emailTemplate: {
        header: String,
        footer: String,
        primaryColor: String,
      },
    },

    // Security Settings
    security: {
      passwordPolicy: {
        minLength: {
          type: Number,
          default: 8,
          min: 6,
          max: 20,
        },
        requireUppercase: {
          type: Boolean,
          default: true,
        },
        requireLowercase: {
          type: Boolean,
          default: true,
        },
        requireNumbers: {
          type: Boolean,
          default: true,
        },
        requireSpecialChars: {
          type: Boolean,
          default: false,
        },
        expiryDays: {
          type: Number,
          default: 90,
          min: 30,
          max: 365,
        },
        preventReuse: {
          type: Number,
          default: 5,
          min: 0,
          max: 10,
        },
      },
      sessionTimeout: {
        type: Number,
        default: 30,
        min: 5,
        max: 480,
      },
      twoFactorAuth: {
        type: Boolean,
        default: false,
      },
      ipWhitelist: [String],
      maxLoginAttempts: {
        type: Number,
        default: 5,
        min: 3,
        max: 10,
      },
      lockoutDuration: {
        type: Number,
        default: 15,
        min: 5,
        max: 60,
      },
      encryptionLevel: {
        type: String,
        enum: ["basic", "standard", "high"],
        default: "standard",
      },
    },

    // User Management Settings
    userManagement: {
      defaultRole: {
        type: String,
        enum: ["student", "faculty", "admin"],
        default: "student",
      },
      allowSelfRegistration: {
        type: Boolean,
        default: true,
      },
      requireEmailVerification: {
        type: Boolean,
        default: true,
      },
      autoApproveFaculty: {
        type: Boolean,
        default: false,
      },
      maxUsersPerCourse: {
        type: Number,
        default: 50,
        min: 10,
        max: 500,
      },
      userDataRetention: {
        type: Number,
        default: 365,
        min: 30,
        max: 2555, // 7 years
      },
      profileFields: {
        required: [String],
        optional: [String],
      },
    },

    // System Configuration
    system: {
      siteName: {
        type: String,
        default: "Yukti Learning Platform",
        maxlength: [100, "Site name cannot exceed 100 characters"],
      },
      siteDescription: {
        type: String,
        default: "Your intelligent learning companion",
        maxlength: [500, "Site description cannot exceed 500 characters"],
      },
      timezone: {
        type: String,
        default: "Asia/Kolkata",
      },
      language: {
        type: String,
        default: "en",
        enum: ["en", "hi", "es", "fr", "de", "zh", "ja"],
      },
      dateFormat: {
        type: String,
        default: "DD/MM/YYYY",
        enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
      },
      currency: {
        type: String,
        default: "INR",
        enum: ["INR", "USD", "EUR", "GBP", "JPY"],
      },
      maintenanceMode: {
        type: Boolean,
        default: false,
      },
      maintenanceMessage: {
        type: String,
        maxlength: [1000, "Maintenance message cannot exceed 1000 characters"],
      },
      debugMode: {
        type: Boolean,
        default: false,
      },
      logLevel: {
        type: String,
        enum: ["error", "warn", "info", "debug"],
        default: "info",
      },
      maxFileSize: {
        type: Number,
        default: 10485760, // 10MB in bytes
      },
      allowedFileTypes: [String],
    },

    // Integration Settings
    integrations: {
      email: {
        provider: {
          type: String,
          enum: ["smtp", "sendgrid", "mailgun", "ses"],
          default: "smtp",
        },
        host: {
          type: String,
          default: "smtp.gmail.com",
        },
        port: {
          type: Number,
          default: 587,
        },
        username: String,
        password: String,
        fromEmail: {
          type: String,
          default: "noreply@yukti.com",
        },
        fromName: {
          type: String,
          default: "Yukti Platform",
        },
        encryption: {
          type: String,
          enum: ["none", "tls", "ssl"],
          default: "tls",
        },
        testMode: {
          type: Boolean,
          default: false,
        },
      },
      sms: {
        provider: {
          type: String,
          enum: ["twilio", "aws-sns", "firebase"],
          default: "twilio",
        },
        accountSid: String,
        authToken: String,
        fromNumber: String,
        apiKey: String,
      },
      storage: {
        provider: {
          type: String,
          enum: ["local", "aws", "google", "azure"],
          default: "local",
        },
        awsAccessKey: String,
        awsSecretKey: String,
        awsBucket: String,
        awsRegion: {
          type: String,
          default: "us-east-1",
        },
        googleCredentials: String,
        azureConnectionString: String,
        maxStorage: {
          type: Number,
          default: 10737418240, // 10GB in bytes
        },
      },
      analytics: {
        googleAnalytics: String,
        facebookPixel: String,
        customTracking: String,
      },
      payment: {
        provider: {
          type: String,
          enum: ["razorpay", "stripe", "paypal"],
          default: "razorpay",
        },
        apiKey: String,
        secretKey: String,
        webhookSecret: String,
        testMode: {
          type: Boolean,
          default: true,
        },
      },
    },

    // Feature Flags
    features: {
      enableChat: {
        type: Boolean,
        default: true,
      },
      enableForums: {
        type: Boolean,
        default: true,
      },
      enableQuizzes: {
        type: Boolean,
        default: true,
      },
      enableAssignments: {
        type: Boolean,
        default: true,
      },
      enablePortfolio: {
        type: Boolean,
        default: true,
      },
      enableAnalytics: {
        type: Boolean,
        default: true,
      },
      enableAPI: {
        type: Boolean,
        default: true,
      },
    },

    // Backup Settings
    backup: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
        default: "daily",
      },
      retention: {
        type: Number,
        default: 30,
        min: 7,
        max: 365,
      },
      location: {
        type: String,
        enum: ["local", "aws", "google", "azure"],
        default: "local",
      },
    },

    // Version and Metadata
    version: {
      type: String,
      default: "1.0.0",
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changeHistory: [{
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      changes: mongoose.Schema.Types.Mixed,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      reason: String,
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure only one settings document exists
systemSettingsSchema.index({}, { unique: true });

// Methods
systemSettingsSchema.methods.addChangeHistory = function (userId, changes, reason) {
  this.changeHistory.push({
    changedBy: userId,
    changes,
    reason,
    timestamp: new Date(),
  });

  // Keep only last 50 changes
  if (this.changeHistory.length > 50) {
    this.changeHistory = this.changeHistory.slice(-50);
  }

  this.lastModifiedBy = userId;
  return this.save();
};

systemSettingsSchema.methods.resetToDefaults = function (userId) {
  const defaults = this.constructor.schema.obj;
  
  Object.keys(defaults).forEach(key => {
    if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
      this[key] = { ...defaults[key] };
    } else if (defaults[key].default !== undefined) {
      this[key] = defaults[key].default;
    }
  });

  this.addChangeHistory(userId, { action: "reset_to_defaults" }, "Settings reset to default values");
  return this.save();
};

// Static methods
systemSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  
  if (!settings) {
    settings = new this();
    await settings.save();
  }
  
  return settings;
};

systemSettingsSchema.statics.updateSettings = async function (updates, userId) {
  const settings = await this.getSettings();
  
  // Deep merge updates
  const deepMerge = (target, source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (!target[key]) target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  };

  const oldSettings = JSON.parse(JSON.stringify(settings.toObject()));
  deepMerge(settings, updates);
  
  settings.lastModifiedBy = userId;
  await settings.save();
  
  // Log changes
  const changes = this.getChanges(oldSettings, settings.toObject());
  if (Object.keys(changes).length > 0) {
    await settings.addChangeHistory(userId, changes, "Settings updated");
  }
  
  return settings;
};

systemSettingsSchema.statics.getChanges = function (oldSettings, newSettings) {
  const changes = {};
  
  const compare = (old, new_, path = '') => {
    for (const key in new_) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof new_[key] === 'object' && new_[key] !== null && !Array.isArray(new_[key])) {
        compare(old[key] || {}, new_[key], currentPath);
      } else if (JSON.stringify(old[key]) !== JSON.stringify(new_[key])) {
        changes[currentPath] = {
          from: old[key],
          to: new_[key],
        };
      }
    }
  };
  
  compare(oldSettings, newSettings);
  return changes;
};

module.exports = mongoose.model("SystemSettings", systemSettingsSchema);
