const Course = require("../models/Course");
const Announcement = require("../models/Announcement");
const SystemSettings = require("../models/SystemSettings");
const User = require("../models/User");

const sampleCourses = [
  {
    title: "Introduction to Programming",
    description: "Learn the fundamentals of programming with Python. This course covers variables, data types, control structures, functions, and object-oriented programming concepts.",
    instructor: "Dr. Sarah Johnson",
    semester: "1",
    credits: 4,
    maxStudents: 60,
    enrolledStudents: 45,
    status: "active",
    prerequisites: "Basic computer literacy",
    objectives: "Students will learn to write, debug, and test Python programs",
    syllabus: "Variables, Data Types, Control Structures, Functions, OOP, File Handling",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-15"),
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: { start: "09:00", end: "10:30" },
      room: "CS-101",
    },
    assessment: {
      assignments: { weight: 30, count: 8 },
      exams: { weight: 50, count: 2 },
      projects: { weight: 20, count: 2 },
    },
    resources: [
      {
        title: "Python Documentation",
        type: "link",
        url: "https://docs.python.org",
        description: "Official Python documentation",
      },
      {
        title: "Introduction to Programming Textbook",
        type: "book",
        description: "Required textbook for the course",
      },
    ],
    tags: ["programming", "python", "beginner"],
    difficulty: "beginner",
    language: "English",
    isPublic: true,
  },
  {
    title: "Data Structures and Algorithms",
    description: "Advanced course covering fundamental data structures and algorithms. Learn about arrays, linked lists, stacks, queues, trees, graphs, and sorting algorithms.",
    instructor: "Prof. Michael Chen",
    semester: "3",
    credits: 4,
    maxStudents: 50,
    enrolledStudents: 38,
    status: "active",
    prerequisites: "Introduction to Programming, Discrete Mathematics",
    objectives: "Master fundamental data structures and algorithmic problem-solving",
    syllabus: "Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, Searching",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-15"),
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: { start: "11:00", end: "12:30" },
      room: "CS-201",
    },
    assessment: {
      assignments: { weight: 40, count: 10 },
      exams: { weight: 40, count: 2 },
      projects: { weight: 20, count: 1 },
    },
    resources: [
      {
        title: "Algorithms Textbook",
        type: "book",
        description: "Introduction to Algorithms by Cormen",
      },
      {
        title: "Visualization Tool",
        type: "link",
        url: "https://visualgo.net",
        description: "Interactive algorithm visualization",
      },
    ],
    tags: ["algorithms", "data-structures", "intermediate"],
    difficulty: "intermediate",
    language: "English",
    isPublic: true,
  },
  {
    title: "Web Development Fundamentals",
    description: "Learn modern web development with HTML5, CSS3, and JavaScript. Build responsive websites and understand web standards and best practices.",
    instructor: "Dr. Emily Rodriguez",
    semester: "2",
    credits: 3,
    maxStudents: 40,
    enrolledStudents: 32,
    status: "active",
    prerequisites: "Basic computer skills",
    objectives: "Create responsive, accessible websites using modern web technologies",
    syllabus: "HTML5, CSS3, JavaScript, Responsive Design, Web Standards",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-15"),
    schedule: {
      days: ["Monday", "Wednesday"],
      time: { start: "14:00", end: "15:30" },
      room: "LAB-301",
    },
    assessment: {
      assignments: { weight: 35, count: 6 },
      exams: { weight: 30, count: 2 },
      projects: { weight: 35, count: 3 },
    },
    resources: [
      {
        title: "MDN Web Docs",
        type: "link",
        url: "https://developer.mozilla.org",
        description: "Comprehensive web development documentation",
      },
    ],
    tags: ["web-development", "html", "css", "javascript"],
    difficulty: "beginner",
    language: "English",
    isPublic: true,
  },
  {
    title: "Database Systems",
    description: "Introduction to database design and management. Learn SQL, database normalization, indexing, and transaction management.",
    instructor: "Prof. David Kim",
    semester: "4",
    credits: 4,
    maxStudents: 45,
    enrolledStudents: 41,
    status: "active",
    prerequisites: "Data Structures, Discrete Mathematics",
    objectives: "Design and implement efficient database systems",
    syllabus: "ER Modeling, SQL, Normalization, Indexing, Transactions, ACID",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-15"),
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: { start: "09:00", end: "10:30" },
      room: "DB-102",
    },
    assessment: {
      assignments: { weight: 30, count: 8 },
      exams: { weight: 50, count: 2 },
      projects: { weight: 20, count: 2 },
    },
    resources: [
      {
        title: "MySQL Documentation",
        type: "link",
        url: "https://dev.mysql.com/doc",
        description: "MySQL database documentation",
      },
    ],
    tags: ["database", "sql", "mysql", "intermediate"],
    difficulty: "intermediate",
    language: "English",
    isPublic: true,
  },
  {
    title: "Software Engineering",
    description: "Learn software development methodologies, project management, testing, and software quality assurance.",
    instructor: "Dr. Lisa Wang",
    semester: "5",
    credits: 3,
    maxStudents: 35,
    enrolledStudents: 28,
    status: "active",
    prerequisites: "Data Structures, Database Systems",
    objectives: "Apply software engineering principles to real-world projects",
    syllabus: "SDLC, Agile, Testing, Version Control, CI/CD, Project Management",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-05-15"),
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: { start: "10:00", end: "11:00" },
      room: "SE-203",
    },
    assessment: {
      assignments: { weight: 25, count: 5 },
      exams: { weight: 35, count: 2 },
      projects: { weight: 40, count: 1 },
    },
    resources: [
      {
        title: "Git Documentation",
        type: "link",
        url: "https://git-scm.com/doc",
        description: "Version control with Git",
      },
    ],
    tags: ["software-engineering", "agile", "testing", "advanced"],
    difficulty: "advanced",
    language: "English",
    isPublic: true,
  },
];

