import { useState, useRef } from 'react';
import { DatePickerDropdown } from './DatePickerDropdown';
import './DocumentTitle.css';

export const DocumentTitle = ({
  title,
  documentNumber,
  date,
  onDateChange,
  showDatePicker: controlledShowDatePicker,
  onDatePickerToggle,
  className = ''
}) => {
  const [internalShowDatePicker, setInternalShowDatePicker] = useState(false);
  const dateRef = useRef(null);

  const showDatePicker = controlledShowDatePicker !== undefined 
    ? controlledShowDatePicker 
    : internalShowDatePicker;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateClick = () => {
    if (controlledShowDatePicker !== undefined && onDatePickerToggle) {
      onDatePickerToggle(!controlledShowDatePicker);
    } else if (controlledShowDatePicker === undefined) {
      setInternalShowDatePicker(!internalShowDatePicker);
    }
  };

  const handleDateChange = (newDate) => {
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const handleCloseDatePicker = () => {
    if (controlledShowDatePicker !== undefined && onDatePickerToggle) {
      onDatePickerToggle(false);
    } else if (controlledShowDatePicker === undefined) {
      setInternalShowDatePicker(false);
    }
  };

  const isDateEditable = onDateChange !== undefined;

  return (
    <div className={`document-title ${className}`}>
      <h1 className="document-title-text">{title}</h1>
      <div className="document-title-meta">
        <span className="document-title-number">{documentNumber}</span>
        {date && (
          <>
            <span className="document-title-separator">·</span>
            <span className="document-title-date-wrapper">
              {isDateEditable ? (
                <>
                  <span
                    ref={dateRef}
                    className="document-title-date"
                    onClick={handleDateClick}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && handleDateClick(e)}
                  >
                    {formatDate(date)}
                  </span>
                  <DatePickerDropdown
                    value={date}
                    onChange={handleDateChange}
                    onClose={handleCloseDatePicker}
                    isOpen={showDatePicker}
                  />
                </>
              ) : (
                <span className="document-title-date">
                  {formatDate(date)}
                </span>
              )}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

