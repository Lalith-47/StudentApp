import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Plus,
  Calendar,
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Send,
  Clock,
  Pin,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Users,
  EyeOff,
  Archive,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

const AnnouncementManagement = ({ activeSubModule }) => {
  // State Management
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [viewMode, setViewMode] = useState("timeline"); // timeline or list
  const [selectedAnnouncements, setSelectedAnnouncements] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Mock Data (Limited to 15 announcements)
  const mockAnnouncements = [
    {
      id: 1,
      title: "System Maintenance Scheduled",
      content:
        "We will be performing scheduled maintenance on our servers this weekend. The system will be unavailable from 2:00 AM to 6:00 AM EST on Sunday.",
      priority: "high",
      status: "published",
      targetAudience: "all",
      isPinned: true,
      isVisible: true,
      author: "System Admin",
      createdAt: "2024-01-15T10:30:00Z",
      publishedAt: "2024-01-15T10:30:00Z",
      scheduledDate: null,
      readCount: 1247,
      attachments: [],
    },
    {
      id: 2,
      title: "New Course Available: Advanced Data Science",
      content:
        "We're excited to announce the launch of our new Advanced Data Science course. This comprehensive program covers machine learning, deep learning, and advanced analytics.",
      priority: "medium",
      status: "published",
      targetAudience: "students",
      isPinned: false,
      isVisible: true,
      author: "Course Team",
      createdAt: "2024-01-14T14:20:00Z",
      publishedAt: "2024-01-14T14:20:00Z",
      scheduledDate: null,
      readCount: 892,
      attachments: [{ name: "course-brochure.pdf", size: "2.3 MB" }],
    },
    {
      id: 3,
      title: "Faculty Training Session",
      content:
        "Join us for a training session on the new grading system. The session will be held virtually on Friday at 3:00 PM EST.",
      priority: "medium",
      status: "scheduled",
      targetAudience: "faculty",
      isPinned: false,
      isVisible: true,
      author: "Training Team",
      createdAt: "2024-01-13T09:15:00Z",
      publishedAt: null,
      scheduledDate: "2024-01-19T15:00:00Z",
      readCount: 0,
      attachments: [],
    },
    {
      id: 4,
      title: "Welcome to the New Semester",
      content:
        "Welcome back to a new semester! We have exciting updates and improvements to share with you. Check out the new features in your dashboard.",
      priority: "low",
      status: "draft",
      targetAudience: "all",
      isPinned: false,
      isVisible: true,
      author: "Admin",
      createdAt: "2024-01-12T16:45:00Z",
      publishedAt: null,
      scheduledDate: null,
      readCount: 0,
      attachments: [],
    },
    {
      id: 5,
      title: "Midterm Exam Schedule Released",
      content:
        "The midterm exam schedule for all courses has been released. Please check your course pages for specific dates and times.",
      priority: "high",
      status: "published",
      targetAudience: "students",
      isPinned: true,
      isVisible: true,
      author: "Academic Office",
      createdAt: "2024-01-11T08:00:00Z",
      publishedAt: "2024-01-11T08:00:00Z",
      scheduledDate: null,
      readCount: 1567,
      attachments: [{ name: "exam-schedule.pdf", size: "1.2 MB" }],
    },
    {
      id: 6,
      title: "Library Hours Extended",
      content:
        "The library will now be open 24/7 during exam periods to accommodate increased study demand.",
      priority: "low",
      status: "published",
      targetAudience: "all",
      isPinned: false,
      isVisible: true,
      author: "Library Staff",
      createdAt: "2024-01-10T12:30:00Z",
      publishedAt: "2024-01-10T12:30:00Z",
      scheduledDate: null,
      readCount: 743,
      attachments: [],
    },
    {
      id: 7,
      title: "Career Fair Registration Open",
      content:
        "Registration for the Spring Career Fair is now open. Don't miss this opportunity to connect with top employers.",
      priority: "medium",
      status: "published",
      targetAudience: "students",
      isPinned: false,
      isVisible: true,
      author: "Career Services",
      createdAt: "2024-01-09T14:15:00Z",
      publishedAt: "2024-01-09T14:15:00Z",
      scheduledDate: null,
      readCount: 1123,
      attachments: [{ name: "career-fair-guide.pdf", size: "3.1 MB" }],
    },
    {
      id: 8,
      title: "New Student Portal Features",
      content:
        "Check out the new features in the student portal including improved course navigation and assignment tracking.",
      priority: "low",
      status: "published",
      targetAudience: "students",
      isPinned: false,
      isVisible: true,
      author: "IT Department",
      createdAt: "2024-01-08T16:45:00Z",
      publishedAt: "2024-01-08T16:45:00Z",
      scheduledDate: null,
      readCount: 892,
      attachments: [],
    },
    {
      id: 9,
      title: "Faculty Meeting Reminder",
      content:
        "Reminder: Faculty meeting scheduled for tomorrow at 2:00 PM in the main conference room.",
      priority: "medium",
      status: "scheduled",
      targetAudience: "faculty",
      isPinned: false,
      isVisible: true,
      author: "Academic Dean",
      createdAt: "2024-01-07T10:00:00Z",
      publishedAt: null,
      scheduledDate: "2024-01-16T14:00:00Z",
      readCount: 0,
      attachments: [],
    },
    {
      id: 10,
      title: "Campus WiFi Upgrade Complete",
      content:
        "The campus WiFi upgrade has been completed. You should notice improved speeds and connectivity across all buildings.",
      priority: "low",
      status: "published",
      targetAudience: "all",
      isPinned: false,
      isVisible: true,
      author: "IT Department",
      createdAt: "2024-01-06T09:30:00Z",
      publishedAt: "2024-01-06T09:30:00Z",
      scheduledDate: null,
      readCount: 634,
      attachments: [],
    },
  ];

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    targetAudience: "all",
    isPinned: false,
    isVisible: true,
    isScheduled: false,
    scheduledDate: "",
    scheduledTime: "",
  });

  useEffect(() => {
    setAnnouncements(mockAnnouncements);
  }, []);

  // Filter Announcements
  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch =
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || announcement.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || announcement.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Get Priority Badge Color
  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Get Status Badge Color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "archived":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Format Date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format Relative Time
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(dateString);
  };

  // Render Timeline View
  const renderTimelineView = () => (
    <div className="space-y-6">
      {filteredAnnouncements.map((announcement, index) => (
        <motion.div
          key={announcement.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <Card
            className={`p-6 ${
              announcement.isPinned
                ? "ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/10"
                : ""
            }`}
          >
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            {/* Timeline Dot */}
            <div
              className={`absolute left-5 top-6 w-3 h-3 rounded-full ${
                announcement.priority === "urgent"
                  ? "bg-red-500"
                  : announcement.priority === "high"
                  ? "bg-orange-500"
                  : announcement.priority === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
            ></div>

            <div className="ml-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {announcement.isPinned && (
                      <Pin className="w-4 h-4 text-yellow-500" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {announcement.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                        announcement.status
                      )}`}
                    >
                      {announcement.status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {announcement.targetAudience}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {announcement.content}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {announcement.author}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {announcement.publishedAt
                      ? formatRelativeTime(announcement.publishedAt)
                      : formatRelativeTime(announcement.createdAt)}
                  </span>
                  <span className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {announcement.readCount} reads
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Attachments */}
              {announcement.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Attachments
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {announcement.attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {attachment.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {attachment.size}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  // Render List View
  const renderListView = () => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Announcement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Audience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Reads
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAnnouncements.map((announcement) => (
              <motion.tr
                key={announcement.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        {announcement.isPinned && (
                          <Pin className="w-3 h-3 text-yellow-500 mr-1" />
                        )}
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {announcement.title}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {announcement.author}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadgeColor(
                      announcement.priority
                    )}`}
                  >
                    {announcement.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                      announcement.status
                    )}`}
                  >
                    {announcement.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {announcement.targetAudience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {announcement.readCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatDate(announcement.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAnnouncement(announcement);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );

  // Render Content Based on Active Sub Module
  const renderContent = () => {
    switch (activeSubModule) {
      case "all-announcements":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Announcements
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor all platform announcements
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Announcement
              </Button>
            </div>

            {/* Filters */}
            <Card className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewMode(viewMode === "timeline" ? "list" : "timeline")
                    }
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {viewMode === "timeline" ? "List View" : "Timeline View"}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </Card>

            {/* Results */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredAnnouncements.length} of {announcements.length}{" "}
                announcements
              </p>
              {selectedAnnouncements.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedAnnouncements.length} selected
                  </span>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </div>
              )}
            </div>

            {/* Announcements List */}
            {viewMode === "timeline" ? renderTimelineView() : renderListView()}
          </div>
        );

      case "create-announcement":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Announcement
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create and schedule announcements for your users
              </p>
            </div>

            <Card className="p-6">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter announcement title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Enter announcement content"
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Priority *
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Audience *
                    </label>
                    <select
                      value={formData.targetAudience}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAudience: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students Only</option>
                      <option value="faculty">Faculty Only</option>
                      <option value="admin">Admin Only</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isPinned}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isPinned: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Pin to top
                      </span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isScheduled}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isScheduled: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Schedule for later
                    </span>
                  </label>
                </div>

                {formData.isScheduled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scheduled Date
                      </label>
                      <Input
                        type="date"
                        value={formData.scheduledDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scheduledDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Scheduled Time
                      </label>
                      <Input
                        type="time"
                        value={formData.scheduledTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            scheduledTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>
                    {formData.isScheduled ? "Schedule" : "Publish"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select an announcement option
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from the sidebar to manage announcements
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

export default AnnouncementManagement;
