import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  Search,
  Filter,
  CheckCircle,
  Clock,
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
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    assignedStudents: 0,
    unassignedStudents: 0,
    totalInteractions: 0,
  });

  // Fetch students data
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMentorStudents({
        search: searchTerm,
        page: 1,
        limit: 50,
      });

      if (response.data.success) {
        setStudents(response.data.students);
        setStats((prev) => ({
          ...prev,
          totalStudents: response.data.students.length,
          assignedStudents: response.data.students.filter((s) => s.isAssigned)
            .length,
          unassignedStudents: response.data.students.filter(
            (s) => !s.isAssigned
          ).length,
        }));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Refetch students when search term changes
  useEffect(() => {
    if (searchTerm.length > 2 || searchTerm.length === 0) {
      fetchStudents();
    }
  }, [searchTerm]);

  const tabs = [
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

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
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user?.name || "Mentor"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.totalStudents}
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
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalStudents}
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
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assigned
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.assignedStudents}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.unassignedStudents}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalInteractions}
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
        {activeTab === "students" && (
          <div>
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button className="flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>

            {/* Students List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Loading students...
                  </p>
                </div>
              ) : students.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No students found
                  </p>
                </div>
              ) : (
                students.map((student) => (
                  <motion.div
                    key={student._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`p-6 hover:shadow-lg transition-shadow duration-200 ${
                        student.isAssigned
                          ? "border-green-200 dark:border-green-800"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
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
                                Assigned to:{" "}
                                {student.assignedMentor?.name || "Unknown"}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {student.isAssigned ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Assigned
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Progress
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {student.analytics?.totalHours || 0} hours
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Interactions
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {student.analytics?.totalInteractions || 0}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Chat
                            </Button>
                            <Button size="sm" className="flex-1">
                              <UserCheck className="w-4 h-4 mr-1" />
                              Assign
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                    {stats.totalStudents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.assignedStudents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Assigned Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                    {stats.unassignedStudents}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Pending Assignments
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === "messages" && (
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Messages
              </h3>
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No messages yet. Start a conversation with your students!
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorPortal;
