# Part 2 Quick Start Guide

## How to Test the Login System

### Step 1: Start the Backend

```bash
cd backend
npm start
```

Backend should run on `http://localhost:5000`

### Step 2: Start the Frontend

```bash
cd frontend
npm start
```

Frontend should run on `http://localhost:3000`

---

## Testing Login Flow

### Option 1: Use Existing Registered Users

If you already have users from Part 1 registration, you can login with their credentials.

**Important**: Users must be:
- ✅ Active (`isActive: true`)
- ✅ Verified (`isVerified: true` for SLIIT students)

### Option 2: Create Test Users Manually

You can create test users directly in MongoDB:

#### SLIIT Student (Active & Verified)
```javascript
{
  fullName: "John Doe",
  email: "john@my.sliit.lk",
  password: "$2a$12$...", // bcrypt hash of "Password123!"
  role: "student_sliit",
  isVerified: true,
  isActive: true,
  subscriptionStatus: "none"
}
```

#### External Student (Active)
```javascript
{
  fullName: "Jane Smith",
  email: "jane@gmail.com",
  password: "$2a$12$...", // bcrypt hash of "Password123!"
  role: "student_external",
  isVerified: true,
  isActive: true,
  subscriptionStatus: "active"
}
```

#### Food Vendor (Active)
```javascript
{
  fullName: "Mike Johnson",
  businessName: "Mike's Food Corner",
  email: "mike@foodvendor.com",
  password: "$2a$12$...", // bcrypt hash of "Password123!"
  role: "vendor",
  vendorType: "food",
  isVerified: true,
  isActive: true,
  subscriptionStatus: "active"
}
```

### Option 3: Complete Registration Flow

1. Go to `http://localhost:3000/register`
2. Register as SLIIT student → Verify OTP
3. Register as External student → Complete payment
4. Register as Vendor → Complete payment

---

## Login Test Scenarios

### Scenario 1: SLIIT Student Login

1. Navigate to `http://localhost:3000/login`
2. Enter:
   - Email: `student@my.sliit.lk`
   - Password: `your_password`
3. Click "Login"
4. Should redirect to: `/student/dashboard`
5. Should see: Student Dashboard with welcome message

### Scenario 2: External Student Login

1. Navigate to `http://localhost:3000/login`
2. Enter external student credentials
3. Click "Login"
4. Should redirect to: `/student/dashboard`
5. Should see: Student Dashboard

### Scenario 3: Food Vendor Login

1. Navigate to `http://localhost:3000/login`
2. Enter food vendor credentials
3. Click "Login"
4. Should redirect to: `/vendor/food/dashboard`
5. Should see: Food Vendor Dashboard

### Scenario 4: Other Vendor Types

- Boarding vendor → `/vendor/boarding/dashboard`
- Laundry vendor → `/vendor/laundry/dashboard`
- Cleaning vendor → `/vendor/cleaning/dashboard`

---

## Testing Protected Routes

### Test 1: Access Without Login

1. Open browser in incognito mode
2. Navigate to `http://localhost:3000/student/dashboard`
3. Should redirect to: `/login`

### Test 2: Student Accessing Vendor Route

1. Login as student
2. Manually navigate to `http://localhost:3000/vendor/food/dashboard`
3. Should redirect back to: `/student/dashboard`

### Test 3: Vendor Accessing Student Route

1. Login as vendor
2. Manually navigate to `http://localhost:3000/student/dashboard`
3. Should redirect back to: `/vendor/{type}/dashboard`

### Test 4: Wrong Vendor Type

1. Login as food vendor
2. Manually navigate to `http://localhost:3000/vendor/laundry/dashboard`
3. Should redirect back to: `/vendor/food/dashboard`

---

## Testing Token Expiration

### Manual Token Expiration Test

1. Login successfully
2. Open browser DevTools → Application → Local Storage
3. Find `token` key
4. Modify the token value (corrupt it)
5. Refresh the page
6. Should redirect to: `/login`
7. Token and user should be cleared from localStorage

---

## Testing Logout

1. Login successfully
2. Navigate to your dashboard
3. Click "Logout" button
4. Should redirect to: `/login`
5. Check localStorage: token and user should be removed
6. Try accessing dashboard again: should redirect to login

---

## Common Issues & Solutions

### Issue 1: "Invalid email or password"
- ✅ Check email is correct
- ✅ Check password is correct
- ✅ Check user exists in database

### Issue 2: "Account is not active"
- ✅ Check `isActive: true` in database
- ✅ For external students/vendors: complete payment
- ✅ For SLIIT students: verify OTP first

### Issue 3: "Account is not verified"
- ✅ Only for SLIIT students
- ✅ Check `isVerified: true` in database
- ✅ Complete OTP verification

### Issue 4: Redirect Loop
- ✅ Clear localStorage
- ✅ Clear browser cache
- ✅ Check token is valid
- ✅ Check user role matches route

### Issue 5: CORS Error
- ✅ Check backend is running
- ✅ Check CORS settings in `backend/app.js`
- ✅ Check `FRONTEND_URL` in `.env`

---

## API Testing with Postman/cURL

### Login Request

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@my.sliit.lk",
    "password": "Password123!"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "fullName": "John Doe",
      "email": "student@my.sliit.lk",
      "role": "student_sliit",
      "vendorType": null,
      "isActive": true
    }
  }
}
```

### Get Current User

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Protected Route

```bash
curl -X GET http://localhost:5000/api/user/student/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Browser DevTools Inspection

### Check Token Storage

1. Open DevTools (F12)
2. Go to Application tab
3. Local Storage → `http://localhost:3000`
4. Should see:
   - `token`: JWT token string
   - `user`: JSON string with user data

### Check Network Requests

1. Open DevTools → Network tab
2. Login
3. Check `/api/auth/login` request:
   - Status: 200
   - Response: Contains token and user
4. Navigate to dashboard
5. Check requests have header:
   - `Authorization: Bearer <token>`

---

## Quick Debugging Checklist

- [ ] Backend server is running on port 5000
- [ ] Frontend server is running on port 3000
- [ ] MongoDB is connected
- [ ] User exists in database
- [ ] User `isActive: true`
- [ ] User `isVerified: true` (for SLIIT students)
- [ ] Password is correct
- [ ] No CORS errors in console
- [ ] Token is stored in localStorage
- [ ] Token is valid (not expired/corrupted)

---

## Next Steps

After confirming login works:

1. ✅ Test all user roles (students, all vendor types)
2. ✅ Test protected route access
3. ✅ Test logout functionality
4. ✅ Test token expiration handling
5. ✅ Begin building feature-specific components
6. ✅ Use `useAuth()` hook in your components
7. ✅ Wrap new routes with `<ProtectedRoute>`

---

## Need Help?

Check these files for reference:
- Login component: `frontend/src/Components/Home/login.js`
- Auth context: `frontend/src/context/AuthContext.js`
- Protected routes: `frontend/src/components/ProtectedRoute.js`
- Backend auth: `backend/Controllers/authController.js`
- Middleware: `backend/middleware/authMiddleware.js`

Happy coding! 🚀
