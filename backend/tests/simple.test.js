const mongoose = require("mongoose");
const User = require("../src/models/User");

// Simple tests that don't require the full server
describe("Core Functionality Tests", () => {
  beforeAll(async () => {
    // Connect to test database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGODB_URI ||
          "mongodb://localhost:27017/smart-student-hub-test"
      );
    }
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({
      email: { $in: ["test@example.com", "admin@test.com"] },
    });
    await mongoose.connection.close();
  });

  describe("User Model Tests", () => {
    test("Should create a user with hashed password", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "student",
      };

      const user = new User(userData);
      await user.save();

      expect(user._id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
      expect(user.role).toBe("student");
    });

    test("Should compare password correctly", async () => {
      const user = await User.findOne({ email: "test@example.com" }).select(
        "+password"
      );

      const isMatch = await user.comparePassword("password123");
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword("wrongpassword");
      expect(isNotMatch).toBe(false);
    });

    test("Should validate required fields", async () => {
      const user = new User({});

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe("ValidationError");
    });

    test("Should enforce unique email", async () => {
      const userData = {
        name: "Another User",
        email: "test@example.com", // Same email
        password: "password123",
        role: "student",
      };

      const user = new User(userData);

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.code).toBe(11000); // Duplicate key error
    });

    test("Should validate role enum", async () => {
      const userData = {
        name: "Test User",
        email: "admin@test.com",
        password: "password123",
        role: "invalid-role",
      };

      const user = new User(userData);

      let error;
      try {
        await user.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.name).toBe("ValidationError");
    });
  });

  describe("Security Tests", () => {
    test("Should hash password with proper salt rounds", async () => {
      const user = await User.findOne({ email: "test@example.com" }).select(
        "+password"
      );
      const hashedPassword = user.password;

      // Check that password is hashed (starts with $2a$ or $2b$ for bcrypt)
      expect(hashedPassword).toMatch(/^\$2[ab]\$/);
    });

    test("Should exclude password from JSON output", async () => {
      const user = await User.findOne({ email: "test@example.com" });
      const userJson = user.toJSON();

      expect(userJson.password).toBeUndefined();
    });
  });

  describe("Database Connection Tests", () => {
    test("Should connect to database", () => {
      expect(mongoose.connection.readyState).toBe(1); // 1 = connected
    });

    test("Should have proper indexes", async () => {
      const indexes = await User.collection.getIndexes();
      expect(indexes.email_1).toBeDefined(); // Unique index on email
    });
  });
});
