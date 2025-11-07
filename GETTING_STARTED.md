# Getting Started with Luna Design System

Your complete guide to building with the Luna Design System.

---

## 📦 What You Get

Luna provides a complete design system with:

1. **Design Tokens** - Centralized design variables
2. **React Components** - Ready-to-use UI components
3. **CSS Variables** - Global styling system
4. **Documentation** - Comprehensive guides
5. **Examples** - Live interactive demos

---

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Start Building

```jsx
import { Button, Card, Input } from './components/ui';

function LoginForm() {
  return (
    <Card>
      <h2>Sign In</h2>
      <Input type="email" placeholder="Email" fullWidth />
      <Input type="password" placeholder="Password" fullWidth />
      <Button variant="primary" fullWidth>Sign In</Button>
    </Card>
  );
}
```

**That's it!** You're ready to prototype.

---

## 📂 Project Structure

```
luna/
├── src/
│   ├── tokens/              # Design tokens
│   │   ├── colors.js       # Color palette
│   │   ├── spacing.js      # Spacing scale
│   │   ├── typography.js   # Font styles
│   │   ├── radius.js       # Border radius
│   │   ├── shadows.js      # Shadow styles
│   │   └── index.js        # All tokens
│   │
│   ├── components/ui/      # React components
│   │   ├── Button.jsx      # Button component
│   │   ├── Card.jsx        # Card component
│   │   ├── Input.jsx       # Input component
│   │   ├── Badge.jsx       # Badge component
│   │   ├── Alert.jsx       # Alert component
│   │   ├── Checkbox.jsx    # Checkbox component
│   │   ├── Progress.jsx    # Progress component
│   │   ├── Spinner.jsx     # Spinner component
│   │   └── index.js        # All components
│   │
│   ├── pages/              # Demo pages
│   │   ├── HomePage.jsx         # Landing page
│   │   ├── ComponentShowcase.jsx # Component demos
│   │   └── ColorResearch.jsx    # Color testing
│   │
│   └── index.css          # Global CSS variables
│
├── COMPONENT_LIBRARY.md   # Component docs
├── DESIGN_SYSTEM.md       # Design guide
├── COLOR_USAGE_GUIDE.md   # Color guidelines
└── README.md              # Overview
```

---

## 🎨 Two Ways to Use Luna

### Option 1: Component Library (Recommended for Prototyping)

**Best for:** Fast prototyping, consistent UI

```jsx
// Import ready-made components
import { Button, Card, Input, Badge } from './components/ui';

// Use them directly
<Card>
  <Badge>New</Badge>
  <Input placeholder="Search..." />
  <Button variant="primary">Search</Button>
</Card>
```

**Pros:**
- ⚡ Extremely fast
- ✅ Pre-built components
- 🎨 Consistent styling
- ♿ Accessible by default

**See:** [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)

---

### Option 2: Design Tokens (For Custom Components)

**Best for:** Building custom components, design flexibility

```jsx
// Import design tokens
import { colors, spacing, radius } from './tokens';

// Use in your custom component
const CustomCard = styled.div`
  background: ${colors.background.default};
  padding: ${spacing.lg};
  border-radius: ${radius.lg};
  border: 1px solid ${colors.border.light};
`;
```

**Pros:**
- 🎨 Full design control
- 🔧 Maximum flexibility
- 📏 Consistent values
- 🔄 Easy to update

**See:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

## 💡 Common Use Cases

### Building a Login Page

```jsx
import { Card, Input, Button, Checkbox, Alert } from './components/ui';
import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <Card>
        <h1>Welcome Back</h1>
        <Alert icon="💡">
          Use your email and password to sign in
        </Alert>
        
        <Input 
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        
        <Input 
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        
        <Checkbox label="Remember me" />
        
        <Button variant="primary" fullWidth>
          Sign In
        </Button>
        
        <Button variant="ghost" fullWidth>
          Forgot password?
        </Button>
      </Card>
    </div>
  );
}
```

