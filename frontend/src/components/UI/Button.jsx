import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";
import LoadingSpinner from "./LoadingSpinner";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  onClick,
  type = "button",
  animation = true,
  fullWidth = false,
  align = "center",
  ...props
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden",
    fullWidth && "w-full",
    align === "left" && "justify-start",
    align === "right" && "justify-end",
    align === "center" && "justify-center"
  );

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl hover:scale-105",
    secondary:
      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-primary-500 shadow-md hover:shadow-lg hover:scale-105",
    outline:
      "border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500 hover:scale-105",
    ghost:
      "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500 hover:scale-105",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl hover:scale-105",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl hover:scale-105",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[40px]",
    md: "px-4 py-2.5 text-sm min-h-[44px]",
    lg: "px-6 py-3 text-base min-h-[48px]",
    xl: "px-8 py-4 text-lg min-h-[52px]",
  };

  const MotionButton = motion.button;

  return (
    <MotionButton
      type={type}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={
        animation && !disabled && !loading
          ? {
              scale: 1.02,
              y: -2,
              transition: { duration: 0.2, ease: "easeOut" },
            }
          : {}
      }
      whileTap={
        animation && !disabled && !loading
          ? {
              scale: 0.98,
              transition: { duration: 0.1, ease: "easeIn" },
            }
          : {}
      }
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" text="" />}
      <motion.span
        className="relative z-10"
        initial={false}
        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
      >
        {children}
      </motion.span>
    </MotionButton>
  );
};

export default Button;
