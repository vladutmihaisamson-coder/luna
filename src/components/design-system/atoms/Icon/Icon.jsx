import React from 'react';
import './Icon.css';

// Import icons with error handling - using only verified icons
// Feather Icons (outline) - verified to exist
import { 
  FiPlus, 
  FiMinus, 
  FiTrash2, 
  FiRotateCcw, 
  FiFilter,
  FiChevronDown,
  FiChevronLeft,
  FiX
} from 'react-icons/fi';

// Material Design Icons (filled) - verified to exist
import { 
  MdAdd,
  MdRemove,
  MdDelete,
  MdRefresh,
  MdFilterList,
  MdDragHandle,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdClose
} from 'react-icons/md';

// Bootstrap Icons (for drag handle filled) - verified to exist
import { 
  BsGripVertical
} from 'react-icons/bs';

// Map of icon names to icon components (outline and filled)
// All icons have been verified to exist in react-icons
const iconMap = {
  plus: {
    outline: FiPlus,
    filled: MdAdd,
  },
  minus: {
    outline: FiMinus,
    filled: MdRemove,
  },
  delete: {
    outline: FiTrash2,
    filled: MdDelete,
  },
  reset: {
    outline: FiRotateCcw,
    filled: MdRefresh,
  },
  drag: {
    outline: MdDragHandle, // Material Design drag handle for outline
    filled: BsGripVertical, // Bootstrap grip for filled
  },
  filter: {
    outline: FiFilter,
    filled: MdFilterList,
  },
  'chevron-down': {
    outline: FiChevronDown,
    filled: MdKeyboardArrowDown,
  },
  'chevron-left': {
    outline: FiChevronLeft,
    filled: MdKeyboardArrowLeft,
  },
  x: {
    outline: FiX,
    filled: MdClose,
  },
};

export const Icon = ({ 
  name, 
  size = 'md', 
  color,
  variant = 'filled', // Default to 'filled', can also use 'outline'
  className = '',
  ...props 
}) => {
  const iconVariants = iconMap[name];
  
  if (!iconVariants) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(iconMap).join(', ')}`);
    return null;
  }

  const IconComponent = iconVariants[variant] || iconVariants.filled || iconVariants.outline;

  if (!IconComponent) {
    console.warn(`Icon variant "${variant}" not found for "${name}". Using filled variant.`);
    return null;
  }

  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
  }[size] || 16;

  // If no color is provided, let CSS handle it via the .icon class
  // Otherwise, use the provided color
  const iconColor = color;

  return (
    <IconComponent
      className={`icon icon-${name} icon-${variant} ${className}`}
      size={iconSize}
      color={iconColor}
      style={iconColor ? { color: iconColor } : undefined}
      {...props}
    />
  );
};
