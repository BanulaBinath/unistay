# Unistay API Documentation - Part 1

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. Register SLIIT Student

**Endpoint:** `POST /auth/register/sliit-student`

**Description:** Register a SLIIT student with free access. Sends OTP to email for verification.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "it21000000@my.sliit.lk",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Please check your email for OTP verification.",
  "data": {
    "userId": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "it21000000@my.sliit.lk",
    "role": "student_sliit"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please use your SLIIT student email (@my.sliit.lk)"
    }
  ]
}
```

---

### 2. Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Description:** Verify OTP and activate SLIIT student account.

**Request Body:**
```json
{
  "email": "it21000000@my.sliit.lk",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Account verified successfully! You can now log in.",
  "data": {
    "userId": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "it21000000@my.sliit.lk",
    "isActive": true
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

### 3. Resend OTP

**Endpoint:** `POST /auth/resend-otp`

**Description:** Resend OTP to SLIIT student email.

**Request Body:**
```json
{
  "email": "it21000000@my.sliit.lk"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP resent successfully! Please check your email."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "OTP resend is only available for SLIIT students"
}
```

---

### 4. Register External Student

**Endpoint:** `POST /auth/register/external-student`

**Description:** Register an external student. Requires annual subscription payment.

**Request Body:**
```json
{
  "fullName": "Jane Smith",
  "email": "jane.smith@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Please complete payment to activate your account.",
  "data": {
    "userId": "60d5ec49f1b2c72b8c8e4f1b",
    "email": "jane.smith@example.com",
    "role": "student_external",
    "paymentSession": {
      "sessionId": "SESSION_1234567890_abc123",
      "amount": 120,
      "currency": "USD",
      "paymentUrl": "http://localhost:3000/payment/process",
      "expiresAt": "2024-03-22T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "SLIIT students should use the SLIIT registration form"
    }
  ]
}
```

---

### 5. Register Vendor

**Endpoint:** `POST /auth/register/vendor`

**Description:** Register a vendor/service provider. Requires annual subscription payment.

**Request Body:**
```json
{
  "fullName": "Alex Sterling",
  "businessName": "Sterling Gourmet Services",
  "email": "alex@sterling.com",
  "vendorType": "food",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!"
}
```

**Vendor Types:** `food`, `boarding`, `laundry`, `cleaning`

**Success Response (201):**
```json
{
  "success": true,
  "message": "Registration successful! Please complete payment to activate your account.",
  "data": {
    "userId": "60d5ec49f1b2c72b8c8e4f1c",
    "email": "alex@sterling.com",
    "role": "vendor",
    "vendorType": "food",
    "paymentSession": {
      "sessionId": "SESSION_1234567890_xyz789",
      "amount": 200,
      "currency": "USD",
      "paymentUrl": "http://localhost:3000/payment/process",
      "expiresAt": "2024-03-22T10:30:00.000Z"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "errors": [
    {
      "field": "vendorType",
      "message": "Invalid vendor type"
    }
  ]
}
```

---

### 6. Process Payment Success

**Endpoint:** `POST /auth/payment/success`

**Description:** Process successful payment and activate user account.

**Request Body:**
```json
{
  "userId": "60d5ec49f1b2c72b8c8e4f1b",
  "sessionId": "SESSION_1234567890_abc123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment successful! Your account is now active.",
  "data": {
    "userId": "60d5ec49f1b2c72b8c8e4f1b",
    "email": "jane.smith@example.com",
    "isActive": true,
    "subscriptionStatus": "active",
    "transactionId": "TXN_1711097400000_ABC123XYZ"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Payment failed. Please try again."
}
```

---

## Health Check

### Server Health

**Endpoint:** `GET /api/health`

**Description:** Check if the API server is running.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Unistay API is running",
  "timestamp": "2024-03-22T09:15:30.000Z"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request / Validation error |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Common Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "fieldName",
      "message": "Specific error message"
    }
  ]
}
```

---

## Password Validation Rules

All passwords must meet these requirements:
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%*?&#)

---

## Email Validation Rules

### SLIIT Students
- Must end with `@my.sliit.lk`
- Example: `it21000000@my.sliit.lk`

### External Students
- Any valid email format
- Cannot be a SLIIT email
- Example: `student@example.com`

### Vendors
- Any valid email format
- Example: `business@company.com`

---

## OTP System

- OTP is 6 digits
- Valid for 10 minutes
- Can be resent (old OTPs are invalidated)
- Only for SLIIT students
- Sent via email

---

## Payment System

### Current Implementation
- Mock payment service
- 90% success rate for testing
- Instant activation on success

### Subscription Pricing
- External Students: $120/year
- Vendors: $200/year
- SLIIT Students: Free

### Payment Flow
1. User completes registration
2. Payment session created
3. User redirected to payment page
4. Payment processed (mock)
5. On success: Account activated, subscription created
6. User redirected to login

---

## Testing with Postman/cURL

### Example: Register SLIIT Student

```bash
curl -X POST http://localhost:5000/api/auth/register/sliit-student \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Student",
    "email": "test@my.sliit.lk",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

### Example: Verify OTP

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@my.sliit.lk",
    "otp": "123456"
  }'
```

### Example: Register External Student

```bash
curl -X POST http://localhost:5000/api/auth/register/external-student \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "External Student",
    "email": "external@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!"
  }'
```

---

## Notes

- All endpoints use JSON for request and response
- CORS is enabled for `http://localhost:3000`
- Passwords are hashed with bcrypt (12 rounds)
- MongoDB ObjectIds are used for user references
- Timestamps are in ISO 8601 format
