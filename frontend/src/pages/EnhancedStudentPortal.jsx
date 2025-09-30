import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  // Navigation & Layout
  Menu,
  X,
  Home,
  BookOpen,
  FileText,
  BarChart3,
  Calendar,
  MessageSquare,
  Users,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Bookmark,
  Share,
  Copy,
  Link,
  ExternalLink,
  ChevronDown,
  ChevronRight,

  // Course & Learning
  GraduationCap,
  Library,
  Video,
  File,
  Image,
  Music,
  Presentation,
  Code,
  Globe,

  // Assignments & Grades
  ClipboardList,
  PenTool,
  Calculator,
  Percent,
  Trophy,
  Medal,
  Zap,

  // Study & Analytics
  Brain,
  Lightbulb,
  Book,
  Activity,
  Timer,
  Play,
  Pause,
  Stop,

  // Communication
  Send,
  Reply,
  ThumbsUp,
  ThumbsDown,
  Heart,
  MessageCircle,

  // Performance & Progress
  Gauge,
  PieChart,
  LineChart,
  BarChart,
  TrendingUp as TrendingUpIcon,
  Target as TargetIcon,

  // Time & Schedule
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  AlarmClock,
  Timer as TimerIcon,

  // Files & Resources
  Folder,
  FolderOpen,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FileText as FileTextIcon,
  Image as ImageIcon,
  Video as VideoIcon,

  // Actions & Controls
  Save,
  RefreshCw,
  RotateCcw,
  MoreHorizontal,
  MoreVertical,
  ExternalLink as ExternalLinkIcon,

  // Status & Feedback
  Check,
  X as XIcon,
  AlertTriangle,
  Info,
  HelpCircle,
  ThumbsUp as ThumbsUpIcon,
  ThumbsDown as ThumbsDownIcon,

  // Advanced Features
  Sparkles,
  Zap as ZapIcon,
  Target as TargetIcon2,
  Rocket,
  Shield,
  Lock,
  Unlock,
  Eye as EyeIcon,
  EyeOff,
} from "lucide-react";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import Card from "../components/UI/Card";
import { api } from "../utils/api";

