import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../utils/api";
import {
  // Navigation & Layout
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Bell,
  Settings,
  Shield,
  LogOut,
  Search,
  RefreshCw,

  // Dashboard & Analytics
  BarChart3,
  TrendingUp,
  Activity,
  Eye,
  Database,
  Server,
  PieChart,

  // User Management
  UserPlus,
  UserCheck,
  UserX,
  Key,
  Edit,
  Trash2,

  // Course Management
  Archive,
  UserCog,
  GraduationCap,

  // System Features
  Send,
  AlertTriangle,
  Globe,
  Palette,

  // Status & Feedback
  Check,
  X as XIcon,
  AlertCircle,
  Info,
  Loader2,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Target,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";
import FacultyAdminManagement from "./FacultyAdminManagement";
import AuditLogs from "./AuditLogs";

const ModernAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Modals and Forms
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showSystemAnnouncement, setShowSystemAnnouncement] = useState(false);
  const [showSystemSettings, setShowSystemSettings] = useState(false);

  // Selected Items
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Filters and Search
  const [filters, setFilters] = useState({
    userRole: "",
    userStatus: "",
    courseStatus: "",
    announcementPriority: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Sidebar items with modern structure
  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      children: [],
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      children: [
        { id: "all-users", label: "All Users", icon: Users },
        { id: "create-user", label: "Create User", icon: UserPlus },
        { id: "faculty-admin", label: "Faculty & Admin", icon: Shield },
        { id: "audit-logs", label: "Audit Logs", icon: Activity },
      ],
    },
    {
      id: "courses",
      label: "Course Management",
      icon: BookOpen,
      children: [
        { id: "all-courses", label: "All Courses", icon: BookOpen },
        {
          id: "course-assignments",
          label: "Faculty Assignments",
          icon: UserCog,
        },
        { id: "course-archive", label: "Archive Management", icon: Archive },
      ],
    },
    {
      id: "announcements",
      label: "System Announcements",
      icon: Bell,
      children: [
        { id: "create-announcement", label: "Create Announcement", icon: Send },
        {
          id: "manage-announcements",
          label: "Manage Announcements",
          icon: Bell,
        },
      ],
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      children: [
        { id: "system-analytics", label: "System Analytics", icon: TrendingUp },
        { id: "user-analytics", label: "User Analytics", icon: Users },
        { id: "course-analytics", label: "Course Analytics", icon: BookOpen },
      ],
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Settings,
      children: [
        { id: "general-settings", label: "General Settings", icon: Globe },
        { id: "security-settings", label: "Security Settings", icon: Shield },
        { id: "branding-settings", label: "Branding", icon: Palette },
      ],
    },
  ];

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Load users when users tab is active
  useEffect(() => {
    if (activeTab === "all-users") {
      loadUsers();
    }
  }, [activeTab, filters, searchQuery]);

  // Load courses when courses tab is active
  useEffect(() => {
    if (activeTab === "all-courses") {
      loadCourses();
    }
  }, [activeTab, filters, searchQuery]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Set dummy data for development
      setDashboardData({
        overview: {
          totalUsers: 1247,
          activeUsers: 1189,
          totalCourses: 45,
          activeCourses: 42,
          totalAssignments: 234,
          pendingGrading: 18,
          databaseStatus: "connected",
          systemUptime: 86400,
        },
        userStatistics: {
          students: 1156,
          faculty: 78,
          admins: 13,
        },
        courseStatistics: {
          active: 42,
          archived: 3,
          suspended: 0,
        },
        recentActivities: [
          {
            description: "New student registration: John Doe",
            timestamp: new Date().toISOString(),
          },
          {
            description: "Course created: Advanced Mathematics",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            description: "Faculty assignment updated",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 50,
        search: searchQuery,
        role: filters.userRole,
        status: filters.userStatus,
      };
      const response = await apiService.adminEnhanced.getUsers(params);
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      // Set dummy data for development
      setUsers([
        {
          id: 1,
          name: "Dr. Sarah Johnson",
          email: "sarah.johnson@yukti.com",
          role: "faculty",
          isActive: true,
          lastLoginFormatted: "2 hours ago",
          createdAtFormatted: "Jan 15, 2024",
        },
        {
          id: 2,
          name: "John Doe",
          email: "john.doe@student.yukti.com",
          role: "student",
          isActive: true,
          lastLoginFormatted: "1 day ago",
          createdAtFormatted: "Feb 20, 2024",
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@yukti.com",
          role: "admin",
          isActive: true,
          lastLoginFormatted: "30 minutes ago",
          createdAtFormatted: "Dec 1, 2023",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 50,
        search: searchQuery,
        status: filters.courseStatus,
      };
      const response = await apiService.adminEnhanced.getCourses(params);
      setCourses(response.data.data.courses || []);
    } catch (error) {
      console.error("Failed to load courses:", error);
      // Set dummy data for development
      setCourses([
        {
          id: 1,
          title: "Advanced Mathematics",
          code: "MATH-401",
          department: "Mathematics",
          facultyName: "Dr. Sarah Johnson",
          status: "active",
          enrollmentCount: 45,
          credits: 4,
        },
        {
          id: 2,
          title: "Computer Science Fundamentals",
          code: "CS-101",
          department: "Computer Science",
          facultyName: "Dr. Michael Chen",
          status: "active",
          enrollmentCount: 78,
          credits: 3,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const renderDashboard = () => {
    if (!dashboardData) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      );
    }

    const { overview, userStatistics, courseStatistics, recentActivities } =
      dashboardData;

    return (
      <div className="space-y-2 lg:space-y-3">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-3 md:p-4 text-white shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                Welcome back, {user?.name || "Admin"}!
              </h1>
              <p className="text-blue-100 text-base md:text-lg leading-relaxed">
                Here's what's happening with your platform today.
              </p>
            </div>
            <div className="hidden md:block flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full"
          >
            <Card className="p-2 md:p-3 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    Total Users
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {overview.totalUsers}
                  </p>
                  <p className="text-xs md:text-sm text-green-600 dark:text-green-400 flex items-center">
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {overview.activeUsers} active
                    </span>
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <Card className="p-2 md:p-3 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                    Total Courses
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {overview.totalCourses}
                  </p>
                  <p className="text-xs md:text-sm text-green-600 dark:text-green-400 flex items-center">
                    <Check className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {overview.activeCourses} active
                    </span>
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <Card className="p-2 md:p-3 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-orange-600 dark:text-orange-400 mb-1">
                    Assignments
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {overview.totalAssignments}
                  </p>
                  <p className="text-xs md:text-sm text-orange-600 dark:text-orange-400 flex items-center">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {overview.pendingGrading} pending
                    </span>
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <Activity className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
          >
            <Card className="p-2 md:p-3 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">
                    System Health
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {overview.databaseStatus === "connected"
                      ? "100%"
                      : "Offline"}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Server className="w-3 h-3 md:w-4 md:h-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      Uptime: {Math.floor(overview.systemUptime / 3600)}h
                    </span>
                  </p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 ml-3">
                  <Server className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* User Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="h-full"
          >
            <Card className="p-4 md:p-6 h-full">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  User Distribution
                </h3>
                <PieChart className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </div>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      Students
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                    {userStatistics?.students || 1156}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      Faculty
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                    {userStatistics?.faculty || 78}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 flex-shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      Admins
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white ml-2">
                    {userStatistics?.admins || 13}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="h-full"
          >
            <Card className="p-4 md:p-6 h-full">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activities
                </h3>
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </div>
              <div className="space-y-3 md:space-y-4 max-h-80 overflow-y-auto">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white leading-relaxed">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    return (
      <div className="space-y-6">
        {/* Users Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              User Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all system users
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={() => setShowCreateUser(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={filters.userRole}
              onChange={(e) =>
                setFilters({ ...filters, userRole: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
              <option value="mentor">Mentor</option>
              <option value="counselor">Counselor</option>
            </select>
            <select
              value={filters.userStatus}
              onChange={(e) =>
                setFilters({ ...filters, userStatus: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Button
              variant="outline"
              onClick={loadUsers}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                          <span className="text-white font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : user.role === "faculty"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : user.role === "student"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.lastLoginFormatted || "Never"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {user.createdAtFormatted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            /* Handle password reset */
                          }}
                          className="hover:bg-green-50 hover:border-green-300"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            /* Handle status toggle */
                          }}
                          className={`${
                            user.isActive
                              ? "hover:bg-red-50 hover:border-red-300"
                              : "hover:bg-green-50 hover:border-green-300"
                          }`}
                        >
                          {user.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "all-users":
        return renderUsers();
      case "faculty-admin":
        return <FacultyAdminManagement />;
      case "audit-logs":
        return <AuditLogs />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {sidebarItems.find((item) => item.id === activeTab)?.label ||
                  "Dashboard"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select a section from the sidebar to get started.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 -m-4 sm:-m-6 lg:-m-8">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
              Yukti Admin
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="mt-4 md:mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1 md:space-y-2">
            {sidebarItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 md:px-4 py-2.5 md:py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-3 md:p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-3 mb-3 md:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-xs md:text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="text-xs md:text-sm">Logout</span>
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Page Content */}
        <main className="p-2 sm:p-3 lg:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : (
                renderContent()
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ModernAdminDashboard;
