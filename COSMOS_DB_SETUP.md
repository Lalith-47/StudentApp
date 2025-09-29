# Azure Cosmos DB Setup for Smart Student Hub

## 🎯 Overview
This guide provides complete instructions for setting up the Smart Student Hub with Azure Cosmos DB MongoDB API.

## 🔗 Connection Details
- **Connection String**: `mongodb+srv://AdhyayanMargAdmin:<TeDxE85wcWtfmq7Q0g#C>@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`
- **Database Name**: `smart-student-hub`
- **API**: MongoDB 4.2
- **Consistency Level**: Session

## 🚀 Quick Setup

### Option 1: Automated Setup
```bash
# Run the automated Cosmos DB setup script
./setup-cosmos-db.sh
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
cd backend
npm install

# 2. Create environment file
cp env.example .env

# 3. Update .env with Cosmos DB connection string
# Edit backend/.env and set:
# MONGODB_URI=mongodb+srv://AdhyayanMargAdmin:<TeDxE85wcWtfmq7Q0g#C>@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000

# 4. Test connection
node test-cosmos-connection.js

# 5. Run migration
node src/scripts/migrate-to-smart-hub.js

# 6. Start the application
npm run dev
```

## 🔧 Configuration

### Environment Variables
```env
# Backend (.env)
MONGODB_URI=mongodb+srv://AdhyayanMargAdmin:<TeDxE85wcWtfmq7Q0g#C>@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
NODE_ENV=production
PORT=5000
JWT_SECRET=smart-student-hub-super-secret-jwt-key-2024
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Connection Options
```javascript
const connectionOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  maxIdleTimeMS: 120000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false, // Cosmos DB doesn't support retryable writes
  maxPoolSize: 10, // Limit connection pool size
  minPoolSize: 1,
  socketTimeoutMS: 45000,
  bufferMaxEntries: 0, // Disable mongoose buffering
  bufferCommands: false, // Disable mongoose buffering
};
```

## 📊 Database Schema

### Collections Created
1. **users** - User accounts and profiles
2. **activities** - Student activities and achievements
3. **portfolios** - Digital portfolios
4. **facultyapprovals** - Faculty review workflows
5. **analytics** - Institutional analytics and reports

### Indexes (Auto-created)
- User email (unique)
- Activity studentId + status
- Portfolio studentId (unique)
- FacultyApproval facultyId + status
- Analytics institutionId + reportType

## 🚀 Running the Application

### Start All Services
```bash
./start-cosmos-hub.sh
```

### Start Individual Services
```bash
# Backend only
./start-backend-cosmos.sh

# Frontend only
./start-frontend-cosmos.sh
```

### Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 🔍 Monitoring & Health Checks

### Health Check Endpoint
```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": {
    "status": "connected",
    "readyState": "connected",
    "host": "adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com",
    "port": 27017,
    "name": "smart-student-hub",
    "retries": 0,
    "healthy": true
  }
}
```

### Azure Portal Monitoring
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Cosmos DB account
3. Monitor:
   - Request Units (RU) consumption
   - Connection count
   - Query performance
   - Storage usage

## 🛠️ Troubleshooting

### Common Issues

#### 1. Connection Timeout
**Error**: `MongooseServerSelectionError: connection timeout`
**Solution**: 
- Check internet connection
- Verify connection string
- Increase `serverSelectionTimeoutMS`

#### 2. Authentication Failed
**Error**: `MongoError: Authentication failed`
**Solution**:
- Verify username/password in connection string
- Check if account is active
- Ensure proper URL encoding

#### 3. Rate Limiting
**Error**: `MongoError: Request rate is large`
**Solution**:
- Increase RU allocation in Azure portal
- Implement request throttling
- Optimize queries

#### 4. Query Performance
**Error**: Slow query execution
**Solution**:
- Add appropriate indexes
- Use projection to limit fields
- Optimize aggregation pipelines

### Debug Mode
```bash
# Enable mongoose debug logging
DEBUG=mongoose* npm run dev

# Enable all debug logging
DEBUG=* npm run dev
```

### Connection Test
```bash
# Test Cosmos DB connection
cd backend
node test-cosmos-connection.js
```

## 💰 Cost Optimization

### Request Units (RU) Management
- **Default RU**: 400 RU/s
- **Monitor consumption** in Azure portal
- **Optimize queries** to reduce RU usage
- **Use appropriate consistency levels**

### Best Practices
1. **Use projection** to limit returned fields
2. **Implement pagination** for large datasets
3. **Cache frequently accessed data**
4. **Optimize aggregation pipelines**
5. **Use appropriate indexes**

### RU Consumption Examples
- Simple read: 1 RU
- Simple write: 5 RU
- Complex aggregation: 10-50 RU
- Large document write: 10-20 RU

## 🔒 Security

### Connection Security
- **TLS enabled** by default
- **SCRAM-SHA-256** authentication
- **Firewall rules** in Azure portal
- **IP whitelisting** for production

### Environment Security
```bash
# Never commit .env files
echo ".env" >> .gitignore
echo "*.env" >> .gitignore

# Use environment variables in production
export MONGODB_URI="your-connection-string"
```

## 📈 Performance Optimization

### Connection Pooling
```javascript
// Optimized for Cosmos DB
const connectionOptions = {
  maxPoolSize: 10, // Limit connections
  minPoolSize: 1,  // Minimum connections
  maxIdleTimeMS: 120000, // 2 minutes
  serverSelectionTimeoutMS: 30000, // 30 seconds
};
```

### Query Optimization
```javascript
// Use projection
User.find({ role: 'student' }).select('name email role')

// Use indexes
Activity.find({ studentId, status: 'approved' }).sort({ createdAt: -1 })

// Limit results
Activity.find({}).limit(20).skip(0)
```

### Caching Strategy
```javascript
// Implement Redis caching for frequently accessed data
const cacheKey = `user:${userId}`;
const cachedUser = await redis.get(cacheKey);
if (cachedUser) {
  return JSON.parse(cachedUser);
}
```

## 🚀 Deployment

### Production Environment
```bash
# Set production environment
export NODE_ENV=production
export MONGODB_URI="your-production-connection-string"

# Start with PM2
pm2 start ecosystem.config.js

# Or with Docker
docker-compose up -d
```

### Docker Configuration
```dockerfile
# Dockerfile for Cosmos DB
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 Additional Resources

### Documentation
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

### Monitoring Tools
- [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/)
- [Application Insights](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

### Support
- **Azure Support**: [Azure Portal Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
- **Community**: [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cosmosdb)
- **GitHub Issues**: [Smart Student Hub Issues](https://github.com/your-repo/issues)

---

**🎉 Your Smart Student Hub is now configured with Azure Cosmos DB!**

For any issues or questions, refer to the troubleshooting section or contact support.
