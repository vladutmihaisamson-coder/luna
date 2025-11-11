import { useState, useRef } from 'react';
import { DivTableRow } from './div-table/components/DivTableRow.jsx';
import { TableHeaderCell } from './table/components/TableHeaderCell.jsx';
import { Button } from './design-system/atoms/Button/Button';
import { Rulers } from './design-system/organisms/Rulers/Rulers';
import './DivTable.css';

export const DivTable = ({ 
  items: controlledItems,
  columns: controlledColumns = ['Description', 'Quantity', 'Unit'], // Array of strings or objects with { label, key, ... }
  renderRow, // Optional custom row renderer function: (item, index, items) => ReactNode
  unitOptions: controlledUnitOptions,
  onUpdateItem,
  onIncrementQuantity,
  onDecrementQuantity,
  onDeleteItem,
  onResetRow,
  onAddNewRow,
  onColumnDelete,
  showRulers = false,
  className = '',
  defaultValues = { description: '', quantity: 1, unit: 'boxes' },
  totalItemsCount // Total count of items across all pages (for determining actionButton)
}) => {
  const containerRef = useRef(null);
  // Always start with one default empty row
  const [internalItems, setInternalItems] = useState([
    { 
      id: 1, 
      ...defaultValues
    }
  ]);
  
  // Internal state for columns if not controlled
  const [internalColumns, setInternalColumns] = useState(controlledColumns);
  
  const items = controlledItems || internalItems;
  // Use controlled columns if provided, otherwise use internal state
  const columns = controlledColumns !== undefined ? controlledColumns : internalColumns;
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

  const handleColumnDelete = (index, columnKey) => {
    // Prevent deleting if only one column remains
    if (columns.length <= 1) {
      return;
    }
    
    if (onColumnDelete) {
      onColumnDelete(index, columnKey);
    } else {
      // Internal column deletion
      setInternalColumns(prevColumns => {
        const newColumns = [...prevColumns];
        newColumns.splice(index, 1);
        return newColumns;
      });
    }
  };

  // Extract column labels if columns is an array of objects
  const columnLabels = columns.map(col => typeof col === 'string' ? col : col.label || col.key || '');

  const tableContent = (
    <div ref={containerRef} className={`div-table-container ${className}`}>
      <div className="div-cargo-table">
        <div className="table-header">
          <div className="div-table-header-row">
            {columnLabels.map((columnLabel, index) => {
              const handleDelete = handleColumnDelete ? () => handleColumnDelete(index, columnLabel) : undefined;
              return (
                <TableHeaderCell key={index} onDelete={handleDelete}>
                  {columnLabel}
                </TableHeaderCell>
              );
            })}
          </div>
        </div>
        <div className="div-table-body">
          {items.map((item, index) => {
            // If custom renderRow function is provided, use it
            if (renderRow) {
              return (
                <div key={item.id || index} className="div-table-row">
                  {renderRow(item, index, items)}
                </div>
              );
            }
            
            // Default: use DivTableRow component
            // State management:
            // State 1: More than 1 row (total across all pages) -> all rows show delete button
            // State 2: Only 1 row total -> show reset button (if row is modified from default)
            // State 3: Reset clicked -> row matches defaultValues -> no button (handled by isDefault)
            // Use totalItemsCount if provided, otherwise fall back to items.length
            const totalCount = totalItemsCount !== undefined ? totalItemsCount : items.length;
            const actionButton = totalCount > 1 ? 'delete' : 'reset';
            
            return (
              <DivTableRow
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
        </div>
      </div>
      {(onAddNewRow || !controlledItems) && (
        <div className="div-table-add-row-container">
          <Button 
            variant="default" 
            onClick={addNewRow}
            className="div-table-add-row-button"
          >
            Add Row
          </Button>
        </div>
      )}
    </div>
  );

  if (showRulers) {
    return (
      <Rulers containerRef={containerRef} className="div-table-rulers">
        {tableContent}
      </Rulers>
    );
  }

  return tableContent;
};

