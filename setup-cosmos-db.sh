#!/bin/bash

# Azure Cosmos DB Setup Script for Smart Student Hub
# This script configures the Smart Student Hub to work with Azure Cosmos DB

set -e

echo "🚀 Smart Student Hub - Azure Cosmos DB Setup"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Azure Cosmos DB connection string
COSMOS_CONNECTION_STRING="mongodb+srv://AdhyayanMargAdmin:<TeDxE85wcWtfmq7Q0g#C>@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"

print_status "Setting up Azure Cosmos DB configuration..."

# Create backend .env file
print_status "Creating backend environment file..."
cat > backend/.env << EOF
# Smart Student Hub - Azure Cosmos DB Configuration
PORT=5000
NODE_ENV=production

# Azure Cosmos DB MongoDB Configuration
MONGODB_URI=${COSMOS_CONNECTION_STRING}

# JWT Configuration
JWT_SECRET=smart-student-hub-super-secret-jwt-key-2024
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting (optimized for Cosmos DB)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Azure Cosmos DB specific settings
COSMOS_DB_NAME=smart-student-hub
COSMOS_DB_THROUGHPUT=400
COSMOS_DB_CONSISTENCY_LEVEL=Session

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads

# Security Configuration
BCRYPT_ROUNDS=12
SESSION_SECRET=smart-student-hub-session-secret-2024

# Monitoring Configuration
HEALTH_CHECK_INTERVAL=30000
CONNECTION_POOL_SIZE=10
EOF

print_success "Backend environment file created"

# Create frontend .env file
print_status "Creating frontend environment file..."
cat > frontend/.env << EOF
# Smart Student Hub Frontend Configuration
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Smart Student Hub
VITE_APP_VERSION=1.0.0
VITE_COSMOS_DB_ENABLED=true
EOF

print_success "Frontend environment file created"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install

# Install additional packages for Cosmos DB optimization
print_status "Installing Cosmos DB optimization packages..."
npm install --save mongoose-connection-pool

print_success "Backend dependencies installed"
cd ..

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd frontend
npm install
print_success "Frontend dependencies installed"
cd ..

# Create uploads directories
print_status "Creating upload directories..."
mkdir -p backend/uploads/activities
mkdir -p backend/uploads/portfolios
mkdir -p backend/uploads/temp
print_success "Upload directories created"

# Test Cosmos DB connection
print_status "Testing Azure Cosmos DB connection..."
cd backend
node -e "
const mongoose = require('mongoose');
const connectionString = '${COSMOS_CONNECTION_STRING}';

mongoose.connect(connectionString, {
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
})
.then(() => {
  console.log('✅ Successfully connected to Azure Cosmos DB');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Failed to connect to Azure Cosmos DB:', error.message);
  process.exit(1);
});
"

if [ $? -eq 0 ]; then
    print_success "Azure Cosmos DB connection test successful"
else
    print_error "Azure Cosmos DB connection test failed"
    exit 1
fi

cd ..

# Run database migration
print_status "Running database migration for Azure Cosmos DB..."
cd backend
node src/scripts/migrate-to-smart-hub.js

if [ $? -eq 0 ]; then
    print_success "Database migration completed successfully"
else
    print_error "Database migration failed"
    exit 1
fi

cd ..

# Create startup scripts for Cosmos DB
print_status "Creating startup scripts..."

# Backend startup script
cat > start-backend-cosmos.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Smart Student Hub Backend with Azure Cosmos DB..."
cd backend
export NODE_ENV=production
npm run dev
EOF
chmod +x start-backend-cosmos.sh

# Frontend startup script
cat > start-frontend-cosmos.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Smart Student Hub Frontend..."
cd frontend
npm run dev
EOF
chmod +x start-frontend-cosmos.sh

# Full startup script
cat > start-cosmos-hub.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Smart Student Hub with Azure Cosmos DB..."

# Start backend in background
echo "Starting backend with Cosmos DB..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 10

# Start frontend in background
echo "Starting frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Smart Student Hub is running with Azure Cosmos DB!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo "Health Check: http://localhost:5000/health"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
EOF
chmod +x start-cosmos-hub.sh

print_success "Startup scripts created"

# Create Cosmos DB specific documentation
print_status "Creating Cosmos DB documentation..."
cat > COSMOS_DB_SETUP.md << 'EOF'
# Azure Cosmos DB Setup for Smart Student Hub

## Overview
This document provides instructions for setting up and running the Smart Student Hub with Azure Cosmos DB MongoDB API.

## Prerequisites
- Azure Cosmos DB account with MongoDB API
- Node.js 18+ installed
- npm installed

## Configuration

### Connection String
```
mongodb+srv://AdhyayanMargAdmin:<TeDxE85wcWtfmq7Q0g#C>@adhyayanmarg-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

### Environment Variables
- `MONGODB_URI`: Azure Cosmos DB connection string
- `NODE_ENV`: Set to 'production' for Cosmos DB
- `COSMOS_DB_NAME`: Database name (smart-student-hub)
- `COSMOS_DB_THROUGHPUT`: Request units (400)

## Cosmos DB Optimizations

### Connection Options
- `retryWrites: false` - Cosmos DB doesn't support retryable writes
- `maxPoolSize: 10` - Limit connection pool size
- `bufferCommands: false` - Disable mongoose buffering
- `socketTimeoutMS: 45000` - Extended timeout for Cosmos DB

### Performance Considerations
- Use appropriate indexing for queries
- Limit aggregation pipeline complexity
- Use projection to limit returned fields
- Implement pagination for large datasets

## Running the Application

### Quick Start
```bash
./start-cosmos-hub.sh
```

### Individual Services
```bash
# Backend only
./start-backend-cosmos.sh

# Frontend only
./start-frontend-cosmos.sh
```

## Monitoring

### Health Check
- Backend: http://localhost:5000/health
- Database status included in health check

### Cosmos DB Metrics
- Monitor request units (RU) consumption
- Track connection count
- Monitor query performance

## Troubleshooting

### Common Issues
1. **Connection Timeout**: Increase `serverSelectionTimeoutMS`
2. **Authentication Failed**: Verify connection string
3. **Rate Limiting**: Check RU consumption in Azure portal
4. **Query Performance**: Optimize indexes and queries

### Debug Mode
```bash
DEBUG=mongoose* npm run dev
```

## Security
- Connection string contains credentials - keep secure
- Use environment variables in production
- Enable firewall rules in Azure Cosmos DB
- Use managed identity when possible

## Cost Optimization
- Monitor RU consumption
- Use appropriate consistency levels
- Implement caching where possible
- Optimize query patterns
EOF

print_success "Documentation created"

# Final instructions
echo ""
echo "🎉 Azure Cosmos DB setup completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Verify your Azure Cosmos DB account is accessible"
echo "2. Check the connection string in backend/.env"
echo "3. Start the application: ./start-cosmos-hub.sh"
echo ""
echo "🔗 Access Points:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:5000"
echo "- Health Check: http://localhost:5000/health"
echo ""
echo "📚 Documentation:"
echo "- Cosmos DB Setup: COSMOS_DB_SETUP.md"
echo "- Architecture: SMART_STUDENT_HUB_ARCHITECTURE.md"
echo "- README: SMART_STUDENT_HUB_README.md"
echo ""
echo "🆘 Support:"
echo "- Azure Cosmos DB Portal: https://portal.azure.com"
echo "- Monitor RU consumption in Azure portal"
echo "- Check logs for connection issues"
echo ""
print_success "Setup completed! Your Smart Student Hub is ready with Azure Cosmos DB! 🚀"
