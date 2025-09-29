import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const Card = ({
  children,
  className = "",
  hover = false,
  padding = "md",
  animation = "fadeIn",
  delay = 0,
  ...props
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const animations = {
    fadeIn: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, delay },
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, delay },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3, delay },
    },
  };

  const MotionCard = motion.div;

  return (
    <MotionCard
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-soft border border-gray-100 dark:border-gray-700",
        paddingClasses[padding],
        hover &&
          "transition-all duration-300 hover:shadow-lg hover:-translate-y-2 hover:scale-[1.02] cursor-pointer",
        className
      )}
      {...animations[animation]}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -4,
              transition: { duration: 0.2, ease: "easeOut" },
            }
          : {}
      }
      whileTap={
        hover
          ? {
              scale: 0.98,
              transition: { duration: 0.1, ease: "easeIn" },
            }
          : {}
      }
      {...props}
    >
      {children}
    </MotionCard>
  );
};

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={cn("mb-4", className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3
    className={cn(
      "text-lg font-semibold text-gray-900 dark:text-white",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p
    className={cn("text-sm text-gray-600 dark:text-gray-300 mt-1", className)}
    {...props}
  >
    {children}
  </p>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = "", ...props }) => (
  <div
    className={cn(
      "mt-4 pt-4 border-t border-gray-100 dark:border-gray-700",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
