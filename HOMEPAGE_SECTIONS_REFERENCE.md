# Unistay Homepage - Sections Reference

## Page Structure Overview

```
┌─────────────────────────────────────────┐
│           NAVBAR (Sticky)               │
│  Unistay | Home | Services | About |    │
│          Contact | Login | Register     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         HERO SECTION                    │
│  "Your Academic Sanctuary Awaits"       │
│  [Get Started] [Explore Services]       │
│  + Student Life Card Visual             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      SERVICES SECTION                   │
│  4 Cards: Food | Boarding |             │
│           Laundry | Cleaning            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    HOW IT WORKS SECTION                 │
│  3 Steps: Register → Browse → Live      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    WHY CHOOSE UNISTAY                   │
│  4 Features: Unified Ecosystem |        │
│  Verified Providers | Subscription |    │
│  Complaint Support                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         CTA SECTION                     │
│  "Need a Custom Plan?"                  │
│  [Get Started Now]                      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           FOOTER                        │
│  Unistay | Quick Links | Get Started   │
│  © 2024 Unistay. All rights reserved.  │
└─────────────────────────────────────────┘
```

## Section Details

### 1. Hero Section
- **Purpose**: First impression, main value proposition
- **Key Elements**:
  - Large heading with "Sanctuary" highlight
  - Descriptive subtitle
  - 2 CTA buttons (Get Started → /register, Explore Services → /services)
  - Visual card with student icon
- **Background**: Gradient (light blue/purple)

### 2. Services Section
- **Purpose**: Showcase 4 core services
- **Cards**:
  1. 🍽️ Food - Meal delivery
  2. 🏠 Boarding - Accommodation
  3. 👕 Laundry - Laundry services
  4. ✨ Cleaning - Cleaning services
- **Interaction**: Hover effect with lift and border highlight

### 3. How It Works Section
- **Purpose**: Explain user journey
- **Steps**:
  1. Register - Create account
  2. Browse & Select - Choose services
  3. Live Better - Enjoy services
- **Visual**: Numbered badges, icons, cards

### 4. Why Choose Unistay Section
- **Purpose**: Highlight competitive advantages
- **Features**:
  1. Unified Ecosystem (light purple card)
  2. Verified & Secure Providers (blue gradient card)
  3. Subscription Clarity (light gray card)
  4. Complaint Support (light gray card)
- **Layout**: 2x2 grid

### 5. CTA Section
- **Purpose**: Final conversion push
- **Elements**:
  - Heading: "Need a Custom Plan?"
  - Description text
  - CTA button → /register
  - Visual icon (lightbulb)
- **Background**: Light purple gradient

### 6. Footer
- **Purpose**: Navigation, branding, legal
- **Sections**:
  - Brand + description
  - Quick Links (Home, Services, About, Contact)
  - Get Started (Login, Register)
  - Copyright notice

## Color Palette

```css
Primary Blue:    #6366f1
Dark Blue:       #4f46e5
Dark Gray:       #1f2937
Medium Gray:     #6b7280
Light Gray:      #f9fafb
White:           #ffffff

Gradients:
- Hero: #f8f9ff → #f0f2ff
- CTA:  #f3e8ff → #e9d5ff
```

## Responsive Breakpoints

- **Desktop**: > 1024px (full layout)
- **Tablet**: 768px - 1024px (2-column grids)
- **Mobile**: < 768px (single column, mobile menu)

## Interactive Elements

1. **Navbar**:
   - Sticky on scroll
   - Mobile hamburger menu
   - Hover effects on links

2. **Buttons**:
   - Primary: Blue with shadow on hover
   - Secondary: Outline with fill on hover

3. **Cards**:
   - Lift animation on hover
   - Shadow increase on hover
   - Border highlight (services)

4. **Links**:
   - Color change on hover
   - Smooth transitions

## Typography

- **Headings**: Bold, large (3.5rem → 2rem on mobile)
- **Body**: Regular, readable (1rem - 1.2rem)
- **Buttons**: Semi-bold (600)
- **Line Height**: 1.6 for readability

## Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive link text
- Color contrast compliance
- Keyboard navigation support
- Responsive touch targets (mobile)

## Files Modified/Created

### Modified:
- `frontend/src/Components/Home/nomalhome.js` - Upgraded homepage
- `frontend/src/Components/Home/Home.css` - New styling
- `frontend/src/App.js` - Added new routes

### Created:
- `frontend/src/Components/common/Navbar.js` - Reusable navbar
- `frontend/src/Components/common/Navbar.css` - Navbar styles
- `frontend/src/Components/common/Footer.js` - Reusable footer
- `frontend/src/Components/common/Footer.css` - Footer styles
- `frontend/src/pages/Services.js` - Services page
- `frontend/src/pages/About.js` - About page
- `frontend/src/pages/Contact.js` - Contact page
- `frontend/src/pages/Pages.css` - Shared page styles

## Quick Customization Tips

### Change Primary Color:
Search and replace `#6366f1` with your color in all CSS files.

### Update Content:
Edit text directly in the component files (nomalhome.js, Services.js, etc.).

### Add Images:
Replace emoji icons with:
```javascript
<img src="/path/to/image.png" alt="Description" />
```

### Modify Layout:
Adjust grid columns in CSS:
```css
grid-template-columns: repeat(3, 1fr); /* Change number */
```

---

Your homepage is now a professional, modern landing page! 🎉
