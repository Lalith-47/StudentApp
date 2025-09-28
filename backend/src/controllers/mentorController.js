const User = require("../models/User");
const { ensureDbConnection } = require("../utils/database");

// Get all students for a mentor with assignment status
const getStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;
    const { page = 1, limit = 10, search = "", filter = "all" } = req.query;

    // Build query based on filter
    let query = {
      role: "student",
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    };

    // Apply filter for assignment status
    if (filter === "assigned") {
      query.mentorId = { $exists: true, $ne: null };
    } else if (filter === "unassigned") {
      query.$or = [
        { mentorId: { $exists: false } },
        { mentorId: null },
      ];
    }

    const students = await User.find(query)
      .select("name email role profile analytics lastLogin mentorId")
      .populate("mentorId", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastLogin: -1 });

    const total = await User.countDocuments(query);

    // Add assignment status to each student
    const studentsWithStatus = students.map(student => ({
      ...student.toObject(),
      isAssigned: !!student.mentorId,
      assignedMentor: student.mentorId ? {
        name: student.mentorId.name,
        email: student.mentorId.email
      } : null,
      canAssign: !student.mentorId || student.mentorId._id.toString() === mentorId
    }));

    res.json({
      success: true,
      students: studentsWithStatus,
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

    // Check if students are already assigned to other mentors
    const students = await User.find({ _id: { $in: studentIds }, role: "student" });
    const alreadyAssigned = students.filter(s => s.mentorId && s.mentorId.toString() !== mentorId);

    if (alreadyAssigned.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some students are already assigned to other mentors: ${alreadyAssigned.map(s => s.name).join(", ")}`,
      });
    }

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

// Unassign students from mentor
const unassignStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentIds } = req.body;
    const mentorId = req.user.id;

    // Only allow unassigning students assigned to this mentor
    await User.updateMany(
      { _id: { $in: studentIds }, role: "student", mentorId },
      { $unset: { mentorId: 1 } }
    );

    res.json({
      success: true,
      message: "Students unassigned successfully",
    });
  } catch (error) {
    console.error("Unassign students error:", error);
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
  unassignStudents,
  getAssignedStudents,
  sendMessage,
  getDashboardStats,
};