const EnhancedStudentPortal = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard Data
  const [dashboardData, setDashboardData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Modals and Forms
  const [showAssignmentSubmit, setShowAssignmentSubmit] = useState(false);
  const [showStudySession, setShowStudySession] = useState(false);
  const [showPerformanceAnalytics, setShowPerformanceAnalytics] =
    useState(false);
  const [showReportCard, setShowReportCard] = useState(false);

  // Selected Items
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Filters and Search
  const [filters, setFilters] = useState({
    status: "",
    course: "",
    type: "",
    dateRange: "",
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
    },
    {
      id: "courses",
      label: "My Courses",
      icon: BookOpen,
      children: [
        {
          id: "enrolled-courses",
          label: "Enrolled Courses",
          icon: GraduationCap,
        },
        { id: "course-resources", label: "Resources", icon: Library },
        { id: "syllabus", label: "Syllabus", icon: FileText },
        { id: "bookmarks", label: "Bookmarks", icon: Bookmark },
      ],
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: ClipboardList,
      children: [
        { id: "pending-assignments", label: "Pending", icon: Clock },
        { id: "submitted-assignments", label: "Submitted", icon: CheckCircle },
        { id: "graded-assignments", label: "Graded", icon: Award },
        { id: "assignment-feedback", label: "Feedback", icon: MessageSquare },
      ],
    },
    {
      id: "study",
      label: "Study Tools",
      icon: Brain,
      children: [
        { id: "study-sessions", label: "Study Sessions", icon: Timer },
        { id: "study-materials", label: "Materials", icon: Book },
        { id: "ai-assistant", label: "AI Assistant", icon: Sparkles },
        { id: "study-groups", label: "Study Groups", icon: Users },
      ],
    },
    {
      id: "performance",
      label: "Performance",
      icon: BarChart3,
      children: [
        { id: "grades", label: "Grades", icon: Trophy },
        { id: "attendance", label: "Attendance", icon: Calendar },
        { id: "analytics", label: "Analytics", icon: TrendingUp },
        { id: "report-card", label: "Report Card", icon: FileText },
      ],
    },
    {
      id: "communication",
      label: "Communication",
      icon: MessageSquare,
      children: [
        { id: "announcements", label: "Announcements", icon: Bell },
        { id: "discussions", label: "Discussions", icon: MessageCircle },
        { id: "messages", label: "Messages", icon: Send },
        { id: "collaboration", label: "Collaboration", icon: Users },
      ],
    },
  ];

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.studentEnhanced.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
        setCourses(response.data.data.enrollments || []);
        setAssignments(response.data.data.assignments || []);
        setAnnouncements(response.data.data.announcements || []);
      } else {
        console.error("Dashboard load failed:", response.data.message);
        // Set empty arrays to show proper empty states
        setCourses([]);
        setAssignments([]);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Show user-friendly error message
      if (error.response?.status === 401) {
        console.error("Authentication failed. Please log in again.");
      } else if (error.response?.status >= 500) {
        console.error("Server error. Please try again later.");
      } else {
        console.error("Network error. Please check your connection.");
      }
      // Set empty arrays to show proper empty states
      setCourses([]);
      setAssignments([]);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Courses
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.quickStats?.totalCourses || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Upcoming Assignments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.quickStats?.upcomingAssignments || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Average Attendance
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.quickStats?.averageAttendance?.toFixed(1) || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Study Streak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.quickStats?.studyStreak || 0} days
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Upcoming Deadlines
          </h2>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {dashboardData?.upcomingDeadlines?.slice(0, 5).map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {deadline.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {deadline.course} • Due in {deadline.daysUntilDue} days
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Announcements */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Announcements
          </h2>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {announcements.slice(0, 3).map((announcement) => (
            <div
              key={announcement._id}
              className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {announcement.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {announcement.authorId?.name} •{" "}
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Eye className="w-4 h-4 mr-1" />
                Read
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Course Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Course Progress
          </h2>
          <Button variant="outline" size="sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
        <div className="space-y-4">
          {courses.slice(0, 3).map((course) => (
            <div key={course.courseId} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {course.title}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.code} • {course.faculty}
                  </p>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {course.progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderCourses = () => (
    <div className="space-y-6">
      {/* Course Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="enrolled">Enrolled</option>
            <option value="completed">Completed</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.courseId}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {course.code} • {course.faculty}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {course.progress.toFixed(1)}%
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {course.attendance.toFixed(1)}%
                  </span>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              />
            </div>

            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <BookOpen className="w-4 h-4 mr-1" />
                Study
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="space-y-6">
      {/* Assignment Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <Input
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      {/* Assignment List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Assignments Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any assignments yet. Check back later or contact
                your instructor.
              </p>
              <Button
                variant="outline"
                onClick={() => loadDashboardData()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {assignment.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        assignment.type === "assignment"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : assignment.type === "quiz"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                      }`}
                    >
                      {assignment.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {assignment.courseId?.title} • Due{" "}
                    {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.ceil(
                        (new Date(assignment.dueDate) - new Date()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days left
                    </span>
                    <span className="flex items-center">
                      <Target className="w-4 h-4 mr-1" />
                      {assignment.rubric?.totalPoints || 0} points
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Submit
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "courses":
      case "enrolled-courses":
        return renderCourses();
      case "assignments":
      case "pending-assignments":
      case "submitted-assignments":
      case "graded-assignments":
        return renderAssignments();
      default:
        return (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Feature Coming Soon
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              This feature is under development and will be available soon.
            </p>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Student Portal
              </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {sidebarItems.map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.children && <ChevronRight className="w-4 h-4" />}
                  </button>

                  {item.children && activeTab === item.id && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleTabChange(child.id)}
                          className={`w-full flex items-center p-2 rounded-lg text-left text-sm transition-colors ${
                            activeTab === child.id
                              ? "bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
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
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full mr-2"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {sidebarItems.find((item) => item.id === activeTab)?.label ||
                    "Dashboard"}
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input placeholder="Search..." className="w-64" />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default EnhancedStudentPortal;
