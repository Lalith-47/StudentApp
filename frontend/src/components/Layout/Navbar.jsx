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
      name: t("nav.stories"),
      href: "/stories",
      current: location.pathname === "/stories",
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
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CG</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              AdhyayanMarg
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on smaller screens */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap rounded-md",
                  item.current
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector - Hidden on very small screens */}
            <div className="relative hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1 px-2"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:block">
                  {languages.find((lang) => lang.code === i18n.language)?.flag}
                </span>
              </Button>

              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => changeLanguage(language.code)}
                      className={cn(
                        "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 text-gray-900 dark:text-gray-100",
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
              <div className="flex items-center space-x-1">
                {/* User Info - Responsive */}
                <div className="flex items-center space-x-1 sm:space-x-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-2 sm:px-3 py-1.5 rounded-lg">
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
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
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
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
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
                  className="hidden sm:flex px-3 sm:px-4 py-2 font-medium"
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
              className="lg:hidden ml-1"
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
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex flex-col space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                    item.current
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900"
                      : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Language Selector */}
              <div className="px-3 py-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Language
                </div>
                <div className="flex space-x-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => {
                        changeLanguage(language.code);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "px-3 py-1 text-sm rounded-md border transition-colors",
                        i18n.language === language.code
                          ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-700"
                          : "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                      )}
                    >
                      {language.flag} {language.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-3 px-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
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
                      className="flex items-center space-x-2 w-full justify-start"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("auth.signOut")}</span>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2 px-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        navigate("/login");
                        setIsOpen(false);
                      }}
                      className="w-full"
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
                      className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
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