### Building a Dashboard

```jsx
import { Card, Badge, Progress } from './components/ui';

function Dashboard() {
  return (
    <div style={{ display: 'grid', gap: '1rem', padding: '2rem' }}>
      <Card hoverable>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>Total Sales</h3>
          <Badge variant="solid">+12%</Badge>
        </div>
        <h2>$12,450</h2>
        <Progress value={75} />
      </Card>
      
      <Card hoverable>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h3>New Users</h3>
          <Badge variant="outline">+8%</Badge>
        </div>
        <h2>1,234</h2>
        <Progress value={60} />
      </Card>
    </div>
  );
}
```

### Building a Form with Validation

```jsx
import { Card, Input, Button, Alert } from './components/ui';
import { useState } from 'react';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }
    setSuccess(true);
    setError('');
  };
  
  return (
    <Card>
      <h2>Sign Up</h2>
      
      {error && (
        <Alert icon="⚠️" title="Error">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert icon="✓" title="Success">
          Check your email to continue!
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Input 
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          fullWidth
        />
        <Button variant="primary" fullWidth>
          Sign Up
        </Button>
      </form>
    </Card>
  );
}
```

---

## 🎯 Next Steps

1. **Explore the Component Showcase** → Visit `/showcase`
   - See all components in action
   - Copy code examples
   - Test interactive demos

2. **Read the Component Library Guide** → [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)
   - Learn all component props
   - See usage patterns
   - Understand best practices

3. **Check the Design System** → [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
   - Understand design principles
   - Learn color usage
   - Review spacing and typography

4. **Start Building!**
   - Create a new page in `src/pages/`
   - Import components from `./components/ui`
   - Use design tokens from `./tokens`

---

## 🎨 Design Principles

Luna follows these core principles:

1. **Electric Blue for Primary Actions Only**
   - Use sparingly (1-2 buttons per screen)
   - Guides user attention
   - Creates clear hierarchy

2. **Gray for Everything Else**
   - Secondary buttons
   - Badges, cards, alerts
   - Icons and decorative elements
   - Clean, professional appearance

3. **Fully Rounded Interactive Elements**
   - All buttons, inputs, badges
   - Modern, friendly aesthetic
   - Pill-shaped design (9999px radius)

4. **Roboto Font Throughout**
   - Clean and readable
   - Modern appearance
   - Excellent legibility

5. **Accessibility First**
   - WCAG AA compliant colors
   - Proper contrast ratios
   - Keyboard navigation
   - Screen reader support

---

## 💻 Development Tips

### Hot Reload
Changes to components automatically reload in the browser.

### Adding New Components
```bash
# 1. Create component files
src/components/ui/MyComponent.jsx
src/components/ui/MyComponent.css

# 2. Export from index
src/components/ui/index.js

# 3. Import and use
import { MyComponent } from './components/ui';
```

### Using Tokens in Custom Styles
```jsx
import { colors, spacing } from './tokens';

const customStyle = {
  color: colors.primary,
  padding: spacing.md,
  // ... more styles
};
```

### CSS Variables Available Globally
```css
.my-custom-class {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-md);
}
```

---

## 📚 Documentation Index

**Quick Reference:**
- 🚀 [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) - Component props and examples
- 🎨 [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Design principles and tokens
- 🔵 [COLOR_USAGE_GUIDE.md](COLOR_USAGE_GUIDE.md) - When to use blue vs gray
- ♿ [ACCESSIBILITY_REPORT.md](ACCESSIBILITY_REPORT.md) - WCAG compliance details

---

## 🆘 Need Help?

1. **Component not working?** → Check [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)
2. **Color question?** → See [COLOR_USAGE_GUIDE.md](COLOR_USAGE_GUIDE.md)
3. **Design token?** → Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
4. **See examples?** → Visit `/showcase` in the app

---

**You're ready to build! Start with the Component Showcase (`/showcase`) to see everything in action.** 🚀

