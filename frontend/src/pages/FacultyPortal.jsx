import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Download,
  Filter,
  Search,
  Eye,
  FileText,
  Award,
  Calendar,
  BookOpen,
  GraduationCap,
  Briefcase,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Settings,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Activity,
  Target,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  Trophy,
  ArrowUp,
  ArrowDown,
  Minus,
  Bell,
  X,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../utils/api";

const FacultyPortal = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [approvedActivities, setApprovedActivities] = useState([]);
  const [rejectedActivities, setRejectedActivities] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    priority: "",
    department: "",
    dateRange: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Fetch faculty dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.faculty.getDashboard();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending approvals
  const fetchPendingApprovals = async () => {
    try {
      const response = await apiService.faculty.getPending({
        page: currentPage,
        limit: 10,
        ...filters,
        search: searchTerm,
      });
      if (response.data.success) {
        setPendingApprovals(response.data.data.approvals);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching pending approvals:", error);
    }
  };

  // Fetch approved activities
  const fetchApprovedActivities = async () => {
    try {
      const response = await apiService.faculty.getApproved();
      if (response.data.success) {
        setApprovedActivities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching approved activities:", error);
    }
  };

  // Fetch rejected activities
  const fetchRejectedActivities = async () => {
    try {
      const response = await apiService.faculty.getRejected();
      if (response.data.success) {
        setRejectedActivities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching rejected activities:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchPendingApprovals();
    fetchApprovedActivities();
    fetchRejectedActivities();
  }, []);

  // Refetch when filters or search change
  useEffect(() => {
    fetchPendingApprovals();
  }, [filters, searchTerm, currentPage]);

  // Handle approval action
  const handleApprovalAction = async (approvalId, action, data) => {
    try {
      let response;
      if (action === "approve") {
        response = await apiService.faculty.approve(approvalId, data);
      } else if (action === "reject") {
        response = await apiService.faculty.reject(approvalId, data);
      }
      
      if (response.data.success) {
        // Refresh data
        fetchPendingApprovals();
        fetchApprovedActivities();
        fetchRejectedActivities();
        fetchDashboardData();
        setShowApprovalModal(false);
        setSelectedApproval(null);
      }
    } catch (error) {
      console.error(`Error ${action}ing approval:`, error);
    }
  };

  // Handle request changes
  const handleRequestChanges = async (approvalId, changes) => {
    try {
      const response = await apiService.faculty.requestChanges(approvalId, changes);
      
      if (response.data.success) {
        fetchPendingApprovals();
        setShowApprovalModal(false);
        setSelectedApproval(null);
      }
    } catch (error) {
      console.error("Error requesting changes:", error);
    }
  };

  // View approval details
  const handleViewApproval = async (approvalId) => {
    try {
      const response = await apiService.faculty.getApproval(approvalId);
      if (response.data.success) {
        setSelectedApproval(response.data.data);
        setShowApprovalModal(true);
      }
    } catch (error) {
      console.error("Error fetching approval details:", error);
    }
  };

  // Export report
  const handleExportReport = async (format, type) => {
    try {
      const response = await apiService.faculty.exportReport(type, format, filters);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}-report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting report:", error);
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "approvals", label: "Pending Approvals", icon: Clock },
    { id: "approved", label: "Approved", icon: CheckCircle },
    { id: "rejected", label: "Rejected", icon: XCircle },
    { id: "reports", label: "Reports", icon: FileText },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  // Check if user is faculty or admin
  if (!user || (user.role !== "faculty" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Faculty Portal
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Welcome, {user?.name}! Manage student achievements and approvals.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pending Reviews
                </p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {dashboardData?.stats?.pending?.count || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Reviews
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.stats?.pending?.count || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Approved Today
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.stats?.approved?.count || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rejected Today
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.stats?.rejected?.count || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Avg Review Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData?.stats?.avgReviewTime || 0}m
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && (
          <div>
            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {dashboardData?.recentActivities?.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                              {activity.studentId?.name?.charAt(0)?.toUpperCase() || "S"}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {activity.activityId?.title || "Activity"}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.studentId?.name} - {activity.category}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {activity.status === "pending" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                          {activity.status === "approved" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          )}
                          {activity.status === "rejected" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setActiveTab("approvals")}
                      fullWidth
                      align="left"
                      variant="outline"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Review Pending
                    </Button>
                    <Button
                      onClick={() => setShowReportModal(true)}
                      fullWidth
                      align="left"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button
                      onClick={() => setActiveTab("analytics")}
                      fullWidth
                      align="left"
                      variant="outline"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Workload by Category */}
            {dashboardData?.workloadByCategory && (
              <div className="mb-8">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Workload by Category
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dashboardData.workloadByCategory.map((category, index) => (
                      <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {category.count}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {category._id}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {category.pending} pending
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {activeTab === "approvals" && (
          <div>
            {/* Filters and Search */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    <option value="academic">Academic</option>
                    <option value="extracurricular">Extracurricular</option>
                    <option value="volunteering">Volunteering</option>
                    <option value="internship">Internship</option>
                    <option value="leadership">Leadership</option>
                    <option value="certification">Certification</option>
                    <option value="workshop">Workshop</option>
                  </select>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <Button className="flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filter</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Pending Approvals List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Loading approvals...
                  </p>
                </div>
              ) : pendingApprovals.length === 0 ? (
                <Card className="p-6">
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No pending approvals found
                    </p>
                  </div>
                </Card>
              ) : (
                pendingApprovals.map((approval) => (
                  <motion.div
                    key={approval._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {approval.activityId?.title || "Activity"}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                              {approval.category}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              {approval.reviewDetails?.priority || "medium"}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {approval.activityId?.description || "No description available"}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {approval.studentId?.name}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(approval.reviewDetails?.submittedAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {approval.timeSinceSubmission || 0} days ago
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewApproval(approval._id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    disabled={!pagination.hasPrev}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={!pagination.hasNext}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Other tabs content will be added in the next part */}
      </div>

      {/* Approval Modal - Will be implemented in next part */}
    </div>
  );
};

export default FacultyPortal;
