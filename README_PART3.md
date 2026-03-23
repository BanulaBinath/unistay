# Unistay - Part 3: Admin Management System

## 🎯 Overview

Part 3 implements a comprehensive admin management system for the Unistay platform. Admins can manage users, payments, and subscriptions through a secure, role-based interface using the same login system as regular users.

## ✨ Key Features

### 🔐 Security First
- **No Admin Signup** - Admin accounts created manually via script only
- **Shared Login** - Same login endpoint for all user types
- **Role-Based Access** - Protected routes on backend and frontend
- **JWT Authentication** - Secure token-based authentication

### 👥 User Management
- View all users with pagination
- Filter by role, status, and vendor type
- Activate/deactivate user accounts
- View detailed user information

### 💳 Payment Management
- View all payment transactions
- Filter by payment status
- View transaction details
- Track payment history

### 📋 Subscription Management
- View all subscriptions
- Filter by activation status
- Update subscription status
- Monitor expiry dates
- Automatic user deactivation on expiry

### 📊 Admin Dashboard
- Real-time statistics
- User metrics (total, active, students, vendors)
- Subscription metrics (active, expired)
- Payment metrics (completed, pending)
- Total revenue tracking

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB
- Parts 1 & 2 already implemented

### Installation

1. **Create Admin Account**
```bash
cd backend
node scripts/createAdmin.js
```

Output:
```
✅ Admin user created successfully!
Email: admin@unistay.com
Password: Admin@123456
```

2. **Start Backend**
```bash
cd backend
npm install
npm start
```

3. **Start Frontend**
```bash
cd frontend
npm install
npm start
```

4. **Login as Admin**
- Open: http://localhost:3000/login
- Email: `admin@unistay.com`
- Password: `Admin@123456`
- You'll be redirected to `/admin/dashboard`

## 📁 Project Structure

```
backend/
├── Model/
│   ├── User.js              # Updated with admin role
│   ├── Payment.js           # New payment model
│   ├── Subscription.js      # Existing
│   └── OTP.js              # Existing
├── Controllers/
│   ├── authController.js    # Updated for admin login
│   └── adminController.js   # New admin operations
├── middleware/
│   └── authMiddleware.js    # Updated with isAdmin
├── Route/
│   ├── authRoutes.js        # Existing
│   ├── userRoutes.js        # Existing
│   └── adminRoutes.js       # New admin routes
├── scripts/
│   └── createAdmin.js       # Admin creation script
└── app.js                   # Updated with admin routes

frontend/
├── src/
│   ├── Components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminDashboard.css
│   │   │   ├── UsersManagement.js
│   │   │   ├── UsersManagement.css
│   │   │   ├── PaymentsManagement.js
│   │   │   ├── PaymentsManagement.css
│   │   │   ├── SubscriptionsManagement.js
│   │   │   └── SubscriptionsManagement.css
│   │   └── Home/
│   │       └── login.js     # Updated with admin redirect
│   ├── services/
│   │   ├── api.js          # Existing
│   │   └── adminApi.js     # New admin API calls
│   └── App.js              # Updated with admin routes
```

## 🔌 API Endpoints

### Authentication (Shared)
```
POST /api/auth/login
```

### Admin Dashboard
```
GET /api/admin/dashboard/stats
```

### User Management
```
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id/activate
PATCH  /api/admin/users/:id/deactivate
```

### Payment Management
```
GET /api/admin/payments
GET /api/admin/payments/:id
```

### Subscription Management
```
GET    /api/admin/subscriptions
GET    /api/admin/subscriptions/:id
PATCH  /api/admin/subscriptions/:id/status
```

All admin endpoints require:
```
Authorization: Bearer <jwt_token>
```

## 🎨 Frontend Routes

### Public Routes
- `/login` - Shared login page

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/payments` - Payment management
- `/admin/subscriptions` - Subscription management

## 🔒 Security Features

1. **Manual Admin Creation**
   - No public admin signup
   - Script-based creation only
   - Full control over admin access

2. **JWT Authentication**
   - Token-based authentication
   - 7-day token expiration
   - Role included in token payload

3. **Role-Based Middleware**
   - Backend: `isAdmin` middleware
   - Frontend: `ProtectedRoute` component
   - Double-layer protection

4. **Password Security**
   - bcrypt hashing (12 rounds)
   - Passwords never exposed in responses
   - Secure password requirements

## 📖 Usage Examples

### Create Admin Account
```bash
node backend/scripts/createAdmin.js
```

### Login as Admin (API)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@unistay.com","password":"Admin@123456"}'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?role=vendor&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Activate User
```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/activate \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Subscription Status
```bash
curl -X PATCH http://localhost:5000/api/admin/subscriptions/SUB_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"activationStatus":"expired"}'
```

