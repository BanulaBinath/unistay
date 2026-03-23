# Part 3: Admin API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All admin endpoints require JWT authentication via Bearer token in the Authorization header.

```
Authorization: Bearer <your_jwt_token>
```

---

## Admin Dashboard

### Get Dashboard Statistics
Get overview statistics for admin dashboard.

**Endpoint:** `GET /admin/dashboard/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "active": 120,
      "students": 100,
      "vendors": 50
    },
    "subscriptions": {
      "active": 110,
      "expired": 10
    },
    "payments": {
      "completed": 115,
      "pending": 5
    },
    "revenue": {
      "total": 18000.00
    }
  }
}
```

---

## User Management

### Get All Users
Retrieve all users with optional filters and pagination.

**Endpoint:** `GET /admin/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| role | string | No | Filter by role: student_sliit, student_external, vendor |
| isActive | boolean | No | Filter by active status: true, false |
| vendorType | string | No | Filter by vendor type: food, boarding, laundry, cleaning |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

**Example Request:**
```
GET /admin/users?role=vendor&isActive=true&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "fullName": "John Doe",
        "businessName": "John's Food Service",
        "email": "john@example.com",
        "role": "vendor",
        "vendorType": "food",
        "isVerified": true,
        "isActive": true,
        "subscriptionStatus": "active",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  }
}
```

---

### Get User By ID
Retrieve detailed information about a specific user.

**Endpoint:** `GET /admin/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "60d5ec49f1b2c72b8c8e4f1a",
      "fullName": "John Doe",
      "businessName": "John's Food Service",
      "email": "john@example.com",
      "role": "vendor",
      "vendorType": "food",
      "isVerified": true,
      "isActive": true,
      "subscriptionStatus": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "subscription": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "userId": "60d5ec49f1b2c72b8c8e4f1a",
      "subscriptionType": "annual_vendor",
      "amount": 200,
      "paymentStatus": "completed",
      "activationStatus": "active",
      "paidDate": "2024-01-15T10:35:00.000Z",
      "expiryDate": "2025-01-15T10:35:00.000Z"
    }
  }
}
```

---

### Activate User
Activate a user account.

**Endpoint:** `PATCH /admin/users/:id/activate`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User activated successfully",
  "data": {
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "isActive": true
    }
  }
}
```

---

### Deactivate User
Deactivate a user account.

