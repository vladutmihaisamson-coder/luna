import React from 'react';
import { DivTableHeaderCell } from './DivTableHeaderCell.jsx';
import './DivTableHeader.css';

export const DivTableHeader = ({
  columns = ['Description', 'Quantity', 'Unit'], // Array of strings or objects with { label, key, className, ... }
  className = '',
  onColumnDelete
}) => {
  return (
    <div className={`div-table-header ${className}`}>
      <div className={`div-table-header-row ${className}`}>
        {columns.map((column, index) => {
          // Support both string and object column definitions
          const columnLabel = typeof column === 'string' ? column : column.label || column.key || '';
          const columnKey = typeof column === 'string' ? column : column.key || index;
          const columnClassName = typeof column === 'string' ? '' : column.className || '';
          
          const handleDelete = onColumnDelete ? () => onColumnDelete(index, columnKey) : undefined;
          
          return (
            <DivTableHeaderCell 
              key={columnKey} 
              className={columnClassName}
              onDelete={handleDelete}
            >
              {columnLabel}
            </DivTableHeaderCell>
          );
        })}
      </div>
    </div>
  );
};

