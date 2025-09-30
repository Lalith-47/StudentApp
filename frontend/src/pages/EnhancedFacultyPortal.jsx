import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  // Navigation & Layout
  Home,
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,

  // Course Management
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  Calendar,
  Clock,
  MapPin,
  User,
  GraduationCap,

  // Assignment & Grading
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Award,
  Target,
  Timer,
  FileCheck,
  ClipboardList,
  PenTool,

  // Attendance
  QrCode,
  Scan,
  CheckSquare,
  Square,
  Clock3,
  UserCheck,
  UserX,
  Calendar as CalendarIcon,

  // Analytics & Reports
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  LineChart,
  Activity,
  Zap,
  Target as TargetIcon,

  // Communication
  MessageSquare,
  Send,
  Bell,
  Mail,
  Phone,
  Share2,
  Copy,
  Link,

  // Content & Files
  File,
  Image,
  Video,
  Music,
  Archive,
  Folder,
  FolderOpen,
  Cloud,

  // Actions & Controls
  Save,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreVertical,
  MoreHorizontal,
  ExternalLink,

  // Status & Feedback
  Check,
  AlertTriangle,
  Info,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Heart,

  // Advanced Features
  Brain,
  Cpu,
  Database,
  Server,
  Globe,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import StatusIndicator from "../components/UI/StatusIndicator";
import ProgressIndicator from "../components/UI/ProgressIndicator";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../utils/api";

