import React from 'react';
import './Input.css';

export const Input = ({ 
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
  className = '',
  ...props 
}) => {
  const inputClasses = [
    'input',
    disabled && 'input-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      type={type}
      className={inputClasses}
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  );
};

