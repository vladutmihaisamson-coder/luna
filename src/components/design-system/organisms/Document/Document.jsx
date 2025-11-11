import React, { useState, useEffect, useRef } from 'react';
import './Document.css';

// A4 dimensions in millimeters
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// Calculate real-life size based on screen DPI
// Apply zoom-out factor to make document appear smaller (about 2x zoom out)
const DOCUMENT_ZOOM_FACTOR = 0.5; // Scale down to 50% for better fit

// Standard web PPI (96 DPI)
const WEB_PPI = 96;

// Get calibrated PPI from localStorage, or use default detection
const getScreenPPI = (useWebPPI = false) => {
  // If useWebPPI is true, always use standard web PPI
  if (useWebPPI) {
    return WEB_PPI;
  }
  
  // Check for calibrated PPI first
  const calibratedPPI = localStorage.getItem('calibratedPPI');
  if (calibratedPPI) {
    const ppi = parseFloat(calibratedPPI);
    if (!isNaN(ppi) && ppi > 0) {
      return ppi;
    }
  }
  
  // Fallback: Create a test element to measure actual DPI
  const testDiv = document.createElement('div');
  testDiv.style.width = '1in';
  testDiv.style.height = '1in';
  testDiv.style.position = 'absolute';
  testDiv.style.visibility = 'hidden';
  document.body.appendChild(testDiv);
  
  const pixelsPerInch = testDiv.offsetWidth; // Should be close to screen DPI
  document.body.removeChild(testDiv);
  
  return pixelsPerInch;
};

const calculateRealSize = (widthMM, heightMM, useWebPPI = false) => {
  const pixelsPerInch = getScreenPPI(useWebPPI);
  
  // Convert mm to inches (1 inch = 25.4mm)
  const widthInches = widthMM / 25.4;
  const heightInches = heightMM / 25.4;
  
  // When using web PPI, use full A4 size (no zoom factor)
  // Otherwise, apply zoom-out factor for better fit on screen
  const zoomFactor = useWebPPI ? 1.0 : DOCUMENT_ZOOM_FACTOR;
  
  // Calculate pixel dimensions
  const widthPx = widthInches * pixelsPerInch * zoomFactor;
  const heightPx = heightInches * pixelsPerInch * zoomFactor;
  
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
  calibrationKey = 0, // Key to force recalculation when PPI changes
  useWebPPI = false, // If true, use standard web PPI (96) instead of calibrated PPI
  ...props
}) => {
  const [dimensions, setDimensions] = useState({ width: null, height: null });
  const documentRef = useRef(null);

  useEffect(() => {
    const recalculateDimensions = () => {
      if (size === 'a4') {
        const { width, height } = calculateRealSize(
          orientation === 'portrait' ? A4_WIDTH_MM : A4_HEIGHT_MM,
          orientation === 'portrait' ? A4_HEIGHT_MM : A4_WIDTH_MM,
          useWebPPI
        );
        // Ensure dimensions are valid numbers
        if (width && height && !isNaN(width) && !isNaN(height)) {
          setDimensions({ width, height });
        } else {
          console.warn('Invalid dimensions calculated:', { width, height });
        }
      } else if (size === 'custom') {
        setDimensions({ width: customWidth, height: customHeight });
      }
    };

    // Small delay to ensure DOM is ready for PPI calculation
    const timeoutId = setTimeout(() => {
      recalculateDimensions();
    }, 0);

    // Listen for storage changes (when calibration is updated)
    const handleStorageChange = (e) => {
      if (e.key === 'calibratedPPI') {
        recalculateDimensions();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom calibration event (for same-tab updates)
    const handleCalibrationEvent = () => {
      recalculateDimensions();
    };
    window.addEventListener('calibrationUpdated', handleCalibrationEvent);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('calibrationUpdated', handleCalibrationEvent);
    };
  }, [size, orientation, customWidth, customHeight, calibrationKey, useWebPPI]);

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
    style.minWidth = `${dimensions.width}px`;
    style.maxWidth = `${dimensions.width}px`; // Prevent width from exceeding calculated size
  }
  // Set fixed height to maintain A4 proportions and constrain content to one page
  // Content exceeding this will be handled by pagination logic in document components
  if (dimensions.height) {
    style.height = `${dimensions.height}px`;
    style.minHeight = `${dimensions.height}px`;
    style.maxHeight = `${dimensions.height}px`;
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

