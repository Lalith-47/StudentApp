const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const StudentEnrollment = require("../models/StudentEnrollment");
const StudentSubmission = require("../models/StudentSubmission");
const StudySession = require("../models/StudySession");
const DiscussionForum = require("../models/DiscussionForum");
const Content = require("../models/Content");
const Attendance = require("../models/Attendance");
const Announcement = require("../models/Announcement");
const User = require("../models/User");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const {
  asyncHandler,
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  FileValidationError,
  DatabaseError,
  AnalyticsError,
  logger,
} = require("../middleware/enhancedErrorHandler");
const { invalidateCache } = require("../middleware/cache");

// Enhanced multer configuration for student uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadDir = `uploads/students/${req.user.id}/${file.fieldname}`;
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(
        new FileValidationError(
          `Failed to create upload directory: ${error.message}`
        )
      );
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${file.fieldname}-${uniqueSuffix}-${safeFilename}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Restrict to PDF and DOCX only for assignments
  const allowedExtensions = /\.(pdf|docx)$/i;
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (
    allowedExtensions.test(file.originalname) &&
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new FileValidationError(
        `Invalid file type: ${file.originalname}. Only PDF and DOCX files are allowed for assignment submissions.`
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10, // Maximum 10 files per request
  },
  fileFilter: fileFilter,
});

