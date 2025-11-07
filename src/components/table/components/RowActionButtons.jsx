import React from 'react';
import { DeleteButton } from '../../design-system/molecules/DeleteButton/DeleteButton';
import { ResetButton } from '../../design-system/molecules/ResetButton/ResetButton';
import './RowActionButtons.css';

export const RowActionButtons = ({ 
  canDelete = true,
  onDelete,
  onReset,
  className = ''
}) => {
  if (canDelete) {
    return (
      <div className="row-action-buttons-wrapper">
        <DeleteButton onClick={onDelete} className={className} />
      </div>
    );
  }
  
  return (
    <div className="row-action-buttons-wrapper">
      <ResetButton onClick={onReset} className={className} />
    </div>
  );
};

