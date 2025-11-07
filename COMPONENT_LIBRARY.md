# Luna Component Library

A production-ready React component library for rapid prototyping with built-in accessibility and consistent design.

---

## 🚀 Quick Start

```jsx
// Import components
import { Button, Card, Input, Badge } from './components/ui';

// Use in your app
function MyComponent() {
  return (
    <Card>
      <Input placeholder="Email" />
      <Badge>New</Badge>
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

---

## 📦 Available Components

### Button
Three variants for different hierarchy levels.

```jsx
import { Button } from './components/ui';

// Variants
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="ghost">Tertiary Action</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>
```

**Props:**
- `variant`: `'primary'` | `'secondary'` | `'ghost'` (default: `'primary'`)
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `disabled`: `boolean` (default: `false`)
- `fullWidth`: `boolean` (default: `false`)
- `onClick`: `function`
- All standard button HTML attributes

---

### Card
Container component for organizing content.

```jsx
import { Card } from './components/ui';

// Variants
<Card variant="default">Standard card</Card>
<Card variant="accent">Card with top accent</Card>
<Card variant="subtle">Subtle background</Card>

// Hoverable
<Card hoverable>Lifts on hover</Card>
```

**Props:**
- `variant`: `'default'` | `'accent'` | `'subtle'` (default: `'default'`)
- `hoverable`: `boolean` (default: `false`)
- All standard div HTML attributes

---

### Input
Fully rounded input fields with blue focus states.

```jsx
import { Input } from './components/ui';

// Types
<Input type="text" placeholder="Text input" />
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input type="number" placeholder="Number" />

// States
<Input error />
<Input disabled />
<Input fullWidth />

// Controlled
const [value, setValue] = useState('');
<Input 
  value={value} 
  onChange={(e) => setValue(e.target.value)} 
/>
```

**Props:**
- `type`: `'text'` | `'email'` | `'password'` | `'number'` | `'tel'` | `'url'` (default: `'text'`)
- `placeholder`: `string`
- `value`: `string`
- `onChange`: `function`
- `error`: `boolean` (default: `false`)
- `disabled`: `boolean` (default: `false`)
- `fullWidth`: `boolean` (default: `false`)
- All standard input HTML attributes

---

### Badge
Small labels for status, categories, or counts.

```jsx
import { Badge } from './components/ui';

// Variants
<Badge variant="solid">Solid</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="subtle">Subtle</Badge>

// Sizes
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
```

**Props:**
- `variant`: `'solid'` | `'outline'` | `'subtle'` (default: `'solid'`)
- `size`: `'sm'` | `'md'` (default: `'md'`)
- All standard span HTML attributes

---

### Alert
Informative messages with neutral gray styling.

```jsx
import { Alert } from './components/ui';

// Basic
<Alert>Simple message</Alert>

// With title
<Alert title="Success">Your changes have been saved!</Alert>

// Custom icon
<Alert icon="⚠️">Warning message</Alert>
<Alert icon="✓">Success message</Alert>
<Alert icon="💡">Tip or info message</Alert>
```

**Props:**
- `title`: `string`
- `icon`: `string` (default: `'ℹ'`)
- `children`: `ReactNode`
- All standard div HTML attributes

---

### Checkbox
Form controls with blue accent color.

```jsx
import { Checkbox } from './components/ui';

// Controlled
const [checked, setChecked] = useState(false);
<Checkbox 
  label="Accept terms" 
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

// With label
<Checkbox label="Remember me" />

// Disabled
<Checkbox label="Disabled option" disabled />
```

**Props:**
- `label`: `string`
- `checked`: `boolean`
- `onChange`: `function`
- `disabled`: `boolean` (default: `false`)
- All standard input checkbox HTML attributes

---

### Progress
Progress indicators showing completion.

```jsx
import { Progress } from './components/ui';

// Basic
<Progress value={65} />

// Sizes
<Progress value={50} size="sm" />
<Progress value={75} size="md" />
<Progress value={100} size="lg" />

// Dynamic
const [progress, setProgress] = useState(0);
<Progress value={progress} />
```

**Props:**
- `value`: `number` (0-100, default: `0`)
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- All standard div HTML attributes

---

### Spinner
Loading indicators with blue accent.

```jsx
import { Spinner } from './components/ui';

// Sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

// In button
<Button disabled>
  <Spinner size="sm" /> Loading...
</Button>
```

**Props:**
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- All standard div HTML attributes

---

## 🎨 Using Design Tokens

Import and use design tokens directly in your code:

```jsx
import { colors, spacing, typography, radius, shadows } from './tokens';

// In JavaScript
const myStyle = {
  color: colors.primary,
  padding: spacing.md,
  borderRadius: radius.lg,
  fontFamily: typography.fontFamily.primary,
  boxShadow: shadows.md,
};

// In styled-components or emotion
const StyledDiv = styled.div`
  color: ${colors.primary};
  padding: ${spacing.md};
  border-radius: ${radius.lg};
`;
```

### Available Tokens

**Colors**
```js
import { colors } from './tokens';

