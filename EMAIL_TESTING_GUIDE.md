# Email Testing Guide - Quick Steps

## Current Status
- ✅ OTP UI opens correctly
- ✅ Registration flow works
- ❌ Email not being delivered to Outlook inbox

## Root Cause
Email credentials in `.env` are placeholders. Need to configure real SMTP credentials.

## Quick Fix (5 Minutes)

### Option 1: Test Without Email (Immediate)

1. Start backend:
   ```bash
   cd backend
   npm start
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Register at: http://localhost:3000/register/sliit-student

4. **Watch backend console** - you'll see:
   ```
   📧 Attempting to send OTP email to: it21999999@my.sliit.lk
   ❌ Email not configured. OTP for testing: 123456
   📋 OTP for it21999999@my.sliit.lk: 123456 (Use this for testing)
   ```

5. Copy OTP from console (e.g., `123456`)

6. Enter OTP in the verification page

7. Complete registration

### Option 2: Configure Gmail (10 Minutes)

#### Step 1: Generate Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already enabled)
3. Go to: https://myaccount.google.com/apppasswords
4. Select app: "Mail"
5. Select device: "Other" → Enter "Unistay"
6. Click "Generate"
7. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

#### Step 2: Update .env File

1. Open `backend/.env`

2. Replace these lines:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password_here
   ```

   With your actual credentials:
   ```env
   EMAIL_USER=youremail@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   (Remove spaces from app password)

3. Save the file

#### Step 3: Restart Backend

```bash
# Stop backend (Ctrl+C)
cd backend
npm start
```

#### Step 4: Test Email Delivery

1. Go to: http://localhost:3000/register/sliit-student

2. Fill form with SLIIT Outlook email (e.g., it21999999@my.sliit.lk)

3. Click "Generate OTP & Register"

4. **Check backend console** - should see:
   ```
   ✅ SMTP connection verified successfully
   ✅ OTP Email sent successfully!
      Message ID: <abc123@gmail.com>
      Accepted: [ 'it21999999@my.sliit.lk' ]
   ```

5. **Check Outlook inbox** (the SLIIT email you registered with)

6. **If not in inbox, check spam/junk folder**

7. Enter OTP from email

## What to Look For

### Backend Console - Email NOT Configured:
```
📧 Email transporter config: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'your_email@gmail.com',
  passwordSet: false          ← FALSE means not configured
}
❌ Email not configured. OTP for testing: 123456
```

### Backend Console - Email Configured Successfully:
```
📧 Email transporter config: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'youremail@gmail.com',
  passwordSet: true           ← TRUE means configured
}
🔍 Verifying SMTP connection...
✅ SMTP connection verified successfully
📤 Sending email...
✅ OTP Email sent successfully!
   Accepted: [ 'it21999999@my.sliit.lk' ]
```

### Backend Console - Wrong Credentials:
```
📧 Email transporter config: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'youremail@gmail.com',
  passwordSet: true
}
🔍 Verifying SMTP connection...
❌ SMTP verification failed: Invalid login: 535-5.7.8 Username and Password not accepted
```

## Common Issues

### 1. Email in Spam/Junk Folder

**Solution:**
- Check Outlook spam/junk folder
- Mark as "Not Spam"
- Add sender to safe senders list

### 2. "Invalid login" Error

**Causes:**
- Using regular Gmail password instead of App Password
- App password has spaces
- Wrong email address

**Solution:**
- Generate new App Password
- Copy without spaces
- Verify email is correct

### 3. "Connection timeout"

**Causes:**
- Firewall blocking port 587
- Wrong SMTP host

**Solution:**
- Check firewall settings
- Verify EMAIL_HOST=smtp.gmail.com
- Try port 465 (change EMAIL_PORT=465)

### 4. Email Sent but Not Received

**Check:**
1. Backend logs show "Accepted: [ 'email@my.sliit.lk' ]"
2. Outlook spam/junk folder
3. Wait 5-10 minutes (email can be delayed)
4. Try different email to test

## Verification Checklist

Before testing:
- [ ] Backend running without errors
- [ ] Frontend running and accessible
- [ ] MongoDB connected (check backend logs)

For email delivery:
- [ ] `.env` has real Gmail credentials
- [ ] App password generated (not regular password)
- [ ] App password has no spaces
- [ ] Backend restarted after `.env` changes

During testing:
- [ ] Backend console shows detailed logs
- [ ] SMTP connection verified (if configured)
- [ ] Email sent successfully (if configured)
- [ ] OTP UI opens on frontend
- [ ] Can enter OTP and verify

## Expected Results

### Without Email Configuration:
✅ Registration succeeds
✅ OTP UI opens
✅ OTP visible in backend console
✅ Can copy OTP and verify
✅ Registration completes

### With Email Configuration:
✅ Registration succeeds
✅ SMTP connection verified
✅ Email sent successfully
✅ OTP UI opens
✅ Email received in Outlook inbox (or spam)
✅ Can enter OTP from email
✅ Registration completes

## Next Steps

1. **For Development:** Use Option 1 (console OTP) - fastest
2. **For Testing Email:** Use Option 2 (Gmail) - 10 minutes setup
3. **For Production:** Use dedicated email service (SendGrid, AWS SES)

## Need Help?

Check these files for more details:
- `EMAIL_DELIVERY_FIX.md` - Detailed fix explanation
- `EMAIL_SETUP_GUIDE.md` - Complete email setup guide
- Backend console - Real-time debugging info

## Summary

**What was fixed:**
- Added SMTP connection verification
- Added detailed logging at every step
- Email status now visible in backend console
- OTP always available for testing
- Better error messages

**What you need to do:**
- Configure Gmail credentials in `.env`
- Restart backend
- Test registration
- Check backend console for status
- Check Outlook inbox/spam for email
