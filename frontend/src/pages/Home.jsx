import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  BookOpen,
  Map,
  Building2,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  Target,
  Globe,
  MessageCircle,
  GraduationCap,
  Briefcase,
  Heart,
  Zap,
  Activity,
  BarChart3,
  Sparkles,
  Rocket,
  Shield,
  Clock,
  Bookmark,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Grid from "../components/UI/Grid";
import ResponsiveContainer from "../components/Layout/ResponsiveContainer";
import LazySection from "../components/UI/LazySection";
import PerformanceOptimizer from "../components/UI/PerformanceOptimizer";
import QuickScrollNav from "../components/Navigation/QuickScrollNav";
import CareerGuidanceSection from "../components/Sections/CareerGuidanceSection";
import SmartHubSection from "../components/Sections/SmartHubSection";
import AdditionalFeaturesSection from "../components/Sections/AdditionalFeaturesSection";
import ErrorBoundary from "../components/UI/ErrorBoundary";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Define sections for quick navigation
  const sections = [
    { id: "career-guidance", label: "Career Guidance" },
    { id: "smart-hub", label: "Smart Hub" },
    { id: "additional-features", label: "More Features" },
  ];

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: t("home.features.quiz.title"),
      description: t("home.features.quiz.description"),
      link: "/quiz",
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <Map className="w-8 h-8" />,
      title: t("home.features.roadmap.title"),
      description: t("home.features.roadmap.description"),
      link: "/roadmap",
      color: "text-green-600 bg-green-100 dark:bg-green-900/20",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: t("home.features.colleges.title"),
      description: t("home.features.colleges.description"),
      link: "/colleges",
      color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: t("home.features.chatbot.title"),
      description: t("home.features.chatbot.description"),
      link: "/chatbot",
      color: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  const stats = [
    { label: "Students Helped", value: "10,000+", icon: Users },
    { label: "Career Paths", value: "50+", icon: Map },
    { label: "Colleges Listed", value: "500+", icon: Building2 },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science Student",
      content:
        "This platform helped me discover my passion for data science and guided me to the right career path.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Raj Patel",
      role: "Engineering Graduate",
      content:
        "The career guidance was spot-on. I landed my dream job at a top tech company thanks to their roadmap.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Anita Singh",
      role: "MBA Student",
      content:
        "The scholarship database helped me find funding for my education. Highly recommended!",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Performance Optimizer */}
        <PerformanceOptimizer />

        {/* Quick Scroll Navigation */}
        <ErrorBoundary>
          <QuickScrollNav sections={sections} />
        </ErrorBoundary>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <ResponsiveContainer className="py-16 sm:py-20 lg:py-24">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                  Welcome to
                  <span className="block text-primary-600 dark:text-primary-400">
                    Yukti
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                  Your comprehensive career guidance platform from Bengaluru,
                  India. Discover your perfect career path with AI-powered
                  guidance, explore top colleges, find scholarships, and connect
                  with faculty who can help you succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={() => navigate("/quiz")}
                    className="text-lg px-8 py-4"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                    className="text-lg px-8 py-4"
                  >
                    Explore Dashboard
                  </Button>
                </div>
              </motion.div>
            </div>
          </ResponsiveContainer>
        </section>

        {/* Career Guidance Section */}
        <ErrorBoundary>
          <LazySection>
            <CareerGuidanceSection />
          </LazySection>
        </ErrorBoundary>

        {/* Smart Hub Section */}
        <ErrorBoundary>
          <LazySection>
            <SmartHubSection />
          </LazySection>
        </ErrorBoundary>

        {/* Additional Features Section */}
        <ErrorBoundary>
          <LazySection>
            <AdditionalFeaturesSection />
          </LazySection>
        </ErrorBoundary>

        {/* Legacy Features Section (Simplified) */}
        <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-800">
          <ResponsiveContainer>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Access Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Essential tools and resources for your educational journey
              </p>
            </motion.div>

            <Grid cols={{ sm: 1, md: 2, lg: 4 }} gap="lg">
              {features.map((feature, index) => (
                <motion.div
                  key={`feature-${index}-${feature.title}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 text-center h-full flex flex-col hover:shadow-lg transition-all duration-300">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${feature.color}`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-4 pt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(feature.link)}
                        className="w-full"
                      >
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </Grid>
          </ResponsiveContainer>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-primary-600 dark:bg-primary-700">
          <ResponsiveContainer>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Start Your Career Journey?
              </h2>
              <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                Join thousands of students who have already discovered their
                perfect career path with our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/quiz")}
                  className="text-lg px-8 py-4"
                >
                  Take Career Quiz
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                {isAuthenticated ? (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/login")}
                    className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary-600"
                  >
                    Get Started
                  </Button>
                )}
              </div>
            </motion.div>
          </ResponsiveContainer>
        </section>
      </div>
    </ErrorBoundary>
  );
};

export default Home;
