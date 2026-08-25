@echo off
REM Notification System Installation Script for Windows
REM This script automates the installation of the notification system

echo.
echo ========================================
echo   Notification System Installation
echo ========================================
echo.

REM Check if we're in the project root
if not exist "backend" (
    echo [ERROR] backend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERROR] frontend directory not found
    echo Please run this script from the project root directory
    pause
    exit /b 1
)

echo [STEP 1] Installing Backend Dependencies...
cd backend
call npm install socket.io
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Backend dependencies installed
cd ..

echo.
echo [STEP 2] Installing Frontend Dependencies...
cd frontend
call npm install socket.io-client
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Frontend dependencies installed
cd ..

echo.
echo [STEP 3] Checking Environment Variables...

REM Check backend .env
if not exist "backend\.env" (
    echo [WARNING] backend\.env not found
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env"
        echo [SUCCESS] Created backend\.env from example
    ) else (
        echo [WARNING] backend\.env.example not found
    )
) else (
    echo [SUCCESS] backend\.env exists
)

REM Check frontend .env
if not exist "frontend\.env" (
    echo [WARNING] frontend\.env not found. Creating...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
        echo REACT_APP_SOCKET_URL=http://localhost:5000
    ) > "frontend\.env"
    echo [SUCCESS] Created frontend\.env
) else (
    echo [SUCCESS] frontend\.env exists
)

echo.
echo [STEP 4] Verifying File Structure...

REM Check backend files
if exist "backend\models\Notification.js" (
    echo [OK] backend\models\Notification.js
) else (
    echo [MISSING] backend\models\Notification.js
)

if exist "backend\services\notificationService.js" (
    echo [OK] backend\services\notificationService.js
) else (
    echo [MISSING] backend\services\notificationService.js
)

if exist "backend\Controllers\notificationController.js" (
    echo [OK] backend\Controllers\notificationController.js
) else (
    echo [MISSING] backend\Controllers\notificationController.js
)

if exist "backend\routes\notificationRoutes.js" (
    echo [OK] backend\routes\notificationRoutes.js
) else (
    echo [MISSING] backend\routes\notificationRoutes.js
)

if exist "backend\socket\socketHandler.js" (
    echo [OK] backend\socket\socketHandler.js
) else (
    echo [MISSING] backend\socket\socketHandler.js
)

REM Check frontend files
if exist "frontend\src\services\notificationApi.js" (
    echo [OK] frontend\src\services\notificationApi.js
) else (
    echo [MISSING] frontend\src\services\notificationApi.js
)

if exist "frontend\src\context\SocketContext.js" (
    echo [OK] frontend\src\context\SocketContext.js
) else (
    echo [MISSING] frontend\src\context\SocketContext.js
)

if exist "frontend\src\Components\common\Notifications\NotificationPanel.js" (
    echo [OK] frontend\src\Components\common\Notifications\NotificationPanel.js
) else (
    echo [MISSING] frontend\src\Components\common\Notifications\NotificationPanel.js
)

if exist "frontend\src\Components\common\Notifications\NotificationPanel.css" (
    echo [OK] frontend\src\Components\common\Notifications\NotificationPanel.css
) else (
    echo [MISSING] frontend\src\Components\common\Notifications\NotificationPanel.css
)

if exist "frontend\src\Components\common\Notifications\NotificationBell.js" (
    echo [OK] frontend\src\Components\common\Notifications\NotificationBell.js
) else (
    echo [MISSING] frontend\src\Components\common\Notifications\NotificationBell.js
)

if exist "frontend\src\Components\common\Notifications\NotificationBell.css" (
    echo [OK] frontend\src\Components\common\Notifications\NotificationBell.css
) else (
    echo [MISSING] frontend\src\Components\common\Notifications\NotificationBell.css
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Update frontend\src\App.js to wrap with SocketProvider
echo    import { SocketProvider } from './context/SocketContext';
echo.
echo 2. Add NotificationPanel to your dashboards
echo    import NotificationPanel from '../common/Notifications/NotificationPanel';
echo.
echo 3. Start the services:
echo    - Open terminal 1: cd backend ^&^& npm start
echo    - Open terminal 2: cd frontend ^&^& npm start
echo.
echo 4. Read the documentation:
echo    - NOTIFICATION_QUICK_START.md
echo    - NOTIFICATION_SYSTEM_IMPLEMENTATION.md
echo.
echo Happy coding!
echo.
pause
