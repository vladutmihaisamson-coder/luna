import React from 'react';
import { DeleteButton } from '../../design-system/molecules/DeleteButton/DeleteButton';
import { ResetButton } from '../../design-system/molecules/ResetButton/ResetButton';
import './RowActionButtons.css';

export const RowActionButtons = ({ 
  actionButton = 'delete', // 'delete' | 'reset' | null
  onDelete,
  onReset,
  isDefault = false,
  className = ''
}) => {
  // Don't show reset button if row is already in default state
  if (actionButton === 'reset' && isDefault) {
    return null;
  }
  
  if (actionButton === 'delete') {
    return (
      <DeleteButton onClick={onDelete} className={`row-action-button ${className}`} />
    );
  }
  
  if (actionButton === 'reset') {
    return (
      <ResetButton onClick={onReset} className={`row-action-button ${className}`} />
    );
  }
  
  // actionButton is null or undefined - don't show any button
  return null;
};

