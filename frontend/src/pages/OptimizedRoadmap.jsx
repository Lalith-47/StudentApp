import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  Award,
  MapPin,
  ChevronRight,
  Star,
  Loader2,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { useQuery } from "react-query";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import InfiniteScroll from "../components/UI/InfiniteScroll";
import VirtualizedList from "../components/UI/VirtualizedList";
import apiService from "../utils/api";

const OptimizedRoadmap = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [sortOrder, setSortOrder] = useState("desc");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [allRoadmaps, setAllRoadmaps] = useState([]);

  // Fetch roadmaps from API with pagination
  const {
    data: roadmapsData,
    isLoading: roadmapsLoading,
    error: roadmapsError,
    refetch,
  } = useQuery(
    [
      "roadmaps",
      currentPage,
      pageSize,
      selectedCategory,
      selectedDifficulty,
      sortBy,
      sortOrder,
    ],
    () =>
      apiService.roadmap.getAll({
        category: selectedCategory || undefined,
        difficulty: selectedDifficulty || undefined,
        sortBy,
        sortOrder,
        page: currentPage,
        limit: pageSize,
      }),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      keepPreviousData: true,
      onSuccess: (data) => {
        if (currentPage === 1) {
          setAllRoadmaps(data.data || []);
        } else {
          setAllRoadmaps((prev) => [...prev, ...(data.data || [])]);
        }
      },
    }
  );

  // Mock data for roadmaps (fallback)
  const mockRoadmaps = [
    {
      _id: "1",
      courseName: "Computer Science Engineering",
      description:
        "Comprehensive roadmap for Computer Science Engineering covering programming, algorithms, and software development.",
      category: "Engineering",
      duration: "4 years",
      difficulty: "Advanced",
      marketDemand: {
        current: "Very High",
        future: "Booming",
        salaryRange: {
          entry: "₹6-8 LPA",
          mid: "₹12-18 LPA",
          senior: "₹25-50 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Year 1)",
          duration: "12 months",
          milestones: [
            {
              title: "Programming Basics",
              description: "Learn C, C++, Python fundamentals",
              resources: ["Codecademy", "GeeksforGeeks"],
              completed: false,
            },
          ],
          skills: ["Programming", "Mathematics", "Problem Solving"],
        },
      ],
      resources: {
        books: ["Introduction to Algorithms", "Clean Code"],
        onlineCourses: ["CS50", "Algorithms Specialization"],
        certifications: ["AWS", "Google Cloud"],
        tools: ["VS Code", "Git", "Docker"],
      },
      institutions: [
        {
          name: "IIT Delhi",
          location: "New Delhi",
          ranking: 1,
          fees: "₹2.5 LPA",
          admissionProcess: "JEE Advanced",
        },
      ],
      tags: ["programming", "technology", "software", "algorithms"],
      rating: 4.8,
      popularity: 95,
    },
    {
      _id: "2",
      courseName: "Data Science & Analytics",
      description:
        "Complete guide to becoming a data scientist with hands-on projects and real-world applications.",
      category: "Technology",
      duration: "2 years",
      difficulty: "Intermediate",
      marketDemand: {
        current: "High",
        future: "Booming",
        salaryRange: {
          entry: "₹8-12 LPA",
          mid: "₹15-25 LPA",
          senior: "₹30-60 LPA",
        },
      },
      timeline: [
        {
          phase: "Foundation (Months 1-6)",
          duration: "6 months",
          milestones: [
            {
              title: "Python Programming",
              description: "Learn Python for data science",
              resources: ["Python.org", "DataCamp"],
              completed: false,
            },
          ],
          skills: ["Python", "Statistics", "Mathematics"],
        },
      ],
      resources: {
        books: [
          "Python for Data Analysis",
          "The Elements of Statistical Learning",
        ],
        onlineCourses: [
          "Data Science Specialization",
          "Machine Learning Course",
        ],
        certifications: ["Google Data Analytics", "IBM Data Science"],
        tools: ["Jupyter", "Pandas", "Scikit-learn"],
      },
      institutions: [
        {
          name: "IIIT Hyderabad",
          location: "Hyderabad",
          ranking: 2,
          fees: "₹3 LPA",
          admissionProcess: "GATE",
        },
      ],
      tags: ["data science", "machine learning", "python", "analytics"],
      rating: 4.7,
      popularity: 88,
    },
    // Add more mock data as needed...
  ];

  const categories = [
    "All",
    "Engineering",
    "Technology",
    "Medicine",
    "Arts",
    "Commerce",
    "Science",
  ];

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "popularity", label: "Popularity" },
    { value: "rating", label: "Rating" },
    { value: "duration", label: "Duration" },
    { value: "salary", label: "Salary Potential" },
  ];

  // Use API data if available, otherwise fallback to mock data
  const roadmaps = roadmapsData?.data?.data || mockRoadmaps;

  // Memoized filtered and sorted roadmaps
  const filteredRoadmaps = useMemo(() => {
    let filtered = allRoadmaps.length > 0 ? allRoadmaps : roadmaps;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (roadmap) =>
          roadmap.courseName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          roadmap.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          roadmap.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter(
        (roadmap) => roadmap.category === selectedCategory
      );
    }

    // Apply difficulty filter
    if (selectedDifficulty && selectedDifficulty !== "All") {
      filtered = filtered.filter(
        (roadmap) => roadmap.difficulty === selectedDifficulty
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "popularity":
          aValue = a.popularity || 0;
          bValue = b.popularity || 0;
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "duration":
          aValue = parseInt(a.duration) || 0;
          bValue = parseInt(b.duration) || 0;
          break;
        case "salary":
          aValue =
            parseInt(
              a.marketDemand?.salaryRange?.entry?.replace(/[^\d]/g, "")
            ) || 0;
          bValue =
            parseInt(
              b.marketDemand?.salaryRange?.entry?.replace(/[^\d]/g, "")
            ) || 0;
          break;
        default: // relevance
          aValue = a.popularity || 0;
          bValue = b.popularity || 0;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [
    roadmaps,
    allRoadmaps,
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    sortBy,
    sortOrder,
  ]);

  const loadMoreRoadmaps = async () => {
    if (roadmapsLoading) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setAllRoadmaps([]);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "category") {
      setSelectedCategory(value);
    } else if (filterType === "difficulty") {
      setSelectedDifficulty(value);
    }
    setCurrentPage(1);
    setAllRoadmaps([]);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("desc");
    }
  };

  const renderRoadmapCard = (roadmap, index) => (
    <motion.div
      key={roadmap._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="h-full"
      whileHover={{
        y: -5,
        transition: { duration: 0.2 },
      }}
    >
      <Card hover className="h-full p-4 sm:p-6 group relative overflow-hidden">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex flex-col h-full relative z-10">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {roadmap.courseName}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3 line-clamp-3">
                  {roadmap.description}
                </p>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">
                  {roadmap.rating || 4.8}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge-primary text-xs px-2 py-1 group-hover:scale-105 transition-transform duration-200">
                {roadmap.category}
              </span>
              <span className="badge-secondary text-xs px-2 py-1 group-hover:scale-105 transition-transform duration-200">
                {roadmap.difficulty}
              </span>
              <span className="badge-secondary text-xs px-2 py-1 group-hover:scale-105 transition-transform duration-200">
                {roadmap.duration}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-200">
                <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {roadmap.marketDemand.current}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Demand
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-200">
                <Award className="w-4 h-4 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {roadmap.marketDemand.salaryRange.entry}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Starting Salary
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                Top Skills:
              </h4>
              <div className="flex flex-wrap gap-1">
                {roadmap.timeline[0]?.skills
                  ?.slice(0, 3)
                  .map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <Button
            fullWidth
            className="touch-target min-h-[44px] text-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-200"
          >
            {t("roadmap.view")}
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );

  const renderRoadmapListItem = (roadmap, index) => (
    <motion.div
      key={roadmap._id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-4"
    >
      <Card hover className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {roadmap.courseName}
              </h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">
                  {roadmap.rating || 4.8}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-3">
              {roadmap.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge-primary text-xs px-2 py-1">
                {roadmap.category}
              </span>
              <span className="badge-secondary text-xs px-2 py-1">
                {roadmap.difficulty}
              </span>
              <span className="badge-secondary text-xs px-2 py-1">
                {roadmap.duration}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {roadmap.marketDemand.current} Demand
                </span>
                <span className="flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {roadmap.marketDemand.salaryRange.entry}
                </span>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // Show loading spinner while fetching data
  if (roadmapsLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner text="Loading roadmaps..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-4 sm:py-6 lg:py-12">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10 lg:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
            {t("roadmap.title")}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            {t("roadmap.subtitle")}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8 lg:mb-10"
        >
          <Card className="p-4 sm:p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t("roadmap.search")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 w-full touch-target min-h-[44px]"
                />
              </div>

              {/* Filters and Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
                >
                  <option value="">{t("roadmap.category")}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) =>
                    handleFilterChange("difficulty", e.target.value)
                  }
                  className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
                >
                  <option value="">{t("roadmap.difficulty")}</option>
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>

                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input flex-1 touch-target min-h-[44px] text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSortChange(sortBy)}
                    className="touch-target min-h-[44px] px-3"
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc className="w-4 h-4" />
                    ) : (
                      <SortDesc className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="flex-1 touch-target min-h-[44px]"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="flex-1 touch-target min-h-[44px]"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredRoadmaps.length} roadmap
            {filteredRoadmaps.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Roadmaps Display */}
        {viewMode === "grid" ? (
          <InfiniteScroll
            hasMore={!roadmapsLoading && filteredRoadmaps.length < 1000} // Assuming max 1000 items
            loadMore={loadMoreRoadmaps}
            loading={roadmapsLoading}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {filteredRoadmaps.map((roadmap, index) =>
              renderRoadmapCard(roadmap, index)
            )}
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            hasMore={!roadmapsLoading && filteredRoadmaps.length < 1000}
            loadMore={loadMoreRoadmaps}
            loading={roadmapsLoading}
            className="max-w-4xl mx-auto"
          >
            {filteredRoadmaps.map((roadmap, index) =>
              renderRoadmapListItem(roadmap, index)
            )}
          </InfiniteScroll>
        )}

        {/* No Results */}
        {filteredRoadmaps.length === 0 && !roadmapsLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No roadmaps found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OptimizedRoadmap;
