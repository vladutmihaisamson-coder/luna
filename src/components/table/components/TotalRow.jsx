import React from 'react';
import { TotalCell } from './TotalCell';
import './TotalRow.css';

export const TotalRow = ({ 
  label = 'Total',
  value, 
  currencySymbol = '€',
  isFinal = false,
  className = ''
}) => {
  return (
    <div className={`total-row ${isFinal ? 'total-row-final' : ''} ${className}`}>
      <div className="total-row-label">{label}</div>
      <div className="total-row-value">
        <TotalCell
          value={value}
          currencySymbol={currencySymbol}
        />
      </div>
    </div>
  );
};

