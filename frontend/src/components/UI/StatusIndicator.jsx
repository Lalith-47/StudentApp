import React from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, Edit } from "lucide-react";

const StatusIndicator = ({ status, size = "sm", showText = true }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: CheckCircle,
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900",
          text: "Approved",
          borderColor: "border-green-200 dark:border-green-800"
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-100 dark:bg-red-900",
          text: "Rejected",
          borderColor: "border-red-200 dark:border-red-800"
        };
      case "pending":
        return {
          icon: Clock,
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-100 dark:bg-yellow-900",
          text: "Pending",
          borderColor: "border-yellow-200 dark:border-yellow-800"
        };
      case "under_review":
        return {
          icon: Edit,
          color: "text-blue-600 dark:text-blue-400",
          bgColor: "bg-blue-100 dark:bg-blue-900",
          text: "Under Review",
          borderColor: "border-blue-200 dark:border-blue-800"
        };
      case "requires_changes":
        return {
          icon: AlertCircle,
          color: "text-orange-600 dark:text-orange-400",
          bgColor: "bg-orange-100 dark:bg-orange-900",
          text: "Changes Required",
          borderColor: "border-orange-200 dark:border-orange-800"
        };
      default:
        return {
          icon: Clock,
          color: "text-gray-600 dark:text-gray-400",
          bgColor: "bg-gray-100 dark:bg-gray-900",
          text: "Unknown",
          borderColor: "border-gray-200 dark:border-gray-800"
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.bgColor} ${config.color} ${config.borderColor} border`}
    >
      <Icon className={`${iconSizes[size]} mr-1`} />
      {showText && config.text}
    </span>
  );
};

export default StatusIndicator;

