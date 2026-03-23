# Unistay Ticketing System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running
- Backend and frontend dependencies installed

### Start the Application

#### 1. Start Backend Server
```bash
cd backend
npm start
```
Server runs on: `http://localhost:5000`

#### 2. Start Frontend
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

---

## 👨‍🎓 Student Workflow

### Create a Complaint

1. **Login** as a student
2. Navigate to **Student Dashboard**
3. Click **"Submit New Complaint"** button
4. Fill out the complaint form:
   - **Title**: Brief summary
   - **Service Category**: Select (food/boarding/laundry/cleaning)
   - **Complaint Type**: Select type
   - **Vendor** (optional): Select from dropdown
   - **Vendor Reference** (optional): Manual text
   - **Service Reference** (optional): Order/room number
   - **Description**: Detailed explanation
5. Click **"Submit Complaint"**
6. Ticket is created with auto-generated number (TCK-2026-0001)

### View My Complaints

1. From Student Dashboard, click **"My Complaints"**
2. See all your tickets in a list
3. Use filters to narrow down:
   - Status
   - Priority
   - Service Category
4. Click on any ticket card to view details

### Manage a Ticket

1. Open ticket details
2. Available actions:
   - **Reply**: Add messages to conversation
   - **Escalate**: Increase urgency (up to level 3)
   - **Close**: Mark as closed
   - **Reopen**: Reopen closed/resolved ticket

---

## 👨‍💼 Admin Workflow

### View All Tickets

1. **Login** as admin
2. Navigate to **Admin Dashboard**
3. Click **"Manage Tickets"** button
4. View statistics dashboard:
   - Total tickets
   - Open tickets
   - Escalated tickets
   - Resolved tickets
   - Urgent tickets
   - Warned vendors count

### Filter Tickets

Use the filter section:
- **Search**: By ticket number or title
- **Status**: Filter by status
- **Priority**: Filter by priority
- **Service Category**: Filter by category
- **Complaint Type**: Filter by type

### Manage a Ticket

1. Click **"View"** on any ticket
2. Review ticket details:
   - Student information
   - Vendor information
   - Complaint details
   - Conversation history
   - Action history
   - Warning recommendations
   - Misuse alerts

3. Available admin actions:
   - **Change Status**: Update ticket status
   - **Change Priority**: Adjust priority level
   - **Resolve Ticket**: Mark as resolved
   - **Close Ticket**: Close the ticket
   - **Warn Vendor**: Issue formal warning
   - **Reject Ticket**: Reject invalid complaint
   - **Add Message**: Reply to ticket

### Issue Vendor Warning

1. Open ticket with vendor
2. Review **Vendor Warning Recommendation** section
3. Click **"Warn Vendor"** button
4. Enter warning reason
5. Confirm action
6. Warning is recorded and vendor is flagged

---

## 🏪 Vendor API Testing (No UI in Part A)

### Test Vendor APIs with Postman/cURL

#### Get Vendor Tickets
```bash
GET /api/vendor/tickets
Authorization: Bearer {vendor_token}
```

#### Get Ticket Details
```bash
GET /api/vendor/tickets/:id
Authorization: Bearer {vendor_token}
```

#### Add Reply
```bash
POST /api/vendor/tickets/:id/reply
Authorization: Bearer {vendor_token}
Content-Type: application/json

{
  "message": "We apologize for the inconvenience..."
}
```

#### Resolve Ticket
```bash
PATCH /api/vendor/tickets/:id/resolve
Authorization: Bearer {vendor_token}
Content-Type: application/json

{
  "notes": "Issue has been resolved"
}
```

---

## 📊 Ticket Status Flow

```
open → in_progress → waiting_vendor ⟷ waiting_student → resolved → closed
  ↓                                                         ↓
escalated                                              reopened
  ↓
rejected
```

### Status Meanings

- **open**: Newly created ticket
- **in_progress**: Admin is working on it
- **waiting_vendor**: Waiting for vendor response
- **waiting_student**: Waiting for student response
- **escalated**: Escalated by student or admin
- **resolved**: Issue resolved
- **closed**: Ticket closed
- **reopened**: Previously closed ticket reopened
- **rejected**: Invalid/spam complaint

