import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Globe, User, LogOut } from "lucide-react";
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

  // Add dashboard to navigation only if user is authenticated
  const navigation = isAuthenticated
    ? [
        ...baseNavigation,
        {
          name: t("nav.dashboard"),
          href: "/dashboard",
          current: location.pathname === "/dashboard",
        },
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
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CG</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              CareerGuide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 whitespace-nowrap",
                  item.current
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Language Selector */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-1"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:block">
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
              <div className="flex items-center space-x-1 lg:space-x-2">
                <div className="flex items-center space-x-1 lg:space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <User className="w-4 h-4 flex-shrink-0" />
                  <span
                    className="hidden lg:block truncate max-w-32"
                    title={user?.name}
                  >
                    {user?.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:block">{t("auth.signOut")}</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate("/login")}
                className="hidden sm:flex"
              >
                {t("auth.signIn")}
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
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
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="flex flex-col space-y-2">
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

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <User className="w-4 h-4" />
                      <span>{user?.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t("auth.signOut")}</span>
                    </Button>
                  </div>
                ) : (
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
