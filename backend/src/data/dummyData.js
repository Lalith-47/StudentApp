// Dummy data for development and testing

const dummyRoadmaps = [
  {
    _id: "1",
    courseName: "Computer Science Engineering",
    description:
      "Comprehensive roadmap for Computer Science Engineering covering programming, algorithms, and software development.",
    category: "Engineering",
    duration: "4 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Physics", "Chemistry"],
    careerPaths: [
      {
        title: "Software Engineer",
        description: "Develop and maintain software applications",
        salaryRange: "₹6-15 LPA",
        growthProspect: "High",
      },
      {
        title: "Data Scientist",
        description: "Analyze data to extract insights",
        salaryRange: "₹8-20 LPA",
        growthProspect: "Very High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Year 1)",
        duration: "12 months",
        milestones: [
          {
            title: "Programming Basics",
            description: "Learn C, C++, Python fundamentals",
            resources: ["Codecademy", "GeeksforGeeks"],
            completed: false,
          },
        ],
        skills: ["Programming", "Mathematics", "Problem Solving"],
      },
    ],
    resources: {
      books: ["Introduction to Algorithms", "Clean Code"],
      onlineCourses: ["CS50", "Algorithms Specialization"],
      certifications: ["AWS", "Google Cloud"],
      tools: ["VS Code", "Git", "Docker"],
    },
    institutions: [
      {
        name: "IIT Delhi",
        location: "New Delhi",
        ranking: 1,
        fees: "₹2.5 LPA",
        admissionProcess: "JEE Advanced",
      },
    ],
    marketDemand: {
      current: "Very High",
      future: "Booming",
      salaryRange: {
        entry: "₹6-8 LPA",
        mid: "₹12-18 LPA",
        senior: "₹25-50 LPA",
      },
    },
    tags: ["programming", "technology", "software", "algorithms"],
    image:
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "2",
    courseName: "Mechanical Engineering",
    description:
      "Complete roadmap for Mechanical Engineering covering design, manufacturing, and automation.",
    category: "Engineering",
    duration: "4 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Physics", "Chemistry"],
    careerPaths: [
      {
        title: "Mechanical Engineer",
        description: "Design and analyze mechanical systems",
        salaryRange: "₹5-12 LPA",
        growthProspect: "High",
      },
      {
        title: "Automation Engineer",
        description: "Implement automated manufacturing systems",
        salaryRange: "₹7-15 LPA",
        growthProspect: "Very High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Year 1)",
        duration: "12 months",
        milestones: [
          {
            title: "Engineering Mathematics",
            description: "Learn calculus, differential equations",
            resources: ["Khan Academy", "MIT OpenCourseWare"],
            completed: false,
          },
        ],
        skills: ["Mathematics", "Physics", "Problem Solving"],
      },
    ],
    resources: {
      books: ["Engineering Mechanics", "Machine Design"],
      onlineCourses: ["MITx Mechanical Engineering", "Coursera"],
      certifications: ["SolidWorks", "AutoCAD"],
      tools: ["SolidWorks", "AutoCAD", "MATLAB"],
    },
    institutions: [
      {
        name: "IIT Bombay",
        location: "Mumbai",
        ranking: 2,
        fees: "₹2.5 LPA",
        admissionProcess: "JEE Advanced",
      },
    ],
    marketDemand: {
      current: "High",
      future: "Growing",
      salaryRange: {
        entry: "₹5-7 LPA",
        mid: "₹10-15 LPA",
        senior: "₹20-35 LPA",
      },
    },
    tags: ["mechanical", "design", "manufacturing", "automation"],
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "3",
    courseName: "Electronics & Communication Engineering",
    description:
      "Comprehensive roadmap for ECE covering circuits, communication systems, and embedded systems.",
    category: "Engineering",
    duration: "4 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Physics", "Chemistry"],
    careerPaths: [
      {
        title: "Electronics Engineer",
        description: "Design electronic circuits and systems",
        salaryRange: "₹6-14 LPA",
        growthProspect: "High",
      },
      {
        title: "Embedded Systems Engineer",
        description: "Develop embedded software and hardware",
        salaryRange: "₹8-18 LPA",
        growthProspect: "Very High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Year 1)",
        duration: "12 months",
        milestones: [
          {
            title: "Circuit Analysis",
            description: "Learn basic electronic circuits",
            resources: ["All About Circuits", "Electronics Tutorials"],
            completed: false,
          },
        ],
        skills: ["Electronics", "Mathematics", "Programming"],
      },
    ],
    resources: {
      books: ["Microelectronic Circuits", "Digital Design"],
      onlineCourses: ["MITx Electronics", "Coursera ECE"],
      certifications: ["Arduino", "Raspberry Pi"],
      tools: ["Multisim", "Proteus", "Arduino IDE"],
    },
    institutions: [
      {
        name: "IIT Madras",
        location: "Chennai",
        ranking: 3,
        fees: "₹2.5 LPA",
        admissionProcess: "JEE Advanced",
      },
    ],
    marketDemand: {
      current: "Very High",
      future: "Booming",
      salaryRange: {
        entry: "₹6-8 LPA",
        mid: "₹12-18 LPA",
        senior: "₹25-45 LPA",
      },
    },
    tags: ["electronics", "communication", "embedded", "circuits"],
    image:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "4",
    courseName: "Civil Engineering",
    description:
      "Complete roadmap for Civil Engineering covering construction, infrastructure, and project management.",
    category: "Engineering",
    duration: "4 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Physics", "Chemistry"],
    careerPaths: [
      {
        title: "Civil Engineer",
        description: "Design and construct infrastructure projects",
        salaryRange: "₹5-12 LPA",
        growthProspect: "High",
      },
      {
        title: "Structural Engineer",
        description: "Design safe and efficient structures",
        salaryRange: "₹7-15 LPA",
        growthProspect: "High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Year 1)",
        duration: "12 months",
        milestones: [
          {
            title: "Engineering Mechanics",
            description: "Learn statics and dynamics",
            resources: ["Engineering Mechanics", "MIT OpenCourseWare"],
            completed: false,
          },
        ],
        skills: ["Mathematics", "Physics", "Problem Solving"],
      },
    ],
    resources: {
      books: ["Structural Analysis", "Concrete Technology"],
      onlineCourses: ["MITx Civil Engineering", "Coursera"],
      certifications: ["AutoCAD", "STAAD Pro"],
      tools: ["AutoCAD", "STAAD Pro", "ETABS"],
    },
    institutions: [
      {
        name: "IIT Kanpur",
        location: "Kanpur",
        ranking: 4,
        fees: "₹2.5 LPA",
        admissionProcess: "JEE Advanced",
      },
    ],
    marketDemand: {
      current: "High",
      future: "Growing",
      salaryRange: {
        entry: "₹5-7 LPA",
        mid: "₹10-15 LPA",
        senior: "₹18-30 LPA",
      },
    },
    tags: ["civil", "construction", "infrastructure", "structures"],
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "5",
    courseName: "Data Science",
    description:
      "Comprehensive roadmap for Data Science covering statistics, machine learning, and big data analytics.",
    category: "Technology",
    duration: "2-4 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Statistics", "Programming"],
    careerPaths: [
      {
        title: "Data Scientist",
        description: "Extract insights from data using ML/AI",
        salaryRange: "₹8-25 LPA",
        growthProspect: "Very High",
      },
      {
        title: "Data Analyst",
        description: "Analyze data to support business decisions",
        salaryRange: "₹6-15 LPA",
        growthProspect: "High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Months 1-6)",
        duration: "6 months",
        milestones: [
          {
            title: "Python Programming",
            description: "Learn Python for data analysis",
            resources: ["Python.org", "DataCamp"],
            completed: false,
          },
        ],
        skills: ["Python", "Statistics", "Mathematics"],
      },
    ],
    resources: {
      books: [
        "Python for Data Analysis",
        "The Elements of Statistical Learning",
      ],
      onlineCourses: ["Coursera Data Science", "edX MIT"],
      certifications: ["Google Data Analytics", "IBM Data Science"],
      tools: ["Python", "R", "SQL", "Tableau"],
    },
    institutions: [
      {
        name: "IIM Bangalore",
        location: "Bangalore",
        ranking: 1,
        fees: "₹15 LPA",
        admissionProcess: "CAT + Interview",
      },
    ],
    marketDemand: {
      current: "Very High",
      future: "Booming",
      salaryRange: {
        entry: "₹8-12 LPA",
        mid: "₹15-25 LPA",
        senior: "₹30-60 LPA",
      },
    },
    tags: ["data-science", "machine-learning", "analytics", "python"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "6",
    courseName: "Artificial Intelligence",
    description:
      "Complete roadmap for AI covering machine learning, deep learning, and AI applications.",
    category: "Technology",
    duration: "2-4 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Statistics", "Programming"],
    careerPaths: [
      {
        title: "AI Engineer",
        description: "Develop AI-powered applications",
        salaryRange: "₹10-30 LPA",
        growthProspect: "Very High",
      },
      {
        title: "ML Engineer",
        description: "Build and deploy machine learning models",
        salaryRange: "₹12-35 LPA",
        growthProspect: "Very High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Months 1-6)",
        duration: "6 months",
        milestones: [
          {
            title: "Machine Learning Basics",
            description: "Learn supervised and unsupervised learning",
            resources: ["Coursera ML Course", "Fast.ai"],
            completed: false,
          },
        ],
        skills: ["Python", "TensorFlow", "PyTorch"],
      },
    ],
    resources: {
      books: ["Hands-On Machine Learning", "Deep Learning"],
      onlineCourses: ["Coursera AI", "edX MIT AI"],
      certifications: ["Google AI", "Microsoft AI"],
      tools: ["TensorFlow", "PyTorch", "Scikit-learn"],
    },
    institutions: [
      {
        name: "IISc Bangalore",
        location: "Bangalore",
        ranking: 1,
        fees: "₹3 LPA",
        admissionProcess: "GATE + Interview",
      },
    ],
    marketDemand: {
      current: "Very High",
      future: "Booming",
      salaryRange: {
        entry: "₹10-15 LPA",
        mid: "₹20-35 LPA",
        senior: "₹40-80 LPA",
      },
    },
    tags: [
      "artificial-intelligence",
      "machine-learning",
      "deep-learning",
      "neural-networks",
    ],
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "7",
    courseName: "Cybersecurity",
    description:
      "Comprehensive roadmap for Cybersecurity covering network security, ethical hacking, and digital forensics.",
    category: "Technology",
    duration: "2-4 years",
    difficulty: "Advanced",
    prerequisites: ["Computer Science", "Networking", "Programming"],
    careerPaths: [
      {
        title: "Cybersecurity Analyst",
        description: "Protect systems from cyber threats",
        salaryRange: "₹8-20 LPA",
        growthProspect: "Very High",
      },
      {
        title: "Ethical Hacker",
        description: "Test systems for vulnerabilities",
        salaryRange: "₹10-25 LPA",
        growthProspect: "Very High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Months 1-6)",
        duration: "6 months",
        milestones: [
          {
            title: "Network Security",
            description: "Learn network protocols and security",
            resources: ["Cisco Networking", "CompTIA Security+"],
            completed: false,
          },
        ],
        skills: ["Networking", "Security", "Linux"],
      },
    ],
    resources: {
      books: [
        "Network Security Essentials",
        "Hacking: The Art of Exploitation",
      ],
      onlineCourses: ["Coursera Cybersecurity", "Cybrary"],
      certifications: ["CEH", "CISSP", "CompTIA Security+"],
      tools: ["Wireshark", "Nmap", "Metasploit"],
    },
    institutions: [
      {
        name: "IIT Hyderabad",
        location: "Hyderabad",
        ranking: 5,
        fees: "₹2.5 LPA",
        admissionProcess: "JEE Advanced",
      },
    ],
    marketDemand: {
      current: "Very High",
      future: "Booming",
      salaryRange: {
        entry: "₹8-12 LPA",
        mid: "₹15-25 LPA",
        senior: "₹25-50 LPA",
      },
    },
    tags: [
      "cybersecurity",
      "ethical-hacking",
      "network-security",
      "digital-forensics",
    ],
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "8",
    courseName: "Digital Marketing",
    description:
      "Complete roadmap for Digital Marketing covering SEO, social media, content marketing, and analytics.",
    category: "Business",
    duration: "1-2 years",
    difficulty: "Intermediate",
    prerequisites: ["Basic Computer Skills", "Communication"],
    careerPaths: [
      {
        title: "Digital Marketing Manager",
        description: "Plan and execute digital marketing campaigns",
        salaryRange: "₹5-15 LPA",
        growthProspect: "High",
      },
      {
        title: "SEO Specialist",
        description: "Optimize websites for search engines",
        salaryRange: "₹4-12 LPA",
        growthProspect: "High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Months 1-3)",
        duration: "3 months",
        milestones: [
          {
            title: "SEO Fundamentals",
            description: "Learn search engine optimization",
            resources: ["Google Digital Garage", "HubSpot Academy"],
            completed: false,
          },
        ],
        skills: ["SEO", "Content Marketing", "Analytics"],
      },
    ],
    resources: {
      books: ["Digital Marketing", "SEO 2023"],
      onlineCourses: ["Google Digital Garage", "HubSpot Academy"],
      certifications: ["Google Analytics", "Facebook Blueprint"],
      tools: ["Google Analytics", "SEMrush", "Hootsuite"],
    },
    institutions: [
      {
        name: "MICA Ahmedabad",
        location: "Ahmedabad",
        ranking: 1,
        fees: "₹8 LPA",
        admissionProcess: "CAT + Interview",
      },
    ],
    marketDemand: {
      current: "High",
      future: "Growing",
      salaryRange: {
        entry: "₹4-6 LPA",
        mid: "₹8-15 LPA",
        senior: "₹15-30 LPA",
      },
    },
    tags: ["digital-marketing", "seo", "social-media", "content-marketing"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "9",
    courseName: "Business Administration",
    description:
      "Comprehensive roadmap for MBA covering management, finance, marketing, and leadership.",
    category: "Business",
    duration: "2 years",
    difficulty: "Advanced",
    prerequisites: ["Bachelor's Degree", "Work Experience"],
    careerPaths: [
      {
        title: "Business Manager",
        description: "Lead and manage business operations",
        salaryRange: "₹8-25 LPA",
        growthProspect: "High",
      },
      {
        title: "Management Consultant",
        description: "Advise companies on business strategy",
        salaryRange: "₹12-40 LPA",
        growthProspect: "Very High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Year 1)",
        duration: "12 months",
        milestones: [
          {
            title: "Core Business Concepts",
            description: "Learn finance, marketing, operations",
            resources: ["Harvard Business Review", "MIT Sloan"],
            completed: false,
          },
        ],
        skills: ["Leadership", "Strategy", "Finance"],
      },
    ],
    resources: {
      books: ["Good to Great", "The Lean Startup"],
      onlineCourses: ["Coursera MBA", "edX Business"],
      certifications: ["PMP", "CFA"],
      tools: ["Excel", "Tableau", "SAP"],
    },
    institutions: [
      {
        name: "IIM Ahmedabad",
        location: "Ahmedabad",
        ranking: 1,
        fees: "₹25 LPA",
        admissionProcess: "CAT + Interview",
      },
    ],
    marketDemand: {
      current: "High",
      future: "Growing",
      salaryRange: {
        entry: "₹8-12 LPA",
        mid: "₹15-30 LPA",
        senior: "₹30-60 LPA",
      },
    },
    tags: ["mba", "management", "leadership", "strategy"],
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "10",
    courseName: "Medicine (MBBS)",
    description:
      "Complete roadmap for Medical education covering anatomy, physiology, pathology, and clinical practice.",
    category: "Healthcare",
    duration: "5.5 years",
    difficulty: "Advanced",
    prerequisites: ["Biology", "Chemistry", "Physics"],
    careerPaths: [
      {
        title: "Doctor",
        description: "Diagnose and treat patients",
        salaryRange: "₹8-20 LPA",
        growthProspect: "High",
      },
      {
        title: "Specialist",
        description: "Specialize in specific medical fields",
        salaryRange: "₹15-50 LPA",
        growthProspect: "Very High",
      },
    ],
    timeline: [
      {
        phase: "Pre-Clinical (Years 1-2)",
        duration: "24 months",
        milestones: [
          {
            title: "Anatomy & Physiology",
            description: "Learn human body structure and function",
            resources: ["Gray's Anatomy", "Guyton Physiology"],
            completed: false,
          },
        ],
        skills: ["Anatomy", "Physiology", "Biochemistry"],
      },
    ],
    resources: {
      books: ["Gray's Anatomy", "Harrison's Medicine"],
      onlineCourses: ["Khan Academy Medicine", "Coursera Medicine"],
      certifications: ["USMLE", "PLAB"],
      tools: ["Stethoscope", "Medical Software", "Research Tools"],
    },
    institutions: [
      {
        name: "AIIMS Delhi",
        location: "New Delhi",
        ranking: 1,
        fees: "₹1.5 LPA",
        admissionProcess: "NEET",
      },
    ],
    marketDemand: {
      current: "Very High",
      future: "Growing",
      salaryRange: {
        entry: "₹8-12 LPA",
        mid: "₹15-30 LPA",
        senior: "₹25-60 LPA",
      },
    },
    tags: ["medicine", "healthcare", "doctor", "medical"],
    image:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "11",
    courseName: "Architecture",
    description:
      "Comprehensive roadmap for Architecture covering design, construction, and urban planning.",
    category: "Design",
    duration: "5 years",
    difficulty: "Advanced",
    prerequisites: ["Mathematics", "Physics", "Art"],
    careerPaths: [
      {
        title: "Architect",
        description: "Design buildings and structures",
        salaryRange: "₹6-18 LPA",
        growthProspect: "High",
      },
      {
        title: "Urban Planner",
        description: "Plan and design cities and communities",
        salaryRange: "₹8-20 LPA",
        growthProspect: "High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Year 1)",
        duration: "12 months",
        milestones: [
          {
            title: "Design Fundamentals",
            description: "Learn basic design principles",
            resources: ["Architecture School", "Design Books"],
            completed: false,
          },
        ],
        skills: ["Design", "Drawing", "Mathematics"],
      },
    ],
    resources: {
      books: [
        "Architecture: Form, Space & Order",
        "Building Construction Illustrated",
      ],
      onlineCourses: ["Coursera Architecture", "edX Design"],
      certifications: ["LEED", "Architect Registration"],
      tools: ["AutoCAD", "SketchUp", "Revit"],
    },
    institutions: [
      {
        name: "SPA Delhi",
        location: "New Delhi",
        ranking: 1,
        fees: "₹3 LPA",
        admissionProcess: "NATA + JEE Paper 2",
      },
    ],
    marketDemand: {
      current: "High",
      future: "Growing",
      salaryRange: {
        entry: "₹6-8 LPA",
        mid: "₹12-18 LPA",
        senior: "₹20-40 LPA",
      },
    },
    tags: ["architecture", "design", "construction", "urban-planning"],
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    isActive: true,
  },
  {
    _id: "12",
    courseName: "Psychology",
    description:
      "Complete roadmap for Psychology covering human behavior, mental health, and research methods.",
    category: "Social Sciences",
    duration: "3-5 years",
    difficulty: "Intermediate",
    prerequisites: ["Biology", "Mathematics", "English"],
    careerPaths: [
      {
        title: "Clinical Psychologist",
        description: "Diagnose and treat mental health issues",
        salaryRange: "₹6-15 LPA",
        growthProspect: "High",
      },
      {
        title: "Counselor",
        description: "Provide therapy and guidance",
        salaryRange: "₹5-12 LPA",
        growthProspect: "High",
      },
    ],
    timeline: [
      {
        phase: "Foundation (Year 1)",
        duration: "12 months",
        milestones: [
          {
            title: "Introduction to Psychology",
            description: "Learn basic psychological concepts",
            resources: ["Psychology Textbooks", "Online Courses"],
            completed: false,
          },
        ],
        skills: ["Research", "Communication", "Empathy"],
      },
    ],
    resources: {
      books: ["Introduction to Psychology", "Abnormal Psychology"],
      onlineCourses: ["Coursera Psychology", "edX Psychology"],
      certifications: ["Licensed Psychologist", "Counseling Certification"],
      tools: ["Psychological Tests", "Research Software", "Therapy Tools"],
    },
    institutions: [
      {
        name: "Delhi University",
        location: "New Delhi",
        ranking: 1,
        fees: "₹50K PA",
        admissionProcess: "CUET",
      },
    ],
    marketDemand: {
      current: "High",
      future: "Growing",
      salaryRange: {
        entry: "₹5-8 LPA",
        mid: "₹10-15 LPA",
        senior: "₹15-30 LPA",
      },
    },
    tags: ["psychology", "mental-health", "counseling", "research"],
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
    isActive: true,
  },
];

