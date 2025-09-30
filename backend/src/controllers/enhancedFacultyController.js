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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = `uploads/faculty/${req.user.id}/${file.fieldname}`;
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 10, // Maximum 10 files per request
  },
  fileFilter: (req, file, cb) => {
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
        new Error(
          "Invalid file type. Only images, documents, presentations, spreadsheets, videos, and zip files are allowed."
        )
      );
    }
  },
});

// Course Management Functions

// Create new course
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

// Get faculty courses
const getFacultyCourses = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { status, semester, academicYear } = req.query;

    const filter = { facultyId };
    if (status) filter.status = status;
    if (semester) filter.semester = semester;
    if (academicYear) filter.academicYear = academicYear;

    const courses = await Course.find(filter)
      .populate("enrolledStudents.studentId", "name email")
      .populate("coInstructors", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Get faculty courses error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching courses",
    });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const facultyId = req.user.id;

    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        course[key] = req.body[key];
      }
    });

    await course.save();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating course",
    });
  }
};

// Upload course syllabus
const uploadSyllabus = upload.single("syllabus");

const handleSyllabusUpload = async (req, res) => {
  try {
    const { courseId } = req.params;
    const facultyId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.syllabus = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      url: `/uploads/faculty/${facultyId}/syllabus/${req.file.filename}`,
      uploadedAt: new Date(),
      version: (parseFloat(course.syllabus.version || "0") + 0.1).toFixed(1),
    };

    await course.save();

    res.json({
      success: true,
      message: "Syllabus uploaded successfully",
      data: course.syllabus,
    });
  } catch (error) {
    console.error("Upload syllabus error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading syllabus",
    });
  }
};

// Assignment Management Functions

// Create assignment
const createAssignment = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const assignmentData = { ...req.body, facultyId };

    const assignment = new Assignment(assignmentData);
    await assignment.save();

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating assignment",
      error: error.message,
    });
  }
};

// Get course assignments
const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const facultyId = req.user.id;

    // Verify faculty has access to this course
    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const assignments = await Assignment.find({ courseId })
      .populate("submissions.studentId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    console.error("Get course assignments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
    });
  }
};

// Grade assignment
const gradeAssignment = async (req, res) => {
  try {
    const { assignmentId, submissionId } = req.params;
    const { score, feedback } = req.body;
    const facultyId = req.user.id;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      facultyId,
    });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    const submission = assignment.submissions.id(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    assignment.gradeAssignment(
      submission.studentId,
      score,
      feedback,
      facultyId
    );
    await assignment.save();

    res.json({
      success: true,
      message: "Assignment graded successfully",
      data: submission,
    });
  } catch (error) {
    console.error("Grade assignment error:", error);
    res.status(500).json({
      success: false,
      message: "Error grading assignment",
    });
  }
};

// Bulk grade upload
const uploadGrades = upload.single("grades");

const handleBulkGradeUpload = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const facultyId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      facultyId,
    });
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    // Parse Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(req.file.path);
    const worksheet = workbook.getWorksheet(1);

    const grades = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        // Skip header row
        const studentId = row.getCell(1).value;
        const score = row.getCell(2).value;
        const feedback = row.getCell(3).value || "";

        if (studentId && score !== undefined) {
          grades.push({ studentId, score, feedback });
        }
      }
    });

    // Apply grades
    for (const grade of grades) {
      assignment.gradeAssignment(
        grade.studentId,
        grade.score,
        grade.feedback,
        facultyId
      );
    }

    await assignment.save();

    // Clean up uploaded file
    await fs.unlink(req.file.path);

    res.json({
      success: true,
      message: `Successfully graded ${grades.length} submissions`,
      data: { gradedCount: grades.length },
    });
  } catch (error) {
    console.error("Bulk grade upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading grades",
    });
  }
};

// Attendance Management Functions

