import { useRef, useEffect } from 'react';
import './DatePickerDropdown.css';

export const DatePickerDropdown = ({ value, onChange, onClose, isOpen }) => {
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Automatically open the native date picker when dropdown appears
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        try {
          inputRef.current?.showPicker();
        } catch (error) {
          // showPicker() might not be supported in some browsers
          inputRef.current?.focus();
        }
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="date-picker-dropdown-component">
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          onClose();
        }}
      />
    </div>
  );
};