// Student Dashboard
const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  try {
    // Get enrolled courses with progress
    const enrollments = await StudentEnrollment.find({
      studentId,
      status: "enrolled",
    })
      .populate("courseId", "title code description facultyId schedule")
      .populate("courseId.facultyId", "name email")
      .sort({ enrolledAt: -1 });

    // Get recent assignments with deadlines
    const assignments = await Assignment.find({
      courseId: { $in: enrollments.map((e) => e.courseId._id) },
      dueDate: { $gte: new Date() },
    })
      .populate("courseId", "title code")
      .sort({ dueDate: 1 })
      .limit(10);

    // Get recent announcements
    const announcements = await Announcement.find({
      $or: [
        { targetAudience: "all" },
        { targetAudience: "students" },
        { recipients: studentId },
      ],
      status: "published",
    })
      .populate("authorId", "name email")
      .populate("courseId", "title code")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get study analytics
    const studyAnalytics = await StudySession.getStudyAnalytics(
      studentId,
      null,
      7
    );

    // Get attendance summary
    const attendanceSummary = await StudentEnrollment.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          status: "enrolled",
        },
      },
      {
        $group: {
          _id: null,
          averageAttendance: { $avg: "$attendance.attendanceRate" },
          totalCourses: { $sum: 1 },
          lowAttendanceCourses: {
            $sum: {
              $cond: [{ $lt: ["$attendance.attendanceRate", 75] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Get upcoming deadlines
    const upcomingDeadlines = assignments
      .filter((assignment) => {
        const daysUntilDue = Math.ceil(
          (assignment.dueDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilDue <= 7 && daysUntilDue >= 0;
      })
      .map((assignment) => ({
        id: assignment._id,
        title: assignment.title,
        course: assignment.courseId.title,
        dueDate: assignment.dueDate,
        daysUntilDue: Math.ceil(
          (assignment.dueDate - new Date()) / (1000 * 60 * 60 * 24)
        ),
      }));

    res.json({
      success: true,
      data: {
        enrollments: enrollments.map((enrollment) => ({
          courseId: enrollment.courseId._id,
          title: enrollment.courseId.title,
          code: enrollment.courseId.code,
          faculty: enrollment.courseId.facultyId.name,
          progress: enrollment.progress.overall,
          attendance: enrollment.attendance.attendanceRate,
          lastAccessed: enrollment.progress.lastUpdated,
        })),
        assignments: assignments.slice(0, 5),
        announcements,
        studyAnalytics: studyAnalytics[0] || {},
        attendanceSummary: attendanceSummary[0] || {},
        upcomingDeadlines,
        quickStats: {
          totalCourses: enrollments.length,
          upcomingAssignments: assignments.length,
          averageAttendance: attendanceSummary[0]?.averageAttendance || 0,
          studyStreak: studyAnalytics[0]?.totalSessions || 0,
        },
      },
    });
  } catch (error) {
    logger.error(`Student dashboard error for ${studentId}: ${error.message}`);
    throw new AnalyticsError("Failed to generate student dashboard");
  }
});

// Get enrolled courses
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { status = "enrolled", page = 1, limit = 10 } = req.query;

  const filter = { studentId };
  if (status) filter.status = status;

  const skip = (page - 1) * limit;

  const enrollments = await StudentEnrollment.find(filter)
    .populate("courseId", "title code description facultyId schedule syllabus")
    .populate("courseId.facultyId", "name email")
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await StudentEnrollment.countDocuments(filter);

  res.json({
    success: true,
    data: enrollments,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Get course details
const getCourseDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  // Verify student is enrolled
  const enrollment = await StudentEnrollment.findOne({
    studentId,
    courseId,
    status: "enrolled",
  });

  if (!enrollment) {
    throw new ForbiddenError("You are not enrolled in this course");
  }

  const course = await Course.findById(courseId)
    .populate("facultyId", "name email")
    .populate("enrolledStudents.studentId", "name email")
    .populate("coInstructors", "name email");

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Get course resources
  const resources = await Content.find({
    courseId,
    status: "published",
  }).sort({ createdAt: -1 });

  // Get assignments
  const assignments = await Assignment.find({ courseId }).sort({ dueDate: 1 });

  // Get attendance records
  const attendanceRecords = await Attendance.find({ courseId })
    .sort({ date: -1 })
    .limit(10);

  // Get student's submissions
  const submissions = await StudentSubmission.find({
    studentId,
    courseId,
  }).populate("assignmentId", "title type");

  res.json({
    success: true,
    data: {
      course,
      enrollment,
      resources,
      assignments,
      attendanceRecords,
      submissions,
    },
  });
});

// Submit assignment
const submitAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const studentId = req.user.id;
  const { answers } = req.body;

  // Get assignment details
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  // Verify student is enrolled
  const enrollment = await StudentEnrollment.findOne({
    studentId,
    courseId: assignment.courseId,
    status: "enrolled",
  });

  if (!enrollment) {
    throw new ForbiddenError("You are not enrolled in this course");
  }

  // Check if assignment is still open
  if (new Date() > assignment.dueDate) {
    throw new ValidationError("Assignment deadline has passed");
  }

  // Create or update submission
  let submission = await StudentSubmission.findOne({
    studentId,
    assignmentId,
  });

  if (!submission) {
    submission = new StudentSubmission({
      studentId,
      assignmentId,
      courseId: assignment.courseId,
      maxScore: assignment.rubric.totalPoints,
    });
  } else {
    // Check if resubmission is allowed
    if (
      !assignment.settings.allowResubmission &&
      submission.status === "submitted"
    ) {
      throw new ValidationError("Resubmission not allowed for this assignment");
    }
  }

  // Handle file attachments if any
  if (req.files && req.files.length > 0) {
    const attachments = req.files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      url: `/uploads/students/${studentId}/submissions/${file.filename}`,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date(),
    }));

    // Add attachments to answers
    if (answers && answers.length > 0) {
      answers.forEach((answer, index) => {
        if (answer.attachments) {
          answer.attachments = [...answer.attachments, ...attachments];
        } else {
          answer.attachments = attachments;
        }
      });
    }
  }

  // Submit the assignment
  submission.answers = answers;
  submission.submittedAt = new Date();
  submission.status = new Date() > assignment.dueDate ? "late" : "submitted";
  submission.attempt += 1;

  // Auto-grade if possible
  if (assignment.settings.autoGrade) {
    submission.score = assignment.autoGradeMCQ(submission);
    submission.status = "graded";
    submission.gradedAt = new Date();
  }

  await submission.save();

  // Update enrollment stats
  enrollment.assignments.submitted += 1;
  await enrollment.save();

  // Invalidate cache
  invalidateCache.assignments(`assignment:${assignmentId}`);

  logger.info(`Assignment submitted: ${assignmentId} by student ${studentId}`);

  res.json({
    success: true,
    message: "Assignment submitted successfully",
    data: submission,
  });
});

// Get assignment submissions
const getAssignmentSubmissions = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { courseId, status } = req.query;

  const filter = { studentId };
  if (courseId) filter.courseId = courseId;
  if (status) filter.status = status;

  const submissions = await StudentSubmission.find(filter)
    .populate("assignmentId", "title type dueDate maxScore")
    .populate("courseId", "title code")
    .populate("gradedBy", "name email")
    .sort({ submittedAt: -1 });

  res.json({
    success: true,
    data: submissions,
  });
});

