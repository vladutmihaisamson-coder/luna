# Table Component Library

A modular, reusable component library for building editable tables with consistent design tokens.

## Structure

```
table/
├── tokens/
│   └── tableTokens.css          # Design tokens (CSS variables)
├── components/
│   ├── EditableTextCell.jsx     # Text input cell with auto-resize
│   ├── EditableTextCell.css
│   ├── QuantityCell.jsx         # Number input with +/- controls
│   ├── QuantityCell.css
│   ├── UnitCell.jsx              # Text input with dropdown overlay
│   ├── UnitCell.css
│   ├── DragHandle.jsx           # Drag handle for row reordering
│   ├── DragHandle.css
│   ├── RowActionButtons.jsx     # Delete/Reset button wrapper
│   └── RowActionButtons.css
└── index.js                      # Main export file
```

## Design Tokens

All design tokens are defined in `tokens/tableTokens.css` as CSS custom properties:

- **Colors**: Border colors, text colors, background colors
- **Spacing**: Padding, margins, control spacing
- **Typography**: Font sizes, font weights
- **Borders**: Border radius, border widths
- **Transitions**: Animation durations
- **Z-index**: Layering values
- **Control offsets**: Positioning for drag handles and action buttons

## Components

### EditableTextCell

Multi-line text input with auto-resize functionality.

**Props:**
- `value` (string) - Current value
- `onChange` (function) - Change handler `(value) => void`
- `placeholder` (string) - Placeholder text
- `className` (string) - Additional CSS classes
- `autoResize` (boolean) - Enable auto-resize (default: true)

**Usage:**
```jsx
<EditableTextCell
  value={item.description}
  onChange={(value) => updateItem(item.id, 'description', value)}
  placeholder="Enter description"
/>
```

### QuantityCell

Number input with increment/decrement buttons.

**Props:**
- `value` (number|string) - Current value
- `onChange` (function) - Change handler `(value) => void`
- `onIncrement` (function) - Increment handler
- `onDecrement` (function) - Decrement handler
- `min` (number) - Minimum value (default: 0)
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<QuantityCell
  value={item.quantity}
  onChange={(value) => updateItem(item.id, 'quantity', value)}
  onIncrement={() => incrementQuantity(item.id)}
  onDecrement={() => decrementQuantity(item.id)}
/>
```

### UnitCell

Text input with dropdown overlay for unit selection.

**Props:**
- `value` (string) - Current value
- `onChange` (function) - Change handler `(value) => void`
- `options` (array) - Array of unit options
- `placeholder` (string) - Placeholder text
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<UnitCell
  value={item.unit}
  onChange={(value) => updateItem(item.id, 'unit', value)}
  options={['boxes', 'pallets', 'pieces', 'kg']}
/>
```

### DragHandle

Visual drag handle for row reordering (functionality to be added).

**Props:**
- `onDragStart` (function) - Drag start handler (optional)
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<DragHandle onDragStart={handleDragStart} />
```

### RowActionButtons

Wrapper component that conditionally renders Delete or Reset button.

**Props:**
- `canDelete` (boolean) - Show delete button if true, reset if false
- `onDelete` (function) - Delete handler
- `onReset` (function) - Reset handler
- `className` (string) - Additional CSS classes

**Usage:**
```jsx
<RowActionButtons
  canDelete={items.length > 1}
  onDelete={() => deleteItem(item.id)}
  onReset={() => resetRow(item.id)}
/>
```

## Usage

Import components from the main index:

```jsx
import { 
  EditableTextCell, 
  QuantityCell, 
  UnitCell, 
  DragHandle, 
  RowActionButtons 
} from './components/table';
```

## Design Philosophy

1. **Separation of Concerns**: Each component handles a single responsibility
2. **Design Tokens**: All styling values come from tokens for consistency
3. **Composability**: Components can be combined to build complex tables
4. **Reusability**: Components are independent and can be used in any table context
5. **Accessibility**: Components include proper ARIA labels and keyboard support

## Next Steps

- Create `EditableTableRow` component that combines all cells
- Create `EditableTable` component for complete table structure
- Add drag and drop functionality to `DragHandle`
- Add unit filtering functionality
- Create specialized table variants (e.g., `CargoTable`)

