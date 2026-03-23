# Part 3: Admin System Architecture

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         UNISTAY PART 3                          │
│                    Admin Management System                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Login     │  │    Admin     │  │   Users      │         │
│  │    Page      │→ │  Dashboard   │→ │ Management   │         │
│  │  (Shared)    │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                           ↓                                      │
│                    ┌──────────────┐  ┌──────────────┐         │
│                    │   Payments   │  │Subscriptions │         │
│                    │ Management   │  │ Management   │         │
│                    └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           ProtectedRoute Component                      │   │
│  │  - Checks authentication                                │   │
│  │  - Verifies user role                                   │   │
│  │  - Blocks unauthorized access                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              adminApi.js Service                        │   │
│  │  - Centralized API calls                                │   │
│  │  - JWT token management                                 │   │
│  │  - Error handling                                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS + JWT
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      BACKEND (Express)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                   API Routes                            │   │
│  │                                                          │   │
│  │  /api/auth/login (Shared)                              │   │
│  │  /api/admin/dashboard/stats                            │   │
│  │  /api/admin/users                                      │   │
│  │  /api/admin/payments                                   │   │
│  │  /api/admin/subscriptions                              │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                  Middleware Layer                       │   │
│  │                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐                   │   │
│  │  │ verifyToken  │→ │   isAdmin    │                   │   │
│  │  │  Middleware  │  │  Middleware  │                   │   │
│  │  └──────────────┘  └──────────────┘                   │   │
│  │                                                          │   │
│  │  - Validates JWT token                                  │   │
│  │  - Checks token expiration                              │   │
│  │  - Verifies admin role                                  │   │
│  │  - Blocks unauthorized access                           │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                  Controllers                            │   │
│  │                                                          │   │
│  │  ┌──────────────────────────────────────────────┐     │   │
│  │  │        adminController.js                     │     │   │
│  │  │                                                │     │   │
│  │  │  - getAllUsers()                              │     │   │
│  │  │  - getUserById()                              │     │   │
│  │  │  - activateUser()                             │     │   │
│  │  │  - deactivateUser()                           │     │   │
│  │  │  - getAllPayments()                           │     │   │
│  │  │  - getPaymentById()                           │     │   │
│  │  │  - getAllSubscriptions()                      │     │   │
│  │  │  - getSubscriptionById()                      │     │   │
│  │  │  - updateSubscriptionStatus()                 │     │   │
│  │  │  - getDashboardStats()                        │     │   │
│  │  └──────────────────────────────────────────────┘     │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ↓                                      │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                  Models (Mongoose)                      │   │
│  │                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐        │   │
│  │  │   User   │  │ Payment  │  │Subscription  │        │   │
│  │  │  Model   │  │  Model   │  │    Model     │        │   │
│  │  └──────────┘  └──────────┘  └──────────────┘        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ MongoDB Protocol
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                      DATABASE (MongoDB)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    users     │  │   payments   │  │subscriptions │         │
│  │  collection  │  │  collection  │  │  collection  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐                                               │
│  │     otps     │                                               │
│  │  collection  │                                               │
│  └──────────────┘                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      ADMIN CREATION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │           createAdmin.js Script                         │   │
│  │                                                          │   │
│  │  1. Connect to MongoDB                                  │   │
│  │  2. Check if admin exists                               │   │
│  │  3. Hash password with bcrypt                           │   │
│  │  4. Create admin user                                   │   │
│  │  5. Save to database                                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication Flow

```
┌─────────────┐
│   User      │
│ (Any Role)  │
└──────┬──────┘
       │
       │ 1. Enter credentials
       ▼
┌─────────────────┐
│  Login Page     │
│  (Shared)       │
└──────┬──────────┘
       │
       │ 2. POST /api/auth/login
       ▼
┌─────────────────────────┐
│  authController.login() │
│                         │
│  - Find user by email   │
│  - Verify password      │
│  - Check isActive       │
│  - Generate JWT token   │
└──────┬──────────────────┘
       │
       │ 3. Return token + user object
       ▼
┌─────────────────┐
│  Frontend       │
│  - Store token  │
│  - Check role   │
└──────┬──────────┘
       │
       │ 4. Role-based redirect
       ▼
┌──────────────────────────────────┐
│  if (role === 'admin')           │
│    → /admin/dashboard            │
│  else if (role === 'student')    │
│    → /student/dashboard          │
│  else if (role === 'vendor')     │
│    → /vendor/{type}/dashboard    │
└──────────────────────────────────┘
```

