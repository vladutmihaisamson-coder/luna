# Luna Design System

## Overview

Luna is an Airbnb-inspired design system focused on **simplicity, accessibility, and refined aesthetics**. Our design philosophy prioritizes clarity, subtle interactions, and WCAG AA accessibility compliance.

---

## Design Principles

### 1. **Simplicity First**
- Clean, uncluttered interfaces
- Generous white space
- Clear visual hierarchy

### 2. **Accessible by Default**
- All colors meet WCAG AA standards (4.5:1 contrast ratio)
- Semantic HTML structure
- Keyboard navigation support

### 3. **Refined & Modern**
- Subtle shadows and borders
- Smooth transitions
- Careful attention to typography

### 4. **User-Centric**
- Clear feedback on interactions
- Predictable behavior
- Mobile-first responsive design

---

## Color Palette

### Primary Color (WCAG AA Compliant)

#### Electric Blue - Primary Actions Only
```css
--color-primary: #0F4FB8;
```
- **Use for:** Primary buttons, links, progress indicators, focus states ONLY
- **Contrast ratio:** 5.57:1
- **Character:** Fresh, tech-forward, trustworthy
- **Original color:** #2978FF (adjusted for accessibility)

**Important:** Electric Blue should be used sparingly and exclusively for primary actions. All other UI elements use gray tones to maintain visual hierarchy.

### Gray Palette - For Everything Else

All non-primary UI elements use subtle gray tones:

```css
/* Text Colors */
--color-text-primary: #222222;      /* Main text */
--color-text-secondary: #717171;    /* Supporting text */
--color-text-light: #B0B0B0;        /* Placeholder, disabled */

/* Borders */
--color-border: #DDDDDD;            /* Standard borders */
--color-border-light: #EBEBEB;      /* Subtle dividers */

/* Backgrounds */
--color-background: #FFFFFF;         /* Main background */
--color-background-secondary: #F7F7F7; /* Alternate sections */

/* Gray Scale */
--color-gray-50: #FAFAFA;   /* Lightest */
--color-gray-100: #F5F5F5;  /* Very light */
--color-gray-200: #EEEEEE;  /* Light */
--color-gray-300: #E0E0E0;  /* Light medium */
--color-gray-400: #BDBDBD;  /* Medium */
--color-gray-500: #9E9E9E;  /* Medium dark */
--color-gray-600: #757575;  /* Dark */
--color-gray-700: #616161;  /* Darker */
--color-gray-800: #424242;  /* Very dark */
--color-gray-900: #212121;  /* Darkest */
```

**Usage:** Secondary buttons, badges, cards, alerts, icons, and all decorative elements use these gray shades.

---

## Typography

### Font Stack
```css
font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Roboto** is a clean, modern, highly readable font designed by Google. It provides excellent legibility at all sizes and is loaded from Google Fonts.

### Scale

| Element | Size | Weight | Usage |
|---------|------|--------|-------|
| **H1** | 2.5rem (40px) | 700 | Page titles |
| **H2** | 2rem (32px) | 600 | Section headers |
| **H3** | 1.5rem (24px) | 600 | Subsections |
| **Body** | 0.9375rem (15px) | 400 | Main content |
| **Small** | 0.8125rem (13px) | 400 | Secondary text |

### Guidelines
- Use negative letter-spacing (-0.02em) for large headings
- Maintain 1.6 line-height for body text
- Keep hierarchy clear with size and weight

---

## Spacing System

Consistent spacing creates rhythm and improves scanability.

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
```

**Usage:**
- Use multiples of 4px for consistency
- Prefer larger spacing for better clarity
- Mobile: reduce spacing by 25-50%

---

## Border Radius

All interactive elements use **fully rounded corners** (pill shape) for a modern, friendly aesthetic.

```css
/* Buttons, inputs, badges */
border-radius: 9999px;  /* Fully rounded (pill shape) */

/* Cards and containers */
--radius-lg: 12px;  /* Cards, containers */
--radius-xl: 16px;  /* Large cards, modals */
```

**Guidelines:**
- Buttons, inputs, and badges use full rounding (9999px)
- Cards and containers use subtle rounding (12-16px)
- Checkboxes keep a small radius (4px) for better UX

---

## Shadows

Subtle shadows create depth without overwhelming.

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.08);
--shadow-md: 0 2px 4px rgba(0, 0, 0, 0.08), 
             0 4px 12px rgba(0, 0, 0, 0.05);
--shadow-lg: 0 6px 16px rgba(0, 0, 0, 0.12);
--shadow-hover: 0 6px 20px rgba(0, 0, 0, 0.15);
```

**Guidelines:**
- Use sparingly for emphasis
- Increase shadow on hover for interaction feedback
- Avoid dark, heavy shadows

---

## Components

### Buttons

#### Primary Button
```jsx
<button className="demo-button primary" style={{ backgroundColor: primaryColor }}>
  Primary Action
</button>
```
- **Use for:** Main call-to-action
- **Style:** Uses brand color, white text, no border
- **Hover:** Subtle scale (1.02x) + shadow

#### Outline Button (Secondary)
```jsx
<button className="demo-button outline">
  Secondary Action
