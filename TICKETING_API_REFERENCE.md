# Unistay Ticketing System - API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer {token}
```

---

## 📝 Student Ticket APIs

### Create Ticket
Create a new complaint ticket.

**Endpoint**: `POST /tickets`

**Auth**: Student only

**Request Body**:
```json
{
  "title": "Food quality issue",
  "description": "The food was cold and not fresh",
  "complaintType": "poor_quality",
  "serviceCategory": "food",
  "vendorId": "507f1f77bcf86cd799439011",
  "vendorReference": "Cafe ABC",
  "serviceItemReference": "Order #12345"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "_id": "...",
    "ticketNumber": "TCK-2026-0001",
    "title": "Food quality issue",
    "status": "open",
    "priority": "medium",
    "studentId": {...},
    "vendorId": {...},
    "createdAt": "2026-03-23T10:00:00.000Z"
  }
}
```

---

### Get My Tickets
Get all tickets created by the logged-in student.

**Endpoint**: `GET /tickets/my`

**Auth**: Student only

**Query Parameters**:
- `status` (optional): Filter by status
- `priority` (optional): Filter by priority
- `serviceCategory` (optional): Filter by category

**Example**: `GET /tickets/my?status=open&priority=high`

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "ticketNumber": "TCK-2026-0001",
      "title": "Food quality issue",
      "status": "open",
      "priority": "medium",
      "serviceCategory": "food",
      "studentId": {...},
      "vendorId": {...},
      "createdAt": "2026-03-23T10:00:00.000Z"
    }
  ]
}
```

---

### Get Ticket Details
Get detailed information about a specific ticket.

**Endpoint**: `GET /tickets/:id`

**Auth**: Student (own tickets only)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "ticket": {...},
    "messages": [...],
    "actionLogs": [...]
  }
}
```

---

### Add Message
Add a message/reply to a ticket.

**Endpoint**: `POST /tickets/:id/messages`

**Auth**: Student (own tickets only)

**Request Body**:
```json
{
  "message": "I would like an update on this issue"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Message added successfully",
  "data": {
    "_id": "...",
    "ticketId": "...",
    "senderId": {...},
    "senderRole": "student_sliit",
    "message": "I would like an update on this issue",
    "createdAt": "2026-03-23T10:30:00.000Z"
  }
}
```

---

### Close Ticket
Close a ticket.

**Endpoint**: `PATCH /tickets/:id/close`

**Auth**: Student (own tickets only)

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket closed successfully",
  "data": {
    "_id": "...",
    "status": "closed",
    "closedAt": "2026-03-23T11:00:00.000Z"
  }
}
```

---

### Reopen Ticket
Reopen a closed or resolved ticket.

**Endpoint**: `PATCH /tickets/:id/reopen`

**Auth**: Student (own tickets only)

**Request Body**:
```json
{
  "reason": "Issue not fully resolved"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket reopened successfully",
  "data": {
    "_id": "...",
    "status": "reopened"
  }
}
```

---

### Escalate Ticket
Escalate a ticket to higher priority.

**Endpoint**: `PATCH /tickets/:id/escalate`

**Auth**: Student (own tickets only)

**Request Body**:
```json
{
  "reason": "No response for 3 days"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket escalated successfully",
  "data": {
    "_id": "...",
    "status": "escalated",
    "escalationLevel": 1
  }
}
```

---

## 👨‍💼 Admin Ticket APIs

### Get Ticket Statistics
Get overall ticket statistics.

**Endpoint**: `GET /admin/tickets/stats`

**Auth**: Admin only

**Response** (200):
```json
{
  "success": true,
  "data": {
    "total": 150,
    "byStatus": {
      "open": 25,
      "inProgress": 30,
      "escalated": 5,
      "resolved": 60,
      "closed": 20,
      "rejected": 10
    },
    "byPriority": {
      "urgent": 3,
      "high": 15
    },
    "warnedVendorsCount": 2,
    "byCategory": [...],
    "byType": [...]
  }
}
```

---

### Get All Tickets
Get all tickets with optional filters.

**Endpoint**: `GET /admin/tickets`

**Auth**: Admin only

**Query Parameters**:
- `status` (optional)
- `priority` (optional)
- `serviceCategory` (optional)
- `complaintType` (optional)
- `vendorId` (optional)
- `studentId` (optional)
- `search` (optional): Search by ticket number or title

**Example**: `GET /admin/tickets?status=escalated&priority=urgent`

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

---

### Get Ticket Details (Admin)
Get detailed ticket information with warnings and flags.

**Endpoint**: `GET /admin/tickets/:id`

