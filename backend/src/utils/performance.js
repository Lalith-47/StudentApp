const mongoose = require("mongoose");

// Performance monitoring utilities
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.startTimes = new Map();
  }

  startTimer(operation) {
    this.startTimes.set(operation, Date.now());
  }

  endTimer(operation) {
    const startTime = this.startTimes.get(operation);
    if (!startTime) return null;

    const duration = Date.now() - startTime;
    this.startTimes.delete(operation);

    // Store metric
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    this.metrics.get(operation).push(duration);

    return duration;
  }

  getAverageTime(operation) {
    const times = this.metrics.get(operation);
    if (!times || times.length === 0) return 0;

    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getMetrics() {
    const result = {};
    for (const [operation, times] of this.metrics) {
      result[operation] = {
        count: times.length,
        average: this.getAverageTime(operation),
        min: Math.min(...times),
        max: Math.max(...times),
        total: times.reduce((sum, time) => sum + time, 0),
      };
    }
    return result;
  }

  reset() {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

// Global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Query optimization utilities
class QueryOptimizer {
  static optimizeActivityQuery(filters = {}) {
    const query = {};
    const options = {
      lean: true, // Return plain objects instead of Mongoose documents
      limit: Math.min(filters.limit || 10, 100), // Cap at 100
      skip: (filters.page - 1) * (filters.limit || 10) || 0,
      sort: this.getSortOptions(filters.sortBy, filters.sortOrder),
    };

    // Build query efficiently
    if (filters.studentId) {
      query.studentId = new mongoose.Types.ObjectId(filters.studentId);
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      query.startDate = {};
      if (filters.startDate) {
        query.startDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.startDate.$lte = new Date(filters.endDate);
      }
    }

    // Text search optimization
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    return { query, options };
  }

  static getSortOptions(sortBy, sortOrder) {
    const validSortFields = {
      createdAt: 1,
      updatedAt: 1,
      title: 1,
      startDate: 1,
      endDate: 1,
      status: 1,
    };

    const field = validSortFields[sortBy] ? sortBy : "createdAt";
    const order = sortOrder === "asc" ? 1 : -1;

    return { [field]: order };
  }

  static optimizeAggregationPipeline() {
    return [
      // Use $match early to reduce documents
      { $match: { status: { $in: ["approved", "pending"] } } },

      // Use $project to limit fields
      {
        $project: {
          title: 1,
          category: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          studentId: 1,
          createdAt: 1,
          // Exclude large fields
          description: { $substr: ["$description", 0, 100] },
          attachments: { $size: "$attachments" },
        },
      },

      // Use $lookup efficiently
      {
        $lookup: {
          from: "users",
          localField: "studentId",
          foreignField: "_id",
          as: "student",
          pipeline: [{ $project: { name: 1, email: 1 } }],
        },
      },

      // Unwind and project
      { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },

      // Final projection
      {
        $project: {
          title: 1,
          category: 1,
          status: 1,
          startDate: 1,
          endDate: 1,
          student: 1,
          createdAt: 1,
          attachmentCount: "$attachments",
        },
      },
    ];
  }
}

// Caching utilities
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttl);
  }

  get(key) {
    const expiry = this.ttl.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
  }

  clear() {
    this.cache.clear();
    this.ttl.clear();
  }

  // Generate cache key for queries
  generateKey(prefix, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}:${params[key]}`)
      .join("|");
    return `${prefix}:${sortedParams}`;
  }
}

// Global cache manager
const cacheManager = new CacheManager();

// Database connection optimization
class DatabaseOptimizer {
  static async createIndexes() {
    const db = mongoose.connection.db;

    try {
      // User indexes
      await db.collection("users").createIndex({ email: 1 }, { unique: true });
      await db.collection("users").createIndex({ role: 1 });
      await db.collection("users").createIndex({ isActive: 1 });
      await db.collection("users").createIndex({ createdAt: -1 });

      // Activity indexes
      await db.collection("activities").createIndex({ studentId: 1 });
      await db.collection("activities").createIndex({ status: 1 });
      await db.collection("activities").createIndex({ category: 1 });
      await db.collection("activities").createIndex({ startDate: 1 });
      await db.collection("activities").createIndex({ createdAt: -1 });
      await db
        .collection("activities")
        .createIndex({ studentId: 1, status: 1 });
      await db
        .collection("activities")
        .createIndex({ studentId: 1, category: 1 });
      await db
        .collection("activities")
        .createIndex({ status: 1, createdAt: -1 });

      // Text search index
      await db.collection("activities").createIndex({
        title: "text",
        description: "text",
        skills: "text",
        achievements: "text",
      });

      // Portfolio indexes
      await db
        .collection("portfolios")
        .createIndex({ studentId: 1 }, { unique: true });
      await db.collection("portfolios").createIndex({ status: 1 });
      await db.collection("portfolios").createIndex({ createdAt: -1 });

      // Faculty approval indexes
      await db.collection("facultyapprovals").createIndex({ activityId: 1 });
      await db.collection("facultyapprovals").createIndex({ facultyId: 1 });
      await db.collection("facultyapprovals").createIndex({ status: 1 });
      await db.collection("facultyapprovals").createIndex({ createdAt: -1 });
      await db
        .collection("facultyapprovals")
        .createIndex({ facultyId: 1, status: 1 });

      console.log("✅ Database indexes created successfully");
    } catch (error) {
      console.error("❌ Error creating indexes:", error);
    }
  }

  static async analyzePerformance() {
    const db = mongoose.connection.db;

    try {
      // Analyze collection sizes
      const collections = await db.listCollections().toArray();
      const analysis = {};

      for (const collection of collections) {
        const stats = await db.collection(collection.name).stats();
        analysis[collection.name] = {
          count: stats.count,
          size: stats.size,
          avgObjSize: stats.avgObjSize,
          storageSize: stats.storageSize,
          indexes: stats.nindexes,
        };
      }

      return analysis;
    } catch (error) {
      console.error("❌ Error analyzing performance:", error);
      return null;
    }
  }
}

// Memory optimization utilities
class MemoryOptimizer {
  static optimizeMongooseQueries() {
    // Set mongoose options for better performance
    mongoose.set("bufferCommands", false);
    mongoose.set("bufferMaxEntries", 0);

    // Optimize connection pool
    const options = {
      maxPoolSize: 10,
      minPoolSize: 1,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    };

    return options;
  }

  static cleanupMemory() {
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    // Clear cache if it's getting too large
    if (cacheManager.cache.size > 1000) {
      cacheManager.clear();
    }
  }
}

// Response optimization
class ResponseOptimizer {
  static optimizeResponse(data, options = {}) {
    const {
      excludeFields = [],
      includeFields = null,
      limitFields = false,
    } = options;

    if (Array.isArray(data)) {
      return data.map((item) =>
        this.optimizeObject(item, { excludeFields, includeFields, limitFields })
      );
    }

    return this.optimizeObject(data, {
      excludeFields,
      includeFields,
      limitFields,
    });
  }

  static optimizeObject(obj, options = {}) {
    const {
      excludeFields = [],
      includeFields = null,
      limitFields = false,
    } = options;

    if (!obj || typeof obj !== "object") return obj;

    // Convert to plain object if it's a Mongoose document
    const plainObj = obj.toObject ? obj.toObject() : obj;

    if (includeFields) {
      const filtered = {};
      includeFields.forEach((field) => {
        if (plainObj.hasOwnProperty(field)) {
          filtered[field] = plainObj[field];
        }
      });
      return filtered;
    }

    if (excludeFields.length > 0) {
      const filtered = { ...plainObj };
      excludeFields.forEach((field) => {
        delete filtered[field];
      });
      return filtered;
    }

    if (limitFields) {
      // Only include essential fields
      const essentialFields = [
        "_id",
        "title",
        "status",
        "createdAt",
        "updatedAt",
      ];
      const filtered = {};
      essentialFields.forEach((field) => {
        if (plainObj.hasOwnProperty(field)) {
          filtered[field] = plainObj[field];
        }
      });
      return filtered;
    }

    return plainObj;
  }
}

// Export utilities
module.exports = {
  PerformanceMonitor,
  performanceMonitor,
  QueryOptimizer,
  CacheManager,
  cacheManager,
  DatabaseOptimizer,
  MemoryOptimizer,
  ResponseOptimizer,
};
