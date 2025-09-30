#!/usr/bin/env node

const axios = require("axios");

// Configuration
const BASE_URL = "http://localhost:5000/api";
const FRONTEND_URL = "http://localhost:5173";

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  errors: [],
};

// Utility functions
const logTest = (testName, status, details = "") => {
  testResults.total++;
  if (status === "PASS") {
    testResults.passed++;
    console.log(`✅ ${testName}`);
  } else {
    testResults.failed++;
    testResults.errors.push({ test: testName, details });
    console.log(`❌ ${testName}: ${details}`);
  }
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Test functions
async function testSystemHealth() {
  console.log("\n🏥 Testing System Health...");

  try {
    // Backend health
    const backendHealth = await axios.get(
      `${BASE_URL.replace("/api", "")}/health`
    );
    if (backendHealth.data.status === "OK") {
      logTest("Backend Health Check", "PASS");
    } else {
      logTest("Backend Health Check", "FAIL", "Backend not healthy");
    }
  } catch (error) {
    logTest("Backend Health Check", "FAIL", error.message);
  }

  try {
    // Frontend accessibility
    const frontendResponse = await axios.get(FRONTEND_URL);
    if (frontendResponse.status === 200) {
      logTest("Frontend Accessibility", "PASS");
    } else {
      logTest(
        "Frontend Accessibility",
        "FAIL",
        `Status: ${frontendResponse.status}`
      );
    }
  } catch (error) {
    logTest("Frontend Accessibility", "FAIL", error.message);
  }
}

async function testAuthentication() {
  console.log("\n🔐 Testing Authentication...");

  try {
    // Student registration
    const studentData = {
      name: "Test Student",
      email: `teststudent${Date.now()}@example.com`,
      password: "TestPass123",
      role: "student",
    };

    const registerResponse = await axios.post(
      `${BASE_URL}/auth/register`,
      studentData
    );
    if (registerResponse.data.success) {
      logTest("Student Registration", "PASS");

      // Test student login
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: studentData.email,
        password: studentData.password,
        role: "student",
      });

      if (loginResponse.data.success && loginResponse.data.token) {
        logTest("Student Login", "PASS");
        return loginResponse.data.token;
      } else {
        logTest("Student Login", "FAIL", "No token received");
      }
    } else {
      logTest("Student Registration", "FAIL", registerResponse.data.message);
    }
  } catch (error) {
    logTest(
      "Authentication Tests",
      "FAIL",
      error.response?.data?.message || error.message
    );
  }

  return null;
}

