#!/bin/bash

# Notification System Installation Script
# This script automates the installation of the notification system

echo "🚀 Starting Notification System Installation..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the project root
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Step 1: Installing Backend Dependencies...${NC}"
cd backend
npm install socket.io
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${BLUE}📦 Step 2: Installing Frontend Dependencies...${NC}"
cd frontend
npm install socket.io-client
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${BLUE}🔧 Step 3: Checking Environment Variables...${NC}"

# Check backend .env
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating from example...${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✅ Created backend/.env${NC}"
    else
        echo -e "${RED}❌ backend/.env.example not found${NC}"
    fi
else
    echo -e "${GREEN}✅ backend/.env exists${NC}"
fi

# Check if FRONTEND_URL is set
if grep -q "FRONTEND_URL" backend/.env; then
    echo -e "${GREEN}✅ FRONTEND_URL is configured${NC}"
else
    echo -e "${YELLOW}⚠️  Adding FRONTEND_URL to backend/.env${NC}"
    echo "FRONTEND_URL=http://localhost:3000" >> backend/.env
fi

# Check frontend .env
if [ ! -f "frontend/.env" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env not found. Creating...${NC}"
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
EOF
    echo -e "${GREEN}✅ Created frontend/.env${NC}"
else
    echo -e "${GREEN}✅ frontend/.env exists${NC}"
fi

# Check if REACT_APP_SOCKET_URL is set
if grep -q "REACT_APP_SOCKET_URL" frontend/.env; then
    echo -e "${GREEN}✅ REACT_APP_SOCKET_URL is configured${NC}"
else
    echo -e "${YELLOW}⚠️  Adding REACT_APP_SOCKET_URL to frontend/.env${NC}"
    echo "REACT_APP_SOCKET_URL=http://localhost:5000" >> frontend/.env
fi

echo ""
echo -e "${BLUE}📋 Step 4: Verifying File Structure...${NC}"

# Check backend files
BACKEND_FILES=(
    "backend/models/Notification.js"
    "backend/services/notificationService.js"
    "backend/Controllers/notificationController.js"
    "backend/routes/notificationRoutes.js"
    "backend/socket/socketHandler.js"
)

for file in "${BACKEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
    fi
done

# Check frontend files
FRONTEND_FILES=(
    "frontend/src/services/notificationApi.js"
    "frontend/src/context/SocketContext.js"
    "frontend/src/Components/common/Notifications/NotificationPanel.js"
    "frontend/src/Components/common/Notifications/NotificationPanel.css"
    "frontend/src/Components/common/Notifications/NotificationBell.js"
    "frontend/src/Components/common/Notifications/NotificationBell.css"
)

for file in "${FRONTEND_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
    fi
done

echo ""
echo -e "${GREEN}✅ Installation Complete!${NC}"
echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo ""
echo "1. Update frontend/src/App.js to wrap with SocketProvider:"
echo -e "   ${YELLOW}import { SocketProvider } from './context/SocketContext';${NC}"
echo ""
echo "2. Add NotificationPanel to your dashboards:"
echo -e "   ${YELLOW}import NotificationPanel from '../common/Notifications/NotificationPanel';${NC}"
echo ""
echo "3. Start the services:"
echo -e "   ${YELLOW}cd backend && npm start${NC}"
echo -e "   ${YELLOW}cd frontend && npm start${NC}"
echo ""
echo "4. Read the documentation:"
echo -e "   ${YELLOW}NOTIFICATION_QUICK_START.md${NC} - Quick setup guide"
echo -e "   ${YELLOW}NOTIFICATION_SYSTEM_IMPLEMENTATION.md${NC} - Complete guide"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
