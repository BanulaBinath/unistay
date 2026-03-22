# Unistay Part 2: User Login + Role-based Redirect + Protected Access

## Implementation Summary

This document covers the implementation of user authentication, JWT-based login, role-based routing, and protected route access for the Unistay platform.

---

## Backend Implementation

### 1. Authentication Controller (`backend/Controllers/authController.js`)

Added three new functions:

#### `login(req, res)`
- Validates user credentials (email + password)
- Checks if user is active and verified
- Compares password using bcrypt
- Generates JWT token with 7-day expiry
- Returns user data and token

#### `getCurrentUser(req, res)`
- Protected route that requires JWT token
- Returns current user profile data
- Excludes password from response

#### `logout(req, res)`
- Simple logout endpoint
- Token removal handled client-side

### 2. Authentication Middleware (`backend/middleware/authMiddleware.js`)

Created middleware functions for route protection:

- `verifyToken`: Validates JWT token from Authorization header
- `isStudent`: Ensures user is a student (SLIIT or External)
- `isVendor`: Ensures user is a vendor
- `isVendorType(type)`: Ensures user is a specific vendor type (food, boarding, laundry, cleaning)

### 3. Validation Middleware (`backend/middleware/validation.js`)

Added login validation:
- `validateLogin`: Validates email and password fields

### 4. Routes

#### Auth Routes (`backend/Route/authRoutes.js`)
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

#### User Routes (`backend/Route/userRoutes.js`)
Protected route examples for testing:
- `GET /api/user/student/dashboard` - Student only
- `GET /api/user/vendor/dashboard` - Vendor only
- `GET /api/user/vendor/food/dashboard` - Food vendor only
- `GET /api/user/vendor/boarding/dashboard` - Boarding vendor only
- `GET /api/user/vendor/laundry/dashboard` - Laundry vendor only
- `GET /api/user/vendor/cleaning/dashboard` - Cleaning vendor only

---

## Frontend Implementation

### 1. Authentication Context (`frontend/src/context/AuthContext.js`)

Global state management for authentication:
- Stores user data and JWT token
- Persists to localStorage
- Provides login/logout functions
- Helper functions: `isAuthenticated()`, `getUserRole()`, `getVendorType()`

### 2. Protected Route Component (`frontend/src/components/ProtectedRoute.js`)

Route wrapper that:
- Checks if user is authenticated
- Validates user role against allowed roles
- Validates vendor type against allowed vendor types
- Redirects unauthorized users to appropriate dashboard
- Shows loading state during authentication check

### 3. API Service (`frontend/src/services/api.js`)

Enhanced with:
- Request interceptor: Automatically adds JWT token to requests
- Response interceptor: Handles token expiration (401 errors)
- New API methods:
  - `authAPI.login(data)`
  - `authAPI.getCurrentUser()`
  - `authAPI.logout()`

### 4. Login Page (`frontend/src/Components/Home/login.js`)

Full-featured login component:
- Email and password form
- Error handling and display
- Loading state during login
- Role-based redirect after successful login:
  - Students → `/student/dashboard`
  - Food vendors → `/vendor/food/dashboard`
  - Boarding vendors → `/vendor/boarding/dashboard`
  - Laundry vendors → `/vendor/laundry/dashboard`
  - Cleaning vendors → `/vendor/cleaning/dashboard`

### 5. Dashboard Components

Created placeholder dashboards for all user types:

- `StudentDashboard.js` - For SLIIT and External students
- `FoodVendorDashboard.js` - For food vendors
- `BoardingVendorDashboard.js` - For boarding vendors
- `LaundryVendorDashboard.js` - For laundry vendors
- `CleaningVendorDashboard.js` - For cleaning vendors

Each dashboard includes:
- Welcome message with user info
- Logout functionality
- Placeholder cards for future features
- Responsive design

### 6. App Routes (`frontend/src/App.js`)

Updated with:
- AuthProvider wrapper for global auth state
- Protected routes for all dashboards
- Role-based access control
- Vendor type-based access control

---

## API Endpoints

### Public Endpoints

```
POST /api/auth/login
Body: { email, password }
Response: { success, message, data: { token, user } }
```

### Protected Endpoints

```
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { success, data: { user profile } }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { success, message }
```

---

## Authentication Flow

### Login Process

1. User enters email and password
2. Frontend sends POST request to `/api/auth/login`
3. Backend validates credentials:
   - Checks if user exists
   - Verifies user is active
   - Verifies user is verified (for SLIIT students)
   - Compares password with bcrypt
4. Backend generates JWT token (7-day expiry)
5. Backend returns token and user data
6. Frontend stores token and user in:
   - AuthContext state
   - localStorage
7. Frontend redirects based on role:
   - Students → Student Dashboard
   - Vendors → Vendor-specific Dashboard

### Protected Route Access

1. User navigates to protected route
2. ProtectedRoute component checks:
   - Is user authenticated?
   - Does user have required role?
   - Does vendor have required type?
3. If authorized: Render component
4. If not authorized: Redirect to appropriate dashboard or login

### Token Handling

1. Token stored in localStorage
2. Automatically attached to all API requests via axios interceptor
3. Backend verifies token on protected routes
4. If token expired/invalid:
   - Backend returns 401 error
   - Frontend intercepts error
   - Clears localStorage
   - Redirects to login

