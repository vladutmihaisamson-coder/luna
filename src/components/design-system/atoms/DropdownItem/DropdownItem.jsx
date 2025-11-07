import React from 'react';
import './DropdownItem.css';

export const DropdownItem = ({ 
  value,
  label,
  onClick,
  isSelected = false,
  className = '',
  ...props 
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(value);
    }
  };

  return (
    <button
      type="button"
      className={`dropdown-item ${isSelected ? 'dropdown-item-selected' : ''} ${className}`}
      onClick={handleClick}
      {...props}
    >
      {label || value}
    </button>
  );
};

