const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Course title cannot exceed 200 characters"],
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: [20, "Course code cannot exceed 20 characters"],
    index: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [2000, "Course description cannot exceed 2000 characters"],
  },
  credits: {
    type: Number,
    required: true,
    min: [1, "Credits must be at least 1"],
    max: [10, "Credits cannot exceed 10"],
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: String,
    required: true,
    enum: ["Fall", "Spring", "Summer", "Winter"],
  },
  academicYear: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{4}$/, "Academic year must be in format YYYY-YYYY"],
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  coInstructors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  enrolledStudents: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      enrolledAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["enrolled", "dropped", "completed", "incomplete"],
        default: "enrolled",
      },
    },
  ],
  schedule: {
    days: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    startTime: String,
    endTime: String,
    location: String,
    room: String,
    online: {
      type: Boolean,
      default: false,
    },
    meetingLink: String,
  },
  syllabus: {
    filename: String,
    originalName: String,
    url: String,
    uploadedAt: Date,
    version: {
      type: String,
      default: "1.0",
    },
  },
  modules: [
    {
      title: String,
      description: String,
      order: Number,
      startDate: Date,
      endDate: Date,
      content: [
        {
          type: {
            type: String,
            enum: [
              "lecture",
              "assignment",
              "quiz",
              "exam",
              "project",
              "reading",
            ],
          },
          title: String,
          description: String,
          dueDate: Date,
          points: Number,
          resources: [
            {
              filename: String,
              originalName: String,
              url: String,
              type: String,
              uploadedAt: Date,
            },
          ],
        },
      ],
    },
  ],
  grading: {
    scheme: [
      {
        category: {
          type: String,
          enum: [
            "assignments",
            "quizzes",
            "exams",
            "projects",
            "participation",
            "attendance",
          ],
        },
        weight: {
          type: Number,
          min: 0,
          max: 100,
        },
        count: Number,
        dropLowest: {
          type: Number,
          default: 0,
        },
      },
    ],
    scale: {
      type: String,
      enum: ["percentage", "points", "letter"],
      default: "percentage",
    },
    totalPoints: {
      type: Number,
      default: 100,
    },
  },
  settings: {
    allowLateSubmissions: {
      type: Boolean,
      default: false,
    },
    latePenalty: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    requireAttendance: {
      type: Boolean,
      default: true,
    },
    attendanceWeight: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    enableDiscussions: {
      type: Boolean,
      default: true,
    },
    enableAnnouncements: {
      type: Boolean,
      default: true,
    },
    autoGrade: {
      type: Boolean,
      default: false,
    },
  },
  status: {
    type: String,
    enum: ["draft", "active", "archived", "completed"],
    default: "draft",
  },
  analytics: {
    totalStudents: {
      type: Number,
      default: 0,
    },
    activeStudents: {
      type: Number,
      default: 0,
    },
    averageGrade: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    lastAccessed: Date,
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
courseSchema.index({ facultyId: 1, status: 1 });
courseSchema.index({ department: 1, semester: 1 });
courseSchema.index({ "enrolledStudents.studentId": 1 });

// Update timestamp on save
courseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for enrollment count
courseSchema.virtual("enrollmentCount").get(function () {
  return this.enrolledStudents.filter(
    (student) => student.status === "enrolled"
  ).length;
});

// Method to add student to course
courseSchema.methods.enrollStudent = function (studentId) {
  const existingEnrollment = this.enrolledStudents.find(
    (enrollment) => enrollment.studentId.toString() === studentId.toString()
  );

  if (!existingEnrollment) {
    this.enrolledStudents.push({
      studentId,
      enrolledAt: new Date(),
      status: "enrolled",
    });
    this.analytics.totalStudents += 1;
    this.analytics.activeStudents += 1;
  }
};

// Method to remove student from course
courseSchema.methods.dropStudent = function (studentId) {
  const enrollmentIndex = this.enrolledStudents.findIndex(
    (enrollment) => enrollment.studentId.toString() === studentId.toString()
  );

  if (enrollmentIndex !== -1) {
    this.enrolledStudents[enrollmentIndex].status = "dropped";
    this.analytics.activeStudents -= 1;
  }
};

// Static method to get faculty courses
courseSchema.statics.getFacultyCourses = function (facultyId, status = null) {
  const filter = { facultyId };
  if (status) filter.status = status;

  return this.find(filter)
    .populate("enrolledStudents.studentId", "name email")
    .populate("coInstructors", "name email")
    .sort({ createdAt: -1 });
};

// Static method to get course analytics
courseSchema.statics.getCourseAnalytics = function (courseId) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(courseId) } },
    {
      $lookup: {
        from: "assignments",
        localField: "_id",
        foreignField: "courseId",
        as: "assignments",
      },
    },
    {
      $lookup: {
        from: "attendances",
        localField: "_id",
        foreignField: "courseId",
        as: "attendance",
      },
    },
    {
      $project: {
        title: 1,
        code: 1,
        totalStudents: { $size: "$enrolledStudents" },
        totalAssignments: { $size: "$assignments" },
        averageAttendance: {
          $avg: "$attendance.attendanceRate",
        },
        lastActivity: {
          $max: ["$updatedAt", "$assignments.updatedAt"],
        },
      },
    },
  ]);
};

module.exports = mongoose.model("Course", courseSchema);
