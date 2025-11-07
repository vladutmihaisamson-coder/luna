import React, { useRef, useEffect } from 'react';
import { DropdownItem } from '../../atoms/DropdownItem/DropdownItem';
import './Dropdown.css';

export const Dropdown = ({ 
  isOpen,
  onClose,
  options = [],
  selectedValue,
  onSelect,
  position = 'bottom',
  align = 'left',
  className = '',
  ...props 
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if the click is on the trigger button (by checking if it has aria-expanded)
        const target = event.target;
        const isTriggerButton = target.closest('[aria-expanded]');
        if (!isTriggerButton) {
          onClose();
        }
      }
    };

    if (isOpen) {
      // Use a small delay to avoid closing immediately when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleItemClick = (value) => {
    if (onSelect) {
      onSelect(value);
    }
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className={`dropdown dropdown-${position} dropdown-align-${align} ${className}`}
      {...props}
    >
      <div className="dropdown-list">
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          const isSelected = optionValue === selectedValue;

          return (
            <DropdownItem
              key={optionValue}
              value={optionValue}
              label={optionLabel}
              onClick={handleItemClick}
              isSelected={isSelected}
            />
          );
        })}
      </div>
    </div>
  );
};

