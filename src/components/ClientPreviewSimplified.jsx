import React from 'react';
import './ClientPreviewSimplified.css';

export const ClientPreviewSimplified = ({ 
  clientName,
  clientId,
  documentCount,
  totalValue,
  currencySymbol = '€',
  lastDocumentDate,
  documentTypes,
  address,
  phone,
  email
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="client-preview-simplified">
      <div className="client-preview-simplified-header">
        <div className="client-preview-simplified-name">{clientName}</div>
        {clientId && (
          <div className="client-preview-simplified-id">{clientId}</div>
        )}
      </div>
      
      {documentCount !== undefined && documentCount !== null && (
        <div className="client-preview-simplified-info">
          <span className="client-preview-simplified-label">Documents:</span>
          <span className="client-preview-simplified-value">{documentCount}</span>
        </div>
      )}
      
      {totalValue !== undefined && totalValue !== null && (
        <div className="client-preview-simplified-total">
          <span className="client-preview-simplified-label">Total Value:</span>
          <span className="client-preview-simplified-value">{currencySymbol}{formatCurrency(totalValue)}</span>
        </div>
      )}
      
      {lastDocumentDate && (
        <div className="client-preview-simplified-date">
          <span className="client-preview-simplified-label">Last Document:</span>
          <span className="client-preview-simplified-value">{lastDocumentDate}</span>
        </div>
      )}
      
      <div className="client-preview-simplified-contact">
        <div className="client-preview-simplified-contact-item">
          <span className="client-preview-simplified-contact-label">Address:</span>
          <span className="client-preview-simplified-contact-value">{address || 'Not available'}</span>
        </div>
        {phone && (
          <div className="client-preview-simplified-contact-item">
            <span className="client-preview-simplified-contact-label">Phone:</span>
            <span className="client-preview-simplified-contact-value">{phone}</span>
          </div>
        )}
        {email && (
          <div className="client-preview-simplified-contact-item">
            <span className="client-preview-simplified-contact-label">Email:</span>
            <span className="client-preview-simplified-contact-value">{email}</span>
          </div>
        )}
      </div>
    </div>
  );
};

