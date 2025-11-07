import React from 'react';
import { TableHeaderCell } from './TableHeaderCell.jsx';
import './TableHeader.css';

export const TableHeader = ({
  columns = ['Description', 'Quantity', 'Unit'], // Array of strings or objects with { label, key, className, ... }
  className = ''
}) => {
  return (
    <thead>
      <tr className={`table-header-row ${className}`}>
        {columns.map((column, index) => {
          // Support both string and object column definitions
          const columnLabel = typeof column === 'string' ? column : column.label || column.key || '';
          const columnKey = typeof column === 'string' ? column : column.key || index;
          const columnClassName = typeof column === 'string' ? '' : column.className || '';
          
          return (
            <TableHeaderCell key={columnKey} className={columnClassName}>
              {columnLabel}
            </TableHeaderCell>
          );
        })}
      </tr>
    </thead>
  );
};

