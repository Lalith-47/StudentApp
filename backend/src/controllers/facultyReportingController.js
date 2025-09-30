const FacultyApproval = require("../models/FacultyApproval");
const Activity = require("../models/Activity");
const User = require("../models/User");
const Analytics = require("../models/Analytics");
const mongoose = require("mongoose");
const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

// Generate department-level reports
const generateDepartmentReport = async (req, res) => {
  try {
    const { department, startDate, endDate, format = 'json' } = req.query;
    const facultyId = req.user.id;

    // Build filter
    const filter = { facultyId };
    if (department) filter.department = department;
    if (startDate && endDate) {
      filter['reviewDetails.submittedAt'] = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get department statistics
    const departmentStats = await FacultyApproval.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            department: "$department",
            category: "$category",
            status: "$status"
          },
          count: { $sum: 1 },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
          avgScore: { $avg: "$scoring.overallScore" }
        }
      },
      {
        $group: {
          _id: "$_id.department",
          categories: {
            $push: {
              category: "$_id.category",
              status: "$_id.status",
              count: "$count",
              avgReviewTime: "$avgReviewTime",
              avgScore: "$avgScore"
            }
          },
          totalApprovals: { $sum: "$count" }
        }
      }
    ]);

    // Get faculty performance metrics
    const performanceMetrics = await FacultyApproval.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalApprovals: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
          },
          pendingCount: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" },
          avgScore: { $avg: "$scoring.overallScore" },
          approvalRate: {
            $avg: {
              $cond: [{ $eq: ["$status", "approved"] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Get student participation data
    const studentParticipation = await FacultyApproval.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$studentId",
          totalActivities: { $sum: 1 },
          approvedActivities: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          },
          avgScore: { $avg: "$scoring.overallScore" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      { $unwind: "$student" },
      {
        $project: {
          studentName: "$student.name",
          studentEmail: "$student.email",
          totalActivities: 1,
          approvedActivities: 1,
          avgScore: 1,
          approvalRate: {
            $divide: ["$approvedActivities", "$totalActivities"]
          }
        }
      },
      { $sort: { totalActivities: -1 } }
    ]);

    const reportData = {
      department: department || "All Departments",
      period: {
        startDate: startDate || "All Time",
        endDate: endDate || "All Time"
      },
      generatedAt: new Date(),
      generatedBy: req.user.name,
      departmentStats,
      performanceMetrics: performanceMetrics[0] || {},
      studentParticipation: studentParticipation.slice(0, 20), // Top 20 students
      summary: {
        totalApprovals: performanceMetrics[0]?.totalApprovals || 0,
        approvalRate: ((performanceMetrics[0]?.approvalRate || 0) * 100).toFixed(2) + "%",
        avgReviewTime: Math.round(performanceMetrics[0]?.avgReviewTime || 0) + " minutes",
        avgScore: (performanceMetrics[0]?.avgScore || 0).toFixed(2)
      }
    };

    if (format === 'pdf') {
      return generatePDFReport(res, reportData);
    } else if (format === 'excel') {
      return generateExcelReport(res, reportData);
    }

    res.json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error("Generate department report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating department report"
    });
  }
};

// Generate NAAC compliance report
const generateNAACReport = async (req, res) => {
  try {
    const { academicYear = new Date().getFullYear() } = req.query;
    const facultyId = req.user.id;

    // Get NAAC-specific metrics
    const naacMetrics = await FacultyApproval.aggregate([
      { $match: { facultyId } },
      {
        $group: {
          _id: {
            category: "$category",
            academicYear: {
              $year: "$reviewDetails.submittedAt"
            }
          },
          count: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          },
          avgScore: { $avg: "$scoring.overallScore" }
        }
      },
      { $match: { "_id.academicYear": parseInt(academicYear) } }
    ]);

    // Get student engagement metrics
    const engagementMetrics = await FacultyApproval.aggregate([
      { $match: { facultyId } },
      {
        $group: {
          _id: "$studentId",
          totalActivities: { $sum: 1 },
          approvedActivities: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          avgActivitiesPerStudent: { $avg: "$totalActivities" },
          avgApprovedActivities: { $avg: "$approvedActivities" }
        }
      }
    ]);

    // Get faculty workload distribution
    const workloadDistribution = await FacultyApproval.aggregate([
      { $match: { facultyId } },
      {
        $group: {
          _id: {
            month: { $month: "$reviewDetails.submittedAt" },
            year: { $year: "$reviewDetails.submittedAt" }
          },
          approvalsProcessed: { $sum: 1 },
          avgReviewTime: { $avg: "$reviewDetails.reviewDuration" }
        }
      },
      { $match: { "_id.year": parseInt(academicYear) } },
      { $sort: { "_id.month": 1 } }
    ]);

    const naacReport = {
      academicYear,
      generatedAt: new Date(),
      generatedBy: req.user.name,
      naacMetrics,
      engagementMetrics: engagementMetrics[0] || {},
      workloadDistribution,
      complianceScore: calculateNAACScore(naacMetrics, engagementMetrics[0]),
      recommendations: generateNAACRecommendations(naacMetrics, engagementMetrics[0])
    };

    res.json({
      success: true,
      data: naacReport
    });
  } catch (error) {
    console.error("Generate NAAC report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating NAAC report"
    });
  }
};