## 🛡️ Admin Route Protection

```
┌─────────────┐
│   Admin     │
│   Request   │
└──────┬──────┘
       │
       │ 1. Request with JWT token
       ▼
┌──────────────────────┐
│  verifyToken         │
│  Middleware          │
│                      │
│  - Extract token     │
│  - Verify signature  │
│  - Check expiration  │
│  - Decode payload    │
└──────┬───────────────┘
       │
       │ 2. Token valid?
       ▼
┌──────────────────────┐
│  isAdmin             │
│  Middleware          │
│                      │
│  - Check role        │
│  - role === 'admin'? │
└──────┬───────────────┘
       │
       │ 3. Is admin?
       ▼
┌──────────────────────┐
│  Admin Controller    │
│                      │
│  - Execute operation │
│  - Return response   │
└──────────────────────┘

If NOT admin:
┌──────────────────────┐
│  403 Forbidden       │
│  Access Denied       │
└──────────────────────┘
```

## 📊 Data Flow - User Management

```
┌─────────────────┐
│  Admin clicks   │
│ "Manage Users"  │
└────────┬────────┘
         │
         │ 1. Navigate to /admin/users
         ▼
┌─────────────────────────┐
│  UsersManagement.js     │
│                         │
│  - Apply filters        │
│  - Set pagination       │
└────────┬────────────────┘
         │
         │ 2. GET /api/admin/users?filters
         ▼
┌─────────────────────────┐
│  Backend Middleware     │
│  - verifyToken          │
│  - isAdmin              │
└────────┬────────────────┘
         │
         │ 3. Authorized
         ▼
┌─────────────────────────┐
│  adminController        │
│  .getAllUsers()         │
│                         │
│  - Build filter query   │
│  - Apply pagination     │
│  - Query database       │
└────────┬────────────────┘
         │
         │ 4. Query MongoDB
         ▼
┌─────────────────────────┐
│  MongoDB                │
│  users collection       │
│                         │
│  - Find matching users  │
│  - Return results       │
└────────┬────────────────┘
         │
         │ 5. Return data
         ▼
┌─────────────────────────┐
│  Frontend               │
│  - Display in table     │
│  - Show pagination      │
│  - Enable actions       │
└─────────────────────────┘
```

## 🔄 Subscription Status Update Flow

```
┌─────────────────┐
│  Admin selects  │
│  new status     │
└────────┬────────┘
         │
         │ 1. PATCH /api/admin/subscriptions/:id/status
         ▼
┌─────────────────────────┐
│  Backend Middleware     │
│  - verifyToken          │
│  - isAdmin              │
└────────┬────────────────┘
         │
         │ 2. Authorized
         ▼
┌─────────────────────────────────┐
│  adminController                │
│  .updateSubscriptionStatus()    │
│                                 │
│  1. Find subscription           │
│  2. Update status               │
│  3. Find user                   │
│  4. Update user status          │
│  5. If expired → deactivate     │
└────────┬────────────────────────┘
         │
         │ 3. Update database
         ▼
┌─────────────────────────┐
│  MongoDB                │
│  - Update subscription  │
│  - Update user          │
└────────┬────────────────┘
         │
         │ 4. Return updated data
         ▼
┌─────────────────────────┐
│  Frontend               │
│  - Refresh table        │
│  - Show success message │
└─────────────────────────┘
```

