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
    if (inputValue === '') {
      if (onChange) onChange('');
    } else {
      const numValue = parseInt(inputValue);
      if (onChange) onChange(isNaN(numValue) ? 0 : numValue);
    }
  };

  const handleBlur = (e) => {
    if (e.target.value === '') {
      if (onChange) onChange(0);
    }
  };

  return (
    <div className={`quantity-cell ${className}`}>
      <div className="quantity-input-wrapper">
        <Input
          type="number"
          className={`quantity-input ${isHighlighted ? 'quantity-input-highlighted' : ''}`}
          value={value === '' ? '' : value}
          onChange={handleChange}
          onBlur={handleBlur}
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

