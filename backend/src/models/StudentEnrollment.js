const mongoose = require("mongoose");

const studentEnrollmentSchema = new mongoose.Schema({
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
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["enrolled", "dropped", "completed", "incomplete", "withdrawn"],
    default: "enrolled",
  },
  finalGrade: {
    type: String,
    enum: ["A", "B", "C", "D", "F", "I", "W", "P", "NP"],
  },
  finalGPA: {
    type: Number,
    min: 0,
    max: 4.0,
  },
  attendance: {
    totalClasses: { type: Number, default: 0 },
    attendedClasses: { type: Number, default: 0 },
    attendanceRate: { type: Number, default: 0 },
    lastAttended: Date,
  },
  assignments: {
    total: { type: Number, default: 0 },
    submitted: { type: Number, default: 0 },
    graded: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
  },
  bookmarks: [
    {
      type: {
        type: String,
        enum: ["lecture", "assignment", "resource", "announcement"],
      },
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      title: String,
      bookmarkedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  notes: [
    {
      title: String,
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: Date,
      tags: [String],
    },
  ],
  progress: {
    overall: { type: Number, default: 0, min: 0, max: 100 },
    byModule: [
      {
        moduleId: mongoose.Schema.Types.ObjectId,
        moduleName: String,
        progress: { type: Number, default: 0, min: 0, max: 100 },
        lastAccessed: Date,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      assignmentReminders: { type: Boolean, default: true },
      gradeUpdates: { type: Boolean, default: true },
      attendanceAlerts: { type: Boolean, default: true },
    },
    studyMode: {
      type: String,
      enum: ["visual", "auditory", "kinesthetic", "reading"],
      default: "visual",
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
  },
  analytics: {
    studyTime: { type: Number, default: 0 }, // in minutes
    loginFrequency: { type: Number, default: 0 },
    resourceDownloads: { type: Number, default: 0 },
    forumParticipation: { type: Number, default: 0 },
    averageSessionDuration: { type: Number, default: 0 },
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
studentEnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });
studentEnrollmentSchema.index({ studentId: 1, status: 1 });
studentEnrollmentSchema.index({ courseId: 1, status: 1 });
studentEnrollmentSchema.index({ "bookmarks.itemId": 1 });
studentEnrollmentSchema.index({ "progress.lastUpdated": -1 });

// Update timestamp on save
studentEnrollmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate attendance rate
  if (this.attendance.totalClasses > 0) {
    this.attendance.attendanceRate =
      (this.attendance.attendedClasses / this.attendance.totalClasses) * 100;
  }

  // Calculate overall progress
  if (this.progress.byModule.length > 0) {
    const totalProgress = this.progress.byModule.reduce(
      (sum, module) => sum + module.progress,
      0
    );
    this.progress.overall = totalProgress / this.progress.byModule.length;
  }

  next();
});

// Method to add bookmark
studentEnrollmentSchema.methods.addBookmark = function (type, itemId, title) {
  const existingBookmark = this.bookmarks.find(
    (bookmark) => bookmark.itemId.toString() === itemId.toString()
  );

  if (!existingBookmark) {
    this.bookmarks.push({
      type,
      itemId,
      title,
      bookmarkedAt: new Date(),
    });
  }

  return this.save();
};

// Method to remove bookmark
studentEnrollmentSchema.methods.removeBookmark = function (itemId) {
  this.bookmarks = this.bookmarks.filter(
    (bookmark) => bookmark.itemId.toString() !== itemId.toString()
  );

  return this.save();
};

// Method to add note
studentEnrollmentSchema.methods.addNote = function (title, content, tags = []) {
  this.notes.push({
    title,
    content,
    tags,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return this.save();
};

// Method to update progress
studentEnrollmentSchema.methods.updateProgress = function (
  moduleId,
  progress,
  moduleName
) {
  const moduleIndex = this.progress.byModule.findIndex(
    (module) => module.moduleId.toString() === moduleId.toString()
  );

  if (moduleIndex !== -1) {
    this.progress.byModule[moduleIndex].progress = progress;
    this.progress.byModule[moduleIndex].lastAccessed = new Date();
  } else {
    this.progress.byModule.push({
      moduleId,
      moduleName,
      progress,
      lastAccessed: new Date(),
    });
  }

  this.progress.lastUpdated = new Date();
  return this.save();
};

// Static method to get student's enrolled courses
studentEnrollmentSchema.statics.getStudentCourses = function (
  studentId,
  status = "enrolled"
) {
  return this.find({ studentId, status })
    .populate("courseId", "title code description facultyId schedule")
    .populate("courseId.facultyId", "name email")
    .sort({ enrolledAt: -1 });
};

// Static method to get course enrollment stats
studentEnrollmentSchema.statics.getCourseStats = function (courseId) {
  return this.aggregate([
    { $match: { courseId: mongoose.Types.ObjectId(courseId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        averageAttendance: { $avg: "$attendance.attendanceRate" },
        averageProgress: { $avg: "$progress.overall" },
      },
    },
  ]);
};

module.exports = mongoose.model("StudentEnrollment", studentEnrollmentSchema);

