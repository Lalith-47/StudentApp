const NodeCache = require("node-cache");

// Create cache instances for different data types
const caches = {
  // Short-term cache for frequently accessed data (5 minutes)
  shortTerm: new NodeCache({ stdTTL: 300 }),

  // Medium-term cache for moderately accessed data (30 minutes)
  mediumTerm: new NodeCache({ stdTTL: 1800 }),

  // Long-term cache for rarely changing data (2 hours)
  longTerm: new NodeCache({ stdTTL: 7200 }),

  // User-specific cache (15 minutes)
  userSpecific: new NodeCache({ stdTTL: 900 }),
};

// Cache middleware factory
const createCacheMiddleware = (
  cacheType = "shortTerm",
  keyGenerator = null
) => {
  const cache = caches[cacheType];

  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator
      ? keyGenerator(req)
      : `${req.originalUrl}:${JSON.stringify(req.query)}:${
          req.user?.id || "anonymous"
        }`;

    // Try to get from cache
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      // Add cache hit header
      res.set("X-Cache", "HIT");
      return res.json(cachedData);
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache the response
    res.json = function (data) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          cache.set(cacheKey, data);
          res.set("X-Cache", "MISS");
        } catch (error) {
          console.error("Cache set error:", error);
          res.set("X-Cache", "ERROR");
        }
      }

      return originalJson.call(this, data);
    };

    next();
  };
};

// Specific cache middlewares
const cacheMiddleware = {
  // Dashboard data (medium term)
  dashboard: createCacheMiddleware(
    "mediumTerm",
    (req) => `dashboard:${req.user?.role}:${req.user?.id}`
  ),

  // User data (short term)
  users: createCacheMiddleware(
    "shortTerm",
    (req) => `users:${JSON.stringify(req.query)}`
  ),

  // Course data (long term - rarely changes)
  courses: createCacheMiddleware(
    "longTerm",
    (req) => `courses:${JSON.stringify(req.query)}`
  ),

  // Assignment data (short term)
  assignments: createCacheMiddleware(
    "shortTerm",
    (req) => `assignments:${req.user?.id}:${JSON.stringify(req.query)}`
  ),

  // Analytics data (medium term)
  analytics: createCacheMiddleware(
    "mediumTerm",
    (req) =>
      `analytics:${req.user?.role}:${req.user?.id}:${JSON.stringify(req.query)}`
  ),

  // System settings (long term)
  settings: createCacheMiddleware("longTerm", () => "system:settings"),

  // Audit logs (short term)
  auditLogs: createCacheMiddleware(
    "shortTerm",
    (req) => `audit-logs:${JSON.stringify(req.query)}`
  ),
};

// Cache invalidation helpers
const cacheInvalidation = {
  // Invalidate user-related caches
  invalidateUser: (userId, role) => {
    const patterns = [
      `dashboard:${role}:${userId}`,
      `assignments:${userId}:*`,
      `analytics:${role}:${userId}:*`,
    ];

    patterns.forEach((pattern) => {
      Object.values(caches).forEach((cache) => {
        const keys = cache.keys();
        keys.forEach((key) => {
          if (key.includes(pattern.replace("*", ""))) {
            cache.del(key);
          }
        });
      });
    });
  },

  // Invalidate course-related caches
  invalidateCourses: () => {
    Object.values(caches).forEach((cache) => {
      const keys = cache.keys();
      keys.forEach((key) => {
        if (key.includes("courses:")) {
          cache.del(key);
        }
      });
    });
  },

  // Invalidate assignment-related caches
  invalidateAssignments: (courseId = null) => {
    Object.values(caches).forEach((cache) => {
      const keys = cache.keys();
      keys.forEach((key) => {
        if (key.includes("assignments:")) {
          if (!courseId || key.includes(courseId)) {
            cache.del(key);
          }
        }
      });
    });
  },

  // Invalidate system settings
  invalidateSettings: () => {
    Object.values(caches).forEach((cache) => {
      cache.del("system:settings");
    });
  },

  // Clear all caches (for testing or maintenance)
  clearAll: () => {
    Object.values(caches).forEach((cache) => {
      cache.flushAll();
    });
  },

  // Get cache statistics
  getStats: () => {
    const stats = {};
    Object.entries(caches).forEach(([name, cache]) => {
      stats[name] = cache.getStats();
    });
    return stats;
  },
};

// Cache warming functions
const cacheWarming = {
  // Warm up frequently accessed data
  warmUpDashboard: async (userId, role) => {
    // This would be called during user login or periodically
    // Implementation would depend on your dashboard data fetching logic
  },

  // Warm up system settings
  warmUpSettings: async () => {
    // Pre-load system settings into cache
  },
};

module.exports = {
  caches,
  cacheMiddleware,
  cacheInvalidation,
  cacheWarming,
  createCacheMiddleware,
};