// Start study session
const startStudySession = asyncHandler(async (req, res) => {
  const { courseId, resourceId, sessionType } = req.body;
  const studentId = req.user.id;

  // Verify student is enrolled
  const enrollment = await StudentEnrollment.findOne({
    studentId,
    courseId,
    status: "enrolled",
  });

  if (!enrollment) {
    throw new ForbiddenError("You are not enrolled in this course");
  }

  // Check if resource exists and is accessible
  if (resourceId) {
    const resource = await Content.findOne({
      _id: resourceId,
      courseId,
      status: "published",
    });

    if (!resource) {
      throw new NotFoundError("Resource not found or not accessible");
    }
  }

  const session = new StudySession({
    studentId,
    courseId,
    resourceId,
    sessionType,
    startTime: new Date(),
  });

  await session.save();

  res.json({
    success: true,
    message: "Study session started",
    data: { sessionId: session._id },
  });
});

// End study session
const endStudySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { progress, notes, bookmarks } = req.body;
  const studentId = req.user.id;

  const session = await StudySession.findOne({
    _id: sessionId,
    studentId,
  });

  if (!session) {
    throw new NotFoundError("Study session not found");
  }

  session.endTime = new Date();
  session.progress = progress || 100;
  session.completionStatus = "completed";

  // Add notes if provided
  if (notes && notes.length > 0) {
    session.notes = notes;
  }

  // Add bookmarks if provided
  if (bookmarks && bookmarks.length > 0) {
    session.bookmarks = bookmarks;
  }

  await session.save();

  // Update enrollment progress if resource is specified
  if (session.resourceId && session.courseId) {
    await enrollment.updateProgress(
      session.resourceId,
      session.progress,
      "Resource Study"
    );
  }

  logger.info(`Study session completed: ${sessionId} by student ${studentId}`);

  res.json({
    success: true,
    message: "Study session completed",
    data: session,
  });
});

