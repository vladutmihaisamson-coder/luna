import React from 'react';
import { Textarea } from '../../design-system/atoms/Textarea/Textarea';
import './EditableTextCell.css';

export const EditableTextCell = ({ 
  value, 
  onChange, 
  placeholder = 'Enter description',
  className = '',
  autoResize = true
}) => {
  return (
    <Textarea
      className={`editable-text-cell ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoResize={autoResize}
      rows={1}
    />
  );
};

