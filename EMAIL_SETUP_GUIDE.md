# Email Configuration Setup Guide

## Issue Fixed
The student registration OTP feature was failing because:
1. Email credentials were not configured in `.env` file
2. Password validation was too strict (backend vs frontend mismatch)

## Changes Made

### 1. Password Validation (backend/middleware/validation.js)
- Relaxed password requirements to match frontend
- Now requires only 8+ characters (removed uppercase, lowercase, number, special char requirements)

### 2. Email Service (backend/utils/emailService.js)
- Added configuration check to detect missing email credentials
- Improved error messages to show exact issue

### 3. Auth Controller (backend/Controllers/authController.js)
- Made registration resilient to email failures
- Registration now succeeds even if email service is unavailable
- OTP is logged to console when email fails (for development/testing)
- Better error messages for different failure scenarios

## Email Configuration Steps

### Option 1: Gmail (Recommended for Development)

1. Open `backend/.env` file

2. Update email configuration:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
```

3. Generate Gmail App Password:
   - Go to Google Account Settings: https://myaccount.google.com/
   - Security → 2-Step Verification (enable if not already)
   - Security → App passwords
   - Select app: "Mail"
   - Select device: "Other" (enter "Unistay")
   - Copy the 16-digit password
   - Paste it as EMAIL_PASSWORD in .env

### Option 2: Other Email Providers

#### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Yahoo
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
```

#### Custom SMTP
```env
EMAIL_HOST=your-smtp-host.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
```

## Testing Without Email Configuration

The system now works even without email configuration:
- Registration will succeed
- OTP will be logged to backend console
- Copy OTP from console and use it for verification

Example console output:
```
OTP for it21000000@my.sliit.lk: 123456 (Email service unavailable)
```

## Manual Testing Instructions

### Test 1: Registration with Email Configured

1. Start backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Navigate to: http://localhost:3000/register/sliit-student

4. Fill in the form:
   - Full Name: John Doe
   - Email: it21000000@my.sliit.lk
   - Password: password123 (8+ characters)
   - Confirm Password: password123

5. Click "Generate OTP & Register"

6. Expected Result:
   - Success message appears
   - Redirects to OTP verification page
   - Email received with OTP code

### Test 2: Registration without Email (Development Mode)

1. Keep default .env email settings (placeholders)

2. Follow steps 1-5 from Test 1

3. Expected Result:
   - Success message appears
   - Redirects to OTP verification page
   - Check backend console for OTP code
   - Use that OTP to verify

### Test 3: Validation Errors

1. Try with invalid email: test@gmail.com
   - Should show: "Please use your SLIIT student email (@my.sliit.lk)"

2. Try with short password: pass123
   - Should show: "Password must be at least 8 characters"

3. Try with mismatched passwords
   - Should show: "Passwords do not match"

### Test 4: Duplicate Registration

1. Register with same email twice
   - Should show: "Email already registered"

## Production Deployment

For production, you MUST configure real email credentials:

1. Use a dedicated email service (SendGrid, AWS SES, Mailgun)
2. Never commit .env file to version control
3. Set environment variables on your hosting platform
4. Test email delivery before going live

## Troubleshooting

### "Email service not configured" error
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Make sure they're not placeholder values
- Restart backend server after changing .env

### Gmail "Less secure app" error
- Use App Password instead of regular password
- Enable 2-Step Verification first

### OTP not received
- Check spam/junk folder
- Verify email address is correct
- Check backend console for OTP (development mode)
- Try resend OTP button

### "Invalid or expired OTP"
- OTP expires in 10 minutes
- Use resend OTP to get a new code
- Make sure you're using the latest OTP

## Support

If issues persist:
1. Check backend console for detailed error logs
2. Verify MongoDB connection is working
3. Ensure all npm packages are installed
4. Check network/firewall settings for SMTP port 587