colors.primary           // #0F4FB8
colors.gray[50]          // #FAFAFA
colors.gray[600]         // #757575
colors.text.primary      // #222222
colors.border.default    // #DDDDDD
colors.background.default // #FFFFFF
```

**Spacing**
```js
import { spacing } from './tokens';

spacing.xs    // 0.25rem (4px)
spacing.sm    // 0.5rem (8px)
spacing.md    // 1rem (16px)
spacing.lg    // 1.5rem (24px)
spacing.xl    // 2rem (32px)
```

**Typography**
```js
import { typography } from './tokens';

typography.fontFamily.primary  // 'Roboto', ...
typography.fontSize.base       // 0.9375rem
typography.fontWeight.semibold // 600
typography.lineHeight.normal   // 1.5
```

**Border Radius**
```js
import { radius } from './tokens';

radius.sm    // 4px
radius.md    // 8px
radius.lg    // 12px
radius.full  // 9999px (pill shape)
```

**Shadows**
```js
import { shadows } from './tokens';

shadows.sm    // Subtle shadow
shadows.md    // Medium shadow
shadows.lg    // Large shadow
shadows.hover // Hover state shadow
```

---

## 💡 Usage Examples

### Login Form

```jsx
import { Card, Input, Button, Checkbox } from './components/ui';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <Card>
      <h2>Sign In</h2>
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
      <Checkbox 
        label="Remember me"
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
      />
      <Button variant="primary" fullWidth>
        Sign In
      </Button>
      <Button variant="ghost" fullWidth>
        Forgot password?
      </Button>
    </Card>
  );
}
```

### Product Card

```jsx
import { Card, Badge, Button } from './components/ui';

function ProductCard({ product }) {
  return (
    <Card hoverable>
      <img src={product.image} alt={product.name} />
      <Badge variant="subtle">New</Badge>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <Button variant="primary" fullWidth>
        Add to Cart
      </Button>
      <Button variant="secondary" fullWidth>
        View Details
      </Button>
    </Card>
  );
}
```

### Dashboard Stats

```jsx
import { Card, Progress, Badge } from './components/ui';

function StatCard({ title, value, change, progress }) {
  return (
    <Card variant="accent">
      <div className="stat-header">
        <h4>{title}</h4>
        <Badge variant={change > 0 ? 'solid' : 'outline'}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </Badge>
      </div>
      <h2>{value}</h2>
      <Progress value={progress} />
    </Card>
  );
}
```

### Loading State

```jsx
import { Button, Spinner, Alert } from './components/ui';

function DataFetcher() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (loading) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner size="lg" />
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert icon="⚠️" title="Error">
        {error.message}
      </Alert>
    );
  }

  return (
    <Button variant="primary" onClick={fetchData}>
      Load Data
    </Button>
  );
}
```

---

## 🎯 Best Practices

### 1. **Use the Right Button Variant**
- **Primary** (Electric Blue): Main call-to-action, most important action
- **Secondary** (Gray): Alternative actions, cancel, back
- **Ghost** (Light Gray): Least important, optional actions

### 2. **Maintain Hierarchy**
- Limit primary buttons to 1-2 per screen
- Use secondary buttons for alternative actions
- Use ghost buttons for optional features

### 3. **Form Design**
- Use `fullWidth` prop for inputs in forms
- Provide clear labels and placeholders
- Show error states with the `error` prop

### 4. **Cards for Organization**
- Use cards to group related content
- Add `hoverable` for interactive cards
- Choose appropriate variant for emphasis

### 5. **Progress Indicators**
- Use Progress for determinate loading (known duration)
- Use Spinner for indeterminate loading (unknown duration)
- Match spinner size to context (sm in buttons, lg standalone)

---

## 🔧 Customization

### Adding Custom Styles

```jsx
// Via className
<Button className="my-custom-button" variant="primary">
  Custom Button
</Button>

// Via inline styles
<Card style={{ maxWidth: '400px', margin: '0 auto' }}>
  Content
</Card>
```

### Extending Components

```jsx
// Create custom variants
function DangerButton({ children, ...props }) {
  return (
    <Button 
      {...props}
      style={{ 
        backgroundColor: '#DE350B',
        ...props.style 
      }}
    >
      {children}
    </Button>
  );
}
```

---

## 📱 Responsive Design

All components are mobile-friendly and responsive:

- Buttons stack vertically on mobile
- Cards adapt to container width
- Inputs use `fullWidth` for mobile forms
- Touch-friendly sizing (44px minimum)

---

## ♿ Accessibility

Components follow accessibility best practices:

- Semantic HTML elements
- Proper ARIA labels
- Keyboard navigation support
- WCAG AA color contrast (4.5:1 minimum)
- Focus indicators on all interactive elements
- Screen reader support

---

## 🚀 Component Showcase

Visit `/showcase` to see all components in action with:
- Live examples
- Code snippets
- Interactive demos
- Complete form examples

---

## 📚 Additional Resources

- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Complete design system guide
- **[COLOR_USAGE_GUIDE.md](COLOR_USAGE_GUIDE.md)** - When to use blue vs gray
- **[ACCESSIBILITY_REPORT.md](ACCESSIBILITY_REPORT.md)** - Accessibility details

---

*Luna Component Library - Built for rapid prototyping with accessibility and consistency in mind.*

