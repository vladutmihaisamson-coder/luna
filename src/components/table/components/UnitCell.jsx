import React, { useState, useRef } from 'react';
import { Input } from '../../design-system/atoms/Input/Input';
import { IconButton } from '../../design-system/molecules/IconButton/IconButton';
import { Dropdown } from '../../design-system/organisms/Dropdown/Dropdown';
import './UnitCell.css';

export const UnitCell = ({ 
  value, 
  onChange, 
  options = [],
  placeholder = 'Unit',
  className = ''
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  const handleSelect = (selectedValue) => {
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <div ref={wrapperRef} className={`unit-cell ${isDropdownOpen ? 'dropdown-open' : ''} ${className}`}>
      <div className="unit-input-and-controls-wrapper">
        <div className="unit-input-label-wrapper">
          <Input
            type="text"
            className="unit-input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
        </div>
        <div className="unit-dropdown-controls">
          <div className="unit-dropdown-button-wrapper">
            <IconButton
              icon="chevron-down"
              size="md"
              onClick={handleDropdownClick}
              variant="ghost"
              className="unit-dropdown-button"
              aria-label="Open dropdown"
              aria-expanded={isDropdownOpen}
            />
            <Dropdown
              isOpen={isDropdownOpen}
              onClose={handleDropdownClose}
              options={options}
              selectedValue={value}
              onSelect={handleSelect}
              position="bottom"
              align="right"
              className="unit-dropdown"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