const sampleAnnouncements = [
  {
    title: "Welcome to the New Academic Year!",
    content: "We are excited to welcome all students to the new academic year. Please ensure you have completed your course registrations and are familiar with the updated academic calendar. If you have any questions, don't hesitate to contact the administration office.",
    priority: "high",
    targetAudience: "all",
    status: "published",
    isPinned: true,
    isVisible: true,
    publishedAt: new Date(),
    category: "general",
    tags: ["welcome", "academic-year", "registration"],
  },
  {
    title: "Library Hours Extended",
    content: "Good news! The library will now be open from 7 AM to 11 PM on weekdays and 9 AM to 9 PM on weekends. This change is effective immediately. We hope this extended access helps with your studies.",
    priority: "medium",
    targetAudience: "students",
    status: "published",
    isPinned: false,
    isVisible: true,
    publishedAt: new Date(Date.now() - 86400000), // 1 day ago
    category: "general",
    tags: ["library", "hours", "access"],
  },
  {
    title: "Midterm Examination Schedule",
    content: "The midterm examination schedule has been published. Please check your student portal for the exact dates and times of your exams. Remember to bring your student ID and arrive 15 minutes early. Good luck with your preparations!",
    priority: "high",
    targetAudience: "students",
    status: "published",
    isPinned: true,
    isVisible: true,
    publishedAt: new Date(Date.now() - 172800000), // 2 days ago
    category: "academic",
    tags: ["exams", "midterm", "schedule"],
  },
  {
    title: "Faculty Meeting - Next Friday",
    content: "There will be a faculty meeting next Friday at 2 PM in the main conference room. Agenda includes discussion of curriculum updates, student performance review, and upcoming events. Please confirm your attendance.",
    priority: "medium",
    targetAudience: "faculty",
    status: "published",
    isPinned: false,
    isVisible: true,
    publishedAt: new Date(Date.now() - 259200000), // 3 days ago
    category: "administrative",
    tags: ["faculty", "meeting", "curriculum"],
  },
  {
    title: "System Maintenance - This Weekend",
    content: "Scheduled system maintenance will occur this weekend from Saturday 10 PM to Sunday 6 AM. During this time, the student portal and online services will be temporarily unavailable. We apologize for any inconvenience.",
    priority: "high",
    targetAudience: "all",
    status: "published",
    isPinned: true,
    isVisible: true,
    publishedAt: new Date(Date.now() - 345600000), // 4 days ago
    category: "maintenance",
    tags: ["maintenance", "system", "downtime"],
  },
  {
    title: "Research Symposium Registration Open",
    content: "Registration for the annual research symposium is now open. Students and faculty are encouraged to submit their research abstracts. The deadline for submission is March 15th. Visit the research office for more details.",
    priority: "medium",
    targetAudience: "all",
    status: "scheduled",
    isScheduled: true,
    scheduledDate: new Date(Date.now() + 604800000), // 1 week from now
    scheduledTime: "09:00",
    isPinned: false,
    isVisible: true,
    category: "event",
    tags: ["research", "symposium", "registration"],
  },
];

