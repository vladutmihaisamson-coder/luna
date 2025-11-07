import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { Table } from '../components/Table';
import { TableRow } from '../components/table/components/TableRow.jsx';
import { TableHeader } from '../components/table/components/TableHeader.jsx';
import { TableHeaderCell } from '../components/table/components/TableHeaderCell.jsx';
import { EditableTextCell } from '../components/table/components/EditableTextCell.jsx';
import { QuantityCell } from '../components/table/components/QuantityCell.jsx';
import { UnitCell } from '../components/table/components/UnitCell.jsx';
import { Button, IconButton, Document } from '../components/design-system';
import './TestTablePage.css';

export const TestTablePage = () => {
  // State 1: Row with delete button (default state - multiple rows in table)
  const [state1Item, setState1Item] = useState({
    id: 'state-1',
    description: 'Sample item with delete button',
    quantity: 5,
    unit: 'boxes'
  });

  // State 2: Row with reset button (last row, not in default state)
  const [state2Item, setState2Item] = useState({
    id: 'state-2',
    description: 'Last row with reset button',
    quantity: 10,
    unit: 'pieces'
  });

  // State 3: Row with no button (last row, reset to default values)
  const [state3Item, setState3Item] = useState({
    id: 'state-3',
    description: '',
    quantity: 1,
    unit: 'boxes'
  });

  // State 4: Row with null actionButton (no button at all)
  const [state4Item, setState4Item] = useState({
    id: 'state-4',
    description: 'Row with no action button',
    quantity: 3,
    unit: 'units'
  });

  const [cellExampleDescription, setCellExampleDescription] = useState('Sample description text');
  const [cellExampleQuantity, setCellExampleQuantity] = useState(10);
  const [cellExampleUnit, setCellExampleUnit] = useState('boxes');

  const unitOptions = ['boxes', 'pallets', 'pieces', 'units', 'sets', 'set', 'unit', 'kg', 'tons', 'liters'];

  const defaultValues = { description: '', quantity: 1, unit: 'boxes' };

  const handleUpdateItem = (id, field, value) => {
    if (id === 'state-1') {
      setState1Item(prev => ({ ...prev, [field]: value }));
    } else if (id === 'state-2') {
      setState2Item(prev => ({ ...prev, [field]: value }));
    } else if (id === 'state-3') {
      setState3Item(prev => ({ ...prev, [field]: value }));
    } else if (id === 'state-4') {
      setState4Item(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleIncrementQuantity = (id) => {
    if (id === 'state-1') {
      setState1Item(prev => ({ ...prev, quantity: (prev.quantity || 0) + 1 }));
    } else if (id === 'state-2') {
      setState2Item(prev => ({ ...prev, quantity: (prev.quantity || 0) + 1 }));
    } else if (id === 'state-3') {
      setState3Item(prev => ({ ...prev, quantity: (prev.quantity || 0) + 1 }));
    } else if (id === 'state-4') {
      setState4Item(prev => ({ ...prev, quantity: (prev.quantity || 0) + 1 }));
    }
  };

  const handleDecrementQuantity = (id) => {
    if (id === 'state-1') {
      setState1Item(prev => ({ ...prev, quantity: Math.max(0, (prev.quantity || 0) - 1) }));
    } else if (id === 'state-2') {
      setState2Item(prev => ({ ...prev, quantity: Math.max(0, (prev.quantity || 0) - 1) }));
    } else if (id === 'state-3') {
      setState3Item(prev => ({ ...prev, quantity: Math.max(0, (prev.quantity || 0) - 1) }));
    } else if (id === 'state-4') {
      setState4Item(prev => ({ ...prev, quantity: Math.max(0, (prev.quantity || 0) - 1) }));
    }
  };

  const handleDeleteItem = (id) => {
    console.log('Delete item:', id);
  };

  const handleResetRow = (id) => {
    if (id === 'state-1') {
      setState1Item({ id: 'state-1', ...defaultValues });
    } else if (id === 'state-2') {
      setState2Item({ id: 'state-2', ...defaultValues });
    } else if (id === 'state-3') {
      setState3Item({ id: 'state-3', ...defaultValues });
    } else if (id === 'state-4') {
      setState4Item({ id: 'state-4', ...defaultValues });
    }
  };

  return (
    <div className="test-table-page">
      <BackButton />
      <div className="test-table-page-content">
        <div className="page-header">
          <h1>Test Table</h1>
          <Link to="/table-components-showcase" className="components-link">
            <Button variant="default">← Table Components Showcase</Button>
          </Link>
        </div>
        
        {/* IconButton Component Examples */}
        <div className="icon-button-example">
          <h2>IconButton Component Examples</h2>
          <p>Icon button component with different variants, sizes, and icons.</p>
          <div className="icon-button-example-container">
            <div className="icon-button-example-item">
              <h3>Variants</h3>
              <div className="icon-button-example-wrapper">
                <IconButton icon="plus" variant="default" size="md" aria-label="Default" />
                <IconButton icon="plus" variant="primary" size="md" aria-label="Primary" />
                <IconButton icon="plus" variant="ghost" size="md" aria-label="Ghost" />
                <IconButton icon="delete" variant="danger" size="md" aria-label="Danger" />
              </div>
              <p className="icon-button-example-value">default, primary, ghost, danger</p>
            </div>
            
            <div className="icon-button-example-item">
              <h3>Sizes</h3>
              <div className="icon-button-example-wrapper">
                <IconButton icon="plus" variant="default" size="sm" aria-label="Small" />
                <IconButton icon="plus" variant="default" size="md" aria-label="Medium" />
                <IconButton icon="plus" variant="default" size="lg" aria-label="Large" />
              </div>
              <p className="icon-button-example-value">sm, md, lg</p>
            </div>
            
            <div className="icon-button-example-item">
              <h3>Icons</h3>
              <div className="icon-button-example-wrapper">
                <IconButton icon="plus" variant="ghost" size="md" aria-label="Plus" />
                <IconButton icon="minus" variant="ghost" size="md" aria-label="Minus" />
                <IconButton icon="delete" variant="ghost" size="md" aria-label="Delete" />
                <IconButton icon="reset" variant="ghost" size="md" aria-label="Reset" />
                <IconButton icon="filter" variant="ghost" size="md" aria-label="Filter" />
                <IconButton icon="chevron-down" variant="ghost" size="md" aria-label="Chevron Down" />
                <IconButton icon="chevron-left" variant="ghost" size="md" aria-label="Chevron Left" />
                <IconButton icon="x" variant="ghost" size="md" aria-label="Close" />
              </div>
              <p className="icon-button-example-value">plus, minus, delete, reset, filter, chevron-down, chevron-left, x</p>
            </div>
          </div>
        </div>
        
        {/* Example Cell Components */}
        <div className="table-cells-example">
          <h2>Table Cell Components Examples</h2>
          <p>Individual cell components that can be used in table rows.</p>
          <div className="table-cells-example-container">
            <div className="cell-example-item">
              <h3>EditableTextCell</h3>
              <div className="cell-example-wrapper">
                <EditableTextCell
                  value={cellExampleDescription}
                  onChange={setCellExampleDescription}
                  placeholder="Enter description"
                />
              </div>
              <p className="cell-example-value">Value: {cellExampleDescription || '(empty)'}</p>
            </div>
            
            <div className="cell-example-item">
              <h3>QuantityCell</h3>
              <div className="cell-example-wrapper">
                <QuantityCell
                  value={cellExampleQuantity}
                  onChange={setCellExampleQuantity}
                  onIncrement={() => setCellExampleQuantity(prev => prev + 1)}
                  onDecrement={() => setCellExampleQuantity(prev => Math.max(0, prev - 1))}
                  min={0}
                />
              </div>
              <p className="cell-example-value">Value: {cellExampleQuantity}</p>
            </div>
            
            <div className="cell-example-item">
              <h3>UnitCell</h3>
              <div className="cell-example-wrapper">
                <UnitCell
                  value={cellExampleUnit}
                  onChange={setCellExampleUnit}
                  options={unitOptions}
                  placeholder="Unit"
                />
              </div>
              <p className="cell-example-value">Value: {cellExampleUnit}</p>
            </div>
          </div>
        </div>

        {/* Example TableHeaderCell atom component */}
        <div className="table-header-cell-example">
          <h2>TableHeaderCell Component Example</h2>
          <p>Atom component for individual table header cells.</p>
          <div className="table-header-cell-example-container">
            <div className="cell-example-item">
              <h3>TableHeaderCell</h3>
              <div className="cell-example-wrapper">
                <table className="cargo-table">
                  <thead>
                    <tr>
                      <TableHeaderCell>Title</TableHeaderCell>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Example TableHeader component */}
        <div className="table-header-example">
          <h2>TableHeader Component Example</h2>
          <p>Table header component with customizable columns.</p>
          <div className="table-header-example-container">
            <table className="cargo-table">
              <TableHeader columns={['Description', 'Quantity', 'Unit']} />
            </table>
          </div>
        </div>

        {/* Example TableRow component */}
        <div className="table-row-example">
          <h2>TableRow Component Example</h2>
          <p>All possible row states that the TableRow component can display. Hover over the rows to see the drag handle and action buttons appear.</p>
          <div className="table-row-example-container">
            <table className="cargo-table">
              <TableHeader columns={['Description', 'Quantity', 'Unit']} />
              <tbody>
                {/* State 1: Row with delete button (default state - multiple rows in table) */}
                <tr className="table-row-state-label">
                  <td colSpan="3" className="state-label-cell">
                    <span className="state-number">1.</span>
                    <span className="state-description">Row with delete button (default state - multiple rows in table)</span>
                  </td>
                </tr>
                <TableRow
                  item={state1Item}
                  unitOptions={unitOptions}
                  actionButton="delete"
                  onUpdateItem={handleUpdateItem}
                  onIncrementQuantity={handleIncrementQuantity}
                  onDecrementQuantity={handleDecrementQuantity}
                  onDeleteItem={handleDeleteItem}
                  onResetRow={handleResetRow}
                  defaultValues={defaultValues}
                />
                
                {/* State 2: Row with reset button (last row, not in default state) */}
                <tr className="table-row-state-label">
                  <td colSpan="3" className="state-label-cell">
                    <span className="state-number">2.</span>
                    <span className="state-description">Row with reset button (last row, not in default state)</span>
                  </td>
                </tr>
                <TableRow
                  item={state2Item}
                  unitOptions={unitOptions}
                  actionButton="reset"
                  onUpdateItem={handleUpdateItem}
                  onIncrementQuantity={handleIncrementQuantity}
                  onDecrementQuantity={handleDecrementQuantity}
                  onDeleteItem={handleDeleteItem}
                  onResetRow={handleResetRow}
                  defaultValues={defaultValues}
                />
                
                {/* State 3: Row with no button (last row, reset to default values) */}
                <tr className="table-row-state-label">
                  <td colSpan="3" className="state-label-cell">
                    <span className="state-number">3.</span>
                    <span className="state-description">Row with no button (last row, reset to default values - actionButton="reset" and isDefault=true)</span>
                  </td>
                </tr>
                <TableRow
                  item={state3Item}
                  unitOptions={unitOptions}
                  actionButton="reset"
                  onUpdateItem={handleUpdateItem}
                  onIncrementQuantity={handleIncrementQuantity}
                  onDecrementQuantity={handleDecrementQuantity}
                  onDeleteItem={handleDeleteItem}
                  onResetRow={handleResetRow}
                  defaultValues={defaultValues}
                />
                
                {/* State 4: Row with null actionButton (no button at all) */}
                <tr className="table-row-state-label">
                  <td colSpan="3" className="state-label-cell">
                    <span className="state-number">4.</span>
                    <span className="state-description">Row with no action button (actionButton=null)</span>
                  </td>
                </tr>
                <TableRow
                  item={state4Item}
                  unitOptions={unitOptions}
                  actionButton={null}
                  onUpdateItem={handleUpdateItem}
                  onIncrementQuantity={handleIncrementQuantity}
                  onDecrementQuantity={handleDecrementQuantity}
                  onDeleteItem={handleDeleteItem}
                  onResetRow={handleResetRow}
                  defaultValues={defaultValues}
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* Table component */}
        <div className="table-component-example">
          <h2>Table Component Example</h2>
          <p>Complete table component with all features including row management, cell editing, and action buttons.</p>
          <div className="table-component-example-container">
            <Table showRulers={false} />
          </div>
        </div>

        {/* Document component */}
        <div className="document-component-example">
          <h2>Document Component Example</h2>
          <p>Generic document component with A4 real-life size that can contain different types of atoms, molecules, or text.</p>
          <div className="document-component-example-container">
            <Document>
              <h3>Document Title</h3>
              <p>This is a generic document component that follows A4 real-life dimensions (210mm × 297mm).</p>
              <p>It can contain any content including atoms, molecules, or text.</p>
              <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                <Button variant="default">Example Button</Button>
              </div>
              <Table showRulers={false} />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