## 🧪 Testing

### Manual Testing Checklist

1. **Admin Creation**
   - [ ] Run createAdmin.js script
   - [ ] Verify admin created in database
   - [ ] Check password is hashed

2. **Login Flow**
   - [ ] Login with admin credentials
   - [ ] Verify JWT token received
   - [ ] Check redirect to /admin/dashboard
   - [ ] Verify token stored in localStorage

3. **Dashboard**
   - [ ] Statistics load correctly
   - [ ] Navigation buttons work
   - [ ] Logout functionality works

4. **User Management**
   - [ ] Users list displays
   - [ ] Filters work (role, status, vendor type)
   - [ ] Activate user works
   - [ ] Deactivate user works
   - [ ] Pagination works

5. **Payment Management**
   - [ ] Payments list displays
   - [ ] Filter by status works
   - [ ] Payment details visible
   - [ ] Pagination works

6. **Subscription Management**
   - [ ] Subscriptions list displays
   - [ ] Filter by status works
   - [ ] Update status works
   - [ ] User deactivates when subscription expires
   - [ ] Pagination works

7. **Security**
   - [ ] Non-admin cannot access admin routes
   - [ ] Expired token redirects to login
   - [ ] Invalid token returns 401
   - [ ] Students blocked from admin pages
   - [ ] Vendors blocked from admin pages

## 🐛 Troubleshooting

### Admin Already Exists
```
Admin user already exists with email: admin@unistay.com
```
**Solution:** Admin is already created. Use existing credentials or delete from database first.

### Access Denied
```
{ "success": false, "message": "Access denied. Admins only." }
```
**Solution:** You're not logged in as admin. Check your JWT token and role.

### Token Expired
```
{ "success": false, "message": "Token expired. Please login again." }
```
**Solution:** Login again to get a new token.

### Cannot Access Admin Routes
**Solution:**
1. Verify you're logged in
2. Check role is 'admin' in token
3. Check browser console for errors
4. Verify token in localStorage

### MongoDB Connection Error
**Solution:**
1. Check MongoDB is running
2. Verify connection string in .env
3. Check network connectivity

## 📚 Documentation

- **PART3_IMPLEMENTATION.md** - Complete technical guide
- **PART3_QUICK_START.md** - 5-minute setup guide
- **PART3_API_REFERENCE.md** - Full API documentation
- **PART3_SUMMARY.md** - High-level overview

## 🔄 Integration with Parts 1 & 2

Part 3 seamlessly integrates with existing functionality:
- Uses existing User model (extended)
- Uses existing Subscription model
- Uses existing authentication system
- Shares login endpoint
- No conflicts with existing routes

## 🎓 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- bcryptjs
- jsonwebtoken

### Frontend
- React
- React Router
- Axios
- CSS3

## 📊 Database Schema

### User Model (Updated)
```javascript
{
  fullName: String,
  businessName: String,
  email: String (unique),
  password: String (hashed),
  role: ['student_sliit', 'student_external', 'vendor', 'admin'],
  vendorType: ['food', 'boarding', 'laundry', 'cleaning'],
  isVerified: Boolean,
  isActive: Boolean,
  subscriptionStatus: ['none', 'pending', 'active', 'expired']
}
```

### Payment Model (New)
```javascript
{
  userId: ObjectId (ref: User),
  subscriptionId: ObjectId (ref: Subscription),
  amount: Number,
  paymentStatus: ['pending', 'completed', 'failed', 'refunded'],
  paymentMethod: ['card', 'bank_transfer', 'paypal'],
  transactionId: String (unique),
  paymentDate: Date,
  description: String
}
```

## 🚀 Deployment Considerations

1. **Environment Variables**
   - Set secure JWT_SECRET
   - Configure MongoDB URI
   - Set FRONTEND_URL for CORS

2. **Security**
   - Change default admin password
   - Enable HTTPS
   - Implement rate limiting
   - Add request logging

3. **Performance**
   - Add database indexes
   - Implement caching
   - Optimize queries
   - Add pagination limits

## 🤝 Contributing

This is a student project. For improvements:
1. Follow existing code structure
2. Maintain clean code standards
3. Add comments for complex logic
4. Test thoroughly before committing

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

Built as Part 3 of the Unistay MERN stack project.

## 🎉 Acknowledgments

- Built with MERN stack
- Follows RESTful API design
- Implements JWT authentication
- Uses bcrypt for security

---

**Part 3 Status: ✅ COMPLETE**

The admin management system is fully functional and ready to use!
