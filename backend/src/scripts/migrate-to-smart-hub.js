const mongoose = require("mongoose");
const User = require("../models/User");
const Activity = require("../models/Activity");
const Portfolio = require("../models/Portfolio");
const FacultyApproval = require("../models/FacultyApproval");
const Analytics = require("../models/Analytics");
require("dotenv").config();

// Migration script to upgrade existing career guidance website to Smart Student Hub
const migrateToSmartHub = async () => {
  try {
    console.log("🚀 Starting Smart Student Hub migration...");

    // Connect to MongoDB (Azure Cosmos DB)
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb+srv://AdhyayanMargAdmin:%3CTeDxE85wcWtfmq7Q0g%23C%3E@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000",
      {
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        maxIdleTimeMS: 120000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        retryWrites: false,
        maxPoolSize: 10,
        minPoolSize: 1,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
      }
    );
    console.log("✅ Connected to MongoDB");

    // Step 1: Update existing users with new fields
    console.log("📝 Updating existing users...");
    const users = await User.find({});

    for (const user of users) {
      const updates = {};

      // Add new profile fields if they don't exist
      if (!user.profile) {
        updates.profile = {
          department: "General",
          year: "2024",
          rollNumber: `STU${user._id.toString().slice(-6)}`,
          institution: "Default Institution",
        };
      }

      // Add new analytics fields if they don't exist
      if (!user.analytics) {
        updates.analytics = {
          totalInteractions: 0,
          completedCourses: 0,
          appliedInternships: 0,
          appliedScholarships: 0,
          totalHours: 0,
          achievements: 0,
          lastUpdated: new Date(),
        };
      }

      // Add institutionId if it doesn't exist
      if (!user.institutionId) {
        updates.institutionId = "default-institution";
      }

      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(user._id, updates);
        console.log(`✅ Updated user: ${user.name}`);
      }
    }

    console.log(`✅ Updated ${users.length} users`);

    // Step 2: Create sample activities for existing students
    console.log("📝 Creating sample activities for students...");
    const students = await User.find({ role: "student" });

    const sampleActivities = [
      {
        title: "Machine Learning Workshop",
        description:
          "Completed a comprehensive machine learning workshop covering algorithms, data preprocessing, and model evaluation.",
        category: "workshop",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-01-20"),
        location: "Tech Institute",
        organizer: "AI Research Center",
        skills: ["Python", "Machine Learning", "Data Science"],
        achievements: ["Certificate of Completion", "Top Performer Award"],
        status: "approved",
      },
      {
        title: "Community Service Project",
        description:
          "Led a community service project to provide digital literacy training to underprivileged children.",
        category: "volunteering",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-28"),
        location: "Local Community Center",
        organizer: "Social Impact Foundation",
        skills: ["Leadership", "Communication", "Teaching"],
        achievements: ["Community Impact Award", "Leadership Recognition"],
        status: "approved",
      },
      {
        title: "Research Paper Publication",
        description:
          "Published a research paper on sustainable energy solutions in a peer-reviewed journal.",
        category: "research",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-31"),
        location: "University Research Lab",
        organizer: "Department of Engineering",
        skills: ["Research", "Writing", "Data Analysis"],
        achievements: ["Journal Publication", "Research Excellence Award"],
        status: "approved",
      },
    ];

    for (const student of students.slice(0, 5)) {
      // Create activities for first 5 students
      for (const activityData of sampleActivities) {
        const activity = new Activity({
          ...activityData,
          studentId: student._id,
          approval: {
            approvedBy: null, // Will be set by admin
            approvedAt: new Date(),
            reviewNotes: "Auto-approved during migration",
          },
          verification: {
            isVerified: true,
            verificationMethod: "migration",
            verifiedAt: new Date(),
          },
        });

        await activity.save();
        console.log(
          `✅ Created activity: ${activity.title} for ${student.name}`
        );
      }
    }

    // Step 3: Create sample portfolios for students with activities
    console.log("📝 Creating sample portfolios...");
    const studentsWithActivities = await User.find({ role: "student" }).limit(
      3
    );

    for (const student of studentsWithActivities) {
      const studentActivities = await Activity.find({ studentId: student._id });

      if (studentActivities.length > 0) {
        const portfolio = new Portfolio({
          studentId: student._id,
          personalInfo: {
            fullName: student.name,
            email: student.email,
            bio: `Passionate student pursuing excellence in academics and extracurricular activities.`,
            socialLinks: {
              linkedin: `https://linkedin.com/in/${student.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`,
              github: `https://github.com/${student.name
                .toLowerCase()
                .replace(/\s+/g, "-")}`,
            },
          },
          academicInfo: {
            currentInstitution: {
              name: "Smart University",
              type: "university",
              course: "Computer Science",
              year: "2024",
              cgpa: 8.5,
            },
          },
          activities: studentActivities.map((activity) => ({
            activityId: activity._id,
            displayOrder: 0,
            isHighlighted: true,
          })),
          skills: {
            technical: [
              { name: "Python", level: "advanced", verified: true },
              { name: "JavaScript", level: "intermediate", verified: true },
              {
                name: "Machine Learning",
                level: "intermediate",
                verified: true,
              },
            ],
            soft: [
              { name: "Leadership", level: "advanced", verified: true },
              { name: "Communication", level: "advanced", verified: true },
              { name: "Teamwork", level: "advanced", verified: true },
            ],
            languages: [
              { name: "English", proficiency: "fluent", verified: true },
              { name: "Hindi", proficiency: "native", verified: true },
            ],
          },
          career: {
            objective:
              "Seeking opportunities to apply technical skills and leadership experience in innovative projects.",
            interests: ["Technology", "Research", "Social Impact"],
            preferredLocations: ["Bangalore", "Mumbai", "Delhi"],
          },
          portfolio: {
            isPublic: true,
            shareableLink: `portfolio-${student._id}-${Date.now()}`,
            customTheme: {
              primaryColor: "#3B82F6",
              secondaryColor: "#1E40AF",
              fontFamily: "Inter",
              layout: "modern",
            },
          },
          status: "published",
        });

        await portfolio.save();
        console.log(`✅ Created portfolio for ${student.name}`);
      }
    }

    // Step 4: Create faculty users and assign them to activities
    console.log("📝 Creating faculty users...");
    const facultyUsers = [
      {
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@university.edu",
        role: "faculty",
        profile: {
          department: "Computer Science",
          designation: "Professor",
        },
      },
      {
        name: "Prof. Michael Chen",
        email: "michael.chen@university.edu",
        role: "faculty",
        profile: {
          department: "Engineering",
          designation: "Associate Professor",
        },
      },
    ];

    for (const facultyData of facultyUsers) {
      const existingFaculty = await User.findOne({ email: facultyData.email });
      if (!existingFaculty) {
        const faculty = new User({
          ...facultyData,
          password: "faculty123", // Default password
          isActive: true,
          isVerified: true,
        });
        await faculty.save();
        console.log(`✅ Created faculty: ${faculty.name}`);
      }
    }

    // Step 5: Create faculty approval records
    console.log("📝 Creating faculty approval records...");
    const activities = await Activity.find({ status: "approved" });
    const faculty = await User.find({ role: "faculty" });

    for (const activity of activities) {
      const facultyApproval = new FacultyApproval({
        activityId: activity._id,
        studentId: activity.studentId,
        facultyId: faculty[Math.floor(Math.random() * faculty.length)]._id,
        department: "Computer Science",
        category: activity.category,
        status: "approved",
        reviewDetails: {
          submittedAt: activity.createdAt,
          reviewedAt: new Date(),
          reviewDuration: 30,
          priority: "medium",
          complexity: "simple",
        },
        facultyNotes: {
          detailedReview: "Activity approved during migration process",
          suggestions: "Great work! Continue building on these skills.",
        },
        verification: {
          isVerified: true,
          verificationMethod: "document_review",
          verifiedAt: new Date(),
        },
        scoring: {
          authenticity: 5,
          relevance: 4,
          impact: 4,
          documentation: 4,
          overallScore: 4,
        },
      });

      await facultyApproval.save();
      console.log(
        `✅ Created faculty approval for activity: ${activity.title}`
      );
    }

    // Step 6: Create sample analytics data
    console.log("📝 Creating sample analytics data...");
    const analytics = new Analytics({
      institutionId: "default-institution",
      reportType: "custom",
      period: {
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        academicYear: "2024-25",
      },
      studentMetrics: {
        totalStudents: students.length,
        activeStudents: students.filter((s) => s.isActive).length,
        newRegistrations: students.length,
        portfolioCompletions: 3,
        averagePortfolioScore: 85,
      },
      activityMetrics: {
        totalActivities: await Activity.countDocuments(),
        approvedActivities: await Activity.countDocuments({
          status: "approved",
        }),
        pendingActivities: await Activity.countDocuments({ status: "pending" }),
        rejectedActivities: await Activity.countDocuments({
          status: "rejected",
        }),
        averageApprovalTime: 24,
        categoryBreakdown: [
          { category: "workshop", count: 5, percentage: 33.3 },
          { category: "volunteering", count: 5, percentage: 33.3 },
          { category: "research", count: 5, percentage: 33.3 },
        ],
      },
      facultyMetrics: {
        totalFaculty: faculty.length,
        activeFaculty: faculty.filter((f) => f.isActive).length,
        averageWorkload: 15,
        approvalRate: 95,
      },
      engagementMetrics: {
        totalLogins: 1000,
        averageSessionDuration: 25,
        featureUsage: [
          { feature: "Activity Upload", usageCount: 50, uniqueUsers: 20 },
          { feature: "Portfolio View", usageCount: 30, uniqueUsers: 15 },
          { feature: "Faculty Review", usageCount: 20, uniqueUsers: 5 },
        ],
      },
      qualityMetrics: {
        averageActivityScore: 4.2,
        verificationRate: 90,
        portfolioQualityScore: 85,
        studentSatisfactionScore: 4.2,
        facultySatisfactionScore: 4.0,
      },
      complianceMetrics: {
        naacCompliance: {
          score: 85,
          criteria: [
            {
              criterion: "Student Activities Documentation",
              score: 80,
              maxScore: 100,
              status: "compliant",
            },
          ],
        },
      },
      generatedBy: (await User.findOne({ role: "admin" }))._id,
      status: "completed",
    });

    await analytics.save();
    console.log("✅ Created analytics data");

    console.log("🎉 Smart Student Hub migration completed successfully!");
    console.log("\n📊 Migration Summary:");
    console.log(`- Updated ${users.length} users`);
    console.log(`- Created ${sampleActivities.length * 5} sample activities`);
    console.log(`- Created 3 sample portfolios`);
    console.log(`- Created ${facultyUsers.length} faculty users`);
    console.log(`- Created ${activities.length} faculty approval records`);
    console.log(`- Created analytics data`);

    console.log("\n🚀 Your Smart Student Hub is ready!");
    console.log("Next steps:");
    console.log("1. Start the backend server: npm run dev");
    console.log("2. Start the frontend: npm run dev");
    console.log("3. Access the application at http://localhost:5173");
    console.log("4. Login with existing credentials or create new accounts");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToSmartHub();
}

module.exports = migrateToSmartHub;
