import React from 'react';
import { EditableTextCell } from './EditableTextCell';
import { QuantityCell } from './QuantityCell';
import { UnitCell } from './UnitCell';
import { DragHandle } from './DragHandle';
import { RowActionButtons } from './RowActionButtons';
import './TableRow.css';

export const TableRow = ({
  item,
  unitOptions = [],
  canDelete = true,
  onUpdateItem,
  onIncrementQuantity,
  onDecrementQuantity,
  onDeleteItem,
  onResetRow,
  className = ''
}) => {
  const handleDescriptionChange = (value) => {
    if (onUpdateItem) {
      onUpdateItem(item.id, 'description', value);
    }
  };

  const handleQuantityChange = (value) => {
    if (onUpdateItem) {
      onUpdateItem(item.id, 'quantity', value);
    }
  };

  const handleUnitChange = (value) => {
    if (onUpdateItem) {
      onUpdateItem(item.id, 'unit', value);
    }
  };

  const handleIncrement = () => {
    if (onIncrementQuantity) {
      onIncrementQuantity(item.id);
    }
  };

  const handleDecrement = () => {
    if (onDecrementQuantity) {
      onDecrementQuantity(item.id);
    }
  };

  const handleDelete = () => {
    if (onDeleteItem) {
      onDeleteItem(item.id);
    }
  };

  const handleReset = () => {
    if (onResetRow) {
      onResetRow(item.id);
    }
  };

  return (
    <tr 
      className={`table-row table-row-with-delete ${className}`}
    >
      <td className="description-cell-with-handle">
        <DragHandle />
        <EditableTextCell
          value={item.description}
          onChange={handleDescriptionChange}
          placeholder="Enter description"
        />
      </td>
      <td>
        <QuantityCell
          value={item.quantity}
          onChange={handleQuantityChange}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          min={0}
        />
      </td>
      <td className="unit-cell-with-delete">
        <UnitCell
          value={item.unit}
          onChange={handleUnitChange}
          options={unitOptions}
          placeholder="Unit"
        />
        <RowActionButtons
          canDelete={canDelete}
          onDelete={handleDelete}
          onReset={handleReset}
        />
      </td>
    </tr>
  );
};