const defaultSystemSettings = {
  theme: {
    primaryColor: "#3B82F6",
    secondaryColor: "#8B5CF6",
    darkMode: false,
    customCSS: "",
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    systemAlerts: true,
    weeklyReports: true,
    maintenanceAlerts: true,
  },
  security: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: false,
      expiryDays: 90,
    },
    sessionTimeout: 30,
    twoFactorAuth: false,
    ipWhitelist: [],
    maxLoginAttempts: 5,
    lockoutDuration: 15,
  },
  userManagement: {
    defaultRole: "student",
    allowSelfRegistration: true,
    requireEmailVerification: true,
    autoApproveFaculty: false,
    maxUsersPerCourse: 50,
    userDataRetention: 365,
  },
  system: {
    siteName: "Yukti Learning Platform",
    siteDescription: "Your intelligent learning companion",
    timezone: "Asia/Kolkata",
    language: "en",
    dateFormat: "DD/MM/YYYY",
    currency: "INR",
    maintenanceMode: false,
    debugMode: false,
  },
  integrations: {
    email: {
      provider: "smtp",
      host: "smtp.gmail.com",
      port: 587,
      username: "",
      password: "",
      fromEmail: "noreply@yukti.com",
      fromName: "Yukti Platform",
    },
    sms: {
      provider: "twilio",
      accountSid: "",
      authToken: "",
      fromNumber: "",
    },
    storage: {
      provider: "local",
      awsAccessKey: "",
      awsSecretKey: "",
      awsBucket: "",
      awsRegion: "us-east-1",
    },
  },
  features: {
    enableChat: true,
    enableForums: true,
    enableQuizzes: true,
    enableAssignments: true,
    enablePortfolio: true,
    enableAnalytics: true,
    enableAPI: true,
  },
  backup: {
    enabled: false,
    frequency: "daily",
    retention: 30,
    location: "local",
  },
};

const populateSampleData = async () => {
  try {
    console.log("Starting sample data population...");

    // Get or create admin user for course creation
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found. Please create an admin user first.");
      return;
    }

    // Get or create faculty users
    let facultyUsers = await User.find({ role: "faculty" });
    if (facultyUsers.length === 0) {
      console.log("No faculty users found. Please create faculty users first.");
      return;
    }

    // Clear existing courses and announcements
    await Course.deleteMany({});
    await Announcement.deleteMany({});
    console.log("Cleared existing sample data.");

    // Create sample courses
    const createdCourses = [];
    for (let i = 0; i < sampleCourses.length; i++) {
      const courseData = {
        ...sampleCourses[i],
        createdBy: adminUser._id,
        instructorId: facultyUsers[i % facultyUsers.length]._id,
      };
      
      const course = new Course(courseData);
      await course.save();
      createdCourses.push(course);
      console.log(`Created course: ${course.title}`);
    }

    // Create sample announcements
    for (const announcementData of sampleAnnouncements) {
      const announcement = new Announcement({
        ...announcementData,
        author: adminUser._id,
      });
      await announcement.save();
      console.log(`Created announcement: ${announcement.title}`);
    }

    // Create or update system settings
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(defaultSystemSettings);
      await settings.save();
      console.log("Created default system settings.");
    } else {
      console.log("System settings already exist.");
    }

    console.log("Sample data population completed successfully!");
    console.log(`Created ${createdCourses.length} courses and ${sampleAnnouncements.length} announcements.`);

  } catch (error) {
    console.error("Error populating sample data:", error);
  }
};

module.exports = {
  populateSampleData,
  sampleCourses,
  sampleAnnouncements,
  defaultSystemSettings,
};