// Create attendance session
const createAttendanceSession = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { courseId, date, classNumber, topic, location, duration } = req.body;

    // Verify faculty has access to this course
    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const attendance = new Attendance({
      courseId,
      facultyId,
      date: new Date(date),
      classNumber,
      topic,
      location,
      duration,
    });

    await attendance.save();

    // Generate QR code
    const qrCode = await QRCode.toDataURL(
      JSON.stringify({
        attendanceId: attendance._id,
        courseId,
        timestamp: Date.now(),
      })
    );

    res.json({
      success: true,
      message: "Attendance session created successfully",
      data: {
        attendance,
        qrCode,
      },
    });
  } catch (error) {
    console.error("Create attendance session error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating attendance session",
    });
  }
};

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { studentId, status, notes } = req.body;
    const facultyId = req.user.id;

    const attendance = await Attendance.findOne({
      _id: attendanceId,
      facultyId,
    });
    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: "Attendance session not found",
      });
    }

    attendance.markAttendance(studentId, status, notes, "manual");
    await attendance.save();

    res.json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Mark attendance error:", error);
    res.status(500).json({
      success: false,
      message: "Error marking attendance",
    });
  }
};

// Get attendance analytics
const getAttendanceAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;
    const facultyId = req.user.id;

    // Verify faculty has access to this course
    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const analytics = await Attendance.getCourseAttendanceAnalytics(
      courseId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: analytics[0] || {},
    });
  } catch (error) {
    console.error("Get attendance analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching attendance analytics",
    });
  }
};

