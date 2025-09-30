const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
  },
  sessionType: {
    type: String,
    enum: [
      "video",
      "reading",
      "assignment",
      "quiz",
      "discussion",
      "note-taking",
    ],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: Date,
  duration: {
    type: Number, // in minutes
    default: 0,
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  completionStatus: {
    type: String,
    enum: ["in-progress", "completed", "paused", "abandoned"],
    default: "in-progress",
  },
  notes: [
    {
      timestamp: Number, // for video/audio resources
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  bookmarks: [
    {
      timestamp: Number,
      title: String,
      description: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  interactions: {
    pauses: [
      {
        timestamp: Number,
        duration: Number,
        reason: String,
      },
    ],
    replays: [
      {
        fromTimestamp: Number,
        toTimestamp: Number,
        count: Number,
      },
    ],
    speedChanges: [
      {
        timestamp: Number,
        newSpeed: Number,
        previousSpeed: Number,
      },
    ],
  },
  performance: {
    focusScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    comprehensionScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    retentionScore: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  aiInsights: {
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
    recommendedReviewTime: Date,
    keyConcepts: [String],
    studyTips: [String],
    relatedResources: [
      {
        resourceId: mongoose.Schema.Types.ObjectId,
        title: String,
        relevance: Number,
      },
    ],
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
studySessionSchema.index({ studentId: 1, courseId: 1 });
studySessionSchema.index({ startTime: -1 });
studySessionSchema.index({ resourceId: 1 });
studySessionSchema.index({ completionStatus: 1 });

// Update timestamp on save
studySessionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate duration if endTime is set
  if (this.endTime && this.startTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
  }

  next();
});

// Method to add note
studySessionSchema.methods.addNote = function (timestamp, content) {
  this.notes.push({
    timestamp,
    content,
    createdAt: new Date(),
  });

  return this.save();
};

// Method to add bookmark
studySessionSchema.methods.addBookmark = function (
  timestamp,
  title,
  description
) {
  this.bookmarks.push({
    timestamp,
    title,
    description,
    createdAt: new Date(),
  });

  return this.save();
};

// Method to pause session
studySessionSchema.methods.pause = function (
  timestamp,
  reason = "Manual pause"
) {
  this.interactions.pauses.push({
    timestamp,
    duration: 0, // Will be calculated when resumed
    reason,
  });

  this.completionStatus = "paused";
  return this.save();
};

// Method to resume session
studySessionSchema.methods.resume = function () {
  if (this.completionStatus === "paused") {
    this.completionStatus = "in-progress";
  }

  return this.save();
};

// Method to complete session
studySessionSchema.methods.complete = function () {
  this.endTime = new Date();
  this.completionStatus = "completed";
  this.progress = 100;

  return this.save();
};

// Static method to get student study sessions
studySessionSchema.statics.getStudentSessions = function (
  studentId,
  courseId = null,
  limit = 50
) {
  const filter = { studentId };
  if (courseId) filter.courseId = courseId;

  return this.find(filter)
    .populate("courseId", "title code")
    .populate("resourceId", "title type")
    .sort({ startTime: -1 })
    .limit(limit);
};

// Static method to get study analytics
studySessionSchema.statics.getStudyAnalytics = function (
  studentId,
  courseId = null,
  days = 30
) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const matchStage = {
    studentId: new mongoose.Types.ObjectId(studentId),
    startTime: { $gte: startDate },
  };

  if (courseId) {
    matchStage.courseId = new mongoose.Types.ObjectId(courseId);
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalStudyTime: { $sum: "$duration" },
        averageSessionDuration: { $avg: "$duration" },
        completedSessions: {
          $sum: { $cond: [{ $eq: ["$completionStatus", "completed"] }, 1, 0] },
        },
        averageProgress: { $avg: "$progress" },
        sessionTypes: {
          $push: "$sessionType",
        },
        averageFocusScore: { $avg: "$performance.focusScore" },
        averageComprehensionScore: { $avg: "$performance.comprehensionScore" },
      },
    },
  ]);
};

// Static method to get study streaks
studySessionSchema.statics.getStudyStreaks = function (
  studentId,
  courseId = null
) {
  const matchStage = { studentId };
  if (courseId) matchStage.courseId = courseId;

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$startTime",
          },
        },
        studyTime: { $sum: "$duration" },
        sessions: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } },
    {
      $group: {
        _id: null,
        studyDays: { $push: "$$ROOT" },
        currentStreak: {
          $reduce: {
            input: "$studyDays",
            initialValue: 0,
            in: {
              $cond: [
                {
                  $and: [
                    { $gte: ["$$value", 0] },
                    { $gt: ["$$this.studyTime", 0] },
                  ],
                },
                { $add: ["$$value", 1] },
                0,
              ],
            },
          },
        },
      },
    },
  ]);
};

module.exports = mongoose.model("StudySession", studySessionSchema);

