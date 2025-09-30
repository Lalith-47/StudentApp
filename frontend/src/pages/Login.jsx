import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  Users,
  Shield,
} from "lucide-react";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Input from "../components/UI/Input";
import apiService from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended destination or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [userRole, setUserRole] = useState("student"); // "student", "faculty", or "admin"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (mode === "register") {
      if (!formData.name) {
        newErrors.name = "Name is required";
      } else if (formData.name.length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      }
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (mode === "register") {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Block registration for Faculty and Admin roles
    if (mode === "register" && userRole !== "student") {
      setErrors({
        general:
          "Only students can create accounts. Faculty and Admin accounts are managed by administrators.",
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let response;
      if (mode === "login") {
        response = await apiService.login({
          email: formData.email,
          password: formData.password,
          role: userRole,
        });
      } else {
        response = await apiService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: userRole,
        });
      }

      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("authToken", response.data.token);

        // Update auth context
        login(response.data.user);

        // Redirect based on role
        let redirectPath;
        switch (userRole) {
          case "faculty":
            redirectPath = "/faculty";
            break;
          case "admin":
            redirectPath = "/admin";
            break;
          default:
            redirectPath = "/dashboard";
        }
        navigate(redirectPath, { replace: true });
      } else {
        setErrors({
          general: response.data.message || "Authentication failed",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
      let errorMessage = "Network error. Please try again.";

      if (error.response?.status === 401) {
        if (error.response?.data?.message?.includes("password")) {
          errorMessage = "Invalid password";
        } else if (error.response?.data?.message?.includes("user")) {
          errorMessage = "No user found with this email";
        } else {
          errorMessage = "Invalid credentials";
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    // Only allow registration mode for students
    if (userRole !== "student" && mode === "login") {
      setErrors({
        general:
          "Only students can create accounts. Faculty and Admin accounts are managed by administrators.",
      });
      return;
    }

    setMode(mode === "login" ? "register" : "login");
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md sm:max-w-lg"
      >
        <Card className="p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Role Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
              <button
                type="button"
                onClick={() => {
                  setUserRole("student");
                  // Allow both login and register for students
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  userRole === "student"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Student
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserRole("faculty");
                  setMode("login"); // Force login mode for faculty
                  setErrors({});
                }}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  userRole === "faculty"
                    ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <Users className="w-4 h-4 mr-2" />
                Faculty
              </button>
              {import.meta.env.VITE_ENABLE_ADMIN !== "false" && (
                <button
                  type="button"
                  onClick={() => {
                    setUserRole("admin");
                    setMode("login"); // Force login mode for admin
                    setErrors({});
                  }}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    userRole === "admin"
                      ? "bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${
                userRole === "admin"
                  ? "bg-red-600"
                  : userRole === "faculty"
                  ? "bg-purple-600"
                  : "bg-primary-600"
              }`}
            >
              {userRole === "student" ? (
                <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              ) : userRole === "faculty" ? (
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              ) : (
                <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              )}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              {mode === "login"
                ? `${
                    userRole === "student"
                      ? "Student"
                      : userRole === "faculty"
                      ? "Faculty"
                      : "Admin"
                  } ${t("auth.signIn")}`
                : `${
                    userRole === "student"
                      ? "Student"
                      : userRole === "faculty"
                      ? "Faculty"
                      : "Admin"
                  } ${t("auth.createAccount")}`}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed px-2">
              {userRole === "student"
                ? "Access your personalized career guidance dashboard"
                : userRole === "faculty"
                ? "Manage and guide your students' career journeys"
                : "Access administrative controls and system management"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm">
                {errors.general}
              </div>
            )}

            {/* Name Field (Register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.fullName")}
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  leftIcon={<User className="w-4 h-4 text-gray-400" />}
                  error={errors.name}
                  required
                  className="touch-target min-h-[44px]"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.email")}
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
                error={errors.email}
                required
                className="touch-target min-h-[44px]"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("auth.password")}
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 touch-target min-h-[40px] min-w-[40px] flex items-center justify-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                error={errors.password}
                required
                className="touch-target min-h-[44px]"
              />
            </div>

            {/* Confirm Password Field (Register only) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("auth.confirmPassword")}
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  leftIcon={<Lock className="w-4 h-4 text-gray-400" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600 touch-target min-h-[40px] min-w-[40px] flex items-center justify-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  error={errors.confirmPassword}
                  required
                  className="touch-target min-h-[44px]"
                />
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full touch-target min-h-[48px] text-sm sm:text-base"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {mode === "login"
                    ? t("auth.signingIn")
                    : t("auth.creatingAccount")}
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  {mode === "login"
                    ? t("auth.signIn")
                    : t("auth.createAccount")}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </Button>

            {/* Switch Mode - Only show for Students */}
            {userRole === "student" && (
              <div className="text-center">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {mode === "login"
                    ? t("auth.noAccount")
                    : t("auth.haveAccount")}
                </p>
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mt-1 touch-target min-h-[44px] px-2 py-1"
                >
                  {mode === "login"
                    ? t("auth.createAccount")
                    : t("auth.signIn")}
                </button>
              </div>
            )}

            {/* Information for Faculty/Admin */}
            {userRole !== "student" && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Faculty and Admin accounts are managed by administrators.
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Contact your administrator if you need account access.
                </p>
              </div>
            )}
          </form>

          {/* Back to Home */}
          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm touch-target min-h-[44px] px-2 py-1"
            >
              ← Back to Home
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
