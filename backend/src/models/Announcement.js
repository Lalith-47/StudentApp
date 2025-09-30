const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Announcement content is required"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    targetAudience: {
      type: String,
      enum: ["all", "students", "faculty", "admin", "specific"],
      default: "all",
    },
    targetUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "scheduled", "archived"],
      default: "draft",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    scheduledDate: {
      type: Date,
    },
    scheduledTime: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"],
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
      },
    ],
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    readCount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    category: {
      type: String,
      enum: [
        "general",
        "academic",
        "administrative",
        "maintenance",
        "security",
        "event",
      ],
      default: "general",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      location: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
announcementSchema.index({ title: "text", content: "text" });
announcementSchema.index({ status: 1 });
announcementSchema.index({ priority: 1 });
announcementSchema.index({ targetAudience: 1 });
announcementSchema.index({ publishedAt: -1 });
announcementSchema.index({ scheduledDate: 1 });
announcementSchema.index({ isPinned: 1, publishedAt: -1 });
announcementSchema.index({ author: 1 });
announcementSchema.index({ createdAt: -1 });

// Virtual for read percentage
announcementSchema.virtual("readPercentage").get(function () {
  if (!this.targetUsers || this.targetUsers.length === 0) return 0;
  return Math.round((this.readCount / this.targetUsers.length) * 100);
});

// Virtual for time until scheduled
announcementSchema.virtual("timeUntilScheduled").get(function () {
  if (!this.scheduledDate || !this.isScheduled) return null;
  const now = new Date();
  const scheduled = new Date(
    `${this.scheduledDate}T${this.scheduledTime || "00:00"}`
  );
  return scheduled - now;
});

// Virtual for is expired
announcementSchema.virtual("isExpired").get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Pre-save middleware
announcementSchema.pre("save", function (next) {
  // Set published date when status changes to published
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }

  // Validate scheduled date
  if (
    this.isScheduled &&
    this.scheduledDate &&
    this.scheduledDate <= new Date()
  ) {
    const error = new Error("Scheduled date must be in the future");
    return next(error);
  }

  // Validate expiry date
  if (
    this.expiresAt &&
    this.publishedAt &&
    this.expiresAt <= this.publishedAt
  ) {
    const error = new Error("Expiry date must be after published date");
    return next(error);
  }

  next();
});

// Static method to get published announcements
announcementSchema.statics.findPublished = function (targetAudience = "all") {
  const query = {
    status: "published",
    isVisible: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  };

  if (targetAudience !== "all") {
    query.targetAudience = { $in: ["all", targetAudience] };
  }

  return this.find(query)
    .populate("author", "name email")
    .sort({ isPinned: -1, publishedAt: -1 });
};

// Static method to get scheduled announcements
announcementSchema.statics.findScheduled = function () {
  return this.find({
    status: "scheduled",
    isScheduled: true,
    scheduledDate: { $lte: new Date() },
  });
};

// Static method to get announcements by priority
announcementSchema.statics.findByPriority = function (priority) {
  return this.find({ priority, status: "published" })
    .populate("author", "name email")
    .sort({ publishedAt: -1 });
};

// Instance method to mark as read
announcementSchema.methods.markAsRead = function (userId) {
  const existingRead = this.readBy.find(
    (read) => read.user.toString() === userId.toString()
  );

  if (!existingRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
    this.readCount = this.readBy.length;
    return this.save();
  }

  return Promise.resolve(this);
};

// Instance method to check if user has read
announcementSchema.methods.hasUserRead = function (userId) {
  return this.readBy.some((read) => read.user.toString() === userId.toString());
};

// Instance method to get unread users
announcementSchema.methods.getUnreadUsers = function () {
  if (this.targetAudience === "all" || this.targetAudience === "specific") {
    return this.targetUsers.filter(
      (userId) =>
        !this.readBy.some((read) => read.user.toString() === userId.toString())
    );
  }
  return [];
};

module.exports = mongoose.model("Announcement", announcementSchema);
