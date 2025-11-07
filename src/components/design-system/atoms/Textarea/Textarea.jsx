import React, { useRef, useEffect } from 'react';
import './Textarea.css';

export const Textarea = ({ 
  value,
  onChange,
  placeholder,
  disabled = false,
  autoResize = false,
  rows = 1,
  className = '',
  ...props 
}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, autoResize]);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
    
    if (autoResize) {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  };

  const handleFocus = (e) => {
    if (autoResize) {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  };

  const textareaClasses = [
    'textarea',
    disabled && 'textarea-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <textarea
      ref={textareaRef}
      className={textareaClasses}
      value={value || ''}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      {...props}
    />
  );
};

