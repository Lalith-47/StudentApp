import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../utils/api";
import {
  Shield,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  Eye,
  UserCheck,
  UserX,
  Globe,
  Smartphone,
  Laptop,
  Award,
  Target,
  Zap,
  Database,
  Settings,
  Bell,
  Mail,
  MessageSquare,
  BookOpen,
  GraduationCap,
  Briefcase,
  Star,
  Heart,
  ThumbsUp,
  Download,
  RefreshCw,
  Filter,
  Search,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [error, setError] = useState(null);

  console.log("AdminDashboard rendered, user:", user);
  console.log("AdminDashboard loading state:", loading);

  // Check if user is admin
  if (user?.role !== "admin") {
    console.log("User is not admin, showing access denied");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log("AdminDashboard useEffect triggered");
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const response = await apiService.getAdminDashboard();
      console.log("Dashboard data response:", response.data);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 503) {
        setError(
          "Database not connected. Please ensure MongoDB is running and properly configured."
        );
      } else {
        setError("Failed to load dashboard data");
      }
    }
  };

  const fetchUsers = async (page = 1, search = "", role = "", status = "") => {
    try {
      console.log("Fetching users...");
      const params = {
        page,
        limit: 10,
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status }),
      };

      const response = await apiService.getAdminUsers(params);
      console.log("Users data response:", response.data);
      setUsers(response.data.data.users);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 503) {
        setError(
          "Database not connected. Please ensure MongoDB is running and properly configured."
        );
      } else {
        setError("Failed to load users data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, searchTerm, roleFilter, statusFilter);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchUsers(newPage, searchTerm, roleFilter, statusFilter);
  };

  const handleUserStatusUpdate = async (userId, isActive) => {
    try {
      await apiService.updateUserStatus(userId, { isActive });
      // Refresh users list
      fetchUsers(currentPage, searchTerm, roleFilter, statusFilter);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Show loading state
  if (loading) {
    console.log("AdminDashboard showing loading state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Loading Admin Dashboard...
          </h2>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !dashboardData) {
    console.log("AdminDashboard showing error state");
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Database Connection Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The admin dashboard requires a database connection to display
            real-time data. Please ensure MongoDB is properly configured and
            running.
          </p>
          <div className="space-y-2">
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchDashboardData();
                fetchUsers();
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 mr-2"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                setError(null);
                setDashboardData({
                  userStats: {
                    totalUsers: 0,
                    activeUsers: 0,
                    adminUsers: 0,
                    studentUsers: 0,
                    newUsersThisMonth: 0,
                    newUsersToday: 0,
                  },
                  userGrowth: [],
                  platformStats: {},
                  engagementData: [],
                  deviceData: [],
                  recentActivities: [],
                  recentUsers: [],
                });
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Continue with Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: BarChart3 },
    { id: "users", name: "Users", icon: Users },
    { id: "analytics", name: "Analytics", icon: TrendingUp },
    { id: "content", name: "Content", icon: BookOpen },
    { id: "settings", name: "Settings", icon: Settings },
  ];

  // Main dashboard content
  console.log("AdminDashboard rendering main content");
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome back, {user?.name}! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && dashboardData && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Total Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.userStats?.totalUsers || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 mr-1" />+
                      {dashboardData.userStats?.newUsersThisMonth || 0} this
                      month
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Active Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.userStats?.activeUsers || 0}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <Activity className="w-3 h-3 mr-1" />
                      {Math.round(
                        (dashboardData.userStats?.activeUsers /
                          dashboardData.userStats?.totalUsers) *
                          100
                      ) || 0}
                      % of total
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      New Today
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.userStats?.newUsersToday || 0}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 flex items-center mt-1">
                      <Zap className="w-3 h-3 mr-1" />
                      New registrations
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Admin Users
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {dashboardData.userStats?.adminUsers || 0}
                    </p>
                    <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center mt-1">
                      <Shield className="w-3 h-3 mr-1" />
                      System administrators
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Shield className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Growth Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    User Growth (6 Months)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      6M
                    </button>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dashboardData.userGrowth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="active"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Platform Stats */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Platform Statistics
                </h3>
                <div className="space-y-4">
                  {dashboardData.platformStats &&
                    Object.entries(dashboardData.platformStats).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Users
                </h3>
                <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData.recentUsers?.slice(0, 5).map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-400 font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                      >
                        {user.role}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                User Management
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="student">Student</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                              <span className="text-primary-600 dark:text-primary-400 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="ml-4">
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
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "admin"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                user.isActive ? "bg-green-400" : "bg-gray-400"
                              }`}
                            ></div>
                            <span className="text-sm text-gray-900 dark:text-white capitalize">
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : "Never"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                handleUserStatusUpdate(user.id, !user.isActive)
                              }
                              className={`px-2 py-1 text-xs rounded ${
                                user.isActive
                                  ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                              }`}
                            >
                              {user.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {pagination && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing {(pagination.currentPage - 1) * 10 + 1} to{" "}
                  {Math.min(pagination.currentPage * 10, pagination.totalUsers)}{" "}
                  of {pagination.totalUsers} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-lg">
                    {pagination.currentPage}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Detailed insights and performance metrics
              </p>
            </div>
          </div>
        )}

        {activeTab === "content" && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Content Management
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Manage quizzes, roadmaps, and other content
              </p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                System Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Configure system preferences and options
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
