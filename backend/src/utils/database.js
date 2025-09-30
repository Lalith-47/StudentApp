const mongoose = require("mongoose");

/**
 * Check if MongoDB is connected and healthy
 * @returns {boolean} True if database is connected and ready
 */
const isDbConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

/**
 * Ensure database connection before operations
 * @returns {boolean} True if database is connected, false otherwise
 */
const ensureDbConnection = () => {
  if (!isDbConnected()) {
    console.warn(
      "⚠️ Database connection not available, but continuing with limited functionality"
    );
    return false;
  }
  return true;
};

/**
 * Get database connection status
 * @returns {object} Database connection information
 */
const getDbStatus = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return {
    readyState: states[mongoose.connection.readyState],
    isConnected: mongoose.connection.readyState === 1,
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name,
  };
};

module.exports = {
  isDbConnected,
  ensureDbConnection,
  getDbStatus,
};
