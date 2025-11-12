import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { ClientPreviewSimplified } from './ClientPreviewSimplified';
import { Button } from './design-system/atoms/Button/Button';
import { Icon } from './design-system/atoms/Icon/Icon';
import './ClientOverview.css';

export const ClientOverview = ({ clientId, clientName, documentCount, totalValue, currencySymbol = '€', lastDocumentDate, documentTypes, address, phone, email, isSelected, onSelect, onCreateDocument }) => {
  const navigate = useNavigate();

  const handleClick = useCallback((e) => {
    // Don't navigate if clicking on the checkbox or create document button
    if (e.target.closest('.client-checkbox-wrapper') || e.target.closest('.client-create-document-button-wrapper')) {
      return;
    }
    if (!clientId) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    navigate(`/client/${clientId}`);
  }, [clientId, navigate]);

  const handleCheckboxChange = useCallback((e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(clientId, e.target.checked);
    }
  }, [clientId, onSelect]);

  const handleCreateDocument = (e) => {
    e.stopPropagation();
    if (onCreateDocument) {
      onCreateDocument();
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
        <div className="client-create-document-button-wrapper">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCreateDocument}
            className="client-create-document-button"
            aria-label="Create document for this client"
          >
            <Icon name="plus" size="sm" variant="outline" />
            <span>Create Document</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

