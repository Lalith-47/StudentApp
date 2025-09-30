const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Title cannot exceed 200 characters"],
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [5000, "Content cannot exceed 5000 characters"],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  targetAudience: {
    type: String,
    enum: [
      "all",
      "students",
      "faculty",
      "specific-course",
      "specific-students",
    ],
    default: "students",
  },
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },
  type: {
    type: String,
    enum: ["general", "assignment", "exam", "course", "system", "emergency"],
    default: "general",
  },
  attachments: [
    {
      filename: String,
      originalName: String,
      url: String,
      type: String,
      size: Number,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  schedule: {
    publishAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: Date,
    isScheduled: {
      type: Boolean,
      default: false,
    },
  },
  visibility: {
    isPublic: {
      type: Boolean,
      default: true,
    },
    requireAcknowledgment: {
      type: Boolean,
      default: false,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
  },
  delivery: {
    email: {
      type: Boolean,
      default: true,
    },
    sms: {
      type: Boolean,
      default: false,
    },
    pushNotification: {
      type: Boolean,
      default: true,
    },
    inApp: {
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
      },
    ],
    acknowledgments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        acknowledgedAt: {
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
  },
  analytics: {
    totalViews: {
      type: Number,
      default: 0,
    },
    totalAcknowledgments: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    viewRate: {
      type: Number,
      default: 0,
    },
    acknowledgmentRate: {
      type: Number,
      default: 0,
    },
  },
  status: {
    type: String,
    enum: ["draft", "scheduled", "published", "archived", "deleted"],
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
announcementSchema.index({ authorId: 1, status: 1 });
announcementSchema.index({ courseId: 1, status: 1 });
announcementSchema.index({ targetAudience: 1, status: 1 });
announcementSchema.index({ "schedule.publishAt": 1 });
announcementSchema.index({ priority: 1, status: 1 });
announcementSchema.index({ createdAt: -1 });

// Update timestamp on save
announcementSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate analytics
  this.analytics.totalViews = this.interactions.views.length;
  this.analytics.totalAcknowledgments =
    this.interactions.acknowledgments.length;
  this.analytics.totalComments = this.interactions.comments.length;

  // Calculate rates based on recipients
  if (this.recipients.length > 0) {
    this.analytics.viewRate =
      (this.analytics.totalViews / this.recipients.length) * 100;
    this.analytics.acknowledgmentRate =
      (this.analytics.totalAcknowledgments / this.recipients.length) * 100;
  }

  next();
});

// Method to view announcement
announcementSchema.methods.viewAnnouncement = function (userId) {
  const existingView = this.interactions.views.find(
    (view) => view.userId.toString() === userId.toString()
  );

  if (!existingView) {
    this.interactions.views.push({
      userId,
      viewedAt: new Date(),
    });
    this.analytics.totalViews += 1;
  }
};

// Method to acknowledge announcement
announcementSchema.methods.acknowledgeAnnouncement = function (userId) {
  const existingAcknowledgment = this.interactions.acknowledgments.find(
    (ack) => ack.userId.toString() === userId.toString()
  );

  if (!existingAcknowledgment) {
    this.interactions.acknowledgments.push({
      userId,
      acknowledgedAt: new Date(),
    });
    this.analytics.totalAcknowledgments += 1;
  }
};

// Method to add comment
announcementSchema.methods.addComment = function (userId, content) {
  if (!this.visibility.allowComments) {
    throw new Error("Comments are not allowed for this announcement");
  }

  this.interactions.comments.push({
    userId,
    content,
    createdAt: new Date(),
  });
  this.analytics.totalComments += 1;
};

// Method to edit comment
announcementSchema.methods.editComment = function (
  commentId,
  newContent,
  userId
) {
  const comment = this.interactions.comments.id(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized to edit this comment");
  }

  comment.content = newContent;
  comment.isEdited = true;
  comment.editedAt = new Date();
};

// Method to delete comment
announcementSchema.methods.deleteComment = function (commentId, userId) {
  const comment = this.interactions.comments.id(commentId);

  if (!comment) {
    throw new Error("Comment not found");
  }

  if (comment.userId.toString() !== userId.toString()) {
    throw new Error("Unauthorized to delete this comment");
  }

  this.interactions.comments.pull(commentId);
  this.analytics.totalComments -= 1;
};

// Static method to get announcements for user
announcementSchema.statics.getAnnouncementsForUser = function (
  userId,
  userRole,
  courseIds = []
) {
  const matchStage = {
    status: "published",
    "schedule.publishAt": { $lte: new Date() },
    $or: [
      { "schedule.expiresAt": { $gt: new Date() } },
      { "schedule.expiresAt": { $exists: false } },
    ],
  };

  // Add role-based filtering
  if (userRole === "student") {
    matchStage.$and = [
      {
        $or: [
          { targetAudience: "all" },
          { targetAudience: "students" },
          { targetAudience: "specific-students", recipients: userId },
          { targetAudience: "specific-course", courseId: { $in: courseIds } },
        ],
      },
    ];
  } else if (userRole === "faculty") {
    matchStage.$and = [
      {
        $or: [
          { targetAudience: "all" },
          { targetAudience: "faculty" },
          { targetAudience: "specific-course", courseId: { $in: courseIds } },
          { authorId: userId },
        ],
      },
    ];
  }

  return this.find(matchStage)
    .populate("authorId", "name email")
    .populate("courseId", "title code")
    .sort({ priority: -1, createdAt: -1 });
};

// Static method to get announcement analytics
announcementSchema.statics.getAnnouncementAnalytics = function (
  authorId,
  startDate,
  endDate
) {
  const matchStage = { authorId: mongoose.Types.ObjectId(authorId) };

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
        totalAnnouncements: { $sum: 1 },
        totalViews: { $sum: "$analytics.totalViews" },
        totalAcknowledgments: { $sum: "$analytics.totalAcknowledgments" },
        totalComments: { $sum: "$analytics.totalComments" },
        averageViewRate: { $avg: "$analytics.viewRate" },
        averageAcknowledgmentRate: { $avg: "$analytics.acknowledgmentRate" },
      },
    },
    {
      $project: {
        totalAnnouncements: 1,
        totalViews: 1,
        totalAcknowledgments: 1,
        totalComments: 1,
        averageViewRate: { $round: ["$averageViewRate", 2] },
        averageAcknowledgmentRate: {
          $round: ["$averageAcknowledgmentRate", 2],
        },
      },
    },
  ]);
};

// Static method to get bulk messaging analytics
announcementSchema.statics.getBulkMessagingAnalytics = function (
  startDate,
  endDate
) {
  const matchStage = {
    status: "published",
    createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$targetAudience",
        count: { $sum: 1 },
        totalRecipients: { $sum: { $size: "$recipients" } },
        totalViews: { $sum: "$analytics.totalViews" },
        totalAcknowledgments: { $sum: "$analytics.totalAcknowledgments" },
        averageViewRate: { $avg: "$analytics.viewRate" },
      },
    },
    {
      $project: {
        targetAudience: "$_id",
        count: 1,
        totalRecipients: 1,
        totalViews: 1,
        totalAcknowledgments: 1,
        averageViewRate: { $round: ["$averageViewRate", 2] },
        engagementRate: {
          $round: [
            {
              $multiply: [
                { $divide: ["$totalAcknowledgments", "$totalRecipients"] },
                100,
              ],
            },
            2,
          ],
        },
      },
    },
  ]);
};

module.exports = mongoose.model("Announcement", announcementSchema);

