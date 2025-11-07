# Luna Design System

A modern, accessible, Airbnb-inspired design system built with React.

## 🎨 Features

- **Airbnb-Inspired Aesthetic** - Clean, refined, and simple
- **WCAG AA Compliant** - All colors meet accessibility standards
- **Live Component Testing** - Interactive color research lab
- **Real-time Accessibility Checking** - Built-in WCAG validation
- **Responsive Design** - Mobile-first approach
- **Modern Stack** - React 19 + Vite

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Use Components in Your App
```jsx
import { Button, Card, Input, Badge } from './components/ui';

function MyComponent() {
  return (
    <Card>
      <Input placeholder="Email" fullWidth />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
luna/
├── src/
│   ├── pages/
│   │   ├── HomePage.jsx          # Landing page
│   │   ├── HomePage.css
│   │   ├── ColorResearch.jsx     # Color testing lab
│   │   └── ColorResearch.css
│   ├── utils/
│   │   └── accessibility.js      # WCAG utilities
│   ├── components/
│   │   └── AccessibilitySummary.jsx
│   ├── App.jsx                   # Router setup
│   ├── index.css                 # Global styles
│   └── main.jsx
├── DESIGN_SYSTEM.md              # Complete design guide
├── ACCESSIBILITY_REPORT.md       # Accessibility improvements
└── README.md
```

## 🎨 Color Palette

### Primary Color (WCAG AA Compliant)

| Color | Hex | Contrast | Usage |
|-------|-----|----------|-------|
| **Electric Blue** | `#0F4FB8` | 5.57:1 | Primary actions, links, highlights |

**Original:** `#2978FF` → **Accessible:** `#0F4FB8`

This color has been optimized to meet WCAG AA standards with a 5.57:1 contrast ratio.

## 🧩 Component Library

### Available Components

- **Button** - Primary, secondary, and ghost variants
- **Card** - Container with multiple variants
- **Input** - Fully rounded with focus states
- **Badge** - Labels and tags
- **Alert** - Informational messages
- **Checkbox** - Form controls
- **Progress** - Progress bars
- **Spinner** - Loading indicators

### Quick Example

```jsx
import { Button, Card, Input } from './components/ui';

<Card>
  <Input type="email" placeholder="Email" fullWidth />
  <Button variant="primary" fullWidth>Sign Up</Button>
  <Button variant="secondary" fullWidth>Cancel</Button>
</Card>
```

See the **[Component Library Guide](COMPONENT_LIBRARY.md)** for complete documentation.

## ♿ Accessibility

Luna is built with accessibility in mind:

- ✅ WCAG AA compliant colors (4.5:1 contrast minimum)
- ✅ Semantic HTML structure
- ✅ Keyboard navigation support
- ✅ Focus indicators on all interactive elements
- ✅ Proper ARIA labels
- ✅ Responsive and mobile-friendly

Learn more in the [Accessibility Report](ACCESSIBILITY_REPORT.md).

## 🎨 Interactive Pages

### Component Showcase (`/showcase`)
- **Ready-to-use React components**
- Live interactive demos
- Copy-paste code examples
- Complete form examples
- **Best for: Rapid prototyping**

### Color Research Lab (`/colors`)
- Test colors on various components
- Real-time contrast ratios
- WCAG compliance checking
- **Best for: Design exploration**

## 📖 Documentation

### For Developers

- **[COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)** - 🚀 **START HERE FOR PROTOTYPING**
  - All components with props
  - Code examples
  - Usage patterns
  - Best practices

- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Complete design system guide
  - Design principles
  - Color palette & tokens
  - Typography
  - Spacing & layout

### For Designers

- **[COLOR_USAGE_GUIDE.md](COLOR_USAGE_GUIDE.md)** - When to use Electric Blue vs Gray
  - Primary action guidelines
  - Gray palette reference
  - Visual hierarchy rules
  - Common mistakes to avoid

- **[ACCESSIBILITY_REPORT.md](ACCESSIBILITY_REPORT.md)** - Accessibility improvements
  - Color contrast analysis
  - WCAG compliance details

## 🎯 Design Principles

1. **Simplicity First** - Clean, uncluttered interfaces
2. **Accessible by Default** - WCAG AA compliance
3. **Refined & Modern** - Subtle shadows, smooth transitions
4. **User-Centric** - Clear feedback, predictable behavior

## 🛠️ Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Roboto Font** - Clean, modern Google Font
- **CSS Variables** - Theming system
- **ESLint** - Code quality

## 🎨 Design Features

- **Fully Rounded Buttons** - All buttons use pill-shaped design (9999px border radius)
- **Roboto Font** - Clean, modern, highly readable Google Font
- **Single Color System** - Electric Blue for primary actions only
- **Subtle Gray Palette** - All other elements use refined gray tones
- **Clear Visual Hierarchy** - Color indicates importance

## 📱 Responsive Design

Mobile-first approach with breakpoints:
- Desktop: Default
- Tablet: < 768px
- Mobile: < 480px

## 🤝 Contributing

When adding new components:

1. Follow existing patterns
2. Test accessibility (contrast, keyboard navigation)
3. Add hover/focus states
4. Document usage
5. Test on mobile devices

## 📄 License

MIT

---

**Built with accessibility and simplicity in mind** ✨

For detailed information, see the [Design System Guide](DESIGN_SYSTEM.md).
