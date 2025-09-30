import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../utils/api";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import {
  // Navigation & Layout
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Users,
  BookOpen,
  Bell,
  Settings,
  Shield,

  // Dashboard & Analytics
  BarChart3,
  TrendingUp,
  Activity,
  Eye,
  Database,
  Server,

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

  // Actions & Controls
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Save,
  MoreVertical,

  // Status & Feedback
  Check,
  X as XIcon,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

const EnhancedAdminPortal = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

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

  // Active Tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sidebar items
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
        { id: "user-roles", label: "User Roles", icon: Shield },
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

  // Load announcements when announcements tab is active
  useEffect(() => {
    if (activeTab === "manage-announcements") {
      loadAnnouncements();
    }
  }, [activeTab, filters, searchQuery]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminEnhanced.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
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
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Failed to load users:", error);
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
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error("Failed to load courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 50,
        priority: filters.announcementPriority,
      };
      const response = await apiService.adminEnhanced.getSystemAnnouncements(
        params
      );
      setAnnouncements(response.data.data.announcements);
    } catch (error) {
      console.error("Failed to load announcements:", error);
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
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overview.totalUsers}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {overview.activeUsers} active
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overview.totalCourses}
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  {overview.activeCourses} active
                </p>
              </div>
              <BookOpen className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Assignments
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overview.totalAssignments}
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  {overview.pendingGrading} pending
                </p>
              </div>
              <Activity className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  System Health
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {overview.databaseStatus === "connected" ? "100%" : "Offline"}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime: {Math.floor(overview.systemUptime / 3600)}h
                </p>
              </div>
              <Server className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activities
          </h3>
          <div className="space-y-3">
            {recentActivities.slice(0, 10).map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
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
              className="flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create User</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
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
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
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
                        className={`px-2 py-1 text-xs rounded-full ${
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
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            /* Handle password reset */
                          }}
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            /* Handle status toggle */
                          }}
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

  const renderCourses = () => {
    return (
      <div className="space-y-6">
        {/* Courses Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Course Management
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage all system courses
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              value={filters.courseStatus}
              onChange={(e) =>
                setFilters({ ...filters, courseStatus: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="suspended">Suspended</option>
            </select>
            <Button
              variant="outline"
              onClick={loadCourses}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.code} • {course.department}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Faculty: {course.facultyName}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    course.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : course.status === "archived"
                      ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {course.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {course.enrollmentCount} students
                </span>
                <span>{course.credits} credits</span>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "all-users":
        return renderUsers();
      case "all-courses":
        return renderCourses();
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Admin Portal
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </div>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
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
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white ml-2 lg:ml-0">
                {sidebarItems.find((item) => item.id === activeTab)?.label ||
                  "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input placeholder="Search..." className="w-64" />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            renderContent()
          )}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default EnhancedAdminPortal;

