import React from 'react';
import { Button } from '../../design-system/atoms/Button/Button';
import { Icon } from '../../design-system/atoms/Icon/Icon';
import './TableHeaderCell.css';

export const TableHeaderCell = ({
  children,
  className = '',
  onDropdownClick,
  onDelete,
  ...props
}) => {
  return (
    <div className={`table-header-cell ${className}`} {...props}>
      <div className="table-header-cell-content">
        <span className="table-header-cell-label">{children}</span>
      </div>
    </div>
  );
};

