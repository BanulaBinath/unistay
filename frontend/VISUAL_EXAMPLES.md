# Visual Examples - UX Improvements

This document shows visual examples of the UX improvements with code snippets.

---

## 1. Alert Component Examples

### Success Alert
```jsx
<Alert 
  type="success" 
  message="Your profile has been updated successfully!" 
/>
```
**Visual:** Green background (#d1fae5), green border, checkmark icon, smooth slide-in animation

### Error Alert
```jsx
<Alert 
  type="error" 
  message="Failed to save changes. Please try again." 
  onClose={() => setError('')}
/>
```
**Visual:** Red background (#fee2e2), red border, error icon, close button, smooth slide-in animation

### Warning Alert
```jsx
<Alert 
  type="warning" 
  message="Your session will expire in 5 minutes." 
/>
```
**Visual:** Yellow background (#fef3c7), yellow border, warning icon, smooth slide-in animation

### Info Alert
```jsx
<Alert 
  type="info" 
  message="New features are available. Check them out!" 
/>
```
**Visual:** Blue background (#dbeafe), blue border, info icon, smooth slide-in animation

---

## 2. Toast Notification Examples

### Success Toast (Top-Right)
```jsx
showToast({ 
  type: 'success', 
  message: 'Order placed successfully!',
  duration: 3000
});
```
**Visual:** 
- Appears from top-right corner
- Green background with icon
- Progress bar at bottom
- Auto-dismisses after 3 seconds
- Can be manually closed
- Stacks if multiple toasts

### Error Toast (Top-Right)
```jsx
showToast({ 
  type: 'error', 
  message: 'Payment failed. Please check your card details.',
  duration: 5000
});
```
**Visual:**
- Red background with error icon
- Longer duration (5s) for errors
- Progress bar shows remaining time
- Smooth slide-in animation

### Multiple Toasts
```jsx
showToast({ type: 'info', message: 'Processing...' });
showToast({ type: 'success', message: 'Step 1 complete' });
showToast({ type: 'success', message: 'Step 2 complete' });
```
**Visual:**
- Toasts stack vertically
- Each has own progress bar
- Dismiss independently
- Smooth animations

---

## 3. Loading Button Examples

### Primary Loading Button
```jsx
<LoadingButton 
  type="submit" 
  loading={isSubmitting}
  variant="primary"
>
  Submit Form
</LoadingButton>
```
**Visual:**
- Normal state: Gradient blue/purple, shadow
- Hover: Lifts up 3px, enhanced shadow
- Loading: Spinner replaces text, disabled
- Active: Pressed down effect

### Secondary Loading Button
```jsx
<LoadingButton 
  loading={isLoading}
  variant="secondary"
  size="small"
>
  Load More
</LoadingButton>
```
**Visual:**
- Light blue background
- Smaller size
- Spinner animation when loading

### Danger Loading Button
```jsx
<LoadingButton 
  loading={isDeleting}
  variant="danger"
>
  Delete Account
</LoadingButton>
```
**Visual:**
- Red gradient background
- Warning appearance
- Spinner when deleting

---

## 4. Empty State Examples

### No Orders Empty State
```jsx
<EmptyState
  icon={
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
    </svg>
  }
  title="No orders yet"
  description="You haven't placed any orders yet. Start browsing our menu!"
  actionLabel="Browse Menu"
  onAction={() => navigate('/menu')}
/>
```
**Visual:**
- Centered layout
- Icon in rounded square (gradient blue)
- Title in bold
- Description in gray
- Primary action button
- Staggered fade-in animation

### No Complaints Empty State
```jsx
<EmptyState
  icon={<MessageIcon />}
  title="No complaints"
  description="You haven't submitted any complaints. If you have an issue, let us know."
  actionLabel="Submit Complaint"
  onAction={() => setViewMode('create')}
/>
```
**Visual:**
- Same consistent styling
- Different icon and text
- Smooth animations

---

## 5. Form Examples

### Input with Validation
```jsx
<div className="form-group">
  <label className="form-label form-label-required">Email</label>
  <input 
    className={`form-input ${errors.email ? 'error' : ''}`}
    type="email"
    value={email}
    onChange={handleChange}
  />
  {errors.email && (
    <span className="form-error-text">
      <svg>{/* Error icon */}</svg>
      {errors.email}
    </span>
  )}
</div>
```
**Visual:**
- Normal: Gray border
- Focus: Blue border + shadow
- Error: Red border + red background tint
- Error text: Red with icon
- Smooth transitions

### Input with Success State
```jsx
<input 
  className="form-input success"
  type="email"
  value={email}
/>
<span className="form-success-text">
  <svg>{/* Checkmark icon */}</svg>
  Email is valid
</span>
```
**Visual:**
- Green border
- Light green background tint
- Success text with checkmark
- Smooth transition

---

## 6. Transition Examples

### Card with Hover Effect
```jsx
<div className="card-transition">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```
**Visual:**
- Normal: Flat appearance
- Hover: Lifts 3px, shadow appears
- Smooth 0.25s transition

### Button with Hover Effect
```jsx
<button className="btn btn-primary">
  Click Me
</button>
```
**Visual:**
- Normal: Gradient background, shadow
- Hover: Lifts 3px, enhanced shadow
- Active: Pressed down
- All transitions smooth

### List with Stagger Animation
```jsx
<div className="stagger-children">
  <div className="item">Item 1</div>
  <div className="item">Item 2</div>
  <div className="item">Item 3</div>
  <div className="item">Item 4</div>
</div>
```
**Visual:**
- Items appear one by one
- 0.05s delay between each
- Fade-in + slide-up animation
- Professional appearance

---

## 7. Complete Form Example

```jsx
function MyForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toasts, showToast, removeToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submitData();
      showToast({ 
        type: 'success', 
        message: 'Form submitted successfully!' 
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      <form onSubmit={handleSubmit} className="fade-in">
        {error && (
          <Alert 
            type="error" 
            message={error} 
            onClose={() => setError('')} 
          />
        )}
        
        <div className="form-group">
          <label className="form-label form-label-required">
            Name
          </label>
          <input 
            className="form-input"
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label form-label-required">
            Email
          </label>
          <input 
            className="form-input"
            type="email"
            required
          />
          <span className="form-hint">
            We'll never share your email
          </span>
        </div>

        <LoadingButton 
          type="submit" 
          loading={loading}
          className="btn-block"
        >
          Submit Form
        </LoadingButton>
      </form>
    </>
  );
}
```

**Visual Flow:**
1. Form fades in smoothly
2. User fills inputs (smooth focus transitions)
3. User clicks submit
4. Button shows spinner, disables
5. On success: Toast appears top-right, auto-dismisses
6. On error: Alert appears above form with close button
7. All transitions smooth and professional

---

## 8. Complete List Example

```jsx
function MyList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="loading-state fade-in">
        <div className="spinner" />
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert 
        type="error" 
        message={error} 
        onClose={() => setError('')} 
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No items found"
        description="Start by adding your first item"
        actionLabel="Add Item"
        onAction={() => navigate('/add')}
      />
    );
  }

  return (
    <div className="stagger-children">
      {items.map(item => (
        <div key={item.id} className="card-transition">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}
```

**Visual Flow:**
1. Loading state fades in with spinner
2. On success: Items appear with stagger animation
3. On error: Alert appears with error message
4. On empty: Empty state appears with action button
5. Cards have hover effect (lift + shadow)
6. All transitions smooth

---

## 9. Dashboard Card Example

```jsx
<div className="dashboard-card card-transition">
  <div className="card-header">
    <h3>Recent Orders</h3>
    <button className="btn btn-ghost btn-small">
      View All
    </button>
  </div>
  
  <div className="card-body stagger-children">
    {orders.map(order => (
      <div key={order.id} className="order-item smooth-hover">
        <span>{order.name}</span>
        <span className="badge badge-success">
          {order.status}
        </span>
      </div>
    ))}
  </div>
</div>
```

**Visual:**
- Card lifts on hover
- Items inside have stagger animation
- Order items have subtle hover effect
- Status badges have consistent colors
- All transitions smooth

---

## 10. Modal Example

```jsx
<div className="modal-backdrop fade-in">
  <div className="modal-content scale-in">
    <div className="modal-header">
      <h2>Confirm Action</h2>
      <button className="btn btn-icon-only btn-ghost">
        <CloseIcon />
      </button>
    </div>
    
    <div className="modal-body">
      <p>Are you sure you want to delete this item?</p>
    </div>
    
    <div className="modal-footer">
      <button className="btn btn-secondary">
        Cancel
      </button>
      <LoadingButton 
        variant="danger"
        loading={isDeleting}
      >
        Delete
      </LoadingButton>
    </div>
  </div>
</div>
```

**Visual:**
- Backdrop fades in
- Modal scales in from center
- Smooth animations
- Consistent button styling
- Loading state on confirm

---

## Color Reference

### Success (Green)
- Background: `#d1fae5`
- Border: `#a7f3d0`
- Text: `#065f46`
- Icon: `#10b981`

### Error (Red)
- Background: `#fee2e2`
- Border: `#fecaca`
- Text: `#991b1b`
- Icon: `#ef4444`

### Warning (Yellow)
- Background: `#fef3c7`
- Border: `#fde68a`
- Text: `#92400e`
- Icon: `#f59e0b`

### Info (Blue)
- Background: `#dbeafe`
- Border: `#bfdbfe`
- Text: `#1e40af`
- Icon: `#3b82f6`

### Primary (Indigo/Purple)
- Gradient: `#5b6cf2` → `#7c3aed`

---

## Animation Timings

- **Fast (0.2s)**: Hover effects, focus states
- **Medium (0.25-0.3s)**: Card transitions, button presses
- **Slow (0.4s)**: Content appearance, page transitions
- **Stagger (0.05s)**: Delay between list items

---

## Easing Functions

- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` - Most transitions
- **Ease-in-out**: `ease-in-out` - Smooth start and end
- **Linear**: `linear` - Spinners, progress bars

---

**End of Visual Examples**
