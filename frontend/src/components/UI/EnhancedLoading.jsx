import React from "react";
import { motion } from "framer-motion";
import { Loader2, BookOpen, Users, BarChart3, Award } from "lucide-react";

const EnhancedLoading = ({
  type = "default",
  message = "Loading...",
  size = "md",
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const containerSizeClasses = {
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const icons = {
    default: Loader2,
    book: BookOpen,
    users: Users,
    chart: BarChart3,
    award: Award,
  };

  const Icon = icons[type] || Loader2;

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const dotsVariants = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const dotVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const renderLoadingType = () => {
    switch (type) {
      case "dots":
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary-600 rounded-full"
                variants={dotVariants}
                animate="animate"
              />
            ))}
          </div>
        );

      case "pulse":
        return (
          <motion.div
            className="w-12 h-12 bg-primary-600 rounded-full"
            variants={pulseVariants}
            animate="animate"
          />
        );

      case "skeleton":
        return (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        );

      default:
        return (
          <motion.div variants={loadingVariants} animate="animate">
            <Icon className={`${sizeClasses[size]} text-primary-600`} />
          </motion.div>
        );
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${containerSizeClasses[size]}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-3"
      >
        {showIcon && renderLoadingType()}

        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-sm text-gray-600 dark:text-gray-400 font-medium"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

// Full page loading overlay
export const FullPageLoading = ({
  message = "Loading...",
  type = "default",
}) => (
  <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-sm mx-4">
      <EnhancedLoading type={type} message={message} size="lg" />
    </div>
  </div>
);

// Inline loading for buttons and forms
export const InlineLoading = ({ message = "Loading...", type = "default" }) => (
  <div className="flex items-center space-x-2">
    <EnhancedLoading type={type} message="" size="sm" showIcon={true} />
    <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
  </div>
);

// Card loading skeleton
export const CardLoading = ({ lines = 3 }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-3 bg-gray-200 dark:bg-gray-700 rounded ${
            i === lines - 1 ? "w-1/2" : "w-full"
          }`}
        ></div>
      ))}
    </div>
  </div>
);

// Table loading skeleton
export const TableLoading = ({ rows = 5, columns = 4 }) => (
  <div className="animate-pulse">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-b border-gray-200 dark:border-gray-600">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"
            ></div>
          ))}
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
        >
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 bg-gray-200 dark:bg-gray-600 rounded flex-1"
              ></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default EnhancedLoading;
