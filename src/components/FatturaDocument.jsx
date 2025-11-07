import { useState, useMemo, useEffect } from 'react';
import { DatePickerDropdown } from './DatePickerDropdown';
import './FatturaDocument.css';

export const FatturaDocument = ({ onHasChanges, onSave, onRevert }) => {
  const initialDate = new Date().toISOString().split('T')[0];
  const [documentDate, setDocumentDate] = useState(initialDate);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return documentDate !== savedDate;
  }, [documentDate, savedDate]);

  // Notify parent component about changes
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanges);
    }
  }, [hasChanges, onHasChanges]);

  // Save changes
  const saveChanges = () => {
    setSavedDate(documentDate);
    if (onSave) onSave();
  };

  // Revert changes
  const revertChanges = () => {
    setDocumentDate(savedDate);
    if (onRevert) onRevert();
  };

  // Expose save and revert functions to parent
  useEffect(() => {
    window.__documentSave = saveChanges;
    window.__documentRevert = revertChanges;
    
    return () => {
      delete window.__documentSave;
      delete window.__documentRevert;
    };
  });

  return (
    <div className="fattura-document">
      <div className="document-header">
        <h1>FATTURA</h1>
        <div className="document-meta">
          <span className="document-number">FT-2025-001</span>
          <span className="document-meta-separator">·</span>
          <div className="document-date-wrapper">
            <span 
              className="document-date" 
              onClick={handleDateClick}
            >
              {formatDate(documentDate)}
            </span>
            {showDatePicker && (
              <DatePickerDropdown
                value={documentDate}
                onChange={handleDateChange}
                onClose={handleCloseDatePicker}
                isOpen={showDatePicker}
              />
            )}
          </div>
        </div>
      </div>
      <div className="document-section">
        <div className="party-info">
          <h3>From</h3>
          <p>Company Name</p>
          <p>Address Line 1</p>
          <p>City, Country</p>
        </div>
        <div className="party-info">
          <h3>To</h3>
          <p>Client Company</p>
          <p>Client Address</p>
          <p>Client City, Country</p>
        </div>
      </div>
      <div className="document-section">
        <table className="fattura-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>VAT</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Service A</td>
              <td>1</td>
              <td>€1,000.00</td>
              <td>22%</td>
              <td>€1,220.00</td>
            </tr>
            <tr>
              <td>Service B</td>
              <td>2</td>
              <td>€500.00</td>
              <td>22%</td>
              <td>€1,220.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="document-footer">
        <div className="totals">
          <div className="total-row">
            <span>Subtotal:</span>
            <span>€2,000.00</span>
          </div>
          <div className="total-row">
            <span>VAT (22%):</span>
            <span>€440.00</span>
          </div>
          <div className="total-row total-final">
            <span>Total:</span>
            <span>€2,440.00</span>
          </div>
        </div>
        <div className="signatures">
          <div className="signature-box">
            <p>Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

