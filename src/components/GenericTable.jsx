import { useState, useRef } from 'react';
import { TableRow } from './table/components/TableRow.jsx';
import { TableHeader } from './table/components/TableHeader.jsx';
import { Button } from './design-system/atoms/Button/Button';
import { Rulers } from './design-system/organisms/Rulers/Rulers';
import './GenericTable.css';
import './Table.css';

export const GenericTable = ({ 
  items: controlledItems,
  columns = ['Description', 'Quantity', 'Unit'], // Array of strings or objects with { label, key, ... }
  renderRow, // Optional custom row renderer function: (item, index, items) => ReactNode
  unitOptions: controlledUnitOptions,
  onUpdateItem,
  onIncrementQuantity,
  onDecrementQuantity,
  onDeleteItem,
  onResetRow,
  onAddNewRow,
  showRulers = false,
  className = '',
  defaultValues = { description: '', quantity: 1, unit: 'boxes' }
}) => {
  const containerRef = useRef(null);
  const [internalItems, setInternalItems] = useState([
    { 
      id: 1, 
      description: 'Sample item 1', 
      quantity: 5, 
      unit: 'pieces' 
    },
    { 
      id: 2, 
      description: 'Sample item 2', 
      quantity: 10, 
      unit: 'boxes' 
    },
    { 
      id: 3, 
      description: '', 
      quantity: 1, 
      unit: 'boxes' 
    },
  ]);

  const items = controlledItems || internalItems;
  const unitOptions = controlledUnitOptions || ['boxes', 'pallets', 'pieces', 'units', 'sets', 'set', 'unit', 'kg', 'tons', 'liters'];

  const updateItem = (id, field, value) => {
    if (onUpdateItem) {
      onUpdateItem(id, field, value);
    } else {
      setInternalItems(prevItems => prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
    }
  };

  const incrementQuantity = (id) => {
    if (onIncrementQuantity) {
      onIncrementQuantity(id);
    } else {
      setInternalItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
          const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
          return { ...item, quantity: currentQty + 1 };
        }
        return item;
      }));
    }
  };

  const decrementQuantity = (id) => {
    if (onDecrementQuantity) {
      onDecrementQuantity(id);
    } else {
      setInternalItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
          const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
          return { ...item, quantity: Math.max(0, currentQty - 1) };
        }
        return item;
      }));
    }
  };

  const deleteItem = (id) => {
    if (onDeleteItem) {
      onDeleteItem(id);
    } else {
      setInternalItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };

  const resetRow = (id) => {
    if (onResetRow) {
      onResetRow(id);
    } else {
      setInternalItems(prevItems => prevItems.map(item => 
        item.id === id 
          ? { ...item, ...defaultValues }
          : item
      ));
    }
  };

  const addNewRow = () => {
    if (onAddNewRow) {
      onAddNewRow();
    } else {
      setInternalItems(prevItems => {
        const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
        const newItem = {
          id: maxId + 1,
          ...defaultValues
        };
        return [...prevItems, newItem];
      });
    }
  };

  // Extract column labels if columns is an array of objects
  const columnLabels = columns.map(col => typeof col === 'string' ? col : col.label || col.key || '');

  const tableContent = (
    <div ref={containerRef} className={`generic-table-container ${className}`}>
      <table className="cargo-table">
        <TableHeader columns={columnLabels} />
        <tbody>
          {items.map((item, index) => {
            // If custom renderRow function is provided, use it
            if (renderRow) {
              return (
                <tr key={item.id || index} className="table-row">
                  {renderRow(item, index, items)}
                </tr>
              );
            }
            
            // Default: use TableRow component (for backward compatibility)
            // State management:
            // State 1: More than 1 row -> all rows show delete button
            // State 2: Only 1 row -> show reset button
            // State 3: Reset clicked -> row matches defaultValues -> no button (handled by isDefault)
            const actionButton = items.length > 1 ? 'delete' : 'reset';
            
            return (
              <TableRow
                key={item.id || index}
                item={item}
                unitOptions={unitOptions}
                actionButton={actionButton}
                onUpdateItem={updateItem}
                onIncrementQuantity={incrementQuantity}
                onDecrementQuantity={decrementQuantity}
                onDeleteItem={deleteItem}
                onResetRow={resetRow}
                defaultValues={defaultValues}
              />
            );
          })}
        </tbody>
      </table>
      {(onAddNewRow || !controlledItems) && (
        <div className="add-row-button-container">
          <Button 
            variant="default" 
            onClick={addNewRow}
            className="add-row-button"
          >
            Add Row
          </Button>
        </div>
      )}
    </div>
  );

  if (showRulers) {
    return (
      <Rulers containerRef={containerRef} className="generic-table-rulers">
        {tableContent}
      </Rulers>
    );
  }

  return tableContent;
};

