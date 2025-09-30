const Course = require("../models/Course");
const User = require("../models/User");
const { validationResult } = require("express-validator");
const { createPaginatedResponse } = require("../middleware/pagination");

// Get all courses with filtering and pagination
const getCourses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      semester,
      instructor,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { instructor: { $regex: search, $options: "i" } },
      ];
    }

    if (status) filter.status = status;
    if (semester) filter.semester = semester;
    if (instructor) filter.instructor = { $regex: instructor, $options: "i" };

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Execute query with pagination
    const courses = await Course.find(filter)
      .populate("instructorId", "name email")
      .populate("createdBy", "name email")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(filter);

    const response = createPaginatedResponse(courses, page, limit, total);

    res.json({
      success: true,
      message: "Courses retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("instructorId", "name email")
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course retrieved successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create new course
const createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const courseData = {
      ...req.body,
      createdBy: req.user.id,
      instructorId: req.body.instructorId || req.user.id,
    };

    const course = new Course(courseData);
    await course.save();

    await course.populate("instructorId", "name email");
    await course.populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = {
      ...req.body,
      lastModifiedBy: req.user.id,
    };

    const course = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("instructorId", "name email")
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get courses by instructor
const getCoursesByInstructor = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { status, semester } = req.query;

    const filter = { instructorId };
    if (status) filter.status = status;
    if (semester) filter.semester = semester;

    const courses = await Course.find(filter)
      .populate("instructorId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Instructor courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching instructor courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get active courses
const getActiveCourses = async (req, res) => {
  try {
    const courses = await Course.findActive()
      .populate("instructorId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Active courses retrieved successfully",
      data: courses,
    });
  } catch (error) {
    console.error("Error fetching active courses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Enroll student in course
const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { studentId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.isFull()) {
      return res.status(400).json({
        success: false,
        message: "Course is full",
      });
    }

    if (!course.isEnrollmentOpen()) {
      return res.status(400).json({
        success: false,
        message: "Course enrollment is closed",
      });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Course.findOne({
      _id: courseId,
      "enrollments.student": studentId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    // Add enrollment
    course.enrollments.push({
      student: studentId,
      enrolledAt: new Date(),
    });

    course.enrolledStudents += 1;
    await course.save();

    await course.populate("instructorId", "name email");

    res.json({
      success: true,
      message: "Student enrolled successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Unenroll student from course
const unenrollStudent = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Remove enrollment
    course.enrollments = course.enrollments.filter(
      (enrollment) => enrollment.student.toString() !== userId
    );

    course.enrolledStudents = Math.max(0, course.enrolledStudents - 1);
    await course.save();

    await course.populate("instructorId", "name email");

    res.json({
      success: true,
      message: "Student unenrolled successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error unenrolling student:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get course statistics
const getCourseStatistics = async (req, res) => {
  try {
    const stats = await Course.aggregate([
      {
        $group: {
          _id: null,
          totalCourses: { $sum: 1 },
          activeCourses: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          inactiveCourses: {
            $sum: { $cond: [{ $eq: ["$status", "inactive"] }, 1, 0] },
          },
          archivedCourses: {
            $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] },
          },
          totalEnrollments: { $sum: "$enrolledStudents" },
          averageEnrollment: { $avg: "$enrolledStudents" },
        },
      },
    ]);

    const semesterStats = await Course.aggregate([
      {
        $group: {
          _id: "$semester",
          count: { $sum: 1 },
          enrollments: { $sum: "$enrolledStudents" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const instructorStats = await Course.aggregate([
      {
        $group: {
          _id: "$instructorId",
          courseCount: { $sum: 1 },
          totalEnrollments: { $sum: "$enrolledStudents" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $project: {
          instructorName: "$instructor.name",
          instructorEmail: "$instructor.email",
          courseCount: 1,
          totalEnrollments: 1,
        },
      },
      { $sort: { courseCount: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      message: "Course statistics retrieved successfully",
      data: {
        overview: stats[0] || {
          totalCourses: 0,
          activeCourses: 0,
          inactiveCourses: 0,
          archivedCourses: 0,
          totalEnrollments: 0,
          averageEnrollment: 0,
        },
        semesterDistribution: semesterStats,
        topInstructors: instructorStats,
      },
    });
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
  getActiveCourses,
  enrollStudent,
  unenrollStudent,
  getCourseStatistics,
};
