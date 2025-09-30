import React, { createContext, useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colors = {
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200",
    error:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200",
  };

  const Icon = icons[toast.type];

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onRemove]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`relative max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 ${
        colors[toast.type]
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-3 flex-1">
          {toast.title && <p className="text-sm font-medium">{toast.title}</p>}
          <p className="text-sm mt-1">{toast.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => onRemove(toast.id)}
            className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-current opacity-30 rounded-b-lg overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: toast.duration / 1000, ease: "linear" }}
            className="h-full bg-current"
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      id,
      type: "info",
      duration: 5000,
      ...toast,
    };
    setToasts((prev) => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const toast = {
    success: (message, options = {}) =>
      addToast({ type: "success", message, ...options }),
    error: (message, options = {}) =>
      addToast({ type: "error", message, ...options }),
    warning: (message, options = {}) =>
      addToast({ type: "warning", message, ...options }),
    info: (message, options = {}) =>
      addToast({ type: "info", message, ...options }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <AnimatePresence>
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      </AnimatePresence>
    </ToastContext.Provider>
  );
};

export default Toast;
