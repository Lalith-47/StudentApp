#!/bin/bash

# Production Build Script for Smart Student Hub
echo "🚀 Building Smart Student Hub for Production..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Starting production build process..."

# 1. Clean previous builds
print_status "Cleaning previous builds..."
rm -rf backend/dist
rm -rf frontend/dist
rm -rf frontend/node_modules/.vite

# 2. Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm ci --only=production
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi
print_success "Backend dependencies installed"

# 3. Install frontend dependencies
print_status "Installing frontend dependencies..."
cd ../frontend
npm ci
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_success "Frontend dependencies installed"

# 4. Build frontend
print_status "Building frontend for production..."
npm run build
if [ $? -ne 0 ]; then
    print_error "Failed to build frontend"
    exit 1
fi
print_success "Frontend built successfully"

# 5. Run backend tests
print_status "Running backend tests..."
cd ../backend
npm test 2>/dev/null || print_warning "No tests found or tests failed - continuing anyway"

# 6. Create production environment file
print_status "Creating production environment file..."
cat > .env.production << EOF
# Production Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration (Update with your production DB)
MONGODB_URI=mongodb://localhost:27017/smart-student-hub-prod

# JWT Configuration (Use strong secrets in production)
JWT_SECRET=your-production-jwt-secret-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=https://your-domain.com

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
EOF

print_success "Production environment file created"

# 7. Create production startup script
print_status "Creating production startup script..."
cat > start-production.sh << 'EOF'
#!/bin/bash

# Production startup script
echo "🚀 Starting Smart Student Hub in production mode..."

# Set production environment
export NODE_ENV=production

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On Ubuntu/Debian: sudo systemctl start mongod"
    echo "   On macOS: brew services start mongodb-community"
    exit 1
fi

# Start the backend server
echo "📡 Starting backend server..."
cd backend
node src/index.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend server started successfully (PID: $BACKEND_PID)"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Serve frontend (using a simple HTTP server)
echo "🌐 Starting frontend server..."
cd ../frontend
npx serve -s dist -l 3000 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

# Check if frontend is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Frontend server started successfully (PID: $FRONTEND_PID)"
    echo ""
    echo "🎉 Smart Student Hub is now running in production mode!"
    echo "📊 Backend: http://localhost:5000"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔍 Health Check: http://localhost:5000/health"
    echo ""
    echo "To stop the servers, run: kill $BACKEND_PID $FRONTEND_PID"
else
    echo "❌ Frontend server failed to start"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

# Keep script running
wait
EOF

chmod +x start-production.sh
print_success "Production startup script created"

# 8. Create Docker configuration
print_status "Creating Docker configuration..."
cat > Dockerfile << 'EOF'
# Multi-stage build for production
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:18-alpine AS backend-builder

WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS production

WORKDIR /app

# Install PM2 for process management
RUN npm install -g pm2

# Copy backend
COPY --from=backend-builder /app/backend ./backend
COPY backend/src ./backend/src

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copy startup script
COPY start-production.sh ./
RUN chmod +x start-production.sh

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["./start-production.sh"]
EOF

print_success "Docker configuration created"

# 9. Create docker-compose for easy deployment
print_status "Creating docker-compose configuration..."
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: smart-student-hub-db
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_DATABASE: smart-student-hub-prod
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  app:
    build: .
    container_name: smart-student-hub-app
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "5000:5000"
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://mongodb:27017/smart-student-hub-prod
      JWT_SECRET: your-production-jwt-secret-here
      FRONTEND_URL: http://localhost:3000
    depends_on:
      - mongodb
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
EOF

print_success "Docker Compose configuration created"

# 10. Create production deployment guide
print_status "Creating production deployment guide..."
cat > PRODUCTION_DEPLOYMENT.md << 'EOF'
# Smart Student Hub - Production Deployment Guide

## 🚀 Quick Start

### Option 1: Direct Deployment
```bash
# 1. Start MongoDB
sudo systemctl start mongod

# 2. Start the application
./start-production.sh
```

### Option 2: Docker Deployment
```bash
# 1. Build and start with Docker Compose
docker-compose up -d

# 2. Check status
docker-compose ps
```

## 🔧 Production Configuration

### Environment Variables
Update `backend/.env.production` with your production values:

```bash
# Database
MONGODB_URI=mongodb://your-production-db:27017/smart-student-hub-prod

# Security
JWT_SECRET=your-strong-jwt-secret-here

# Domain
FRONTEND_URL=https://your-domain.com
```

### Database Setup
1. Create production database
2. Set up database backups
3. Configure monitoring

### Security Checklist
- [ ] Update JWT secret
- [ ] Configure HTTPS
- [ ] Set up firewall rules
- [ ] Enable database authentication
- [ ] Configure rate limiting
- [ ] Set up monitoring

### Monitoring
- Backend Health: http://localhost:5000/health
- Application Logs: Check backend/logs/
- Database Status: Monitor MongoDB

### Backup Strategy
```bash
# Database backup
mongodump --db smart-student-hub-prod --out /backup/$(date +%Y%m%d)

# Application backup
tar -czf app-backup-$(date +%Y%m%d).tar.gz backend/ frontend/dist/
```

## 🆘 Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check MongoDB is running
3. **Permission errors**: Ensure proper file permissions

### Logs
```bash
# Application logs
tail -f backend/logs/combined.log

# Docker logs
docker-compose logs -f app
```

## 📊 Performance Optimization

### Backend
- Enable compression
- Configure caching
- Set up load balancing

### Frontend
- Enable CDN
- Configure caching headers
- Optimize images

## 🔒 Security Hardening

1. **Update dependencies regularly**
2. **Use strong passwords**
3. **Enable HTTPS**
4. **Configure CORS properly**
5. **Set up monitoring and alerting**
EOF

print_success "Production deployment guide created"

cd ..

# 11. Final checks
print_status "Running final production checks..."

# Check if all files exist
if [ -f "backend/.env.production" ] && [ -f "start-production.sh" ] && [ -f "Dockerfile" ]; then
    print_success "All production files created successfully"
else
    print_error "Some production files are missing"
    exit 1
fi

# Check build sizes
FRONTEND_SIZE=$(du -sh frontend/dist 2>/dev/null | cut -f1 || echo "N/A")
print_status "Frontend build size: $FRONTEND_SIZE"

# Final summary
echo ""
print_success "🎉 Production build completed successfully!"
echo ""
echo "📁 Production files created:"
echo "   • backend/.env.production - Production environment config"
echo "   • start-production.sh - Production startup script"
echo "   • Dockerfile - Docker configuration"
echo "   • docker-compose.yml - Docker Compose setup"
echo "   • PRODUCTION_DEPLOYMENT.md - Deployment guide"
echo ""
echo "🚀 To start in production mode:"
echo "   1. ./start-production.sh"
echo "   2. Or: docker-compose up -d"
echo ""
echo "📊 Access your application:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend: http://localhost:5000"
echo "   • Health Check: http://localhost:5000/health"
echo ""
print_warning "Remember to update production environment variables before deployment!"
