import React from 'react';
import { Button } from '../../design-system/atoms/Button/Button';
import { Icon } from '../../design-system/atoms/Icon/Icon';
import './TableHeader.css';
import './TableHeaderCell.css';

export const TableHeader = ({
  columns = ['Description', 'Quantity', 'Unit'], // Array of strings or objects with { label, key, className, ... }
  className = '',
  onColumnDelete
}) => {
  return (
    <div className={`table-header ${className}`}>
      <div className={`table-header-row ${className}`}>
        {columns.map((column, index) => {
          // Support both string and object column definitions
          const columnLabel = typeof column === 'string' ? column : column.label || column.key || '';
          const columnKey = typeof column === 'string' ? column : column.key || index;
          const columnClassName = typeof column === 'string' ? '' : column.className || '';
          
          const handleDelete = onColumnDelete ? () => onColumnDelete(index, columnKey) : undefined;
          
          return (
            <div key={columnKey} className={`table-header-cell ${columnClassName}`}>
              <div className="table-header-cell-content">
                <span className="table-header-cell-label">{columnLabel}</span>
                <div className="table-header-cell-actions">
                  {handleDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      aria-label="Delete column"
                      className="table-header-cell-delete-button"
                    >
                      <Icon name="delete" size="sm" variant="outline" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Column options"
                    className="table-header-cell-dropdown-button"
                  >
                    <Icon name="filter" size="sm" variant="outline" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

