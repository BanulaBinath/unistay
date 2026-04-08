# Visual Testing Guide - What You'll See

## Step-by-Step Visual Guide

### Step 1: Start Backend

**Command:**
```bash
cd backend
npm start
```

**What you'll see:**
```
> backend@1.0.0 start
> node app.js

✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Step 2: Register a Student

**Go to:** http://localhost:3000/register/sliit-student

**Fill form:**
- Full Name: `Test Student`
- Email: `it21999999@my.sliit.lk`
- Password: `testpass123`
- Confirm Password: `testpass123`

**Click:** "Generate OTP & Register"

### Step 3: Watch Backend Console

## Scenario A: Email NOT Configured (Default)

**Backend console will show:**

```
📧 Email transporter config: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'your_email@gmail.com',
  passwordSet: false                    ← NOT CONFIGURED
}

📧 Attempting to send OTP email to: it21999999@my.sliit.lk
❌ Email not configured. OTP for testing: 123456    ← YOUR OTP CODE
⚠️  Registration complete but email sending failed: Email service not configured
📋 OTP for it21999999@my.sliit.lk: 123456 (Use this for testing)    ← COPY THIS
```

**What to do:**
1. ✅ OTP UI opens on frontend
2. ✅ Copy `123456` from console
3. ✅ Paste into OTP verification page
4. ✅ Complete registration

---

## Scenario B: Email Configured Correctly

**Backend console will show:**

```
📧 Email transporter config: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'youremail@gmail.com',
  passwordSet: true                     ← CONFIGURED
}

📧 Attempting to send OTP email to: it21999999@my.sliit.lk
🔍 Verifying SMTP connection...
✅ SMTP connection verified successfully    ← CONNECTION OK
📤 Sending email...
   From: "Unistay Support" <youremail@gmail.com>
   To: it21999999@my.sliit.lk
   Subject: Verify Your Unistay Account - OTP
✅ OTP Email sent successfully!               ← EMAIL SENT
   Message ID: <abc123@gmail.com>
   Response: 250 2.0.0 OK
   Accepted: [ 'it21999999@my.sliit.lk' ]   ← ACCEPTED BY SERVER
   Rejected: []                              ← NO REJECTIONS
✅ Registration complete for it21999999@my.sliit.lk - OTP email sent
```

**What to do:**
1. ✅ OTP UI opens on frontend
2. ✅ Check Outlook inbox for email
3. ✅ If not in inbox, check spam/junk folder
4. ✅ Open email and copy OTP
5. ✅ Enter OTP in verification page
6. ✅ Complete registration

---

## Scenario C: Wrong Email Credentials

**Backend console will show:**

```
📧 Email transporter config: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'youremail@gmail.com',
  passwordSet: true
}

📧 Attempting to send OTP email to: it21999999@my.sliit.lk
🔍 Verifying SMTP connection...
❌ SMTP verification failed: Invalid login: 535-5.7.8 Username and Password not accepted    ← WRONG CREDENTIALS

❌ Failed to send OTP email
   Error type: undefined
   Error message: SMTP connection failed: Invalid login: 535-5.7.8 Username and Password not accepted
   OTP for manual testing: 123456    ← FALLBACK OTP

⚠️  Registration complete but email sending failed: SMTP connection failed: Invalid login
📋 OTP for it21999999@my.sliit.lk: 123456 (Use this for testing)
```

**What to do:**
1. ✅ OTP UI still opens
2. ✅ Copy OTP from console for now
3. ❌ Fix email credentials:
   - Regenerate Gmail App Password
   - Update `.env` file
   - Restart backend
4. ✅ Try again or use console OTP

---

## Scenario D: Firewall/Network Issue

**Backend console will show:**

```
📧 Email transporter config: {
  host: 'smtp.gmail.com',
  port: 587,
  user: 'youremail@gmail.com',
  passwordSet: true
}

📧 Attempting to send OTP email to: it21999999@my.sliit.lk
🔍 Verifying SMTP connection...
❌ SMTP verification failed: Connection timeout    ← NETWORK ISSUE

❌ Failed to send OTP email
   Error type: ETIMEDOUT
   Error message: SMTP connection failed: Connection timeout
   OTP for manual testing: 123456

