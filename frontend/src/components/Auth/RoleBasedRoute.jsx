import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Loader2 } from "lucide-react";

const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  fallbackPath = "/dashboard",
  showAccessDenied = true,
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Checking permissions...
          </p>
        </motion.div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  const hasPermission =
    allowedRoles.length === 0 || allowedRoles.includes(user?.role);

  if (!hasPermission) {
    if (showAccessDenied) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto p-8"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You don't have permission to access this page. This area is
              restricted to{" "}
              {allowedRoles.map((role, index) => (
                <span key={role}>
                  <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {role}s
                  </span>
                  {index < allowedRoles.length - 1 && " and "}
                </span>
              ))}
              .
            </p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => (window.location.href = fallbackPath)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      );
    }

    return <Navigate to={fallbackPath} replace />;
  }

  // User has permission, render the protected content
  return children;
};

// Higher-order component for protecting admin routes
export const withAdminAuth = (Component) => {
  return (props) => (
    <RoleBasedRoute allowedRoles={["admin"]}>
      <Component {...props} />
    </RoleBasedRoute>
  );
};

// Higher-order component for protecting faculty routes
export const withFacultyAuth = (Component) => {
  return (props) => (
    <RoleBasedRoute allowedRoles={["faculty", "admin"]}>
      <Component {...props} />
    </RoleBasedRoute>
  );
};

// Higher-order component for protecting student routes
export const withStudentAuth = (Component) => {
  return (props) => (
    <RoleBasedRoute allowedRoles={["student", "faculty", "admin"]}>
      <Component {...props} />
    </RoleBasedRoute>
  );
};

// Component for role-based content rendering
export const RoleBasedContent = ({
  allowedRoles = [],
  children,
  fallback = null,
}) => {
  const { user } = useAuth();

  const hasPermission =
    allowedRoles.length === 0 || allowedRoles.includes(user?.role);

  return hasPermission ? children : fallback;
};

export default RoleBasedRoute;
