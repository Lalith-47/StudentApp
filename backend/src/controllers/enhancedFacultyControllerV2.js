const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Attendance = require("../models/Attendance");
const Announcement = require("../models/Announcement");
const Content = require("../models/Content");
const User = require("../models/User");
const FacultyApproval = require("../models/FacultyApproval");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const QRCode = require("qrcode");
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

// Enhanced multer configuration with better error handling
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadDir = `uploads/faculty/${req.user.id}/${file.fieldname}`;
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
  const allowedExtensions =
    /\.(jpeg|jpg|png|gif|pdf|doc|docx|txt|ppt|pptx|xls|xlsx|mp4|avi|mov|zip)$/i;
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "video/avi",
    "video/quicktime",
    "application/zip",
  ];

  if (
    allowedExtensions.test(file.originalname) &&
    allowedMimeTypes.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new FileValidationError(
        `Invalid file type: ${file.originalname}. Only images, documents, presentations, spreadsheets, videos, and zip files are allowed.`
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

// Course Management Functions

// Create new course with enhanced validation
const createCourse = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const courseData = { ...req.body, facultyId };

  // Validate course code format
  if (!/^[A-Z]{2,4}[0-9]{3,4}$/.test(courseData.code)) {
    throw new ValidationError(
      "Course code must be in format: ABC123 (2-4 letters, 3-4 numbers)"
    );
  }

  // Check if course code already exists
  const existingCourse = await Course.findOne({ code: courseData.code });
  if (existingCourse) {
    throw new ConflictError("Course code already exists");
  }

  // Validate date ranges
  if (
    courseData.schedule &&
    courseData.schedule.startTime &&
    courseData.schedule.endTime
  ) {
    const startTime = new Date(
      `2000-01-01T${courseData.schedule.startTime}:00`
    );
    const endTime = new Date(`2000-01-01T${courseData.schedule.endTime}:00`);

    if (endTime <= startTime) {
      throw new ValidationError("End time must be after start time");
    }
  }

  const course = new Course(courseData);
  await course.save();

  // Invalidate related cache
  invalidateCache.courses(`faculty:${facultyId}`);

  logger.info(`Course created: ${course.code} by faculty: ${facultyId}`);

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

// Get faculty courses with caching
const getFacultyCourses = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const { status, semester, academicYear, page = 1, limit = 10 } = req.query;

  const filter = { facultyId };
  if (status) filter.status = status;
  if (semester) filter.semester = semester;
  if (academicYear) filter.academicYear = academicYear;

  const skip = (page - 1) * limit;

  const courses = await Course.find(filter)
    .populate("enrolledStudents.studentId", "name email")
    .populate("coInstructors", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Course.countDocuments(filter);

  res.json({
    success: true,
    data: courses,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

// Bulk grade upload with enhanced error handling
const uploadGrades = upload.single("grades");

const handleBulkGradeUpload = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const facultyId = req.user.id;

  if (!req.file) {
    throw new ValidationError("No file uploaded");
  }

  const assignment = await Assignment.findOne({ _id: assignmentId, facultyId });
  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  try {
    // Parse Excel file with enhanced error handling
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);

    if (!worksheet) {
      throw new ValidationError("Excel file is empty or invalid");
    }

    const grades = [];
    const errors = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Skip header row
        try {
          const studentId = row.getCell(1).value;
          const score = row.getCell(2).value;
          const feedback = row.getCell(3).value || "";

          // Validate student ID
          if (!studentId || !mongoose.Types.ObjectId.isValid(studentId)) {
            errors.push(`Row ${rowNumber}: Invalid student ID`);
            return;
          }

          // Validate score
          if (score === undefined || score === null || isNaN(score)) {
            errors.push(`Row ${rowNumber}: Invalid score`);
            return;
          }

          if (score < 0 || score > assignment.rubric.totalPoints) {
            errors.push(
              `Row ${rowNumber}: Score must be between 0 and ${assignment.rubric.totalPoints}`
            );
            return;
          }

          grades.push({ studentId, score, feedback });
        } catch (error) {
          errors.push(`Row ${rowNumber}: ${error.message}`);
        }
      }
    });

    if (errors.length > 0) {
      throw new ValidationError(`Validation errors: ${errors.join(", ")}`);
    }

    if (grades.length === 0) {
      throw new ValidationError("No valid grades found in the file");
    }

    // Apply grades with transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const grade of grades) {
        assignment.gradeAssignment(
          grade.studentId,
          grade.score,
          grade.feedback,
          facultyId
        );
      }

      await assignment.save({ session });
      await session.commitTransaction();

      // Invalidate cache
      invalidateCache.assignments(`assignment:${assignmentId}`);

      logger.info(
        `Bulk grades uploaded: ${grades.length} grades for assignment ${assignmentId} by faculty ${facultyId}`
      );

      res.json({
        success: true,
        message: `Successfully graded ${grades.length} submissions`,
        data: {
          gradedCount: grades.length,
          errors: errors.length > 0 ? errors : undefined,
        },
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    // Clean up uploaded file
    try {
      await fs.unlink(req.file.path);
    } catch (unlinkError) {
      logger.error(`Failed to delete uploaded file: ${unlinkError.message}`);
    }
    throw error;
  }
});

