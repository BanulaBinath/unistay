# Unistay - Part 1: User Registration + Subscription Activation

## Overview
This is Part 1 of the Unistay system, focusing exclusively on user registration and subscription activation for three user categories:
1. SLIIT Students (Free with OTP verification)
2. Non-SLIIT Students (Annual subscription required)
3. Vendors (Annual subscription required)

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React
- **Authentication**: JWT (prepared), bcrypt
- **Email**: Nodemailer
- **Payment**: Mock service (ready for real gateway integration)

## Project Structure

```
unistay/
├── backend/
│   ├── Controllers/
│   │   └── authController.js          # Registration & OTP logic
│   ├── middleware/
│   │   └── validation.js              # Input validation
│   ├── Model/
│   │   ├── User.js                    # User schema
│   │   ├── OTP.js                     # OTP schema
│   │   └── Subscription.js            # Subscription schema
│   ├── Route/
│   │   └── authRoutes.js              # API routes
│   ├── utils/
│   │   ├── emailService.js            # Email sending
│   │   ├── otpGenerator.js            # OTP generation
│   │   └── paymentService.js          # Payment mock
│   ├── app.js                         # Main server file
│   ├── .env                           # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── Components/
    │   │   └── Home/
    │   │       ├── nomalhome.js                    # Home page
    │   │       ├── RegisterSelection.js            # Registration type selection
    │   │       ├── SLIITStudentRegister.js        # SLIIT registration form
    │   │       ├── OTPVerification.js             # OTP verification page
    │   │       ├── ExternalStudentRegister.js     # External student form
    │   │       ├── VendorRegister.js              # Vendor registration form
    │   │       ├── PaymentProcess.js              # Payment processing
    │   │       └── [corresponding CSS files]
    │   ├── services/
    │   │   └── api.js                             # API service layer
    │   └── App.js                                 # Main app with routes
    └── package.json
```

## API Endpoints

### Authentication Routes (Base: `/api/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/sliit-student` | Register SLIIT student (free) |
| POST | `/verify-otp` | Verify OTP for SLIIT students |
| POST | `/resend-otp` | Resend OTP to email |
| POST | `/register/external-student` | Register external student (paid) |
| POST | `/register/vendor` | Register vendor (paid) |
| POST | `/payment/success` | Process payment success callback |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following in `.env`:
     - `MONGODB_URI`: Your MongoDB connection string
     - `EMAIL_USER`: Your Gmail address
     - `EMAIL_PASSWORD`: Your Gmail app password (not regular password)
     - `JWT_SECRET`: A secure random string

4. Gmail App Password Setup:
   - Go to Google Account settings
   - Enable 2-Factor Authentication
   - Generate an App Password for "Mail"
   - Use this app password in `.env`

5. Start the backend server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## User Flows

### 1. SLIIT Student Registration Flow
1. User clicks "Register" on home page
2. Selects "SLIIT Student" option
3. Fills registration form with:
   - Full name
   - SLIIT email (@my.sliit.lk)
   - Password
   - Confirm password
4. Submits form → OTP sent to email
5. Enters 6-digit OTP on verification page
6. Account activated automatically
7. Redirected to login

**Key Features:**
- Free registration
- Email must end with @my.sliit.lk
- OTP expires in 10 minutes
- Can resend OTP if needed
- Account active immediately after OTP verification

### 2. External Student Registration Flow
1. User clicks "Register" on home page
2. Selects "External Student" option
3. Fills registration form with:
   - Full name
   - Personal email (not SLIIT)
   - Password
   - Confirm password
4. Submits form → Redirected to payment page
5. Reviews subscription details ($120/year)
6. Completes payment (mock)
7. Account activated automatically
8. Redirected to login

**Key Features:**
- $120 annual subscription
- Any valid email (except SLIIT)
- Instant activation after payment
- No OTP required

### 3. Vendor Registration Flow
1. User clicks "Register" on home page
2. Selects "Partner with Unistay" option
3. Fills registration form with:
   - Full name
   - Business name
   - Business email
   - Vendor type (food/boarding/laundry/cleaning)
   - Password
   - Confirm password
