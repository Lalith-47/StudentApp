import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Calendar,
  BarChart3,
  MessageCircle,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Zap,
  Target,
  TrendingUp,
  Award,
  Brain,
  Globe,
} from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import ResponsiveContainer from "../Layout/ResponsiveContainer";

const SmartHubSection = () => {
  const navigate = useNavigate();

  const hubFeatures = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Course Management",
      description:
        "Access all your courses, assignments, and learning materials in one centralized hub.",
      link: "/dashboard",
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20",
      gradient: "from-indigo-500 to-indigo-600",
      stats: "50+ Courses Available",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Performance Analytics",
      description:
        "Track your progress with detailed analytics and personalized insights for improvement.",
      link: "/analytics",
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20",
      gradient: "from-emerald-500 to-emerald-600",
      stats: "Real-time Tracking",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Faculty Collaboration",
      description:
        "Connect with professors, get feedback, and collaborate on projects seamlessly.",
      link: "/faculty",
      color: "text-rose-600 bg-rose-100 dark:bg-rose-900/20",
      gradient: "from-rose-500 to-rose-600",
      stats: "24/7 Support",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Smart Chatbot",
      description:
        "Get instant answers to your questions with our AI-powered virtual assistant.",
      link: "/chatbot",
      color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20",
      gradient: "from-cyan-500 to-cyan-600",
      stats: "Instant Responses",
    },
  ];

  const smartTools = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Assignment Tracker",
      description:
        "Never miss a deadline with smart notifications and progress tracking.",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Study Planner",
      description:
        "Optimize your study schedule with AI-powered time management.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Learning Paths",
      description: "Personalized learning recommendations based on your goals.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Achievement System",
      description:
        "Earn badges and certificates as you progress through your journey.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Network",
      description: "Connect with students and professionals worldwide.",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Insights",
      description:
        "Detailed analytics to help you understand your learning patterns.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    hover: {
      y: -12,
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      id="smart-hub"
      className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-600/10 to-transparent rounded-full blur-3xl"></div>
      </div>

      <ResponsiveContainer className="relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
              <Zap className="w-4 h-4 mr-2" />
              Smart Hub for Students
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Your Intelligent
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Learning Companion
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of education with our smart hub that
              combines AI-powered insights, collaborative tools, and
              personalized learning experiences designed for modern students.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="text-lg px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Access Student Hub
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/analytics")}
              className="text-lg px-8 py-4 border-2 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </motion.div>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {hubFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover="hover"
              className="h-full"
            >
              <Card className="p-6 h-full flex flex-col text-center group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 dark:to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300 relative z-10`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>

                <div className="relative z-10 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow mb-4">
                    {feature.description}
                  </p>
                  <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6">
                    {feature.stats}
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(feature.link)}
                    className="w-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:border-indigo-300 dark:group-hover:border-indigo-700 transition-all duration-300"
                  >
                    Explore
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Smart Tools Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-12"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Smart Tools & Features
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to succeed in your academic journey, powered
              by AI and designed for efficiency.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smartTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-indigo-600 dark:text-indigo-400">
                      {tool.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {tool.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
};

export default SmartHubSection;