// Enhanced attendance session creation
const createAttendanceSession = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const { courseId, date, classNumber, topic, location, duration } = req.body;

  // Validate date is not in the future
  const sessionDate = new Date(date);
  if (sessionDate > new Date()) {
    throw new ValidationError(
      "Attendance session date cannot be in the future"
    );
  }

  // Verify faculty has access to this course
  const course = await Course.findOne({ _id: courseId, facultyId });
  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Check for duplicate class number on same date
  const existingSession = await Attendance.findOne({
    courseId,
    date: sessionDate,
    classNumber,
  });

  if (existingSession) {
    throw new ConflictError(
      `Class ${classNumber} already exists for this date`
    );
  }

  const attendance = new Attendance({
    courseId,
    facultyId,
    date: sessionDate,
    classNumber,
    topic,
    location,
    duration: duration || 60,
  });

  await attendance.save();

  // Generate secure QR code with expiration
  const qrData = {
    attendanceId: attendance._id,
    courseId,
    timestamp: Date.now(),
    facultyId,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
  };

  const qrCode = await QRCode.toDataURL(JSON.stringify(qrData));

  // Invalidate cache
  invalidateCache.attendance(`attendance:${courseId}`);

  logger.info(
    `Attendance session created: ${attendance._id} for course ${courseId} by faculty ${facultyId}`
  );

  res.json({
    success: true,
    message: "Attendance session created successfully",
    data: {
      attendance,
      qrCode,
      expiresAt: qrData.expiresAt,
    },
  });
});

// Enhanced student analytics with caching
const getStudentProgressDashboard = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const facultyId = req.user.id;

  // Verify faculty has access to this course
  const course = await Course.findOne({ _id: courseId, facultyId });
  if (!course) {
    throw new NotFoundError("Course not found");
  }

  try {
    // Use aggregation pipeline for better performance
    const [
      courseAnalytics,
      assignments,
      attendanceAnalytics,
      studentPerformance,
    ] = await Promise.all([
      Course.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(courseId) } },
        {
          $project: {
            totalStudents: { $size: "$enrolledStudents" },
            activeStudents: {
              $size: {
                $filter: {
                  input: "$enrolledStudents",
                  cond: { $eq: ["$$this.status", "enrolled"] },
                },
              },
            },
          },
        },
      ]),
      Assignment.find({ courseId }).select("title type analytics"),
      Attendance.aggregate([
        { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
        {
          $group: {
            _id: null,
            totalSessions: { $sum: 1 },
            averageAttendance: { $avg: "$analytics.attendanceRate" },
          },
        },
      ]),
      Assignment.aggregate([
        { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
        { $unwind: "$submissions" },
        {
          $group: {
            _id: "$submissions.studentId",
            totalAssignments: { $sum: 1 },
            averageScore: { $avg: "$submissions.score" },
            completionRate: {
              $avg: { $cond: [{ $gt: ["$submissions.score", 0] }, 1, 0] },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "student",
          },
        },
        { $unwind: "$student" },
        {
          $project: {
            studentId: "$_id",
            studentName: "$student.name",
            studentEmail: "$student.email",
            totalAssignments: 1,
            averageScore: { $round: ["$averageScore", 2] },
            completionRate: { $multiply: ["$completionRate", 100] },
            performanceGrade: {
              $switch: {
                branches: [
                  { case: { $gte: ["$averageScore", 90] }, then: "A" },
                  { case: { $gte: ["$averageScore", 80] }, then: "B" },
                  { case: { $gte: ["$averageScore", 70] }, then: "C" },
                  { case: { $gte: ["$averageScore", 60] }, then: "D" },
                ],
                default: "F",
              },
            },
          },
        },
        { $sort: { averageScore: -1 } },
      ]),
    ]);

    const assignmentAnalytics = assignments.map((assignment) => ({
      id: assignment._id,
      title: assignment.title,
      type: assignment.type,
      totalSubmissions: assignment.analytics.totalSubmissions,
      averageScore: assignment.analytics.averageScore,
      completionRate: assignment.analytics.completionRate,
    }));

    res.json({
      success: true,
      data: {
        course: courseAnalytics[0] || {},
        assignments: assignmentAnalytics,
        attendance: attendanceAnalytics[0] || {},
        studentPerformance,
      },
    });
  } catch (error) {
    logger.error(`Analytics error for course ${courseId}: ${error.message}`);
    throw new AnalyticsError("Failed to generate analytics");
  }
});

