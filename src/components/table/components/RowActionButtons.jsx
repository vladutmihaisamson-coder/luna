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
    return <DeleteButton onClick={onDelete} className={className} />;
  }
  
  return <ResetButton onClick={onReset} className={className} />;
};

