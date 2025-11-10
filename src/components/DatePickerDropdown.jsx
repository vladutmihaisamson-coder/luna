import { useState, useRef, useEffect } from 'react';
import { Icon } from './design-system/atoms/Icon/Icon';
import './DatePickerDropdown.css';

export const DatePickerDropdown = ({ value, onChange, onClose, isOpen }) => {
  const dropdownRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const date = new Date(value);
      return { year: date.getFullYear(), month: date.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setCurrentDate({ year: date.getFullYear(), month: date.getMonth() });
    }
  }, [value]);

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

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate.year, currentDate.month, day);
    setSelectedDate(newDate);
    const dateString = newDate.toISOString().split('T')[0];
    onChange(dateString);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  const handlePrevYear = () => {
    setCurrentDate(prev => ({ ...prev, year: prev.year - 1 }));
  };

  const handleNextYear = () => {
    setCurrentDate(prev => ({ ...prev, year: prev.year + 1 }));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentDate.year, currentDate.month);
  const firstDay = getFirstDayOfMonth(currentDate.year, currentDate.month);
  const days = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.month === today.getMonth() &&
      currentDate.year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.month === selectedDate.getMonth() &&
      currentDate.year === selectedDate.getFullYear()
    );
  };

  return (
    <div ref={dropdownRef} className="date-picker-dropdown-component">
      <div className="date-picker-header">
        <div className="date-picker-nav">
          <button
            type="button"
            className="date-picker-nav-button"
            onClick={handlePrevYear}
            aria-label="Previous year"
          >
            <Icon name="chevron-left" size="sm" variant="outline" />
            <Icon name="chevron-left" size="sm" variant="outline" style={{ marginLeft: '-8px' }} />
          </button>
          <button
            type="button"
            className="date-picker-nav-button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <Icon name="chevron-left" size="sm" variant="outline" />
          </button>
        </div>
        <div className="date-picker-month-year">
          <span className="date-picker-month">{monthNames[currentDate.month]}</span>
          <span className="date-picker-year">{currentDate.year}</span>
        </div>
        <div className="date-picker-nav">
          <button
            type="button"
            className="date-picker-nav-button"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <Icon name="chevron-right" size="sm" variant="outline" />
          </button>
          <button
            type="button"
            className="date-picker-nav-button"
            onClick={handleNextYear}
            aria-label="Next year"
          >
            <Icon name="chevron-right" size="sm" variant="outline" />
            <Icon name="chevron-right" size="sm" variant="outline" style={{ marginLeft: '-8px' }} />
          </button>
        </div>
      </div>
      <div className="date-picker-weekdays">
        {dayNames.map(day => (
          <div key={day} className="date-picker-weekday">{day}</div>
        ))}
      </div>
      <div className="date-picker-days">
        {days.map((day, index) => (
          <button
            key={index}
            type="button"
            className={`date-picker-day ${
              !day ? 'date-picker-day-empty' : ''
            } ${
              isToday(day) ? 'date-picker-day-today' : ''
            } ${
              isSelected(day) ? 'date-picker-day-selected' : ''
            }`}
            onClick={() => day && handleDateSelect(day)}
            disabled={!day}
            aria-label={day ? `Select ${monthNames[currentDate.month]} ${day}, ${currentDate.year}` : ''}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};
