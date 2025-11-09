import React, { useRef, useEffect, forwardRef } from 'react';
import './Textarea.css';

export const Textarea = forwardRef(({ 
  value,
  onChange,
  placeholder,
  disabled = false,
  autoResize = false,
  rows = 1,
  className = '',
  ...props 
}, ref) => {
  const internalRef = useRef(null);
  const textareaRef = ref || internalRef;

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
    if (props.onFocus) {
      props.onFocus(e);
    }
  };

  const handleBlur = (e) => {
    if (props.onBlur) {
      props.onBlur(e);
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
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      {...props}
    />
  );
});