---

## 🎯 Priority Levels

### Auto-Assignment Rules

- **Low**: late_delivery, other
- **Medium**: poor_quality, wrong_item, cleanliness_issue
- **High**: service_not_delivered, bad_behavior, payment_issue
- **Urgent**: fraud_or_fake_service

Admins can manually override priority.

---

## ⚠️ Warning System

### Vendor Warning Conditions

Automatic recommendations when:
- **3+ valid complaints** in 30 days → First Warning
- **5+ valid complaints** in 30 days → Under Review
- **8+ valid complaints** in 30 days → Suspension Recommended
- **2+ urgent complaints** in 30 days → Immediate Review
- **Fraud/safety complaint** → Urgent Escalation

### Student Misuse Detection

Alert when:
- **3+ rejected complaints** in 30 days → Flag for Review

---

## 🔐 Authentication

All ticket endpoints require JWT authentication:

```javascript
headers: {
  'Authorization': 'Bearer YOUR_JWT_TOKEN'
}
```

Token is automatically included when using the frontend.

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Routes not found
**Solution**: Ensure routes are imported in `backend/app.js`

**Problem**: MongoDB connection error
**Solution**: Check MongoDB is running and connection string is correct

### Frontend Issues

**Problem**: API calls failing
**Solution**: Check `REACT_APP_API_URL` in `.env` file

**Problem**: Routes not working
**Solution**: Ensure routes are added to `App.js`

### Common Errors

**401 Unauthorized**: Token expired or invalid - login again
**403 Forbidden**: Insufficient permissions - check user role
**404 Not Found**: Ticket doesn't exist or wrong ID
**500 Server Error**: Check backend console for details

---

## 📱 Testing Checklist

### Student Tests
- [ ] Create complaint
- [ ] View my tickets
- [ ] Filter tickets
- [ ] View ticket details
- [ ] Add message
- [ ] Close ticket
- [ ] Reopen ticket
- [ ] Escalate ticket

### Admin Tests
- [ ] View all tickets
- [ ] View statistics
- [ ] Filter tickets
- [ ] Search tickets
- [ ] View ticket details
- [ ] Change status
- [ ] Change priority
- [ ] Resolve ticket
- [ ] Close ticket
- [ ] Warn vendor
- [ ] Reject ticket
- [ ] Add admin message

### API Tests (Vendor)
- [ ] Get vendor tickets
- [ ] Get ticket details
- [ ] Add reply
- [ ] Resolve ticket

---

## 💡 Tips

1. **Ticket Numbers**: Auto-generated in format TCK-YYYY-NNNN
2. **Priority**: Automatically assigned but can be changed by admin
3. **Escalation**: Students can escalate up to level 3
4. **Messages**: All parties can add messages (except on closed tickets)
5. **Warnings**: Admin sees recommendations but must manually issue
6. **Filters**: Use multiple filters together for precise searches
7. **Action Log**: Every action is logged for audit trail

---

## 🎓 Best Practices

### For Students
- Provide clear, detailed descriptions
- Include relevant references (order numbers, etc.)
- Respond promptly to admin/vendor messages
- Only escalate when truly necessary
- Close tickets when satisfied

### For Admins
- Review tickets promptly
- Update status as work progresses
- Issue warnings when conditions are met
- Reject spam/invalid complaints
- Document actions with notes
- Monitor escalated tickets closely

### For Vendors (API)
- Respond to tickets quickly
- Provide helpful solutions
- Mark tickets as resolved when fixed
- Maintain professional communication

---

## 📞 Support

For issues or questions:
1. Check this guide
2. Review `PART_A_TICKETING_SYSTEM.md` for detailed documentation
3. Check backend console for error logs
4. Check browser console for frontend errors

---

## 🎉 You're Ready!

The ticketing system is now fully operational for Part A. Students can submit complaints, admins can manage them, and vendor APIs are ready for Part B integration.

Happy ticket managing! 🎫
