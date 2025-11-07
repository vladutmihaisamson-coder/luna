import React from 'react';
import { IconButton } from '../../design-system/molecules/IconButton/IconButton';
import './DragHandle.css';

export const DragHandle = ({ 
  className = ''
}) => {
  return (
    <IconButton
      icon="drag"
      variant="ghost"
      size="md"
      aria-label="Drag row"
      className={`drag-handle ${className}`}
    />
  );
};

