const NodeCache = require("node-cache");

// Create cache instances for different data types
const analyticsCache = new NodeCache({
  stdTTL: 300, // 5 minutes for analytics data
  checkperiod: 60, // Check for expired keys every minute
  useClones: false,
});

const courseCache = new NodeCache({
  stdTTL: 600, // 10 minutes for course data
  checkperiod: 120,
});

const assignmentCache = new NodeCache({
  stdTTL: 300, // 5 minutes for assignment data
  checkperiod: 60,
});

const attendanceCache = new NodeCache({
  stdTTL: 180, // 3 minutes for attendance data
  checkperiod: 30,
});

const contentCache = new NodeCache({
  stdTTL: 900, // 15 minutes for content data
  checkperiod: 180,
});

const usersCache = new NodeCache({
  stdTTL: 600, // 10 minutes for user data
  checkperiod: 120,
});

const announcementsCache = new NodeCache({
  stdTTL: 300, // 5 minutes for announcement data
  checkperiod: 60,
});

// Cache middleware factory
const createCacheMiddleware = (cacheInstance, keyGenerator, ttl) => {
  return (req, res, next) => {
    const key = keyGenerator(req);

    // Try to get data from cache
    const cachedData = cacheInstance.get(key);
    if (cachedData) {
      return res.json({
        success: true,
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Store original res.json method
    const originalJson = res.json;

    // Override res.json to cache the response
    res.json = function (data) {
      if (data.success && data.data) {
        cacheInstance.set(key, data.data, ttl || cacheInstance.options.stdTTL);
      }
      return originalJson.call(this, data);
    };

    next();
  };
};

// Key generators for different endpoints
const generateAnalyticsKey = (req) => {
  const { facultyId, courseId, startDate, endDate } = req.params;
  const query = req.query;
  const userId = req.user?.id || "anonymous";
  const userRole = req.user?.role || "guest";
  return `analytics:${userRole}:${userId}:${facultyId || "all"}:${
    courseId || "all"
  }:${startDate || "all"}:${endDate || "all"}:${JSON.stringify(query)}`;
};

const generateCourseKey = (req) => {
  const { facultyId, id: userId, role: userRole } = req.user || {};
  const { courseId } = req.params;
  const query = req.query;
  return `course:${userRole || "guest"}:${userId || "anonymous"}:${
    facultyId || "all"
  }:${courseId || "list"}:${JSON.stringify(query)}`;
};

const generateAssignmentKey = (req) => {
  const { courseId, assignmentId } = req.params;
  const query = req.query;
  const userId = req.user?.id || "anonymous";
  const userRole = req.user?.role || "guest";
  return `assignment:${userRole}:${userId}:${courseId || "all"}:${
    assignmentId || "list"
  }:${JSON.stringify(query)}`;
};

const generateAttendanceKey = (req) => {
  const { courseId, attendanceId } = req.params;
  const query = req.query;
  const userId = req.user?.id || "anonymous";
  const userRole = req.user?.role || "guest";
  return `attendance:${userRole}:${userId}:${courseId || "all"}:${
    attendanceId || "list"
  }:${JSON.stringify(query)}`;
};

const generateContentKey = (req) => {
  const { facultyId, id: userId, role: userRole } = req.user || {};
  const { contentId } = req.params;
  const query = req.query;
  return `content:${userRole || "guest"}:${userId || "anonymous"}:${
    facultyId || "all"
  }:${contentId || "list"}:${JSON.stringify(query)}`;
};

const generateUserKey = (req) => {
  const { userId } = req.params;
  const query = req.query;
  const currentUserId = req.user?.id || "anonymous";
  const userRole = req.user?.role || "guest";
  return `users:${userRole}:${currentUserId}:${
    userId || "list"
  }:${JSON.stringify(query)}`;
};

const generateAnnouncementKey = (req) => {
  const { announcementId } = req.params;
  const query = req.query;
  const userId = req.user?.id || "anonymous";
  const userRole = req.user?.role || "guest";
  return `announcements:${userRole}:${userId}:${
    announcementId || "list"
  }:${JSON.stringify(query)}`;
};

// Cache middleware instances
const cacheAnalytics = createCacheMiddleware(
  analyticsCache,
  generateAnalyticsKey
);
const cacheCourses = createCacheMiddleware(courseCache, generateCourseKey);
const cacheAssignments = createCacheMiddleware(
  assignmentCache,
  generateAssignmentKey
);
const cacheAttendance = createCacheMiddleware(
  attendanceCache,
  generateAttendanceKey
);
const cacheContent = createCacheMiddleware(contentCache, generateContentKey);
const cacheUsers = createCacheMiddleware(usersCache, generateUserKey);
const cacheAnnouncements = createCacheMiddleware(
  announcementsCache,
  generateAnnouncementKey
);

// Cache invalidation functions
const invalidateCache = {
  analytics: (pattern) => {
    const keys = analyticsCache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        analyticsCache.del(key);
      }
    });
  },

  courses: (pattern) => {
    const keys = courseCache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        courseCache.del(key);
      }
    });
  },

  assignments: (pattern) => {
    const keys = assignmentCache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        assignmentCache.del(key);
      }
    });
  },

  attendance: (pattern) => {
    const keys = attendanceCache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        attendanceCache.del(key);
      }
    });
  },

  content: (pattern) => {
    const keys = contentCache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        contentCache.del(key);
      }
    });
  },

  users: (pattern) => {
    const keys = usersCache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        usersCache.del(key);
      }
    });
  },

  announcements: (pattern) => {
    const keys = announcementsCache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        announcementsCache.del(key);
      }
    });
  },

  all: () => {
    analyticsCache.flushAll();
    courseCache.flushAll();
    assignmentCache.flushAll();
    attendanceCache.flushAll();
    contentCache.flushAll();
    usersCache.flushAll();
    announcementsCache.flushAll();
  },
};

