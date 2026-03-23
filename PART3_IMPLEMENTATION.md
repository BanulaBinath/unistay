# Part 3: Admin Management System - Implementation Guide

## Overview
Part 3 implements a complete admin management system with shared login, role-based access control, and comprehensive management dashboards for users, payments, and subscriptions.

## Key Features
- ✅ No separate admin signup (manual database insertion only)
- ✅ Shared login system for all user types including admin
- ✅ Role-based redirect after login
- ✅ Protected admin routes (backend & frontend)
- ✅ User management (view, filter, activate/deactivate)
- ✅ Payment management (view, filter by status)
- ✅ Subscription management (view, filter, update status)
- ✅ Dashboard with statistics

---

## File Structure

```
backend/
├── Model/
│   ├── User.js (UPDATED - added 'admin' role)
│   └── Payment.js (NEW)
├── Controllers/
│   ├── authController.js (UPDATED - admin login support)
│   └── adminController.js (NEW)
├── middleware/
│   └── authMiddleware.js (UPDATED - added isAdmin middleware)
├── Route/
│   └── adminRoutes.js (NEW)
├── scripts/
│   └── createAdmin.js (NEW - seed script)
└── app.js (UPDATED - added admin routes)

frontend/
├── src/
│   ├── Components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js (NEW)
│   │   │   ├── AdminDashboard.css (NEW)
│   │   │   ├── UsersManagement.js (NEW)
│   │   │   ├── UsersManagement.css (NEW)
│   │   │   ├── PaymentsManagement.js (NEW)
│   │   │   ├── PaymentsManagement.css (NEW)
│   │   │   ├── SubscriptionsManagement.js (NEW)
│   │   │   └── SubscriptionsManagement.css (NEW)
│   │   └── Home/
│   │       └── login.js (UPDATED - admin redirect)
│   ├── services/
│   │   └── adminApi.js (NEW)
│   └── App.js (UPDATED - admin routes)
```

---

## Backend Implementation

### 1. User Model Update
**File:** `backend/Model/User.js`

Added 'admin' to role enum:
```javascript
role: {
  type: String,
  enum: ['student_sliit', 'student_external', 'vendor', 'admin'],
  default: 'student_external'
}
```

### 2. Payment Model
**File:** `backend/Model/Payment.js`

New model for tracking payments:
- userId (ref to User)
- subscriptionId (ref to Subscription)
- amount, paymentStatus, paymentMethod
- transactionId, paymentDate

### 3. Admin Middleware
**File:** `backend/middleware/authMiddleware.js`

Added `isAdmin` middleware:
```javascript
const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
};
```

### 4. Admin Controller
**File:** `backend/Controllers/adminController.js`

Implements all admin operations:

**User Management:**
- `getAllUsers` - Get all users with filters (role, isActive, vendorType)
- `getUserById` - Get single user details
- `activateUser` - Activate a user account
- `deactivateUser` - Deactivate a user account

**Payment Management:**
- `getAllPayments` - Get all payments with filters
- `getPaymentById` - Get single payment details

**Subscription Management:**
- `getAllSubscriptions` - Get all subscriptions with filters
- `getSubscriptionById` - Get single subscription details
- `updateSubscriptionStatus` - Update subscription status

**Dashboard:**
- `getDashboardStats` - Get statistics for admin dashboard

### 5. Admin Routes
**File:** `backend/Route/adminRoutes.js`

All routes protected with `verifyToken` and `isAdmin`:

```
GET    /api/admin/dashboard/stats
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id/activate
PATCH  /api/admin/users/:id/deactivate
GET    /api/admin/payments
GET    /api/admin/payments/:id
GET    /api/admin/subscriptions
GET    /api/admin/subscriptions/:id
PATCH  /api/admin/subscriptions/:id/status
```

### 6. Create Admin Script
**File:** `backend/scripts/createAdmin.js`

Seed script to create admin account manually:
```bash
node backend/scripts/createAdmin.js
```

Default credentials:
- Email: admin@unistay.com
- Password: Admin@123456

---

## Frontend Implementation

### 1. Login Update
**File:** `frontend/src/Components/Home/login.js`

