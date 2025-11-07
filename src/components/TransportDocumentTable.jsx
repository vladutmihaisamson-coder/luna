import { useState, useRef } from 'react';
import { 
  EditableTextCell, 
  QuantityCell, 
  UnitCell, 
  DragHandle, 
  RowActionButtons 
} from './table';
import { Button } from './design-system/atoms/Button/Button';
import { Rulers } from './design-system/organisms/Rulers/Rulers';
import './TransportDocumentTable.css';

export const TransportDocumentTable = ({ 
  items: controlledItems,
  unitOptions: controlledUnitOptions,
  onUpdateItem,
  onIncrementQuantity,
  onDecrementQuantity,
  onDeleteItem,
  onResetRow,
  onAddNewRow,
  showRulers = true,
  className = ''
}) => {
  const containerRef = useRef(null);
  const [internalItems, setInternalItems] = useState([
    { 
      id: 1, 
      description: 'Hydraulic cylinder assembly with piston rod, seals, and mounting brackets - complete refurbishment kit including O-rings, gaskets, and replacement bearings', 
      quantity: 2, 
      unit: 'units' 
    },
    { 
      id: 2, 
      description: 'Compression die set', 
      quantity: 15, 
      unit: 'pieces' 
    },
    { 
      id: 3, 
      description: '', 
      quantity: 1, 
      unit: 'boxes' 
    },
    { 
      id: 4, 
      description: 'Main frame structural components including base plate, vertical columns, and cross beams with all mounting hardware and fasteners', 
      quantity: 1, 
      unit: 'set' 
    },
    { 
      id: 5, 
      description: 'Control panel', 
      quantity: 3, 
      unit: 'units' 
    },
    { 
      id: 6, 
      description: 'Powder feed hopper with auger mechanism, discharge valve, and level sensors - includes all electrical connections and mounting brackets for installation', 
      quantity: 4, 
      unit: 'pieces' 
    },
    { 
      id: 7, 
      description: 'Safety guards', 
      quantity: 8, 
      unit: 'pieces' 
    },
    { 
      id: 8, 
      description: 'Electrical wiring harness complete with connectors, junction boxes, cable management system, and all necessary documentation for proper installation and maintenance procedures', 
      quantity: 2, 
      unit: 'sets' 
    },
    { 
      id: 9, 
      description: 'Pneumatic valves', 
      quantity: 12, 
      unit: 'pieces' 
    },
    { 
      id: 10, 
      description: 'Refurbished powder compacting press main unit - fully tested and certified including all safety systems, emergency stop mechanisms, and operational documentation', 
      quantity: 1, 
      unit: 'unit' 
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
          ? { ...item, description: '', quantity: 1, unit: 'boxes' }
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
          description: '',
          quantity: 1,
          unit: 'boxes'
        };
        return [...prevItems, newItem];
      });
    }
  };


  const renderTableRow = (item) => (
    <tr 
      key={item.id}
      className="table-row table-row-with-delete"
    >
      <td className="description-cell-with-handle">
        <DragHandle />
        <EditableTextCell
          value={item.description}
          onChange={(value) => updateItem(item.id, 'description', value)}
          placeholder="Enter description"
        />
      </td>
      <td>
        <QuantityCell
          value={item.quantity}
          onChange={(value) => updateItem(item.id, 'quantity', value)}
          onIncrement={() => incrementQuantity(item.id)}
          onDecrement={() => decrementQuantity(item.id)}
          min={0}
        />
      </td>
      <td className="unit-cell-with-delete">
        <UnitCell
          value={item.unit}
          onChange={(value) => updateItem(item.id, 'unit', value)}
          options={unitOptions}
          placeholder="Unit"
        />
        <RowActionButtons
          canDelete={items.length > 1}
          onDelete={() => deleteItem(item.id)}
          onReset={() => resetRow(item.id)}
        />
      </td>
    </tr>
  );

  const tableContent = (
    <div ref={containerRef} className={`transport-document-table-container ${className}`}>
      <table className="cargo-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => renderTableRow(item))}
        </tbody>
      </table>
      {onAddNewRow && (
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
      <Rulers containerRef={containerRef} className="transport-document-table-rulers">
        {tableContent}
      </Rulers>
    );
  }

  return tableContent;
};
