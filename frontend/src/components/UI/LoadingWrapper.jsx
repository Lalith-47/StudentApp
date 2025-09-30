import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";
import LoadingSpinner from "./LoadingSpinner";
import SkeletonLoader, {
  SkeletonCard,
  SkeletonDashboard,
  SkeletonList,
  SkeletonGrid,
  SkeletonTable,
  LoadingState,
} from "./SkeletonLoader";

const LoadingWrapper = ({
  isLoading,
  children,
  loadingType = "spinner", // spinner, skeleton, custom
  skeletonVariant = "text",
  skeletonProps = {},
  loadingText = "Loading...",
  loadingSize = "md",
  loadingColor = "primary",
  className = "",
  minHeight = "200px",
  error = null,
  onRetry = null,
  emptyState = null,
  showEmptyState = false,
}) => {
  // Error state
  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
        style={{ minHeight }}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {typeof error === "string" ? error : "An unexpected error occurred"}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Empty state
  if (showEmptyState && !isLoading) {
    if (emptyState) {
      return (
        <div
          className={cn(
            "flex flex-col items-center justify-center p-8",
            className
          )}
          style={{ minHeight }}
        >
          {emptyState}
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
        style={{ minHeight }}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No data available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There's nothing to show here yet.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn("flex flex-col items-center justify-center", className)}
        style={{ minHeight }}
      >
        {loadingType === "spinner" && (
          <LoadingSpinner
            size={loadingSize}
            text={loadingText}
            color={loadingColor}
            variant="spinner"
          />
        )}

        {loadingType === "skeleton" && (
          <div className="w-full max-w-4xl mx-auto p-4">
            <SkeletonLoader variant={skeletonVariant} {...skeletonProps} />
          </div>
        )}

        {loadingType === "custom" && children}
      </div>
    );
  }

  // Content state
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Specialized loading wrappers for different use cases
export const PortalLoadingWrapper = ({
  isLoading,
  children,
  error,
  onRetry,
}) => (
  <LoadingWrapper
    isLoading={isLoading}
    loadingType="skeleton"
    skeletonVariant="dashboard"
    className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
    error={error}
    onRetry={onRetry}
  >
    {children}
  </LoadingWrapper>
);

export const CardLoadingWrapper = ({ isLoading, children, error, onRetry }) => (
  <LoadingWrapper
    isLoading={isLoading}
    loadingType="skeleton"
    skeletonVariant="card"
    className="w-full"
    error={error}
    onRetry={onRetry}
  >
    {children}
  </LoadingWrapper>
);

export const ListLoadingWrapper = ({
  isLoading,
  children,
  error,
  onRetry,
  items = 5,
}) => (
  <LoadingWrapper
    isLoading={isLoading}
    loadingType="skeleton"
    skeletonVariant="list"
    skeletonProps={{ lines: items }}
    className="w-full"
    error={error}
    onRetry={onRetry}
  >
    {children}
  </LoadingWrapper>
);

export const GridLoadingWrapper = ({
  isLoading,
  children,
  error,
  onRetry,
  items = 6,
}) => (
  <LoadingWrapper
    isLoading={isLoading}
    loadingType="skeleton"
    skeletonVariant="grid"
    skeletonProps={{ lines: items }}
    className="w-full"
    error={error}
    onRetry={onRetry}
  >
    {children}
  </LoadingWrapper>
);

export const TableLoadingWrapper = ({
  isLoading,
  children,
  error,
  onRetry,
  rows = 5,
}) => (
  <LoadingWrapper
    isLoading={isLoading}
    loadingType="skeleton"
    skeletonVariant="table"
    skeletonProps={{ lines: rows }}
    className="w-full"
    error={error}
    onRetry={onRetry}
  >
    {children}
  </LoadingWrapper>
);

export default LoadingWrapper;
