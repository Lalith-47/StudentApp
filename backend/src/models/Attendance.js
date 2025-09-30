const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
  },
  classNumber: {
    type: Number,
    required: true,
  },
  topic: {
    type: String,
    trim: true,
    maxlength: [200, "Topic cannot exceed 200 characters"],
  },
  location: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number, // in minutes
    default: 60,
  },
  qrCode: {
    code: String,
    expiresAt: Date,
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  records: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: String,
        enum: ["present", "absent", "late", "excused"],
        required: true,
      },
      markedAt: {
        type: Date,
        default: Date.now,
      },
      markedBy: {
        type: String,
        enum: ["faculty", "qr", "manual"],
        default: "manual",
      },
      notes: String,
      ipAddress: String,
      deviceInfo: String,
    },
  ],
  settings: {
    allowLateMarking: {
      type: Boolean,
      default: true,
    },
    lateThreshold: {
      type: Number,
      default: 15, // minutes
    },
    qrCodeExpiry: {
      type: Number,
      default: 30, // minutes
    },
    requireLocation: {
      type: Boolean,
      default: false,
    },
    locationRadius: {
      type: Number,
      default: 100, // meters
    },
  },
  analytics: {
    totalStudents: {
      type: Number,
      default: 0,
    },
    presentCount: {
      type: Number,
      default: 0,
    },
    absentCount: {
      type: Number,
      default: 0,
    },
    lateCount: {
      type: Number,
      default: 0,
    },
    excusedCount: {
      type: Number,
      default: 0,
    },
    attendanceRate: {
      type: Number,
      default: 0,
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
attendanceSchema.index({ courseId: 1, date: -1 });
attendanceSchema.index({ facultyId: 1, date: -1 });
attendanceSchema.index({ "records.studentId": 1, date: -1 });
attendanceSchema.index({ "qrCode.code": 1 });

// Update timestamp on save
attendanceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  // Calculate analytics
  if (this.records && this.records.length > 0) {
    this.analytics.totalStudents = this.records.length;
    this.analytics.presentCount = this.records.filter(
      (r) => r.status === "present"
    ).length;
    this.analytics.absentCount = this.records.filter(
      (r) => r.status === "absent"
    ).length;
    this.analytics.lateCount = this.records.filter(
      (r) => r.status === "late"
    ).length;
    this.analytics.excusedCount = this.records.filter(
      (r) => r.status === "excused"
    ).length;
    this.analytics.attendanceRate =
      (this.analytics.presentCount / this.analytics.totalStudents) * 100;
  }

  next();
});

// Method to mark attendance
attendanceSchema.methods.markAttendance = function (
  studentId,
  status,
  notes = "",
  markedBy = "manual"
) {
  const existingRecord = this.records.find(
    (record) => record.studentId.toString() === studentId.toString()
  );

  const record = {
    studentId,
    status,
    markedAt: new Date(),
    markedBy,
    notes,
  };

  if (existingRecord) {
    Object.assign(existingRecord, record);
  } else {
    this.records.push(record);
  }

  return record;
};

// Method to generate QR code
attendanceSchema.methods.generateQRCode = function () {
  const qrData = {
    attendanceId: this._id,
    courseId: this.courseId,
    timestamp: Date.now(),
  };

  const qrCode = Buffer.from(JSON.stringify(qrData)).toString("base64");
  this.qrCode = {
    code: qrCode,
    expiresAt: new Date(Date.now() + this.settings.qrCodeExpiry * 60 * 1000),
    isActive: true,
  };

  return qrCode;
};

// Method to scan QR code and mark attendance
attendanceSchema.methods.scanQRCode = function (
  qrCode,
  studentId,
  ipAddress = "",
  deviceInfo = ""
) {
  if (!this.qrCode.isActive || new Date() > this.qrCode.expiresAt) {
    throw new Error("QR code is expired or inactive");
  }

  if (this.qrCode.code !== qrCode) {
    throw new Error("Invalid QR code");
  }

  const isLate =
    new Date() >
    new Date(this.date.getTime() + this.settings.lateThreshold * 60 * 1000);
  const status = isLate ? "late" : "present";

  return this.markAttendance(studentId, status, "QR code scan", "qr");
};

