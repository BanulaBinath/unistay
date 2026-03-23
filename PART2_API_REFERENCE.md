# Part 2 API Reference

Quick reference for all authentication and protected route endpoints.

---

## Base URL

```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. Login

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "user@example.com",
      "role": "student_sliit",
      "vendorType": null,
      "isActive": true
    }
  }
}
```

**Error Responses:**

401 - Invalid Credentials:
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

403 - Inactive Account:
```json
{
  "success": false,
  "message": "Account is not active. Please complete registration or payment."
}
```

403 - Unverified Account:
```json
{
  "success": false,
  "message": "Account is not verified. Please verify your email with OTP."
}
```

---

### 2. Get Current User

**Endpoint:** `GET /auth/me`

**Access:** Protected (requires JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "businessName": null,
    "email": "user@example.com",
    "role": "student_sliit",
    "vendorType": null,
    "isActive": true,
    "isVerified": true,
    "subscriptionStatus": "none"
  }
}
```

**Error Responses:**

401 - No Token:
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

401 - Invalid Token:
```json
{
  "success": false,
  "message": "Invalid token"
}
```

401 - Expired Token:
```json
{
  "success": false,
  "message": "Token expired. Please login again."
}
```

---

### 3. Logout

**Endpoint:** `POST /auth/logout`

**Access:** Protected (requires JWT token)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Protected Route Examples

These endpoints demonstrate how to protect routes. Use them as templates for your features.

### 1. Student Dashboard

**Endpoint:** `GET /user/student/dashboard`

**Access:** Students only (student_sliit, student_external)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Student dashboard access granted",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "role": "student_sliit"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Students only."
}
```

---

### 2. Vendor Dashboard

**Endpoint:** `GET /user/vendor/dashboard`

**Access:** Vendors only (all types)

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Vendor dashboard access granted",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "role": "vendor",
    "vendorType": "food"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. Vendors only."
}
```

---

### 3. Food Vendor Dashboard

**Endpoint:** `GET /user/vendor/food/dashboard`

**Access:** Food vendors only

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Food vendor dashboard access granted",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "vendorType": "food"
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. food vendors only."
}
```

---

### 4. Boarding Vendor Dashboard

**Endpoint:** `GET /user/vendor/boarding/dashboard`

**Access:** Boarding vendors only

---

### 5. Laundry Vendor Dashboard

**Endpoint:** `GET /user/vendor/laundry/dashboard`

**Access:** Laundry vendors only

---

### 6. Cleaning Vendor Dashboard

**Endpoint:** `GET /user/vendor/cleaning/dashboard`

**Access:** Cleaning vendors only

---

## Frontend API Usage

### Using the API Service

```javascript
import { authAPI } from '../services/api';

// Login
try {
  const response = await authAPI.login({
    email: 'user@example.com',
    password: 'Password123!'
  });
  
  console.log(response.data.token);
  console.log(response.data.user);
} catch (error) {
  console.error(error.response.data.message);
}

// Get current user
try {
  const response = await authAPI.getCurrentUser();
  console.log(response.data);
} catch (error) {
  console.error(error.response.data.message);
}

// Logout
try {
  const response = await authAPI.logout();
  console.log(response.message);
} catch (error) {
  console.error(error.response.data.message);
}
```

### Using Axios Directly

```javascript
import api from '../services/api';

// Token is automatically attached by interceptor
const response = await api.get('/user/student/dashboard');
console.log(response.data);
```

---

## Backend Middleware Usage

### Protect a Route

```javascript
const { verifyToken, isStudent, isVendor, isVendorType } = require('../middleware/authMiddleware');

// Student only
router.get('/my-route', verifyToken, isStudent, myController);

// Vendor only
router.get('/my-route', verifyToken, isVendor, myController);

// Specific vendor type
router.get('/my-route', verifyToken, isVendorType('food'), myController);

// Any authenticated user
router.get('/my-route', verifyToken, myController);
```

