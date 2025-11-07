import React from 'react';
import './Button.css';

export const Button = ({ 
  children,
  variant = 'default',
  size = 'md',
  icon,
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

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="button-icon">{icon}</span>}
      {children && <span className="button-content">{children}</span>}
      {icon && iconPosition === 'right' && <span className="button-icon">{icon}</span>}
    </button>
  );
};