⚠️  Registration complete but email sending failed
📋 OTP for it21999999@my.sliit.lk: 123456 (Use this for testing)
```

**What to do:**
1. ✅ Use console OTP for now
2. ❌ Check firewall settings
3. ❌ Verify port 587 is open
4. ❌ Try different network

---

## What the Email Looks Like

When email is successfully delivered to Outlook inbox:

**Subject:** Verify Your Unistay Account - OTP

**From:** Unistay Support <youremail@gmail.com>

**Body:**
```
Welcome to Unistay

Hello Test Student,

Thank you for registering with Unistay! To complete your registration, 
please verify your email address using the OTP below:

┌─────────────────┐
│   1 2 3 4 5 6   │  ← Your OTP Code
└─────────────────┘

This OTP will expire in 10 minutes.

If you didn't request this verification, please ignore this email.

© 2026 Unistay. All rights reserved.
SLIIT Student Support Services
```

---

## Frontend OTP Verification Page

**What you'll see:**

```
┌────────────────────────────────────────┐
│  Welcome, Test Student!                │
│  Enter the 6-digit code to activate    │
│                                        │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ │
│  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │ │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘ │
│                                        │
│  [Verify & Activate Account]           │
│                                        │
│  Didn't receive the code?              │
│  [Resend OTP]                          │
└────────────────────────────────────────┘
```

---

## Quick Reference

### ✅ Success Indicators

**Backend Console:**
- `✅ SMTP connection verified successfully`
- `✅ OTP Email sent successfully!`
- `Accepted: [ 'email@my.sliit.lk' ]`
- `Rejected: []`

**Outlook Inbox:**
- Email from "Unistay Support"
- Subject: "Verify Your Unistay Account - OTP"
- 6-digit OTP code visible

**Frontend:**
- OTP verification page opens
- Can enter 6 digits
- Verification succeeds

### ❌ Error Indicators

**Backend Console:**
- `❌ Email not configured`
- `❌ SMTP verification failed`
- `❌ Failed to send OTP email`
- `passwordSet: false`

**What to check:**
1. `.env` file has real credentials
2. Using App Password (not regular password)
3. No spaces in app password
4. Backend restarted after `.env` changes

---

## Testing Checklist

### Before Testing:
- [ ] Backend running (`npm start` in backend folder)
- [ ] Frontend running (`npm start` in frontend folder)
- [ ] MongoDB connected (check backend logs)

### During Testing:
- [ ] Registration form loads
- [ ] Can fill all fields
- [ ] Click "Generate OTP & Register"
- [ ] Watch backend console for logs
- [ ] OTP UI opens on frontend

### Email NOT Configured:
- [ ] Console shows `passwordSet: false`
- [ ] Console shows OTP code
- [ ] Copy OTP from console
- [ ] Enter in verification page
- [ ] Verification succeeds

### Email Configured:
- [ ] Console shows `passwordSet: true`
- [ ] Console shows "SMTP connection verified"
- [ ] Console shows "Email sent successfully"
- [ ] Check Outlook inbox
- [ ] Check Outlook spam/junk folder
- [ ] Email received with OTP
- [ ] Enter OTP from email
- [ ] Verification succeeds

---

## Common Console Patterns

### Pattern 1: Everything Working
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📧 Email transporter config: { passwordSet: true }
✅ SMTP connection verified successfully
✅ OTP Email sent successfully!
✅ Registration complete for email@my.sliit.lk - OTP email sent
```

### Pattern 2: Email Not Configured (Expected in Dev)
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📧 Email transporter config: { passwordSet: false }
❌ Email not configured. OTP for testing: 123456
📋 OTP for email@my.sliit.lk: 123456 (Use this for testing)
```

### Pattern 3: Wrong Credentials
```
✅ Connected to MongoDB
🚀 Server running on port 5000
📧 Email transporter config: { passwordSet: true }
❌ SMTP verification failed: Invalid login
📋 OTP for email@my.sliit.lk: 123456 (Use this for testing)
```

---

## Summary

**Look for these in backend console:**

1. **Email config status:** `passwordSet: true` or `false`
2. **SMTP verification:** `✅ SMTP connection verified` or `❌ SMTP verification failed`
3. **Email sending:** `✅ OTP Email sent successfully!` or `❌ Failed to send OTP email`
4. **Fallback OTP:** `📋 OTP for email: 123456` (always available)

**The system always works:**
- Email configured → Email sent to Outlook
- Email not configured → OTP in console
- Email fails → OTP in console as fallback

**You can always complete registration!**
