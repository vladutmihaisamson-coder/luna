import { useState, useEffect, useRef } from 'react';
import { Button } from './design-system/atoms/Button/Button';
import { Icon } from './design-system/atoms/Icon/Icon';
import './ScreenCalibration.css';

const CALIBRATION_BOX_SIZE_INCHES = 2; // 2-inch box for calibration

export const ScreenCalibration = ({ isOpen, onClose, onCalibrate }) => {
  const [measuredSize, setMeasuredSize] = useState('');
  const [error, setError] = useState('');
  const boxRef = useRef(null);

  useEffect(() => {
    if (isOpen && boxRef.current) {
      // Focus the input when modal opens
      const input = document.querySelector('.calibration-input');
      if (input) {
        setTimeout(() => input.focus(), 100);
      }
    }
  }, [isOpen]);

  const handleCalibrate = () => {
    const measured = parseFloat(measuredSize);
    
    if (isNaN(measured) || measured <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    if (measured < 1 || measured > 4) {
      setError('Please measure the box carefully. The measurement should be between 1 and 4 inches.');
      return;
    }

    if (!boxRef.current) {
      setError('Calibration box not found');
      return;
    }

    // Get the actual rendered width of the calibration box in pixels
    const boxWidthPx = boxRef.current.offsetWidth;
    
    // Calculate PPI: pixels per inch = boxWidthPx / measuredSizeInches
    const calculatedPPI = boxWidthPx / measured;
    
    // Store the calibrated PPI
    localStorage.setItem('calibratedPPI', calculatedPPI.toString());
    localStorage.setItem('calibrationDate', new Date().toISOString());
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('calibrationUpdated', { 
      detail: { ppi: calculatedPPI } 
    }));
    
    // Call the callback with the calibrated PPI
    if (onCalibrate) {
      onCalibrate(calculatedPPI);
    }
    
    // Close the modal
    if (onClose) {
      onClose();
    }
  };

  const handleSkip = () => {
    // Use default PPI (96) if skipped
    if (onCalibrate) {
      onCalibrate(96);
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="calibration-overlay">
      <div className="calibration-modal">
        <div className="calibration-header">
          <h2>Screen Calibration</h2>
          <button 
            className="calibration-close"
            onClick={onClose}
            aria-label="Close calibration"
          >
            <Icon name="x" size="md" variant="outline" />
          </button>
        </div>
        
        <div className="calibration-content">
          <p className="calibration-instructions">
            To display documents at their real-life size, we need to calibrate your screen.
          </p>
          
          <ol className="calibration-steps">
            <li>Get a ruler or measuring tape</li>
            <li>Measure the width of the red box below</li>
            <li>Enter the measurement in inches</li>
          </ol>

          <div className="calibration-box-container">
            <div 
              ref={boxRef}
              className="calibration-box"
              style={{
                width: `${CALIBRATION_BOX_SIZE_INCHES * 96}px`, // Start with 96 DPI assumption
                height: `${CALIBRATION_BOX_SIZE_INCHES * 96}px`
              }}
            >
              <span className="calibration-box-label">
                {CALIBRATION_BOX_SIZE_INCHES}"
              </span>
            </div>
          </div>

          <div className="calibration-input-group">
            <label htmlFor="calibration-input">
              Measured width (inches):
            </label>
            <div className="calibration-input-wrapper">
              <input
                id="calibration-input"
                className="calibration-input"
                type="number"
                step="0.1"
                min="1"
                max="4"
                value={measuredSize}
                onChange={(e) => {
                  setMeasuredSize(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCalibrate();
                  }
                }}
                placeholder="2.0"
              />
              <span className="calibration-input-unit">inches</span>
            </div>
            {error && <div className="calibration-error">{error}</div>}
          </div>

          <div className="calibration-actions">
            <Button
              variant="default"
              size="md"
              onClick={handleCalibrate}
            >
              Calibrate
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={handleSkip}
            >
              Skip (use default)
            </Button>
          </div>

          <p className="calibration-note">
            You can recalibrate anytime from the settings or by clearing your browser's local storage.
          </p>
        </div>
      </div>
    </div>
  );
};