## 🗄️ Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                         users                                │
├─────────────────────────────────────────────────────────────┤
│  _id (ObjectId)                                             │
│  fullName (String)                                          │
│  businessName (String)                                      │
│  email (String) [UNIQUE]                                    │
│  password (String) [HASHED]                                 │
│  role (String) [student_sliit, student_external,           │
│                 vendor, admin]                              │
│  vendorType (String) [food, boarding, laundry, cleaning]   │
│  isVerified (Boolean)                                       │
│  isActive (Boolean)                                         │
│  subscriptionStatus (String) [none, pending, active,        │
│                               expired]                      │
│  createdAt (Date)                                           │
│  updatedAt (Date)                                           │
└────────────┬────────────────────────────────────────────────┘
             │
             │ Referenced by
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌─────────────┐  ┌─────────────────┐
│ payments    │  │ subscriptions   │
├─────────────┤  ├─────────────────┤
│ _id         │  │ _id             │
│ userId ─────┼──│ userId          │
│ subscriptionId ─┼─ (ref)         │
│ amount      │  │ subscriptionType│
│ paymentStatus│ │ amount          │
│ paymentMethod│ │ paymentStatus   │
│ transactionId│ │ paymentMethod   │
│ paymentDate │  │ transactionId   │
│ description │  │ activationStatus│
│ createdAt   │  │ paidDate        │
│ updatedAt   │  │ expiryDate      │
└─────────────┘  │ createdAt       │
                 │ updatedAt       │
                 └─────────────────┘
```

## 🎯 Component Hierarchy

```
App.js
│
├── AuthProvider (Context)
│
├── Public Routes
│   ├── NomalHome
│   ├── Login (Shared)
│   ├── RegisterSelection
│   ├── SLIITStudentRegister
│   ├── OTPVerification
│   ├── ExternalStudentRegister
│   ├── VendorRegister
│   └── PaymentProcess
│
├── Student Routes (Protected)
│   └── StudentDashboard
│
├── Vendor Routes (Protected)
│   ├── FoodVendorDashboard
│   ├── BoardingVendorDashboard
│   ├── LaundryVendorDashboard
│   └── CleaningVendorDashboard
│
└── Admin Routes (Protected) ← NEW IN PART 3
    ├── AdminDashboard
    │   ├── Stats Display
    │   ├── Navigation Buttons
    │   └── Logout Button
    │
    ├── UsersManagement
    │   ├── Filters
    │   ├── Users Table
    │   ├── Action Buttons
    │   └── Pagination
    │
    ├── PaymentsManagement
    │   ├── Filters
    │   ├── Payments Table
    │   └── Pagination
    │
    └── SubscriptionsManagement
        ├── Filters
        ├── Subscriptions Table
        ├── Status Dropdown
        └── Pagination
```

## 🔑 Key Design Decisions

### 1. Shared Login System
- **Why:** Simplifies user experience, single entry point
- **How:** Same endpoint, role-based redirect after authentication
- **Benefit:** Consistent authentication flow for all users

### 2. Manual Admin Creation
- **Why:** Security - prevents unauthorized admin access
- **How:** Script-based creation with database access required
- **Benefit:** Full control over admin accounts

### 3. Double-Layer Protection
- **Why:** Defense in depth security strategy
- **How:** Backend middleware + frontend route protection
- **Benefit:** Prevents both API and UI unauthorized access

### 4. JWT Token with Role
- **Why:** Stateless authentication with role information
- **How:** Role included in token payload
- **Benefit:** No database lookup needed for role verification

### 5. Pagination on All Lists
- **Why:** Performance with large datasets
- **How:** Page and limit parameters
- **Benefit:** Fast loading, better UX

### 6. Filter Functionality
- **Why:** Admin needs to find specific data quickly
- **How:** Query parameters for filtering
- **Benefit:** Efficient data management

## 📈 Scalability Considerations

### Current Implementation
- Pagination for large datasets
- Indexed database queries
- Stateless JWT authentication
- Modular component structure

### Future Enhancements
- Redis caching for statistics
- Database query optimization
- Load balancing for API
- CDN for frontend assets
- Microservices architecture

## 🔒 Security Layers

```
Layer 1: No Admin Signup
         ↓
Layer 2: Script-Based Creation
         ↓
Layer 3: Password Hashing (bcrypt)
         ↓
Layer 4: JWT Token Authentication
         ↓
Layer 5: Backend Middleware (verifyToken)
         ↓
Layer 6: Backend Middleware (isAdmin)
         ↓
Layer 7: Frontend Route Protection
         ↓
Layer 8: Role Verification in Components
```

## 🎉 Summary

Part 3 implements a complete, secure, and scalable admin management system that seamlessly integrates with the existing Unistay platform while maintaining security best practices and providing an intuitive user experience.
