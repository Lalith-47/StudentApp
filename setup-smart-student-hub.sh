#!/bin/bash

# Smart Student Hub Setup Script
# This script sets up the complete Smart Student Hub platform

set -e

echo "🚀 Smart Student Hub Setup Script"
echo "=================================="

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check MongoDB
    if ! command -v mongod &> /dev/null; then
        print_warning "MongoDB is not installed. Please install MongoDB from https://www.mongodb.com/try/download/community"
        print_warning "You can also use MongoDB Atlas (cloud) instead."
    fi
    
    # Check Flutter (optional)
    if ! command -v flutter &> /dev/null; then
        print_warning "Flutter is not installed. Mobile app development will not be available."
        print_warning "Install Flutter from https://flutter.dev/docs/get-started/install"
    fi
    
    print_success "Requirements check completed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Create environment file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating backend environment file..."
        cp .env.example .env
        print_warning "Please update backend/.env with your configuration"
    fi
    
    # Create uploads directory
    mkdir -p uploads/activities
    mkdir -p uploads/portfolios
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create environment file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating frontend environment file..."
        cp .env.example .env
        print_warning "Please update frontend/.env with your configuration"
    fi
    
    print_success "Frontend setup completed"
    cd ..
}

# Setup mobile app
setup_mobile() {
    if command -v flutter &> /dev/null; then
        print_status "Setting up mobile app..."
        
        cd mobile
        
        # Get Flutter dependencies
        print_status "Getting Flutter dependencies..."
        flutter pub get
        
        print_success "Mobile app setup completed"
        cd ..
    else
        print_warning "Skipping mobile app setup (Flutter not installed)"
    fi
}

# Create database indexes
create_indexes() {
    print_status "Creating database indexes..."
    
    cd backend
    
    # Run the index creation script
    node -e "
    const mongoose = require('mongoose');
    const { createIndexes } = require('./src/config/indexes');
    
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-student-hub')
      .then(async () => {
        console.log('Connected to MongoDB');
        await createIndexes();
        console.log('Indexes created successfully');
        process.exit(0);
      })
      .catch(err => {
        console.error('Error:', err);
        process.exit(1);
      });
    "
    
    print_success "Database indexes created"
    cd ..
}

# Run migration
run_migration() {
    print_status "Running database migration..."
    
    cd backend
    
    # Run the migration script
    node src/scripts/migrate-to-smart-hub.js
    
    print_success "Database migration completed"
    cd ..
}

# Create startup scripts
create_startup_scripts() {
    print_status "Creating startup scripts..."
    
    # Backend startup script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Smart Student Hub Backend..."
cd backend
npm run dev
EOF
    chmod +x start-backend.sh
    
    # Frontend startup script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Smart Student Hub Frontend..."
cd frontend
npm run dev
EOF
    chmod +x start-frontend.sh
    
    # Mobile startup script
    cat > start-mobile.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Smart Student Hub Mobile App..."
cd mobile
flutter run
EOF
    chmod +x start-mobile.sh
    
    # Full startup script
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Smart Student Hub Platform..."

# Start backend in background
echo "Starting backend..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend in background
echo "Starting frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo "✅ Smart Student Hub is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
wait
EOF
    chmod +x start-all.sh
    
    print_success "Startup scripts created"
}

# Main setup function
main() {
    echo ""
    print_status "Starting Smart Student Hub setup..."
    echo ""
    
    # Check requirements
    check_requirements
    echo ""
    
    # Setup backend
    setup_backend
    echo ""
    
    # Setup frontend
    setup_frontend
    echo ""
    
    # Setup mobile (optional)
    setup_mobile
    echo ""
    
    # Create startup scripts
    create_startup_scripts
    echo ""
    
    # Create database indexes
    print_status "Creating database indexes..."
    create_indexes
    echo ""
    
    # Run migration
    print_status "Running database migration..."
    run_migration
    echo ""
    
    # Final instructions
    echo "🎉 Smart Student Hub setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Update environment files with your configuration:"
    echo "   - backend/.env"
    echo "   - frontend/.env"
    echo ""
    echo "2. Start the platform:"
    echo "   - Run all services: ./start-all.sh"
    echo "   - Or start individually:"
    echo "     - Backend: ./start-backend.sh"
    echo "     - Frontend: ./start-frontend.sh"
    echo "     - Mobile: ./start-mobile.sh"
    echo ""
    echo "3. Access the application:"
    echo "   - Frontend: http://localhost:5173"
    echo "   - Backend API: http://localhost:5000"
    echo "   - API Health: http://localhost:5000/health"
    echo ""
    echo "4. Default login credentials:"
    echo "   - Admin: admin@smartstudenthub.com / admin123"
    echo "   - Faculty: faculty@smartstudenthub.com / faculty123"
    echo "   - Student: student@smartstudenthub.com / student123"
    echo ""
    echo "📚 Documentation:"
    echo "   - Architecture: SMART_STUDENT_HUB_ARCHITECTURE.md"
    echo "   - README: SMART_STUDENT_HUB_README.md"
    echo ""
    echo "🆘 Support:"
    echo "   - Email: support@smartstudenthub.com"
    echo "   - GitHub Issues: https://github.com/your-repo/issues"
    echo ""
    print_success "Setup completed! Happy coding! 🚀"
}

# Run main function
main "$@"
