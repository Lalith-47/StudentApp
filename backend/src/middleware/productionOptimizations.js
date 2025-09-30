const compression = require('compression');
const helmet = require('helmet');

// Production security middleware
const productionSecurity = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Response compression
const responseCompression = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
});

// Request size limiting
const requestSizeLimit = (req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      message: 'Request entity too large',
    });
  }
  
  next();
};

// Performance monitoring
const performanceMonitoring = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Log slow requests
      console.warn(`Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  
  next();
};

// Error rate limiting
const errorRateLimiting = new Map();

const errorRateLimit = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxErrors = 10;
  
  if (!errorRateLimiting.has(ip)) {
    errorRateLimiting.set(ip, []);
  }
  
  const errors = errorRateLimiting.get(ip);
  const recentErrors = errors.filter(time => now - time < windowMs);
  
  if (recentErrors.length >= maxErrors) {
    return res.status(429).json({
      success: false,
      message: 'Too many errors from this IP, please try again later',
    });
  }
  
  // Track error rate in response
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      errors.push(now);
      errorRateLimiting.set(ip, errors);
    }
  });
  
  next();
};

module.exports = {
  productionSecurity,
  responseCompression,
  requestSizeLimit,
  performanceMonitoring,
  errorRateLimit,
};
