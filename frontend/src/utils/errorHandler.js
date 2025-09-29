import toast from "react-hot-toast";

// Error types for better error handling
export const ERROR_TYPES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

// Error messages mapping
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]:
    "Network connection failed. Please check your internet connection.",
  [ERROR_TYPES.AUTHENTICATION_ERROR]:
    "Authentication failed. Please login again.",
  [ERROR_TYPES.AUTHORIZATION_ERROR]:
    "You do not have permission to perform this action.",
  [ERROR_TYPES.VALIDATION_ERROR]: "Please check your input and try again.",
  [ERROR_TYPES.SERVER_ERROR]: "Server error occurred. Please try again later.",
  [ERROR_TYPES.TIMEOUT_ERROR]: "Request timed out. Please try again.",
  [ERROR_TYPES.UNKNOWN_ERROR]:
    "An unexpected error occurred. Please try again.",
};

// Determine error type from axios error
export const getErrorType = (error) => {
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return ERROR_TYPES.TIMEOUT_ERROR;
    }
    if (
      error.message.includes("Network Error") ||
      error.message.includes("ERR_NETWORK")
    ) {
      return ERROR_TYPES.NETWORK_ERROR;
    }
    return ERROR_TYPES.UNKNOWN_ERROR;
  }

  const status = error.response.status;

  switch (status) {
    case 401:
      return ERROR_TYPES.AUTHENTICATION_ERROR;
    case 403:
      return ERROR_TYPES.AUTHORIZATION_ERROR;
    case 400:
    case 422:
      return ERROR_TYPES.VALIDATION_ERROR;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER_ERROR;
    default:
      return ERROR_TYPES.UNKNOWN_ERROR;
  }
};

// Get user-friendly error message
export const getErrorMessage = (error) => {
  const errorType = getErrorType(error);

  // Try to get specific error message from response
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (
    error.response?.data?.errors &&
    Array.isArray(error.response.data.errors)
  ) {
    return error.response.data.errors.join(", ");
  }

  return ERROR_MESSAGES[errorType];
};

// Handle API errors with appropriate user feedback
export const handleApiError = (error, options = {}) => {
  const {
    showToast = true,
    logError = true,
    redirectOnAuth = true,
    customMessage = null,
  } = options;

  const errorType = getErrorType(error);
  const errorMessage = customMessage || getErrorMessage(error);

  // Log error for debugging
  if (logError) {
    console.error("API Error:", {
      type: errorType,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }

  // Show toast notification
  if (showToast) {
    const toastOptions = {
      duration: errorType === ERROR_TYPES.VALIDATION_ERROR ? 6000 : 4000,
      style: {
        background:
          errorType === ERROR_TYPES.AUTHENTICATION_ERROR
            ? "#ef4444"
            : "#f59e0b",
        color: "#fff",
      },
    };

    toast.error(errorMessage, toastOptions);
  }

  // Handle authentication errors
  if (errorType === ERROR_TYPES.AUTHENTICATION_ERROR && redirectOnAuth) {
    // Clear auth data
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    // Redirect to login after a short delay
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }

  return {
    type: errorType,
    message: errorMessage,
    status: error.response?.status,
    data: error.response?.data,
  };
};

// Retry mechanism for failed requests
export const withRetry = (apiCall, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall(...args);
      } catch (error) {
        lastError = error;

        // Don't retry for certain error types
        const errorType = getErrorType(error);
        if (
          [
            ERROR_TYPES.AUTHENTICATION_ERROR,
            ERROR_TYPES.AUTHORIZATION_ERROR,
            ERROR_TYPES.VALIDATION_ERROR,
          ].includes(errorType)
        ) {
          throw error;
        }

        // Wait before retrying
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw lastError;
  };
};

// Debounced error handler to prevent spam
let errorTimeout;
export const debouncedErrorHandler = (error, options = {}) => {
  clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => {
    handleApiError(error, options);
  }, 300);
};

// Error boundary helper for async operations
export const withErrorBoundary = (asyncFunction) => {
  return async (...args) => {
    try {
      return await asyncFunction(...args);
    } catch (error) {
      const errorInfo = handleApiError(error, { showToast: false });

      // Re-throw with additional context for error boundary
      const enhancedError = new Error(errorInfo.message);
      enhancedError.errorInfo = errorInfo;
      enhancedError.originalError = error;

      throw enhancedError;
    }
  };
};

// Validation error formatter
export const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.map((error) => error.message || error).join(", ");
  }

  if (typeof errors === "object") {
    return Object.values(errors).flat().join(", ");
  }

  return String(errors);
};

// Network status checker
export const checkNetworkStatus = () => {
  return navigator.onLine;
};

// Offline handler
export const handleOfflineError = () => {
  toast.error("You are offline. Please check your internet connection.", {
    duration: 6000,
    style: {
      background: "#ef4444",
      color: "#fff",
    },
  });
};

// Online handler
export const handleOnlineStatus = () => {
  toast.success("Connection restored!", {
    duration: 3000,
    style: {
      background: "#10b981",
      color: "#fff",
    },
  });
};

// Setup network status listeners
export const setupNetworkListeners = () => {
  window.addEventListener("online", handleOnlineStatus);
  window.addEventListener("offline", handleOfflineError);

  return () => {
    window.removeEventListener("online", handleOnlineStatus);
    window.removeEventListener("offline", handleOfflineError);
  };
};
