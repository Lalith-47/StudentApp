import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const SkeletonLoader = ({
  variant = "text",
  lines = 3,
  className = "",
  animate = true,
  width = "100%",
  height = "1rem",
}) => {
  const baseClasses = cn(
    "bg-gray-200 dark:bg-gray-700 rounded",
    animate && "animate-pulse"
  );

  const variants = {
    text: (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(baseClasses)}
            style={{
              width: index === lines - 1 ? "75%" : "100%",
              height: height,
            }}
            initial={animate ? { opacity: 0 } : undefined}
            animate={animate ? { opacity: 1 } : undefined}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              repeat: animate ? Infinity : 0,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    ),
    card: (
      <div
        className={cn(
          "space-y-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg",
          className
        )}
      >
        <div className={cn(baseClasses, "h-6 w-3/4")} />
        <div className="space-y-2">
          <div className={cn(baseClasses, "h-4 w-full")} />
          <div className={cn(baseClasses, "h-4 w-5/6")} />
          <div className={cn(baseClasses, "h-4 w-4/6")} />
        </div>
        <div className={cn(baseClasses, "h-10 w-24")} />
      </div>
    ),
    avatar: (
      <div className={cn("flex items-center space-x-3", className)}>
        <div className={cn(baseClasses, "h-12 w-12 rounded-full")} />
        <div className="space-y-2 flex-1">
          <div className={cn(baseClasses, "h-4 w-1/3")} />
          <div className={cn(baseClasses, "h-3 w-1/4")} />
        </div>
      </div>
    ),
    table: (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <div className={cn(baseClasses, "h-4 flex-1")} />
            <div className={cn(baseClasses, "h-4 w-20")} />
            <div className={cn(baseClasses, "h-4 w-16")} />
            <div className={cn(baseClasses, "h-4 w-12")} />
          </div>
        ))}
      </div>
    ),
    dashboard: (
      <div className={cn("space-y-6", className)}>
        {/* Header skeleton */}
        <div className="space-y-3">
          <div className={cn(baseClasses, "h-8 w-1/4")} />
          <div className={cn(baseClasses, "h-4 w-1/2")} />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className={cn(baseClasses, "h-4 w-1/2")} />
              <div className={cn(baseClasses, "h-8 w-3/4")} />
              <div className={cn(baseClasses, "h-3 w-1/3")} />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className={cn(baseClasses, "h-6 w-1/3")} />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={cn(baseClasses, "h-4 w-full")} />
              ))}
            </div>
          </div>
          <div className="space-y-4 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className={cn(baseClasses, "h-6 w-1/3")} />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={cn(baseClasses, "h-4 w-full")} />
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    list: (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className={cn(baseClasses, "h-10 w-10 rounded-full")} />
            <div className="flex-1 space-y-2">
              <div className={cn(baseClasses, "h-4 w-3/4")} />
              <div className={cn(baseClasses, "h-3 w-1/2")} />
            </div>
            <div className={cn(baseClasses, "h-8 w-16")} />
          </div>
        ))}
      </div>
    ),
    grid: (
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
          className
        )}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className={cn(baseClasses, "h-48 w-full rounded")} />
            <div className="space-y-2">
              <div className={cn(baseClasses, "h-5 w-3/4")} />
              <div className={cn(baseClasses, "h-4 w-full")} />
              <div className={cn(baseClasses, "h-4 w-5/6")} />
            </div>
            <div className={cn(baseClasses, "h-10 w-24")} />
          </div>
        ))}
      </div>
    ),
  };

  return variants[variant] || variants.text;
};

// Specific skeleton components for common use cases
export const SkeletonCard = ({ className = "" }) => (
  <SkeletonLoader variant="card" className={className} />
);

export const SkeletonAvatar = ({ className = "" }) => (
  <SkeletonLoader variant="avatar" className={className} />
);

export const SkeletonTable = ({ rows = 5, className = "" }) => (
  <SkeletonLoader variant="table" lines={rows} className={className} />
);

export const SkeletonDashboard = ({ className = "" }) => (
  <SkeletonLoader variant="dashboard" className={className} />
);

export const SkeletonList = ({ items = 5, className = "" }) => (
  <SkeletonLoader variant="list" lines={items} className={className} />
);

export const SkeletonGrid = ({ items = 6, className = "" }) => (
  <SkeletonLoader variant="grid" lines={items} className={className} />
);

// Loading state wrapper component
export const LoadingState = ({
  isLoading,
  children,
  skeleton = "text",
  skeletonProps = {},
  className = "",
}) => {
  if (isLoading) {
    return (
      <div className={className}>
        <SkeletonLoader variant={skeleton} {...skeletonProps} />
      </div>
    );
  }

  return children;
};

export default SkeletonLoader;