// Get performance analytics
const getPerformanceAnalytics = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { courseId, period = 30 } = req.query;

  try {
    // Get submission analytics
    const submissionAnalytics = await StudentSubmission.getSubmissionAnalytics(
      studentId,
      courseId
    );

    // Get study analytics
    const studyAnalytics = await StudySession.getStudyAnalytics(
      studentId,
      courseId,
      parseInt(period)
    );

    // Get attendance analytics
    const attendanceAnalytics = await StudentEnrollment.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          ...(courseId && { courseId: mongoose.Types.ObjectId(courseId) }),
        },
      },
      {
        $group: {
          _id: null,
          averageAttendance: { $avg: "$attendance.attendanceRate" },
          totalClasses: { $sum: "$attendance.totalClasses" },
          attendedClasses: { $sum: "$attendance.attendedClasses" },
          lowAttendanceCount: {
            $sum: {
              $cond: [{ $lt: ["$attendance.attendanceRate", 75] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Get grade distribution
    const gradeDistribution = await StudentSubmission.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          ...(courseId && { courseId: mongoose.Types.ObjectId(courseId) }),
          status: "graded",
        },
      },
      {
        $group: {
          _id: "$grade",
          count: { $sum: 1 },
          averageScore: { $avg: "$percentage" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get progress over time
    const progressOverTime = await StudentSubmission.aggregate([
      {
        $match: {
          studentId: new mongoose.Types.ObjectId(studentId),
          ...(courseId && { courseId: mongoose.Types.ObjectId(courseId) }),
          gradedAt: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$gradedAt" },
            month: { $month: "$gradedAt" },
            day: { $dayOfMonth: "$gradedAt" },
          },
          averageScore: { $avg: "$percentage" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json({
      success: true,
      data: {
        submissions: submissionAnalytics[0] || {},
        study: studyAnalytics[0] || {},
        attendance: attendanceAnalytics[0] || {},
        gradeDistribution,
        progressOverTime,
        recommendations: generatePerformanceRecommendations(
          submissionAnalytics[0],
          studyAnalytics[0],
          attendanceAnalytics[0]
        ),
      },
    });
  } catch (error) {
    logger.error(
      `Performance analytics error for ${studentId}: ${error.message}`
    );
    throw new AnalyticsError("Failed to generate performance analytics");
  }
});

// Generate performance recommendations
const generatePerformanceRecommendations = (submissions, study, attendance) => {
  const recommendations = [];

  if (submissions?.averagePercentage < 70) {
    recommendations.push({
      type: "academic",
      priority: "high",
      message:
        "Your average score is below 70%. Consider reviewing course materials and seeking help from faculty.",
      action: "schedule_office_hours",
    });
  }

  if (attendance?.averageAttendance < 75) {
    recommendations.push({
      type: "attendance",
      priority: "high",
      message:
        "Your attendance rate is below 75%. Regular attendance is crucial for academic success.",
      action: "improve_attendance",
    });
  }

  if (study?.totalStudyTime < 300) {
    // Less than 5 hours per week
    recommendations.push({
      type: "study",
      priority: "medium",
      message:
        "Consider increasing your study time. Aim for at least 2-3 hours per course per week.",
      action: "increase_study_time",
    });
  }

  if (submissions?.lateSubmissions > 0) {
    recommendations.push({
      type: "time_management",
      priority: "medium",
      message:
        "You have late submissions. Try to start assignments earlier to avoid last-minute stress.",
      action: "improve_time_management",
    });
  }

  return recommendations;
};

// Generate report card
const generateReportCard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { courseId, format = "pdf" } = req.query;

  // Get student info
  const student = await User.findById(studentId);

  // Get enrollments
  const enrollments = await StudentEnrollment.find({
    studentId,
    ...(courseId && { courseId }),
    status: { $in: ["enrolled", "completed"] },
  })
    .populate("courseId", "title code credits facultyId")
    .populate("courseId.facultyId", "name");

  // Get submissions for grade calculation
  const submissions = await StudentSubmission.find({
    studentId,
    ...(courseId && { courseId }),
    status: "graded",
  }).populate("assignmentId", "title type");

  if (format === "excel") {
    // Generate Excel report
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report Card");

    // Add headers
    worksheet.columns = [
      { header: "Course Code", key: "code", width: 15 },
      { header: "Course Title", key: "title", width: 30 },
      { header: "Credits", key: "credits", width: 10 },
      { header: "Faculty", key: "faculty", width: 25 },
      { header: "Final Grade", key: "grade", width: 12 },
      { header: "GPA Points", key: "gpa", width: 12 },
      { header: "Attendance %", key: "attendance", width: 15 },
    ];

    // Add data
    enrollments.forEach((enrollment) => {
      worksheet.addRow({
        code: enrollment.courseId.code,
        title: enrollment.courseId.title,
        credits: enrollment.courseId.credits,
        faculty: enrollment.courseId.facultyId.name,
        grade: enrollment.finalGrade || "In Progress",
        gpa: calculateGPAPoints(enrollment.finalGrade),
        attendance: enrollment.attendance.attendanceRate.toFixed(1),
      });
    });

    // Style headers
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-card-${student.name}.xlsx`
    );
    res.send(buffer);
  } else {
    // Generate PDF report
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-card-${student.name}.pdf`
    );
    doc.pipe(res);

    doc.fontSize(20).text("Report Card", { align: "center" });
    doc.fontSize(14).text(`Student: ${student.name}`, { align: "center" });
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, {
      align: "center",
    });
    doc.moveDown();

    enrollments.forEach((enrollment) => {
      doc
        .fontSize(12)
        .text(
          `Course: ${enrollment.courseId.title} (${enrollment.courseId.code})`,
          { continued: true }
        )
        .text(` | Faculty: ${enrollment.courseId.facultyId.name}`)
        .text(
          `Credits: ${enrollment.courseId.credits} | Grade: ${
            enrollment.finalGrade || "In Progress"
          }`
        )
        .text(`Attendance: ${enrollment.attendance.attendanceRate.toFixed(1)}%`)
        .moveDown();
    });

    doc.end();
  }
});

// Helper function to calculate GPA points
const calculateGPAPoints = (grade) => {
  const gradePoints = {
    A: 4.0,
    B: 3.0,
    C: 2.0,
    D: 1.0,
    F: 0.0,
  };
  return gradePoints[grade] || 0.0;
};

module.exports = {
  upload,
  getStudentDashboard,
  getEnrolledCourses,
  getCourseDetails,
  submitAssignment,
  getAssignmentSubmissions,
  startStudySession,
  endStudySession,
  getPerformanceAnalytics,
  generateReportCard,
};
