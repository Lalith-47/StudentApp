import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Users,
  Award,
  TrendingUp,
  Building2,
  Plus,
  Minus,
  BarChart3,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Loader2,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import InfiniteScroll from "../components/UI/InfiniteScroll";
import apiService from "../utils/api";

const OptimizedColleges = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("ranking");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [allColleges, setAllColleges] = useState([]);

  // Fetch colleges from API with pagination
  const {
    data: collegesData,
    isLoading: collegesLoading,
    error: collegesError,
    refetch,
  } = useQuery(
    [
      "colleges",
      currentPage,
      pageSize,
      selectedCity,
      selectedType,
      sortBy,
      sortOrder,
    ],
    () =>
      apiService.colleges.getAll({
        city: selectedCity || undefined,
        type: selectedType || undefined,
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
          setAllColleges(data.data || []);
        } else {
          setAllColleges((prev) => [...prev, ...(data.data || [])]);
        }
      },
    }
  );

  // Mock data for colleges (fallback)
  const mockColleges = [
    {
      _id: "1",
      name: "Indian Institute of Technology Delhi",
      shortName: "IIT Delhi",
      type: "Government",
      location: {
        city: "New Delhi",
        state: "Delhi",
        country: "India",
      },
      established: 1961,
      accreditation: {
        naac: { grade: "A++", score: 3.8 },
        nirf: { rank: 2, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹2.5 L", total: "₹10 L" },
          seats: 120,
          eligibility: "JEE Advanced",
          entranceExam: ["JEE Advanced"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 2000, fees: "₹1.2 L/year" },
        library: { books: 500000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 500,
        phd: 450,
        studentRatio: "1:12",
      },
      placement: {
        averagePackage: "₹15 LPA",
        highestPackage: "₹1.2 CPA",
        placementPercentage: 95,
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
        year: 2023,
      },
      reviews: [
        {
          rating: 5,
          comment: "Excellent faculty and infrastructure",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
      rating: 4.8,
      popularity: 98,
    },
    {
      _id: "2",
      name: "Indian Institute of Technology Bombay",
      shortName: "IIT Bombay",
      type: "Government",
      location: {
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
      },
      established: 1958,
      accreditation: {
        naac: { grade: "A++", score: 3.9 },
        nirf: { rank: 1, year: 2023 },
      },
      courses: [
        {
          name: "Computer Science Engineering",
          level: "UG",
          duration: "4 years",
          fees: { annual: "₹2.5 L", total: "₹10 L" },
          seats: 120,
          eligibility: "JEE Advanced",
          entranceExam: ["JEE Advanced"],
        },
      ],
      facilities: {
        hostel: { available: true, capacity: 2500, fees: "₹1.2 L/year" },
        library: { books: 600000, digital: true },
        labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
        sports: ["Cricket", "Football", "Basketball", "Tennis"],
      },
      faculty: {
        total: 600,
        phd: 550,
        studentRatio: "1:10",
      },
      placement: {
        averagePackage: "₹18 LPA",
        highestPackage: "₹1.5 CPA",
        placementPercentage: 98,
        topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
        year: 2023,
      },
      reviews: [
        {
          rating: 5,
          comment: "Best engineering college in India",
          category: "Overall",
          author: "Student",
          date: new Date(),
        },
      ],
      rating: 4.9,
      popularity: 99,
    },
    // Add more mock data as needed...
  ];

  const cities = [
    "All",
    "New Delhi",
    "Mumbai",
    "Tiruchirappalli",
    "Bangalore",
    "Chennai",
    "Pilani",
    "Mangalore",
    "Vellore",
    "Manipal",
  ];

  const types = [
    "All",
    "Government",
    "Private",
    "Deemed University",
    "Autonomous",
  ];

  const sortOptions = [
    { value: "ranking", label: "NIRF Ranking" },
    { value: "rating", label: "Rating" },
    { value: "placement", label: "Placement Package" },
    { value: "established", label: "Established Year" },
    { value: "fees", label: "Fees" },
  ];

  // Use API data if available, otherwise fallback to mock data
  const colleges = collegesData?.data?.data || mockColleges;

  // Memoized filtered and sorted colleges
  const filteredColleges = useMemo(() => {
    let filtered = allColleges.length > 0 ? allColleges : colleges;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (college) =>
          college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          college.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          college.location.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Apply city filter
    if (selectedCity && selectedCity !== "All") {
      filtered = filtered.filter(
        (college) => college.location.city === selectedCity
      );
    }

    // Apply type filter
    if (selectedType && selectedType !== "All") {
      filtered = filtered.filter((college) => college.type === selectedType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "ranking":
          aValue = a.accreditation?.nirf?.rank || 999;
          bValue = b.accreditation?.nirf?.rank || 999;
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "placement":
          aValue =
            parseInt(a.placement?.averagePackage?.replace(/[^\d]/g, "")) || 0;
          bValue =
            parseInt(b.placement?.averagePackage?.replace(/[^\d]/g, "")) || 0;
          break;
        case "established":
          aValue = a.established || 0;
          bValue = b.established || 0;
          break;
        case "fees":
          aValue =
            parseInt(a.courses[0]?.fees?.annual?.replace(/[^\d]/g, "")) || 0;
          bValue =
            parseInt(b.courses[0]?.fees?.annual?.replace(/[^\d]/g, "")) || 0;
          break;
        default:
          aValue = a.accreditation?.nirf?.rank || 999;
          bValue = b.accreditation?.nirf?.rank || 999;
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [
    colleges,
    allColleges,
    searchQuery,
    selectedCity,
    selectedType,
    sortBy,
    sortOrder,
  ]);

  const loadMoreColleges = async () => {
    if (collegesLoading) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
    setAllColleges([]);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "city") {
      setSelectedCity(value);
    } else if (filterType === "type") {
      setSelectedType(value);
    }
    setCurrentPage(1);
    setAllColleges([]);
  };

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const addToCompare = (college) => {
    if (
      compareList.length < 4 &&
      !compareList.find((c) => c._id === college._id)
    ) {
      setCompareList([...compareList, college]);
    }
  };

  const removeFromCompare = (collegeId) => {
    setCompareList(compareList.filter((c) => c._id !== collegeId));
  };

  const isInCompareList = (collegeId) => {
    return compareList.some((c) => c._id === collegeId);
  };

  const canAddToCompare = (collegeId) => {
    return compareList.length < 4 && !isInCompareList(collegeId);
  };

  const renderCollegeCard = (college, index) => (
    <motion.div
      key={college._id}
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {college.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {college.shortName}
                </p>
                <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                  <span className="truncate">
                    {college.location.city}, {college.location.state}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">
                  {college.rating || 4.8}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              <span className="badge-primary text-xs px-2 py-1 group-hover:scale-105 transition-transform duration-200">
                {college.type}
              </span>
              <span className="badge-secondary text-xs px-2 py-1 group-hover:scale-105 transition-transform duration-200">
                Est. {college.established}
              </span>
              {college.accreditation.nirf && (
                <span className="badge-success text-xs px-2 py-1 group-hover:scale-105 transition-transform duration-200">
                  NIRF #{college.accreditation.nirf.rank}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-200">
                <TrendingUp className="w-4 h-4 text-green-600 mx-auto mb-1 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {college.placement.averagePackage}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Avg Package
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-700 transition-colors duration-200">
                <Users className="w-4 h-4 text-blue-600 mx-auto mb-1 group-hover:scale-110 transition-transform duration-200" />
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {college.placement.placementPercentage}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Placement
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                Top Recruiters:
              </h4>
              <div className="flex flex-wrap gap-1">
                {college.placement.topRecruiters
                  .slice(0, 3)
                  .map((recruiter, recruiterIndex) => (
                    <span
                      key={recruiterIndex}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-xs rounded group-hover:bg-primary-200 dark:group-hover:bg-primary-800 transition-colors duration-200"
                    >
                      {recruiter}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-auto">
            <Button
              fullWidth
              className="touch-target min-h-[44px] text-sm group-hover:bg-primary-600 group-hover:text-white transition-all duration-200"
            >
              {t("colleges.viewDetails")}
            </Button>
            <div className="flex gap-2">
              {canAddToCompare(college._id) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addToCompare(college)}
                  className="touch-target min-h-[44px] min-w-[44px] flex-shrink-0 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                </Button>
              ) : isInCompareList(college._id) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromCompare(college._id)}
                  className="touch-target min-h-[44px] min-w-[44px] flex-shrink-0 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-200"
                >
                  <Minus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled
                  title="Maximum 4 colleges can be compared"
                  className="touch-target min-h-[44px] min-w-[44px] flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const renderCollegeListItem = (college, index) => (
    <motion.div
      key={college._id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="mb-4"
    >
      <Card hover className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {college.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {college.shortName} • {college.location.city},{" "}
                  {college.location.state}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">
                  {college.rating || 4.8}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="badge-primary text-xs px-2 py-1">
                {college.type}
              </span>
              <span className="badge-secondary text-xs px-2 py-1">
                Est. {college.established}
              </span>
              {college.accreditation.nirf && (
                <span className="badge-success text-xs px-2 py-1">
                  NIRF #{college.accreditation.nirf.rank}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {college.placement.averagePackage}
                </span>
                <span className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {college.placement.placementPercentage}% Placement
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  View Details
                </Button>
                {canAddToCompare(college._id) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCompare(college)}
                    className="min-w-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                ) : isInCompareList(college._id) ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCompare(college._id)}
                    className="min-w-[44px]"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // Show loading spinner while fetching data
  if (collegesLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner text="Loading colleges..." />
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
            {t("colleges.title")}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            {t("colleges.subtitle")}
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
                  placeholder={t("colleges.search")}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 w-full touch-target min-h-[44px]"
                />
              </div>

              {/* Filters and Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <select
                  value={selectedCity}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
                >
                  <option value="">City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="input w-full touch-target min-h-[44px] text-sm sm:text-base"
                >
                  <option value="">Type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
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

        {/* Compare Bar */}
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-700 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <BarChart3 className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <span className="font-medium text-primary-900 dark:text-primary-100 text-sm sm:text-base">
                    {compareList.length} colleges selected for comparison
                  </span>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowComparison(true)}
                    disabled={compareList.length < 2}
                    className="touch-target min-h-[40px] text-xs sm:text-sm"
                  >
                    Compare Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCompareList([])}
                    className="touch-target min-h-[40px] text-xs sm:text-sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredColleges.length} college
            {filteredColleges.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Colleges Display */}
        {viewMode === "grid" ? (
          <InfiniteScroll
            hasMore={!collegesLoading && filteredColleges.length < 1000}
            loadMore={loadMoreColleges}
            loading={collegesLoading}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {filteredColleges.map((college, index) =>
              renderCollegeCard(college, index)
            )}
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            hasMore={!collegesLoading && filteredColleges.length < 1000}
            loadMore={loadMoreColleges}
            loading={collegesLoading}
            className="max-w-4xl mx-auto"
          >
            {filteredColleges.map((college, index) =>
              renderCollegeListItem(college, index)
            )}
          </InfiniteScroll>
        )}

        {/* No Results */}
        {filteredColleges.length === 0 && !collegesLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No colleges found
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

export default OptimizedColleges;
