import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Clock,
  DollarSign,
  Award,
  Target,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  RefreshCw,
  Search,
  Download as DownloadIcon,
  Upload,
  Settings,
  Info,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

const AnalyticsDashboard = ({ activeSubModule }) => {
  // State Management
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState("30d"); // 7d, 30d, 90d, 1y
  const [selectedMetric, setSelectedMetric] = useState("overview");

  // Mock Analytics Data
  const mockAnalytics = {
    overview: {
      totalUsers: 1247,
      activeUsers: 1189,
      totalCourses: 45,
      activeCourses: 42,
      totalRevenue: 125430,
      monthlyRevenue: 15420,
      completionRate: 87.5,
      satisfactionRate: 4.6,
    },
    userGrowth: [
      { month: "Jan", users: 120, newUsers: 85, returning: 35 },
      { month: "Feb", users: 145, newUsers: 98, returning: 47 },
      { month: "Mar", users: 167, newUsers: 112, returning: 55 },
      { month: "Apr", users: 189, newUsers: 125, returning: 64 },
      { month: "May", users: 212, newUsers: 138, returning: 74 },
    ],
    coursePerformance: [
      {
        course: "Advanced Mathematics",
        students: 45,
        completion: 89,
        rating: 4.8,
        revenue: 13455,
      },
      {
        course: "Introduction to Programming",
        students: 78,
        completion: 92,
        rating: 4.6,
        revenue: 15522,
      },
      {
        course: "Digital Marketing Strategy",
        students: 32,
        completion: 85,
        rating: 4.7,
        revenue: 7968,
      },
      {
        course: "Data Science Fundamentals",
        students: 28,
        completion: 88,
        rating: 4.9,
        revenue: 11172,
      },
      {
        course: "Web Development Bootcamp",
        students: 89,
        completion: 91,
        rating: 4.7,
        revenue: 31061,
      },
      {
        course: "Business Analytics",
        students: 56,
        completion: 87,
        rating: 4.5,
        revenue: 15624,
      },
      {
        course: "Machine Learning Basics",
        students: 67,
        completion: 90,
        rating: 4.8,
        revenue: 26733,
      },
    ],
    userActivity: [
      { time: "00:00", users: 12 },
      { time: "04:00", users: 8 },
      { time: "08:00", users: 45 },
      { time: "12:00", users: 89 },
      { time: "16:00", users: 67 },
      { time: "20:00", users: 34 },
    ],
    deviceStats: [
      { device: "Desktop", percentage: 65, users: 810 },
      { device: "Mobile", percentage: 28, users: 349 },
      { device: "Tablet", percentage: 7, users: 88 },
    ],
    topCountries: [
      { country: "India", users: 456, percentage: 36.6 },
      { country: "United States", users: 234, percentage: 18.8 },
      { country: "United Kingdom", users: 123, percentage: 9.9 },
      { country: "Canada", users: 89, percentage: 7.1 },
    ],
  };

  // Render Overview Cards
  const renderOverviewCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Users
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {mockAnalytics.overview.totalUsers.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Courses
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {mockAnalytics.overview.activeCourses}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +3 new this week
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Monthly Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${mockAnalytics.overview.monthlyRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8% from last month
            </p>
          </div>
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Completion Rate
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {mockAnalytics.overview.completionRate}%
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2% improvement
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </Card>
    </div>
  );

  // Render User Growth Chart
  const renderUserGrowthChart = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Growth
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Monthly user registration trends
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Simple Bar Chart Representation */}
      <div className="space-y-4">
        {mockAnalytics.userGrowth.map((data, index) => (
          <div key={index} className="flex items-center">
            <div className="w-16 text-sm text-gray-600 dark:text-gray-400">
              {data.month}
            </div>
            <div className="flex-1 mx-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-6 relative">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(data.users / 250) * 100}%` }}
                  >
                    <span className="text-white text-xs font-medium">
                      {data.users}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
              +{data.newUsers} new
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  // Render Course Performance Table
  const renderCoursePerformance = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Course Performance
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Top performing courses this month
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Completion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {mockAnalytics.coursePerformance.map((course, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {course.course}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {course.students}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {course.completion}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {course.rating}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    ${course.revenue.toLocaleString()}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Render Device Statistics
  const renderDeviceStats = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Device Usage
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Platform access by device type
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockAnalytics.deviceStats.map((device, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-medium text-sm mr-4">
                {device.device.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {device.device}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {device.users} users
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                  style={{ width: `${device.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                {device.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  // Render Top Countries
  const renderTopCountries = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Top Countries
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            User distribution by country
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {mockAnalytics.topCountries.map((country, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300 mr-3">
                {index + 1}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {country.country}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {country.users} users
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${country.percentage}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                {country.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );

  // Render Content Based on Active Sub Module
  const renderContent = () => {
    switch (activeSubModule) {
      case "dashboard-analytics":
        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Analytics Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Comprehensive insights into platform performance
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Overview Cards */}
            {renderOverviewCards()}

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderUserGrowthChart()}
              {renderDeviceStats()}
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {renderCoursePerformance()}
              {renderTopCountries()}
            </div>
          </div>
        );

      case "user-analytics":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Detailed user behavior and engagement metrics
              </p>
            </div>

            {renderOverviewCards()}
            {renderUserGrowthChart()}
            {renderDeviceStats()}
          </div>
        );

      case "course-analytics":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Course Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Course performance and student engagement metrics
              </p>
            </div>

            {renderCoursePerformance()}
            {renderUserGrowthChart()}
          </div>
        );

      case "system-reports":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                System Reports
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Generate and download comprehensive system reports
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    User Report
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Complete user statistics and demographics
                  </p>
                  <Button size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Course Report
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Course performance and completion rates
                  </p>
                  <Button size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Revenue Report
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Financial performance and revenue analytics
                  </p>
                  <Button size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Custom Report Generator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Type
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>User Analytics</option>
                    <option>Course Performance</option>
                    <option>Revenue Analysis</option>
                    <option>System Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Format
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>PDF</option>
                    <option>Excel</option>
                    <option>CSV</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end">
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select an analytics option
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from the sidebar to view analytics
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeSubModule}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnalyticsDashboard;
