import React from 'react';
import { IconButton } from '../../design-system/molecules/IconButton/IconButton';
import './TableHeaderCell.css';

export const TableHeaderCell = ({
  children,
  className = '',
  onDropdownClick,
  onDelete,
  ...props
}) => {
  return (
    <th className={`table-header-cell ${className}`} {...props}>
      <div className="table-header-cell-content">
        <span className="table-header-cell-label">{children}</span>
        <div className="table-header-cell-actions">
          {onDelete && (
            <IconButton
              icon="delete"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              aria-label="Delete column"
              className="table-header-cell-delete-button"
            />
          )}
          <IconButton
            icon="filter"
            variant="ghost"
            size="sm"
            onClick={onDropdownClick}
            aria-label="Column options"
            className="table-header-cell-dropdown-button"
          />
        </div>
      </div>
    </th>
  );
};

