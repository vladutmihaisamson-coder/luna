import React from 'react';
import { Icon } from '../Icon/Icon';
import './Button.css';

export const Button = ({ 
  children,
  variant = 'default',
  size = 'md',
  icon,
  iconVariant = 'outline',
  iconPosition = 'left',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    icon && `button-with-icon`,
    icon && `button-icon-${iconPosition}`,
    disabled && 'button-disabled',
    className
  ].filter(Boolean).join(' ');

  const iconElement = icon ? (
    <span className="button-icon">
      <Icon name={icon} size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} variant={iconVariant} />
    </span>
  ) : null;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && iconElement}
      {children && <span className="button-content">{children}</span>}
      {icon && iconPosition === 'right' && iconElement}
    </button>
  );
};

