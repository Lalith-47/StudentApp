import React, { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const LazySection = ({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "0px 0px -100px 0px",
  fallback = null,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, {
    threshold,
    rootMargin,
    once: true,
  });

  useEffect(() => {
    if (isInView && !isLoaded) {
      // Add a small delay to ensure smooth loading
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInView, isLoaded]);

  return (
    <div ref={ref} className={className}>
      {isLoaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : (
        fallback || (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LazySection;
