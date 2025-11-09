import React, { useState, useEffect, useRef } from 'react';
import './Document.css';

// A4 dimensions in millimeters
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Calculate real-life size based on screen DPI
const calculateRealSize = (widthMM, heightMM) => {
  // Create a test element to measure actual DPI
  const testDiv = document.createElement('div');
  testDiv.style.width = '1in';
  testDiv.style.height = '1in';
  testDiv.style.position = 'absolute';
  testDiv.style.visibility = 'hidden';
  document.body.appendChild(testDiv);
  
  const pixelsPerInch = testDiv.offsetWidth; // Should be close to screen DPI
  document.body.removeChild(testDiv);
  
  // Convert mm to inches (1 inch = 25.4mm)
  const widthInches = widthMM / 25.4;
  const heightInches = heightMM / 25.4;
  
  // Calculate pixel dimensions
  const widthPx = widthInches * pixelsPerInch;
  const heightPx = heightInches * pixelsPerInch;
  
  return { width: widthPx, height: heightPx };
};

export const Document = ({
  children,
  className = '',
  orientation = 'portrait', // 'portrait' | 'landscape'
  size = 'a4', // 'a4' | 'a3' | 'letter' | 'custom'
  customWidth,
  customHeight,
  padding = true,
  logo,
  ...props
}) => {
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const documentRef = useRef(null);

  useEffect(() => {
    if (size === 'a4') {
      const { width, height } = calculateRealSize(
        orientation === 'portrait' ? A4_WIDTH_MM : A4_HEIGHT_MM,
        orientation === 'portrait' ? A4_HEIGHT_MM : A4_WIDTH_MM
      );
      setDimensions({ width, height });
    } else if (size === 'custom') {
      setDimensions({ width: customWidth, height: customHeight });
    }
  }, [size, orientation, customWidth, customHeight]);

  const documentClasses = [
    'document',
    `document-${size}`,
    `document-${orientation}`,
    padding ? 'document-padding' : '',
    className
  ].filter(Boolean).join(' ');

  const style = {};
  if (dimensions.width) {
    style.width = `${dimensions.width}px`;
  }
  if (dimensions.height) {
    style.height = `${dimensions.height}px`;
  }

  return (
    <div 
      ref={documentRef}
      className={documentClasses}
      style={style}
      {...props}
    >
      <div className="document-content">
        {logo && (
          <div className="document-logo">
            <img src={logo} alt="Company logo" className="document-logo-image" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

