import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Target,
  BookOpen,
  Map,
  Users,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Brain,
  Lightbulb,
  Building2,
} from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import ResponsiveContainer from "../Layout/ResponsiveContainer";

const CareerGuidanceSection = () => {
  const navigate = useNavigate();

  const careerFeatures = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Career Assessment",
      description:
        "Discover your strengths and interests with our advanced personality and aptitude tests.",
      link: "/quiz",
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: "Personalized Roadmaps",
      description:
        "Get step-by-step guidance tailored to your career goals and learning preferences.",
      link: "/roadmap",
      color: "text-green-600 bg-green-100 dark:bg-green-900/20",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Mentorship",
      description:
        "Connect with industry professionals and career counselors for personalized guidance.",
      link: "/mentor",
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "College & University Database",
      description:
        "Explore thousands of institutions worldwide with detailed information and admission requirements.",
      link: "/colleges",
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const stats = [
    { label: "Career Paths Discovered", value: "50,000+", icon: Target },
    { label: "Students Guided", value: "25,000+", icon: Users },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Awards Won", value: "12", icon: Award },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      id="career-guidance"
      className="py-20 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-primary-900/20 dark:via-gray-900 dark:to-blue-900/20"
    >
      <ResponsiveContainer>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 dark:bg-primary-900/30 rounded-full text-primary-700 dark:text-primary-300 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Career Guidance
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Your Perfect
              <span className="block bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                Career Path
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive career guidance platform uses AI-powered
              assessments, expert mentorship, and personalized roadmaps to help
              you make informed decisions about your future.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              onClick={() => navigate("/quiz")}
              className="text-lg px-8 py-4 bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-700 hover:to-blue-700"
            >
              <Brain className="w-5 h-5 mr-2" />
              Take Career Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/roadmap")}
              className="text-lg px-8 py-4 border-2"
            >
              <Map className="w-5 h-5 mr-2" />
              View Career Roadmaps
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {careerFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover="hover"
              className="h-full"
            >
              <Card className="p-6 h-full flex flex-col text-center group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: 5 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow mb-6">
                  {feature.description}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(feature.link)}
                  className="w-full group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:border-primary-300 dark:group-hover:border-primary-700 transition-all duration-300"
                >
                  Explore
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center"
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <motion.div
                  className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring",
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
};

export default CareerGuidanceSection;