// Generate AICTE compliance report
const generateAICTEReport = async (req, res) => {
  try {
    const { academicYear = new Date().getFullYear() } = req.query;
    const facultyId = req.user.id;

    // Get AICTE-specific metrics
    const aicteMetrics = await FacultyApproval.aggregate([
      { $match: { facultyId } },
      {
        $group: {
          _id: {
            category: "$category",
            academicYear: {
              $year: "$reviewDetails.submittedAt"
            }
          },
          count: { $sum: 1 },
          avgScore: { $avg: "$scoring.overallScore" }
        }
      },
      { $match: { "_id.academicYear": parseInt(academicYear) } }
    ]);

    // Get industry-relevant activities
    const industryActivities = await FacultyApproval.aggregate([
      { 
        $match: { 
          facultyId,
          category: { $in: ["internship", "certification", "workshop", "conference"] }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          },
          avgScore: { $avg: "$scoring.overallScore" }
        }
      }
    ]);

    const aicteReport = {
      academicYear,
      generatedAt: new Date(),
      generatedBy: req.user.name,
      aicteMetrics,
      industryActivities,
      complianceScore: calculateAICTEScore(aicteMetrics, industryActivities),
      recommendations: generateAICTERecommendations(aicteMetrics, industryActivities)
    };

    res.json({
      success: true,
      data: aicteReport
    });
  } catch (error) {
    console.error("Generate AICTE report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating AICTE report"
    });
  }
};

// Generate PDF report
const generatePDFReport = (res, reportData) => {
  const doc = new PDFDocument();
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="faculty-report-${Date.now()}.pdf"`);
  
  doc.pipe(res);
  
  // Title
  doc.fontSize(20).text('Faculty Report', 50, 50);
  doc.fontSize(12).text(`Department: ${reportData.department}`, 50, 80);
  doc.text(`Generated: ${reportData.generatedAt.toLocaleDateString()}`, 50, 100);
  doc.text(`Generated By: ${reportData.generatedBy}`, 50, 120);
  
  // Summary
  doc.fontSize(16).text('Summary', 50, 160);
  doc.fontSize(12)
     .text(`Total Approvals: ${reportData.summary.totalApprovals}`, 50, 190)
     .text(`Approval Rate: ${reportData.summary.approvalRate}`, 50, 210)
     .text(`Average Review Time: ${reportData.summary.avgReviewTime}`, 50, 230)
     .text(`Average Score: ${reportData.summary.avgScore}`, 50, 250);
  
  // Student Participation
  doc.fontSize(16).text('Top Student Participation', 50, 290);
  let yPosition = 320;
  reportData.studentParticipation.slice(0, 10).forEach((student, index) => {
    doc.fontSize(10)
       .text(`${index + 1}. ${student.studentName} - ${student.totalActivities} activities`, 50, yPosition);
    yPosition += 15;
  });
  
  doc.end();
};

// Generate Excel report
const generateExcelReport = async (res, reportData) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Faculty Report');
  
  // Headers
  worksheet.columns = [
    { header: 'Metric', key: 'metric', width: 30 },
    { header: 'Value', key: 'value', width: 20 }
  ];
  
  // Add summary data
  worksheet.addRow({ metric: 'Total Approvals', value: reportData.summary.totalApprovals });
  worksheet.addRow({ metric: 'Approval Rate', value: reportData.summary.approvalRate });
  worksheet.addRow({ metric: 'Average Review Time', value: reportData.summary.avgReviewTime });
  worksheet.addRow({ metric: 'Average Score', value: reportData.summary.avgScore });
  
  // Add student participation
  worksheet.addRow({});
  worksheet.addRow({ metric: 'STUDENT PARTICIPATION', value: '' });
  reportData.studentParticipation.forEach((student, index) => {
    worksheet.addRow({ 
      metric: `${index + 1}. ${student.studentName}`, 
      value: `${student.totalActivities} activities` 
    });
  });
  
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="faculty-report-${Date.now()}.xlsx"`);
  
  await workbook.xlsx.write(res);
  res.end();
};

// Helper functions
const calculateNAACScore = (metrics, engagement) => {
  let score = 0;
  const totalMetrics = metrics.length;
  
  if (totalMetrics > 0) {
    const avgApprovalRate = metrics.reduce((sum, m) => sum + (m.approvedCount / m.count), 0) / totalMetrics;
    const avgScore = metrics.reduce((sum, m) => sum + (m.avgScore || 0), 0) / totalMetrics;
    
    score = (avgApprovalRate * 0.6 + (avgScore / 5) * 0.4) * 100;
  }
  
  return Math.round(score);
};

const calculateAICTEScore = (metrics, industryActivities) => {
  let score = 0;
  const industryCount = industryActivities.reduce((sum, a) => sum + a.count, 0);
  const totalCount = metrics.reduce((sum, m) => sum + m.count, 0);
  
  if (totalCount > 0) {
    const industryRatio = industryCount / totalCount;
    const avgScore = metrics.reduce((sum, m) => sum + (m.avgScore || 0), 0) / metrics.length;
    
    score = (industryRatio * 0.7 + (avgScore / 5) * 0.3) * 100;
  }
  
  return Math.round(score);
};

const generateNAACRecommendations = (metrics, engagement) => {
  const recommendations = [];
  
  if (engagement && engagement.avgActivitiesPerStudent < 3) {
    recommendations.push("Encourage more student participation in activities");
  }
  
  const avgApprovalRate = metrics.reduce((sum, m) => sum + (m.approvedCount / m.count), 0) / metrics.length;
  if (avgApprovalRate < 0.7) {
    recommendations.push("Review approval criteria to improve approval rates");
  }
  
  return recommendations;
};

const generateAICTERecommendations = (metrics, industryActivities) => {
  const recommendations = [];
  
  const industryCount = industryActivities.reduce((sum, a) => sum + a.count, 0);
  if (industryCount < 10) {
    recommendations.push("Increase industry-relevant activities and certifications");
  }
  
  return recommendations;
};

module.exports = {
  generateDepartmentReport,
  generateNAACReport,
  generateAICTEReport,
};