---

## Security Features

1. **Password Security**
   - Passwords hashed with bcrypt (12 rounds)
   - Never returned in API responses

2. **JWT Security**
   - 7-day expiration
   - Signed with secret key
   - Contains minimal user data (id, email, role, vendorType)

3. **Route Protection**
   - Backend middleware validates tokens
   - Frontend guards prevent unauthorized access
   - Role-based access control
   - Vendor type-based access control

4. **Account Status Checks**
   - Inactive users cannot login
   - Unverified SLIIT students cannot login
   - Clear error messages for each case

---

## User Roles and Access

### Students (SLIIT & External)
- Access: `/student/dashboard`
- Cannot access vendor routes

### Food Vendors
- Access: `/vendor/food/dashboard`
- Cannot access student or other vendor routes

### Boarding Vendors
- Access: `/vendor/boarding/dashboard`
- Cannot access student or other vendor routes

### Laundry Vendors
- Access: `/vendor/laundry/dashboard`
- Cannot access student or other vendor routes

### Cleaning Vendors
- Access: `/vendor/cleaning/dashboard`
- Cannot access student or other vendor routes

---

## Testing the Implementation

### 1. Test Login

```bash
# Login as student
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@my.sliit.lk","password":"password123"}'

# Login as vendor
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@example.com","password":"password123"}'
```

### 2. Test Protected Route

```bash
# Get current user
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <your-token>"
```

### 3. Test Role-Based Access

```bash
# Student accessing student route (should work)
curl -X GET http://localhost:5000/api/user/student/dashboard \
  -H "Authorization: Bearer <student-token>"

# Student accessing vendor route (should fail)
curl -X GET http://localhost:5000/api/user/vendor/dashboard \
  -H "Authorization: Bearer <student-token>"
```

---

## Error Handling

### Login Errors

- **Invalid credentials**: "Invalid email or password"
- **Inactive account**: "Account is not active. Please complete registration or payment."
- **Unverified account**: "Account is not verified. Please verify your email with OTP."

### Token Errors

- **No token**: "Access denied. No token provided."
- **Invalid token**: "Invalid token"
- **Expired token**: "Token expired. Please login again."

### Authorization Errors

- **Wrong role**: "Access denied. Students only." / "Access denied. Vendors only."
- **Wrong vendor type**: "Access denied. {type} vendors only."

---

## Next Steps for Team

### For Student Feature Developers
- Use `/student/dashboard` as base route
- Access user data via `useAuth()` hook
- All student features should be protected with:
  ```jsx
  <ProtectedRoute allowedRoles={['student_sliit', 'student_external']}>
    <YourComponent />
  </ProtectedRoute>
  ```

### For Vendor Feature Developers
- Use `/vendor/{type}/dashboard` as base route
- Access vendor data via `useAuth()` hook
- Protect vendor routes with:
  ```jsx
  <ProtectedRoute allowedRoles={['vendor']} allowedVendorTypes={['food']}>
    <YourComponent />
  </ProtectedRoute>
  ```

### For Backend Developers
- Use middleware for route protection:
  ```javascript
  router.get('/route', verifyToken, isStudent, controller);
  router.get('/route', verifyToken, isVendorType('food'), controller);
  ```

---

## Files Created/Modified

### Backend
- ✅ `backend/Controllers/authController.js` - Added login, getCurrentUser, logout
- ✅ `backend/middleware/authMiddleware.js` - NEW: JWT verification and role checks
- ✅ `backend/middleware/validation.js` - Added login validation
- ✅ `backend/Route/authRoutes.js` - Added login routes
- ✅ `backend/Route/userRoutes.js` - NEW: Protected route examples
- ✅ `backend/app.js` - Added user routes

### Frontend
- ✅ `frontend/src/context/AuthContext.js` - NEW: Global auth state
- ✅ `frontend/src/components/ProtectedRoute.js` - NEW: Route protection
- ✅ `frontend/src/services/api.js` - Added interceptors and login API
- ✅ `frontend/src/Components/Home/login.js` - Complete login implementation
- ✅ `frontend/src/Components/Home/login.css` - Login page styling
- ✅ `frontend/src/Components/dashboards/StudentDashboard.js` - NEW
- ✅ `frontend/src/Components/dashboards/FoodVendorDashboard.js` - NEW
- ✅ `frontend/src/Components/dashboards/BoardingVendorDashboard.js` - NEW
- ✅ `frontend/src/Components/dashboards/LaundryVendorDashboard.js` - NEW
- ✅ `frontend/src/Components/dashboards/CleaningVendorDashboard.js` - NEW
- ✅ `frontend/src/Components/dashboards/Dashboard.css` - NEW: Dashboard styling
- ✅ `frontend/src/App.js` - Added protected routes and AuthProvider

---

## Environment Variables

Ensure these are set in `backend/.env`:

```env
JWT_SECRET=unistay_secret_key_2024
PORT=5000
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
```

---

## Conclusion

Part 2 is now complete with:
- ✅ User login with JWT authentication
- ✅ Role-based redirect after login
- ✅ Protected routes for students and vendors
- ✅ Vendor type-based access control
- ✅ Token management and expiration handling
- ✅ Clean, modular, beginner-friendly code
- ✅ Placeholder dashboards for all user types

The authentication foundation is ready for your team to build upon!
