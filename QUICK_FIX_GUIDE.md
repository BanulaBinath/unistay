# Email Delivery Fix - OTP Not Reaching Outlook Inbox

## Issue Fixed

The OTP email was not being delivered to student Outlook inboxes because:
1. Email credentials were not configured (placeholder values in `.env`)
2. No SMTP connection verification before sending
3. Email errors were not visible for debugging

## Changes Made

### Files Modified (2 files only)

1. **backend/utils/emailService.js**
   - Added SMTP connection verification
   - Added detailed logging for debugging
   - Better error messages
   - TLS configuration for compatibility

2. **backend/Controllers/authController.js**
   - Email status tracking in response
   - Better error visibility
   - OTP logged to console when email fails

## Quick Start

### Option 1: Test Without Email (Immediate)

1. Start servers:
   ```bash
   cd backend && npm start
   cd frontend && npm start
   ```

2. Register at: http://localhost:3000/register/sliit-student

3. **Check backend console for OTP:**
   ```
   📋 OTP for it21999999@my.sliit.lk: 123456 (Use this for testing)
   ```

4. Copy OTP from console and verify

### Option 2: Configure Gmail for Real Email Delivery

#### Step 1: Generate Gmail App Password

1. Go to: https://myaccount.google.com/security
2. Enable "2-Step Verification"
3. Go to: https://myaccount.google.com/apppasswords
4. Generate password for "Mail" → "Other (Unistay)"
5. Copy 16-character password (e.g., `abcdefghijklmnop`)

#### Step 2: Update .env

Edit `backend/.env`:
```env
EMAIL_USER=youremail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
```
(Remove spaces from app password)

#### Step 3: Restart Backend

```bash
cd backend
npm start
```

#### Step 4: Test

1. Register with SLIIT Outlook email
2. **Check backend console** - should see:
   ```
   ✅ SMTP connection verified successfully
   ✅ OTP Email sent successfully!
   ```
3. **Check Outlook inbox** (or spam/junk folder)
4. Enter OTP from email

## Backend Console Output

### Email NOT Configured:
```
📧 Email transporter config: { passwordSet: false }
❌ Email not configured. OTP for testing: 123456
```

### Email Configured Successfully:
```
📧 Email transporter config: { passwordSet: true }
✅ SMTP connection verified successfully
✅ OTP Email sent successfully!
   Accepted: [ 'it21999999@my.sliit.lk' ]
```

### Wrong Credentials:
```
❌ SMTP verification failed: Invalid login
```

## Troubleshooting

### Email in Spam/Junk
- Check Outlook spam/junk folder
- Mark as "Not Spam"

### "Invalid login" Error
- Use App Password, not regular password
- Remove spaces from app password
- Regenerate if needed

### Email Not Received
- Check backend logs for "Accepted"
- Wait 5-10 minutes
- Check spam folder
- Try different email to test

## Verification Checklist

- [ ] `.env` has real Gmail credentials
- [ ] App password (not regular password)
- [ ] Backend restarted after `.env` changes
- [ ] Backend console shows "SMTP connection verified"
- [ ] Backend console shows "Email sent successfully"
- [ ] Checked Outlook inbox
- [ ] Checked Outlook spam/junk folder

## Expected Behavior

1. User registers with SLIIT Outlook email
2. Backend verifies SMTP connection
3. Backend sends email via Gmail
4. Email delivered to Outlook inbox
5. OTP UI opens on frontend
6. User enters OTP from email
7. Registration completes

## Need Help?

Check these files:
- `EMAIL_TESTING_GUIDE.md` - Step-by-step testing
- `EMAIL_DELIVERY_FIX.md` - Detailed technical explanation
- Backend console - Real-time debugging info
