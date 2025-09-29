const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institution",
    required: true,
    index: true,
  },
  reportType: {
    type: String,
    required: true,
    enum: ["naac", "aicte", "nirf", "custom", "annual", "quarterly", "monthly"],
    index: true,
  },
  period: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
      index: true,
    },
  },
  studentMetrics: {
    totalStudents: {
      type: Number,
      default: 0,
    },
    activeStudents: {
      type: Number,
      default: 0,
    },
    newRegistrations: {
      type: Number,
      default: 0,
    },
    portfolioCompletions: {
      type: Number,
      default: 0,
    },
    averagePortfolioScore: {
      type: Number,
      default: 0,
    },
  },
  activityMetrics: {
    totalActivities: {
      type: Number,
      default: 0,
    },
    approvedActivities: {
      type: Number,
      default: 0,
    },
    pendingActivities: {
      type: Number,
      default: 0,
    },
    rejectedActivities: {
      type: Number,
      default: 0,
    },
    averageApprovalTime: {
      type: Number,
      default: 0, // in hours
    },
    categoryBreakdown: [
      {
        category: String,
        count: Number,
        percentage: Number,
      },
    ],
    departmentBreakdown: [
      {
        department: String,
        count: Number,
        percentage: Number,
      },
    ],
  },
  facultyMetrics: {
    totalFaculty: {
      type: Number,
      default: 0,
    },
    activeFaculty: {
      type: Number,
      default: 0,
    },
    averageWorkload: {
      type: Number,
      default: 0,
    },
    approvalRate: {
      type: Number,
      default: 0,
    },
    averageReviewTime: {
      type: Number,
      default: 0, // in hours
    },
  },
  engagementMetrics: {
    totalLogins: {
      type: Number,
      default: 0,
    },
    averageSessionDuration: {
      type: Number,
      default: 0, // in minutes
    },
    featureUsage: [
      {
        feature: String,
        usageCount: Number,
        uniqueUsers: Number,
      },
    ],
    deviceBreakdown: [
      {
        device: String,
        count: Number,
        percentage: Number,
      },
    ],
    platformBreakdown: [
      {
        platform: String,
        count: Number,
        percentage: Number,
      },
    ],
  },
  qualityMetrics: {
    averageActivityScore: {
      type: Number,
      default: 0,
    },
    verificationRate: {
      type: Number,
      default: 0,
    },
    portfolioQualityScore: {
      type: Number,
      default: 0,
    },
    studentSatisfactionScore: {
      type: Number,
      default: 0,
    },
    facultySatisfactionScore: {
      type: Number,
      default: 0,
    },
  },
  complianceMetrics: {
    naacCompliance: {
      score: Number,
      criteria: [
        {
          criterion: String,
          score: Number,
          maxScore: Number,
          status: String,
        },
      ],
    },
    aicteCompliance: {
      score: Number,
      criteria: [
        {
          criterion: String,
          score: Number,
          maxScore: Number,
          status: String,
        },
      ],
    },
    nirfCompliance: {
      score: Number,
      criteria: [
        {
          criterion: String,
          score: Number,
          maxScore: Number,
          status: String,
        },
      ],
    },
  },
  trends: {
    studentGrowth: [
      {
        period: String,
        count: Number,
        growthRate: Number,
      },
    ],
    activityTrends: [
      {
        period: String,
        count: Number,
        category: String,
      },
    ],
    engagementTrends: [
      {
        period: String,
        logins: Number,
        sessions: Number,
        duration: Number,
      },
    ],
  },
  insights: [
    {
      type: {
        type: String,
        enum: ["positive", "negative", "neutral", "recommendation"],
      },
      title: String,
      description: String,
      impact: {
        type: String,
        enum: ["low", "medium", "high", "critical"],
      },
      actionable: Boolean,
      recommendations: [String],
    },
  ],
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["generating", "completed", "failed", "archived"],
    default: "generating",
  },
  exportFormats: [
    {
      format: {
        type: String,
        enum: ["pdf", "excel", "csv", "json"],
      },
      url: String,
      generatedAt: Date,
      size: Number,
    },
  ],
  isPublic: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, "Notes cannot exceed 1000 characters"],
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
analyticsSchema.index({ institutionId: 1, reportType: 1 });
analyticsSchema.index({ "period.academicYear": 1, reportType: 1 });
analyticsSchema.index({ generatedAt: -1 });
analyticsSchema.index({ status: 1 });

// Update timestamp on save
analyticsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Method to calculate overall compliance score
analyticsSchema.methods.calculateComplianceScore = function () {
  const scores = [];

  if (this.complianceMetrics.naacCompliance.score) {
    scores.push(this.complianceMetrics.naacCompliance.score);
  }
  if (this.complianceMetrics.aicteCompliance.score) {
    scores.push(this.complianceMetrics.aicteCompliance.score);
  }
  if (this.complianceMetrics.nirfCompliance.score) {
    scores.push(this.complianceMetrics.nirfCompliance.score);
  }

  return scores.length > 0
    ? scores.reduce((a, b) => a + b, 0) / scores.length
    : 0;
};

