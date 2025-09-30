const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  validateCourse,
  validateAssignment,
  validateAttendanceSession,
  validateGrade,
  validateAnnouncement,
  validateContent,
  validateBulkMessage,
  validateObjectId,
  validatePagination,
  validateDateRange,
  validateFileUpload,
  validateRateLimit,
} = require("../middleware/validation");
const {
  cacheAnalytics,
  cacheCourses,
  cacheAssignments,
  cacheAttendance,
  cacheContent,
} = require("../middleware/cache");
const {
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
} = require("../controllers/enhancedFacultyControllerV2");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Dashboard
router.get("/dashboard", getEnhancedFacultyDashboard);

// Course Management Routes
router.post("/courses", createCourse);
router.get("/courses", getFacultyCourses);
router.put("/courses/:courseId", updateCourse);
router.post(
  "/courses/:courseId/syllabus",
  uploadSyllabus.single("syllabus"),
  handleSyllabusUpload
);

// Assignment Management Routes
router.post("/assignments", createAssignment);
router.get("/courses/:courseId/assignments", getCourseAssignments);
router.put(
  "/assignments/:assignmentId/submissions/:submissionId/grade",
  gradeAssignment
);
router.post(
  "/assignments/:assignmentId/bulk-grade",
  uploadGrades,
  handleBulkGradeUpload
);

// Attendance Management Routes
router.post("/attendance", createAttendanceSession);
router.put("/attendance/:attendanceId/mark", markAttendance);
router.get("/courses/:courseId/attendance/analytics", getAttendanceAnalytics);
router.get("/courses/:courseId/attendance/report", generateAttendanceReport);

// Student Analytics Routes
router.get("/courses/:courseId/analytics", getStudentProgressDashboard);

// Announcement Management Routes
router.post("/announcements", createAnnouncement);
router.get("/announcements", getAnnouncements);
router.post("/announcements/bulk", sendBulkMessage);

// Content Management Routes
router.post("/content", uploadContent, handleContentUpload);
router.get("/content", getFacultyContent);
router.put("/content/:contentId", updateContent);
router.post("/content/:contentId/share", generateShareableLink);
router.get("/content/analytics", getContentAnalytics);

module.exports = router;
