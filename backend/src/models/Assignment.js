const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [200, "Assignment title cannot exceed 200 characters"],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [5000, "Assignment description cannot exceed 5000 characters"],
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  facultyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["assignment", "quiz", "exam", "project", "homework", "lab"],
  },
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course.modules",
  },
  instructions: {
    type: String,
    trim: true,
    maxlength: [10000, "Instructions cannot exceed 10000 characters"],
  },
  rubric: {
    criteria: [
      {
        name: {
          type: String,
          required: true,
        },
        description: String,
        points: {
          type: Number,
          required: true,
          min: 0,
        },
        weight: {
          type: Number,
          min: 0,
          max: 100,
        },
      },
    ],
    totalPoints: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  dueDate: {
    type: Date,
    required: true,
  },
  availableFrom: {
    type: Date,
    default: Date.now,
  },
  timeLimit: {
    type: Number, // in minutes
    default: null,
  },
  attempts: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  settings: {
    allowLateSubmissions: {
      type: Boolean,
      default: true,
    },
    latePenalty: {
      type: Number,
      default: 10,
      min: 0,
      max: 100,
    },
    requireFileUpload: {
      type: Boolean,
      default: false,
    },
    allowedFileTypes: [
      {
        type: String,
        enum: ["pdf", "doc", "docx", "txt", "jpg", "jpeg", "png", "zip"],
      },
    ],
    maxFileSize: {
      type: Number,
      default: 10, // MB
    },
    plagiarismCheck: {
      type: Boolean,
      default: false,
    },
    autoGrade: {
      type: Boolean,
      default: false,
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true,
    },
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
  },
  questions: [
    {
      type: {
        type: String,
        enum: [
          "multiple-choice",
          "true-false",
          "short-answer",
          "essay",
          "file-upload",
          "code",
        ],
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      points: {
        type: Number,
        required: true,
        min: 0,
      },
      options: [
        {
          text: String,
          isCorrect: Boolean,
          feedback: String,
        },
      ],
      correctAnswer: String,
      sampleAnswer: String,
      codeTemplate: String,
      testCases: [
        {
          input: String,
          expectedOutput: String,
          points: Number,
        },
      ],
      attachments: [
        {
          filename: String,
          originalName: String,
          url: String,
          type: String,
        },
      ],
      hints: [String],
      explanation: String,
    },
  ],
  submissions: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      answers: [
        {
          questionId: mongoose.Schema.Types.ObjectId,
          answer: mongoose.Schema.Types.Mixed,
          attachments: [
            {
              filename: String,
              originalName: String,
              url: String,
            },
          ],
          timeSpent: Number, // in minutes
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
      feedback: String,
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
      plagiarismScore: {
        type: Number,
        min: 0,
        max: 100,
      },
      plagiarismReport: String,
      status: {
        type: String,
        enum: ["submitted", "graded", "late", "incomplete"],
        default: "submitted",
      },
    },
  ],
  analytics: {
    totalSubmissions: {
      type: Number,
      default: 0,
    },
    gradedSubmissions: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
    },
    averageTimeSpent: {
      type: Number,
      default: 0,
    },
    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  status: {
    type: String,
    enum: ["draft", "published", "closed", "archived"],
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
assignmentSchema.index({ courseId: 1, status: 1 });
assignmentSchema.index({ facultyId: 1, createdAt: -1 });
assignmentSchema.index({ dueDate: 1 });
assignmentSchema.index({ "submissions.studentId": 1 });

// Update timestamp on save
assignmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate analytics
  if (this.submissions && this.submissions.length > 0) {
    this.analytics.totalSubmissions = this.submissions.length;
    this.analytics.gradedSubmissions = this.submissions.filter(
      (s) => s.gradedAt
    ).length;

    const gradedSubmissions = this.submissions.filter((s) => s.gradedAt);
    if (gradedSubmissions.length > 0) {
      this.analytics.averageScore =
        gradedSubmissions.reduce((sum, s) => sum + s.score, 0) /
        gradedSubmissions.length;
      this.analytics.averageTimeSpent =
        gradedSubmissions.reduce((sum, s) => {
          return (
            sum + s.answers.reduce((time, a) => time + (a.timeSpent || 0), 0)
          );
        }, 0) / gradedSubmissions.length;
    }

    const course = this.constructor.db.model("Course").findById(this.courseId);
    if (course) {
      this.analytics.completionRate =
        (this.submissions.length / course.enrolledStudents.length) * 100;
    }
  }

  next();
});

// Method to submit assignment
assignmentSchema.methods.submitAssignment = function (studentId, answers) {
  const existingSubmission = this.submissions.find(
    (submission) => submission.studentId.toString() === studentId.toString()
  );

  const isLate = new Date() > this.dueDate;
  const attempt = existingSubmission ? existingSubmission.attempt + 1 : 1;

  const submission = {
    studentId,
    submittedAt: new Date(),
    answers,
    maxScore: this.rubric.totalPoints,
    isLate,
    attempt,
    status: isLate ? "late" : "submitted",
  };

  if (existingSubmission) {
    Object.assign(existingSubmission, submission);
  } else {
    this.submissions.push(submission);
  }

  return submission;
};

// Method to grade assignment
assignmentSchema.methods.gradeAssignment = function (
  studentId,
  score,
  feedback,
  gradedBy
) {
  const submission = this.submissions.find(
    (s) => s.studentId.toString() === studentId.toString()
  );

  if (submission) {
    submission.score = score;
    submission.feedback = feedback;
    submission.gradedBy = gradedBy;
    submission.gradedAt = new Date();
    submission.percentage = (score / submission.maxScore) * 100;
    submission.status = "graded";

    // Calculate letter grade based on percentage
    if (submission.percentage >= 90) submission.grade = "A";
    else if (submission.percentage >= 80) submission.grade = "B";
    else if (submission.percentage >= 70) submission.grade = "C";
    else if (submission.percentage >= 60) submission.grade = "D";
    else submission.grade = "F";
  }

  return submission;
};

// Method to auto-grade multiple choice questions
assignmentSchema.methods.autoGradeMCQ = function (submission) {
  let score = 0;

  submission.answers.forEach((answer) => {
    const question = this.questions.id(answer.questionId);
    if (question && question.type === "multiple-choice") {
      const correctOption = question.options.find((option) => option.isCorrect);
      if (correctOption && answer.answer === correctOption.text) {
        score += question.points;
      }
    }
  });

  submission.score = score;
  submission.percentage = (score / submission.maxScore) * 100;
  submission.status = "graded";

  return score;
};

// Static method to get assignment analytics
assignmentSchema.statics.getAssignmentAnalytics = function (assignmentId) {
  return this.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(assignmentId) } },
    {
      $project: {
        title: 1,
        totalSubmissions: { $size: "$submissions" },
        averageScore: { $avg: "$submissions.score" },
        completionRate: {
          $multiply: [
            {
              $divide: [{ $size: "$submissions" }, "$analytics.totalStudents"],
            },
            100,
          ],
        },
        gradeDistribution: {
          $group: {
            _id: "$submissions.grade",
            count: { $sum: 1 },
          },
        },
      },
    },
  ]);
};

module.exports = mongoose.model("Assignment", assignmentSchema);

