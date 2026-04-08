# Developer Guide - UX Components & Utilities

Quick reference for using the new UX components and utilities in the Unistay frontend.

---

## 1. Alert Component

**When to use:** Display inline feedback messages (errors, success, warnings, info)

```jsx
import Alert from '../common/Alert';

// Basic usage
<Alert type="success" message="Profile updated successfully!" />

// With close button
<Alert 
  type="error" 
  message="Failed to save changes" 
  onClose={() => setError('')} 
/>

// Types: 'success', 'error', 'warning', 'info'
```

---

## 2. Toast Notifications

**When to use:** Non-blocking notifications that auto-dismiss

```jsx
import { ToastContainer } from '../common/Toast';
import useToast from '../../hooks/useToast';

function MyComponent() {
  const { toasts, showToast, removeToast } = useToast();

  const handleSuccess = () => {
    showToast({ 
      type: 'success', 
      message: 'Order placed successfully!',
      duration: 3000 // milliseconds
    });
  };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} position="top-right" />
      <button onClick={handleSuccess}>Place Order</button>
    </>
  );
}

// Positions: 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center'
```

---

## 3. Loading Button

**When to use:** Any button that triggers an async operation

```jsx
import LoadingButton from '../common/LoadingButton';

<LoadingButton 
  type="submit" 
  loading={isSubmitting}
  disabled={isSubmitting}
  variant="primary"
  size="medium"
>
  Submit Form
</LoadingButton>

// Variants: 'primary', 'secondary', 'outline', 'danger', 'success'
// Sizes: 'small', 'medium', 'large'
```

---

## 4. Empty State

**When to use:** Display when a list or collection has no items

```jsx
import EmptyState from '../common/EmptyState';

<EmptyState
  icon={
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      {/* Your icon SVG */}
    </svg>
  }
  title="No orders yet"
  description="You haven't placed any orders yet. Start browsing our menu!"
  actionLabel="Browse Menu"
  onAction={() => navigate('/menu')}
/>
```

---

## 5. Transition Classes

**When to use:** Add smooth animations to any element

```jsx
// Fade animations
<div className="fade-in">Content appears smoothly</div>

// Slide animations
<div className="slide-in-up">Slides up from bottom</div>
<div className="slide-in-down">Slides down from top</div>
<div className="slide-in-left">Slides in from left</div>
<div className="slide-in-right">Slides in from right</div>

// Scale animations
<div className="scale-in">Scales up smoothly</div>

// Hover effects
<button className="smooth-hover">Lifts on hover</button>
<div className="card-transition">Card with hover effect</div>

// Stagger children (for lists)
<div className="stagger-children">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 6. Form Classes

**When to use:** Style form inputs consistently

```jsx
// Basic input
<input className="form-input" type="text" placeholder="Enter name" />

// Input with validation state
<input className="form-input error" type="email" />
<span className="form-error-text">
  <svg>{/* Error icon */}</svg>
  Invalid email address
</span>

// Success state
<input className="form-input success" type="text" />
<span className="form-success-text">
  <svg>{/* Success icon */}</svg>
  Looks good!
</span>

// Form group
<div className="form-group">
  <label className="form-label form-label-required">Email</label>
  <input className="form-input" type="email" />
  <span className="form-hint">We'll never share your email</span>
</div>

// Submit button
<button className="form-submit-btn" type="submit">
  Submit
</button>
```

---

## 7. Button Classes

**When to use:** Style buttons consistently

```jsx
// Primary button
<button className="btn btn-primary">Primary Action</button>

// Secondary button
<button className="btn btn-secondary">Secondary Action</button>

// Outline button
<button className="btn btn-outline">Outline</button>

// Danger button
<button className="btn btn-danger">Delete</button>

// Success button
<button className="btn btn-success">Confirm</button>

// Ghost button
<button className="btn btn-ghost">Cancel</button>

// Sizes
<button className="btn btn-primary btn-small">Small</button>
<button className="btn btn-primary btn-medium">Medium</button>
<button className="btn btn-primary btn-large">Large</button>

// With icon
<button className="btn btn-primary">
  <svg>{/* Icon */}</svg>
  Button Text
</button>

// Icon only
<button className="btn btn-primary btn-icon-only">
  <svg>{/* Icon */}</svg>
</button>

// Full width
<button className="btn btn-primary btn-block">Full Width</button>
```

---

## 8. Common Patterns

### Form Submission with Loading & Toast

```jsx
import { useState } from 'react';
import Alert from '../common/Alert';
import LoadingButton from '../common/LoadingButton';
import { ToastContainer } from '../common/Toast';
import useToast from '../../hooks/useToast';

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
      <form onSubmit={handleSubmit}>
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        
        {/* Form fields */}
        
        <LoadingButton type="submit" loading={loading}>
          Submit
        </LoadingButton>
      </form>
    </>
  );
}
```

### List with Loading & Empty State

```jsx
import { useState, useEffect } from 'react';
import EmptyState from '../common/EmptyState';
import Alert from '../common/Alert';

function MyList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await api.getItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (error) {
    return <Alert type="error" message={error} />;
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
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Best Practices

### Do's ✅
- Use `Alert` for inline feedback messages
- Use `Toast` for non-blocking notifications
- Use `LoadingButton` for all async actions
- Use `EmptyState` for empty lists
- Add transition classes to new components
- Use form classes for consistent input styling
- Use button classes for consistent button styling

### Don'ts ❌
- Don't use `alert()` or `confirm()` - use Toast or Alert
- Don't create custom loading states - use LoadingButton
- Don't create custom empty states - use EmptyState
- Don't use inline styles for transitions - use utility classes
- Don't create inconsistent button styles - use button classes
- Don't skip error handling - always show user feedback

---

## 10. Accessibility

All components follow accessibility best practices:

- Proper ARIA roles and labels
- Keyboard navigation support
- Focus states clearly visible
- Color contrast meets WCAG standards
- Respects `prefers-reduced-motion`
- Screen reader friendly

---

## 11. Performance

All animations are optimized:

- Use `transform` and `opacity` (GPU-accelerated)
- Avoid layout thrashing
- Smooth 60fps animations
- Minimal repaints

---

## 12. Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 13. Troubleshooting

### Transitions not working?
- Check if `transitions.css` is imported in `App.css`
- Verify the element has the correct class name
- Check browser console for CSS errors

### Toast not appearing?
- Ensure `ToastContainer` is rendered
- Check if `useToast` hook is called correctly
- Verify toast position is valid

### Button not loading?
- Check if `loading` prop is passed correctly
- Verify `LoadingButton` is imported
- Check if button is disabled when loading

---

## 14. Migration Guide

### Replacing old alert()
```jsx
// Before
alert('Success!');

// After
showToast({ type: 'success', message: 'Success!' });
```

### Replacing old error messages
```jsx
// Before
{error && <div className="error-message">{error}</div>}

// After
{error && <Alert type="error" message={error} onClose={() => setError('')} />}
```

### Replacing old loading buttons
```jsx
// Before
<button disabled={loading}>
  {loading ? 'Loading...' : 'Submit'}
</button>

// After
<LoadingButton loading={loading}>
  Submit
</LoadingButton>
```

---

## Need Help?

Refer to:
- `UX_IMPROVEMENTS_SUMMARY.md` for complete overview
- Component source files for implementation details
- CSS files for available utility classes
