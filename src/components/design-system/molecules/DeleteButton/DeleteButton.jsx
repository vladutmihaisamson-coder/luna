import React from 'react';
import { IconButton } from '../IconButton/IconButton';
import './DeleteButton.css';

export const DeleteButton = ({ 
  onClick,
  className = ''
}) => {
  return (
    <IconButton
      icon="delete"
      variant="ghost"
      size="md"
      onClick={onClick}
      aria-label="Delete row"
      className={`delete-button ${className}`}
    />
  );
};

