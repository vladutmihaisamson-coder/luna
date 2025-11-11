import React, { useRef } from 'react';
import { Icon } from '../../atoms/Icon/Icon';
import { Dropdown } from '../../organisms/Dropdown/Dropdown';
import './FilterPill.css';

export const FilterPill = ({
  id,
  title,
  placeholder,
  options = [],
  selectedValue,
  onSelect,
  isOpen,
  onToggle,
  onClose,
  position = 'bottom',
  align = 'left',
  className = '',
  ...props
}) => {
  const pillRef = useRef(null);

  const handleToggle = () => {
    if (onToggle) {
      onToggle(id);
    }
  };

  const handleSelect = (value) => {
    if (onSelect) {
      onSelect(id, value);
    }
  };

  const getSelectedLabel = () => {
    if (!selectedValue) return null;
    const option = options.find(opt => {
      const optionValue = typeof opt === 'string' ? opt : opt.value;
      return optionValue === selectedValue;
    });
    if (!option) return null;
    return typeof option === 'string' ? option : option.label;
  };

  const displayText = getSelectedLabel() || placeholder;
  const isActive = !!selectedValue;

  return (
    <div className={`filter-pill-wrapper ${className}`} ref={pillRef} {...props}>
      <button 
        className="filter-pill"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${title} filter`}
      >
        <span className="filter-pill-title">{title}</span>
        <span className={`filter-pill-description ${isActive ? 'filter-pill-description-active' : ''}`}>
          {displayText}
        </span>
        <Icon name="chevron-down" size="sm" variant="outline" className="filter-pill-chevron" />
      </button>
      <Dropdown
        isOpen={isOpen}
        onClose={onClose}
        options={options}
        selectedValue={selectedValue}
        onSelect={handleSelect}
        position={position}
        align={align}
      />
    </div>
  );
};

export default FilterPill;

