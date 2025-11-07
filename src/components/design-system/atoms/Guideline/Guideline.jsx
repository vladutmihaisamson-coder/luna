import React from 'react';
import './Guideline.css';

export const Guideline = ({
  orientation = 'horizontal', // 'horizontal' or 'vertical'
  position = 0,
  onDragStart,
  onDrag,
  onDragEnd,
  className = '',
  'data-guideline-id': guidelineId,
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';
  const rulerSize = 32; // Match --ruler-size
  const style = isHorizontal
    ? { 
        top: `${position + rulerSize}px`, 
        left: '0', 
        width: '100vw', 
        height: '1px',
        position: 'fixed'
      }
    : { 
        left: `${position + rulerSize}px`, 
        top: '0', 
        width: '1px', 
        height: '100vh',
        position: 'fixed'
      };

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDragStart) {
      onDragStart(e, position);
    }

    const handleMouseMove = (moveEvent) => {
      if (onDrag) {
        const newPosition = isHorizontal
          ? moveEvent.clientY
          : moveEvent.clientX;
        onDrag(moveEvent, newPosition);
      }
    };

    const handleMouseUp = (upEvent) => {
      if (onDragEnd) {
        const finalPosition = isHorizontal
          ? upEvent.clientY
          : upEvent.clientX;
        onDragEnd(upEvent, finalPosition);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`guideline guideline-${orientation} ${className}`}
      style={style}
      onMouseDown={handleMouseDown}
      data-guideline-id={guidelineId}
      {...props}
    >
      <div className="guideline-handle" />
      <div className="guideline-drag-area" />
    </div>
  );
};