Added admin redirect logic:
```javascript
if (role === 'admin') {
  navigate('/admin/dashboard');
} else if (role === 'student_sliit' || role === 'student_external') {
  navigate('/student/dashboard');
} else if (role === 'vendor') {
  navigate(`/vendor/${vendorType}/dashboard`);
}
```

### 2. Admin API Service
**File:** `frontend/src/services/adminApi.js`

Centralized API calls for admin operations with JWT authentication.

### 3. Admin Dashboard
**File:** `frontend/src/Components/admin/AdminDashboard.js`

Main admin dashboard showing:
- User statistics (total, active, students, vendors)
- Subscription statistics (active, expired)
- Payment statistics (completed, pending)
- Total revenue
- Navigation to management pages

### 4. Users Management
**File:** `frontend/src/Components/admin/UsersManagement.js`

Features:
- View all users in table format
- Filter by role, active status, vendor type
- Activate/deactivate users
- Pagination support

### 5. Payments Management
**File:** `frontend/src/Components/admin/PaymentsManagement.js`

Features:
- View all payments
- Filter by payment status
- Display transaction details
- Pagination support

### 6. Subscriptions Management
**File:** `frontend/src/Components/admin/SubscriptionsManagement.js`

Features:
- View all subscriptions
- Filter by activation status
- Update subscription status (active/inactive/expired)
- View expiry dates
- Pagination support

### 7. Protected Routes
**File:** `frontend/src/App.js`

Admin routes protected with ProtectedRoute component:
```javascript
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

---

## Setup Instructions

### 1. Create Admin Account
```bash
cd backend
node scripts/createAdmin.js
```

This creates an admin user with:
- Email: admin@unistay.com
- Password: Admin@123456

### 2. Start Backend
```bash
cd backend
npm install
npm start
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Login as Admin
1. Go to http://localhost:3000/login
2. Enter admin credentials
3. You'll be redirected to /admin/dashboard

---

## API Endpoints

### Dashboard Stats
```
GET /api/admin/dashboard/stats
Authorization: Bearer <token>
```

### User Management
```
GET /api/admin/users?role=vendor&isActive=true&page=1&limit=10
GET /api/admin/users/:id
PATCH /api/admin/users/:id/activate
PATCH /api/admin/users/:id/deactivate
```

### Payment Management
```
GET /api/admin/payments?paymentStatus=completed&page=1&limit=10
GET /api/admin/payments/:id
```

### Subscription Management
```
GET /api/admin/subscriptions?activationStatus=active&page=1&limit=10
GET /api/admin/subscriptions/:id
PATCH /api/admin/subscriptions/:id/status
Body: { "activationStatus": "expired" }
```

---

## Security Features

1. **No Admin Signup:** Admin accounts can only be created via database script
2. **JWT Authentication:** All admin routes require valid JWT token
3. **Role-Based Access:** Admin middleware verifies user role
4. **Protected Frontend Routes:** ProtectedRoute component blocks unauthorized access
5. **Shared Login:** Same login endpoint for all users, role-based redirect

---

## Testing

### Test Admin Login
1. Create admin account using seed script
2. Login at /login with admin credentials
3. Verify redirect to /admin/dashboard
4. Check that statistics load correctly

### Test User Management
1. Navigate to Users Management
2. Apply filters (role, status, vendor type)
3. Activate/deactivate a user
4. Verify changes persist

### Test Payment Management
1. Navigate to Payments Management
2. Filter by payment status
3. View payment details

### Test Subscription Management
1. Navigate to Subscriptions Management
2. Filter by activation status
3. Update a subscription status
4. Verify user account status updates accordingly

### Test Route Protection
1. Try accessing /admin/dashboard without login → Redirect to login
2. Login as student → Try /admin/dashboard → Access denied
3. Login as vendor → Try /admin/users → Access denied
4. Only admin role can access admin routes

---

## Notes

- Admin accounts must be created manually using the seed script
- Admin users don't need subscriptions (subscriptionStatus: 'none')
- Admin users are always active (isActive: true)
- Changing subscription status to 'expired' or 'inactive' will deactivate the user
- All admin operations are logged in the backend console
- Pagination defaults to 10 items per page

---

## Future Enhancements

- Admin activity logs
- Bulk user operations
- Export data to CSV
- Email notifications for admin actions
- Advanced analytics and reporting
- Admin role permissions (super admin, moderator)
- Password reset for admin accounts