// Generate attendance report
const generateAttendanceReport = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate, format = "pdf" } = req.query;
    const facultyId = req.user.id;

    // Verify faculty has access to this course
    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const report = await Attendance.generateAttendanceReport(
      courseId,
      startDate,
      endDate
    );

    if (format === "excel") {
      // Generate Excel report
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Attendance Report");

      // Add headers
      worksheet.columns = [
        { header: "Student Name", key: "studentName", width: 20 },
        { header: "Student Email", key: "studentEmail", width: 25 },
        { header: "Total Classes", key: "totalClasses", width: 15 },
        { header: "Present", key: "presentClasses", width: 15 },
        { header: "Late", key: "lateClasses", width: 15 },
        { header: "Absent", key: "absentClasses", width: 15 },
        { header: "Attendance Rate (%)", key: "attendanceRate", width: 20 },
      ];

      // Add data
      report.forEach((row) => {
        worksheet.addRow({
          studentName: row.studentName,
          studentEmail: row.studentEmail,
          totalClasses: row.totalClasses,
          presentClasses: row.presentClasses,
          lateClasses: row.lateClasses,
          absentClasses: row.absentClasses,
          attendanceRate: row.attendanceRate.toFixed(2),
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
        `attachment; filename=attendance-report-${courseId}.xlsx`
      );
      res.send(buffer);
    } else {
      // Generate PDF report
      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=attendance-report-${courseId}.pdf`
      );
      doc.pipe(res);

      doc.fontSize(20).text("Attendance Report", { align: "center" });
      doc
        .fontSize(14)
        .text(`Course: ${course.title} (${course.code})`, { align: "center" });
      doc.moveDown();

      report.forEach((student) => {
        doc
          .fontSize(12)
          .text(`Student: ${student.studentName}`, { continued: true })
          .text(` | Email: ${student.studentEmail}`)
          .text(
            `Total Classes: ${student.totalClasses} | Present: ${student.presentClasses} | Late: ${student.lateClasses} | Absent: ${student.absentClasses}`
          )
          .text(`Attendance Rate: ${student.attendanceRate.toFixed(2)}%`)
          .moveDown();
      });

      doc.end();
    }
  } catch (error) {
    console.error("Generate attendance report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating attendance report",
    });
  }
};

// Student Analytics Functions

// Get student progress dashboard
const getStudentProgressDashboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    const facultyId = req.user.id;

    // Verify faculty has access to this course
    const course = await Course.findOne({ _id: courseId, facultyId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Get course analytics
    const courseAnalytics = await Course.getCourseAnalytics(courseId);

    // Get assignment analytics
    const assignments = await Assignment.find({ courseId });
    const assignmentAnalytics = assignments.map((assignment) => ({
      id: assignment._id,
      title: assignment.title,
      type: assignment.type,
      totalSubmissions: assignment.analytics.totalSubmissions,
      averageScore: assignment.analytics.averageScore,
      completionRate: assignment.analytics.completionRate,
    }));

    // Get attendance analytics
    const attendanceAnalytics = await Attendance.getCourseAttendanceAnalytics(
      courseId
    );

    // Get student performance
    const studentPerformance = await Assignment.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      { $unwind: "$submissions" },
      {
        $group: {
          _id: "$submissions.studentId",
          totalAssignments: { $sum: 1 },
          averageScore: { $avg: "$submissions.score" },
          totalPoints: { $sum: "$submissions.maxScore" },
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
          totalPoints: 1,
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
    ]);

    res.json({
      success: true,
      data: {
        course: courseAnalytics[0],
        assignments: assignmentAnalytics,
        attendance: attendanceAnalytics[0],
        studentPerformance,
      },
    });
  } catch (error) {
    console.error("Get student progress dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching student progress dashboard",
    });
  }
};

// Announcement Management Functions

// Create announcement
const createAnnouncement = async (req, res) => {
  try {
    const authorId = req.user.id;
    const announcementData = { ...req.body, authorId };

    const announcement = new Announcement(announcementData);
    await announcement.save();

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Create announcement error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating announcement",
      error: error.message,
    });
  }
};

// Get announcements
const getAnnouncements = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { courseId, status, priority } = req.query;

    const filter = { authorId: facultyId };
    if (courseId) filter.courseId = courseId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const announcements = await Announcement.find(filter)
      .populate("courseId", "title code")
      .populate("recipients", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    console.error("Get announcements error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching announcements",
    });
  }
};

// Bulk messaging
const sendBulkMessage = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { recipients, message, subject, priority = "normal" } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No recipients specified",
      });
    }

    const announcements = recipients.map((recipientId) => ({
      title: subject,
      content: message,
      authorId: facultyId,
      targetAudience: "specific-students",
      recipients: [recipientId],
      priority,
      status: "published",
    }));

    const createdAnnouncements = await Announcement.insertMany(announcements);

    res.json({
      success: true,
      message: `Successfully sent ${createdAnnouncements.length} messages`,
      data: { sentCount: createdAnnouncements.length },
    });
  } catch (error) {
    console.error("Send bulk message error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending bulk messages",
    });
  }
};

// Content Management Functions

// Upload content
const uploadContent = upload.fields([
  { name: "files", maxCount: 10 },
  { name: "thumbnail", maxCount: 1 },
]);

const handleContentUpload = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { title, description, type, category, courseId, moduleId, metadata } =
      req.body;

    const contentData = {
      title,
      description,
      type,
      category,
      facultyId,
      courseId: courseId || null,
      moduleId: moduleId || null,
      metadata: metadata ? JSON.parse(metadata) : {},
    };

    // Handle file uploads
    if (req.files) {
      const files = [];

      if (req.files.files) {
        req.files.files.forEach((file) => {
          files.push({
            filename: file.filename,
            originalName: file.originalname,
            url: `/uploads/faculty/${facultyId}/content/${file.filename}`,
            size: file.size,
            mimeType: file.mimetype,
            uploadedAt: new Date(),
          });
        });
      }

      contentData.files = files;
    }

    const content = new Content(contentData);
    await content.save();

    res.status(201).json({
      success: true,
      message: "Content uploaded successfully",
      data: content,
    });
  } catch (error) {
    console.error("Upload content error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading content",
      error: error.message,
    });
  }
};

// Get faculty content
const getFacultyContent = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { courseId, type, category, status } = req.query;

    const filter = { facultyId };
    if (courseId) filter.courseId = courseId;
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;

    const content = await Content.find(filter)
      .populate("courseId", "title code")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get faculty content error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching content",
    });
  }
};

// Update content
const updateContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const facultyId = req.user.id;

    const content = await Content.findOne({ _id: contentId, facultyId });
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        content[key] = req.body[key];
      }
    });

    await content.save();

    res.json({
      success: true,
      message: "Content updated successfully",
      data: content,
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating content",
    });
  }
};

// Generate shareable link
const generateShareableLink = async (req, res) => {
  try {
    const { contentId } = req.params;
    const facultyId = req.user.id;

    const content = await Content.findOne({ _id: contentId, facultyId });
    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const shareableLink = content.generateShareableLink();
    await content.save();

    res.json({
      success: true,
      message: "Shareable link generated successfully",
      data: {
        shareableLink: `${req.protocol}://${req.get("host")}${shareableLink}`,
      },
    });
  } catch (error) {
    console.error("Generate shareable link error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating shareable link",
    });
  }
};

