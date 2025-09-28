import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  TrendingUp,
  MessageSquare,
  Star,
  BookOpen,
  Target,
  BarChart3,
  Plus,
  Search,
  Filter,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import { useAuth } from "../contexts/AuthContext";
import { apiService } from "../utils/api";

const MentorPortal = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, assigned, unassigned
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("");
  const [stats, setStats] = useState(null);

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMentorStudents({
        search: searchTerm,
        filter: filter,
        page: 1,
        limit: 50
      });
      
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch assigned students
  const fetchAssignedStudents = async () => {
    try {
      const response = await apiService.getMentorAssignedStudents();
      if (response.data.success) {
        setAssignedStudents(response.data.students);
      }
    } catch (error) {
      console.error("Error fetching assigned students:", error);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await apiService.getMentorDashboardStats();
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Assign students to mentor
  const handleAssignStudents = async () => {
    if (selectedStudents.length === 0) return;
    
    try {
      setLoading(true);
      const response = await apiService.assignStudents({
        studentIds: selectedStudents
      });
      
      if (response.data.success) {
        setSelectedStudents([]);
        fetchStudents();
        fetchAssignedStudents();
        fetchStats();
      }
    } catch (error) {
      console.error("Error assigning students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Unassign students from mentor
  const handleUnassignStudents = async () => {
    if (selectedStudents.length === 0) return;
    
    try {
      setLoading(true);
      const response = await apiService.unassignStudents({
        studentIds: selectedStudents
      });
      
      if (response.data.success) {
        setSelectedStudents([]);
        fetchStudents();
        fetchAssignedStudents();
        fetchStats();
      }
    } catch (error) {
      console.error("Error unassigning students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle student selection
  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    const availableStudents = students.filter(student => student.canAssign);
    if (selectedStudents.length === availableStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(availableStudents.map(student => student._id));
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStudents();
    fetchAssignedStudents();
    fetchStats();
  }, [searchTerm, filter]);

  // Mock data for demonstration
  const mockStudents = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya@example.com",
      progress: 85,
      careerPath: "Software Engineering",
      lastActive: "2 hours ago",
      aptitudeScore: 92,
      strengths: ["Problem Solving", "Logical Thinking", "Teamwork"],
      avatar: "PS",
    },
    {
      id: 2,
      name: "Arjun Patel",
      email: "arjun@example.com",
      progress: 72,
      careerPath: "Data Science",
      lastActive: "1 day ago",
      aptitudeScore: 88,
      strengths: ["Analytical Skills", "Mathematics", "Research"],
      avatar: "AP",
    },
    {
      id: 3,
      name: "Sneha Reddy",
      email: "sneha@example.com",
      progress: 91,
      careerPath: "Product Management",
      lastActive: "3 hours ago",
      aptitudeScore: 95,
      strengths: ["Leadership", "Communication", "Strategic Thinking"],
      avatar: "SR",
    },
  ];

  useEffect(() => {
    setStudents(mockStudents);
  }, []);

  const handleStudentSelection = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSendMessage = async () => {
    if (!message.trim() || selectedStudents.length === 0) return;

    setLoading(true);
    try {
      // API call to send message
      console.log(
        "Sending message:",
        message,
        "to students:",
        selectedStudents
      );
      setMessage("");
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async (studentId) => {
    if (!feedback.trim()) return;

    setLoading(true);
    try {
      // API call to send feedback
      console.log("Sending feedback:", feedback, "to student:", studentId);
      setFeedback("");
    } catch (error) {
      console.error("Error sending feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Mentor Portal
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back, {user?.name || "Mentor"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                {stats.totalStudents} Students
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
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalStudents || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Active Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.activeStudents || 0}
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Avg Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.avgProgress || 0}%
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Avg Aptitude
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.avgAptitude || 0}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "students", label: "My Students", icon: Users },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
              { id: "messages", label: "Messages", icon: MessageSquare },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Students</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </select>
            </div>

            {/* Action Buttons */}
            {selectedStudents.length > 0 && (
              <div className="flex gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Button
                  onClick={handleAssignStudents}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Assign Selected ({selectedStudents.length})
                </Button>
                <Button
                  onClick={handleUnassignStudents}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Unassign Selected
                </Button>
                <Button
                  onClick={() => setSelectedStudents([])}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Clear Selection
                </Button>
              </div>
            )}

            {/* Students List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Loading students...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No students found</p>
                </div>
              ) : (
                students.map((student) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`p-6 hover:shadow-lg transition-shadow duration-200 ${
                      student.isAssigned ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 dark:text-primary-400 font-semibold">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {student.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {student.email}
                            </p>
                            {student.isAssigned && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Assigned to: {student.assignedMentor?.name || 'Unknown'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {student.canAssign && (
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student._id)}
                              onChange={() => handleStudentSelect(student._id)}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                          )}
                        </div>
                      </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-300">
                            Progress
                          </span>
                          <span className="font-medium">
                            {student.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Career Path:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {student.careerPath}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Aptitude Score:
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {student.aptitudeScore}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                          Last Active:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {student.lastActive}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-1">
                        {student.strengths.map((strength, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full"
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          /* View details */
                        }}
                        className="flex-1"
                      >
                        <BookOpen className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          /* Start chat */
                        }}
                        className="flex-1"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedStudents.length > 0 && (
              <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
                <div className="flex items-center justify-between">
                  <span className="text-primary-700 dark:text-primary-300 font-medium">
                    {selectedStudents.length} student(s) selected
                  </span>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Send message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || loading}
                      size="sm"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Student Performance Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Career Path Distribution
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Software Engineering
                      </span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Data Science
                      </span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        Product Management
                      </span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Progress Trends
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p>• 85% of students show consistent progress</p>
                    <p>• Average completion time: 3.2 weeks</p>
                    <p>• 92% satisfaction rate</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Conversations
              </h3>
              <div className="space-y-4">
                {students.slice(0, 3).map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-semibold text-sm">
                          {student.avatar}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Last message 2 hours ago
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorPortal;
