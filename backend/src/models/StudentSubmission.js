const mongoose = require("mongoose");

const studentSubmissionSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      answer: mongoose.Schema.Types.Mixed,
      attachments: [
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
        },
      ],
      timeSpent: Number, // in minutes
      isCorrect: Boolean,
      pointsEarned: Number,
    },
  ],
  score: {
    type: Number,
    default: 0,
    min: 0,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  grade: String,
  feedback: {
    faculty: String,
    ai: String,
    peer: [
      {
        reviewerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        feedback: String,
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  gradedAt: Date,
  isLate: {
    type: Boolean,
    default: false,
  },
  attempt: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    enum: ["draft", "submitted", "graded", "late", "incomplete", "resubmitted"],
    default: "draft",
  },
  plagiarismScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  plagiarismReport: String,
  aiAnalysis: {
    quality: {
      type: Number,
      min: 1,
      max: 5,
    },
    suggestions: [String],
    strengths: [String],
    weaknesses: [String],
    estimatedGrade: String,
  },
  revisionHistory: [
    {
      version: Number,
      submittedAt: Date,
      changes: String,
      score: Number,
      feedback: String,
    },
  ],
  collaboration: {
    collaborators: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        contribution: String,
        approved: Boolean,
      },
    ],
    isGroupSubmission: {
      type: Boolean,
      default: false,
    },
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
studentSubmissionSchema.index(
  { studentId: 1, assignmentId: 1 },
  { unique: true }
);
studentSubmissionSchema.index({ courseId: 1, status: 1 });
studentSubmissionSchema.index({ submittedAt: -1 });
studentSubmissionSchema.index({ gradedAt: -1 });
studentSubmissionSchema.index({ "collaboration.collaborators.studentId": 1 });

// Update timestamp on save
studentSubmissionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate percentage
  if (this.maxScore > 0) {
    this.percentage = (this.score / this.maxScore) * 100;
  }

  // Calculate letter grade based on percentage
  if (this.percentage >= 90) this.grade = "A";
  else if (this.percentage >= 80) this.grade = "B";
  else if (this.percentage >= 70) this.grade = "C";
  else if (this.percentage >= 60) this.grade = "D";
  else this.grade = "F";

  // Check if submission is late
  if (this.submittedAt && this.assignmentId) {
    // This would need to be populated from the assignment
    // For now, we'll handle this in the controller
  }

  next();
});

// Method to submit assignment
studentSubmissionSchema.methods.submit = function (answers) {
  this.answers = answers;
  this.submittedAt = new Date();
  this.status = "submitted";

  return this.save();
};

// Method to add revision
studentSubmissionSchema.methods.addRevision = function (
  changes,
  score,
  feedback
) {
  this.revisionHistory.push({
    version: this.revisionHistory.length + 1,
    submittedAt: new Date(),
    changes,
    score,
    feedback,
  });

  this.status = "resubmitted";
  return this.save();
};

// Method to add peer feedback
studentSubmissionSchema.methods.addPeerFeedback = function (
  reviewerId,
  feedback,
  rating
) {
  this.feedback.peer.push({
    reviewerId,
    feedback,
    rating,
    createdAt: new Date(),
  });

  return this.save();
};

// Method to add collaborator
studentSubmissionSchema.methods.addCollaborator = function (
  studentId,
  contribution
) {
  const existingCollaborator = this.collaboration.collaborators.find(
    (collab) => collab.studentId.toString() === studentId.toString()
  );

  if (!existingCollaborator) {
    this.collaboration.collaborators.push({
      studentId,
      contribution,
      approved: false,
    });
    this.collaboration.isGroupSubmission = true;
  }

  return this.save();
};

// Static method to get student submissions
studentSubmissionSchema.statics.getStudentSubmissions = function (
  studentId,
  courseId = null
) {
  const filter = { studentId };
  if (courseId) filter.courseId = courseId;

  return this.find(filter)
    .populate("assignmentId", "title type dueDate maxScore")
    .populate("courseId", "title code")
    .populate("gradedBy", "name email")
    .populate("collaboration.collaborators.studentId", "name email")
    .sort({ submittedAt: -1 });
};

// Static method to get assignment submissions
studentSubmissionSchema.statics.getAssignmentSubmissions = function (
  assignmentId
) {
  return this.find({ assignmentId })
    .populate("studentId", "name email")
    .populate("gradedBy", "name email")
    .sort({ submittedAt: -1 });
};

// Static method to get submission analytics
studentSubmissionSchema.statics.getSubmissionAnalytics = function (
  studentId,
  courseId = null
) {
  const matchStage = { studentId };
  if (courseId) matchStage.courseId = courseId;

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalSubmissions: { $sum: 1 },
        gradedSubmissions: {
          $sum: { $cond: [{ $ne: ["$gradedAt", null] }, 1, 0] },
        },
        averageScore: { $avg: "$score" },
        averagePercentage: { $avg: "$percentage" },
        lateSubmissions: {
          $sum: { $cond: ["$isLate", 1, 0] },
        },
        gradeDistribution: {
          $push: "$grade",
        },
      },
    },
  ]);
};

module.exports = mongoose.model("StudentSubmission", studentSubmissionSchema);