// Enhanced announcement creation with rate limiting
const createAnnouncement = asyncHandler(async (req, res) => {
  const authorId = req.user.id;
  const announcementData = { ...req.body, authorId };

  // Validate scheduling
  if (announcementData.schedule && announcementData.schedule.publishAt) {
    const publishDate = new Date(announcementData.schedule.publishAt);
    if (publishDate < new Date()) {
      throw new ValidationError("Publish date cannot be in the past");
    }
  }

  if (announcementData.schedule && announcementData.schedule.expiresAt) {
    const expireDate = new Date(announcementData.schedule.expiresAt);
    const publishDate = announcementData.schedule.publishAt
      ? new Date(announcementData.schedule.publishAt)
      : new Date();

    if (expireDate <= publishDate) {
      throw new ValidationError("Expiration date must be after publish date");
    }
  }

  const announcement = new Announcement(announcementData);
  await announcement.save();

  logger.info(
    `Announcement created: ${announcement._id} by faculty ${authorId}`
  );

  res.status(201).json({
    success: true,
    message: "Announcement created successfully",
    data: announcement,
  });
});

// Enhanced content upload with RBAC
const uploadContent = upload.fields([
  { name: "files", maxCount: 10 },
  { name: "thumbnail", maxCount: 1 },
]);

const handleContentUpload = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const {
    title,
    description,
    type,
    category,
    courseId,
    moduleId,
    metadata,
    access,
  } = req.body;

  // Validate course access if specified
  if (courseId) {
    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      throw new ForbiddenError("You don't have access to this course");
    }
  }

  const contentData = {
    title,
    description,
    type,
    category,
    facultyId,
    courseId: courseId || null,
    moduleId: moduleId || null,
    metadata: metadata ? JSON.parse(metadata) : {},
    access: access
      ? JSON.parse(access)
      : { isPublic: false, requiresLogin: true },
  };

  // Handle file uploads with validation
  if (req.files) {
    const files = [];

    if (req.files.files) {
      for (const file of req.files.files) {
        files.push({
          filename: file.filename,
          originalName: file.originalname,
          url: `/uploads/faculty/${facultyId}/content/${file.filename}`,
          size: file.size,
          mimeType: file.mimetype,
          uploadedAt: new Date(),
        });
      }
    }

    contentData.files = files;
  }

  const content = new Content(contentData);
  await content.save();

  // Invalidate cache
  invalidateCache.content(`faculty:${facultyId}`);

  logger.info(`Content uploaded: ${content._id} by faculty ${facultyId}`);

  res.status(201).json({
    success: true,
    message: "Content uploaded successfully",
    data: content,
  });
});

