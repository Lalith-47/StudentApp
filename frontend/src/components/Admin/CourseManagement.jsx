import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Plus,
  FileText,
  BarChart3,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  MoreVertical,
  Play,
  Pause,
  Archive,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Card from "../UI/Card";

const CourseManagement = ({ activeSubModule }) => {
  // State Management
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("card"); // card or table
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Mock Data (Limited to 12 courses)
  const mockCourses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      description:
        "Comprehensive course covering advanced mathematical concepts and problem-solving techniques.",
      instructor: "Dr. Sarah Johnson",
      instructorId: 2,
      category: "Mathematics",
      status: "active",
      level: "Advanced",
      duration: "12 weeks",
      students: 45,
      maxStudents: 50,
      rating: 4.8,
      price: 299,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    },
    {
      id: 2,
      title: "Introduction to Programming",
      description:
        "Learn the fundamentals of programming with hands-on projects and real-world examples.",
      instructor: "Prof. Michael Chen",
      instructorId: 3,
      category: "Computer Science",
      status: "active",
      level: "Beginner",
      duration: "8 weeks",
      students: 78,
      maxStudents: 100,
      rating: 4.6,
      price: 199,
      createdAt: "2024-01-05T00:00:00Z",
      updatedAt: "2024-01-14T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      description:
        "Master digital marketing strategies for modern businesses and startups.",
      instructor: "Dr. Emily Rodriguez",
      instructorId: 4,
      category: "Business",
      status: "draft",
      level: "Intermediate",
      duration: "10 weeks",
      students: 0,
      maxStudents: 60,
      rating: 0,
      price: 249,
      createdAt: "2024-01-10T00:00:00Z",
      updatedAt: "2024-01-12T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    },
    {
      id: 4,
      title: "Data Science Fundamentals",
      description:
        "Comprehensive introduction to data science, statistics, and machine learning.",
      instructor: "Dr. James Wilson",
      instructorId: 5,
      category: "Data Science",
      status: "archived",
      level: "Intermediate",
      duration: "14 weeks",
      students: 32,
      maxStudents: 40,
      rating: 4.9,
      price: 399,
      createdAt: "2023-12-01T00:00:00Z",
      updatedAt: "2023-12-20T00:00:00Z",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    },
    {
      id: 5,
      title: "Web Development Bootcamp",
      description:
        "Complete web development course covering HTML, CSS, JavaScript, and React.",
      instructor: "Prof. Alex Thompson",
      instructorId: 6,
      category: "Computer Science",
      status: "active",
      level: "Beginner",
      duration: "16 weeks",
      students: 89,
      maxStudents: 120,
      rating: 4.7,
      price: 349,
      createdAt: "2023-11-15T00:00:00Z",
      updatedAt: "2024-01-10T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 6,
      title: "Business Analytics",
      description:
        "Learn to analyze business data and make data-driven decisions.",
      instructor: "Dr. Maria Garcia",
      instructorId: 7,
      category: "Business",
      status: "active",
      level: "Intermediate",
      duration: "10 weeks",
      students: 56,
      maxStudents: 75,
      rating: 4.5,
      price: 279,
      createdAt: "2023-12-10T00:00:00Z",
      updatedAt: "2024-01-08T00:00:00Z",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    },
    {
      id: 7,
      title: "Machine Learning Basics",
      description:
        "Introduction to machine learning algorithms and applications.",
      instructor: "Dr. David Kim",
      instructorId: 8,
      category: "Data Science",
      status: "active",
      level: "Intermediate",
      duration: "12 weeks",
      students: 67,
      maxStudents: 80,
      rating: 4.8,
      price: 399,
      createdAt: "2023-10-20T00:00:00Z",
      updatedAt: "2024-01-05T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    },
    {
      id: 8,
      title: "Graphic Design Masterclass",
      description:
        "Master the principles of graphic design and visual communication.",
      instructor: "Prof. Lisa Chen",
      instructorId: 9,
      category: "Design",
      status: "draft",
      level: "Beginner",
      duration: "8 weeks",
      students: 0,
      maxStudents: 50,
      rating: 0,
      price: 229,
      createdAt: "2024-01-12T00:00:00Z",
      updatedAt: "2024-01-14T00:00:00Z",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
    },
    {
      id: 9,
      title: "Project Management",
      description:
        "Learn effective project management methodologies and tools.",
      instructor: "Dr. Robert Brown",
      instructorId: 10,
      category: "Business",
      status: "active",
      level: "Intermediate",
      duration: "6 weeks",
      students: 43,
      maxStudents: 60,
      rating: 4.4,
      price: 199,
      createdAt: "2023-11-01T00:00:00Z",
      updatedAt: "2024-01-03T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
      id: 10,
      title: "Mobile App Development",
      description: "Build mobile applications for iOS and Android platforms.",
      instructor: "Prof. Jennifer Lee",
      instructorId: 11,
      category: "Computer Science",
      status: "active",
      level: "Advanced",
      duration: "14 weeks",
      students: 34,
      maxStudents: 45,
      rating: 4.9,
      price: 449,
      createdAt: "2023-09-15T00:00:00Z",
      updatedAt: "2023-12-28T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    },
    {
      id: 11,
      title: "Digital Photography",
      description: "Master the art of digital photography and photo editing.",
      instructor: "Prof. Mark Wilson",
      instructorId: 12,
      category: "Arts",
      status: "active",
      level: "Beginner",
      duration: "10 weeks",
      students: 28,
      maxStudents: 40,
      rating: 4.6,
      price: 179,
      createdAt: "2023-10-05T00:00:00Z",
      updatedAt: "2023-12-15T00:00:00Z",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    },
    {
      id: 12,
      title: "Cybersecurity Fundamentals",
      description:
        "Learn the basics of cybersecurity and protecting digital assets.",
      instructor: "Dr. Kevin Martinez",
      instructorId: 13,
      category: "Computer Science",
      status: "active",
      level: "Intermediate",
      duration: "12 weeks",
      students: 41,
      maxStudents: 55,
      rating: 4.7,
      price: 329,
      createdAt: "2023-08-20T00:00:00Z",
      updatedAt: "2023-12-10T00:00:00Z",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400",
    },
  ];

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    category: "",
    level: "beginner",
    duration: "",
    maxStudents: 50,
    price: 0,
  });

  useEffect(() => {
    setCourses(mockCourses);
  }, []);

  // Filter Courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle Course Selection
  const handleCourseSelect = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  // Handle Select All
  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map((course) => course.id));
    }
  };

  // Get Status Badge Color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Get Level Badge Color
  const getLevelBadgeColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "intermediate":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400";
      case "advanced":
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
    });
  };

  // Render Course Cards
  const renderCourseCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map((course) => (
        <motion.div
          key={course.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Course Image */}
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                    course.status
                  )}`}
                >
                  {course.status}
                </span>
              </div>
              <div className="absolute top-4 left-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelBadgeColor(
                    course.level
                  )}`}
                >
                  {course.level}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {course.description}
              </p>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.instructor}</span>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.students}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Students
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.rating > 0 ? course.rating : "N/A"}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Rating
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Enrollment</span>
                  <span>
                    {Math.round((course.students / course.maxStudents) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(course.students / course.maxStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    ${course.price}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course.duration}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowEditModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  // Render Course Table
  const renderCourseTable = () => (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedCourses.length === filteredCourses.length &&
                    filteredCourses.length > 0
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Instructor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCourses.map((course) => (
              <motion.tr
                key={course.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseSelect(course.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {course.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {course.level} • {course.duration}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {course.instructor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {course.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                      course.status
                    )}`}
                  >
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div className="flex items-center">
                    <span className="mr-2">
                      {course.students}/{course.maxStudents}
                    </span>
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (course.students / course.maxStudents) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  ${course.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEditModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
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
      case "all-courses":
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Courses
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage and monitor all platform courses
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Course
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
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Business">Business</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewMode(viewMode === "card" ? "table" : "card")
                    }
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {viewMode === "card" ? "Table View" : "Card View"}
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
                Showing {filteredCourses.length} of {courses.length} courses
              </p>
              {selectedCourses.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCourses.length} selected
                  </span>
                  <Button variant="outline" size="sm">
                    Bulk Actions
                  </Button>
                </div>
              )}
            </div>

            {/* Course List */}
            {viewMode === "card" ? renderCourseCards() : renderCourseTable()}
          </div>
        );

      case "create-course":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create New Course
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Add a new course to the platform
              </p>
            </div>

            <Card className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Course Title *
                    </label>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter course title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Instructor *
                    </label>
                    <Input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) =>
                        setFormData({ ...formData, instructor: e.target.value })
                      }
                      placeholder="Enter instructor name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter course description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Business">Business</option>
                      <option value="Data Science">Data Science</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Level *
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({ ...formData, level: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration *
                    </label>
                    <Input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="e.g., 8 weeks"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Students
                    </label>
                    <Input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxStudents: parseInt(e.target.value),
                        })
                      }
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price (USD)
                    </label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      placeholder="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Course</Button>
                </div>
              </form>
            </Card>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a course management option
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose from the sidebar to manage courses
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

export default CourseManagement;
