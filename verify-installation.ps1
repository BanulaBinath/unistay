# Notification System Installation Verification Script
Write-Host ""
Write-Host "========================================"
Write-Host "  Notification System Verification"
Write-Host "========================================"
Write-Host ""

$allGood = $true

# Check Backend Dependencies
Write-Host "Checking Backend Dependencies..."
$backendPackageJson = Get-Content "backend/package.json" -Raw | ConvertFrom-Json
if ($backendPackageJson.dependencies."socket.io") {
    Write-Host "[OK] socket.io installed in backend"
} else {
    Write-Host "[ERROR] socket.io NOT found in backend"
    $allGood = $false
}

# Check Frontend Dependencies
Write-Host "Checking Frontend Dependencies..."
$frontendPackageJson = Get-Content "frontend/package.json" -Raw | ConvertFrom-Json
if ($frontendPackageJson.dependencies."socket.io-client") {
    Write-Host "[OK] socket.io-client installed in frontend"
} else {
    Write-Host "[ERROR] socket.io-client NOT found in frontend"
    $allGood = $false
}

# Check Backend Files
Write-Host ""
Write-Host "Checking Backend Files..."
$backendFiles = @(
    "backend/models/Notification.js",
    "backend/services/notificationService.js",
    "backend/Controllers/notificationController.js",
    "backend/routes/notificationRoutes.js",
    "backend/socket/socketHandler.js"
)

foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file"
    } else {
        Write-Host "[ERROR] $file NOT FOUND"
        $allGood = $false
    }
}

# Check Frontend Files
Write-Host ""
Write-Host "Checking Frontend Files..."
$frontendFiles = @(
    "frontend/src/services/notificationApi.js",
    "frontend/src/context/SocketContext.js",
    "frontend/src/Components/common/Notifications/NotificationPanel.js",
    "frontend/src/Components/common/Notifications/NotificationPanel.css",
    "frontend/src/Components/common/Notifications/NotificationBell.js",
    "frontend/src/Components/common/Notifications/NotificationBell.css"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "[OK] $file"
    } else {
        Write-Host "[ERROR] $file NOT FOUND"
        $allGood = $false
    }
}

# Check Environment Variables
Write-Host ""
Write-Host "Checking Environment Variables..."

if (Test-Path "backend/.env") {
    $backendEnv = Get-Content "backend/.env" -Raw
    if ($backendEnv -match "FRONTEND_URL") {
        Write-Host "[OK] FRONTEND_URL configured in backend/.env"
    } else {
        Write-Host "[WARNING] FRONTEND_URL not found in backend/.env"
    }
} else {
    Write-Host "[ERROR] backend/.env NOT FOUND"
    $allGood = $false
}

if (Test-Path "frontend/.env") {
    $frontendEnv = Get-Content "frontend/.env" -Raw
    if ($frontendEnv -match "REACT_APP_SOCKET_URL") {
        Write-Host "[OK] REACT_APP_SOCKET_URL configured in frontend/.env"
    } else {
        Write-Host "[WARNING] REACT_APP_SOCKET_URL not found in frontend/.env"
    }
} else {
    Write-Host "[ERROR] frontend/.env NOT FOUND"
    $allGood = $false
}

# Final Result
Write-Host ""
Write-Host "========================================"
if ($allGood) {
    Write-Host "SUCCESS: Installation Verified!"
    Write-Host ""
    Write-Host "Next Steps:"
    Write-Host "1. Integrate SocketProvider in frontend/src/App.js"
    Write-Host "2. Add NotificationPanel to your dashboards"
    Write-Host "3. Start backend: cd backend; npm start"
    Write-Host "4. Start frontend: cd frontend; npm start"
    Write-Host ""
    Write-Host "Read NOTIFICATION_QUICK_START.md for integration guide"
} else {
    Write-Host "ERROR: Installation Incomplete"
    Write-Host "Please check the errors above and fix them."
}
Write-Host "========================================"
Write-Host ""
