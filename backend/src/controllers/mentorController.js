const User = require("../models/User");
const { ensureDbConnection } = require("../utils/database");

// Get all students for a mentor
const getStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;
    const { page = 1, limit = 10, search = "" } = req.query;

    // For now, return all students (in a real app, you'd have mentor-student relationships)
    const query = {
      role: "student",
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    };

    const students = await User.find(query)
      .select("name email role profile analytics lastLogin")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastLogin: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      students,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Assign students to mentor
const assignStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentIds } = req.body;
    const mentorId = req.user.id;

    // Update students with mentor assignment
    await User.updateMany(
      { _id: { $in: studentIds }, role: "student" },
      { $set: { mentorId } }
    );

    res.json({
      success: true,
      message: "Students assigned successfully",
    });
  } catch (error) {
    console.error("Assign students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mentor's assigned students
const getAssignedStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;

    const students = await User.find({ mentorId, role: "student" })
      .select("name email profile analytics lastLogin")
      .sort({ lastLogin: -1 });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Get assigned students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Send message to students
const sendMessage = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentIds, message, type = "guidance" } = req.body;
    const mentorId = req.user.id;

    // In a real app, you'd save this to a messages collection
    // For now, just log it
    console.log(
      `Mentor ${mentorId} sent ${type} message to students ${studentIds}: ${message}`
    );

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mentor dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;

    // Get assigned students
    const assignedStudents = await User.find({ mentorId, role: "student" });

    // Calculate stats
    const totalStudents = assignedStudents.length;
    const activeStudents = assignedStudents.filter((s) => {
      const lastLogin = new Date(s.lastLogin);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastLogin > oneDayAgo;
    }).length;

    const avgProgress =
      assignedStudents.length > 0
        ? Math.round(
            assignedStudents.reduce(
              (acc, s) => acc + (s.analytics?.totalInteractions || 0),
              0
            ) / assignedStudents.length
          )
        : 0;

    const avgAptitude =
      assignedStudents.length > 0
        ? Math.round(
            assignedStudents.reduce(
              (acc, s) => acc + (s.analytics?.achievements || 0),
              0
            ) / assignedStudents.length
          )
        : 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        avgProgress,
        avgAptitude,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getStudents,
  assignStudents,
  getAssignedStudents,
  sendMessage,
  getDashboardStats,
};
