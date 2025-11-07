import React from 'react';
import './Select.css';

const SelectComponent = React.forwardRef(({ 
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const selectClasses = [
    'select',
    disabled && 'select-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <select
      ref={ref}
      className={selectClasses}
      value={value || ''}
      onChange={(e) => onChange && onChange(e.target.value)}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
});

SelectComponent.displayName = 'Select';

export const Select = SelectComponent;

