const mongoose = require("mongoose");

const facultyApprovalSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
    index: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "Department name cannot exceed 100 characters"],
    index: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "academic",
      "extracurricular",
      "volunteering",
      "internship",
      "leadership",
      "certification",
      "competition",
      "workshop",
      "conference",
      "seminar",
      "research",
      "project",
      "sports",
      "cultural",
      "other",
    ],
    index: true,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "under_review",
      "approved",
      "rejected",
      "requires_changes",
    ],
    default: "pending",
    index: true,
  },
  reviewDetails: {
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    reviewDuration: Number, // in minutes
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    complexity: {
      type: String,
      enum: ["simple", "moderate", "complex"],
      default: "simple",
    },
  },
  facultyNotes: {
    initialReview: {
      type: String,
      trim: true,
      maxlength: [1000, "Initial review notes cannot exceed 1000 characters"],
    },
    detailedReview: {
      type: String,
      trim: true,
      maxlength: [2000, "Detailed review notes cannot exceed 2000 characters"],
    },
    suggestions: {
      type: String,
      trim: true,
      maxlength: [1000, "Suggestions cannot exceed 1000 characters"],
    },
    concerns: {
      type: String,
      trim: true,
      maxlength: [1000, "Concerns cannot exceed 1000 characters"],
    },
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationMethod: {
      type: String,
      enum: [
        "document_review",
        "witness_verification",
        "official_record",
        "phone_verification",
        "email_verification",
        "other",
      ],
    },
    verificationNotes: {
      type: String,
      trim: true,
      maxlength: [500, "Verification notes cannot exceed 500 characters"],
    },
    verifiedAt: Date,
    verificationDocuments: [
      {
        filename: String,
        url: String,
        type: String,
        uploadedAt: Date,
      },
    ],
  },
  scoring: {
    authenticity: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    relevance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    impact: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    documentation: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    overallScore: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  workflow: {
    currentStage: {
      type: String,
      enum: [
        "submitted",
        "initial_review",
        "detailed_review",
        "verification",
        "final_review",
        "completed",
      ],
      default: "submitted",
    },
    nextStage: {
      type: String,
      enum: [
        "initial_review",
        "detailed_review",
        "verification",
        "final_review",
        "completed",
      ],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dueDate: Date,
    completedAt: Date,
    escalationLevel: {
      type: Number,
      default: 0,
      max: 3,
    },
    escalationReason: {
      type: String,
      trim: true,
      maxlength: [500, "Escalation reason cannot exceed 500 characters"],
    },
  },
  notifications: {
    studentNotified: {
      type: Boolean,
      default: false,
    },
    facultyNotified: {
      type: Boolean,
      default: false,
    },
    adminNotified: {
      type: Boolean,
      default: false,
    },
    lastNotificationSent: Date,
    notificationCount: {
      type: Number,
      default: 0,
    },
  },
  history: [
    {
      action: {
        type: String,
        required: true,
        enum: [
          "submitted",
          "assigned",
          "review_started",
          "review_completed",
          "approved",
          "rejected",
          "returned_for_changes",
          "escalated",
          "verified",
          "completed",
        ],
      },
      performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      performedAt: {
        type: Date,
        default: Date.now,
      },
      notes: {
        type: String,
        trim: true,
        maxlength: [500, "History notes cannot exceed 500 characters"],
      },
      previousStatus: String,
      newStatus: String,
    },
  ],
  attachments: [
    {
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      url: String,
      uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
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
facultyApprovalSchema.index({ facultyId: 1, status: 1 });
facultyApprovalSchema.index({ department: 1, category: 1 });
facultyApprovalSchema.index({ "workflow.currentStage": 1 });
facultyApprovalSchema.index({ "reviewDetails.submittedAt": -1 });
facultyApprovalSchema.index({ createdAt: -1 });

// Update timestamp on save
facultyApprovalSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate overall score
facultyApprovalSchema.pre("save", function (next) {
  if (
    this.scoring.authenticity &&
    this.scoring.relevance &&
    this.scoring.impact &&
    this.scoring.documentation
  ) {
    this.scoring.overallScore = Math.round(
      (this.scoring.authenticity +
        this.scoring.relevance +
        this.scoring.impact +
        this.scoring.documentation) /
        4
    );
  }
  next();
});

// Add history entry
facultyApprovalSchema.methods.addHistoryEntry = function (
  action,
  performedBy,
  notes = "",
  previousStatus = null,
  newStatus = null
) {
  this.history.push({
    action,
    performedBy,
    performedAt: new Date(),
    notes,
    previousStatus,
    newStatus,
  });

  // Keep only last 50 history entries
  if (this.history.length > 50) {
    this.history = this.history.slice(-50);
  }
};

// Method to update status with history tracking
facultyApprovalSchema.methods.updateStatus = function (
  newStatus,
  performedBy,
  notes = ""
) {
  const previousStatus = this.status;
  this.status = newStatus;
  this.addHistoryEntry(
    "status_changed",
    performedBy,
    notes,
    previousStatus,
    newStatus
  );

  // Update workflow stage based on status
  switch (newStatus) {
    case "pending":
      this.workflow.currentStage = "submitted";
      break;
    case "under_review":
      this.workflow.currentStage = "initial_review";
      break;
    case "approved":
      this.workflow.currentStage = "completed";
      this.workflow.completedAt = new Date();
      break;
    case "rejected":
      this.workflow.currentStage = "completed";
      this.workflow.completedAt = new Date();
      break;
    case "requires_changes":
      this.workflow.currentStage = "detailed_review";
      break;
  }
};

// Method to calculate review duration
facultyApprovalSchema.methods.calculateReviewDuration = function () {
  if (this.reviewDetails.submittedAt && this.reviewDetails.reviewedAt) {
    const duration =
      this.reviewDetails.reviewedAt - this.reviewDetails.submittedAt;
    this.reviewDetails.reviewDuration = Math.round(duration / (1000 * 60)); // Convert to minutes
  }
};

// Method to check if review is overdue
facultyApprovalSchema.methods.isOverdue = function () {
  if (!this.workflow.dueDate) return false;
  return new Date() > this.workflow.dueDate && this.status === "pending";
};

// Method to escalate approval
facultyApprovalSchema.methods.escalate = function (reason, escalatedBy) {
  this.workflow.escalationLevel += 1;
  this.workflow.escalationReason = reason;
  this.addHistoryEntry("escalated", escalatedBy, `Escalated: ${reason}`);
};

// Static method to get faculty workload
facultyApprovalSchema.statics.getFacultyWorkload = function (facultyId) {
  return this.aggregate([
    { $match: { facultyId: mongoose.Types.ObjectId(facultyId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
      },
    },
  ]);
};

// Static method to get department statistics
facultyApprovalSchema.statics.getDepartmentStats = function (department) {
  return this.aggregate([
    { $match: { department } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgScore: { $avg: "$scoring.overallScore" },
      },
    },
  ]);
};

// Virtual for approval progress percentage
facultyApprovalSchema.virtual("progressPercentage").get(function () {
  const stageProgress = {
    submitted: 20,
    initial_review: 40,
    detailed_review: 60,
    verification: 80,
    final_review: 90,
    completed: 100,
  };

  return stageProgress[this.workflow.currentStage] || 0;
});

// Virtual for time since submission
facultyApprovalSchema.virtual("timeSinceSubmission").get(function () {
  if (!this.reviewDetails.submittedAt) return 0;
  return Math.floor(
    (new Date() - this.reviewDetails.submittedAt) / (1000 * 60 * 60 * 24)
  ); // days
});

// Indexes for performance
facultyApprovalSchema.index({ activityId: 1 });
facultyApprovalSchema.index({ facultyId: 1 });
facultyApprovalSchema.index({ status: 1 });
facultyApprovalSchema.index({ createdAt: -1 });
facultyApprovalSchema.index({ "reviewDetails.submittedAt": -1 });
facultyApprovalSchema.index({ "workflow.dueDate": 1 });

// Compound indexes
facultyApprovalSchema.index({ facultyId: 1, status: 1 });
facultyApprovalSchema.index({ status: 1, "workflow.dueDate": 1 });
facultyApprovalSchema.index({ facultyId: 1, createdAt: -1 });

module.exports = mongoose.model("FacultyApproval", facultyApprovalSchema);
