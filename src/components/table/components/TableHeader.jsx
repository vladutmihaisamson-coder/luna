import React from 'react';
import './TableHeader.css';

export const TableHeader = ({
  columns = ['Description', 'Quantity', 'Unit'],
  className = ''
}) => {
  return (
    <thead>
      <tr className={`table-header-row ${className}`}>
        {columns.map((column, index) => (
          <th key={index} className="table-header-cell">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
};