4. Submits form → Redirected to payment page
5. Reviews subscription details ($200/year)
6. Completes payment (mock)
7. Account activated automatically
8. Redirected to login

**Key Features:**
- $200 annual subscription
- Must select vendor type
- Business information required
- Instant activation after payment
- No OTP required

## Database Models

### User Model
```javascript
{
  fullName: String,
  businessName: String (vendors only),
  email: String (unique),
  password: String (hashed),
  role: String (student_sliit | student_external | vendor),
  vendorType: String (food | boarding | laundry | cleaning),
  isVerified: Boolean,
  isActive: Boolean,
  subscriptionStatus: String (none | pending | active | expired),
  timestamps: true
}
```

### OTP Model
```javascript
{
  userId: ObjectId,
  email: String,
  otp: String (6 digits),
  expiresAt: Date,
  isUsed: Boolean,
  timestamps: true
}
```

### Subscription Model
```javascript
{
  userId: ObjectId,
  subscriptionType: String (annual_student | annual_vendor),
  amount: Number,
  paymentStatus: String (pending | completed | failed | refunded),
  paymentMethod: String,
  transactionId: String,
  activationStatus: String (inactive | active | expired),
  paidDate: Date,
  expiryDate: Date,
  timestamps: true
}
```

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&#)

### Email Validation
- SLIIT students: Must end with @my.sliit.lk
- External students: Valid email, cannot be SLIIT email
- Vendors: Any valid email

### Other Validations
- Full name: Minimum 2 characters
- Business name: Minimum 2 characters (vendors)
- Vendor type: Must be one of: food, boarding, laundry, cleaning
- Duplicate email prevention

## Payment Integration

Currently using a mock payment service. To integrate a real payment gateway:

1. Update `backend/utils/paymentService.js`
2. Replace mock functions with actual gateway API calls
3. Common gateways: Stripe, PayPal, Square
4. Update payment session creation and processing logic

## Email Configuration

The system uses Nodemailer with Gmail SMTP. To use a different email provider:

1. Update `backend/utils/emailService.js`
2. Change SMTP configuration in `.env`:
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - Update authentication method if needed

## Security Features

- Password hashing with bcrypt (12 rounds)
- Input validation on both frontend and backend
- Email verification for SLIIT students
- Secure OTP generation (6 digits, 10-minute expiry)
- Environment variables for sensitive data
- CORS configuration
- SQL injection prevention (Mongoose)

## Testing the System

### Test SLIIT Student Registration
1. Use email: `test@my.sliit.lk`
2. Check email for OTP (or check backend console logs)
3. Enter OTP to verify

### Test External Student Registration
1. Use any non-SLIIT email
2. Mock payment will succeed (90% success rate)
3. Account activates immediately

### Test Vendor Registration
1. Use business email
2. Select vendor type
3. Mock payment will succeed
4. Account activates immediately

## Troubleshooting

### Email not sending
- Check Gmail app password is correct
- Ensure 2FA is enabled on Gmail
- Check firewall/antivirus settings
- Verify SMTP settings in `.env`

### MongoDB connection error
- Verify MongoDB is running
- Check connection string in `.env`
- Ensure IP whitelist (if using Atlas)

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify `REACT_APP_API_URL` in frontend `.env`

## Next Steps (Not in Part 1)

The following features are NOT included in Part 1:
- Login functionality (UI exists but not connected)
- Admin dashboard
- Service modules (food, laundry, boarding, cleaning)
- User profile management
- Vendor dashboards
- Booking systems
- Payment history

## Notes

- This is a development setup. For production:
  - Use proper environment variables
  - Enable HTTPS
  - Use production MongoDB
  - Integrate real payment gateway
  - Add rate limiting
  - Implement proper logging
  - Add monitoring

## Support

For issues or questions about Part 1 implementation, check:
- API endpoint responses
- Browser console for frontend errors
- Backend console for server errors
- MongoDB for data verification