</button>
```
- **Use for:** Secondary actions, cancel
- **Style:** White background, dark border, dark text
- **Does NOT use primary color** - stays neutral
- **Hover:** Light gray background

#### Ghost Button (Tertiary)
```jsx
<button className="demo-button ghost">
  Tertiary Action
</button>
```
- **Use for:** Subtle actions, navigation
- **Style:** Transparent, light border, dark text
- **Hover:** Light background, darker border

### Cards

```jsx
<div className="demo-card">
  <h4>Card Title</h4>
  <p>Card description</p>
</div>
```

**Guidelines:**
- 1px light border (#EBEBEB)
- Subtle shadow (shadow-sm)
- 12px border radius
- Lift on hover (-2px translateY)
- Increase shadow on hover

### Form Elements

#### Input Fields
```jsx
<input 
  type="text" 
  className="demo-input" 
  placeholder="Enter text"
/>
```

**States:**
- **Default:** Light border (#DDDDDD)
- **Hover:** Dark border (#222222)
- **Focus:** Dark border + subtle outer shadow

#### Checkboxes & Radio Buttons
- Use native elements with `accent-color` for brand color
- 20px size for easy clicking
- Proper spacing for labels

### Badges

Small labels for status, categories, or counts.

```jsx
<span className="demo-badge solid" style={{ backgroundColor: color }}>
  Badge
</span>
```

**Variants:**
- **Solid:** Brand color background, white text
- **Outline:** White background, colored border and text
- **Subtle:** Light tinted background, colored text

### Alerts

Informative messages for important information.

```jsx
<div className="demo-alert" style={{ borderLeftColor: color }}>
  <div className="alert-icon">ℹ</div>
  <div>
    <strong>Alert Title</strong>
    <p>Alert description</p>
  </div>
</div>
```

**Guidelines:**
- Left accent border (3px)
- Light tinted background
- Icon for visual reinforcement
- Clear hierarchy: title + description

---

## Accessibility Guidelines

### Color Contrast
✅ All primary colors meet WCAG AA (4.5:1 minimum)
- Test all color combinations
- Use the built-in accessibility checker
- Never use color alone to convey information

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover states
- Visible focus indicators
- Keyboard navigation support

### Semantic HTML
- Use proper heading hierarchy
- Label all form inputs
- Provide alt text for images
- Use ARIA labels when needed

---

## Motion & Animation

### Transitions

```css
--transition-fast: 0.15s ease;
--transition-base: 0.2s ease;
```

**Guidelines:**
- Keep animations under 300ms
- Use `ease` or `ease-out` for natural feel
- Animate: transform, opacity, color, shadow
- Avoid animating: width, height, position

### Micro-interactions

- **Hover:** Scale (1.02x), shadow increase, color shift
- **Click:** Brief scale down (0.98x)
- **Focus:** Border color change + shadow
- **Loading:** Smooth spinner rotation

---

## Best Practices

### Do's ✅

- Use consistent spacing (multiples of 4px)
- Maintain clear visual hierarchy
- Test accessibility with real users
- Keep interactions predictable
- Use subtle shadows and borders
- Provide clear feedback on actions
- Make touch targets 44x44px minimum
- Use the neutral secondary buttons

### Don'ts ❌

- Don't use bright primary colors for secondary buttons
- Don't use color alone to convey information
- Don't create complex shadow compositions
- Don't animate layout properties
- Don't use small font sizes (< 13px)
- Don't remove focus indicators
- Don't use low contrast colors
- Don't overcomplicate designs

---

## Responsive Design

### Breakpoints

```css
/* Mobile-first approach */
@media (max-width: 768px)  /* Tablet */
@media (max-width: 480px)  /* Mobile */
```

### Mobile Adjustments
- Reduce font sizes by 15-20%
- Reduce spacing by 25-50%
- Stack layouts vertically
- Increase touch target sizes
- Simplify complex components

---

## Usage Examples

### Page Layout
```jsx
<div className="page-container">
  <header className="page-header">
    <h1>Page Title</h1>
    <p>Page description</p>
  </header>
  
  <main className="page-content">
    {/* Content */}
  </main>
</div>
```

### Button Group
```jsx
<div className="button-group">
  <button className="demo-button primary">
    Save Changes
  </button>
  <button className="demo-button outline">
    Cancel
  </button>
</div>
```

### Form
```jsx
<form>
  <div className="form-group">
    <label>Email</label>
    <input type="email" className="demo-input" />
  </div>
  
  <div className="button-group">
    <button type="submit" className="demo-button primary">
      Submit
    </button>
  </div>
</form>
```

---

## Resources

### Tools
- **Color Research Lab** (`/colors`) - Test colors on components
- **Accessibility Checker** - Built-in WCAG validation
- **Component Library** - Live component examples

### References
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Airbnb Design System](https://airbnb.design/)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)

---

## Contributing

When adding new components:
1. Follow existing patterns
2. Test accessibility (contrast, keyboard nav)
3. Add hover/focus states
4. Document usage
5. Test on mobile devices

---

*Luna Design System - Built with accessibility and simplicity in mind*
*Last updated: November 2025*

