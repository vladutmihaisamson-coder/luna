# Color Usage Guide

## Design Philosophy

**Electric Blue (#0F4FB8) is reserved exclusively for primary actions.**  
All other UI elements use subtle shades of gray to maintain visual hierarchy and prevent color overload.

---

## 🔵 When to Use Electric Blue

### ✅ Primary Actions Only

Electric Blue should be used **sparingly** and only for the most important actions:

#### 1. **Primary Buttons**
```jsx
<button className="demo-button primary" style={{ backgroundColor: '#0F4FB8' }}>
  Save Changes
</button>
```
- Main call-to-action
- Submit buttons
- Confirmation actions

#### 2. **Links**
```jsx
<a href="#" style={{ color: '#0F4FB8' }}>Click here</a>
```
- Hyperlinks in text
- Navigation links

#### 3. **Progress Indicators**
```jsx
<div className="progress-bar" style={{ backgroundColor: '#0F4FB8' }} />
```
- Progress bars (active state)
- Loading spinners (accent color)

#### 4. **Focus States**
```css
input:focus {
  border-color: #0F4FB8;
  box-shadow: 0 0 0 2px rgba(15, 79, 184, 0.1);
}
```
- Input field focus
- Interactive element focus
- Checkbox/radio accent color

---

## ⚪ When to Use Gray

### ✅ Everything Else

Gray tones are used for all non-primary UI elements to create a clean, professional interface:

### 1. **Secondary Buttons (Outline)**
```jsx
<button className="demo-button outline">
  Cancel
</button>
```
**Color:** Gray border (`#BDBDBD`), Gray text (`#616161`)
- Cancel actions
- Secondary options
- Back buttons

### 2. **Tertiary Buttons (Ghost)**
```jsx
<button className="demo-button ghost">
  Learn More
</button>
```
**Color:** Light gray border (`#E0E0E0`), Gray text (`#757575`)
- Least important actions
- Optional features
- Subtle navigation

### 3. **Badges & Tags**
```jsx
<span className="demo-badge solid">New</span>
<span className="demo-badge outline">Tag</span>
<span className="demo-badge subtle">Info</span>
```
**Colors:** 
- Solid: Gray background (`#757575`)
- Outline: Gray border (`#BDBDBD`)
- Subtle: Light gray background (`#F5F5F5`)

### 4. **Cards**
```jsx
<div className="demo-card accent-border">
  <h4>Card Title</h4>
  <p>Card content</p>
</div>
```
**Color:** Light gray border (`#E0E0E0`), Optional gray top accent
- Content containers
- Information boxes
- List items

### 5. **Alerts & Notifications**
```jsx
<div className="demo-alert">
  <div className="alert-icon">ℹ</div>
  <div>
    <strong>Information</strong>
    <p>Message content</p>
  </div>
</div>
```
**Color:** Gray background (`#FAFAFA`), Gray border (`#EEEEEE`)
- Informational messages
- Neutral notifications
- Help text

### 6. **Icons (Non-Primary)**
```jsx
<div className="demo-icon-circle">✓</div>
<div className="demo-icon-circle outline">→</div>
<div className="demo-icon-circle subtle">★</div>
```
**Colors:**
- Default: Gray background (`#757575`)
- Outline: Gray border (`#BDBDBD`)
- Subtle: Light gray background (`#F5F5F5`)

### 7. **Text Highlights**
```jsx
<mark>highlighted text</mark>
```
**Color:** Light gray background (`#EEEEEE`), Gray border (`#E0E0E0`)
- Text emphasis
- Search results
- Important information

### 8. **Form Elements (Default State)**
```jsx
<input type="text" placeholder="Enter text" />
```
**Color:** Gray border (`#DDDDDD`)
- Input fields
- Textareas
- Select dropdowns

---

## 🎨 Gray Palette

### Available Gray Shades

```css
--color-gray-50: #FAFAFA;   /* Lightest - backgrounds */
--color-gray-100: #F5F5F5;  /* Very light - subtle backgrounds */
--color-gray-200: #EEEEEE;  /* Light - borders, dividers */
--color-gray-300: #E0E0E0;  /* Light medium - borders */
--color-gray-400: #BDBDBD;  /* Medium - borders, disabled text */
--color-gray-500: #9E9E9E;  /* Medium dark - icons */
--color-gray-600: #757575;  /* Dark - body text, icons */
--color-gray-700: #616161;  /* Darker - headings, emphasis */
--color-gray-800: #424242;  /* Very dark - strong emphasis */
--color-gray-900: #212121;  /* Darkest - primary text */
```

---

## ✨ Visual Hierarchy Rules

### 1. **Primary > Secondary > Tertiary**
- **Primary (Blue):** Most important action
- **Secondary (Gray):** Alternative actions
- **Tertiary (Light Gray):** Optional actions

### 2. **Color = Importance**
- More color (blue) = more important
- Less color (gray) = less important
- No color (white/transparent) = least important

### 3. **One Primary Action Per Screen**
- Limit Electric Blue buttons to 1-2 per view
- Multiple blue buttons confuse users
- Use gray for all other actions

### 4. **Consistency**
- Primary actions always blue
- Secondary actions always gray
- Never mix colors arbitrarily

---

## 📋 Quick Reference

| Element | Color | Usage |
|---------|-------|-------|
| **Primary Button** | Electric Blue | Main actions |
| **Secondary Button** | Gray | Alternative actions |
| **Tertiary Button** | Light Gray | Optional actions |
| **Links** | Electric Blue | Navigation |
| **Badges** | Gray | Labels, tags |
| **Cards** | Gray borders | Content containers |
| **Alerts** | Gray background | Notifications |
| **Icons** | Gray | Non-primary icons |
| **Highlights** | Light Gray | Text emphasis |
| **Form Focus** | Electric Blue | Active state |
| **Progress** | Electric Blue | Completion indicator |

---

## ❌ Common Mistakes to Avoid

### 1. **Using Blue for Secondary Buttons**
```jsx
// ❌ WRONG
<button style={{ backgroundColor: '#0F4FB8' }}>Cancel</button>

// ✅ CORRECT
<button className="demo-button outline">Cancel</button>
```

### 2. **Multiple Blue Buttons**
```jsx
// ❌ WRONG
<button style={{ backgroundColor: '#0F4FB8' }}>Save</button>
<button style={{ backgroundColor: '#0F4FB8' }}>Delete</button>

// ✅ CORRECT
<button style={{ backgroundColor: '#0F4FB8' }}>Save</button>
<button className="demo-button outline">Cancel</button>
```

### 3. **Blue Badges for All Information**
```jsx
// ❌ WRONG
<span style={{ backgroundColor: '#0F4FB8' }}>Status</span>

// ✅ CORRECT
<span className="demo-badge solid">Status</span>
```

### 4. **Colorful Alerts**
```jsx
// ❌ WRONG
<div style={{ borderLeftColor: '#0F4FB8', background: '#E3F2FD' }}>
  Alert message
</div>

// ✅ CORRECT
<div className="demo-alert">
  Alert message
</div>
```

---

## 💡 Examples

### Login Form
```jsx
<form>
  <input type="email" placeholder="Email" />
  <input type="password" placeholder="Password" />
  
  {/* Primary action - Blue */}
  <button className="demo-button primary" style={{ backgroundColor: '#0F4FB8' }}>
    Sign In
  </button>
  
  {/* Secondary action - Gray */}
  <button className="demo-button ghost">
    Forgot Password?
  </button>
</form>
```

### Product Card
```jsx
<div className="demo-card">
  <img src="product.jpg" />
  <h3>Product Name</h3>
  <p>$99.99</p>
  
  {/* Primary action - Blue */}
  <button className="demo-button primary" style={{ backgroundColor: '#0F4FB8' }}>
    Add to Cart
  </button>
  
  {/* Secondary action - Gray */}
  <button className="demo-button outline">
    View Details
  </button>
</div>
```

### Settings Page
```jsx
<div>
  <h2>Account Settings</h2>
  
  {/* Form fields - Gray borders */}
  <input type="text" placeholder="Name" />
  <input type="email" placeholder="Email" />
  
  <div className="button-group">
    {/* Primary action - Blue */}
    <button className="demo-button primary" style={{ backgroundColor: '#0F4FB8' }}>
      Save Changes
    </button>
    
    {/* Secondary actions - Gray */}
    <button className="demo-button outline">
      Cancel
    </button>
  </div>
</div>
```

---

## 🎯 Summary

**Key Principle:** Electric Blue is precious. Use it only for primary actions to guide users toward the most important interactions. Everything else stays neutral with subtle gray tones.

This approach:
- ✅ Creates clear visual hierarchy
- ✅ Guides user attention
- ✅ Looks clean and professional
- ✅ Reduces cognitive load
- ✅ Improves usability

---

*Luna Design System - Color Usage Guide*

