import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { Icon } from '../../atoms/Icon/Icon';
import './IconButton.css';

export const IconButton = ({ 
  icon,
  variant = 'default',
  size = 'md',
  onClick,
  disabled = false,
  'aria-label': ariaLabel,
  className = '',
  ...props 
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled}
      className={`icon-button ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      <Icon name={icon} size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} />
    </Button>
  );
};

