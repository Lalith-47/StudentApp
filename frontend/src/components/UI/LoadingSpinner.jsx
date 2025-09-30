import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const LoadingSpinner = ({
  size = "md",
  className = "",
  text = "Loading...",
  variant = "spinner",
  color = "primary",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const colorClasses = {
    primary: "border-primary-600",
    white: "border-white",
    gray: "border-gray-600",
  };

  if (variant === "dots") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full bg-primary-600",
                colorClasses[color]
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className="mt-4 text-sm text-gray-600 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className
        )}
      >
        <motion.div
          className={cn("rounded-full bg-primary-600", sizeClasses[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {text && (
          <motion.p
            className="mt-4 text-sm text-gray-600 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-8", className)}
    >
      <motion.div
        className={cn(
          "rounded-full border-2 border-gray-300",
          colorClasses[color],
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          borderTopColor: "transparent",
        }}
      />
      {text && (
        <motion.p
          className="mt-4 text-sm text-gray-600 animate-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
