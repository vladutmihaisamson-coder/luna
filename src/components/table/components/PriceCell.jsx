import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../../design-system/atoms/Input/Input';
import './PriceCell.css';

export const PriceCell = ({ 
  value, 
  onChange, 
  min = 0,
  className = '',
  currencySymbol = '€'
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
      const numValue = parseFloat(inputValue);
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

  // Format value for display - remove .00 for whole numbers
  const formatValue = (val) => {
    if (val === '' || val === 0 || val === '0') return '';
    if (typeof val === 'number') {
      // Check if it's a whole number (no decimal part)
      if (Number.isInteger(val)) {
        return val.toString();
      }
      // For decimals, format to 2 decimal places then remove trailing zeros
      const formatted = val.toFixed(2).replace(/\.?0+$/, '');
      return formatted;
    }
    return val;
  };

  // Display "--" when value is 0 and not focused, otherwise show the formatted value
  const displayValue = (value === 0 || value === '0' || value === '') && !isFocused 
    ? '--' 
    : formatValue(value);

  return (
    <div className={`price-cell ${className}`}>
      <div className="price-input-wrapper">
        <span className="price-currency-symbol">{currencySymbol}</span>
        <Input
          type="number"
          step="0.01"
          min={min}
          className={`price-input ${isHighlighted ? 'price-input-highlighted' : ''}`}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder="0.00"
        />
      </div>
    </div>
  );
};

