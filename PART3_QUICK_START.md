# Part 3: Admin System - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Admin Account
```bash
cd backend
node scripts/createAdmin.js
```

**Output:**
```
✅ Admin user created successfully!
Email: admin@unistay.com
Password: Admin@123456
⚠️  Please change the password after first login
```

### Step 2: Start Backend
```bash
cd backend
npm start
```

### Step 3: Start Frontend
```bash
cd frontend
npm start
```

### Step 4: Login as Admin
1. Open http://localhost:3000/login
2. Enter:
   - Email: `admin@unistay.com`
   - Password: `Admin@123456`
3. Click Login
4. You'll be redirected to `/admin/dashboard`

---

## 📋 What You Can Do

### Admin Dashboard
- View user statistics
- View subscription statistics
- View payment statistics
- View total revenue
- Navigate to management pages

### Users Management (`/admin/users`)
- View all users
- Filter by role (student/vendor)
- Filter by status (active/inactive)
- Filter by vendor type
- Activate/deactivate users

### Payments Management (`/admin/payments`)
- View all payments
- Filter by payment status
- View transaction details
- See user information

### Subscriptions Management (`/admin/subscriptions`)
- View all subscriptions
- Filter by activation status
- Update subscription status
- View expiry dates

---

## 🔐 Admin Login Flow

```
User enters credentials at /login
         ↓
Backend verifies credentials
         ↓
Returns JWT token + user object (with role)
         ↓
Frontend checks role
         ↓
If role === 'admin' → Redirect to /admin/dashboard
If role === 'student' → Redirect to /student/dashboard
If role === 'vendor' → Redirect to /vendor/{type}/dashboard
```

---

## 🛡️ Security Features

1. **No Admin Signup Page** - Admins can only be created via script
2. **Shared Login** - Same endpoint for all users
3. **JWT Authentication** - All admin routes require valid token
4. **Role-Based Access** - Middleware checks user role
5. **Protected Routes** - Frontend blocks unauthorized access

---

## 📡 API Endpoints

### Authentication (Shared)
```
POST /api/auth/login
Body: { "email": "admin@unistay.com", "password": "Admin@123456" }
```

### Admin Endpoints (Require Admin Role)
```
GET  /api/admin/dashboard/stats
GET  /api/admin/users
GET  /api/admin/users/:id
PATCH /api/admin/users/:id/activate
PATCH /api/admin/users/:id/deactivate
GET  /api/admin/payments
GET  /api/admin/payments/:id
GET  /api/admin/subscriptions
GET  /api/admin/subscriptions/:id
PATCH /api/admin/subscriptions/:id/status
```

---

## 🧪 Testing Checklist

- [ ] Create admin account using script
- [ ] Login with admin credentials
- [ ] Verify redirect to admin dashboard
- [ ] Check dashboard statistics load
- [ ] Navigate to Users Management
- [ ] Filter users by role
- [ ] Activate/deactivate a user
- [ ] Navigate to Payments Management
- [ ] Filter payments by status
- [ ] Navigate to Subscriptions Management
- [ ] Update a subscription status
- [ ] Logout and login as student
- [ ] Try accessing /admin/dashboard (should be blocked)
- [ ] Verify student redirects to student dashboard

---

## 🐛 Troubleshooting

### Admin account already exists
```
Admin user already exists with email: admin@unistay.com
```
**Solution:** Admin is already created. Use existing credentials.

### Access denied error
```
{ "success": false, "message": "Access denied. Admins only." }
```
**Solution:** You're not logged in as admin. Check your JWT token and role.

### Token expired
```
{ "success": false, "message": "Token expired. Please login again." }
```
**Solution:** Login again to get a new token.

### Cannot access admin routes
**Solution:** 
1. Check if you're logged in
2. Verify your role is 'admin'
3. Check browser console for errors
4. Verify token is in localStorage

---

## 📝 Default Admin Credentials

```
Email: admin@unistay.com
Password: Admin@123456
```

**⚠️ Important:** Change the password after first login for security.

---

## 🎯 Key Differences from Parts 1 & 2

| Feature | Part 1 & 2 | Part 3 (Admin) |
|---------|-----------|----------------|
| Signup | Public signup pages | No signup (manual creation) |
| Login | Same endpoint | Same endpoint (shared) |
| Redirect | Role-based | Role-based (includes admin) |
| Routes | Student/Vendor routes | Admin routes added |
| Access | Role-based protection | Admin-only protection |
| Features | User features | Management features |

---

## 📚 Related Documentation

- Full Implementation: `PART3_IMPLEMENTATION.md`
- API Reference: See API Endpoints section above
- Architecture: See Security Features section above

---

## ✅ Success Indicators

You've successfully implemented Part 3 if:
1. ✅ Admin account created via script
2. ✅ Admin can login using shared login page
3. ✅ Admin redirects to /admin/dashboard
4. ✅ Dashboard shows statistics
5. ✅ Can manage users (view, filter, activate/deactivate)
6. ✅ Can view payments and subscriptions
7. ✅ Students/vendors cannot access admin routes
8. ✅ All admin routes require authentication

---

## 🎉 You're Done!

Your Unistay admin system is now fully functional. Admins can manage users, payments, and subscriptions through a secure, role-based interface.