// Get content analytics
const getContentAnalytics = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { startDate, endDate } = req.query;

    const analytics = await Content.getContentAnalytics(
      facultyId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: analytics[0] || {},
    });
  } catch (error) {
    console.error("Get content analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching content analytics",
    });
  }
};

// Enhanced Faculty Dashboard
const getEnhancedFacultyDashboard = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // Get faculty courses
    const courses = await Course.find({ facultyId })
      .populate("enrolledStudents.studentId", "name email")
      .sort({ createdAt: -1 });

    // Get pending approvals
    const pendingApprovals = await FacultyApproval.find({
      facultyId,
      status: "pending",
    })
      .populate("studentId", "name email")
      .populate("activityId")
      .sort({ createdAt: -1 })
      .limit(10);

    // Get recent announcements
    const recentAnnouncements = await Announcement.find({ authorId: facultyId })
      .populate("courseId", "title code")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get analytics
    const courseAnalytics = await Course.aggregate([
      { $match: { facultyId: new mongoose.Types.ObjectId(facultyId) } },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          activeCourses: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          totalStudents: { $sum: { $size: "$enrolledStudents" } },
          averageEnrollment: { $avg: { $size: "$enrolledStudents" } },
        },
      },
    ]);

    const assignmentAnalytics = await Assignment.aggregate([
      { $match: { facultyId: new mongoose.Types.ObjectId(facultyId) } },
      {
        $group: {
          _id: null,
          totalAssignments: { $sum: 1 },
          totalSubmissions: { $sum: "$analytics.totalSubmissions" },
          averageScore: { $avg: "$analytics.averageScore" },
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        courses,
        pendingApprovals,
        recentAnnouncements,
        analytics: {
          courses: courseAnalytics[0] || {},
          assignments: assignmentAnalytics[0] || {},
        },
      },
    });
  } catch (error) {
    console.error("Get enhanced faculty dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching faculty dashboard",
    });
  }
};

module.exports = {
  // Course Management
  createCourse,
  getFacultyCourses,
  updateCourse,
  uploadSyllabus,
  handleSyllabusUpload,

  // Assignment Management
  createAssignment,
  getCourseAssignments,
  gradeAssignment,
  uploadGrades,
  handleBulkGradeUpload,

  // Attendance Management
  createAttendanceSession,
  markAttendance,
  getAttendanceAnalytics,
  generateAttendanceReport,

  // Student Analytics
  getStudentProgressDashboard,

  // Announcement Management
  createAnnouncement,
  getAnnouncements,
  sendBulkMessage,

  // Content Management
  uploadContent,
  handleContentUpload,
  getFacultyContent,
  updateContent,
  generateShareableLink,
  getContentAnalytics,

  // Dashboard
  getEnhancedFacultyDashboard,
};
