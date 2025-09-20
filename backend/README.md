# Career Guidance Backend API

A robust Node.js and Express.js backend service for the Career Guidance Platform. This microservice provides RESTful APIs for career assessment, college information, success stories, and more.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (optional - runs with dummy data if not connected)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp env.example .env
   ```

3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/career-guidance
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── models/          # Mongoose schemas
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   ├── data/            # Dummy data
│   └── index.js         # Application entry point
├── package.json
├── env.example
└── README.md
```

## 🛠️ Technology Stack

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **Mongoose**: MongoDB object modeling
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Morgan**: HTTP request logger
- **Joi**: Data validation
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-rate-limit**: Rate limiting

## 📊 API Endpoints

### Health Check
- `GET /health` - Server health status

### Quiz API
- `POST /api/quiz` - Submit quiz results
- `GET /api/quiz/results` - Get user quiz results

### Roadmap API
- `GET /api/roadmap` - Get all roadmaps
- `GET /api/roadmap/:course` - Get specific roadmap
- `GET /api/roadmap/search` - Search roadmaps
- `GET /api/roadmap/categories` - Get categories

### Colleges API
- `GET /api/colleges` - Get all colleges
- `GET /api/colleges/:id` - Get specific college
- `GET /api/colleges/search` - Search colleges
- `POST /api/colleges/compare` - Compare colleges
- `GET /api/colleges/stats` - Get statistics

### Stories API
- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get specific story
- `GET /api/stories/search` - Search stories
- `GET /api/stories/featured` - Get featured stories
- `GET /api/stories/categories` - Get categories
- `POST /api/stories/:id/like` - Like a story
- `POST /api/stories/:id/comments` - Add comment

### FAQ API
- `GET /api/faq` - Get all FAQs
- `GET /api/faq/:id` - Get specific FAQ
- `GET /api/faq/search` - Search FAQs
- `GET /api/faq/categories` - Get categories
- `POST /api/faq/query` - Submit chatbot query
- `POST /api/faq/:id/helpful` - Mark FAQ as helpful

### Analytics API
- `GET /api/analytics` - Get dashboard data
- `GET /api/analytics/engagement` - Get engagement metrics
- `GET /api/analytics/performance` - Get performance data
- `GET /api/analytics/health` - Get system health

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/admin/counselor),
  profile: {
    age: Number,
    grade: String,
    interests: [String],
    location: String,
    phone: String
  },
  quizResults: [ObjectId],
  preferences: {
    language: String,
    notifications: Object
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### QuizResult Model
```javascript
{
  userId: ObjectId,
  answers: [{
    questionId: String,
    question: String,
    selectedOption: String,
    category: String
  }],
  scores: {
    technical: Number,
    creative: Number,
    analytical: Number,
    social: Number,
    leadership: Number
  },
  recommendedCourses: [Object],
  personalityType: String,
  strengths: [String],
  areasForImprovement: [String],
  completionTime: Number,
  submittedAt: Date
}
```

### Roadmap Model
```javascript
{
  courseName: String,
  description: String,
  category: String,
  duration: String,
  difficulty: String,
  prerequisites: [String],
  careerPaths: [Object],
  timeline: [Object],
  resources: Object,
  institutions: [Object],
  marketDemand: Object,
  tags: [String],
  isActive: Boolean
}
```

### College Model
```javascript
{
  name: String,
  shortName: String,
  type: String,
  location: Object,
  contact: Object,
  established: Number,
  accreditation: Object,
  courses: [Object],
  facilities: Object,
  faculty: Object,
  placement: Object,
  admission: Object,
  reviews: [Object],
  images: [String],
  socialMedia: Object,
  isActive: Boolean
}
```

### Story Model
```javascript
{
  title: String,
  author: Object,
  content: String,
  summary: String,
  category: String,
  tags: [String],
  course: Object,
  careerPath: Object,
  keyAchievements: [String],
  challenges: [String],
  advice: [String],
  images: [String],
  readTime: Number,
  likes: Number,
  views: Number,
  comments: [Object],
  isFeatured: Boolean,
  isApproved: Boolean,
  publishedAt: Date
}
```

### FAQ Model
```javascript
{
  question: String (unique),
  answer: String,
  category: String,
  subcategory: String,
  tags: [String],
  priority: Number,
  relatedQuestions: [ObjectId],
  helpful: {
    yes: Number,
    no: Number
  },
  views: Number,
  lastUpdated: Date,
  isActive: Boolean
}
```

## 🔧 Middleware

### Security Middleware
- **Helmet**: Sets security headers
- **CORS**: Configures cross-origin requests
- **Rate Limiting**: Prevents abuse with request throttling

### Custom Middleware
- **Error Handler**: Centralized error handling
- **Logger**: Request logging with Morgan
- **Authentication**: JWT token validation (future)

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}
```

## 🔒 Security Features

- **CORS Protection**: Configurable cross-origin policies
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Data sanitization and validation
- **Error Handling**: Secure error messages
- **Helmet**: Security headers
- **Password Hashing**: bcryptjs for secure passwords

## 📊 Dummy Data

The application includes comprehensive dummy data for:
- Sample roadmaps and courses
- College information and rankings
- Success stories and testimonials
- FAQ database for chatbot
- Analytics and statistics

## 🚀 Deployment

### Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career-guidance
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Checklist
- [ ] Set secure JWT secret
- [ ] Configure MongoDB Atlas
- [ ] Set up CORS for production domain
- [ ] Enable rate limiting
- [ ] Set up logging
- [ ] Configure error handling
- [ ] Set up monitoring

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- **Connection Pooling**: MongoDB connection optimization
- **Caching**: Response caching strategies
- **Compression**: Gzip compression
- **Rate Limiting**: API throttling
- **Error Handling**: Efficient error responses

## 🔍 Monitoring

- **Health Check**: `/health` endpoint
- **Request Logging**: Morgan HTTP logger
- **Error Tracking**: Centralized error handling
- **Performance Metrics**: Response time tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the dummy data structure
- Test endpoints with provided examples

---

**Note**: This backend runs with dummy data by default. Connect to MongoDB Atlas for production use by adding your connection string to the environment variables.
