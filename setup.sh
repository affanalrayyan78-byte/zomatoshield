#!/bin/bash

echo "🛡️  ZomatoShield Setup Script"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
echo ""

# Backend setup
echo -e "${BLUE}📦 Setting up Backend...${NC}"
cd backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created backend/.env file${NC}"
    echo "⚠️  Please add your OpenWeather API key in backend/.env"
else
    echo -e "${GREEN}✅ Backend .env already exists${NC}"
fi
cd ..
echo ""

# Frontend setup
echo -e "${BLUE}📦 Setting up Frontend...${NC}"
cd frontend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✅ Created frontend/.env file${NC}"
else
    echo -e "${GREEN}✅ Frontend .env already exists${NC}"
fi
cd ..
echo ""

# Create start script
cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting ZomatoShield..."
echo ""

# Start backend
echo "Starting Backend on port 5000..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "Starting Frontend on port 3000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ ZomatoShield is running!"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF

chmod +x start.sh

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "1. Add your OpenWeather API key to backend/.env"
echo "2. Run: ./start.sh"
echo ""
echo "Or start manually:"
echo "Terminal 1: cd backend && npm start"
echo "Terminal 2: cd frontend && npm start"
echo ""