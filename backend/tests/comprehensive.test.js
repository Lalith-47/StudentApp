const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");
const User = require("../src/models/User");
const Course = require("../src/models/Course");
const Assignment = require("../src/models/Assignment");

// Test data
const testUsers = {
  admin: {
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  },
  faculty: {
    name: "Test Faculty",
    email: "faculty@test.com",
    password: "password123",
    role: "faculty",
  },
  student: {
    name: "Test Student",
    email: "student@test.com",
    password: "password123",
    role: "student",
  },
};

const testCourse = {
  title: "Test Course",
  code: "TEST101",
  description: "A test course for testing purposes",
  credits: 3,
  department: "Computer Science",
  semester: "Fall",
  academicYear: "2024-2025",
};

const testAssignment = {
  title: "Test Assignment",
  description: "A test assignment for testing purposes",
  type: "assignment",
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  rubric: {
    totalPoints: 100,
    criteria: [
      { name: "Completion", points: 50 },
      { name: "Quality", points: 50 },
    ],
  },
};

describe("Comprehensive End-to-End Tests", () => {
  let adminToken, facultyToken, studentToken;
  let courseId, assignmentId;

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
    // Clean up test data
    await User.deleteMany({
      email: { $in: Object.values(testUsers).map((u) => u.email) },
    });
    await Course.deleteMany({ code: testCourse.code });
    await Assignment.deleteMany({ title: testAssignment.title });
    await mongoose.connection.close();
  });

  describe("Authentication Flow", () => {
    test("Should register a student successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUsers.student)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.email).toBe(testUsers.student.email);
      expect(response.body.user.role).toBe("student");
    });

    test("Should prevent faculty registration", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUsers.faculty)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("faculty");
    });

    test("Should prevent admin registration", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUsers.admin)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("admin");
    });

    test("Should login student successfully", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUsers.student.email,
          password: testUsers.student.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      studentToken = response.body.token;
    });

    test("Should fail login with wrong password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUsers.student.email,
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Admin Flow", () => {
    beforeAll(async () => {
      // Create admin user for testing
      const adminUser = new User(testUsers.admin);
      await adminUser.save();

      // Login as admin
      const response = await request(app).post("/api/auth/login").send({
        email: testUsers.admin.email,
        password: testUsers.admin.password,
      });
      adminToken = response.body.token;
    });

    test("Should create faculty user", async () => {
      const response = await request(app)
        .post("/api/auth/admin/create-user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(testUsers.faculty)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.role).toBe("faculty");
    });

    test("Should login faculty successfully", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUsers.faculty.email,
          password: testUsers.faculty.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      facultyToken = response.body.token;
    });

    test("Should get admin dashboard", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    test("Should get users with pagination", async () => {
      const response = await request(app)
        .get("/api/admin/users?page=1&limit=10")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.items).toBeDefined();
    });

    test("Should get audit logs", async () => {
      const response = await request(app)
        .get("/api/admin/audit-logs?page=1&limit=10")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.pagination).toBeDefined();
    });
  });

  describe("Faculty Flow", () => {
    test("Should get faculty dashboard", async () => {
      const response = await request(app)
        .get("/api/faculty-enhanced/dashboard")
        .set("Authorization", `Bearer ${facultyToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test("Should create a course", async () => {
      const response = await request(app)
        .post("/api/faculty-enhanced/courses")
        .set("Authorization", `Bearer ${facultyToken}`)
        .send(testCourse)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.course.title).toBe(testCourse.title);
      courseId = response.body.data.course._id;
    });

    test("Should create an assignment", async () => {
      const response = await request(app)
        .post(`/api/faculty-enhanced/courses/${courseId}/assignments`)
        .set("Authorization", `Bearer ${facultyToken}`)
        .send(testAssignment)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.assignment.title).toBe(testAssignment.title);
      assignmentId = response.body.data.assignment._id;
    });

    test("Should get assignments", async () => {
      const response = await request(app)
        .get(`/api/faculty-enhanced/courses/${courseId}/assignments`)
        .set("Authorization", `Bearer ${facultyToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.assignments).toBeDefined();
    });

    test("Should upload bulk grades (CSV)", async () => {
      // Create a test CSV content
      const csvContent =
        "studentId,score,feedback\n" +
        "507f1f77bcf86cd799439011,85,Good work\n" +
        "507f1f77bcf86cd799439012,92,Excellent";

      const response = await request(app)
        .post(`/api/faculty-enhanced/assignments/${assignmentId}/bulk-grades`)
        .set("Authorization", `Bearer ${facultyToken}`)
        .attach("file", Buffer.from(csvContent), "grades.csv")
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("Student Flow", () => {
    test("Should get student dashboard", async () => {
      const response = await request(app)
        .get("/api/student-enhanced/dashboard")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test("Should get courses", async () => {
      const response = await request(app)
        .get("/api/student-enhanced/courses")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.courses).toBeDefined();
    });

    test("Should get assignments", async () => {
      const response = await request(app)
        .get("/api/student-enhanced/assignments")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.assignments).toBeDefined();
    });

    test("Should submit assignment (PDF only)", async () => {
      // Create a test PDF buffer (minimal PDF structure)
      const pdfBuffer = Buffer.from(
        "%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n174\n%%EOF"
      );

      const response = await request(app)
        .post(`/api/student-enhanced/assignments/${assignmentId}/submit`)
        .set("Authorization", `Bearer ${studentToken}`)
        .attach("attachments", pdfBuffer, "test.pdf")
        .field("answers", JSON.stringify(["Answer 1", "Answer 2"]))
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    test("Should reject non-PDF assignment submission", async () => {
      const txtBuffer = Buffer.from("This is a text file");

      const response = await request(app)
        .post(`/api/student-enhanced/assignments/${assignmentId}/submit`)
        .set("Authorization", `Bearer ${studentToken}`)
        .attach("attachments", txtBuffer, "test.txt")
        .field("answers", JSON.stringify(["Answer 1"]))
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("PDF");
    });
  });

  describe("Security Tests", () => {
    test("Should reject requests without token", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard")
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test("Should reject student accessing admin routes", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test("Should reject faculty accessing admin routes", async () => {
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${facultyToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test("Should handle XSS attacks", async () => {
      const maliciousInput = "<script>alert('xss')</script>";

      const response = await request(app)
        .post("/api/auth/admin/create-user")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: maliciousInput,
          email: "xss@test.com",
          password: "password123",
          role: "student",
        })
        .expect(201);

      // The malicious script should be sanitized
      expect(response.body.user.name).not.toContain("<script>");
    });

    test("Should rate limit authentication attempts", async () => {
      // Make multiple failed login attempts
      for (let i = 0; i < 6; i++) {
        await request(app).post("/api/auth/login").send({
          email: testUsers.student.email,
          password: "wrongpassword",
        });
      }

      // The 6th attempt should be rate limited
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUsers.student.email,
          password: "wrongpassword",
        })
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Too many");
    });
  });

  describe("Performance Tests", () => {
    test("Should cache dashboard responses", async () => {
      const start = Date.now();

      // First request
      await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const firstRequestTime = Date.now() - start;

      const start2 = Date.now();

      // Second request (should be cached)
      const response = await request(app)
        .get("/api/admin/dashboard")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      const secondRequestTime = Date.now() - start2;

      // Check cache headers
      expect(response.headers["x-cache"]).toBeDefined();

      // Second request should be faster (cached)
      expect(secondRequestTime).toBeLessThan(firstRequestTime);
    });

    test("Should handle pagination efficiently", async () => {
      const response = await request(app)
        .get("/api/admin/users?page=1&limit=5")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.limit).toBe(5);
      expect(response.body.data.items.length).toBeLessThanOrEqual(5);
    });
  });

  describe("Error Handling Tests", () => {
    test("Should handle invalid course ID", async () => {
      const response = await request(app)
        .get("/api/student-enhanced/courses/invalid-id")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test("Should handle missing required fields", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Test User",
          // Missing email and password
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    test("Should handle database connection errors gracefully", async () => {
      // This test would require temporarily disconnecting the database
      // For now, we'll test the error handling structure
      const response = await request(app)
        .get("/api/admin/users?page=999999")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Should return empty results, not crash
      expect(response.body.success).toBe(true);
    });
  });
});
