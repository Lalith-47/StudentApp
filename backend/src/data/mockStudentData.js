// Mock Student Data for Testing
const mockStudents = [
  {
    id: "student_001",
    name: "Rahul Sharma",
    email: "rahul.sharma@student.yukti.com",
    rollNumber: "YUK2024001",
    course: "Computer Science Engineering",
    semester: 3,
    year: 2,
    cgpa: 8.5,
    attendance: 92,
    profile: {
      dateOfBirth: "2003-05-15",
      phone: "+91 98765 43210",
      address: "123, Sector 15, Noida, Uttar Pradesh",
      guardianName: "Rajesh Sharma",
      guardianPhone: "+91 98765 43211",
      bloodGroup: "B+",
      emergencyContact: "+91 98765 43212"
    },
    academicRecords: [
      {
        semester: 1,
        subjects: [
          { name: "Mathematics-I", grade: "A", credits: 4 },
          { name: "Physics", grade: "A-", credits: 3 },
          { name: "Chemistry", grade: "B+", credits: 3 },
          { name: "Programming Fundamentals", grade: "A", credits: 4 }
        ],
        sgpa: 8.2
      },
      {
        semester: 2,
        subjects: [
          { name: "Mathematics-II", grade: "A", credits: 4 },
          { name: "Data Structures", grade: "A-", credits: 4 },
          { name: "Digital Electronics", grade: "B+", credits: 3 },
          { name: "Communication Skills", grade: "A", credits: 2 }
        ],
        sgpa: 8.7
      }
    ],
    assignments: [
      {
        id: "assign_001",
        title: "Array Implementation in C++",
        course: "Data Structures",
        dueDate: "2024-10-15",
        status: "submitted",
        grade: "A-",
        submissionDate: "2024-10-14"
      },
      {
        id: "assign_002",
        title: "Database Design Project",
        course: "Database Management",
        dueDate: "2024-10-20",
        status: "pending",
        grade: null,
        submissionDate: null
      }
    ],
    enrolledCourses: [
      {
        id: "course_001",
        name: "Data Structures and Algorithms",
        code: "CS-301",
        credits: 4,
        instructor: "Dr. Priya Singh",
        schedule: "Mon, Wed, Fri - 10:00 AM",
        room: "Lab-101"
      },
      {
        id: "course_002",
        name: "Database Management Systems",
        code: "CS-302",
        credits: 3,
        instructor: "Prof. Amit Kumar",
        schedule: "Tue, Thu - 2:00 PM",
        room: "Room-205"
      }
    ],
    achievements: [
      {
        id: "achieve_001",
        title: "Best Project Award",
        description: "Won first prize in college hackathon",
        date: "2024-09-15",
        category: "Academic"
      }
    ],
    notifications: [
      {
        id: "notif_001",
        title: "Assignment Deadline Reminder",
        message: "Database Design Project is due tomorrow",
        type: "assignment",
        date: "2024-10-19",
        isRead: false
      }
    ]
  },
  {
    id: "student_002",
    name: "Priya Patel",
    email: "priya.patel@student.yukti.com",
    rollNumber: "YUK2024002",
    course: "Electronics and Communication Engineering",
    semester: 5,
    year: 3,
    cgpa: 9.1,
    attendance: 96,
    profile: {
      dateOfBirth: "2002-08-22",
      phone: "+91 98765 43220",
      address: "456, MG Road, Bangalore, Karnataka",
      guardianName: "Suresh Patel",
      guardianPhone: "+91 98765 43221",
      bloodGroup: "O+",
      emergencyContact: "+91 98765 43222"
    },
    academicRecords: [
      {
        semester: 1,
        subjects: [
          { name: "Mathematics-I", grade: "A+", credits: 4 },
          { name: "Physics", grade: "A", credits: 3 },
          { name: "Chemistry", grade: "A", credits: 3 },
          { name: "Basic Electronics", grade: "A+", credits: 4 }
        ],
        sgpa: 9.3
      }
    ],
    assignments: [
      {
        id: "assign_003",
        title: "Signal Processing Lab Report",
        course: "Digital Signal Processing",
        dueDate: "2024-10-18",
        status: "submitted",
        grade: "A+",
        submissionDate: "2024-10-17"
      }
    ],
    enrolledCourses: [
      {
        id: "course_003",
        name: "Digital Signal Processing",
        code: "EC-401",
        credits: 4,
        instructor: "Dr. Sunita Reddy",
        schedule: "Mon, Wed, Fri - 11:00 AM",
        room: "Lab-203"
      }
    ],
    achievements: [
      {
        id: "achieve_002",
        title: "Academic Excellence",
        description: "Topper of the batch for 3 consecutive semesters",
        date: "2024-09-01",
        category: "Academic"
      }
    ],
    notifications: []
  },
  {
    id: "student_003",
    name: "Arjun Singh",
    email: "arjun.singh@student.yukti.com",
    rollNumber: "YUK2024003",
    course: "Mechanical Engineering",
    semester: 7,
    year: 4,
    cgpa: 7.8,
    attendance: 88,
    profile: {
      dateOfBirth: "2001-12-10",
      phone: "+91 98765 43230",
      address: "789, Civil Lines, Delhi",
      guardianName: "Vikram Singh",
      guardianPhone: "+91 98765 43231",
      bloodGroup: "AB+",
      emergencyContact: "+91 98765 43232"
    },
    academicRecords: [],
    assignments: [
      {
        id: "assign_004",
        title: "Thermodynamics Project",
        course: "Applied Thermodynamics",
        dueDate: "2024-10-25",
        status: "pending",
        grade: null,
        submissionDate: null
      }
    ],
    enrolledCourses: [
      {
        id: "course_004",
        name: "Applied Thermodynamics",
        code: "ME-401",
        credits: 3,
        instructor: "Prof. Ravi Kumar",
        schedule: "Tue, Thu - 9:00 AM",
        room: "Room-301"
      }
    ],
    achievements: [],
    notifications: []
  },
  {
    id: "student_004",
    name: "Sneha Gupta",
    email: "sneha.gupta@student.yukti.com",
    rollNumber: "YUK2024004",
    course: "Business Administration",
    semester: 3,
    year: 2,
    cgpa: 8.9,
    attendance: 94,
    profile: {
      dateOfBirth: "2003-03-18",
      phone: "+91 98765 43240",
      address: "321, Park Street, Kolkata, West Bengal",
      guardianName: "Anil Gupta",
      guardianPhone: "+91 98765 43241",
      bloodGroup: "A+",
      emergencyContact: "+91 98765 43242"
    },
    academicRecords: [],
    assignments: [],
    enrolledCourses: [
      {
        id: "course_005",
        name: "Marketing Management",
        code: "BA-301",
        credits: 3,
        instructor: "Dr. Meera Joshi",
        schedule: "Mon, Wed, Fri - 1:00 PM",
        room: "Room-102"
      }
    ],
    achievements: [],
    notifications: []
  }
];

module.exports = mockStudents;