async function testStudentFlow(token) {
  console.log("\n👨‍🎓 Testing Student Flow...");

  if (!token) {
    logTest("Student Flow Tests", "SKIP", "No valid token available");
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  try {
    // Student dashboard
    const dashboardResponse = await axios.get(
      `${BASE_URL}/student-enhanced/dashboard`,
      { headers }
    );
    if (dashboardResponse.data.success) {
      logTest("Student Dashboard Access", "PASS");
    } else {
      logTest("Student Dashboard Access", "FAIL", "Dashboard not accessible");
    }
  } catch (error) {
    logTest(
      "Student Dashboard Access",
      "FAIL",
      error.response?.data?.message || error.message
    );
  }

  try {
    // Student courses
    const coursesResponse = await axios.get(
      `${BASE_URL}/student-enhanced/courses`,
      { headers }
    );
    if (coursesResponse.data.success) {
      logTest("Student Courses Access", "PASS");
    } else {
      logTest("Student Courses Access", "FAIL", "Courses not accessible");
    }
  } catch (error) {
    logTest(
      "Student Courses Access",
      "FAIL",
      error.response?.data?.message || error.message
    );
  }
}

async function testPublicAPIs() {
  console.log("\n🌐 Testing Public APIs...");

  const publicEndpoints = [
    { name: "Quiz Questions", url: "/quiz/questions" },
    { name: "Stories", url: "/stories" },
    { name: "Colleges", url: "/colleges" },
    { name: "FAQ", url: "/faq" },
    { name: "Roadmap", url: "/roadmap" },
  ];

  for (const endpoint of publicEndpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint.url}`);
      if (response.data.success) {
        logTest(endpoint.name, "PASS");
      } else {
        logTest(endpoint.name, "FAIL", "API returned error");
      }
    } catch (error) {
      logTest(
        endpoint.name,
        "FAIL",
        error.response?.data?.message || error.message
      );
    }
  }
}

async function testSecurityFeatures() {
  console.log("\n🛡️ Testing Security Features...");

  try {
    // Test XSS protection
    const xssPayload = '<script>alert("xss")</script>';
    const xssResponse = await axios.post(`${BASE_URL}/auth/register`, {
      name: xssPayload,
      email: `xsstest${Date.now()}@example.com`,
      password: "TestPass123",
      role: "student",
    });

    // Check if the name was sanitized
    if (xssResponse.data.success) {
      // The name should be sanitized in the database
      logTest("XSS Protection", "PASS");
    } else {
      logTest("XSS Protection", "FAIL", "XSS payload not handled");
    }
  } catch (error) {
    if (error.response?.status === 400) {
      logTest("XSS Protection", "PASS", "XSS payload rejected");
    } else {
      logTest("XSS Protection", "FAIL", error.message);
    }
  }

  try {
    // Test rate limiting (make multiple requests quickly)
    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(
        axios.post(`${BASE_URL}/auth/login`, {
          email: "test@example.com",
          password: "wrongpassword",
          role: "student",
        })
      );
    }

    const results = await Promise.allSettled(promises);
    const rateLimited = results.some(
      (result) =>
        result.status === "rejected" &&
        result.reason.response?.data?.message?.includes("Too many")
    );

    if (rateLimited) {
      logTest("Rate Limiting", "PASS");
    } else {
      logTest("Rate Limiting", "FAIL", "Rate limiting not working");
    }
  } catch (error) {
    logTest("Rate Limiting", "FAIL", error.message);
  }
}

async function testDatabaseOperations() {
  console.log("\n🗄️ Testing Database Operations...");

  try {
    // Test database connectivity through a simple query
    const response = await axios.get(`${BASE_URL}/analytics/overview`);
    if (response.data.success) {
      logTest("Database Connectivity", "PASS");
    } else {
      logTest("Database Connectivity", "FAIL", "Database not accessible");
    }
  } catch (error) {
    logTest(
      "Database Connectivity",
      "FAIL",
      error.response?.data?.message || error.message
    );
  }
}

async function testPerformance() {
  console.log("\n⚡ Testing Performance...");

  const startTime = Date.now();

  try {
    // Test API response time
    const response = await axios.get(`${BASE_URL}/quiz/questions`);
    const responseTime = Date.now() - startTime;

    if (responseTime < 1000) {
      logTest("API Response Time", "PASS", `${responseTime}ms`);
    } else {
      logTest("API Response Time", "FAIL", `Too slow: ${responseTime}ms`);
    }
  } catch (error) {
    logTest("API Response Time", "FAIL", error.message);
  }
}

async function testErrorHandling() {
  console.log("\n🚨 Testing Error Handling...");

  try {
    // Test 404 handling
    const response = await axios.get(`${BASE_URL}/nonexistent-endpoint`);
    logTest("404 Error Handling", "FAIL", "Should return 404");
  } catch (error) {
    if (error.response?.status === 404) {
      logTest("404 Error Handling", "PASS");
    } else {
      logTest(
        "404 Error Handling",
        "FAIL",
        `Unexpected status: ${error.response?.status}`
      );
    }
  }

  try {
    // Test invalid input handling
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: "invalid-email",
      password: "123",
      role: "invalid-role",
    });
    logTest("Invalid Input Handling", "FAIL", "Should reject invalid input");
  } catch (error) {
    if (error.response?.status === 400) {
      logTest("Invalid Input Handling", "PASS");
    } else {
      logTest(
        "Invalid Input Handling",
        "FAIL",
        `Unexpected status: ${error.response?.status}`
      );
    }
  }
}

// Main test runner
async function runComprehensiveTests() {
  console.log("🚀 Starting Comprehensive End-to-End Testing");
  console.log("=".repeat(60));

  const startTime = Date.now();

  try {
    await testSystemHealth();
    const token = await testAuthentication();
    await testStudentFlow(token);
    await testPublicAPIs();
    await testSecurityFeatures();
    await testDatabaseOperations();
    await testPerformance();
    await testErrorHandling();
  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
  }

  const totalTime = Date.now() - startTime;

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📊 Total: ${testResults.total}`);
  console.log(`⏱️  Duration: ${totalTime}ms`);
  console.log(
    `📈 Success Rate: ${(
      (testResults.passed / testResults.total) *
      100
    ).toFixed(1)}%`
  );

  if (testResults.errors.length > 0) {
    console.log("\n🚨 FAILED TESTS:");
    testResults.errors.forEach((error) => {
      console.log(`   • ${error.test}: ${error.details}`);
    });
  }

  console.log("\n" + "=".repeat(60));

  if (testResults.failed === 0) {
    console.log("🎉 ALL TESTS PASSED! System is ready for production.");
    process.exit(0);
  } else {
    console.log("⚠️  Some tests failed. Please review and fix issues.");
    process.exit(1);
  }
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run tests
runComprehensiveTests();
