import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Globe,
  Zap,
  Users,
  MessageCircle,
  BookOpen,
  Award,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Heart,
  Star,
  Clock,
  CheckCircle,
} from "lucide-react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import ResponsiveContainer from "../Layout/ResponsiveContainer";

const AdditionalFeaturesSection = () => {
  const navigate = useNavigate();

  const additionalFeatures = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Security",
      description:
        "Enterprise-grade security with end-to-end encryption, secure authentication, and data protection compliance.",
      link: "/security",
      color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/20",
      gradient: "from-emerald-500 to-emerald-600",
      badge: "Enterprise Grade",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Accessibility",
      description:
        "Access your learning platform from anywhere in the world with multi-language support and offline capabilities.",
      link: "/accessibility",
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
      gradient: "from-blue-500 to-blue-600",
      badge: "24/7 Available",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description:
        "Optimized performance with CDN delivery, smart caching, and instant loading for the best user experience.",
      link: "/performance",
      color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
      gradient: "from-yellow-500 to-yellow-600",
      badge: "Sub-second Load",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Hub",
      description:
        "Connect with peers, join study groups, and participate in collaborative learning experiences.",
      link: "/community",
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
      gradient: "from-purple-500 to-purple-600",
      badge: "Active Community",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "AI Assistant",
      description:
        "Get instant help with homework, career advice, and personalized recommendations powered by advanced AI.",
      link: "/ai-assistant",
      color: "text-rose-600 bg-rose-100 dark:bg-rose-900/20",
      gradient: "from-rose-500 to-rose-600",
      badge: "AI Powered",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Rich Content Library",
      description:
        "Access thousands of courses, books, videos, and interactive content from top educators worldwide.",
      link: "/library",
      color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20",
      gradient: "from-indigo-500 to-indigo-600",
      badge: "10,000+ Resources",
    },
  ];

  const platformStats = [
    {
      icon: Users,
      label: "Active Users",
      value: "100,000+",
      description: "Students worldwide",
    },
    {
      icon: BookOpen,
      label: "Courses Available",
      value: "5,000+",
      description: "From top universities",
    },
    {
      icon: Award,
      label: "Certificates Issued",
      value: "50,000+",
      description: "Industry recognized",
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: "96%",
      description: "Student satisfaction",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Education Director",
      content:
        "This platform has revolutionized how students learn and interact with educational content.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Computer Science Student",
      content:
        "The AI-powered features and community support have accelerated my learning journey significantly.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Dr. Priya Patel",
      role: "Faculty Member",
      content:
        "The platform's analytics and student engagement tools have transformed my teaching approach.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      id="additional-features"
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-blue-900/20 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-600/20 to-transparent rounded-full blur-3xl"></div>
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
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              And Much More
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Modern Education
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the comprehensive suite of tools and features that make
              our platform the most advanced educational ecosystem for students,
              faculty, and institutions.
            </p>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {additionalFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover="hover"
              className="h-full"
            >
              <Card className="p-6 h-full flex flex-col text-center group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm relative overflow-hidden">
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                    {feature.badge}
                  </span>
                </div>

                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow mb-6">
                  {feature.description}
                </p>

                {/* Aligned Action Button */}
                <div className="mt-auto pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(feature.link)}
                    className="w-full group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:border-purple-300 dark:group-hover:border-purple-700 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Millions Worldwide
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join the global community of learners who are transforming their
              futures with our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <motion.div
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <motion.div
                    className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2"
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
                  <div className="text-gray-600 dark:text-gray-300 font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Community Says
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hear from students, faculty, and education leaders about their
              experience with our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-pink-600/90"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Experience the Future of Education?
              </h3>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Join millions of students and educators who are already using
                our platform to achieve their goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/login")}
                  className="text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-50"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/contact")}
                  className="text-lg px-8 py-4 border-white text-white hover:bg-white/10"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </ResponsiveContainer>
    </section>
  );
};

export default AdditionalFeaturesSection;