// Cache statistics
const getCacheStats = () => {
  return {
    analytics: {
      keys: analyticsCache.keys().length,
      hits: analyticsCache.getStats().hits,
      misses: analyticsCache.getStats().misses,
      ksize: analyticsCache.getStats().ksize,
      vsize: analyticsCache.getStats().vsize,
    },
    courses: {
      keys: courseCache.keys().length,
      hits: courseCache.getStats().hits,
      misses: courseCache.getStats().misses,
      ksize: courseCache.getStats().ksize,
      vsize: courseCache.getStats().vsize,
    },
    assignments: {
      keys: assignmentCache.keys().length,
      hits: assignmentCache.getStats().hits,
      misses: assignmentCache.getStats().misses,
      ksize: assignmentCache.getStats().ksize,
      vsize: assignmentCache.getStats().vsize,
    },
    attendance: {
      keys: attendanceCache.keys().length,
      hits: attendanceCache.getStats().hits,
      misses: attendanceCache.getStats().misses,
      ksize: attendanceCache.getStats().ksize,
      vsize: attendanceCache.getStats().vsize,
    },
    content: {
      keys: contentCache.keys().length,
      hits: contentCache.getStats().hits,
      misses: contentCache.getStats().misses,
      ksize: contentCache.getStats().ksize,
      vsize: contentCache.getStats().vsize,
    },
  };
};

// Preload frequently accessed data
const preloadCache = async () => {
  try {
    // This would typically preload common analytics data
    // Implementation depends on your specific use cases
    console.log("Cache preloading completed");
  } catch (error) {
    console.error("Cache preloading failed:", error);
  }
};

// Cache health check
const checkCacheHealth = () => {
  const stats = getCacheStats();
  const totalKeys = Object.values(stats).reduce(
    (sum, cache) => sum + cache.keys,
    0
  );
  const totalHits = Object.values(stats).reduce(
    (sum, cache) => sum + cache.hits,
    0
  );
  const totalMisses = Object.values(stats).reduce(
    (sum, cache) => sum + cache.misses,
    0
  );

  const hitRate =
    totalHits + totalMisses > 0
      ? (totalHits / (totalHits + totalMisses)) * 100
      : 0;

  return {
    healthy: hitRate > 50, // Consider cache healthy if hit rate > 50%
    hitRate: Math.round(hitRate * 100) / 100,
    totalKeys,
    stats,
  };
};

module.exports = {
  cacheAnalytics,
  cacheUsers,
  cacheCourses,
  cacheAssignments,
  cacheAttendance,
  cacheContent,
  cacheAnnouncements,
  invalidateCache,
  getCacheStats,
  preloadCache,
  checkCacheHealth,
  analyticsCache,
  usersCache,
  courseCache,
  assignmentCache,
  attendanceCache,
  contentCache,
  announcementsCache,
};
