import React from "react";
import { cn } from "../../utils/helpers";

const Grid = ({
  children,
  cols = 1,
  gap = "md",
  className = "",
  responsive = true,
  ...props
}) => {
  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const getGridCols = (cols) => {
    if (typeof cols === "number") {
      return `grid-cols-${cols}`;
    }
    if (typeof cols === "object") {
      const { sm, md, lg, xl } = cols;
      return cn(
        sm && `grid-cols-${sm}`,
        md && `md:grid-cols-${md}`,
        lg && `lg:grid-cols-${lg}`,
        xl && `xl:grid-cols-${xl}`
      );
    }
    return "grid-cols-1";
  };

  return (
    <div
      className={cn(
        "grid",
        getGridCols(cols),
        gapClasses[gap],
        responsive &&
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const GridItem = ({ children, className = "", span = 1, ...props }) => {
  const getSpanClass = (span) => {
    if (typeof span === "number") {
      return `col-span-${span}`;
    }
    if (typeof span === "object") {
      const { sm, md, lg, xl } = span;
      return cn(
        sm && `col-span-${sm}`,
        md && `md:col-span-${md}`,
        lg && `lg:col-span-${lg}`,
        xl && `xl:col-span-${xl}`
      );
    }
    return "col-span-1";
  };

  return (
    <div className={cn(getSpanClass(span), className)} {...props}>
      {children}
    </div>
  );
};

Grid.Item = GridItem;

export default Grid;
