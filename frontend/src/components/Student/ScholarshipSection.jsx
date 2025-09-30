import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Calendar,
  DollarSign,
  ExternalLink,
  Filter,
  Search,
  Star,
  Users,
  BookOpen,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import Card from "../UI/Card";
import Button from "../UI/Button";
import Input from "../UI/Input";

const ScholarshipSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Mock scholarship data with government scholarships at the top
  const scholarships = [
    // Government Scholarships
    {
      id: 1,
      title: "National Scholarship Portal - Merit Cum Means",
      provider: "Ministry of Education, Government of India",
      type: "government",
      amount: "₹25,000 - ₹1,25,000",
      deadline: "2024-12-31",
      eligibility: "Class 9 to Post Graduation",
      description: "Merit-cum-means scholarship for students from economically weaker sections",
      category: "Merit-cum-Means",
      status: "active",
      applicationUrl: "https://scholarships.gov.in",
      isFeatured: true,
    },
    {
      id: 2,
      title: "Prime Minister's Scholarship Scheme",
      provider: "Ministry of Human Resource Development",
      type: "government",
      amount: "₹2,000 - ₹3,000 per month",
      deadline: "2024-11-30",
      eligibility: "Children of armed forces personnel",
      description: "Scholarship for children of armed forces personnel",
      category: "Defense",
      status: "active",
      applicationUrl: "https://pmss.gov.in",
      isFeatured: true,
    },
    {
      id: 3,
      title: "Central Sector Scheme of Scholarships",
      provider: "Ministry of Education",
      type: "government",
      amount: "₹10,000 - ₹20,000 per annum",
      deadline: "2024-12-15",
      eligibility: "Class 12 pass with 80% marks",
      description: "Scholarship for meritorious students pursuing higher education",
      category: "Merit-based",
      status: "active",
      applicationUrl: "https://scholarships.gov.in",
      isFeatured: false,
    },
    {
      id: 4,
      title: "Post Matric Scholarship for SC/ST/OBC",
      provider: "Ministry of Social Justice & Empowerment",
      type: "government",
      amount: "₹230 - ₹1,200 per month",
      deadline: "2024-12-20",
      eligibility: "SC/ST/OBC students",
      description: "Post matriculation scholarship for SC/ST/OBC students",
      category: "Reserved Category",
      status: "active",
      applicationUrl: "https://scholarships.gov.in",
      isFeatured: false,
    },
    // Private Scholarships
    {
      id: 5,
      title: "Yukti Excellence Scholarship",
      provider: "Yukti Education Foundation",
      type: "private",
      amount: "₹50,000 per annum",
      deadline: "2024-10-31",
      eligibility: "Students with 85%+ marks",
      description: "Merit-based scholarship for outstanding students",
      category: "Merit-based",
      status: "active",
      applicationUrl: "#",
      isFeatured: true,
    },
    {
      id: 6,
      title: "Tech Innovation Scholarship",
      provider: "TechCorp India",
      type: "private",
      amount: "₹1,00,000",
      deadline: "2024-11-15",
      eligibility: "Engineering students",
      description: "Scholarship for innovative engineering projects",
      category: "Innovation",
      status: "active",
      applicationUrl: "#",
      isFeatured: false,
    },
    {
      id: 7,
      title: "Women in STEM Scholarship",
      provider: "STEM Foundation",
      type: "private",
      amount: "₹75,000",
      deadline: "2024-12-01",
      eligibility: "Female students in STEM fields",
      description: "Encouraging women participation in STEM education",
      category: "Gender-based",
      status: "active",
      applicationUrl: "#",
      isFeatured: false,
    },
    {
      id: 8,
      title: "Rural Development Scholarship",
      provider: "Rural Education Trust",
      type: "private",
      amount: "₹30,000 per annum",
      deadline: "2024-11-30",
      eligibility: "Students from rural areas",
      description: "Supporting education in rural communities",
      category: "Rural Development",
      status: "active",
      applicationUrl: "#",
      isFeatured: false,
    },
  ];

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      scholarship.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterType === "all" || 
      scholarship.type === filterType ||
      scholarship.category.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case "government":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "private":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "merit-based":
      case "merit-cum-means":
        return <Star className="w-4 h-4" />;
      case "defense":
        return <Users className="w-4 h-4" />;
      case "innovation":
        return <BookOpen className="w-4 h-4" />;
      case "gender-based":
        return <Users className="w-4 h-4" />;
      default:
        return <Award className="w-4 h-4" />;
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    return `${diffDays} days left`;
  };

  const getDeadlineColor = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 7) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Scholarships & Financial Aid
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover opportunities to fund your education
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search scholarships..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
            <option value="merit">Merit-based</option>
            <option value="defense">Defense</option>
            <option value="innovation">Innovation</option>
          </select>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredScholarships.length} scholarships found
            </span>
          </div>
        </div>
      </Card>

      {/* Scholarships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 h-full flex flex-col relative">
              {scholarship.isFeatured && (
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </span>
                </div>
              )}
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
                    {scholarship.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {scholarship.provider}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(scholarship.type)}`}>
                  {scholarship.type === "government" ? "Government" : "Private"}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 flex items-center gap-1">
                  {getCategoryIcon(scholarship.category)}
                  {scholarship.category}
                </span>
              </div>

              <div className="space-y-3 mb-4 flex-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {scholarship.amount}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className={`font-medium ${getDeadlineColor(scholarship.deadline)}`}>
                    {formatDeadline(scholarship.deadline)}
                  </span>
                </div>
                <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{scholarship.eligibility}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {scholarship.description}
              </p>

              <div className="flex gap-2 mt-auto">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(scholarship.applicationUrl, '_blank')}
                >
                  Apply Now
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Add to favorites or show details
                  }}
                >
                  Details
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {filteredScholarships.length === 0 && (
        <Card className="p-8 text-center">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No scholarships found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search criteria or filters.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ScholarshipSection;