// Static method to get student attendance summary
attendanceSchema.statics.getStudentAttendance = function (studentId, courseId) {
  return this.aggregate([
    {
      $match: {
        courseId: mongoose.Types.ObjectId(courseId),
        "records.studentId": mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $unwind: "$records",
    },
    {
      $match: {
        "records.studentId": mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $group: {
        _id: null,
        totalClasses: { $sum: 1 },
        presentClasses: {
          $sum: { $cond: [{ $eq: ["$records.status", "present"] }, 1, 0] },
        },
        lateClasses: {
          $sum: { $cond: [{ $eq: ["$records.status", "late"] }, 1, 0] },
        },
        absentClasses: {
          $sum: { $cond: [{ $eq: ["$records.status", "absent"] }, 1, 0] },
        },
        excusedClasses: {
          $sum: { $cond: [{ $eq: ["$records.status", "excused"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        totalClasses: 1,
        presentClasses: 1,
        lateClasses: 1,
        absentClasses: 1,
        excusedClasses: 1,
        attendanceRate: {
          $multiply: [{ $divide: ["$presentClasses", "$totalClasses"] }, 100],
        },
      },
    },
  ]);
};

// Static method to get course attendance analytics
attendanceSchema.statics.getCourseAttendanceAnalytics = function (
  courseId,
  startDate,
  endDate
) {
  const matchStage = { courseId: new mongoose.Types.ObjectId(courseId) };
  if (startDate && endDate) {
    matchStage.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalClasses: { $sum: 1 },
        averageAttendanceRate: { $avg: "$analytics.attendanceRate" },
        totalStudents: { $max: "$analytics.totalStudents" },
        presentRecords: { $sum: "$analytics.presentCount" },
        absentRecords: { $sum: "$analytics.absentCount" },
        lateRecords: { $sum: "$analytics.lateCount" },
      },
    },
    {
      $project: {
        totalClasses: 1,
        averageAttendanceRate: { $round: ["$averageAttendanceRate", 2] },
        totalStudents: 1,
        presentRecords: 1,
        absentRecords: 1,
        lateRecords: 1,
        totalRecords: {
          $add: ["$presentRecords", "$absentRecords", "$lateRecords"],
        },
      },
    },
  ]);
};

// Static method to generate attendance report
attendanceSchema.statics.generateAttendanceReport = function (
  courseId,
  startDate,
  endDate
) {
  return this.aggregate([
    {
      $match: {
        courseId: mongoose.Types.ObjectId(courseId),
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "records.studentId",
        foreignField: "_id",
        as: "students",
      },
    },
    {
      $unwind: "$records",
    },
    {
      $lookup: {
        from: "users",
        localField: "records.studentId",
        foreignField: "_id",
        as: "student",
      },
    },
    {
      $unwind: "$student",
    },
    {
      $group: {
        _id: {
          studentId: "$student._id",
          studentName: "$student.name",
          studentEmail: "$student.email",
        },
        attendance: {
          $push: {
            date: "$date",
            status: "$records.status",
            classNumber: "$classNumber",
            topic: "$topic",
          },
        },
        totalClasses: { $sum: 1 },
        presentClasses: {
          $sum: { $cond: [{ $eq: ["$records.status", "present"] }, 1, 0] },
        },
        lateClasses: {
          $sum: { $cond: [{ $eq: ["$records.status", "late"] }, 1, 0] },
        },
        absentClasses: {
          $sum: { $cond: [{ $eq: ["$records.status", "absent"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        studentId: "$_id.studentId",
        studentName: "$_id.studentName",
        studentEmail: "$_id.studentEmail",
        attendance: 1,
        totalClasses: 1,
        presentClasses: 1,
        lateClasses: 1,
        absentClasses: 1,
        attendanceRate: {
          $multiply: [{ $divide: ["$presentClasses", "$totalClasses"] }, 100],
        },
      },
    },
    { $sort: { studentName: 1 } },
  ]);
};

module.exports = mongoose.model("Attendance", attendanceSchema);

