// Pagination middleware factory
const createPaginationMiddleware = (options = {}) => {
  const {
    defaultLimit = 20,
    maxLimit = 100,
    defaultPage = 1,
    sortField = "createdAt",
    sortOrder = "desc",
  } = options;

  return (req, res, next) => {
    try {
      // Extract pagination parameters from query
      const page = Math.max(parseInt(req.query.page) || defaultPage, 1);
      const limit = Math.min(
        Math.max(parseInt(req.query.limit) || defaultLimit, 1),
        maxLimit
      );
      const skip = (page - 1) * limit;

      // Extract sorting parameters
      const sortBy = req.query.sortBy || sortField;
      const sortDir = req.query.sortOrder || req.query.sortDir || sortOrder;

      // Validate sort direction
      const validSortDirs = ["asc", "desc", 1, -1];
      const finalSortDir = validSortDirs.includes(sortDir.toLowerCase())
        ? sortDir.toLowerCase() === "asc" || sortDir === 1
          ? 1
          : -1
        : sortOrder === "desc"
        ? -1
        : 1;

      // Build sort object
      const sort = {};
      sort[sortBy] = finalSortDir;

      // Extract filtering parameters
      const filters = {};
      Object.keys(req.query).forEach((key) => {
        if (
          !["page", "limit", "sortBy", "sortOrder", "sortDir"].includes(key) &&
          req.query[key] !== undefined &&
          req.query[key] !== ""
        ) {
          // Handle different filter types
          const value = req.query[key];

          // Array filters (comma-separated values)
          if (value.includes(",")) {
            filters[key] = { $in: value.split(",").map((v) => v.trim()) };
          }
          // Range filters (e.g., "min,max")
          else if (value.includes("-") && !isNaN(value.split("-")[0])) {
            const [min, max] = value.split("-").map((v) => v.trim());
            filters[key] = {};
            if (min !== "") filters[key].$gte = parseFloat(min);
            if (max !== "") filters[key].$lte = parseFloat(max);
          }
          // Date range filters (e.g., "2023-01-01,2023-12-31")
          else if (key.includes("Date") && value.includes(",")) {
            const [startDate, endDate] = value.split(",").map((v) => v.trim());
            filters[key] = {};
            if (startDate !== "") filters[key].$gte = new Date(startDate);
            if (endDate !== "") filters[key].$lte = new Date(endDate);
          }
          // Search filters (partial match)
          else if (key.includes("search") || key.includes("name")) {
            filters[key] = { $regex: value, $options: "i" };
          }
          // Boolean filters
          else if (value === "true" || value === "false") {
            filters[key] = value === "true";
          }
          // Numeric filters
          else if (!isNaN(value)) {
            filters[key] = parseFloat(value);
          }
          // Default: exact match
          else {
            filters[key] = value;
          }
        }
      });

      // Add pagination info to request
      req.pagination = {
        page,
        limit,
        skip,
        sort,
        filters,
        sortBy,
        sortDir: finalSortDir === 1 ? "asc" : "desc",
      };

      next();
    } catch (error) {
      console.error("Pagination middleware error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid pagination parameters",
        error: error.message,
      });
    }
  };
};

// Helper function to create paginated response
const createPaginatedResponse = (
  data,
  totalCount,
  pagination,
  additionalData = {}
) => {
  const { page, limit } = pagination;
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    data: {
      items: data,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage,
        hasPrevPage,
        limit,
        ...additionalData,
      },
    },
  };
};

// Helper function to create pagination links
const createPaginationLinks = (req, pagination) => {
  const { page, limit, totalPages } = pagination;
  const baseUrl = `${req.protocol}://${req.get("host")}${
    req.originalUrl.split("?")[0]
  }`;
  const queryParams = new URLSearchParams(req.query);

  const links = {};

  // First page
  if (page > 1) {
    queryParams.set("page", 1);
    links.first = `${baseUrl}?${queryParams.toString()}`;
  }

  // Previous page
  if (hasPrevPage) {
    queryParams.set("page", page - 1);
    links.prev = `${baseUrl}?${queryParams.toString()}`;
  }

  // Next page
  if (hasNextPage) {
    queryParams.set("page", page + 1);
    links.next = `${baseUrl}?${queryParams.toString()}`;
  }

  // Last page
  if (page < totalPages) {
    queryParams.set("page", totalPages);
    links.last = `${baseUrl}?${queryParams.toString()}`;
  }

  return links;
};

// Specific pagination middlewares for different data types
const paginationMiddleware = {
  // Default pagination (20 items per page)
  default: createPaginationMiddleware(),

  // Small pagination (10 items per page)
  small: createPaginationMiddleware({ defaultLimit: 10 }),

  // Large pagination (50 items per page)
  large: createPaginationMiddleware({ defaultLimit: 50, maxLimit: 200 }),

  // User pagination
  users: createPaginationMiddleware({
    defaultLimit: 25,
    sortField: "createdAt",
  }),

  // Course pagination
  courses: createPaginationMiddleware({
    defaultLimit: 15,
    sortField: "title",
  }),

  // Assignment pagination
  assignments: createPaginationMiddleware({
    defaultLimit: 20,
    sortField: "dueDate",
  }),

  // Audit logs pagination
  auditLogs: createPaginationMiddleware({
    defaultLimit: 50,
    sortField: "timestamp",
  }),

  // Analytics pagination
  analytics: createPaginationMiddleware({
    defaultLimit: 30,
    sortField: "createdAt",
  }),
};

module.exports = {
  createPaginationMiddleware,
  createPaginatedResponse,
  createPaginationLinks,
  paginationMiddleware,
};
