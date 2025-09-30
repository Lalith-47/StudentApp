const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");
const Activity = require("../src/models/Activity");
const User = require("../src/models/User");
const FacultyApproval = require("../src/models/FacultyApproval");

describe("Activity API Tests", () => {
  let authToken;
  let studentId;
  let facultyId;
  let testActivity;

  beforeAll(async () => {
    // Create test student user
    const student = new User({
      name: "Test Student",
      email: "student@test.com",
      password: "password123",
      role: "student",
      isActive: true,
      isVerified: true,
    });
    await student.save();
    studentId = student._id;

    // Create test faculty user
    const faculty = new User({
      name: "Test Faculty",
      email: "faculty@test.com",
      password: "password123",
      role: "faculty",
      isActive: true,
      isVerified: true,
    });
    await faculty.save();
    facultyId = faculty._id;

    // Login to get auth token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "student@test.com",
      password: "password123",
      role: "student",
    });

    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({
      email: { $in: ["student@test.com", "faculty@test.com"] },
    });
    await Activity.deleteMany({});
    await FacultyApproval.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/activities", () => {
    it("should create a new activity with valid data", async () => {
      const activityData = {
        title: "Test Activity",
        description: "This is a test activity description",
        category: "academic",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        location: "Test Location",
        organizer: "Test Organizer",
        skills: JSON.stringify(["JavaScript", "React"]),
        achievements: JSON.stringify(["Certificate"]),
        tags: JSON.stringify(["programming", "web-development"]),
      };

      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${authToken}`)
        .send(activityData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.activity.title).toBe("Test Activity");
      expect(response.body.data.approval).toBeDefined();

      testActivity = response.body.data.activity;
    });

    it("should fail with missing required fields", async () => {
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Activity",
          // Missing description, category, startDate
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with invalid date format", async () => {
      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Activity",
          description: "Test description",
          category: "academic",
          startDate: "invalid-date",
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail with future start date", async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const response = await request(app)
        .post("/api/activities")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          title: "Test Activity",
          description: "Test description",
          category: "academic",
          startDate: futureDate.toISOString(),
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should fail without authentication", async () => {
      const response = await request(app).post("/api/activities").send({
        title: "Test Activity",
        description: "Test description",
        category: "academic",
        startDate: "2024-01-01",
      });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/activities", () => {
    it("should get student activities", async () => {
      const response = await request(app)
        .get("/api/activities")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should filter activities by status", async () => {
      const response = await request(app)
        .get("/api/activities?status=draft")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should filter activities by category", async () => {
      const response = await request(app)
        .get("/api/activities?category=academic")
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe("PUT /api/activities/:id", () => {
    it("should update an activity", async () => {
      const updateData = {
        title: "Updated Test Activity",
        description: "Updated description",
      };

      const response = await request(app)
        .put(`/api/activities/${testActivity._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Updated Test Activity");
    });

    it("should fail to update another student's activity", async () => {
      // Create another student
      const anotherStudent = new User({
        name: "Another Student",
        email: "another@test.com",
        password: "password123",
        role: "student",
        isActive: true,
      });
      await anotherStudent.save();

      const anotherActivity = new Activity({
        studentId: anotherStudent._id,
        title: "Another Activity",
        description: "Another description",
        category: "academic",
        startDate: new Date(),
        status: "draft",
      });
      await anotherActivity.save();

      const response = await request(app)
        .put(`/api/activities/${anotherActivity._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Hacked Activity" });

      expect(response.status).toBe(403);

      // Clean up
      await User.findByIdAndDelete(anotherStudent._id);
      await Activity.findByIdAndDelete(anotherActivity._id);
    });
  });

  describe("DELETE /api/activities/:id", () => {
    it("should delete an activity", async () => {
      const response = await request(app)
        .delete(`/api/activities/${testActivity._id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify activity is deleted
      const deletedActivity = await Activity.findById(testActivity._id);
      expect(deletedActivity).toBeNull();
    });
  });

  describe("POST /api/activities/:id/attachments", () => {
    it("should upload attachments to an activity", async () => {
      // Create a new activity for testing
      const newActivity = new Activity({
        studentId: studentId,
        title: "Test Activity for Upload",
        description: "Test description",
        category: "academic",
        startDate: new Date(),
        status: "draft",
      });
      await newActivity.save();

      // Mock file upload (in real test, you'd use actual files)
      const response = await request(app)
        .post(`/api/activities/${newActivity._id}/attachments`)
        .set("Authorization", `Bearer ${authToken}`)
        .attach("attachments", Buffer.from("test file content"), "test.txt");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Clean up
      await Activity.findByIdAndDelete(newActivity._id);
    });

    it("should fail with too many files", async () => {
      const newActivity = new Activity({
        studentId: studentId,
        title: "Test Activity for Upload",
        description: "Test description",
        category: "academic",
        startDate: new Date(),
        status: "draft",
      });
      await newActivity.save();

      // This would fail in real implementation due to multer limits
      const response = await request(app)
        .post(`/api/activities/${newActivity._id}/attachments`)
        .set("Authorization", `Bearer ${authToken}`)
        .attach("attachments", Buffer.from("test1"), "test1.txt")
        .attach("attachments", Buffer.from("test2"), "test2.txt")
        .attach("attachments", Buffer.from("test3"), "test3.txt")
        .attach("attachments", Buffer.from("test4"), "test4.txt")
        .attach("attachments", Buffer.from("test5"), "test5.txt")
        .attach("attachments", Buffer.from("test6"), "test6.txt"); // This should fail

      expect(response.status).toBe(400);

      // Clean up
      await Activity.findByIdAndDelete(newActivity._id);
    });
  });
});


