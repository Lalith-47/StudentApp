# 🎓 Smart Student Hub

> **A comprehensive platform for student achievement tracking, digital portfolios, and institutional analytics**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Flutter](https://img.shields.io/badge/Flutter-3.0+-blue.svg)](https://flutter.dev/)
[![Azure Cosmos DB](https://img.shields.io/badge/Azure%20Cosmos%20DB-MongoDB%20API-purple.svg)](https://azure.microsoft.com/en-us/services/cosmos-db/)

## 🌟 Overview

Smart Student Hub is a comprehensive platform that transforms how educational institutions track, manage, and showcase student achievements. Built with modern web technologies and integrated with Azure Cosmos DB, it provides a complete solution for student portfolio management, faculty approval workflows, and institutional analytics.

## ✨ Key Features

### 🎯 For Students

- **Dynamic Dashboard**: Real-time updates on academic performance and activity credits
- **Activity Tracker**: Upload achievements with proof documents and media
- **Digital Portfolio**: Auto-generated, shareable portfolios with professional themes
- **Mobile App**: Full-featured Flutter app for iOS and Android
- **Achievement Analytics**: Track progress and skill development

### 👨‍🏫 For Faculty

- **Approval Panel**: Streamlined review and approval workflows
- **Performance Tracking**: Monitor student engagement and achievements
- **Quality Control**: Verification and scoring systems
- **Workload Management**: Efficient assignment and review processes

### 🏫 For Institutions

- **Analytics Dashboard**: Comprehensive institutional insights
- **Compliance Reporting**: NAAC, AICTE, and NIRF report generation
- **Data Consolidation**: Centralized student achievement tracking
- **Integration Support**: LMS/ERP system connectivity

## 🏗️ Architecture

### Backend (Node.js + Express)

- **Database**: Azure Cosmos DB with MongoDB API
- **Authentication**: JWT-based with role-based access control
- **File Storage**: Local storage with multer for uploads
- **PDF Generation**: PDFKit for portfolio exports
- **API**: RESTful APIs with comprehensive documentation

### Frontend (React + Vite)

- **Framework**: React 18 with modern hooks
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Query for server state
- **Routing**: React Router DOM
- **Internationalization**: i18next support

### Mobile (Flutter)

- **Cross-platform**: iOS and Android support
- **State Management**: Riverpod for reactive programming
- **Offline Support**: Local storage with Hive
- **Authentication**: Biometric and JWT support
- **Notifications**: Push notifications with Firebase

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Azure Cosmos DB account
- Flutter SDK (for mobile development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lalith-47/StudentApp.git
   cd StudentApp
   ```

2. **Setup Azure Cosmos DB**

   ```bash
   # Run the automated setup script
   ./setup-cosmos-db.sh
   ```

3. **Manual Setup**

   ```bash
   # Backend setup
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your Cosmos DB connection string
   npm run dev

   # Frontend setup (in another terminal)
   cd frontend
   npm install
   npm run dev
   ```

4. **Mobile App Setup**
   ```bash
   cd mobile
   flutter pub get
   flutter run
   ```

### Environment Configuration

#### Backend (.env)

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-student-hub
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Student Hub
```

## 📊 Database Schema

### Collections

- **users**: User accounts and profiles
- **activities**: Student activities and achievements
- **portfolios**: Digital portfolios
- **facultyapprovals**: Faculty review workflows
- **analytics**: Institutional analytics and reports

### Key Models

```javascript
// User Model
{
  name: String,
  email: String (unique),
  role: ['student', 'faculty', 'admin'],
  profile: {
    department: String,
    year: String,
    rollNumber: String
  }
}

// Activity Model
{
  title: String,
  description: String,
  category: String,
  status: ['draft', 'pending', 'approved', 'rejected'],
  studentId: ObjectId,
  attachments: [File],
  skills: [String],
  achievements: [String]
}
```

## 🔧 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Activity Endpoints

- `GET /api/activities` - Get user activities
- `POST /api/activities` - Create new activity
- `PUT /api/activities/:id` - Update activity
- `DELETE /api/activities/:id` - Delete activity
- `POST /api/activities/:id/attachments` - Upload attachments

### Portfolio Endpoints

- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio` - Create/update portfolio
- `GET /api/portfolio/pdf` - Download PDF portfolio
- `GET /api/portfolio/share/:id` - Get shareable link

### Faculty Endpoints

- `GET /api/faculty/pending` - Get pending approvals
- `POST /api/faculty/approve/:id` - Approve activity
- `POST /api/faculty/reject/:id` - Reject activity

### Analytics Endpoints

- `GET /api/analytics/dashboard` - Get analytics dashboard
- `POST /api/analytics/report` - Generate institutional report
- `GET /api/analytics/naac` - Generate NAAC compliance report

## 📱 Mobile App Features

### Core Features

- **Offline Portfolio Viewing**: Access portfolios without internet
- **Push Notifications**: Real-time updates for approvals
- **Camera Integration**: Direct photo capture for activities
- **Biometric Authentication**: Secure access with fingerprints
- **Dark Mode**: Automatic theme switching

### Technical Stack

- **Framework**: Flutter 3.0+
- **State Management**: Riverpod
- **Local Storage**: Hive
- **HTTP Client**: Dio with Retrofit
- **Authentication**: Local Auth + JWT
- **Notifications**: Firebase Messaging

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Admin, Faculty, Student roles
- **File Upload Security**: Type validation and size limits
- **Data Encryption**: Sensitive data encryption
- **Audit Logging**: Complete activity tracking
- **Rate Limiting**: API request throttling

## 📈 Analytics & Reporting

### Student Analytics

- Activity completion rates
- Skill development tracking
- Achievement summaries
- Portfolio performance metrics

### Faculty Analytics

- Approval workload tracking
- Review performance metrics
- Student engagement insights
- Quality assessment scores

### Institutional Analytics

- NAAC compliance reporting
- AICTE compliance tracking
- NIRF ranking support
- Department-wise analytics
- Student success metrics

## 🚀 Deployment

### Production Setup

```bash
# Set production environment
export NODE_ENV=production
export MONGODB_URI="your-production-connection-string"

# Start with PM2
pm2 start ecosystem.config.js

# Or with Docker
docker-compose up -d
```

### Azure Deployment

```bash
# Deploy to Azure App Service
az webapp deployment source config-zip \
  --resource-group myResourceGroup \
  --name myAppName \
  --src myApp.zip
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
npm run test:coverage
```

### Frontend Testing

```bash
cd frontend
npm test
npm run test:coverage
```

### Mobile Testing

```bash
cd mobile
flutter test
flutter test --coverage
```

## 📚 Documentation

- [Architecture Guide](SMART_STUDENT_HUB_ARCHITECTURE.md)
- [Cosmos DB Setup](COSMOS_DB_SETUP.md)
- [API Documentation](docs/API.md)
- [Mobile App Guide](docs/MOBILE.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [GitHub Wiki](https://github.com/Lalith-47/StudentApp/wiki)
- **Issues**: [GitHub Issues](https://github.com/Lalith-47/StudentApp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Lalith-47/StudentApp/discussions)

## 🙏 Acknowledgments

- Azure Cosmos DB for scalable database infrastructure
- React and Flutter communities for excellent frameworks
- Open source contributors and maintainers
- Educational institutions for feedback and requirements

---

**🎉 Built with ❤️ for the future of education**

[![GitHub stars](https://img.shields.io/github/stars/Lalith-47/StudentApp?style=social)](https://github.com/Lalith-47/StudentApp)
[![GitHub forks](https://img.shields.io/github/forks/Lalith-47/StudentApp?style=social)](https://github.com/Lalith-47/StudentApp)
[![GitHub watchers](https://img.shields.io/github/watchers/Lalith-47/StudentApp?style=social)](https://github.com/Lalith-47/StudentApp)
