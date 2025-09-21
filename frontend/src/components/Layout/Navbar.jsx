import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, User, LogOut, Shield } from "lucide-react";
import { cn } from "../../utils/helpers";
import Button from "../UI/Button";
import ThemeToggle from "../UI/ThemeToggle";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const baseNavigation = [
    { name: t("nav.home"), href: "/", current: location.pathname === "/" },
    {
      name: t("nav.quiz"),
      href: "/quiz",
      current: location.pathname === "/quiz",
    },
    {
      name: t("nav.roadmap"),
      href: "/roadmap",
      current: location.pathname === "/roadmap",
    },
    {
      name: t("nav.colleges"),
      href: "/colleges",
      current: location.pathname === "/colleges",
    },
    {
      name: t("nav.chatbot"),
      href: "/chatbot",
      current: location.pathname === "/chatbot",
    },
  ];

  // Add navigation items based on user role
  const navigation = isAuthenticated
    ? [
        ...baseNavigation,
        // Add dashboard link only for non-admin users
        ...(user?.role !== "admin"
          ? [
              {
                name: t("nav.dashboard"),
                href: "/dashboard",
                current: location.pathname === "/dashboard",
              },
            ]
          : []),
        // Add admin link only for admin users
        ...(user?.role === "admin"
          ? [
              {
                name: "Admin",
                href: "/admin",
                current: location.pathname === "/admin",
              },
            ]
          : []),
      ]
    : baseNavigation;

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "kn", name: "ಕನ್ನಡ", flag: "🇮🇳" },
  ];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsLanguageOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
      <div className="container-wide">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18 transition-all duration-300">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background circle */}
                <circle cx="16" cy="16" r="16" fill="#f59e0b" />

                {/* Open Book (golden-orange with 3D effect) */}
                <path
                  d="M8 20C8 18.5 9.5 17 11 17H21C22.5 17 24 18.5 24 20V24C24 25.5 22.5 27 21 27H11C9.5 27 8 25.5 8 24V20Z"
                  fill="#f59e0b"
                  stroke="#d97706"
                  stroke-width="0.5"
                />

                {/* Book spine (darker orange) */}
                <rect x="15" y="17" width="2" height="10" fill="#d97706" />

                {/* Book pages with 3D effect */}
                <path
                  d="M9 19L23 19M9 21L23 21M9 23L23 23"
                  stroke="#d97706"
                  stroke-width="0.3"
                />

                {/* Tree trunk growing from book center */}
                <path d="M15 20L17 20L17 24L15 24Z" fill="#f59e0b" />

                {/* Tree branches (golden-orange) */}
                <path
                  d="M13 18L15 20L17 18L19 20L17 22L15 20Z"
                  fill="#f59e0b"
                />
                <path
                  d="M12 16L14 18L16 16L18 18L16 20L14 18Z"
                  fill="#f59e0b"
                />
                <path
                  d="M11 14L13 16L15 14L17 16L15 18L13 16Z"
                  fill="#f59e0b"
                />

                {/* Tree leaves (bright green with 3D effect) */}
                <circle cx="11" cy="12" r="1.5" fill="#10b981" />
                <circle cx="13" cy="10" r="1.5" fill="#10b981" />
                <circle cx="15" cy="12" r="1.5" fill="#10b981" />
                <circle cx="17" cy="10" r="1.5" fill="#10b981" />
                <circle cx="19" cy="12" r="1.5" fill="#10b981" />
                <circle cx="12" cy="14" r="1.2" fill="#10b981" />
                <circle cx="14" cy="14" r="1.2" fill="#10b981" />
                <circle cx="16" cy="14" r="1.2" fill="#10b981" />
                <circle cx="18" cy="14" r="1.2" fill="#10b981" />
                <circle cx="13" cy="16" r="1" fill="#10b981" />
                <circle cx="15" cy="16" r="1" fill="#10b981" />
                <circle cx="17" cy="16" r="1" fill="#10b981" />
                <circle cx="14" cy="18" r="0.8" fill="#10b981" />
                <circle cx="16" cy="18" r="0.8" fill="#10b981" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white transition-all duration-300">
              <span className="hidden sm:inline">AdhyayanMarg</span>
              <span className="sm:hidden">AM</span>
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on smaller screens */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-md touch-target",
                  item.current
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Theme Toggle */}
            <div className="touch-target">
              <ThemeToggle />
            </div>

            {/* Language Selector - Responsive visibility */}
            <div className="relative hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 px-2 touch-target"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:block">
                  {languages.find((lang) => lang.code === i18n.language)?.flag}
                </span>
              </Button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in slide-in-from-top-2 duration-200">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language.code);
                        setIsLanguageOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-gray-100 touch-target transition-colors duration-200",
                        i18n.language === language.code &&
                          "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                      )}
                    >
                      <span>{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* User Info - Responsive */}
                <div className="flex items-center space-x-1 sm:space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 sm:px-3 py-1.5 rounded-lg touch-target">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span
                    className="hidden sm:block truncate max-w-20 md:max-w-32 lg:max-w-40 font-medium"
                    title={user?.name}
                  >
                    {user?.name}
                  </span>
                </div>

                {/* Logout Button - Responsive */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 touch-target transition-all duration-200"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden md:block font-medium">
                    {t("auth.signOut")}
                  </span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Admin Portal Button - Responsive */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin-login")}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 touch-target transition-all duration-200"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:block font-medium">
                    Admin Portal
                  </span>
                </Button>

                {/* Sign In Button - Responsive */}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden sm:flex px-3 sm:px-4 py-2 font-medium touch-target transition-all duration-200"
                >
                  {t("auth.signIn")}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden ml-1 touch-target"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-in slide-in-from-top-2 duration-300 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 touch-target",
                    item.current
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                  Language
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language.code);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "px-3 py-2 text-sm rounded-md border transition-all duration-200 touch-target",
                        i18n.language === language.code
                          ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700 shadow-sm"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 hover:shadow-sm"
                      )}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-xs">{language.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3 px-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full justify-start touch-target hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("auth.signOut")}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 px-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        navigate("/login");
                        setIsOpen(false);
                      }}
                      className="w-full touch-target"
                    >
                      {t("auth.signIn")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigate("/admin-login");
                        setIsOpen(false);
                      }}
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 touch-target"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Portal
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
