import React from 'react';
import './TotalCell.css';

export const TotalCell = ({ 
  value, 
  currencySymbol = '€',
  className = ''
}) => {
  // Format currency for display
  const formatCurrencyDisplay = (val) => {
    if (val === '' || val === 0 || val === '0' || val === null || val === undefined) return '';
    const numValue = typeof val === 'number' ? val : parseFloat(val);
    if (isNaN(numValue)) return '';
    return `${currencySymbol}${numValue.toFixed(2)}`;
  };

  const displayValue = formatCurrencyDisplay(value);

  return (
    <div className={`total-cell ${className}`}>
      <div className="total-display">
        {displayValue}
      </div>
    </div>
  );
};

