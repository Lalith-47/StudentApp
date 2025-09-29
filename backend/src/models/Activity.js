const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, "Activity title is required"],
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: [true, "Activity description is required"],
    trim: true,
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  category: {
    type: String,
    required: [true, "Activity category is required"],
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
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, "Subcategory cannot exceed 100 characters"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return !value || value >= this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  duration: {
    value: {
      type: Number,
      min: [0, "Duration must be positive"],
    },
    unit: {
      type: String,
      enum: ["hours", "days", "weeks", "months"],
      default: "hours",
    },
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, "Location cannot exceed 200 characters"],
  },
  organizer: {
    type: String,
    trim: true,
    maxlength: [200, "Organizer name cannot exceed 200 characters"],
  },
  skills: [
    {
      type: String,
      trim: true,
      maxlength: [50, "Skill name cannot exceed 50 characters"],
    },
  ],
  achievements: [
    {
      type: String,
      trim: true,
      maxlength: [200, "Achievement description cannot exceed 200 characters"],
    },
  ],
  attachments: [
    {
      filename: {
        type: String,
        required: true,
      },
      originalName: {
        type: String,
        required: true,
      },
      mimeType: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "pending", "approved", "rejected", "under_review"],
    default: "draft",
    index: true,
  },
  approval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectedAt: Date,
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
    },
    reviewNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Review notes cannot exceed 1000 characters"],
    },
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: Date,
    verificationMethod: {
      type: String,
      enum: ["document", "witness", "official_record", "other"],
    },
    verificationNotes: {
      type: String,
      trim: true,
      maxlength: [500, "Verification notes cannot exceed 500 characters"],
    },
  },
  impact: {
    personalGrowth: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    academicRelevance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    careerRelevance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    socialImpact: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [30, "Tag cannot exceed 30 characters"],
    },
  ],
  isPublic: {
    type: Boolean,
    default: true,
  },
  isHighlighted: {
    type: Boolean,
    default: false,
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
activitySchema.index({ studentId: 1, status: 1 });
activitySchema.index({ category: 1, status: 1 });
activitySchema.index({ startDate: -1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ "approval.approvedBy": 1 });

// Update timestamp on save
activitySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for duration in hours
activitySchema.virtual("durationInHours").get(function () {
  if (!this.duration.value) return 0;

  const multipliers = {
    hours: 1,
    days: 24,
    weeks: 168,
    months: 720,
  };

  return this.duration.value * (multipliers[this.duration.unit] || 1);
});

// Virtual for activity status display
activitySchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    draft: "Draft",
    pending: "Pending Review",
    approved: "Approved",
    rejected: "Rejected",
    under_review: "Under Review",
  };

  return statusMap[this.status] || this.status;
});

// Method to calculate total impact score
activitySchema.methods.getTotalImpactScore = function () {
  const { personalGrowth, academicRelevance, careerRelevance, socialImpact } =
    this.impact;
  return (
    (personalGrowth + academicRelevance + careerRelevance + socialImpact) / 4
  );
};

// Method to check if activity is recent (within last 6 months)
activitySchema.methods.isRecent = function () {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return this.startDate >= sixMonthsAgo;
};

// Static method to get activities by category
activitySchema.statics.getByCategory = function (category, limit = 10) {
  return this.find({ category, status: "approved" })
    .populate("studentId", "name email")
    .sort({ startDate: -1 })
    .limit(limit);
};

// Static method to get student's activity summary
activitySchema.statics.getStudentSummary = function (studentId) {
  return this.aggregate([
    { $match: { studentId: mongoose.Types.ObjectId(studentId) } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
        totalHours: { $sum: "$durationInHours" },
        avgImpact: {
          $avg: {
            $avg: [
              "$impact.personalGrowth",
              "$impact.academicRelevance",
              "$impact.careerRelevance",
              "$impact.socialImpact",
            ],
          },
        },
      },
    },
  ]);
};

// Indexes for performance
activitySchema.index({ studentId: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ category: 1 });
activitySchema.index({ createdAt: -1 });
activitySchema.index({ startDate: 1 });
activitySchema.index({ endDate: 1 });

// Compound indexes
activitySchema.index({ studentId: 1, status: 1 });
activitySchema.index({ studentId: 1, category: 1 });
activitySchema.index({ status: 1, createdAt: -1 });
activitySchema.index({ category: 1, status: 1 });

// Text search index
activitySchema.index({
  title: "text",
  description: "text",
  skills: "text",
  achievements: "text",
});

module.exports = mongoose.model("Activity", activitySchema);