### Access User Data in Controller

```javascript
const myController = (req, res) => {
  // User data from JWT token
  const userId = req.user.userId;
  const email = req.user.email;
  const role = req.user.role;
  const vendorType = req.user.vendorType;
  
  // Use the data
  res.json({
    success: true,
    data: {
      userId,
      role
    }
  });
};
```

---

## JWT Token Structure

### Token Payload

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "role": "student_sliit",
  "vendorType": null,
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Expiry

- **Duration:** 7 days
- **After expiry:** User must login again
- **Automatic handling:** Frontend intercepts 401 errors and redirects to login

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Login required or token invalid |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Contact backend team |

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Access Protected Route
```bash
curl -X GET http://localhost:5000/api/user/student/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing with Postman

### Setup

1. Create new request
2. Set method and URL
3. Add headers:
   - `Content-Type: application/json`
   - `Authorization: Bearer <token>` (for protected routes)
4. Add body (for POST requests)

### Environment Variables

Create Postman environment with:
- `base_url`: `http://localhost:5000/api`
- `token`: (set after login)

Use in requests:
- URL: `{{base_url}}/auth/login`
- Header: `Authorization: Bearer {{token}}`

---

## Common Integration Patterns

### Pattern 1: Login Flow

```javascript
// 1. User submits login form
const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });
    
    // 2. Store token and user
    login(response.data.user, response.data.token);
    
    // 3. Redirect based on role
    if (response.data.user.role === 'student_sliit' || 
        response.data.user.role === 'student_external') {
      navigate('/student/dashboard');
    } else if (response.data.user.role === 'vendor') {
      navigate(`/vendor/${response.data.user.vendorType}/dashboard`);
    }
  } catch (error) {
    setError(error.response.data.message);
  }
};
```

### Pattern 2: Protected Component

```javascript
import { useAuth } from '../context/AuthContext';

function MyProtectedComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return <div>Welcome {user.fullName}</div>;
}
```

### Pattern 3: API Call with Auth

```javascript
import api from '../services/api';

const fetchMyData = async () => {
  try {
    // Token automatically attached
    const response = await api.get('/my-endpoint');
    return response.data;
  } catch (error) {
    if (error.response.status === 401) {
      // Token expired, user will be redirected to login
    }
    throw error;
  }
};
```

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:

```javascript
// Example with express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later'
});

router.post('/login', loginLimiter, validateLogin, authController.login);
```

---

## Security Best Practices

✅ **Always use HTTPS in production**
✅ **Store JWT_SECRET securely (environment variable)**
✅ **Never log tokens or passwords**
✅ **Validate all inputs**
✅ **Use CORS properly**
✅ **Implement rate limiting**
✅ **Keep dependencies updated**
✅ **Use strong passwords (enforced in validation)**

---

## Quick Reference

| Task | Endpoint | Method | Auth |
|------|----------|--------|------|
| Login | `/auth/login` | POST | No |
| Get Profile | `/auth/me` | GET | Yes |
| Logout | `/auth/logout` | POST | Yes |
| Student Route | `/user/student/dashboard` | GET | Yes (Student) |
| Vendor Route | `/user/vendor/dashboard` | GET | Yes (Vendor) |
| Food Vendor | `/user/vendor/food/dashboard` | GET | Yes (Food) |
| Boarding Vendor | `/user/vendor/boarding/dashboard` | GET | Yes (Boarding) |
| Laundry Vendor | `/user/vendor/laundry/dashboard` | GET | Yes (Laundry) |
| Cleaning Vendor | `/user/vendor/cleaning/dashboard` | GET | Yes (Cleaning) |

---

**Need more help?** Check the other documentation files:
- `PART2_IMPLEMENTATION.md` - Technical details
- `PART2_QUICK_START.md` - Testing guide
- `PART2_DELIVERY_SUMMARY.md` - Overview
