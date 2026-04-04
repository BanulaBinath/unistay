# My Food Orders Page - Documentation

## Overview
A clean, standalone page for students to view all their food orders with a simple, minimalist design matching the screenshot provided.

## Page Details

### Route
- **Path**: `/student/orders`
- **Access**: Protected route for students only (student_sliit, student_external)
- **Component**: `MyFoodOrders.js`

### Features

1. **Header Section**
   - Badge: "FOOD ORDERS" with blue dot indicator
   - Title: "My Food Orders"
   - Subtitle: "Track your food orders and delivery status."
   - Action Button: "Place New Order" (navigates to /services)

2. **Orders List**
   - Clean card-based layout
   - Each order card displays:
     - Food icon (gradient blue background)
     - Item name
     - Quantity (Qty: X)
     - Order date (formatted as "Mar 26, 2026")
     - Total price (Rs. XXXX)
     - Status badge (color-coded: Pending, Accepted, Completed, Cancelled, Rejected)
     - Chevron arrow for navigation

3. **States**
   - **Loading**: Spinner with "Loading your orders…" message
   - **Empty**: Icon, title, description, and "Browse Food Menu" button
   - **Error**: Red error banner with message
   - **Orders**: List of order cards

4. **Interactions**
   - Click any order card → Navigate to order details page
   - Click "Place New Order" → Navigate to services page
   - Click "Browse Food Menu" (empty state) → Navigate to services page

## Design System

### Colors
- Primary: #5b6cf2 (brand blue)
- Background: #fafbfc (light gray)
- Card background: #fdfdff (white)
- Border: #e8ebf7 (light blue-gray)
- Text primary: #1a202c (dark)
- Text secondary: #64748b (gray)

### Status Colors
- **Pending**: Yellow (#fef3c7 background, #92400e text)
- **Accepted**: Blue (#dbeafe background, #1e40af text)
- **Completed**: Green (#d1fae5 background, #065f46 text)
- **Cancelled**: Red (#fee2e2 background, #991b1b text)
- **Rejected**: Light Red (#ffe4e6 background, #9f1239 text)

### Typography
- Font Family: Poppins
- Title: 1.8rem, weight 700
- Subtitle: 0.88rem, weight 400
- Order name: 0.95rem, weight 600
- Meta items: 0.74rem, weight 500
- Status badge: 0.74rem, weight 600

### Spacing & Layout
- Container padding: 32px
- Max width: 1000px (centered)
- Card border radius: 12px
- Button border radius: 10px
- Gap between cards: 14px

## API Integration

### Endpoint
```
GET /api/orders/student
```

### Headers
```javascript
{
  Authorization: 'Bearer <token>'
}
```

### Response Format
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "order_id",
      "itemName": "pastas",
      "quantity": 1,
      "totalPrice": 3440,
      "status": "Pending",
      "createdAt": "2026-03-26T10:30:00Z",
      ...
    }
  ]
}
```

## File Structure

```
frontend/src/pages/student/
├── MyFoodOrders.js       # Main component
└── MyFoodOrders.css      # Styles
```

## Component Structure

```javascript
MyFoodOrders
├── Header
│   ├── Badge (FOOD ORDERS)
│   ├── Title
│   ├── Subtitle
│   └── Place New Order Button
└── Body
    ├── Error Banner (conditional)
    ├── Loading State (conditional)
    ├── Empty State (conditional)
    └── Orders List
        └── Order Cards
            ├── Icon
            ├── Details (name + meta)
            ├── Status Badge
            └── Chevron
```

## Responsive Design

### Desktop (> 768px)
- Full layout with side-by-side header
- Max width: 1000px
- Padding: 32px

### Tablet (≤ 768px)
- Stacked header layout
- Full-width button
- Padding: 24px 20px

### Mobile (≤ 480px)
- Compact layout
- Smaller fonts
- Status badge moves to full width below order details
- Padding: 16px

## State Management

```javascript
const [orders, setOrders] = useState([]);        // Order data
const [loading, setLoading] = useState(true);    // Loading state
const [error, setError] = useState('');          // Error message
```

## Key Functions

### fetchOrders()
- Fetches student orders from API
- Handles loading, success, and error states
- Called on component mount

### formatDate(dateStr)
- Formats ISO date string to readable format
- Example: "2026-03-26" → "Mar 26, 2026"

## Navigation

- **From**: Student Dashboard → Food Status module
- **To Order Details**: Click any order card → `/student/orders/:orderId`
- **To Services**: Click "Place New Order" or "Browse Food Menu" → `/services`

## Error Handling

1. **API Failure**: Shows error banner with message
2. **Network Error**: Displays user-friendly error message
3. **Empty Response**: Shows empty state with call-to-action
4. **Console Logging**: Errors logged for debugging

## Accessibility

- Semantic HTML structure
- Keyboard navigation support (Tab, Enter)
- ARIA roles (role="button")
- Focus states on interactive elements
- Alt text for icons (via SVG)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS Grid and Flexbox support required
- ES6+ JavaScript features

## Performance Considerations

- Single API call on mount
- Efficient re-renders with React hooks
- CSS transitions for smooth interactions
- Optimized image loading (if images added later)

## Future Enhancements

- Filter by status
- Search functionality
- Date range filter
- Export orders
- Refresh button
- Real-time updates
- Order images instead of icons
- Pagination for large order lists

## Testing Checklist

- [x] Page loads correctly
- [x] Orders fetch from API
- [x] Loading state displays
- [x] Empty state displays when no orders
- [x] Error state displays on API failure
- [x] Order cards display correctly
- [x] Status badges show correct colors
- [x] Click navigation works
- [x] "Place New Order" button works
- [x] Responsive on mobile
- [x] Responsive on tablet
- [x] No console errors
- [x] No diagnostic errors

## Notes

- This page replaces the complex OrderHistoryPage for the main `/student/orders` route
- The original OrderHistoryPage is still available at `/student/orders/history` if needed
- Design matches the minimalist style shown in the provided screenshot
- All styles follow the UniStay design system (Poppins font, #5b6cf2 primary color)
