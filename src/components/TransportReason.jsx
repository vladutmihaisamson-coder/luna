import { useState } from 'react';
import './TransportReason.css';

export const TransportReason = ({ value, onChange, isEmpty = false }) => {
  const [reason, setReason] = useState(value || (isEmpty ? '' : 'conto-vendita'));

  const handleChange = (newValue) => {
    setReason(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const reasonOptions = [
    { value: '', label: 'Select reason...' },
    { value: 'conto-vendita', label: 'On sale (Consignment for sale)' },
    { value: 'sale', label: 'Sale' },
    { value: 'return', label: 'Return' },
    { value: 'repair', label: 'Repair' },
    { value: 'loan', label: 'Loan' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="transport-reason-row">
      <div className="transport-reason-cell transport-reason-label-cell">
        <span className="transport-reason-label">Reason for transport:</span>
      </div>
      <div className="transport-reason-cell transport-reason-select-cell">
        <div className="transport-reason-select-wrapper">
          <select
            className="transport-reason-select"
            value={reason}
            onChange={(e) => handleChange(e.target.value)}
          >
            {reasonOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

