import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../utils/api";

// Icons
import {
  // Navigation
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Bell,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  Search,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,

  // Dashboard
  UserPlus,
  GraduationCap,
  TrendingUp,
  Activity,
  Eye,
  Database,
  Server,
  PieChart,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Target,
  FileText,
  Download,
  Upload,
  Edit,
  Trash2,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

// Components
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

// Admin Components
import UserManagement from "./UserManagement";
import CourseManagement from "./CourseManagement";
import AnnouncementManagement from "./AnnouncementManagement";
import AnalyticsDashboard from "./AnalyticsDashboard";
import SystemSettings from "./SystemSettings";

const ModernAdminDashboard = () => {
  const { user, logout } = useAuth();

  // State Management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState("dashboard");
  const [activeSubModule, setActiveSubModule] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 156,
    activeUsers: 142,
    totalCourses: 12,
    activeCourses: 10,
    totalAnnouncements: 15,
    pendingReports: 3,
    systemHealth: "healthy",
    recentActivity: [],
  });

  // Navigation Structure
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/admin/dashboard",
      children: [],
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      path: "/admin/users",
      children: [
        { id: "all-users", label: "All Users", icon: Users },
        { id: "create-user", label: "Create User", icon: UserPlus },
        { id: "user-roles", label: "User Roles", icon: Shield },
        { id: "user-activity", label: "User Activity", icon: Activity },
      ],
    },
    {
      id: "courses",
      label: "Course Management",
      icon: BookOpen,
      path: "/admin/courses",
      children: [
        { id: "all-courses", label: "All Courses", icon: BookOpen },
        { id: "create-course", label: "Create Course", icon: Plus },
        { id: "course-categories", label: "Categories", icon: FileText },
        { id: "course-analytics", label: "Course Analytics", icon: BarChart3 },
      ],
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: Bell,
      path: "/admin/announcements",
      children: [
        { id: "all-announcements", label: "All Announcements", icon: Bell },
        { id: "create-announcement", label: "Create Announcement", icon: Plus },
        { id: "scheduled", label: "Scheduled", icon: Calendar },
        { id: "templates", label: "Templates", icon: FileText },
      ],
    },
    {
      id: "analytics",
      label: "Analytics & Reports",
      icon: BarChart3,
      path: "/admin/analytics",
      children: [
        { id: "dashboard-analytics", label: "Dashboard", icon: BarChart3 },
        { id: "user-analytics", label: "User Analytics", icon: Users },
        { id: "course-analytics", label: "Course Analytics", icon: BookOpen },
        { id: "system-reports", label: "System Reports", icon: FileText },
        { id: "export-reports", label: "Export Reports", icon: Download },
      ],
    },
    {
      id: "settings",
      label: "System Settings",
      icon: Settings,
      path: "/admin/settings",
      children: [
        { id: "general-settings", label: "General", icon: Settings },
        { id: "theme-settings", label: "Theme", icon: Sun },
        { id: "notification-settings", label: "Notifications", icon: Bell },
        { id: "security-settings", label: "Security", icon: Shield },
        { id: "integration-settings", label: "Integrations", icon: Database },
      ],
    },
  ];

  // Dark Mode Toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem("admin-theme");
    if (savedTheme) {
      setDarkMode(savedTheme === "dark");
    } else {
      setDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin-theme", "light");
    }
  }, [darkMode]);

  // Load Dashboard Data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await apiService.adminEnhanced.getDashboard();
      // Ensure we have the expected data structure
      if (response?.data?.data) {
        setDashboardData((prev) => ({
          ...prev,
          ...response.data.data,
          totalUsers: response.data.data.totalUsers || prev.totalUsers,
          activeUsers: response.data.data.activeUsers || prev.activeUsers,
          totalCourses: response.data.data.totalCourses || prev.totalCourses,
          activeCourses: response.data.data.activeCourses || prev.activeCourses,
          totalAnnouncements:
            response.data.data.totalAnnouncements || prev.totalAnnouncements,
          pendingReports:
            response.data.data.pendingReports || prev.pendingReports,
        }));
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      // Keep dummy data for development
    } finally {
      setLoading(false);
    }
  };

  // Handle Navigation
  const handleNavigation = (moduleId, subModuleId = "") => {
    setActiveModule(moduleId);
    setActiveSubModule(subModuleId);
    setSidebarOpen(false); // Close sidebar on mobile after navigation
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Render Dashboard Homepage
  const renderDashboardHomepage = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name || "Admin"}! 👋
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your platform today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {(dashboardData.totalUsers || 0).toLocaleString()}
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
                {dashboardData.activeCourses}
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
                Announcements
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {dashboardData.totalAnnouncements}
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 flex items-center mt-1">
                <Bell className="w-4 h-4 mr-1" />2 scheduled
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                System Health
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                99.9%
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                <CheckCircle className="w-4 h-4 mr-1" />
                All systems operational
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Server className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              {
                action: "New user registered",
                user: "John Doe",
                time: "2 minutes ago",
              },
              {
                action: "Course created",
                user: "Dr. Smith",
                time: "1 hour ago",
              },
              {
                action: "Announcement published",
                user: "Admin",
                time: "3 hours ago",
              },
              {
                action: "System backup completed",
                user: "System",
                time: "6 hours ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleNavigation("users", "create-user")}
              className="flex items-center justify-center p-4 h-auto"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add User
            </Button>
            <Button
              onClick={() => handleNavigation("courses", "create-course")}
              variant="outline"
              className="flex items-center justify-center p-4 h-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Course
            </Button>
            <Button
              onClick={() =>
                handleNavigation("announcements", "create-announcement")
              }
              variant="outline"
              className="flex items-center justify-center p-4 h-auto"
            >
              <Bell className="w-5 h-5 mr-2" />
              New Announcement
            </Button>
            <Button
              onClick={() => handleNavigation("analytics", "system-reports")}
              variant="outline"
              className="flex items-center justify-center p-4 h-auto"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Reports
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );

  // Render Content Based on Active Module
  const renderContent = () => {
    switch (activeModule) {
      case "dashboard":
        return renderDashboardHomepage();
      case "users":
        return <UserManagement activeSubModule={activeSubModule} />;
      case "courses":
        return <CourseManagement activeSubModule={activeSubModule} />;
      case "announcements":
        return <AnnouncementManagement activeSubModule={activeSubModule} />;
      case "analytics":
        return <AnalyticsDashboard activeSubModule={activeSubModule} />;
      case "settings":
        return <SystemSettings activeSubModule={activeSubModule} />;
      default:
        return renderDashboardHomepage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 shadow-xl ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Yukti Admin
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeModule === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </div>
                {item.children.length > 0 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Sub-navigation */}
              {item.children.length > 0 && activeModule === item.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8 mt-2 space-y-1"
                >
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleNavigation(item.id, child.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        activeSubModule === child.id
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                          : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      <child.icon className="w-4 h-4 mr-3" />
                      {child.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full hover:bg-red-50 hover:border-red-300 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        {/* Top Navigation Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              {/* Refresh */}
              <button
                onClick={loadDashboardData}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[
                        {
                          title: "New user registered",
                          message: "John Doe joined the platform",
                          time: "2 min ago",
                        },
                        {
                          title: "Course completed",
                          message: "Advanced Mathematics by Dr. Smith",
                          time: "1 hour ago",
                        },
                        {
                          title: "System maintenance",
                          message: "Scheduled maintenance tonight at 2 AM",
                          time: "3 hours ago",
                        },
                      ].map((notification, index) => (
                        <div
                          key={index}
                          className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        Preferences
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
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

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ModernAdminDashboard;
