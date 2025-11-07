import React from 'react';
import { IconButton } from '../IconButton/IconButton';
import './ResetButton.css';

export const ResetButton = ({ 
  onClick,
  className = ''
}) => {
  return (
    <IconButton
      icon="reset"
      variant="ghost"
      size="md"
      onClick={onClick}
      aria-label="Reset row"
      className={`reset-button ${className}`}
    />
  );
};

