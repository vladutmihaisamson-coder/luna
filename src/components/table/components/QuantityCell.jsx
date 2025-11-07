import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../../design-system/atoms/Input/Input';
import { IconButton } from '../../design-system/molecules/IconButton/IconButton';
import './QuantityCell.css';

export const QuantityCell = ({ 
  value, 
  onChange, 
  onIncrement, 
  onDecrement,
  min = 0,
  className = ''
}) => {
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsHighlighted(true);
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 1000);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const handleChange = (inputValue) => {
    if (inputValue === '' || inputValue === '--') {
      if (onChange) onChange(0);
    } else {
      const numValue = parseInt(inputValue);
      if (onChange) onChange(isNaN(numValue) ? 0 : numValue);
    }
  };


  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (e.target.value === '' || e.target.value === '--') {
      if (onChange) onChange(0);
    }
  };

  // Display "--" when value is 0 and not focused, otherwise show the actual value
  const displayValue = (value === 0 || value === '0') && !isFocused 
    ? '--' 
    : (value === '' ? '' : value);

  return (
    <div className={`quantity-cell ${className}`}>
      <div className="quantity-input-wrapper">
        <Input
          type="text"
          className={`quantity-input ${isHighlighted ? 'quantity-input-highlighted' : ''}`}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          min={min}
        />
      </div>
      <div className="quantity-controls">
        <IconButton
          icon="plus"
          size="md"
          onClick={onIncrement}
          aria-label="Increase quantity"
          variant="ghost"
        />
        <IconButton
          icon="minus"
          size="md"
          onClick={onDecrement}
          aria-label="Decrease quantity"
          variant="ghost"
        />
      </div>
    </div>
  );
};

