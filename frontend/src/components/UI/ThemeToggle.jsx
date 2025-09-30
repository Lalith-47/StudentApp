import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../utils/helpers";

const ThemeToggle = ({
  variant = "button",
  size = "md",
  className = "",
  showLabel = false,
  ...props
}) => {
  const { theme, toggleTheme, isDark, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "button") {
    return (
      <motion.button
        onClick={toggleTheme}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          sizeClasses[size],
          className
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        {...props}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {isDark ? (
            <Sun className={iconSizeClasses[size]} />
          ) : (
            <Moon className={iconSizeClasses[size]} />
          )}
        </motion.div>
      </motion.button>
    );
  }

  if (variant === "select") {
    return (
      <div className={cn("relative", className)}>
        <select
          value={theme}
          onChange={(e) => {
            if (e.target.value === "light") {
              setLightTheme();
            } else if (e.target.value === "dark") {
              setDarkTheme();
            } else {
              // Auto mode - follow system preference
              const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
              ).matches
                ? "dark"
                : "light";
              setTheme(systemTheme);
            }
          }}
          className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          {...props}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <Monitor className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    );
  }

  if (variant === "switch") {
    return (
      <div className={cn("flex items-center space-x-3", className)}>
        {showLabel && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </span>
        )}
        <button
          onClick={toggleTheme}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
            isDark ? "bg-primary-600" : "bg-gray-200"
          )}
          aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          {...props}
        >
          <motion.span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
              isDark ? "translate-x-6" : "translate-x-1"
            )}
            animate={{ x: isDark ? 24 : 4 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-center h-full">
              {isDark ? (
                <Moon className="w-2 h-2 text-gray-600" />
              ) : (
                <Sun className="w-2 h-2 text-yellow-500" />
              )}
            </div>
          </motion.span>
        </button>
      </div>
    );
  }

  return null;
};

export default ThemeToggle;
