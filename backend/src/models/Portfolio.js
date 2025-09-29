const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
    index: true,
  },
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      pincode: String,
    },
    profilePicture: {
      url: String,
      filename: String,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      website: String,
    },
  },
  academicInfo: {
    currentInstitution: {
      name: String,
      type: {
        type: String,
        enum: ["school", "college", "university", "institute"],
      },
      course: String,
      year: String,
      cgpa: Number,
      startDate: Date,
      endDate: Date,
    },
    previousEducation: [
      {
        institution: String,
        course: String,
        year: String,
        cgpa: Number,
        startDate: Date,
        endDate: Date,
      },
    ],
    academicAchievements: [
      {
        title: String,
        description: String,
        date: Date,
        issuer: String,
        grade: String,
      },
    ],
  },
  activities: [
    {
      activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true,
      },
      displayOrder: {
        type: Number,
        default: 0,
      },
      isHighlighted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  skills: {
    technical: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "intermediate",
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    soft: [
      {
        name: String,
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          default: "intermediate",
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    languages: [
      {
        name: String,
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
          default: "conversational",
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  achievements: {
    awards: [
      {
        title: String,
        description: String,
        issuer: String,
        date: Date,
        level: {
          type: String,
          enum: ["local", "state", "national", "international"],
          default: "local",
        },
        category: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: Date,
        expiryDate: Date,
        credentialId: String,
        credentialUrl: String,
      },
    ],
    publications: [
      {
        title: String,
        authors: [String],
        journal: String,
        date: Date,
        doi: String,
        url: String,
      },
    ],
  },
  career: {
    objective: {
      type: String,
      trim: true,
      maxlength: [1000, "Career objective cannot exceed 1000 characters"],
    },
    interests: [String],
    preferredLocations: [String],
    salaryExpectation: {
      currency: {
        type: String,
        default: "INR",
      },
      amount: Number,
    },
    availability: {
      type: String,
      enum: ["immediate", "1_month", "3_months", "6_months", "flexible"],
      default: "flexible",
    },
  },
  portfolio: {
    isPublic: {
      type: Boolean,
      default: true,
    },
    shareableLink: {
      type: String,
      unique: true,
      sparse: true,
    },
    lastGenerated: Date,
    generationCount: {
      type: Number,
      default: 0,
    },
    customTheme: {
      primaryColor: {
        type: String,
        default: "#3B82F6",
      },
      secondaryColor: {
        type: String,
        default: "#1E40AF",
      },
      fontFamily: {
        type: String,
        default: "Inter",
      },
      layout: {
        type: String,
        enum: ["modern", "classic", "minimal", "creative"],
        default: "modern",
      },
    },
    sections: {
      showPersonalInfo: { type: Boolean, default: true },
      showAcademicInfo: { type: Boolean, default: true },
      showActivities: { type: Boolean, default: true },
      showSkills: { type: Boolean, default: true },
      showAchievements: { type: Boolean, default: true },
      showCareer: { type: Boolean, default: true },
    },
  },
  analytics: {
    views: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    lastViewed: Date,
    viewHistory: [
      {
        viewedAt: Date,
        viewerInfo: String,
        source: String,
      },
    ],
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better performance
portfolioSchema.index({ studentId: 1, status: 1 });
portfolioSchema.index({ "portfolio.shareableLink": 1 });
portfolioSchema.index({ createdAt: -1 });
portfolioSchema.index({ "analytics.views": -1 });

// Update timestamp on save
portfolioSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate shareable link
portfolioSchema.methods.generateShareableLink = function () {
  const randomString = Math.random().toString(36).substring(2, 15);
  this.portfolio.shareableLink = `portfolio-${this.studentId}-${randomString}`;
  return this.portfolio.shareableLink;
};

// Method to get portfolio summary
portfolioSchema.methods.getSummary = function () {
  return {
    totalActivities: this.activities.length,
    totalSkills:
      this.skills.technical.length +
      this.skills.soft.length +
      this.skills.languages.length,
    totalAchievements:
      this.achievements.awards.length +
      this.achievements.certifications.length +
      this.achievements.publications.length,
    isComplete: this.status === "published" && this.activities.length > 0,
    lastUpdated: this.updatedAt,
  };
};

// Method to increment view count
portfolioSchema.methods.incrementView = function (
  viewerInfo = "",
  source = "direct"
) {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  this.analytics.viewHistory.push({
    viewedAt: new Date(),
    viewerInfo,
    source,
  });

  // Keep only last 100 view history entries
  if (this.analytics.viewHistory.length > 100) {
    this.analytics.viewHistory = this.analytics.viewHistory.slice(-100);
  }
};

// Method to increment download count
portfolioSchema.methods.incrementDownload = function () {
  this.analytics.downloads += 1;
  this.portfolio.generationCount += 1;
  this.portfolio.lastGenerated = new Date();
};

// Static method to get popular portfolios
portfolioSchema.statics.getPopular = function (limit = 10) {
  return this.find({ status: "published", "portfolio.isPublic": true })
    .populate("studentId", "name email")
    .sort({ "analytics.views": -1 })
    .limit(limit);
};

// Static method to get portfolio by shareable link
portfolioSchema.statics.getByShareableLink = function (link) {
  return this.findOne({ "portfolio.shareableLink": link, status: "published" })
    .populate("studentId", "name email")
    .populate("activities.activityId");
};

// Virtual for portfolio completeness percentage
portfolioSchema.virtual("completenessPercentage").get(function () {
  let score = 0;
  let total = 0;

  // Personal info (20%)
  total += 20;
  if (this.personalInfo.fullName && this.personalInfo.email) score += 20;

  // Academic info (20%)
  total += 20;
  if (this.academicInfo.currentInstitution.name) score += 20;

  // Activities (30%)
  total += 30;
  if (this.activities.length > 0)
    score += Math.min(30, this.activities.length * 5);

  // Skills (15%)
  total += 15;
  const totalSkills =
    this.skills.technical.length +
    this.skills.soft.length +
    this.skills.languages.length;
  if (totalSkills > 0) score += Math.min(15, totalSkills * 3);

  // Career info (15%)
  total += 15;
  if (this.career.objective) score += 15;

  return Math.round((score / total) * 100);
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