const dummyColleges = [
  {
    _id: "1",
    name: "Indian Institute of Technology Delhi",
    shortName: "IIT Delhi",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110016",
      address: "Hauz Khas, New Delhi",
    },
    contact: {
      phone: ["+91-11-2659-7135"],
      email: ["info@iitd.ac.in"],
      website: "https://www.iitd.ac.in",
      admissionEmail: "admission@iitd.ac.in",
    },
    established: 1961,
    accreditation: {
      naac: { grade: "A++", score: 3.8 },
      nirf: { rank: 2, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹2.5 L", total: "₹10 L" },
        seats: 120,
        eligibility: "JEE Advanced",
        entranceExam: ["JEE Advanced"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 2000, fees: "₹1.2 L/year" },
      library: { books: 500000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 500,
      phd: 450,
      studentRatio: "1:12",
    },
    placement: {
      averagePackage: "₹15 LPA",
      highestPackage: "₹1.2 CPA",
      placementPercentage: 95,
      topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
      year: 2023,
    },
    admission: {
      process: "JEE Advanced + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["JEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹2000", registration: "₹5000" },
    },
    reviews: [
      {
        rating: 5,
        comment: "Excellent faculty and infrastructure",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["iit-delhi-1.jpg", "iit-delhi-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/iitdelhi",
      twitter: "https://twitter.com/iitdelhi",
      instagram: "https://instagram.com/iitdelhi",
      linkedin: "https://linkedin.com/school/iit-delhi",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "2",
    name: "Indian Institute of Technology Bombay",
    shortName: "IIT Bombay",
    type: "Government",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400076",
      address: "Powai, Mumbai",
    },
    contact: {
      phone: ["+91-22-2572-2545"],
      email: ["info@iitb.ac.in"],
      website: "https://www.iitb.ac.in",
      admissionEmail: "admission@iitb.ac.in",
    },
    established: 1958,
    accreditation: {
      naac: { grade: "A++", score: 3.9 },
      nirf: { rank: 1, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹2.5 L", total: "₹10 L" },
        seats: 150,
        eligibility: "JEE Advanced",
        entranceExam: ["JEE Advanced"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 2500, fees: "₹1.2 L/year" },
      library: { books: 600000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 600,
      phd: 550,
      studentRatio: "1:10",
    },
    placement: {
      averagePackage: "₹18 LPA",
      highestPackage: "₹1.5 CPA",
      placementPercentage: 98,
      topRecruiters: ["Google", "Microsoft", "Amazon", "Apple", "Tesla"],
      year: 2023,
    },
    admission: {
      process: "JEE Advanced + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["JEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹2000", registration: "₹5000" },
    },
    reviews: [
      {
        rating: 5,
        comment: "Best engineering college in India",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["iit-bombay-1.jpg", "iit-bombay-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/iitbombay",
      twitter: "https://twitter.com/iitbombay",
      instagram: "https://instagram.com/iitbombay",
      linkedin: "https://linkedin.com/school/iit-bombay",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "3",
    name: "Indian Institute of Technology Madras",
    shortName: "IIT Madras",
    type: "Government",
    location: {
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      pincode: "600036",
      address: "IIT Campus, Chennai",
    },
    contact: {
      phone: ["+91-44-2257-8000"],
      email: ["info@iitm.ac.in"],
      website: "https://www.iitm.ac.in",
      admissionEmail: "admission@iitm.ac.in",
    },
    established: 1959,
    accreditation: {
      naac: { grade: "A++", score: 3.7 },
      nirf: { rank: 3, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹2.5 L", total: "₹10 L" },
        seats: 130,
        eligibility: "JEE Advanced",
        entranceExam: ["JEE Advanced"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 2200, fees: "₹1.2 L/year" },
      library: { books: 550000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 550,
      phd: 500,
      studentRatio: "1:11",
    },
    placement: {
      averagePackage: "₹16 LPA",
      highestPackage: "₹1.3 CPA",
      placementPercentage: 96,
      topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
      year: 2023,
    },
    admission: {
      process: "JEE Advanced + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["JEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹2000", registration: "₹5000" },
    },
    reviews: [
      {
        rating: 5,
        comment: "Excellent research opportunities",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["iit-madras-1.jpg", "iit-madras-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/iitmadras",
      twitter: "https://twitter.com/iitmadras",
      instagram: "https://instagram.com/iitmadras",
      linkedin: "https://linkedin.com/school/iit-madras",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "4",
    name: "National Institute of Technology Trichy",
    shortName: "NIT Trichy",
    type: "Government",
    location: {
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      country: "India",
      pincode: "620015",
      address: "NIT Campus, Trichy",
    },
    contact: {
      phone: ["+91-431-250-3000"],
      email: ["info@nitt.edu"],
      website: "https://www.nitt.edu",
      admissionEmail: "admission@nitt.edu",
    },
    established: 1964,
    accreditation: {
      naac: { grade: "A++", score: 3.6 },
      nirf: { rank: 8, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹1.5 L", total: "₹6 L" },
        seats: 100,
        eligibility: "JEE Main",
        entranceExam: ["JEE Main"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 1800, fees: "₹80K/year" },
      library: { books: 400000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 400,
      phd: 350,
      studentRatio: "1:15",
    },
    placement: {
      averagePackage: "₹12 LPA",
      highestPackage: "₹80 LPA",
      placementPercentage: 92,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
      year: 2023,
    },
    admission: {
      process: "JEE Main + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["JEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹1500", registration: "₹3000" },
    },
    reviews: [
      {
        rating: 4,
        comment: "Good infrastructure and faculty",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["nit-trichy-1.jpg", "nit-trichy-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/nittrichy",
      twitter: "https://twitter.com/nittrichy",
      instagram: "https://instagram.com/nittrichy",
      linkedin: "https://linkedin.com/school/nit-trichy",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "5",
    name: "Birla Institute of Technology and Science Pilani",
    shortName: "BITS Pilani",
    type: "Private",
    location: {
      city: "Pilani",
      state: "Rajasthan",
      country: "India",
      pincode: "333031",
      address: "BITS Campus, Pilani",
    },
    contact: {
      phone: ["+91-1596-242210"],
      email: ["info@bits-pilani.ac.in"],
      website: "https://www.bits-pilani.ac.in",
      admissionEmail: "admission@bits-pilani.ac.in",
    },
    established: 1964,
    accreditation: {
      naac: { grade: "A++", score: 3.8 },
      nirf: { rank: 25, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹4 L", total: "₹16 L" },
        seats: 80,
        eligibility: "BITSAT",
        entranceExam: ["BITSAT"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 1200, fees: "₹1.5 L/year" },
      library: { books: 350000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 300,
      phd: 280,
      studentRatio: "1:12",
    },
    placement: {
      averagePackage: "₹14 LPA",
      highestPackage: "₹1 CPA",
      placementPercentage: 94,
      topRecruiters: ["Google", "Microsoft", "Amazon", "Apple"],
      year: 2023,
    },
    admission: {
      process: "BITSAT + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["BITSAT Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹3000", registration: "₹10000" },
    },
    reviews: [
      {
        rating: 5,
        comment: "Excellent placement record",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["bits-pilani-1.jpg", "bits-pilani-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/bitspilani",
      twitter: "https://twitter.com/bitspilani",
      instagram: "https://instagram.com/bitspilani",
      linkedin: "https://linkedin.com/school/bits-pilani",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "6",
    name: "Vellore Institute of Technology",
    shortName: "VIT Vellore",
    type: "Private",
    location: {
      city: "Vellore",
      state: "Tamil Nadu",
      country: "India",
      pincode: "632014",
      address: "VIT Campus, Vellore",
    },
    contact: {
      phone: ["+91-416-224-3091"],
      email: ["info@vit.ac.in"],
      website: "https://www.vit.ac.in",
      admissionEmail: "admission@vit.ac.in",
    },
    established: 1984,
    accreditation: {
      naac: { grade: "A++", score: 3.7 },
      nirf: { rank: 12, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹3.5 L", total: "₹14 L" },
        seats: 200,
        eligibility: "VITEEE",
        entranceExam: ["VITEEE"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 3000, fees: "₹1.2 L/year" },
      library: { books: 500000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 800,
      phd: 700,
      studentRatio: "1:15",
    },
    placement: {
      averagePackage: "₹8 LPA",
      highestPackage: "₹50 LPA",
      placementPercentage: 90,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
      year: 2023,
    },
    admission: {
      process: "VITEEE + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["VITEEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹2000", registration: "₹5000" },
    },
    reviews: [
      {
        rating: 4,
        comment: "Good infrastructure and placement",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["vit-vellore-1.jpg", "vit-vellore-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/vitvellore",
      twitter: "https://twitter.com/vitvellore",
      instagram: "https://instagram.com/vitvellore",
      linkedin: "https://linkedin.com/school/vit-vellore",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "7",
    name: "Indian Institute of Management Ahmedabad",
    shortName: "IIM Ahmedabad",
    type: "Government",
    location: {
      city: "Ahmedabad",
      state: "Gujarat",
      country: "India",
      pincode: "380015",
      address: "IIM Campus, Ahmedabad",
    },
    contact: {
      phone: ["+91-79-7152-3434"],
      email: ["info@iima.ac.in"],
      website: "https://www.iima.ac.in",
      admissionEmail: "admission@iima.ac.in",
    },
    established: 1961,
    accreditation: {
      naac: { grade: "A++", score: 3.9 },
      nirf: { rank: 1, year: 2023 },
      other: ["AACSB Accredited"],
    },
    courses: [
      {
        name: "Master of Business Administration",
        level: "PG",
        duration: "2 years",
        fees: { annual: "₹12.5 L", total: "₹25 L" },
        seats: 400,
        eligibility: "CAT",
        entranceExam: ["CAT"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 800, fees: "₹2 L/year" },
      library: { books: 200000, digital: true },
      labs: ["Computer Lab", "Finance Lab", "Marketing Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 120,
      phd: 110,
      studentRatio: "1:8",
    },
    placement: {
      averagePackage: "₹35 LPA",
      highestPackage: "₹1.5 CPA",
      placementPercentage: 100,
      topRecruiters: ["McKinsey", "BCG", "Bain", "Goldman Sachs"],
      year: 2023,
    },
    admission: {
      process: "CAT + Interview",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["CAT Score Card", "Graduation Marksheet", "Identity Proof"],
      fees: { application: "₹2000", registration: "₹10000" },
    },
    reviews: [
      {
        rating: 5,
        comment: "Best management institute in India",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["iim-ahmedabad-1.jpg", "iim-ahmedabad-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/iimahmedabad",
      twitter: "https://twitter.com/iimahmedabad",
      instagram: "https://instagram.com/iimahmedabad",
      linkedin: "https://linkedin.com/school/iim-ahmedabad",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "8",
    name: "All India Institute of Medical Sciences Delhi",
    shortName: "AIIMS Delhi",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110029",
      address: "AIIMS Campus, New Delhi",
    },
    contact: {
      phone: ["+91-11-2658-8500"],
      email: ["info@aiims.edu"],
      website: "https://www.aiims.edu",
      admissionEmail: "admission@aiims.edu",
    },
    established: 1956,
    accreditation: {
      naac: { grade: "A++", score: 3.9 },
      nirf: { rank: 1, year: 2023 },
      other: ["MCI Recognized"],
    },
    courses: [
      {
        name: "Bachelor of Medicine and Bachelor of Surgery",
        level: "UG",
        duration: "5.5 years",
        fees: { annual: "₹1.5 L", total: "₹8.25 L" },
        seats: 100,
        eligibility: "NEET",
        entranceExam: ["NEET"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 500, fees: "₹50K/year" },
      library: { books: 300000, digital: true },
      labs: ["Anatomy Lab", "Physiology Lab", "Pathology Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 800,
      phd: 750,
      studentRatio: "1:5",
    },
    placement: {
      averagePackage: "₹12 LPA",
      highestPackage: "₹50 LPA",
      placementPercentage: 100,
      topRecruiters: [
        "Government Hospitals",
        "Private Hospitals",
        "Research Institutes",
      ],
      year: 2023,
    },
    admission: {
      process: "NEET + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["NEET Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹1500", registration: "₹5000" },
    },
    reviews: [
      {
        rating: 5,
        comment: "Best medical college in India",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["aiims-delhi-1.jpg", "aiims-delhi-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/aiimsdelhi",
      twitter: "https://twitter.com/aiimsdelhi",
      instagram: "https://instagram.com/aiimsdelhi",
      linkedin: "https://linkedin.com/school/aiims-delhi",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "9",
    name: "Delhi University",
    shortName: "DU",
    type: "Government",
    location: {
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110007",
      address: "North Campus, Delhi",
    },
    contact: {
      phone: ["+91-11-2766-7000"],
      email: ["info@du.ac.in"],
      website: "https://www.du.ac.in",
      admissionEmail: "admission@du.ac.in",
    },
    established: 1922,
    accreditation: {
      naac: { grade: "A++", score: 3.7 },
      nirf: { rank: 11, year: 2023 },
      other: ["UGC Recognized"],
    },
    courses: [
      {
        name: "Bachelor of Arts",
        level: "UG",
        duration: "3 years",
        fees: { annual: "₹50K", total: "₹1.5 L" },
        seats: 1000,
        eligibility: "CUET",
        entranceExam: ["CUET"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 2000, fees: "₹30K/year" },
      library: { books: 1000000, digital: true },
      labs: ["Computer Lab", "Language Lab", "Science Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 2000,
      phd: 1800,
      studentRatio: "1:20",
    },
    placement: {
      averagePackage: "₹6 LPA",
      highestPackage: "₹25 LPA",
      placementPercentage: 85,
      topRecruiters: ["Government Jobs", "Private Companies", "NGOs"],
      year: 2023,
    },
    admission: {
      process: "CUET + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["CUET Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹1000", registration: "₹2000" },
    },
    reviews: [
      {
        rating: 4,
        comment: "Good academic environment",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["du-delhi-1.jpg", "du-delhi-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/delhiuniversity",
      twitter: "https://twitter.com/delhiuniversity",
      instagram: "https://instagram.com/delhiuniversity",
      linkedin: "https://linkedin.com/school/delhi-university",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "10",
    name: "SRM Institute of Science and Technology",
    shortName: "SRM University",
    type: "Private",
    location: {
      city: "Chennai",
      state: "Tamil Nadu",
      country: "India",
      pincode: "603203",
      address: "SRM Campus, Chennai",
    },
    contact: {
      phone: ["+91-44-2741-7000"],
      email: ["info@srmuniv.ac.in"],
      website: "https://www.srmuniv.ac.in",
      admissionEmail: "admission@srmuniv.ac.in",
    },
    established: 1985,
    accreditation: {
      naac: { grade: "A++", score: 3.6 },
      nirf: { rank: 35, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹3 L", total: "₹12 L" },
        seats: 300,
        eligibility: "SRMJEE",
        entranceExam: ["SRMJEE"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 4000, fees: "₹1 L/year" },
      library: { books: 400000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 1000,
      phd: 800,
      studentRatio: "1:18",
    },
    placement: {
      averagePackage: "₹7 LPA",
      highestPackage: "₹40 LPA",
      placementPercentage: 88,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
      year: 2023,
    },
    admission: {
      process: "SRMJEE + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["SRMJEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹1500", registration: "₹5000" },
    },
    reviews: [
      {
        rating: 4,
        comment: "Good infrastructure and placement",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["srm-university-1.jpg", "srm-university-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/srmuniversity",
      twitter: "https://twitter.com/srmuniversity",
      instagram: "https://instagram.com/srmuniversity",
      linkedin: "https://linkedin.com/school/srm-university",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "11",
    name: "Manipal Institute of Technology",
    shortName: "MIT Manipal",
    type: "Private",
    location: {
      city: "Manipal",
      state: "Karnataka",
      country: "India",
      pincode: "576104",
      address: "MIT Campus, Manipal",
    },
    contact: {
      phone: ["+91-820-292-2000"],
      email: ["info@manipal.edu"],
      website: "https://www.manipal.edu",
      admissionEmail: "admission@manipal.edu",
    },
    established: 1957,
    accreditation: {
      naac: { grade: "A++", score: 3.8 },
      nirf: { rank: 28, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹4 L", total: "₹16 L" },
        seats: 150,
        eligibility: "MET",
        entranceExam: ["MET"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 2000, fees: "₹1.5 L/year" },
      library: { books: 350000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 400,
      phd: 350,
      studentRatio: "1:15",
    },
    placement: {
      averagePackage: "₹9 LPA",
      highestPackage: "₹45 LPA",
      placementPercentage: 92,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
      year: 2023,
    },
    admission: {
      process: "MET + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["MET Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹2000", registration: "₹8000" },
    },
    reviews: [
      {
        rating: 4,
        comment: "Excellent campus life and academics",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["mit-manipal-1.jpg", "mit-manipal-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/mitmanipal",
      twitter: "https://twitter.com/mitmanipal",
      instagram: "https://instagram.com/mitmanipal",
      linkedin: "https://linkedin.com/school/mit-manipal",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
  {
    _id: "12",
    name: "Thapar Institute of Engineering and Technology",
    shortName: "TIET Patiala",
    type: "Private",
    location: {
      city: "Patiala",
      state: "Punjab",
      country: "India",
      pincode: "147004",
      address: "TIET Campus, Patiala",
    },
    contact: {
      phone: ["+91-175-239-3021"],
      email: ["info@thapar.edu"],
      website: "https://www.thapar.edu",
      admissionEmail: "admission@thapar.edu",
    },
    established: 1956,
    accreditation: {
      naac: { grade: "A++", score: 3.7 },
      nirf: { rank: 22, year: 2023 },
      other: ["NBA Accredited"],
    },
    courses: [
      {
        name: "Computer Science Engineering",
        level: "UG",
        duration: "4 years",
        fees: { annual: "₹3.5 L", total: "₹14 L" },
        seats: 120,
        eligibility: "JEE Main",
        entranceExam: ["JEE Main"],
      },
    ],
    facilities: {
      hostel: { available: true, capacity: 1500, fees: "₹1.2 L/year" },
      library: { books: 300000, digital: true },
      labs: ["Computer Lab", "Electronics Lab", "Physics Lab"],
      sports: ["Cricket", "Football", "Basketball", "Tennis"],
      other: ["Gym", "Swimming Pool", "Auditorium"],
    },
    faculty: {
      total: 300,
      phd: 250,
      studentRatio: "1:12",
    },
    placement: {
      averagePackage: "₹10 LPA",
      highestPackage: "₹35 LPA",
      placementPercentage: 90,
      topRecruiters: ["TCS", "Infosys", "Wipro", "Accenture"],
      year: 2023,
    },
    admission: {
      process: "JEE Main + Counseling",
      importantDates: [
        { event: "Application Start", date: new Date("2024-01-01") },
        { event: "Application End", date: new Date("2024-02-28") },
      ],
      documents: ["JEE Score Card", "Class 12 Marksheet", "Identity Proof"],
      fees: { application: "₹1500", registration: "₹5000" },
    },
    reviews: [
      {
        rating: 4,
        comment: "Good academics and placement",
        category: "Overall",
        author: "Student",
        date: new Date(),
      },
    ],
    images: ["tiet-patiala-1.jpg", "tiet-patiala-2.jpg"],
    socialMedia: {
      facebook: "https://facebook.com/tietpatiala",
      twitter: "https://twitter.com/tietpatiala",
      instagram: "https://instagram.com/tietpatiala",
      linkedin: "https://linkedin.com/school/tiet-patiala",
    },
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
    isActive: true,
  },
];

const dummyStories = [
  {
    _id: "1",
    title:
      "From Small Town to Silicon Valley: My Journey as a Software Engineer",
    author: {
      name: "Priya Sharma",
      currentRole: "Senior Software Engineer",
      company: "Google",
      experience: "5 years",
      profileImage: "priya-sharma.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/priya-sharma",
        twitter: "https://twitter.com/priya_sharma",
      },
    },
    content:
      "Growing up in a small town in Rajasthan, I never imagined I would one day work at Google in Silicon Valley. My journey began with a simple dream of becoming a computer engineer...",
    summary:
      "A inspiring story of how determination and hard work helped a small-town girl achieve her dreams in the tech industry.",
    category: "Success Story",
    tags: ["software engineering", "career growth", "motivation"],
    course: {
      name: "Computer Science Engineering",
      college: "IIT Delhi",
      year: 2018,
    },
    careerPath: {
      from: "Student",
      to: "Senior Software Engineer",
      timeline: "5 years",
    },
    keyAchievements: [
      "Graduated from IIT Delhi with distinction",
      "Got placed at Google through campus placement",
      "Led multiple high-impact projects",
      "Mentored 20+ junior engineers",
    ],
    challenges: [
      "Language barrier in initial days",
      "Adapting to fast-paced tech environment",
      "Work-life balance in demanding role",
    ],
    advice: [
      "Never give up on your dreams",
      "Continuous learning is key",
      "Build strong professional network",
      "Take calculated risks",
    ],
    images: ["priya-journey-1.jpg", "priya-journey-2.jpg"],
    readTime: 8,
    likes: 245,
    views: 1250,
    comments: [
      {
        author: "Rahul Kumar",
        content: "Very inspiring story! Thank you for sharing.",
        date: new Date(),
        likes: 12,
      },
    ],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "2",
    title: "From Dropout to Data Science Success: My Unconventional Journey",
    author: {
      name: "Rahul Kumar",
      currentRole: "Senior Data Scientist",
      company: "Microsoft",
      experience: "4 years",
      profileImage: "rahul-kumar.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/rahul-kumar",
        twitter: "https://twitter.com/rahul_kumar",
      },
    },
    content:
      "I dropped out of college after my second year, but that didn't stop me from pursuing my passion for data science. Through online courses, personal projects, and sheer determination, I built a successful career in one of the most competitive fields...",
    summary:
      "An inspiring story of how self-learning and determination led to a successful career in data science without a formal degree.",
    category: "Career Change",
    tags: ["data science", "self-learning", "career change"],
    course: {
      name: "Self-taught Data Science",
      college: "Online Learning",
      year: 2020,
    },
    careerPath: {
      from: "College Dropout",
      to: "Senior Data Scientist",
      timeline: "4 years",
    },
    keyAchievements: [
      "Completed 20+ online courses",
      "Built 50+ data science projects",
      "Landed job at Microsoft",
      "Mentored 100+ aspiring data scientists",
    ],
    challenges: [
      "Learning without formal structure",
      "Proving skills to employers",
      "Building credibility in the field",
      "Staying updated with latest trends",
    ],
    advice: [
      "Focus on practical projects",
      "Build a strong portfolio",
      "Network with professionals",
      "Never stop learning",
    ],
    images: ["rahul-journey-1.jpg", "rahul-journey-2.jpg"],
    readTime: 12,
    likes: 189,
    views: 890,
    comments: [],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "3",
    title: "Building a Tech Startup: Lessons from the Trenches",
    author: {
      name: "Anita Singh",
      currentRole: "Founder & CEO",
      company: "TechStart India",
      experience: "3 years",
      profileImage: "anita-singh.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/anita-singh",
        twitter: "https://twitter.com/anita_singh",
      },
    },
    content:
      "Starting a tech company was never part of my plan, but when I saw a problem that needed solving, I couldn't ignore it. Here's my journey from idea to a successful startup that's now helping thousands of students...",
    summary:
      "A candid account of the challenges and triumphs of building a tech startup from scratch.",
    category: "Entrepreneurship",
    tags: ["startup", "entrepreneurship", "technology"],
    course: {
      name: "Computer Science Engineering",
      college: "IIT Bombay",
      year: 2018,
    },
    careerPath: {
      from: "Software Engineer",
      to: "Founder & CEO",
      timeline: "3 years",
    },
    keyAchievements: [
      "Raised $2M in funding",
      "Built team of 25+ people",
      "Served 10,000+ students",
      "Expanded to 3 cities",
    ],
    challenges: [
      "Finding product-market fit",
      "Raising initial funding",
      "Building the right team",
      "Scaling the business",
    ],
    advice: [
      "Start with a real problem",
      "Validate before building",
      "Focus on customer feedback",
      "Be prepared for long hours",
    ],
    images: ["anita-startup-1.jpg", "anita-startup-2.jpg"],
    readTime: 15,
    likes: 156,
    views: 720,
    comments: [],
    isFeatured: false,
    isApproved: true,
  },
  {
    _id: "4",
    title: "From Medicine to Machine Learning: A Doctor's Journey into AI",
    author: {
      name: "Dr. Vikram Patel",
      currentRole: "AI Research Scientist",
      company: "DeepMind",
      experience: "6 years",
      profileImage: "vikram-patel.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/vikram-patel",
        twitter: "https://twitter.com/vikram_patel",
      },
    },
    content:
      "After completing my MBBS and working as a doctor for 3 years, I realized my true passion lay in using technology to solve healthcare problems. This is how I transitioned from practicing medicine to becoming an AI researcher at DeepMind, working on cutting-edge medical AI applications...",
    summary:
      "An inspiring story of a doctor who found his calling in AI and is now revolutionizing healthcare through technology.",
    category: "Career Change",
    tags: ["AI", "healthcare", "career change", "machine learning"],
    course: {
      name: "MBBS + Self-taught AI/ML",
      college: "AIIMS Delhi + Online Learning",
      year: 2017,
    },
    careerPath: {
      from: "Medical Doctor",
      to: "AI Research Scientist",
      timeline: "6 years",
    },
    keyAchievements: [
      "Published 15+ research papers in top AI journals",
      "Developed AI models for early disease detection",
      "Led team of 10+ AI researchers",
      "Received Google AI Research Award",
    ],
    challenges: [
      "Learning complex AI/ML concepts from scratch",
      "Balancing medical practice with learning",
      "Proving credibility in tech industry",
      "Managing imposter syndrome",
    ],
    advice: [
      "Leverage your domain expertise",
      "Start with practical applications",
      "Join AI communities and forums",
      "Don't be afraid to start over",
    ],
    images: ["vikram-ai-1.jpg", "vikram-ai-2.jpg"],
    readTime: 10,
    likes: 312,
    views: 1450,
    comments: [
      {
        author: "Dr. Sarah Johnson",
        content:
          "This is exactly what I needed to hear! Thank you for sharing your journey.",
        date: new Date(),
        likes: 8,
      },
    ],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "5",
    title: "Breaking Barriers: First Woman Engineer from My Village",
    author: {
      name: "Kavya Reddy",
      currentRole: "Senior Civil Engineer",
      company: "L&T Construction",
      experience: "7 years",
      profileImage: "kavya-reddy.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/kavya-reddy",
        twitter: "https://twitter.com/kavya_reddy",
      },
    },
    content:
      "Growing up in a small village in Andhra Pradesh, engineering was considered a 'man's field'. But I was determined to prove that women can excel in any field they choose. Today, I'm proud to be the first woman engineer from my village, working on major infrastructure projects...",
    summary:
      "A powerful story of breaking gender stereotypes and achieving success in a traditionally male-dominated field.",
    category: "Success Story",
    tags: [
      "women in engineering",
      "breaking barriers",
      "civil engineering",
      "inspiration",
    ],
    course: {
      name: "Civil Engineering",
      college: "NIT Warangal",
      year: 2016,
    },
    careerPath: {
      from: "Village Student",
      to: "Senior Civil Engineer",
      timeline: "7 years",
    },
    keyAchievements: [
      "First woman engineer from her village",
      "Led construction of 5 major bridges",
      "Mentored 50+ women engineers",
      "Received 'Woman Engineer of the Year' award",
    ],
    challenges: [
      "Fighting gender stereotypes",
      "Lack of support from community",
      "Proving competence in male-dominated field",
      "Balancing work and family expectations",
    ],
    advice: [
      "Believe in yourself and your abilities",
      "Find mentors who support you",
      "Don't let others define your limits",
      "Use your success to help others",
    ],
    images: ["kavya-construction-1.jpg", "kavya-construction-2.jpg"],
    readTime: 9,
    likes: 278,
    views: 1680,
    comments: [
      {
        author: "Priya Nair",
        content:
          "You're such an inspiration! Thank you for paving the way for other women.",
        date: new Date(),
        likes: 15,
      },
    ],
    isFeatured: true,
    isApproved: true,
  },
  {
    _id: "6",
    title: "From Arts to Analytics: My Unconventional Career Pivot",
    author: {
      name: "Arjun Mehta",
      currentRole: "Lead Data Analyst",
      company: "Amazon",
      experience: "4 years",
      profileImage: "arjun-mehta.jpg",
      socialLinks: {
        linkedin: "https://linkedin.com/in/arjun-mehta",
        twitter: "https://twitter.com/arjun_mehta",
      },
    },
    content:
      "With a degree in English Literature, everyone expected me to become a teacher or writer. But I discovered my love for numbers and patterns during a part-time job. Today, I'm a Lead Data Analyst at Amazon, proving that your degree doesn't define your career path...",
    summary:
      "A refreshing story of how following your interests can lead to unexpected and successful career paths.",
    category: "Career Change",
    tags: [
      "career pivot",
      "data analytics",
      "arts to tech",
      "unconventional path",
    ],
    course: {
      name: "English Literature + Data Analytics Certification",
      college: "Delhi University + Online Learning",
      year: 2019,
    },
    careerPath: {
      from: "English Literature Graduate",
      to: "Lead Data Analyst",
      timeline: "4 years",
    },
    keyAchievements: [
      "Completed 12+ data science certifications",
      "Built 30+ analytical dashboards",
      "Led data-driven decision making for $50M+ projects",
      "Mentored 20+ career changers",
    ],
    challenges: [
      "Learning technical skills from scratch",
      "Overcoming imposter syndrome",
      "Explaining career change to family",
      "Competing with CS graduates",
    ],
    advice: [
      "Your background gives you unique perspective",
      "Focus on transferable skills",
      "Build a strong portfolio",
      "Network with people in your target field",
    ],
    images: ["arjun-analytics-1.jpg", "arjun-analytics-2.jpg"],
    readTime: 11,
    likes: 198,
    views: 920,
    comments: [
      {
        author: "Sneha Gupta",
        content:
          "This gives me hope! I'm also from arts background and want to switch to tech.",
        date: new Date(),
        likes: 6,
      },
    ],
    isFeatured: false,
    isApproved: true,
  },
];

const dummyFaqs = [
  {
    question: "What is the eligibility criteria for JEE Advanced?",
    answer:
      "To be eligible for JEE Advanced, you must have qualified JEE Main and be among the top 2,50,000 candidates. You should also have passed Class 12 or equivalent examination in 2022, 2023, or appearing in 2024.",
    category: "Admissions",
    subcategory: "JEE",
    tags: ["JEE Advanced", "eligibility", "admission"],
    priority: 10,
    helpful: { yes: 150, no: 5 },
    views: 2500,
  },
  {
    question: "How to prepare for computer science engineering?",
    answer:
      "To prepare for computer science engineering, focus on mathematics, physics, and chemistry for entrance exams. Learn programming languages like C, C++, Python. Practice problem-solving and develop logical thinking skills.",
    category: "Career Guidance",
    subcategory: "Engineering",
    tags: ["computer science", "preparation", "programming"],
    priority: 9,
    helpful: { yes: 200, no: 10 },
    views: 3200,
  },
  {
    question:
      "What are the career opportunities after B.Tech in Computer Science?",
    answer:
      "After B.Tech in Computer Science, you can work as Software Engineer, Data Scientist, Web Developer, Mobile App Developer, DevOps Engineer, or pursue higher studies like M.Tech, MBA, or PhD.",
    category: "Career Guidance",
    subcategory: "Engineering",
    tags: ["career", "computer science", "opportunities"],
    priority: 8,
    helpful: { yes: 180, no: 8 },
    views: 2800,
  },
];

const dummyAnalytics = {
  totalUsers: 15420,
  totalQuizAttempts: 28450,
  totalStories: 1250,
  totalColleges: 850,
  totalFaqs: 200,
  monthlyStats: {
    newUsers: 1250,
    quizCompletions: 2100,
    storyViews: 15000,
    collegeSearches: 8500,
  },
  popularCourses: [
    { name: "Computer Science Engineering", searches: 4500 },
    { name: "Mechanical Engineering", searches: 3200 },
    { name: "Electronics Engineering", searches: 2800 },
    { name: "Civil Engineering", searches: 2100 },
  ],
  topColleges: [
    { name: "IIT Delhi", views: 8500 },
    { name: "IIT Bombay", views: 7800 },
    { name: "IIT Madras", views: 7200 },
    { name: "NIT Trichy", views: 6500 },
  ],
};

module.exports = {
  dummyRoadmaps,
  dummyColleges,
  dummyStories,
  dummyFaqs,
  dummyAnalytics,
};