// Method to generate insights
analyticsSchema.methods.generateInsights = function () {
  const insights = [];

  // Student engagement insights
  if (
    this.studentMetrics.portfolioCompletions <
    this.studentMetrics.totalStudents * 0.3
  ) {
    insights.push({
      type: "negative",
      title: "Low Portfolio Completion Rate",
      description: `Only ${this.studentMetrics.portfolioCompletions} out of ${this.studentMetrics.totalStudents} students have completed portfolios`,
      impact: "medium",
      actionable: true,
      recommendations: [
        "Implement portfolio completion incentives",
        "Provide portfolio building workshops",
        "Send reminder notifications to students",
      ],
    });
  }

  // Faculty workload insights
  if (this.facultyMetrics.averageWorkload > 50) {
    insights.push({
      type: "negative",
      title: "High Faculty Workload",
      description: `Faculty average workload is ${this.facultyMetrics.averageWorkload} activities`,
      impact: "high",
      actionable: true,
      recommendations: [
        "Consider hiring additional faculty",
        "Implement workload balancing",
        "Automate routine approval processes",
      ],
    });
  }

  // Activity approval insights
  if (this.activityMetrics.averageApprovalTime > 72) {
    insights.push({
      type: "negative",
      title: "Slow Approval Process",
      description: `Average approval time is ${this.activityMetrics.averageApprovalTime} hours`,
      impact: "medium",
      actionable: true,
      recommendations: [
        "Streamline approval workflow",
        "Provide faculty training",
        "Implement automated notifications",
      ],
    });
  }

  // Positive insights
  if (this.qualityMetrics.averageActivityScore > 4) {
    insights.push({
      type: "positive",
      title: "High Quality Activities",
      description: `Average activity score is ${this.qualityMetrics.averageActivityScore}/5`,
      impact: "high",
      actionable: false,
      recommendations: [],
    });
  }

  this.insights = insights;
  return insights;
};

// Method to export data
analyticsSchema.methods.exportData = function (format = "json") {
  const exportData = {
    institutionId: this.institutionId,
    reportType: this.reportType,
    period: this.period,
    metrics: {
      student: this.studentMetrics,
      activity: this.activityMetrics,
      faculty: this.facultyMetrics,
      engagement: this.engagementMetrics,
      quality: this.qualityMetrics,
      compliance: this.complianceMetrics,
    },
    trends: this.trends,
    insights: this.insights,
    generatedAt: this.generatedAt,
  };

  switch (format) {
    case "json":
      return JSON.stringify(exportData, null, 2);
    case "csv":
      return this.convertToCSV(exportData);
    default:
      return exportData;
  }
};

// Helper method to convert data to CSV
analyticsSchema.methods.convertToCSV = function (data) {
  // Implementation for CSV conversion
  const headers = Object.keys(data.metrics.student);
  const rows = [headers.join(",")];

  // Add data rows
  Object.values(data.metrics.student).forEach((value) => {
    rows.push(String(value));
  });

  return rows.join("\n");
};

// Static method to get institution comparison
analyticsSchema.statics.getInstitutionComparison = function (
  institutionIds,
  reportType
) {
  return this.find({
    institutionId: { $in: institutionIds },
    reportType,
    status: "completed",
  }).sort({ generatedAt: -1 });
};

// Static method to get trend analysis
analyticsSchema.statics.getTrendAnalysis = function (
  institutionId,
  reportType,
  periods = 12
) {
  return this.find({
    institutionId,
    reportType,
    status: "completed",
  })
    .sort({ "period.startDate": 1 })
    .limit(periods);
};

// Virtual for report completeness
analyticsSchema.virtual("completenessPercentage").get(function () {
  let score = 0;
  let total = 0;

  // Student metrics (25%)
  total += 25;
  if (this.studentMetrics.totalStudents > 0) score += 25;

  // Activity metrics (25%)
  total += 25;
  if (this.activityMetrics.totalActivities > 0) score += 25;

  // Faculty metrics (20%)
  total += 20;
  if (this.facultyMetrics.totalFaculty > 0) score += 20;

  // Engagement metrics (15%)
  total += 15;
  if (this.engagementMetrics.totalLogins > 0) score += 15;

  // Quality metrics (15%)
  total += 15;
  if (this.qualityMetrics.averageActivityScore > 0) score += 15;

  return Math.round((score / total) * 100);
});

// Indexes for performance
analyticsSchema.index({ institutionId: 1 });
analyticsSchema.index({ reportType: 1 });
analyticsSchema.index({ generatedBy: 1 });
analyticsSchema.index({ generatedAt: -1 });
analyticsSchema.index({ status: 1 });

// Compound indexes
analyticsSchema.index({ institutionId: 1, reportType: 1 });
analyticsSchema.index({ institutionId: 1, generatedAt: -1 });
analyticsSchema.index({ reportType: 1, status: 1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
