import React from 'react';
import { DivTableHeaderCell } from './DivTableHeaderCell.jsx';
import './DivTableHeader.css';

export const DivTableHeader = ({
  columns = ['Description', 'Quantity', 'Unit'], // Array of strings or objects with { label, key, className, ... }
  className = ''
}) => {
  return (
    <div className={`div-table-header ${className}`}>
      <div className={`div-table-header-row ${className}`}>
        {columns.map((column, index) => {
          // Support both string and object column definitions
          const columnLabel = typeof column === 'string' ? column : column.label || column.key || '';
          const columnKey = typeof column === 'string' ? column : column.key || index;
          const columnClassName = typeof column === 'string' ? '' : column.className || '';
          
          return (
            <DivTableHeaderCell key={columnKey} className={columnClassName}>
              {columnLabel}
            </DivTableHeaderCell>
          );
        })}
        {/* Empty header cell for action column (delete/reset buttons) */}
        <DivTableHeaderCell className="div-row-action-header-cell" />
      </div>
    </div>
  );
};

