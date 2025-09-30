// Performance optimization utilities

// Image lazy loading utility
export const lazyLoadImage = (src, placeholder = "/placeholder.jpg") => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => resolve(placeholder);
    img.src = src;
  });
};

// Debounce utility for search and input optimization
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility for scroll and resize events
export const throttle = (func, limit) => {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Virtual scrolling utility for large lists
export const virtualScroll = (
  items,
  containerHeight,
  itemHeight,
  scrollTop
) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  return {
    visibleItems: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
    totalHeight: items.length * itemHeight,
    offsetY: startIndex * itemHeight,
  };
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ("memory" in performance) {
    return {
      used:
        Math.round((performance.memory.usedJSHeapSize / 1048576) * 100) / 100,
      total:
        Math.round((performance.memory.totalJSHeapSize / 1048576) * 100) / 100,
      limit:
        Math.round((performance.memory.jsHeapSizeLimit / 1048576) * 100) / 100,
    };
  }
  return null;
};

// Performance metrics collection
export const collectPerformanceMetrics = () => {
  const metrics = {};

  // Navigation timing
  if (performance.timing) {
    const timing = performance.timing;
    metrics.navigation = {
      domContentLoaded:
        timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      firstPaint: performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-paint")?.startTime,
      firstContentfulPaint: performance
        .getEntriesByType("paint")
        .find((entry) => entry.name === "first-contentful-paint")?.startTime,
    };
  }

  // Resource timing
  const resources = performance.getEntriesByType("resource");
  metrics.resources = {
    total: resources.length,
    averageLoadTime:
      resources.reduce((sum, resource) => sum + resource.duration, 0) /
      resources.length,
    slowestResource: resources.reduce(
      (max, resource) => (resource.duration > max.duration ? resource : max),
      resources[0]
    ),
  };

  // Memory usage
  metrics.memory = getMemoryUsage();

  return metrics;
};

// Bundle size optimization helper
export const preloadCriticalResources = () => {
  const criticalResources = [
    "/src/components/UI/Button.jsx",
    "/src/components/UI/Card.jsx",
    "/src/components/Layout/Navbar.jsx",
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "modulepreload";
    link.href = resource;
    document.head.appendChild(link);
  });
};

// Cache optimization
export const createCache = (maxSize = 100) => {
  const cache = new Map();

  return {
    get: (key) => cache.get(key),
    set: (key, value) => {
      if (cache.size >= maxSize) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      cache.set(key, value);
    },
    clear: () => cache.clear(),
    size: () => cache.size,
  };
};

// API request optimization
export const optimizeApiRequests = {
  // Request deduplication
  pendingRequests: new Map(),

  deduplicate: (key, requestFn) => {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  },

  // Request batching
  batchRequests: (requests, delay = 50) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        Promise.all(requests).then(resolve);
      }, delay);
    });
  },
};

export default {
  lazyLoadImage,
  debounce,
  throttle,
  virtualScroll,
  getMemoryUsage,
  collectPerformanceMetrics,
  preloadCriticalResources,
  createCache,
  optimizeApiRequests,
};
