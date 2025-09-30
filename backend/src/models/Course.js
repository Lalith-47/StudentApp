const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [200, "Course title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      maxlength: [1000, "Course description cannot exceed 1000 characters"],
    },
    instructor: {
      type: String,
      required: [true, "Instructor name is required"],
      trim: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      enum: ["1", "2", "3", "4", "5", "6", "7", "8"],
    },
    credits: {
      type: Number,
      required: [true, "Credits are required"],
      min: [1, "Credits must be at least 1"],
      max: [6, "Credits cannot exceed 6"],
    },
    maxStudents: {
      type: Number,
      default: 50,
      min: [1, "Maximum students must be at least 1"],
      max: [200, "Maximum students cannot exceed 200"],
    },
    enrolledStudents: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
    prerequisites: {
      type: String,
      trim: true,
    },
    objectives: {
      type: String,
      trim: true,
    },
    syllabus: {
      type: String,
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    schedule: {
      days: [{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      }],
      time: {
        start: String,
        end: String,
      },
      room: String,
    },
    assessment: {
      assignments: {
        weight: { type: Number, default: 30, min: 0, max: 100 },
        count: { type: Number, default: 0 },
      },
      exams: {
        weight: { type: Number, default: 50, min: 0, max: 100 },
        count: { type: Number, default: 0 },
      },
      projects: {
        weight: { type: Number, default: 20, min: 0, max: 100 },
        count: { type: Number, default: 0 },
      },
    },
    resources: [{
      title: String,
      type: {
        type: String,
        enum: ["document", "video", "link", "book"],
      },
      url: String,
      description: String,
    }],
    tags: [String],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    language: {
      type: String,
      default: "English",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ instructorId: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ semester: 1 });
courseSchema.index({ createdAt: -1 });

// Virtual for enrollment percentage
courseSchema.virtual("enrollmentPercentage").get(function () {
  if (this.maxStudents === 0) return 0;
  return Math.round((this.enrolledStudents / this.maxStudents) * 100);
});

// Virtual for course duration in days
courseSchema.virtual("duration").get(function () {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to validate dates
courseSchema.pre("save", function (next) {
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    const error = new Error("End date must be after start date");
    return next(error);
  }
  next();
});

// Static method to get courses by instructor
courseSchema.statics.findByInstructor = function (instructorId) {
  return this.find({ instructorId }).populate("instructorId", "name email");
};

// Static method to get active courses
courseSchema.statics.findActive = function () {
  return this.find({ status: "active" });
};

// Instance method to check if course is full
courseSchema.methods.isFull = function () {
  return this.enrolledStudents >= this.maxStudents;
};

// Instance method to check if enrollment is open
courseSchema.methods.isEnrollmentOpen = function () {
  const now = new Date();
  return this.status === "active" && now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model("Course", courseSchema);