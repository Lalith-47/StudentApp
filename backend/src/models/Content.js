const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, "Description cannot exceed 2000 characters"],
  },
  type: {
    type: String,
    required: true,
    enum: [
      "document",
      "presentation",
      "video",
      "audio",
      "image",
      "link",
      "folder",
    ],
  },
  category: {
    type: String,
    required: true,
    enum: [
      "lecture",
      "assignment",
      "reference",
      "multimedia",
      "resource",
      "other",
    ],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course.modules",
  },
  files: [
    {
      filename: String,
      originalName: String,
      url: String,
      size: Number,
      mimeType: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      version: {
        type: String,
        default: "1.0",
      },
    },
  ],
  metadata: {
    duration: Number, // for videos/audio
    pages: Number, // for documents
    resolution: String, // for images/videos
    format: String,
    tags: [String],
    language: String,
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
  },
  access: {
    isPublic: {
      type: Boolean,
      default: false,
    },
    requiresLogin: {
      type: Boolean,
      default: true,
    },
    allowedRoles: [
      {
        type: String,
        enum: ["student", "faculty", "admin"],
      },
    ],
    allowedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expirationDate: Date,
  },
  sharing: {
    shareableLink: String,
    embedCode: String,
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isDownloadable: {
      type: Boolean,
      default: true,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
  },
  interactions: {
    views: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: {
          type: Date,
          default: Date.now,
        },
        duration: Number, // viewing duration in seconds
      },
    ],
    downloads: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        downloadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isEdited: {
          type: Boolean,
          default: false,
        },
        editedAt: Date,
      },
    ],
    ratings: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  analytics: {
    totalViews: {
      type: Number,
      default: 0,
    },
    totalDownloads: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    popularityScore: {
      type: Number,
      default: 0,
    },
  },
  organization: {
    parentFolder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    },
    folderPath: String,
    sortOrder: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  status: {
    type: String,
    enum: ["draft", "published", "archived", "deleted"],
    default: "draft",
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
contentSchema.index({ facultyId: 1, status: 1 });
contentSchema.index({ courseId: 1, status: 1 });
contentSchema.index({ type: 1, category: 1 });
contentSchema.index({ "access.isPublic": 1, status: 1 });
contentSchema.index({ "sharing.shareableLink": 1 });
contentSchema.index({ "organization.parentFolder": 1 });
contentSchema.index({ createdAt: -1 });

// Update timestamp on save
contentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate analytics
  this.analytics.totalViews = this.interactions.views.length;
  this.analytics.totalDownloads = this.interactions.downloads.length;
  this.analytics.totalComments = this.interactions.comments.length;

  if (this.interactions.ratings.length > 0) {
    this.analytics.averageRating =
      this.interactions.ratings.reduce(
        (sum, rating) => sum + rating.rating,
        0
      ) / this.interactions.ratings.length;
  }

  // Calculate popularity score based on views, downloads, and ratings
  this.analytics.popularityScore =
    this.analytics.totalViews * 0.4 +
    this.analytics.totalDownloads * 0.4 +
    this.analytics.averageRating * 0.2;

  next();
});

// Method to view content
contentSchema.methods.viewContent = function (userId, duration = 0) {
  const existingView = this.interactions.views.find(
    (view) => view.userId.toString() === userId.toString()
  );

  if (existingView) {
    existingView.viewedAt = new Date();
    existingView.duration = Math.max(existingView.duration || 0, duration);
  } else {
    this.interactions.views.push({
      userId,
      viewedAt: new Date(),
      duration,
    });
    this.analytics.totalViews += 1;
  }
};

// Method to download content
contentSchema.methods.downloadContent = function (userId) {
  this.interactions.downloads.push({
    userId,
    downloadedAt: new Date(),
  });
  this.analytics.totalDownloads += 1;
  this.sharing.downloadCount += 1;
};

// Method to rate content
contentSchema.methods.rateContent = function (userId, rating, review = "") {
  const existingRating = this.interactions.ratings.find(
    (rating) => rating.userId.toString() === userId.toString()
  );

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.review = review;
    existingRating.createdAt = new Date();
  } else {
    this.interactions.ratings.push({
      userId,
      rating,
      review,
      createdAt: new Date(),
    });
  }
};

// Method to add comment
contentSchema.methods.addComment = function (userId, content) {
  if (!this.sharing.allowComments) {
    throw new Error("Comments are not allowed for this content");
  }

  this.interactions.comments.push({
    userId,
    content,
    createdAt: new Date(),
  });
  this.analytics.totalComments += 1;
};

// Method to generate shareable link
contentSchema.methods.generateShareableLink = function () {
  const shareableId = mongoose.Types.ObjectId().toString();
  this.sharing.shareableLink = `/shared/${shareableId}`;
  return this.sharing.shareableLink;
};

// Static method to get content for user
contentSchema.statics.getContentForUser = function (
  userId,
  userRole,
  courseIds = []
) {
  const matchStage = {
    status: "published",
    $or: [
      { "access.isPublic": true },
      { "access.allowedUsers": userId },
      { "access.allowedRoles": userRole },
      { courseId: { $in: courseIds } },
    ],
  };

  // Add expiration check
  matchStage.$and = [
    {
      $or: [
        { "access.expirationDate": { $gt: new Date() } },
        { "access.expirationDate": { $exists: false } },
      ],
    },
  ];

  return this.find(matchStage)
    .populate("facultyId", "name email")
    .populate("courseId", "title code")
    .sort({ "analytics.popularityScore": -1, createdAt: -1 });
};

// Static method to get content analytics
contentSchema.statics.getContentAnalytics = function (
  facultyId,
  startDate,
  endDate
) {
  const matchStage = { facultyId: mongoose.Types.ObjectId(facultyId) };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalContent: { $sum: 1 },
        totalViews: { $sum: "$analytics.totalViews" },
        totalDownloads: { $sum: "$analytics.totalDownloads" },
        totalComments: { $sum: "$analytics.totalComments" },
        averageRating: { $avg: "$analytics.averageRating" },
        contentByType: {
          $push: {
            type: "$type",
            views: "$analytics.totalViews",
            downloads: "$analytics.totalDownloads",
          },
        },
      },
    },
    {
      $project: {
        totalContent: 1,
        totalViews: 1,
        totalDownloads: 1,
        totalComments: 1,
        averageRating: { $round: ["$averageRating", 2] },
        contentByType: 1,
        engagementRate: {
          $round: [
            { $multiply: [{ $divide: ["$totalViews", "$totalContent"] }, 100] },
            2,
          ],
        },
      },
    },
  ]);
};

module.exports = mongoose.model("Content", contentSchema);

