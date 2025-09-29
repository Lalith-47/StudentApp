import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/helpers";

const ButtonGroup = ({
  children,
  orientation = "horizontal",
  spacing = "md",
  align = "start",
  className = "",
  ...props
}) => {
  const spacingClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const alignClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  const orientationClasses = {
    horizontal: "flex-row",
    vertical: "flex-col",
  };

  return (
    <motion.div
      className={cn(
        "flex",
        orientationClasses[orientation],
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Button Group Item Component
const ButtonGroupItem = ({ children, className = "", ...props }) => {
  return (
    <div className={cn("flex-shrink-0", className)} {...props}>
      {children}
    </div>
  );
};

ButtonGroup.Item = ButtonGroupItem;

export default ButtonGroup;
