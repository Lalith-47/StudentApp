import React, { useState, useRef } from "react";
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
  ripple = true,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const createRipple = (event) => {
    if (!ripple || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleClick = (event) => {
    createRipple(event);
    if (onClick && !disabled && !loading) {
      onClick(event);
    }
  };

  const baseClasses = cn(
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden touch-manipulation",
    fullWidth && "w-full",
    align === "left" && "justify-start",
    align === "right" && "justify-end",
    align === "center" && "justify-center"
  );

  const variants = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl active:scale-95",
    secondary:
      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-primary-500 shadow-md hover:shadow-lg active:scale-95",
    outline:
      "border-2 border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500 active:scale-95",
    ghost:
      "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-gray-500 active:scale-95",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl active:scale-95",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl active:scale-95",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[44px] min-w-[44px]", // Touch-friendly minimum size
    md: "px-4 py-2.5 text-sm min-h-[48px] min-w-[48px]",
    lg: "px-6 py-3 text-base min-h-[52px] min-w-[52px]",
    xl: "px-8 py-4 text-lg min-h-[56px] min-w-[56px]",
  };

  const MotionButton = motion.button;

  return (
    <MotionButton
      ref={buttonRef}
      type={type}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      onClick={handleClick}
      whileHover={
        animation && !disabled && !loading
          ? {
              scale: 1.02,
              y: -1,
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
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute pointer-events-none bg-white/30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {loading && <LoadingSpinner size="sm" className="mr-2" text="" />}
      <motion.span
        className="relative z-10 flex items-center justify-center"
        initial={false}
        animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
      >
        {children}
      </motion.span>
    </MotionButton>
  );
};

export default Button;
