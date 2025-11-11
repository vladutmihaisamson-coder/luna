import { useNavigate } from 'react-router-dom';
import { ClientPreviewSimplified } from './ClientPreviewSimplified';
import './ClientOverview.css';

export const ClientOverview = ({ clientId, clientName, documentCount, totalValue, currencySymbol = '€', lastDocumentDate, documentTypes, address, phone, email, isSelected, onSelect }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Don't navigate if clicking on the checkbox
    if (e.target.closest('.client-checkbox-wrapper')) {
      return;
    }
    navigate(`/client/${clientId}`);
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(clientId, e.target.checked);
    }
  };

  return (
    <div className="client-overview">
      <div 
        className="client-preview"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      >
        <div className="client-checkbox-wrapper">
          <input
            type="checkbox"
            className="client-checkbox"
            checked={isSelected || false}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${clientName}`}
          />
        </div>
        <div className="client-preview-content">
          <ClientPreviewSimplified
            clientName={clientName}
            clientId={clientId}
            documentCount={documentCount}
            totalValue={totalValue}
            currencySymbol={currencySymbol}
            lastDocumentDate={lastDocumentDate}
            documentTypes={documentTypes}
            address={address}
            phone={phone}
            email={email}
          />
        </div>
      </div>
    </div>
  );
};

