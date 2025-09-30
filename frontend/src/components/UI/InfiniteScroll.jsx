import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const InfiniteScroll = ({
  children,
  hasMore = true,
  loadMore = () => {},
  loading = false,
  threshold = 200,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  const handleObserver = useCallback(
    (entries) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && !isLoading) {
        setIsLoading(true);
        loadMore().finally(() => {
          setIsLoading(false);
        });
      }
    },
    [hasMore, loading, isLoading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div className={className}>
      {children}

      {/* Loading Sentinel */}
      <div ref={sentinelRef} className="h-10 flex items-center justify-center">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2 text-gray-500"
          >
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm">Loading more...</span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScroll;
