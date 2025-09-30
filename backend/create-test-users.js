const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/smart-student-hub", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Create test users
const createTestUsers = async () => {
  try {
    // Clear existing test users
    await User.deleteMany({
      email: {
        $in: ["student@test.com", "faculty@test.com", "admin@test.com"],
      },
    });
    console.log("🧹 Cleared existing test users");

    // Create Student user
    const studentPassword = await bcrypt.hash("student123", 10);
    const student = new User({
      name: "Test Student",
      email: "student@test.com",
      password: studentPassword,
      role: "student",
      isActive: true,
      profile: {
        phone: "+91-9876543210",
        dateOfBirth: "2000-01-01",
        gender: "Other",
        address: "Test Address, Test City",
        interests: ["Computer Science", "Technology"],
        goals: ["Get placed in top companies", "Learn new technologies"],
      },
    });
    await student.save();
    console.log("✅ Student user created");

    // Create Faculty user
    const facultyPassword = await bcrypt.hash("faculty123", 10);
    const faculty = new User({
      name: "Test Faculty",
      email: "faculty@test.com",
      password: facultyPassword,
      role: "faculty",
      isActive: true,
      profile: {
        phone: "+91-9876543211",
        department: "Computer Science",
        designation: "Professor",
        experience: "10 years",
        qualifications: "Ph.D. in Computer Science",
        specializations: ["Machine Learning", "Data Structures"],
      },
    });
    await faculty.save();
    console.log("✅ Faculty user created");

    // Create Admin user
    const adminPassword = await bcrypt.hash("admin123", 10);
    const admin = new User({
      name: "Test Admin",
      email: "admin@test.com",
      password: adminPassword,
      role: "admin",
      isActive: true,
      profile: {
        phone: "+91-9876543212",
        department: "Administration",
        designation: "System Administrator",
        experience: "15 years",
        qualifications: "M.Tech in Computer Science",
      },
    });
    await admin.save();
    console.log("✅ Admin user created");

    console.log("\n🎉 Test users created successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("┌─────────────────┬─────────────────────┬──────────────┐");
    console.log("│ Role            │ Email               │ Password     │");
    console.log("├─────────────────┼─────────────────────┼──────────────┤");
    console.log("│ Student         │ student@test.com    │ student123   │");
    console.log("│ Faculty         │ faculty@test.com    │ faculty123   │");
    console.log("│ Admin           │ admin@test.com      │ admin123     │");
    console.log("└─────────────────┴─────────────────────┴──────────────┘");
  } catch (error) {
    console.error("❌ Error creating test users:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the script
connectDB().then(() => {
  createTestUsers();
});
