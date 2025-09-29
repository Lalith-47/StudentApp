# 🚀 Smart Student Hub - Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Smart Student Hub to various platforms.

## 📋 Prerequisites

### Required Services
- **Azure Cosmos DB Account** with MongoDB API
- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- **Flutter SDK** (for mobile development)

### Optional Services
- **Azure App Service** (for web deployment)
- **Azure Storage** (for file storage)
- **Azure CDN** (for static assets)
- **GitHub Actions** (for CI/CD)

## 🔧 Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/Lalith-47/StudentApp.git
cd StudentApp
```

### 2. Azure Cosmos DB Setup
```bash
# Run automated setup
./setup-cosmos-db.sh

# Or manual setup
cd backend
cp env.example .env
# Edit .env with your Cosmos DB connection string
```

### 3. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Mobile (optional)
cd ../mobile
flutter pub get
```

## 🌐 Web Deployment

### Option 1: Azure App Service

#### 1. Create Azure App Service
```bash
# Install Azure CLI
az login
az group create --name SmartStudentHub --location eastus
az appservice plan create --name SmartStudentHubPlan --resource-group SmartStudentHub --sku B1
az webapp create --name smart-student-hub --resource-group SmartStudentHub --plan SmartStudentHubPlan --runtime "NODE|18-lts"
```

#### 2. Configure Environment Variables
```bash
# Set environment variables in Azure portal
az webapp config appsettings set --name smart-student-hub --resource-group SmartStudentHub --settings \
  MONGODB_URI="your-cosmos-db-connection-string" \
  NODE_ENV="production" \
  JWT_SECRET="your-jwt-secret" \
  FRONTEND_URL="https://your-frontend-url.com"
```

#### 3. Deploy Backend
```bash
# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group SmartStudentHub \
  --name smart-student-hub \
  --src backend.zip
```

### Option 2: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

#### 2. Build and Run
```bash
# Build Docker image
docker build -t smart-student-hub-backend ./backend

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI="your-connection-string" \
  -e NODE_ENV="production" \
  smart-student-hub-backend
```

#### 3. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - NODE_ENV=production
    volumes:
      - ./uploads:/app/uploads
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### Option 3: Vercel Deployment

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy Backend
```bash
cd backend
vercel --prod
```

#### 3. Deploy Frontend
```bash
cd frontend
vercel --prod
```

## 📱 Mobile App Deployment

### Android Deployment

#### 1. Build APK
```bash
cd mobile
flutter build apk --release
```

#### 2. Build App Bundle
```bash
flutter build appbundle --release
```

#### 3. Upload to Play Store
- Go to [Google Play Console](https://play.google.com/console)
- Upload the generated `.aab` file
- Complete store listing and publish

### iOS Deployment

#### 1. Build iOS App
```bash
flutter build ios --release
```

#### 2. Archive and Upload
- Open Xcode
- Archive the project
- Upload to App Store Connect
- Submit for review

## 🔄 CI/CD Pipeline

### GitHub Actions

#### 1. Create Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Smart Student Hub

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm ci
      - run: cd backend && npm test
      - run: cd backend && npm run build
      - name: Deploy to Azure
        uses: azure/webapps-deploy@v2
        with:
          app-name: 'smart-student-hub'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: './backend'

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci
      - run: cd frontend && npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

## 📊 Monitoring and Logging

### Application Insights
```javascript
// backend/src/config/insights.js
const appInsights = require('applicationinsights');
appInsights.setup('your-instrumentation-key').start();
```

### Health Checks
```bash
# Check backend health
curl https://your-backend-url.com/health

# Check database connection
curl https://your-backend-url.com/health/database
```

### Logging Configuration
```javascript
// backend/src/config/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## 🔒 Security Configuration

### Environment Variables
```bash
# Production environment variables
export NODE_ENV=production
export MONGODB_URI="your-secure-connection-string"
export JWT_SECRET="your-super-secure-jwt-secret"
export FRONTEND_URL="https://your-frontend-domain.com"
export CORS_ORIGIN="https://your-frontend-domain.com"
```

### SSL/TLS Configuration
```javascript
// backend/src/config/ssl.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/private-key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

https.createServer(options, app).listen(443);
```

## 📈 Performance Optimization

### Database Optimization
```javascript
// backend/src/config/database.js
const connectionOptions = {
  maxPoolSize: 10,
  minPoolSize: 1,
  maxIdleTimeMS: 120000,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000
};
```

### Caching Strategy
```javascript
// backend/src/middleware/cache.js
const redis = require('redis');
const client = redis.createClient();

const cache = (duration) => {
  return (req, res, next) => {
    const key = req.originalUrl;
    client.get(key, (err, data) => {
      if (data) {
        res.send(JSON.parse(data));
      } else {
        res.sendResponse = res.send;
        res.send = (body) => {
          client.setex(key, duration, body);
          res.sendResponse(body);
        };
        next();
      }
    });
  };
};
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Test database connection
cd backend
node test-cosmos-connection.js
```

#### 2. Build Failures
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Mobile Build Issues
```bash
# Flutter clean and rebuild
cd mobile
flutter clean
flutter pub get
flutter build apk --release
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Enable mongoose debug
DEBUG=mongoose* npm run dev
```

## 📞 Support

### Documentation
- [Architecture Guide](SMART_STUDENT_HUB_ARCHITECTURE.md)
- [Cosmos DB Setup](COSMOS_DB_SETUP.md)
- [API Documentation](docs/API.md)

### Community Support
- [GitHub Issues](https://github.com/Lalith-47/StudentApp/issues)
- [GitHub Discussions](https://github.com/Lalith-47/StudentApp/discussions)

### Professional Support
- Azure Support Portal
- Microsoft Documentation
- Flutter Community

---

**🎉 Your Smart Student Hub is now deployed and ready to serve students, faculty, and institutions!**
