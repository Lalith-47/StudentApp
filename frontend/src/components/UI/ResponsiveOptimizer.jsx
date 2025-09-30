import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Hook to detect device type and screen size
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isTouch: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

      setScreenSize({
        width,
        height,
        isMobile,
        isTablet,
        isDesktop,
        isTouch,
      });
    };

    handleResize(); // Set initial values
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return screenSize;
};

// Component to optimize performance based on device
const ResponsiveOptimizer = ({ children, className = "" }) => {
  const { isMobile, isTablet, isDesktop, isTouch } = useResponsive();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Delay rendering on mobile to improve initial load performance
    if (isMobile) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, [isMobile]);

  // Reduce animations on mobile for better performance
  const animationProps = isMobile
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, ease: "easeOut" },
      };

  if (!isLoaded) {
    return (
      <div
        className={`min-h-[200px] flex items-center justify-center ${className}`}
      >
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      {...animationProps}
      className={`${className} ${isMobile ? "touch-manipulation" : ""}`}
      style={{
        // Optimize for touch devices
        touchAction: isTouch ? "manipulation" : "auto",
        // Improve scrolling performance
        willChange: isMobile ? "transform" : "auto",
      }}
    >
      {children}
    </motion.div>
  );
};

// Responsive grid component that adapts to screen size
export const ResponsiveGrid = ({
  children,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = 4,
  className = "",
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const getGridCols = () => {
    if (isMobile) return mobileCols;
    if (isTablet) return tabletCols;
    return desktopCols;
  };

  const gridCols = getGridCols();

  return (
    <div
      className={`grid gap-${gap} ${className}`}
      style={{
        gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

// Responsive container that adapts padding and margins
export const ResponsiveContainer = ({
  children,
  className = "",
  padding = true,
  maxWidth = true,
}) => {
  const { isMobile, isTablet } = useResponsive();

  const containerClasses = [
    className,
    padding && (isMobile ? "px-4" : isTablet ? "px-6" : "px-8"),
    maxWidth && "mx-auto",
    maxWidth &&
      (isMobile ? "max-w-full" : isTablet ? "max-w-6xl" : "max-w-7xl"),
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={containerClasses}>{children}</div>;
};

// Responsive text component that scales with screen size
export const ResponsiveText = ({
  children,
  mobile = "text-sm",
  tablet = "text-base",
  desktop = "text-lg",
  className = "",
}) => {
  const { isMobile, isTablet } = useResponsive();

  const getTextSize = () => {
    if (isMobile) return mobile;
    if (isTablet) return tablet;
    return desktop;
  };

  return <span className={`${getTextSize()} ${className}`}>{children}</span>;
};

// Responsive button component that adapts size for touch devices
export const ResponsiveButton = ({
  children,
  className = "",
  touchOptimized = true,
  ...props
}) => {
  const { isMobile, isTouch } = useResponsive();

  const buttonClasses = [
    className,
    touchOptimized &&
      (isMobile || isTouch) &&
      "min-h-[44px] min-w-[44px] text-base",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

// Hook to optimize images based on device
export const useOptimizedImage = (src, options = {}) => {
  const { isMobile, isTablet } = useResponsive();

  const {
    mobileWidth = 400,
    tabletWidth = 600,
    desktopWidth = 800,
    quality = 80,
    format = "webp",
  } = options;

  const getOptimizedSrc = () => {
    if (!src) return src;

    // If it's already an optimized URL or external URL, return as is
    if (src.startsWith("http") && !src.includes("w_")) {
      return src;
    }

    // For local images or unsplash images, we can add optimization parameters
    if (src.includes("unsplash.com")) {
      const width = isMobile
        ? mobileWidth
        : isTablet
        ? tabletWidth
        : desktopWidth;
      const separator = src.includes("?") ? "&" : "?";
      return `${src}${separator}w=${width}&q=${quality}&fm=${format}`;
    }

    return src;
  };

  return getOptimizedSrc();
};

// Component to lazy load content based on device performance
export const LazyResponsiveContent = ({
  children,
  fallback = null,
  threshold = 0.1,
  className = "",
}) => {
  const { isMobile } = useResponsive();
  const [isInView, setIsInView] = useState(!isMobile); // Load immediately on desktop

  const observerRef = React.useRef();

  useEffect(() => {
    if (isMobile) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold }
      );

      observerRef.current = observer;
      return () => observer.disconnect();
    }
  }, [isMobile, threshold]);

  const ref = React.useCallback(
    (node) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (node && isMobile) {
        observerRef.current.observe(node);
      }
    },
    [isMobile]
  );

  return (
    <div ref={ref} className={className}>
      {isInView ? children : fallback}
    </div>
  );
};

export default ResponsiveOptimizer;
