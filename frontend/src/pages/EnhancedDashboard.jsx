import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  CheckCircle,
  Star,
  ArrowUp,
  ArrowDown,
  Eye,
  MessageCircle,
  Share2,
  Download,
  Filter,
  Search,
  Plus,
  MoreHorizontal,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Avatar from "../components/UI/Avatar";
import {
  BarChartComponent,
  PieChartComponent,
  LineChartComponent,
  ProgressRing,
  StatsCard,
} from "../components/UI/Chart";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../utils/api";

const EnhancedDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
  const dashboardData = {
    stats: {
      totalActivities: 24,
      completedActivities: 18,
      pendingApprovals: 3,
      totalCredits: 156,
      progressPercentage: 75,
      recentActivity: 8,
    },
    activities: [
      {
        id: 1,
        title: "Machine Learning Workshop",
        category: "Workshop",
        status: "completed",
        date: "2024-01-15",
        credits: 25,
        instructor: "Dr. Sarah Johnson",
      },
      {
        id: 2,
        title: "Data Science Project",
        category: "Project",
        status: "pending",
        date: "2024-01-20",
        credits: 40,
        instructor: "Prof. Michael Chen",
      },
      {
        id: 3,
        title: "Python Programming Course",
        category: "Course",
        status: "in-progress",
        date: "2024-01-25",
        credits: 30,
        instructor: "Dr. Emily Davis",
      },
    ],
    chartData: {
      activityTrend: [
        { month: "Jan", activities: 8 },
        { month: "Feb", activities: 12 },
        { month: "Mar", activities: 15 },
        { month: "Apr", activities: 18 },
        { month: "May", activities: 22 },
        { month: "Jun", activities: 24 },
      ],
      categoryDistribution: [
        { name: "Workshops", value: 35, color: "#3b82f6" },
        { name: "Projects", value: 25, color: "#10b981" },
        { name: "Courses", value: 20, color: "#f59e0b" },
        { name: "Seminars", value: 15, color: "#ef4444" },
        { name: "Others", value: 5, color: "#8b5cf6" },
      ],
      performanceData: [
        { week: "Week 1", score: 85 },
        { week: "Week 2", score: 88 },
        { week: "Week 3", score: 92 },
        { week: "Week 4", score: 89 },
        { week: "Week 5", score: 94 },
        { week: "Week 6", score: 96 },
      ],
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name || "Student"}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what's happening with your academic journey today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Total Activities"
            value={dashboardData.stats.totalActivities}
            change="+12%"
            changeType="positive"
            icon={<Activity className="w-6 h-6" />}
            color="blue"
            delay={0.1}
          />
          <StatsCard
            title="Completed"
            value={dashboardData.stats.completedActivities}
            change="+8%"
            changeType="positive"
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="Pending Reviews"
            value={dashboardData.stats.pendingApprovals}
            change="-2%"
            changeType="negative"
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
            delay={0.3}
          />
          <StatsCard
            title="Total Credits"
            value={dashboardData.stats.totalCredits}
            change="+15%"
            changeType="positive"
            icon={<Award className="w-6 h-6" />}
            color="purple"
            delay={0.4}
          />
        </motion.div>

        {/* Progress Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Progress Ring */}
          <Card className="flex flex-col items-center justify-center">
            <ProgressRing
              percentage={dashboardData.stats.progressPercentage}
              size={140}
              label="Overall Progress"
              color="#3b82f6"
            />
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Great Progress!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You're {dashboardData.stats.progressPercentage}% complete with
                your goals
              </p>
            </div>
          </Card>

          {/* Activity Trend Chart */}
          <Card className="lg:col-span-2">
            <BarChartComponent
              data={dashboardData.chartData.activityTrend}
              dataKey="activities"
              nameKey="month"
              title="Activity Trend"
              description="Your activity progress over the last 6 months"
              color="#3b82f6"
              height={300}
            />
          </Card>
        </motion.div>

        {/* Charts Section */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          {/* Category Distribution */}
          <Card>
            <PieChartComponent
              data={dashboardData.chartData.categoryDistribution}
              dataKey="value"
              nameKey="name"
              title="Activity Categories"
              description="Distribution of your activities by category"
              height={300}
            />
          </Card>

          {/* Performance Trend */}
          <Card>
            <LineChartComponent
              data={dashboardData.chartData.performanceData}
              dataKey="score"
              nameKey="week"
              title="Performance Trend"
              description="Your weekly performance scores"
              color="#10b981"
              height={300}
            />
          </Card>
        </motion.div>

        {/* Recent Activities */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Activities
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Your latest academic activities and progress
                </p>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {dashboardData.activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.status === "completed"
                          ? "bg-green-500"
                          : activity.status === "in-progress"
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {activity.category} • {activity.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.credits} credits
                      </p>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mt-8">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 p-4"
                fullWidth
              >
                <Plus className="w-6 h-6" />
                <span className="text-sm font-medium">Add Activity</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 p-4"
                fullWidth
              >
                <Download className="w-6 h-6" />
                <span className="text-sm font-medium">Export Data</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 p-4"
                fullWidth
              >
                <Share2 className="w-6 h-6" />
                <span className="text-sm font-medium">Share Progress</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 p-4"
                fullWidth
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-sm font-medium">View Analytics</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedDashboard;
