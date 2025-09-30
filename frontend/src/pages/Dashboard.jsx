import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "react-query";
import {
  MessageCircle,
  Briefcase,
  Award,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Clock,
  ExternalLink,
  Star,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Filter,
  Search,
  ChevronRight,
  Play,
  Download,
  Share2,
  Heart,
  Eye,
  MessageSquare,
  BarChart3,
  Activity,
  Target,
  CheckCircle,
  AlertCircle,
  Info,
  Trophy,
} from "lucide-react";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import Grid from "../components/UI/Grid";
import ResponsiveContainer from "../components/Layout/ResponsiveContainer";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../utils/api";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [userAnalytics, setUserAnalytics] = useState({
    totalInteractions: 0,
    completedCourses: 0,
    appliedInternships: 0,
    appliedScholarships: 0,
    totalHours: 0,
    achievements: 0,
  });

  // Fetch user analytics
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery("userAnalytics", apiService.getUserAnalytics, {
    onSuccess: (data) => {
      if (data.success) {
        setUserAnalytics(data.data);
      }
    },
    onError: (error) => {
      console.error("Failed to fetch analytics:", error);
      // Keep default values (0) on error
    },
  });

  // Reset analytics mutation
  const resetAnalyticsMutation = useMutation(apiService.resetUserAnalytics, {
    onSuccess: (data) => {
      if (data.success) {
        setUserAnalytics(data.data);
        refetchAnalytics();
      }
    },
    onError: (error) => {
      console.error("Failed to reset analytics:", error);
    },
  });

  // Update analytics mutation
  const updateAnalyticsMutation = useMutation(apiService.updateUserAnalytics, {
    onSuccess: (data) => {
      if (data.success) {
        setUserAnalytics(data.data);
        refetchAnalytics();
      }
    },
    onError: (error) => {
      console.error("Failed to update analytics:", error);
    },
  });

  // Update page title
  useEffect(() => {
    document.title = "Dashboard - Smart Student Hub";
    return () => {
      document.title = "Smart Student Hub";
    };
  }, []);

  // Mock data for different sections
  const mockData = {
    chatHistory: [
      {
        id: 1,
        title: "Career Guidance for Computer Science",
        lastMessage: "What are the best career paths after CS?",
        timestamp: "2 hours ago",
        messageCount: 15,
        category: "Career Guidance",
        status: "completed",
      },
      {
        id: 2,
        title: "College Selection Help",
        lastMessage: "Which IITs should I apply to?",
        timestamp: "1 day ago",
        messageCount: 8,
        category: "College Selection",
        status: "active",
      },
      {
        id: 3,
        title: "Scholarship Information",
        lastMessage: "Tell me about government scholarships",
        timestamp: "3 days ago",
        messageCount: 12,
        category: "Scholarships",
        status: "completed",
      },
    ],
    internships: [
      {
        id: 1,
        title: "Software Engineering Intern",
        company: "Google",
        location: "Bangalore, India",
        duration: "12-14 weeks",
        stipend: "₹1,20,000/month",
        type: "Full-time",
        deadline: "2024-03-15",
        requirements: [
          "Computer Science or related field",
          "Strong programming skills in C++, Java, or Python",
          "Data structures and algorithms knowledge",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Work on Google's core products and infrastructure. Contribute to projects that impact billions of users worldwide while learning from world-class engineers.",
        rating: 4.9,
        applicants: 2500,
        isApplied: false,
        isBookmarked: false,
        source: "Google Careers",
      },
      {
        id: 2,
        title: "Product Management Intern",
        company: "Google",
        location: "Mumbai, India",
        duration: "12 weeks",
        stipend: "₹1,00,000/month",
        type: "Full-time",
        deadline: "2024-03-20",
        requirements: [
          "Business, Engineering, or related field",
          "Strong analytical and communication skills",
          "Experience with data analysis tools",
          "Currently pursuing Bachelor's or Master's degree",
        ],
        description:
          "Work closely with product managers to define product strategy, analyze user data, and drive product decisions for Google's consumer and enterprise products.",
        rating: 4.8,
        applicants: 1800,
        isApplied: false,
        isBookmarked: false,
        source: "Google Careers",
      },
    ],
    scholarships: [
      {
        id: 1,
        title: "Post Matric Scholarship for SC/ST/OBC Students",
        provider: "Ministry of Social Justice and Empowerment",
        source: "NSP (National Scholarship Portal)",
        amount: "₹10,000 - ₹1,20,000/year",
        deadline: "2024-12-31",
        eligibility: "SC/ST/OBC students pursuing higher education",
        description:
          "Central government scholarship for students from reserved categories pursuing post-matriculation courses.",
        requirements: [
          "SC/ST/OBC Category Certificate",
          "Income Certificate (Family income < ₹2.5 Lakh)",
          "Admission in recognized institution",
          "Aadhaar Card",
        ],
        status: "open",
        isApplied: false,
        isBookmarked: false,
      },
    ],
    courses: [
      {
        id: 1,
        title: "Google IT Support Professional Certificate",
        provider: "Google",
        duration: "6 months",
        level: "Beginner",
        rating: 4.8,
        students: 500000,
        price: "Free",
        certificate: true,
        skills: [
          "IT Support",
          "Troubleshooting",
          "Customer Service",
          "Operating Systems",
          "Networking",
        ],
        description:
          "Prepare for a career in IT support with Google's comprehensive program covering hardware, software, networking, and customer service.",
        isEnrolled: false,
        isBookmarked: false,
        source: "Coursera",
      },
    ],
    analytics: {
      totalInteractions: 45,
      completedCourses: 3,
      appliedInternships: 2,
      appliedScholarships: 1,
      totalHours: 120,
      achievements: 8,
    },
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "chat", label: "AI Chat", icon: MessageCircle },
    { id: "internships", label: "Internships", icon: Briefcase },
    { id: "scholarships", label: "Scholarships", icon: Award },
    { id: "courses", label: "Free Courses", icon: GraduationCap },
    { id: "sports", label: "Sports", icon: Trophy },
  ];

  const handleApply = (type, id) => {
    console.log(`Applied to ${type} ${id}`);
    // Here you would implement the actual application logic
  };

  const handleBookmark = (type, id) => {
    console.log(`Bookmarked ${type} ${id}`);
    // Here you would implement the bookmark logic
  };

  // Function to update analytics when user interacts
  const updateAnalytics = (field, increment = 1) => {
    updateAnalyticsMutation.mutate({ field, increment });
  };

  // Function to simulate user interactions for demo purposes
  const simulateInteraction = (type) => {
    switch (type) {
      case "ai_chat":
        updateAnalytics("totalInteractions");
        break;
      case "course_complete":
        updateAnalytics("completedCourses");
        updateAnalytics("totalHours", 5); // Assume 5 hours per course
        break;
      case "internship_apply":
        updateAnalytics("appliedInternships");
        break;
      case "scholarship_apply":
        updateAnalytics("appliedScholarships");
        break;
      case "achievement":
        updateAnalytics("achievements");
        break;
      default:
        break;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-4 sm:p-6 lg:p-8 text-white"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">
          Welcome, {user?.name || "Student"}! 👋
        </h2>
        <p className="text-primary-100 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
          Here's your personalized dashboard with all your learning progress and
          opportunities.
        </p>
        <Grid cols={{ sm: 2, lg: 4 }} gap="md">
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.totalInteractions}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              AI Interactions
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.completedCourses}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              Courses Completed
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.appliedInternships}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              Internships Applied
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold">
              {userAnalytics.achievements}
            </div>
            <div className="text-xs sm:text-sm text-primary-100">
              Achievements
            </div>
          </div>
        </Grid>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Quick Actions
        </h3>
        <Grid cols={{ sm: 2, lg: 3 }} gap="md">
          <Card
            hover
            className="p-4 sm:p-6 text-center cursor-pointer h-full"
            onClick={() => {
              setActiveTab("chat");
              simulateInteraction("ai_chat");
            }}
          >
            <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mx-auto mb-2 sm:mb-3" />
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              Start AI Chat
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Get personalized career guidance
            </p>
          </Card>
          <Card
            hover
            className="p-4 sm:p-6 text-center cursor-pointer h-full"
            onClick={() => {
              setActiveTab("internships");
              simulateInteraction("internship_apply");
            }}
          >
            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2 sm:mb-3" />
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              Browse Internships
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Find your next opportunity
            </p>
          </Card>
          <Card
            hover
            className="p-4 sm:p-6 text-center cursor-pointer h-full"
            onClick={() => {
              setActiveTab("courses");
              simulateInteraction("course_complete");
            }}
          >
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2 sm:mb-3" />
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              Explore Courses
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Learn new skills for free
            </p>
          </Card>
        </Grid>
      </motion.div>

      {/* Demo Analytics Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Test Analytics Tracking
        </h3>
        <Card className="p-4 sm:p-6">
          <Grid cols={{ sm: 2, lg: 5 }} gap="sm">
            <Button
              size="sm"
              onClick={() => simulateInteraction("ai_chat")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">AI Chat</span>
              <span className="sm:hidden">Chat</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("course_complete")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Complete Course</span>
              <span className="sm:hidden">Course</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("internship_apply")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Apply Internship</span>
              <span className="sm:hidden">Apply</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("scholarship_apply")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Award className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Apply Scholarship</span>
              <span className="sm:hidden">Scholarship</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => simulateInteraction("achievement")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Star className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Get Achievement</span>
              <span className="sm:hidden">Achievement</span>
            </Button>
          </Grid>
          <div className="mt-4 flex justify-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center px-4">
              Analytics are automatically tracked as you use the platform
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
          Recent Activity
        </h3>
        <Card className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start space-x-3 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  Completed: Data Science Fundamentals
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  2 days ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  Applied to: Microsoft Data Science Intern
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  1 week ago
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">
                  Earned: Web Development Certificate
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  2 weeks ago
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "chat":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">AI Chat History</h3>
              <Button variant="primary" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            <Grid cols={{ sm: 1, lg: 2 }} gap="md">
              {mockData.chatHistory.map((chat) => (
                <Card key={chat.id} hover className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {chat.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            chat.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {chat.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{chat.lastMessage}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {chat.timestamp}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {chat.messageCount} messages
                        </span>
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-full text-xs">
                          {chat.category}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </Grid>
          </div>
        );
      case "internships":
        return (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6 mb-6 sm:mb-8">
              <h3 className="text-lg sm:text-xl font-semibold">
                Available Internships
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Input
                  placeholder="Search internships..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-gray-400" />}
                  className="w-full sm:w-64"
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input w-full sm:w-auto min-w-[150px]"
                >
                  <option value="all">All Companies</option>
                  <option value="google">Google</option>
                  <option value="microsoft">Microsoft</option>
                  <option value="amazon">Amazon</option>
                </select>
              </div>
            </div>
            <Grid cols={{ sm: 1, xl: 2 }} gap="md">
              {mockData.internships
                .filter((internship) => {
                  const matchesSearch =
                    internship.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    internship.company
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    internship.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase());

                  const matchesFilter =
                    filterCategory === "all" ||
                    (filterCategory === "google" &&
                      internship.company.toLowerCase().includes("google"));

                  return matchesSearch && matchesFilter;
                })
                .map((internship) => (
                  <Card key={internship.id} hover className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">
                          {internship.title}
                        </h4>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-gray-600">{internship.company}</p>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                            {internship.source}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {internship.location}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {internship.duration}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {internship.stipend}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                          {internship.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {internship.requirements
                            .slice(0, 3)
                            .map((req, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
                              >
                                {req}
                              </span>
                            ))}
                          {internship.requirements.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                              +{internship.requirements.length - 3} more
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 mr-1" />
                              {internship.rating}
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {internship.applicants} applicants
                            </span>
                            <span className="text-red-600 font-medium">
                              Deadline: {internship.deadline}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={internship.isApplied ? "outline" : "primary"}
                        size="sm"
                        onClick={() => handleApply("internship", internship.id)}
                        disabled={internship.isApplied}
                      >
                        {internship.isApplied ? "Applied" : "Apply Now"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleBookmark("internship", internship.id)
                        }
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            internship.isBookmarked
                              ? "text-red-500 fill-current"
                              : ""
                          }`}
                        />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
            </Grid>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ResponsiveContainer className="py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your learning journey, track progress, and discover
            opportunities.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "border-primary-500 dark:border-primary-400 text-primary-600 dark:text-primary-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
