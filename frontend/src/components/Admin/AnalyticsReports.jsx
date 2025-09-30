import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Activity,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  PieChart,
  LineChart,
  Download as DownloadIcon,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";
import apiService from "../../utils/api";

const AnalyticsReports = () => {
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedMetrics, setSelectedMetrics] = useState([
    "users",
    "courses",
    "activity",
    "performance",
  ]);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        metrics: selectedMetrics.join(","),
      };
      
      const response = await apiService.analytics.getDashboard(params);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      // Use mock data if API fails
      setAnalyticsData(getMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const getMockAnalyticsData = () => ({
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalCourses: 45,
      activeCourses: 38,
      totalAssignments: 156,
      completedAssignments: 134,
      systemUptime: 99.8,
    },
    userActivity: {
      dailyActiveUsers: [
        { date: "2024-01-01", users: 245 },
        { date: "2024-01-02", users: 289 },
        { date: "2024-01-03", users: 312 },
        { date: "2024-01-04", users: 298 },
        { date: "2024-01-05", users: 334 },
        { date: "2024-01-06", users: 267 },
        { date: "2024-01-07", users: 189 },
      ],
      userGrowth: [
        { month: "Jan", newUsers: 156 },
        { month: "Feb", newUsers: 189 },
        { month: "Mar", newUsers: 234 },
        { month: "Apr", newUsers: 267 },
        { month: "May", newUsers: 298 },
        { month: "Jun", newUsers: 334 },
      ],
    },
    courseAnalytics: {
      enrollmentStats: [
        { course: "Introduction to Programming", enrollments: 89 },
        { course: "Data Structures", enrollments: 67 },
        { course: "Web Development", enrollments: 123 },
        { course: "Database Systems", enrollments: 78 },
        { course: "Software Engineering", enrollments: 56 },
      ],
      completionRates: [
        { course: "Introduction to Programming", completion: 85.2 },
        { course: "Data Structures", completion: 72.1 },
        { course: "Web Development", completion: 68.9 },
        { course: "Database Systems", completion: 76.4 },
        { course: "Software Engineering", completion: 71.8 },
      ],
    },
    systemUsage: {
      pageViews: [
        { page: "Dashboard", views: 2847 },
        { page: "Courses", views: 1923 },
        { page: "Assignments", views: 1567 },
        { page: "Profile", views: 1245 },
        { page: "Settings", views: 892 },
      ],
      deviceStats: {
        desktop: 68.5,
        mobile: 24.3,
        tablet: 7.2,
      },
      browserStats: {
        chrome: 45.2,
        firefox: 23.1,
        safari: 18.7,
        edge: 13.0,
      },
    },
    performance: {
      averageLoadTime: 1.2,
      serverResponseTime: 0.3,
      errorRate: 0.1,
      uptime: 99.8,
    },
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Export functions
  const exportToCSV = () => {
    if (!analyticsData) return;
    
    const csvData = generateCSVData(analyticsData);
    downloadCSV(csvData, `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportToPDF = () => {
    // This would typically use a PDF generation library
    console.log("PDF export functionality would be implemented here");
    alert("PDF export functionality would be implemented with a library like jsPDF");
  };

  const generateCSVData = (data) => {
    let csv = "Metric,Value\n";
    
    // Overview data
    Object.entries(data.overview).forEach(([key, value]) => {
      csv += `${key},${value}\n`;
    });
    
    return csv;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Analytics Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load analytics data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics & Reports
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into system usage and performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="flex items-center"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange({ ...dateRange, endDate: e.target.value })
              }
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={fetchAnalytics}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +12.5% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.activeUsers.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  +8.3% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.totalCourses}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  +3 new this month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  System Uptime
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.overview.systemUptime}%
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Excellent performance
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daily Active Users
              </h3>
              <LineChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.userActivity.dailyActiveUsers.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="bg-blue-500 rounded-t-sm w-full transition-all duration-300 hover:bg-blue-600"
                    style={{
                      height: `${(day.users / 400) * 200}px`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {day.users}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Course Enrollment Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Enrollments
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {analyticsData.courseAnalytics.enrollmentStats.map((course, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {course.course}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(course.enrollments / 150) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 text-sm font-medium text-gray-900 dark:text-white">
                    {course.enrollments}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Device Usage
              </h3>
              <PieChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {Object.entries(analyticsData.systemUsage.deviceStats).map(([device, percentage]) => (
                <div key={device} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {device}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          device === "desktop" ? "bg-blue-500" :
                          device === "mobile" ? "bg-green-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Performance
              </h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Load Time
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.performance.averageLoadTime}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Server Response
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {analyticsData.performance.serverResponseTime}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Error Rate
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {analyticsData.performance.errorRate}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  {analyticsData.performance.uptime}%
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Page Views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Page Views
              </h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {analyticsData.systemUsage.pageViews.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {page.page}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {page.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export Reports
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button
            onClick={exportToCSV}
            variant="outline"
            className="flex items-center justify-center"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            CSV Report
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            className="flex items-center justify-center"
          >
            <FileImage className="w-4 h-4 mr-2" />
            PDF Report
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Excel Report
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center"
          >
            <DownloadIcon className="w-4 h-4 mr-2" />
            Raw Data
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsReports;