// Enhanced Faculty Dashboard
const getEnhancedFacultyDashboard = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;

  try {
    // Get basic course statistics
    const totalCourses = await Course.countDocuments({
      facultyId,
      status: "active",
    });
    const totalStudents = await Course.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(facultyId),
          status: "active",
        },
      },
      { $unwind: "$enrolledStudents" },
      { $group: { _id: "$enrolledStudents.studentId" } },
      { $count: "total" },
    ]);

    // Get recent activities
    const recentAssignments = await Assignment.find({ facultyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("courseId", "title code");

    const recentAnnouncements = await Announcement.find({ facultyId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("targetAudience.courses", "title code");

    // Get attendance summary for current week
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const attendanceSummary = await Attendance.aggregate([
      {
        $match: {
          facultyId: new mongoose.Types.ObjectId(facultyId),
          date: { $gte: startOfWeek },
        },
      },
      {
        $unwind: "$attendanceRecords",
      },
      {
        $group: {
          _id: "$date",
          totalStudents: { $sum: 1 },
          presentStudents: {
            $sum: { $cond: ["$attendanceRecords.status", 1, 0] },
          },
        },
      },
      {
        $group: {
          _id: null,
          avgAttendance: {
            $avg: { $divide: ["$presentStudents", "$totalStudents"] },
          },
          totalSessions: { $sum: 1 },
        },
      },
    ]);

    const dashboardData = {
      overview: {
        totalCourses,
        totalStudents: totalStudents[0]?.total || 0,
        avgAttendance: attendanceSummary[0]?.avgAttendance || 0,
        totalSessions: attendanceSummary[0]?.totalSessions || 0,
      },
      recentActivities: {
        assignments: recentAssignments,
        announcements: recentAnnouncements,
      },
      quickStats: {
        pendingGrading: await Assignment.countDocuments({
          facultyId,
          "submissions.status": "submitted",
        }),
        activeCourses: totalCourses,
        thisWeekAttendance: attendanceSummary[0]?.totalSessions || 0,
      },
    };

    res.json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    logger.error(`Dashboard error for faculty ${facultyId}: ${error.message}`);
    throw new DatabaseError("Failed to retrieve dashboard data");
  }
});

// Update Course
const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const facultyId = req.user.id;
  const updateData = req.body;

  const course = await Course.findOne({ _id: courseId, facultyId });
  if (!course) {
    throw new NotFoundError("Course not found");
  }

  Object.assign(course, updateData);
  await course.save();

  invalidateCache.courses(`faculty:${facultyId}`);
  logger.info(`Course updated: ${course.code} by faculty: ${facultyId}`);

  res.json({
    success: true,
    message: "Course updated successfully",
    data: course,
  });
});

