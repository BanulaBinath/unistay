# Unistay Part 1 - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### Step 2: Configure Backend Environment

1. Open `backend/.env`
2. Update these critical values:

```env
# Your MongoDB connection (already set, but verify)
MONGODB_URI=mongodb+srv://banulabinath:banula123@cluster0.2doe0aq.mongodb.net/unistay?retryWrites=true&w=majority

# Gmail for sending OTP emails (MUST UPDATE)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Keep these as-is for development
PORT=5000
JWT_SECRET=unistay_jwt_secret_key_2024_change_in_production
OTP_EXPIRY_MINUTES=10
FRONTEND_URL=http://localhost:3000
```

### Step 3: Set Up Gmail App Password

**Important:** You need a Gmail App Password to send OTP emails.

1. Go to your Google Account: https://myaccount.google.com/
2. Click "Security" in the left menu
3. Enable "2-Step Verification" if not already enabled
4. Search for "App passwords" in the search bar
5. Click "App passwords"
6. Select "Mail" and "Windows Computer" (or Other)
7. Click "Generate"
8. Copy the 16-character password
9. Paste it in `backend/.env` as `EMAIL_PASSWORD`

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Browser will open automatically at `http://localhost:3000`

### Step 5: Test the System

#### Test 1: SLIIT Student Registration (Free)

1. Click "Register" button on home page
2. Click "Register as SLIIT Student"
3. Fill the form:
   - Full Name: `Test Student`
   - Email: `your_email@my.sliit.lk` (use your actual SLIIT email)
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
4. Click "Generate OTP & Register"
5. Check your email for the OTP
6. Enter the 6-digit OTP
7. Click "Verify & Activate Account"
8. You'll be redirected to login

#### Test 2: External Student Registration ($120/year)

1. Click "Register" button on home page
2. Click "Register as External Student"
3. Fill the form:
   - Full Name: `External Student`
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
4. Click "Register & Pay Annual Subscription"
5. On payment page, click "Proceed to Payment"
6. Wait for mock payment to process (3 seconds)
7. Account activated automatically
8. Redirected to login

#### Test 3: Vendor Registration ($200/year)

1. Click "Register" button on home page
2. Click "Register as Vendor"
3. Fill the form:
   - Full Name: `Vendor Name`
   - Business Name: `My Business`
   - Email: `vendor@business.com`
   - Vendor Type: Select any (food/boarding/laundry/cleaning)
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
4. Click "Register & Pay for Activation"
5. Complete mock payment
6. Account activated
7. Redirected to login

## 🔍 Verify Everything Works

### Check Backend API
Open browser: `http://localhost:5000/api/health`

Should see:
```json
{
  "success": true,
  "message": "Unistay API is running",
  "timestamp": "2024-03-22T..."
}
```

### Check MongoDB
Use MongoDB Compass or Atlas to verify:
- Database: `unistay`
- Collections: `users`, `otps`, `subscriptions`

### Check Email Sending
- Register a SLIIT student with your real email
- Check inbox (and spam folder) for OTP email
- Email should have a nice HTML template with 6-digit code

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot connect to MongoDB"
**Fix:** Verify MongoDB connection string in `backend/.env`

### Issue 2: "Email not sending"
**Fix:** 
- Ensure Gmail App Password is correct
- Check 2FA is enabled on Gmail
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Check spam folder

### Issue 3: "CORS error in browser"
**Fix:** 
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000
- Check CORS configuration in `backend/app.js`

### Issue 4: "Module not found"
**Fix:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Issue 5: "Port already in use"
**Fix:**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend/.env
PORT=5001
```

## 📱 Test on Mobile

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. Update frontend/.env:
   ```env
   REACT_APP_API_URL=http://192.168.1.100:5000/api
   ```

3. Access from mobile browser:
   ```
   http://192.168.1.100:3000
   ```

## 🎯 What to Test

### Registration Validation
- ✅ Try weak password (should fail)
- ✅ Try mismatched passwords (should fail)
- ✅ Try duplicate email (should fail)
- ✅ Try SLIIT email in external form (should fail)
- ✅ Try non-SLIIT email in SLIIT form (should fail)

### OTP System
- ✅ Enter wrong OTP (should fail)
- ✅ Wait 10+ minutes and try OTP (should expire)
- ✅ Click "Resend OTP" (should get new code)
- ✅ Try using old OTP after resend (should fail)

### Payment Flow
- ✅ Mock payment success (90% chance)
- ✅ Mock payment failure (10% chance)
- ✅ Retry after failure
- ✅ Check subscription created in database

## 📊 Monitor the System

### Backend Console
Watch for:
- `✅ Connected to MongoDB`
- `🚀 Server running on port 5000`
- `OTP Email sent: <messageId>`
- `Welcome email sent to: <email>`

### Browser Console
- No errors should appear
- API calls should return 200/201 status codes

### MongoDB
Check collections after each registration:
- `users` - New user document
- `otps` - OTP record (for SLIIT students)
- `subscriptions` - Subscription record (for paid users)

## 🎉 Success!

If you can complete all three registration flows, you're all set!

## 📚 Next Steps

1. Read `README_PART1.md` for detailed documentation
2. Check `API_DOCUMENTATION.md` for API details
3. Review `IMPLEMENTATION_SUMMARY.md` for what was built

## 💡 Tips

- Use Chrome DevTools Network tab to debug API calls
- Check backend console for detailed error messages
- MongoDB Compass is great for viewing database records
- Use Postman to test API endpoints directly

## 🆘 Still Having Issues?

1. Verify all dependencies are installed
2. Check .env files are configured correctly
3. Ensure MongoDB is accessible
4. Verify ports 3000 and 5000 are available
5. Check firewall/antivirus settings

## 🔐 Security Note

This is a development setup. For production:
- Change all secrets in .env
- Use production MongoDB
- Enable HTTPS
- Add rate limiting
- Use real payment gateway
- Add proper logging and monitoring

---

**Ready to build Part 2?** This foundation is solid and ready for the next features! 🚀
