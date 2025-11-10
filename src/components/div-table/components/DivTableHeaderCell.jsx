import React from 'react';
import { IconButton } from '../../design-system/molecules/IconButton/IconButton';
import './DivTableHeaderCell.css';

export const DivTableHeaderCell = ({
  children,
  className = '',
  onDropdownClick,
  onDelete,
  ...props
}) => {
  return (
    <div className={`div-table-header-cell ${className}`} {...props}>
      <div className="div-table-header-cell-content">
        <span className="div-table-header-cell-label">{children}</span>
        <div className="div-table-header-cell-actions">
          {onDelete && (
            <IconButton
              icon="delete"
              variant="ghost"
              size="sm"
              onClick={onDelete}
              aria-label="Delete column"
              className="div-table-header-cell-delete-button"
            />
          )}
          <IconButton
            icon="filter"
            variant="ghost"
            size="sm"
            onClick={onDropdownClick}
            aria-label="Column options"
            className="div-table-header-cell-dropdown-button"
          />
        </div>
      </div>
    </div>
  );
};

