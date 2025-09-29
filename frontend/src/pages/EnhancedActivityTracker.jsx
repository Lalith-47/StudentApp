import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Pending,
  Edit,
  Trash2,
  Eye,
  Download,
  Share2,
  Star,
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Sparkles,
  Rocket,
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

const EnhancedActivityTracker = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Mock data for demonstration
  const activitiesData = {
    stats: {
      total: 24,
      completed: 18,
      pending: 4,
      inProgress: 2,
      totalCredits: 156,
      thisMonth: 8,
    },
    activities: [
      {
        id: 1,
        title: "Machine Learning Workshop",
        description:
          "Comprehensive workshop covering ML algorithms and practical applications",
        category: "Workshop",
        status: "completed",
        startDate: "2024-01-15",
        endDate: "2024-01-17",
        credits: 25,
        instructor: "Dr. Sarah Johnson",
        location: "Tech Institute",
        skills: ["Machine Learning", "Python", "Data Analysis"],
        achievements: [
          "Completed advanced ML algorithms",
          "Built predictive model",
        ],
        tags: ["AI", "Data Science", "Workshop"],
      },
      {
        id: 2,
        title: "Data Science Project",
        description: "End-to-end data science project with real-world dataset",
        category: "Project",
        status: "pending",
        startDate: "2024-01-20",
        endDate: "2024-02-20",
        credits: 40,
        instructor: "Prof. Michael Chen",
        location: "Online",
        skills: ["Data Analysis", "Statistics", "Visualization"],
        achievements: [],
        tags: ["Data Science", "Project", "Research"],
      },
      {
        id: 3,
        title: "Python Programming Course",
        description:
          "Advanced Python programming with focus on data structures",
        category: "Course",
        status: "in-progress",
        startDate: "2024-01-25",
        endDate: "2024-03-25",
        credits: 30,
        instructor: "Dr. Emily Davis",
        location: "University Campus",
        skills: ["Python", "Programming", "Algorithms"],
        achievements: ["Completed 60% of course"],
        tags: ["Programming", "Course", "Computer Science"],
      },
    ],
    chartData: {
      monthlyTrend: [
        { month: "Jan", activities: 8 },
        { month: "Feb", activities: 12 },
        { month: "Mar", activities: 15 },
        { month: "Apr", activities: 18 },
        { month: "May", activities: 22 },
        { month: "Jun", activities: 24 },
      ],
      categoryBreakdown: [
        { name: "Workshops", value: 35, color: "#3b82f6" },
        { name: "Projects", value: 25, color: "#10b981" },
        { name: "Courses", value: 20, color: "#f59e0b" },
        { name: "Seminars", value: 15, color: "#ef4444" },
        { name: "Others", value: 5, color: "#8b5cf6" },
      ],
      performanceTrend: [
        { week: "Week 1", score: 85 },
        { week: "Week 2", score: 88 },
        { week: "Week 3", score: 92 },
        { week: "Week 4", score: 89 },
        { week: "Week 5", score: 94 },
        { week: "Week 6", score: 96 },
      ],
    },
  };

  const statusConfig = {
    completed: {
      color: "text-green-600 bg-green-100 dark:bg-green-900/20",
      icon: <CheckCircle className="w-4 h-4" />,
      label: "Completed",
    },
    pending: {
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
      icon: <Pending className="w-4 h-4" />,
      label: "Pending",
    },
    "in-progress": {
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
      icon: <Clock className="w-4 h-4" />,
      label: "In Progress",
    },
  };

  const categoryConfig = {
    Workshop: { color: "bg-blue-500", icon: <BookOpen className="w-4 h-4" /> },
    Project: { color: "bg-green-500", icon: <Target className="w-4 h-4" /> },
    Course: { color: "bg-purple-500", icon: <Award className="w-4 h-4" /> },
    Seminar: { color: "bg-orange-500", icon: <Users className="w-4 h-4" /> },
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

  const filteredActivities = activitiesData.activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || activity.status === filterStatus;
    const matchesCategory =
      filterCategory === "all" || activity.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Activity Tracker 📊
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track and manage your academic activities with detailed
                analytics
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Activity
            </Button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatsCard
            title="Total Activities"
            value={activitiesData.stats.total}
            change="+12%"
            changeType="positive"
            icon={<Activity className="w-6 h-6" />}
            color="blue"
            delay={0.1}
          />
          <StatsCard
            title="Completed"
            value={activitiesData.stats.completed}
            change="+8%"
            changeType="positive"
            icon={<CheckCircle className="w-6 h-6" />}
            color="green"
            delay={0.2}
          />
          <StatsCard
            title="In Progress"
            value={activitiesData.stats.inProgress}
            change="+2%"
            changeType="positive"
            icon={<Clock className="w-6 h-6" />}
            color="yellow"
            delay={0.3}
          />
          <StatsCard
            title="Total Credits"
            value={activitiesData.stats.totalCredits}
            change="+15%"
            changeType="positive"
            icon={<Award className="w-6 h-6" />}
            color="purple"
            delay={0.4}
          />
        </motion.div>

        {/* Progress and Charts */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
        >
          {/* Progress Ring */}
          <Card className="flex flex-col items-center justify-center">
            <ProgressRing
              percentage={Math.round(
                (activitiesData.stats.completed / activitiesData.stats.total) *
                  100
              )}
              size={140}
              label="Completion Rate"
              color="#10b981"
            />
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Great Progress!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                You've completed {activitiesData.stats.completed} out of{" "}
                {activitiesData.stats.total} activities
              </p>
            </div>
          </Card>

          {/* Monthly Trend */}
          <Card className="lg:col-span-2">
            <BarChartComponent
              data={activitiesData.chartData.monthlyTrend}
              dataKey="activities"
              nameKey="month"
              title="Monthly Activity Trend"
              description="Your activity progress over the last 6 months"
              color="#3b82f6"
              height={300}
            />
          </Card>
        </motion.div>

        {/* Category Distribution and Performance */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <Card>
            <PieChartComponent
              data={activitiesData.chartData.categoryBreakdown}
              dataKey="value"
              nameKey="name"
              title="Activity Categories"
              description="Distribution of your activities by category"
              height={300}
            />
          </Card>

          <Card>
            <LineChartComponent
              data={activitiesData.chartData.performanceTrend}
              dataKey="score"
              nameKey="week"
              title="Performance Trend"
              description="Your weekly performance scores"
              color="#10b981"
              height={300}
            />
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  icon={<Search className="w-4 h-4" />}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[140px]"
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-w-[140px]"
                >
                  <option value="all">All Categories</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Project">Project</option>
                  <option value="Course">Course</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Activities List */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Activities ({filteredActivities.length})
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card
                      hover
                      className="p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                statusConfig[activity.status].color.split(
                                  " "
                                )[0]
                              }`}
                            />
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {activity.title}
                            </h4>
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                statusConfig[activity.status].color
                              }`}
                            >
                              {statusConfig[activity.status].icon}
                              {statusConfig[activity.status].label}
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {activity.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {activity.startDate} - {activity.endDate}
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              {activity.credits} credits
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {activity.instructor}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              {activity.category}
                            </div>
                          </div>

                          {activity.skills.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skills:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {activity.skills.map((skill, skillIndex) => (
                                  <span
                                    key={skillIndex}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EnhancedActivityTracker;