**Auth**: Admin only

**Response** (200):
```json
{
  "success": true,
  "data": {
    "ticket": {...},
    "messages": [...],
    "actionLogs": [...],
    "vendorWarningInfo": {
      "shouldWarn": true,
      "level": "first_warning",
      "reason": "3+ valid complaints in 30 days"
    },
    "studentMisuseInfo": {
      "shouldFlag": false,
      "rejectedCount": 1
    }
  }
}
```

---

### Update Ticket Status
Change the status of a ticket.

**Endpoint**: `PATCH /admin/tickets/:id/status`

**Auth**: Admin only

**Request Body**:
```json
{
  "status": "in_progress",
  "notes": "Started investigating the issue"
}
```

**Valid Statuses**:
- `open`
- `in_progress`
- `waiting_vendor`
- `waiting_student`
- `escalated`
- `resolved`
- `closed`
- `reopened`
- `rejected`

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket status updated successfully",
  "data": {...}
}
```

---

### Update Ticket Priority
Change the priority of a ticket.

**Endpoint**: `PATCH /admin/tickets/:id/priority`

**Auth**: Admin only

**Request Body**:
```json
{
  "priority": "urgent",
  "notes": "Escalating to urgent due to safety concern"
}
```

**Valid Priorities**:
- `low`
- `medium`
- `high`
- `urgent`

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket priority updated successfully",
  "data": {...}
}
```

---

### Assign Ticket
Assign a ticket to an admin.

**Endpoint**: `PATCH /admin/tickets/:id/assign`

**Auth**: Admin only

**Request Body**:
```json
{
  "adminId": "507f1f77bcf86cd799439011",
  "notes": "Assigning to senior admin"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket assigned successfully",
  "data": {...}
}
```

---

### Resolve Ticket
Mark a ticket as resolved.

**Endpoint**: `PATCH /admin/tickets/:id/resolve`

**Auth**: Admin only

**Request Body**:
```json
{
  "notes": "Issue has been resolved with vendor cooperation"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket resolved successfully",
  "data": {
    "_id": "...",
    "status": "resolved",
    "resolvedAt": "2026-03-23T12:00:00.000Z"
  }
}
```

---

### Close Ticket (Admin)
Close a ticket.

**Endpoint**: `PATCH /admin/tickets/:id/close`

**Auth**: Admin only

**Request Body**:
```json
{
  "notes": "Closing after confirmation from student"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket closed successfully",
  "data": {...}
}
```

---

### Issue Vendor Warning
Issue a formal warning to a vendor.

**Endpoint**: `PATCH /admin/tickets/:id/warn-vendor`

**Auth**: Admin only

**Request Body**:
```json
{
  "reason": "Multiple quality complaints received"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Warning issued to vendor successfully",
  "data": {
    "ticket": {...},
    "warningInfo": {
      "shouldWarn": true,
      "level": "first_warning",
      "reason": "3+ valid complaints in 30 days"
    }
  }
}
```

---

### Reject Ticket
Reject an invalid or spam complaint.

**Endpoint**: `PATCH /admin/tickets/:id/reject`

**Auth**: Admin only

**Request Body**:
```json
{
  "reason": "Complaint is invalid - no evidence provided"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket rejected successfully",
  "data": {
    "ticket": {...},
    "studentMisuseInfo": {
      "shouldFlag": true,
      "rejectedCount": 3,
      "reason": "3+ rejected complaints in 30 days"
    }
  }
}
```

---

### Add Admin Message
Add an admin message to a ticket.

**Endpoint**: `POST /admin/tickets/:id/messages`

**Auth**: Admin only

**Request Body**:
```json
{
  "message": "We are investigating this issue with the vendor"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Message added successfully",
  "data": {...}
}
```

---

## 🏪 Vendor Ticket APIs (Backend Only - No UI in Part A)

### Get Vendor Tickets
Get all tickets related to the logged-in vendor.

**Endpoint**: `GET /vendor/tickets`

**Auth**: Vendor only

**Query Parameters**:
- `status` (optional)
- `priority` (optional)

**Response** (200):
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

---

### Get Vendor Ticket Details
Get detailed information about a specific ticket.

**Endpoint**: `GET /vendor/tickets/:id`

