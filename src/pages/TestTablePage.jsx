import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TransportDocumentTable } from '../components/TransportDocumentTable';
import { TableRow, TableHeader, EditableTextCell, QuantityCell, UnitCell } from '../components/table';
import { Button } from '../components/design-system';
import '../components/TransportDocumentTable.css';
import './TestTablePage.css';

export const TestTablePage = () => {
  const [exampleItem, setExampleItem] = useState({
    id: 'example-1',
    description: 'Example item description',
    quantity: 5,
    unit: 'boxes'
  });

  const [cellExampleDescription, setCellExampleDescription] = useState('Sample description text');
  const [cellExampleQuantity, setCellExampleQuantity] = useState(10);
  const [cellExampleUnit, setCellExampleUnit] = useState('boxes');

  const unitOptions = ['boxes', 'pallets', 'pieces', 'units', 'sets', 'set', 'unit', 'kg', 'tons', 'liters'];

  const handleUpdateItem = (id, field, value) => {
    setExampleItem(prev => ({ ...prev, [field]: value }));
  };

  const handleIncrementQuantity = () => {
    setExampleItem(prev => ({ ...prev, quantity: (prev.quantity || 0) + 1 }));
  };

  const handleDecrementQuantity = () => {
    setExampleItem(prev => ({ ...prev, quantity: Math.max(0, (prev.quantity || 0) - 1) }));
  };

  const handleDeleteItem = () => {
    console.log('Delete item:', exampleItem.id);
  };

  const handleResetRow = () => {
    setExampleItem({
      id: 'example-1',
      description: '',
      quantity: 1,
      unit: 'boxes'
    });
  };

  return (
    <div className="test-table-page">
      <div className="test-table-page-content">
        <div className="page-header">
          <h1>Test Table</h1>
          <Link to="/table-components-showcase" className="components-link">
            <Button variant="default">← Table Components Showcase</Button>
          </Link>
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
          <p>Hover over the row to see the drag handle and delete button appear.</p>
          <div className="table-row-example-container">
            <table className="cargo-table">
              <TableHeader columns={['Description', 'Quantity', 'Unit']} />
              <tbody>
                <TableRow
                  item={exampleItem}
                  unitOptions={unitOptions}
                  canDelete={true}
                  onUpdateItem={handleUpdateItem}
                  onIncrementQuantity={handleIncrementQuantity}
                  onDecrementQuantity={handleDecrementQuantity}
                  onDeleteItem={handleDeleteItem}
                  onResetRow={handleResetRow}
                />
              </tbody>
            </table>
          </div>
        </div>

        <TransportDocumentTable />
      </div>
    </div>
  );
};

