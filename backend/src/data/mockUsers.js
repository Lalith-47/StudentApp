const bcrypt = require("bcryptjs");

// In-memory user storage for demo purposes
let users = [];

// Helper function to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

// Initialize with an admin user for demo purposes
const initializeAdminUser = async () => {
  const adminUser = {
    id: "admin-001",
    name: "System Administrator",
    email: "admin@adhyayanmarg.com",
    password: await hashPassword("admin123"),
    role: "admin",
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    lastLogin: null,
    analytics: {
      totalInteractions: 0,
      completedCourses: 0,
      appliedInternships: 0,
      appliedScholarships: 0,
      totalHours: 0,
      achievements: 0,
      lastUpdated: new Date(),
    },
  };

  // Only add if not already exists
  if (!users.find((user) => user.email === adminUser.email)) {
    users.push(adminUser);
  }
};

// Initialize admin user when module loads
initializeAdminUser();

// Helper function to compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Create a user
const createUser = async (userData) => {
  const { name, email, password } = userData;

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user object
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
    role: "student",
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    lastLogin: null,
  };

  // Add to users array
  users.push(user);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

// Find user by email
const findUserByEmail = async (email) => {
  return users.find((user) => user.email === email);
};

// Find user by email with password (for login)
const findUserByEmailWithPassword = async (email) => {
  return users.find((user) => user.email === email);
};

// Find user by ID
const findUserById = async (id) => {
  return users.find((user) => user.id === id);
};

// Update user
const updateUser = async (id, updateData) => {
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  users[userIndex] = { ...users[userIndex], ...updateData };
  const { password: _, ...userWithoutPassword } = users[userIndex];
  return userWithoutPassword;
};

module.exports = {
  users,
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  updateUser,
  comparePassword,
};
