import React from 'react';
import { EditableTextCell } from '../../table/components/EditableTextCell.jsx';
import { QuantityCell } from '../../table/components/QuantityCell.jsx';
import { UnitCell } from '../../table/components/UnitCell.jsx';
import { DragHandle } from '../../table/components/DragHandle.jsx';
import { DeleteButton } from '../../design-system/molecules/DeleteButton/DeleteButton';
import { ResetButton } from '../../design-system/molecules/ResetButton/ResetButton';
import './DivTableRow.css';

export const DivTableRow = ({
  item,
  unitOptions = [],
  actionButton = 'delete', // 'delete' | 'reset' | null - determines which button to show on the right side (default: 'delete')
  onUpdateItem,
  onIncrementQuantity,
  onDecrementQuantity,
  onDeleteItem,
  onResetRow,
  defaultValues = { description: '', quantity: 1, unit: 'boxes' },
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
    <div 
      className={`div-table-row div-table-row-with-delete ${className}`}
    >
      <div className="div-drag-handle-cell">
        <DragHandle />
      </div>
      <div className="div-table-cell">
        <EditableTextCell
          value={item.description}
          onChange={handleDescriptionChange}
          placeholder="Enter description"
        />
      </div>
      <div className="div-table-cell">
        <QuantityCell
          value={item.quantity}
          onChange={handleQuantityChange}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          min={0}
        />
      </div>
      <div className="div-table-cell">
        <UnitCell
          value={item.unit}
          onChange={handleUnitChange}
          options={unitOptions}
          placeholder="Unit"
        />
      </div>
      <div className="div-row-action-cell">
        {actionButton === 'delete' ? (
          <DeleteButton onClick={handleDelete} className="row-action-button" />
        ) : actionButton === 'reset' && !(
          item.description === defaultValues.description &&
          item.quantity === defaultValues.quantity &&
          item.unit === defaultValues.unit
        ) ? (
          <ResetButton onClick={handleReset} className="row-action-button" />
        ) : null}
      </div>
    </div>
  );
};