// Upload Syllabus
const uploadSyllabus = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/syllabus/");
    },
    filename: (req, file, cb) => {
      const courseId = req.params.courseId;
      const fileExtension = path.extname(file.originalname);
      cb(null, `syllabus_${courseId}_${Date.now()}${fileExtension}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ValidationError("Only PDF files are allowed for syllabus"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const handleSyllabusUpload = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const facultyId = req.user.id;

  if (!req.file) {
    throw new ValidationError("No syllabus file uploaded");
  }

  const course = await Course.findOne({ _id: courseId, facultyId });
  if (!course) {
    throw new NotFoundError("Course not found");
  }

  course.syllabus = {
    fileName: req.file.filename,
    originalName: req.file.originalname,
    filePath: req.file.path,
    uploadedAt: new Date(),
  };

  await course.save();
  invalidateCache.courses(`faculty:${facultyId}`);

  logger.info(
    `Syllabus uploaded for course: ${course.code} by faculty: ${facultyId}`
  );

  res.json({
    success: true,
    message: "Syllabus uploaded successfully",
    data: {
      courseId: course._id,
      syllabus: course.syllabus,
    },
  });
});

// Create Assignment
const createAssignment = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const assignmentData = { ...req.body, facultyId };

  const assignment = new Assignment(assignmentData);
  await assignment.save();

  invalidateCache.assignments(`course:${assignmentData.courseId}`);
  logger.info(
    `Assignment created: ${assignment.title} by faculty: ${facultyId}`
  );

  res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    data: assignment,
  });
});

// Get Course Assignments
const getCourseAssignments = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const facultyId = req.user.id;

  const assignments = await Assignment.find({ courseId, facultyId })
    .sort({ dueDate: -1 })
    .populate("courseId", "title code");

  res.json({
    success: true,
    message: "Assignments retrieved successfully",
    data: assignments,
  });
});

// Grade Assignment
const gradeAssignment = asyncHandler(async (req, res) => {
  const { assignmentId, submissionId } = req.params;
  const { score, feedback } = req.body;
  const facultyId = req.user.id;

  const assignment = await Assignment.findOne({ _id: assignmentId, facultyId });
  if (!assignment) {
    throw new NotFoundError("Assignment not found");
  }

  const submission = assignment.submissions.id(submissionId);
  if (!submission) {
    throw new NotFoundError("Submission not found");
  }

  assignment.gradeAssignment(submission.studentId, score, feedback, facultyId);
  await assignment.save();

  invalidateCache.assignments(`assignment:${assignmentId}`);

  res.json({
    success: true,
    message: "Assignment graded successfully",
    data: {
      submissionId,
      score,
      feedback,
      gradedAt: new Date(),
    },
  });
});

// Mark Attendance
const markAttendance = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { attendanceRecords } = req.body;
  const facultyId = req.user.id;

  const session = await Attendance.findOne({ _id: sessionId, facultyId });
  if (!session) {
    throw new NotFoundError("Attendance session not found");
  }

  session.attendanceRecords = attendanceRecords;
  session.status = "completed";
  await session.save();

  invalidateCache.attendance(`session:${sessionId}`);

  res.json({
    success: true,
    message: "Attendance marked successfully",
    data: session,
  });
});

// Generate Attendance Report
const generateAttendanceReport = asyncHandler(async (req, res) => {
  const { courseId, startDate, endDate } = req.query;
  const facultyId = req.user.id;

  const query = { facultyId };
  if (courseId) query.courseId = courseId;
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const sessions = await Attendance.find(query)
    .populate("courseId", "title code")
    .sort({ date: -1 });

  res.json({
    success: true,
    message: "Attendance report generated successfully",
    data: sessions,
  });
});

// Get Attendance Analytics
const getAttendanceAnalytics = asyncHandler(async (req, res) => {
  const { courseId, startDate, endDate } = req.query;
  const facultyId = req.user.id;

  const matchQuery = { facultyId };
  if (courseId) matchQuery.courseId = new mongoose.Types.ObjectId(courseId);
  if (startDate && endDate) {
    matchQuery.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const analytics = await Attendance.aggregate([
    { $match: matchQuery },
    {
      $unwind: "$attendanceRecords",
    },
    {
      $group: {
        _id: {
          courseId: "$courseId",
          date: "$date",
        },
        totalStudents: { $sum: 1 },
        presentStudents: {
          $sum: { $cond: ["$attendanceRecords.status", 1, 0] },
        },
      },
    },
    {
      $group: {
        _id: "$_id.courseId",
        totalSessions: { $sum: 1 },
        avgAttendance: {
          $avg: { $divide: ["$presentStudents", "$totalStudents"] },
        },
        totalStudents: { $first: "$totalStudents" },
        totalPresent: { $sum: "$presentStudents" },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $project: {
        courseId: "$_id",
        courseTitle: "$course.title",
        courseCode: "$course.code",
        totalSessions: 1,
        avgAttendance: { $round: ["$avgAttendance", 2] },
        totalStudents: 1,
        totalPresent: 1,
        attendancePercentage: {
          $round: [{ $multiply: [{ $divide: ["$avgAttendance", 1] }, 100] }, 2],
        },
      },
    },
  ]);

  res.json({
    success: true,
    message: "Attendance analytics retrieved successfully",
    data: analytics,
  });
});

// Get Announcements
const getAnnouncements = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const { page = 1, limit = 10, status, targetType } = req.query;

  const query = { facultyId };
  if (status) query.status = status;
  if (targetType) query.targetType = targetType;

  const announcements = await Announcement.find(query)
    .populate("targetAudience.courses", "title code")
    .populate("targetAudience.students", "name email")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Announcement.countDocuments(query);

  res.json({
    success: true,
    message: "Announcements retrieved successfully",
    data: {
      announcements,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
});

// Send Bulk Message
const sendBulkMessage = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const { title, content, targetAudience, priority = "normal" } = req.body;

  // Validate target audience
  if (
    !targetAudience ||
    (!targetAudience.courses?.length && !targetAudience.students?.length)
  ) {
    throw new ValidationError(
      "Target audience must include courses or students"
    );
  }

  const announcement = new Announcement({
    title,
    content,
    targetAudience,
    priority,
    facultyId,
    status: "published",
  });

  await announcement.save();

  // Invalidate cache
  invalidateCache.announcements(`faculty:${facultyId}`);

  logger.info(`Bulk message sent by faculty ${facultyId}: ${announcement._id}`);

  res.status(201).json({
    success: true,
    message: "Bulk message sent successfully",
    data: announcement,
  });
});

// Get Faculty Content
const getFacultyContent = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const { page = 1, limit = 10, type, courseId, module } = req.query;

  const query = { facultyId };
  if (type) query.type = type;
  if (courseId) query.courseId = courseId;
  if (module) query.module = module;

  const content = await Content.find(query)
    .populate("courseId", "title code")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Content.countDocuments(query);

  res.json({
    success: true,
    message: "Content retrieved successfully",
    data: {
      content,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    },
  });
});

// Update Content
const updateContent = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const facultyId = req.user.id;
  const updateData = req.body;

  const content = await Content.findOne({ _id: contentId, facultyId });
  if (!content) {
    throw new NotFoundError("Content not found");
  }

  Object.assign(content, updateData);
  await content.save();

  invalidateCache.content(`faculty:${facultyId}`);
  logger.info(`Content updated: ${content.title} by faculty: ${facultyId}`);

  res.json({
    success: true,
    message: "Content updated successfully",
    data: content,
  });
});

// Generate Shareable Link
const generateShareableLink = asyncHandler(async (req, res) => {
  const { contentId } = req.params;
  const facultyId = req.user.id;

  const content = await Content.findOne({ _id: contentId, facultyId });
  if (!content) {
    throw new NotFoundError("Content not found");
  }

  const shareableLink = `${
    process.env.CLIENT_URL || "http://localhost:3000"
  }/shared/content/${contentId}`;

  res.json({
    success: true,
    message: "Shareable link generated successfully",
    data: {
      contentId,
      shareableLink,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });
});

// Get Content Analytics
const getContentAnalytics = asyncHandler(async (req, res) => {
  const facultyId = req.user.id;
  const { courseId, startDate, endDate } = req.query;

  const matchQuery = { facultyId };
  if (courseId) matchQuery.courseId = new mongoose.Types.ObjectId(courseId);
  if (startDate && endDate) {
    matchQuery.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const analytics = await Content.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: {
          type: "$type",
          courseId: "$courseId",
        },
        count: { $sum: 1 },
        totalSize: { $sum: "$fileSize" },
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id.courseId",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $project: {
        type: "$_id.type",
        courseTitle: "$course.title",
        courseCode: "$course.code",
        count: 1,
        totalSize: 1,
      },
    },
  ]);

  res.json({
    success: true,
    message: "Content analytics retrieved successfully",
    data: analytics,
  });
});

module.exports = {
  upload,
  uploadGrades,
  uploadContent,
  createCourse,
  getFacultyCourses,
  updateCourse,
  uploadSyllabus,
  handleSyllabusUpload,
  createAssignment,
  getCourseAssignments,
  gradeAssignment,
  handleBulkGradeUpload,
  createAttendanceSession,
  markAttendance,
  getAttendanceAnalytics,
  generateAttendanceReport,
  getStudentProgressDashboard,
  createAnnouncement,
  getAnnouncements,
  sendBulkMessage,
  handleContentUpload,
  getFacultyContent,
  updateContent,
  generateShareableLink,
  getContentAnalytics,
  getEnhancedFacultyDashboard,
};