const EnhancedFacultyPortal = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Modals and Forms
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [showAttendanceSession, setShowAttendanceSession] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showBulkMessage, setShowBulkMessage] = useState(false);

  // Selected Items
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Filters and Search
  const [filters, setFilters] = useState({
    status: "",
    semester: "",
    academicYear: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Check if user is faculty or admin
  if (!user || (user.role !== "faculty" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need faculty or admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.faculty.getEnhancedDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
        setCourses(response.data.data.courses || []);
        setAnnouncements(response.data.data.recentAnnouncements || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await apiService.faculty.getCourses(filters);
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    if (activeTab === "courses") {
      fetchCourses();
    }
  }, [filters, activeTab]);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "attendance", label: "Attendance", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "communication", label: "Communication", icon: MessageSquare },
    { id: "content", label: "Content", icon: Folder },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      badge: dashboardData?.pendingApprovals?.length || 0,
    },
    {
      id: "courses",
      label: "Course Management",
      icon: BookOpen,
      children: [
        { id: "courses-list", label: "All Courses", icon: BookOpen },
        { id: "create-course", label: "Create Course", icon: Plus },
        { id: "syllabus", label: "Syllabus Management", icon: FileText },
      ],
    },
    {
      id: "assignments",
      label: "Assignments & Exams",
      icon: FileText,
      children: [
        { id: "assignments-list", label: "All Assignments", icon: FileText },
        { id: "create-assignment", label: "Create Assignment", icon: Plus },
        { id: "grading", label: "Grading Center", icon: PenTool },
        { id: "rubrics", label: "Rubrics", icon: ClipboardList },
      ],
    },
    {
      id: "attendance",
      label: "Attendance Management",
      icon: Users,
      children: [
        {
          id: "attendance-sessions",
          label: "Attendance Sessions",
          icon: Calendar,
        },
        { id: "qr-codes", label: "QR Codes", icon: QrCode },
        { id: "reports", label: "Attendance Reports", icon: BarChart3 },
      ],
    },
    {
      id: "analytics",
      label: "Student Analytics",
      icon: BarChart3,
      children: [
        { id: "progress", label: "Student Progress", icon: TrendingUp },
        { id: "performance", label: "Performance Analytics", icon: Target },
        { id: "reports", label: "Generate Reports", icon: FileText },
      ],
    },
    {
      id: "communication",
      label: "Communication",
      icon: MessageSquare,
      children: [
        { id: "announcements", label: "Announcements", icon: Bell },
        { id: "bulk-messages", label: "Bulk Messages", icon: Send },
        { id: "forums", label: "Discussion Forums", icon: MessageSquare },
      ],
    },
    {
      id: "content",
      label: "Content Sharing",
      icon: Folder,
      children: [
        { id: "materials", label: "Course Materials", icon: File },
        { id: "multimedia", label: "Multimedia", icon: Video },
        { id: "library", label: "Resource Library", icon: Archive },
      ],
    },
    {
      id: "advanced",
      label: "Advanced Features",
      icon: Brain,
      children: [
        { id: "ai-feedback", label: "AI Feedback", icon: Brain },
        { id: "plagiarism", label: "Plagiarism Detection", icon: Shield },
        { id: "integrations", label: "Integrations", icon: Globe },
        { id: "automation", label: "Automation", icon: Zap },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Faculty Portal
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowCreateCourse(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Create Course</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAnnouncement(true)}
                className="flex items-center space-x-2"
              >
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Announce</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Faculty Tools
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {sidebarItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {item.badge}
                      </span>
                    )}
                    {item.children && <ChevronRight className="w-4 h-4" />}
                  </button>

                  {item.children && activeTab === item.id && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => setActiveTab(child.id)}
                          className="w-full flex items-center p-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          <child.icon className="w-4 h-4 mr-2" />
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Courses
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.analytics?.courses?.totalCourses || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                      <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Students
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.analytics?.courses?.totalStudents || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                      <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Assignments
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.analytics?.assignments
                          ?.totalAssignments || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Pending Reviews
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData?.pendingApprovals?.length || 0}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Courses */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Courses
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("courses")}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {courses.slice(0, 5).map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                            <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {course.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {course.code} • {course.enrolledStudents.length}{" "}
                              students
                            </p>
                          </div>
                        </div>
                        <StatusIndicator status={course.status} />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Pending Approvals */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Pending Approvals
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("approvals")}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {dashboardData?.pendingApprovals
                      ?.slice(0, 5)
                      .map((approval) => (
                        <div
                          key={approval._id}
                          className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {approval.activityId?.title ||
                                  "Activity Review"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {approval.studentId?.name}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Course Management
                </h2>
                <Button onClick={() => setShowCreateCourse(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </div>

              {/* Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filters.status}
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                    <select
                      value={filters.semester}
                      onChange={(e) =>
                        setFilters({ ...filters, semester: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">All Semesters</option>
                      <option value="Fall">Fall</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Winter">Winter</option>
                    </select>
                    <Button className="flex items-center space-x-2">
                      <Filter className="w-4 h-4" />
                      <span>Filter</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                            <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {course.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {course.code}
                            </p>
                          </div>
                        </div>
                        <StatusIndicator status={course.status} />
                      </div>

                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {course.semester} {course.academicYear}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          {course.enrolledStudents.length} students
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="w-4 h-4 mr-2" />
                          {course.credits} credits
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCourse(course)}
                          className="flex-1"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Assignment Management
                </h2>
                <Button onClick={() => setShowCreateAssignment(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Button>
              </div>

              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Assignment Center
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create, manage, and grade assignments with advanced tools.
                </p>
                <Button onClick={() => setShowCreateAssignment(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Assignment
                </Button>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === "attendance" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Attendance Management
                </h2>
                <Button onClick={() => setShowAttendanceSession(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              </div>

              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Attendance System
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Track student attendance with QR codes and automated reports.
                </p>
                <Button onClick={() => setShowAttendanceSession(true)}>
                  <QrCode className="w-4 h-4 mr-2" />
                  Start Attendance Session
                </Button>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Student Analytics
              </h2>

              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive analytics and reports for student performance.
                </p>
                <Button>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </div>
          )}

          {/* Communication Tab */}
          {activeTab === "communication" && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Communication Center
                </h2>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkMessage(true)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Bulk Message
                  </Button>
                  <Button onClick={() => setShowAnnouncement(true)}>
                    <Bell className="w-4 h-4 mr-2" />
                    New Announcement
                  </Button>
                </div>
              </div>

              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Communication Tools
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Send announcements, bulk messages, and manage discussions.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => setShowAnnouncement(true)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Create Announcement
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowBulkMessage(true)}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Bulk Message
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === "content" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Content Management
              </h2>

              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Content Sharing
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Share course materials, multimedia, and resources with
                  students.
                </p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Content
                </Button>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Settings
              </h2>

              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Faculty Settings
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Configure your faculty portal preferences and settings.
                </p>
                <Button>
                  <Settings className="w-4 h-4 mr-2" />
                  Open Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default EnhancedFacultyPortal;
