# Registration Testing Guide

## Quick Test Steps

### 1. Start Backend Server
```bash
cd backend
npm install  # if not already done
npm start
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### 2. Start Frontend
```bash
cd frontend
npm install  # if not already done
npm start
```

Browser should open at: http://localhost:3000

### 3. Test Registration Flow

#### Navigate to Registration
1. Go to: http://localhost:3000/register/sliit-student
2. Or click "Register" → "Register as SLIIT Student"

#### Fill Registration Form
- Full Name: `Test Student`
- SLIIT Student Email: `it21999999@my.sliit.lk`
- Password: `testpass123` (8+ characters)
- Confirm Password: `testpass123`

#### Submit Form
1. Click "Generate OTP & Register"
2. Watch for loading state: "Processing..."

#### Expected Results

##### If Email is Configured:
- ✅ Success message appears
- ✅ Redirects to `/verify-otp` page
- ✅ Email received with 6-digit OTP
- ✅ OTP verification page shows email address

##### If Email is NOT Configured (Development):
- ✅ Success message appears
- ✅ Redirects to `/verify-otp` page
- ✅ Backend console shows: `OTP for it21999999@my.sliit.lk: 123456`
- ✅ Copy OTP from console to verify

### 4. Verify OTP

1. On OTP verification page, enter the 6-digit code
2. Click "Verify OTP"
3. Expected: Success message + redirect to login
4. Login with registered credentials

### 5. Test Error Cases

#### Invalid Email Domain
- Email: `test@gmail.com`
- Expected: "Please use your SLIIT student email (@my.sliit.lk)"

#### Short Password
- Password: `pass`
- Expected: "Password must be at least 8 characters"

#### Password Mismatch
- Password: `password123`
- Confirm: `password456`
- Expected: "Passwords do not match"

#### Duplicate Email
- Register same email twice
- Expected: "Email already registered"

## Backend API Testing (Optional)

### Test with cURL

#### Registration Request
```bash
curl -X POST http://localhost:5000/api/auth/register/sliit-student \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Student",
    "email": "it21888888@my.sliit.lk",
    "password": "testpass123",
    "confirmPassword": "testpass123"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for OTP verification.",
  "data": {
    "userId": "...",
    "email": "it21888888@my.sliit.lk",
    "role": "student_sliit"
  }
}
```

#### OTP Verification Request
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "it21888888@my.sliit.lk",
    "otp": "123456"
  }'
```

### Test with Postman

1. Import collection or create new requests
2. POST `http://localhost:5000/api/auth/register/sliit-student`
3. Body (JSON):
```json
{
  "fullName": "Test Student",
  "email": "it21777777@my.sliit.lk",
  "password": "testpass123",
  "confirmPassword": "testpass123"
}
```

## Verification Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads registration page
- [ ] Form validation works (email, password)
- [ ] Registration succeeds (with or without email)
- [ ] OTP page opens after registration
- [ ] OTP can be verified successfully
- [ ] User can login after verification
- [ ] Error messages are clear and helpful

## Common Issues

### Backend won't start
- Check MongoDB connection string in .env
- Ensure port 5000 is not in use
- Run `npm install` in backend folder

### Frontend won't connect
- Check REACT_APP_API_URL in frontend/.env
- Should be: `http://localhost:5000/api`
- Restart frontend after .env changes

### Registration fails silently
- Open browser DevTools → Network tab
- Check the POST request to `/api/auth/register/sliit-student`
- Look at response for error details

### OTP page doesn't open
- Check browser console for errors
- Verify navigation state is passed correctly
- Check if response.success is true

## Success Criteria

✅ User can register with SLIIT email
✅ OTP is generated and saved to database
✅ OTP verification page opens automatically
✅ Email is sent (if configured) OR OTP logged to console
✅ Clear error messages for validation failures
✅ No generic "Registration failed" errors
✅ User can complete full registration flow

## Next Steps After Testing

1. Configure production email service
2. Test with real SLIIT email addresses
3. Monitor backend logs for any issues
4. Set up error tracking (Sentry, etc.)
5. Add rate limiting for OTP requests