**Endpoint:** `PATCH /admin/users/:id/deactivate`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "data": {
    "user": {
      "id": "60d5ec49f1b2c72b8c8e4f1a",
      "isActive": false
    }
  }
}
```

---

## Payment Management

### Get All Payments
Retrieve all payments with optional filters and pagination.

**Endpoint:** `GET /admin/payments`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| paymentStatus | string | No | Filter by status: pending, completed, failed, refunded |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

**Example Request:**
```
GET /admin/payments?paymentStatus=completed&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payments": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1c",
        "userId": {
          "_id": "60d5ec49f1b2c72b8c8e4f1a",
          "fullName": "John Doe",
          "email": "john@example.com",
          "role": "vendor"
        },
        "subscriptionId": {
          "_id": "60d5ec49f1b2c72b8c8e4f1b",
          "subscriptionType": "annual_vendor",
          "expiryDate": "2025-01-15T10:35:00.000Z"
        },
        "amount": 200,
        "paymentStatus": "completed",
        "paymentMethod": "card",
        "transactionId": "TXN123456789",
        "paymentDate": "2024-01-15T10:35:00.000Z",
        "createdAt": "2024-01-15T10:35:00.000Z"
      }
    ],
    "pagination": {
      "total": 115,
      "page": 1,
      "limit": 10,
      "pages": 12
    }
  }
}
```

---

### Get Payment By ID
Retrieve detailed information about a specific payment.

**Endpoint:** `GET /admin/payments/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "payment": {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "userId": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "fullName": "John Doe",
        "email": "john@example.com",
        "role": "vendor",
        "vendorType": "food"
      },
      "subscriptionId": {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "subscriptionType": "annual_vendor",
        "expiryDate": "2025-01-15T10:35:00.000Z",
        "activationStatus": "active"
      },
      "amount": 200,
      "paymentStatus": "completed",
      "paymentMethod": "card",
      "transactionId": "TXN123456789",
      "paymentDate": "2024-01-15T10:35:00.000Z",
      "description": "Annual vendor subscription",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  }
}
```

---

## Subscription Management

### Get All Subscriptions
Retrieve all subscriptions with optional filters and pagination.

**Endpoint:** `GET /admin/subscriptions`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| activationStatus | string | No | Filter by status: inactive, active, expired |
| page | number | No | Page number (default: 1) |
| limit | number | No | Items per page (default: 10) |

**Example Request:**
```
GET /admin/subscriptions?activationStatus=active&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1b",
        "userId": {
          "_id": "60d5ec49f1b2c72b8c8e4f1a",
          "fullName": "John Doe",
          "email": "john@example.com",
          "role": "vendor",
          "vendorType": "food"
        },
        "subscriptionType": "annual_vendor",
        "amount": 200,
        "paymentStatus": "completed",
        "paymentMethod": "card",
        "transactionId": "TXN123456789",
        "activationStatus": "active",
        "paidDate": "2024-01-15T10:35:00.000Z",
        "expiryDate": "2025-01-15T10:35:00.000Z",
        "createdAt": "2024-01-15T10:35:00.000Z",
        "updatedAt": "2024-01-15T10:35:00.000Z"
      }
    ],
    "pagination": {
      "total": 110,
      "page": 1,
      "limit": 10,
      "pages": 11
    }
  }
}
```

---

### Get Subscription By ID
Retrieve detailed information about a specific subscription.

**Endpoint:** `GET /admin/subscriptions/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "userId": {
        "_id": "60d5ec49f1b2c72b8c8e4f1a",
        "fullName": "John Doe",
        "businessName": "John's Food Service",
        "email": "john@example.com",
        "role": "vendor",
        "vendorType": "food"
      },
      "subscriptionType": "annual_vendor",
      "amount": 200,
      "paymentStatus": "completed",
      "paymentMethod": "card",
      "transactionId": "TXN123456789",
      "activationStatus": "active",
      "paidDate": "2024-01-15T10:35:00.000Z",
      "expiryDate": "2025-01-15T10:35:00.000Z",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    }
  }
}
```

---

### Update Subscription Status
Update the activation status of a subscription.

**Endpoint:** `PATCH /admin/subscriptions/:id/status`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "activationStatus": "expired"
}
```

**Valid Status Values:**
- `active` - Subscription is active
- `inactive` - Subscription is inactive
- `expired` - Subscription has expired

**Response:**
```json
{
  "success": true,
  "message": "Subscription status updated successfully",
  "data": {
    "subscription": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "userId": "60d5ec49f1b2c72b8c8e4f1a",
      "subscriptionType": "annual_vendor",
      "amount": 200,
      "paymentStatus": "completed",
      "activationStatus": "expired",
      "paidDate": "2024-01-15T10:35:00.000Z",
      "expiryDate": "2025-01-15T10:35:00.000Z",
      "updatedAt": "2024-03-22T14:20:00.000Z"
    }
  }
}
```

**Note:** Updating subscription status to 'expired' or 'inactive' will also deactivate the user account.

---

## Error Responses

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
  "message": "Access denied. Admins only."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to fetch users",
  "error": "Error details here"
}
```

---

## Rate Limiting
Currently no rate limiting is implemented. Consider adding rate limiting in production.

---

## Pagination
All list endpoints support pagination with the following parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

Pagination response format:
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "pages": 15
  }
}
```

---

## Testing with cURL

### Login as Admin
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@unistay.com","password":"Admin@123456"}'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get All Users
```bash
curl -X GET "http://localhost:5000/api/admin/users?role=vendor&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Activate User
```bash
curl -X PATCH http://localhost:5000/api/admin/users/USER_ID/activate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Subscription Status
```bash
curl -X PATCH http://localhost:5000/api/admin/subscriptions/SUBSCRIPTION_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"activationStatus":"expired"}'
```
