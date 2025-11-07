# Component Architecture Proposal

## Recommended Component Decomposition

### 1. **Base Cell Components** (Reusable UI primitives)

#### `EditableTextCell.jsx`
- Simple text input cell
- Props: `value`, `onChange`, `placeholder`, `className`
- Used for: Description field

#### `QuantityCell.jsx`
- Number input with increment/decrement buttons
- Props: `value`, `onChange`, `onIncrement`, `onDecrement`, `min`
- Handles: Empty state, validation, blur behavior
- Used for: Quantity field

#### `UnitCell.jsx`
- Text input with dropdown overlay
- Props: `value`, `onChange`, `options`, `placeholder`
- Handles: Custom text + dropdown selection
- Used for: Unit field

#### `DragHandle.jsx`
- Visual drag handle button
- Props: `onDragStart` (optional, for future functionality)
- Used for: Row reordering (currently visual only)

---

### 2. **Row Action Components** (Already exist, but can be enhanced)

#### `DeleteRowButton.jsx` ✅ (Already exists)
- Delete button that appears on hover

#### `ResetRowButton.jsx` ✅ (Already exists)
- Reset button for single row state

#### `RowActionButtons.jsx` (New - wrapper)
- Conditionally renders Delete or Reset button
- Props: `canDelete`, `onDelete`, `onReset`
- Logic: Shows delete if `canDelete`, otherwise reset

---

### 3. **Table Row Component**

#### `EditableTableRow.jsx`
- Complete table row with all cells
- Props:
  - `item`: Row data object `{ id, description, quantity, unit }`
  - `unitOptions`: Array of unit options
  - `onUpdate`: `(id, field, value) => void`
  - `onIncrement`: `(id) => void`
  - `onDecrement`: `(id) => void`
  - `onDelete`: `(id) => void`
  - `onReset`: `(id) => void`
  - `canDelete`: boolean
  - `showDragHandle`: boolean (default: false)
- Handles: All row-level logic and cell coordination

---

### 4. **Table Container Component**

#### `EditableTable.jsx`
- Complete table with header and rows
- Props:
  - `items`: Array of row data
  - `columns`: Array of column definitions `[{ label, key, type, ... }]`
  - `unitOptions`: Array of unit options
  - `onItemUpdate`: `(id, field, value) => void`
  - `onItemAdd`: `() => void`
  - `onItemDelete`: `(id) => void`
  - `onItemReset`: `(id) => void`
  - `showDragHandle`: boolean
- Handles: Table structure, header rendering, row mapping

---

### 5. **Specialized Table Components** (Composition)

#### `CargoTable.jsx` (for Transport/Fattura documents)
- Wraps `EditableTable` with cargo-specific configuration
- Handles: Pagination, document-specific styling

#### `TestTable.jsx` (simplified)
- Uses `EditableTable` directly
- Handles: Test-specific state management

---

## File Structure

```
src/components/
├── table/
│   ├── EditableTable.jsx          # Main table component
│   ├── EditableTableRow.jsx       # Row component
│   ├── cells/
│   │   ├── EditableTextCell.jsx
│   │   ├── QuantityCell.jsx
│   │   ├── UnitCell.jsx
│   │   └── DragHandle.jsx
│   ├── actions/
│   │   ├── RowActionButtons.jsx   # Delete/Reset wrapper
│   │   ├── DeleteRowButton.jsx    # (already exists)
│   │   └── ResetRowButton.jsx     # (already exists)
│   └── styles/
│       ├── EditableTable.css
│       └── cells/
│           ├── EditableTextCell.css
│           ├── QuantityCell.css
│           ├── UnitCell.css
│           └── DragHandle.css
├── TransportDocument.jsx          # Uses CargoTable
├── TestTable.jsx                  # Uses EditableTable
└── ...
```

---

## Benefits

1. **Reusability**: Cell components can be used in any table
2. **Maintainability**: Changes to quantity logic only affect `QuantityCell`
3. **Testability**: Each component can be tested in isolation
4. **Consistency**: Same components used in TestTable and TransportDocument
5. **Flexibility**: Easy to add new cell types or modify existing ones
6. **Separation of Concerns**: UI components separate from business logic

---

## Migration Strategy

1. **Phase 1**: Extract cell components (EditableTextCell, QuantityCell, UnitCell)
2. **Phase 2**: Create EditableTableRow using extracted cells
3. **Phase 3**: Create EditableTable wrapper
4. **Phase 4**: Refactor TestTable to use EditableTable
5. **Phase 5**: Refactor TransportDocument to use EditableTable/CargoTable

---

## Example Usage

```jsx
// Simple usage
<EditableTable
  items={items}
  columns={[
    { label: 'Description', key: 'description', type: 'text' },
    { label: 'Quantity', key: 'quantity', type: 'quantity' },
    { label: 'Unit', key: 'unit', type: 'unit', options: unitOptions }
  ]}
  unitOptions={unitOptions}
  onItemUpdate={handleUpdate}
  onItemAdd={handleAdd}
  onItemDelete={handleDelete}
  onItemReset={handleReset}
  showDragHandle={true}
/>
```