**Auth**: Vendor (own tickets only)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "ticket": {...},
    "messages": [...],
    "actionLogs": [...]
  }
}
```

---

### Add Vendor Reply
Add a reply to a ticket.

**Endpoint**: `POST /vendor/tickets/:id/reply`

**Auth**: Vendor (own tickets only)

**Request Body**:
```json
{
  "message": "We apologize for the inconvenience. We will resolve this immediately."
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Reply added successfully",
  "data": {...}
}
```

---

### Resolve Ticket (Vendor)
Mark a ticket as resolved from vendor side.

**Endpoint**: `PATCH /vendor/tickets/:id/resolve`

**Auth**: Vendor (own tickets only)

**Request Body**:
```json
{
  "notes": "Issue has been fixed and customer satisfied"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Ticket marked as resolved",
  "data": {...}
}
```

---

## 🔧 Utility APIs

### Get Vendors
Get list of vendors, optionally filtered by type.

**Endpoint**: `GET /user/vendors`

**Auth**: Authenticated user

**Query Parameters**:
- `vendorType` (optional): food, boarding, laundry, cleaning

**Example**: `GET /user/vendors?vendorType=food`

**Response** (200):
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "fullName": "John Doe",
      "businessName": "Cafe ABC",
      "email": "cafe@example.com",
      "vendorType": "food"
    }
  ]
}
```

---

## 📋 Data Models

### Ticket Object
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "ticketNumber": "TCK-2026-0001",
  "title": "Food quality issue",
  "description": "Detailed description...",
  "complaintType": "poor_quality",
  "serviceCategory": "food",
  "studentId": {
    "_id": "...",
    "fullName": "Jane Student",
    "email": "jane@example.com"
  },
  "vendorId": {
    "_id": "...",
    "fullName": "John Vendor",
    "businessName": "Cafe ABC",
    "email": "vendor@example.com",
    "vendorType": "food"
  },
  "vendorReference": "Cafe ABC",
  "serviceItemReference": "Order #12345",
  "status": "open",
  "priority": "medium",
  "escalationLevel": 0,
  "warningIssued": false,
  "warningDetails": {
    "issuedBy": null,
    "issuedAt": null,
    "reason": null
  },
  "assignedAdminId": null,
  "resolvedAt": null,
  "closedAt": null,
  "rejectionReason": null,
  "createdAt": "2026-03-23T10:00:00.000Z",
  "updatedAt": "2026-03-23T10:00:00.000Z"
}
```

### Message Object
```json
{
  "_id": "...",
  "ticketId": "...",
  "senderId": {
    "_id": "...",
    "fullName": "Jane Student",
    "email": "jane@example.com",
    "role": "student_sliit"
  },
  "senderRole": "student_sliit",
  "message": "I would like an update",
  "attachmentUrl": null,
  "createdAt": "2026-03-23T10:30:00.000Z"
}
```

### Action Log Object
```json
{
  "_id": "...",
  "ticketId": "...",
  "actionBy": {
    "_id": "...",
    "fullName": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  },
  "actionType": "status_changed",
  "previousValue": "open",
  "newValue": "in_progress",
  "notes": "Started investigating",
  "createdAt": "2026-03-23T11:00:00.000Z"
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Ticket not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create ticket",
  "error": "Error details..."
}
```

---

## 🔍 Enums Reference

### Complaint Types
- `service_not_delivered`
- `poor_quality`
- `late_delivery`
- `wrong_item`
- `bad_behavior`
- `payment_issue`
- `fraud_or_fake_service`
- `cleanliness_issue`
- `other`

### Service Categories
- `food`
- `boarding`
- `laundry`
- `cleaning`

### Ticket Statuses
- `open`
- `in_progress`
- `waiting_vendor`
- `waiting_student`
- `escalated`
- `resolved`
- `closed`
- `reopened`
- `rejected`

### Priority Levels
- `low`
- `medium`
- `high`
- `urgent`

### Action Types (Logs)
- `created`
- `status_changed`
- `priority_changed`
- `assigned`
- `escalated`
- `warning_issued`
- `resolved`
- `closed`
- `reopened`
- `rejected`
- `message_added`

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All IDs are MongoDB ObjectIds
3. Pagination is not implemented in Part A (can be added in Part B)
4. File uploads are not implemented in Part A (attachmentUrl is placeholder)
5. Email notifications are not implemented in Part A

---

## 🧪 Testing with cURL

### Create Ticket
```bash
curl -X POST http://localhost:5000/api/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Complaint",
    "description": "This is a test",
    "complaintType": "poor_quality",
    "serviceCategory": "food"
  }'
```

### Get My Tickets
```bash
curl -X GET http://localhost:5000/api/tickets/my \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Status (Admin)
```bash
curl -X PATCH http://localhost:5000/api/admin/tickets/TICKET_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "notes": "Working on it"
  }'
```

---

This API reference covers all endpoints implemented in Part A of the Unistay Ticketing System.
