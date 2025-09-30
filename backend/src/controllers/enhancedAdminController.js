const User = require("../models/User");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Announcement = require("../models/Announcement");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  AppError,
  ValidationError,
  NotFoundError,
  DatabaseError,
} = require("../middleware/enhancedErrorHandler");
const { logger } = require("../middleware/enhancedErrorHandler");
const { invalidateCache } = require("../middleware/cache");

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ==================== DASHBOARD & ANALYTICS ====================

// Enhanced Admin Dashboard with comprehensive analytics
const getEnhancedAdminDashboard = asyncHandler(async (req, res) => {
  try {
    // Get comprehensive system statistics
    const [
      userStats,
      courseStats,
      assignmentStats,
      announcementStats,
      systemHealth,
    ] = await Promise.all([
      getUserStatistics(),
      getCourseStatistics(),
      getAssignmentStatistics(),
      getAnnouncementStatistics(),
      getSystemHealthMetrics(),
    ]);

    // Get recent activities and trends
    const [recentActivities, userGrowth, performanceTrends] = await Promise.all(
      [getRecentActivities(), getUserGrowthData(), getPerformanceTrends()]
    );

    const dashboardData = {
      overview: {
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        totalCourses: courseStats.totalCourses,
        activeCourses: courseStats.activeCourses,
        totalAssignments: assignmentStats.totalAssignments,
        pendingGrading: assignmentStats.pendingGrading,
        systemUptime: systemHealth.uptime,
        databaseStatus: systemHealth.databaseStatus,
      },
      userStatistics: userStats,
      courseStatistics: courseStats,
      assignmentStatistics: assignmentStats,
      announcementStatistics: announcementStats,
      systemHealth,
      recentActivities,
      trends: {
        userGrowth,
        performanceTrends,
      },
    };

    logger.info(`Admin dashboard accessed by: ${req.user.email}`);

    res.json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: dashboardData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Dashboard error: ${error.message}`);
    throw new DatabaseError("Failed to retrieve dashboard data");
  }
});

// ==================== USER MANAGEMENT ====================

// Get all users with advanced filtering and pagination
const getUsers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    role = "",
    status = "",
    sortBy = "createdAt",
    sortOrder = "desc",
    startDate,
    endDate,
  } = req.query;

  // Build filter object
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (status === "active") {
    filter.isActive = true;
  } else if (status === "inactive") {
    filter.isActive = false;
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  try {
    // Get total count
    const totalUsers = await User.countDocuments(filter);

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Add additional user statistics
    const userStats = await User.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ["$isActive", 1, 0] } },
          verifiedUsers: { $sum: { $cond: ["$isVerified", 1, 0] } },
          avgInteractions: { $avg: "$analytics.totalInteractions" },
        },
      },
    ]);

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users: users.map((user) => ({
          ...user,
          id: user._id,
          lastLoginFormatted: user.lastLogin
            ? new Date(user.lastLogin).toLocaleDateString()
            : "Never",
          createdAtFormatted: new Date(user.createdAt).toLocaleDateString(),
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1,
          limit: parseInt(limit),
        },
        statistics: userStats[0] || {
          totalUsers: 0,
          activeUsers: 0,
          verifiedUsers: 0,
          avgInteractions: 0,
        },
      },
    });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    throw new DatabaseError("Failed to retrieve users");
  }
});

// Create new user (Admin only)
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, profile, isActive = true } = req.body;

  // Validate required fields
  if (!name || !email || !password || !role) {
    throw new ValidationError("Name, email, password, and role are required");
  }

  // Validate role
  const validRoles = ["student", "faculty", "admin", "mentor", "counselor"];
  if (!validRoles.includes(role)) {
    throw new ValidationError(
      `Invalid role. Must be one of: ${validRoles.join(", ")}`
    );
  }

  // Validate email format
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Please provide a valid email address");
  }

  // Validate password strength
  if (password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters long");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ValidationError("User already exists with this email");
  }

  // Create new user
  const user = new User({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role,
    profile: profile || {},
    isActive,
    isVerified: true,
    analytics: {
      totalInteractions: 0,
      completedCourses: 0,
      appliedInternships: 0,
      appliedScholarships: 0,
      totalHours: 0,
      achievements: 0,
      lastUpdated: new Date(),
    },
  });

  await user.save();

  // Invalidate cache
  invalidateCache.users("all");

  logger.info(
    `User created: ${user.email} (${user.role}) by admin: ${req.user.email}`
  );

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
  });
});

// Update user information
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  // Remove sensitive fields that shouldn't be updated directly
  delete updateData.password;
  delete updateData._id;
  delete updateData.createdAt;

  // Validate role if provided
  if (updateData.role) {
    const validRoles = ["student", "faculty", "admin", "mentor", "counselor"];
    if (!validRoles.includes(updateData.role)) {
      throw new ValidationError(
        `Invalid role. Must be one of: ${validRoles.join(", ")}`
      );
    }
  }

  // Validate email if provided
  if (updateData.email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(updateData.email)) {
      throw new ValidationError("Please provide a valid email address");
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({
      email: updateData.email.toLowerCase().trim(),
      _id: { $ne: userId },
    });
    if (existingUser) {
      throw new ValidationError("Email is already taken by another user");
    }

    updateData.email = updateData.email.toLowerCase().trim();
  }

  // Prevent admin from changing their own role
  if (
    req.user.id === userId &&
    updateData.role &&
    updateData.role !== req.user.role
  ) {
    throw new ValidationError("You cannot change your own role");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Invalidate cache
  invalidateCache.users("all");

  logger.info(`User updated: ${user.email} by admin: ${req.user.email}`);

  res.json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

// Update user status (activate/deactivate)
const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body;

  // Prevent admin from deactivating themselves
  if (req.user.id === userId && !isActive) {
    throw new ValidationError("You cannot deactivate your own account");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive, updatedAt: new Date() },
    { new: true }
  ).select("name email role isActive");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Invalidate cache
  invalidateCache.users("all");

  logger.info(
    `User status updated: ${user.email} (${
      isActive ? "activated" : "deactivated"
    }) by admin: ${req.user.email}`
  );

  res.json({
    success: true,
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
});

// Reset user password
const resetUserPassword = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { newPassword, confirmPassword } = req.body;

  // Validate passwords
  if (!newPassword || !confirmPassword) {
    throw new ValidationError("New password and confirmation are required");
  }

  if (newPassword !== confirmPassword) {
    throw new ValidationError("Passwords do not match");
  }

  if (newPassword.length < 8) {
    throw new ValidationError("Password must be at least 8 characters long");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("User not found");
  }

  // Update password (will be hashed by pre-save hook)
  user.password = newPassword;
  await user.save();

  logger.info(
    `Password reset for user: ${user.email} by admin: ${req.user.email}`
  );

  res.json({
    success: true,
    message: "Password reset successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { adminPassword } = req.body;

  // Validate admin password
  if (!adminPassword) {
    throw new ValidationError("Admin password is required for user deletion");
  }

  // Get admin user and verify password
  const admin = await User.findById(req.user.id).select("+password");
  if (!admin) {
    throw new NotFoundError("Admin user not found");
  }

  const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
  if (!isPasswordValid) {
    throw new ValidationError("Invalid admin password");
  }

  // Find user to delete
  const userToDelete = await User.findById(userId);
  if (!userToDelete) {
    throw new NotFoundError("User not found");
  }

  // Prevent deletion of admin accounts
  if (userToDelete.role === "admin") {
    throw new ValidationError("Cannot delete admin accounts");
  }

  // Prevent self-deletion
  if (userId === req.user.id) {
    throw new ValidationError("You cannot delete your own account");
  }

  // Delete user
  await User.findByIdAndDelete(userId);

  // Invalidate cache
  invalidateCache.users("all");

  logger.info(
    `User deleted: ${userToDelete.email} by admin: ${req.user.email}`
  );

  res.json({
    success: true,
    message: "User deleted successfully",
    data: {
      deletedUserId: userId,
      deletedUserName: userToDelete.name,
      deletedUserEmail: userToDelete.email,
    },
  });
});

// ==================== COURSE MANAGEMENT ====================

// Get all courses with advanced filtering
const getCourses = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    department = "",
    semester = "",
    status = "",
    faculty = "",
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build filter object
  const filter = {};

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { code: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (department) filter.department = department;
  if (semester) filter.semester = semester;
  if (status) filter.status = status;
  if (faculty) filter.facultyId = faculty;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === "asc" ? 1 : -1;

  try {
    // Get total count
    const totalCourses = await Course.countDocuments(filter);

    // Get courses with pagination and populate faculty info
    const courses = await Course.find(filter)
      .populate("facultyId", "name email")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Get course statistics
    const courseStats = await Course.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          activeCourses: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          avgEnrollment: { $avg: { $size: "$enrolledStudents" } },
          totalEnrollments: { $sum: { $size: "$enrolledStudents" } },
        },
      },
    ]);

    res.json({
      success: true,
      message: "Courses retrieved successfully",
      data: {
        courses: courses.map((course) => ({
          ...course,
          id: course._id,
          facultyName: course.facultyId?.name || "Unassigned",
          facultyEmail: course.facultyId?.email || "",
          enrollmentCount: course.enrolledStudents?.length || 0,
          createdAtFormatted: new Date(course.createdAt).toLocaleDateString(),
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalCourses / limit),
          totalCourses,
          hasNext: page < Math.ceil(totalCourses / limit),
          hasPrev: page > 1,
          limit: parseInt(limit),
        },
        statistics: courseStats[0] || {
          totalCourses: 0,
          activeCourses: 0,
          avgEnrollment: 0,
          totalEnrollments: 0,
        },
      },
    });
  } catch (error) {
    logger.error(`Get courses error: ${error.message}`);
    throw new DatabaseError("Failed to retrieve courses");
  }
});

// Archive/Restore course
const updateCourseStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { status } = req.body;

  const validStatuses = ["active", "archived", "suspended"];
  if (!validStatuses.includes(status)) {
    throw new ValidationError(
      `Invalid status. Must be one of: ${validStatuses.join(", ")}`
    );
  }

  const course = await Course.findByIdAndUpdate(
    courseId,
    { status, updatedAt: new Date() },
    { new: true }
  ).populate("facultyId", "name email");

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Invalidate cache
  invalidateCache.courses("all");

  logger.info(
    `Course status updated: ${course.code} (${status}) by admin: ${req.user.email}`
  );

  res.json({
    success: true,
    message: `Course ${status} successfully`,
    data: {
      id: course._id,
      title: course.title,
      code: course.code,
      status: course.status,
      facultyName: course.facultyId?.name || "Unassigned",
    },
  });
});

// Assign faculty to course
const assignFacultyToCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { facultyId } = req.body;

  if (!facultyId) {
    throw new ValidationError("Faculty ID is required");
  }

  // Verify faculty exists and has faculty role
  const faculty = await User.findOne({ _id: facultyId, role: "faculty" });
  if (!faculty) {
    throw new NotFoundError("Faculty not found or invalid role");
  }

  const course = await Course.findByIdAndUpdate(
    courseId,
    { facultyId, updatedAt: new Date() },
    { new: true }
  ).populate("facultyId", "name email");

  if (!course) {
    throw new NotFoundError("Course not found");
  }

  // Invalidate cache
  invalidateCache.courses("all");

  logger.info(
    `Faculty assigned to course: ${course.code} -> ${faculty.email} by admin: ${req.user.email}`
  );

  res.json({
    success: true,
    message: "Faculty assigned successfully",
    data: {
      id: course._id,
      title: course.title,
      code: course.code,
      facultyName: course.facultyId.name,
      facultyEmail: course.facultyId.email,
    },
  });
});

// ==================== SYSTEM-WIDE ANNOUNCEMENTS ====================

// Create system-wide announcement
const createSystemAnnouncement = asyncHandler(async (req, res) => {
  const {
    title,
    content,
    priority = "normal",
    targetRoles = [],
    targetUsers = [],
  } = req.body;

  if (!title || !content) {
    throw new ValidationError("Title and content are required");
  }

  const validPriorities = ["low", "normal", "high", "urgent"];
  if (!validPriorities.includes(priority)) {
    throw new ValidationError(
      `Invalid priority. Must be one of: ${validPriorities.join(", ")}`
    );
  }

  const validRoles = ["student", "faculty", "admin", "mentor", "counselor"];
  if (targetRoles.length > 0) {
    const invalidRoles = targetRoles.filter(
      (role) => !validRoles.includes(role)
    );
    if (invalidRoles.length > 0) {
      throw new ValidationError(`Invalid roles: ${invalidRoles.join(", ")}`);
    }
  }

  const announcement = new Announcement({
    title: title.trim(),
    content: content.trim(),
    priority,
    authorId: req.user.id,
    targetAudience: {
      roles: targetRoles,
      users: targetUsers,
    },
    status: "published",
    type: "system",
  });

  await announcement.save();

  // Invalidate cache
  invalidateCache.announcements("all");

  logger.info(
    `System announcement created: ${title} by admin: ${req.user.email}`
  );

  res.status(201).json({
    success: true,
    message: "System announcement created successfully",
    data: {
      id: announcement._id,
      title: announcement.title,
      priority: announcement.priority,
      targetRoles: announcement.targetAudience.roles,
      createdAt: announcement.createdAt,
    },
  });
});

// Get system announcements
const getSystemAnnouncements = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, priority = "", status = "" } = req.query;

  const filter = { type: "system" };
  if (priority) filter.priority = priority;
  if (status) filter.status = status;

  try {
    const totalAnnouncements = await Announcement.countDocuments(filter);

    const announcements = await Announcement.find(filter)
      .populate("authorId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      message: "System announcements retrieved successfully",
      data: {
        announcements: announcements.map((announcement) => ({
          ...announcement,
          id: announcement._id,
          authorName: announcement.authorId?.name || "System",
          createdAtFormatted: new Date(
            announcement.createdAt
          ).toLocaleDateString(),
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalAnnouncements / limit),
          totalAnnouncements,
          hasNext: page < Math.ceil(totalAnnouncements / limit),
          hasPrev: page > 1,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    logger.error(`Get system announcements error: ${error.message}`);
    throw new DatabaseError("Failed to retrieve system announcements");
  }
});

// ==================== SYSTEM SETTINGS ====================

// Get system settings
const getSystemSettings = asyncHandler(async (req, res) => {
  // In a real application, this would come from a settings collection
  // For now, we'll return default settings
  const defaultSettings = {
    siteName: "Smart Student Hub",
    siteDescription: "Comprehensive Learning Management System",
    allowRegistration: true,
    requireEmailVerification: true,
    defaultUserRole: "student",
    maxFileUploadSize: 10485760, // 10MB
    allowedFileTypes: [
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "jpg",
      "jpeg",
      "png",
      "gif",
    ],
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false,
    maintenanceMessage: "System is under maintenance. Please try again later.",
    features: {
      studentPortal: true,
      facultyPortal: true,
      adminPortal: true,
      discussionForums: true,
      fileSharing: true,
      attendanceTracking: true,
      gradeManagement: true,
      analytics: true,
    },
    branding: {
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      logo: "/images/logo.png",
      favicon: "/images/favicon.ico",
    },
  };

  res.json({
    success: true,
    message: "System settings retrieved successfully",
    data: defaultSettings,
  });
});

// Update system settings
const updateSystemSettings = asyncHandler(async (req, res) => {
  const { adminPassword } = req.body;
  const settings = req.body.settings;

  // Validate admin password
  if (!adminPassword) {
    throw new ValidationError("Admin password is required");
  }

  const admin = await User.findById(req.user.id).select("+password");
  if (!admin) {
    throw new NotFoundError("Admin user not found");
  }

  const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
  if (!isPasswordValid) {
    throw new ValidationError("Invalid admin password");
  }

  // In a real application, save settings to database
  // For now, we'll just log the update
  logger.info(`System settings updated by admin: ${req.user.email}`);

  res.json({
    success: true,
    message: "System settings updated successfully",
    data: settings,
  });
});

// ==================== HELPER FUNCTIONS ====================

// Get user statistics
async function getUserStatistics() {
  const [
    totalUsers,
    activeUsers,
    verifiedUsers,
    roleDistribution,
    monthlyGrowth,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isVerified: true }),
    User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]),
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers: totalUsers - activeUsers,
    verifiedUsers,
    unverifiedUsers: totalUsers - verifiedUsers,
    roleDistribution: roleDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    monthlyGrowth,
  };
}

// Get course statistics
async function getCourseStatistics() {
  const [
    totalCourses,
    activeCourses,
    archivedCourses,
    departmentDistribution,
    enrollmentStats,
  ] = await Promise.all([
    Course.countDocuments(),
    Course.countDocuments({ status: "active" }),
    Course.countDocuments({ status: "archived" }),
    Course.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Course.aggregate([
      {
        $group: {
          _id: null,
          totalEnrollments: { $sum: { $size: "$enrolledStudents" } },
          avgEnrollment: { $avg: { $size: "$enrolledStudents" } },
        },
      },
    ]),
  ]);

  return {
    totalCourses,
    activeCourses,
    archivedCourses,
    suspendedCourses: totalCourses - activeCourses - archivedCourses,
    departmentDistribution: departmentDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    totalEnrollments: enrollmentStats[0]?.totalEnrollments || 0,
    avgEnrollment: Math.round(enrollmentStats[0]?.avgEnrollment || 0),
  };
}

// Get assignment statistics
async function getAssignmentStatistics() {
  const [totalAssignments, pendingGrading, gradedAssignments, assignmentTypes] =
    await Promise.all([
      Assignment.countDocuments(),
      Assignment.countDocuments({ "submissions.status": "submitted" }),
      Assignment.countDocuments({ "submissions.status": "graded" }),
      Assignment.aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

  return {
    totalAssignments,
    pendingGrading,
    gradedAssignments,
    assignmentTypes: assignmentTypes.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
}

// Get announcement statistics
async function getAnnouncementStatistics() {
  const [
    totalAnnouncements,
    systemAnnouncements,
    courseAnnouncements,
    priorityDistribution,
  ] = await Promise.all([
    Announcement.countDocuments(),
    Announcement.countDocuments({ type: "system" }),
    Announcement.countDocuments({ type: "course" }),
    Announcement.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  return {
    totalAnnouncements,
    systemAnnouncements,
    courseAnnouncements,
    priorityDistribution: priorityDistribution.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
  };
}

// Get system health metrics
async function getSystemHealthMetrics() {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const uptime = process.uptime();

  return {
    databaseStatus: dbStatus,
    uptime: Math.floor(uptime),
    uptimeFormatted: formatUptime(uptime),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
    platform: process.platform,
  };
}

// Get recent activities
async function getRecentActivities() {
  const [recentUsers, recentCourses, recentAnnouncements] = await Promise.all([
    User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt"),
    Course.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title code createdAt"),
    Announcement.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title priority createdAt"),
  ]);

  const activities = [
    ...recentUsers.map((user) => ({
      type: "user_registration",
      description: `New ${user.role} registered: ${user.name}`,
      timestamp: user.createdAt,
      metadata: { userId: user._id, email: user.email },
    })),
    ...recentCourses.map((course) => ({
      type: "course_created",
      description: `Course created: ${course.title} (${course.code})`,
      timestamp: course.createdAt,
      metadata: { courseId: course._id, code: course.code },
    })),
    ...recentAnnouncements.map((announcement) => ({
      type: "announcement_created",
      description: `Announcement created: ${announcement.title}`,
      timestamp: announcement.createdAt,
      metadata: {
        announcementId: announcement._id,
        priority: announcement.priority,
      },
    })),
  ];

  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20);
}

// Get user growth data
async function getUserGrowthData() {
  const growthData = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

    const count = await User.countDocuments({
      createdAt: { $gte: date, $lt: nextDate },
    });

    growthData.push({
      month: date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      count,
    });
  }

  return growthData;
}

// Get performance trends
async function getPerformanceTrends() {
  // This would typically involve complex analytics
  // For now, return mock data
  return {
    averageGrade: 85.5,
    completionRate: 78.3,
    engagementScore: 82.1,
    satisfactionRating: 4.2,
  };
}

// Format uptime in human readable format
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

module.exports = {
  // Dashboard & Analytics
  getEnhancedAdminDashboard,

  // User Management
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
  resetUserPassword,
  deleteUser,

  // Course Management
  getCourses,
  updateCourseStatus,
  assignFacultyToCourse,

  // System Announcements
  createSystemAnnouncement,
  getSystemAnnouncements,

  // System Settings
  getSystemSettings,
  updateSystemSettings,
};

