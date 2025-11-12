import React from 'react';
import { DocumentTag } from './DocumentTag';
import './DocumentPreviewSimplified.css';

export const DocumentPreviewSimplified = ({ 
  documentNumber, 
  date, 
  documentType,
  title,
  total,
  currencySymbol = '€',
  itemCount,
  direction,
  content,
  signatureStatus,
  lastModified,
  isEditable,
  country
}) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="document-preview-simplified">
      {documentType && (
        <div className="document-preview-simplified-tag-wrapper">
          <div className="document-preview-simplified-tag">
            <DocumentTag documentType={documentType}>
              {documentType}
            </DocumentTag>
          </div>
        </div>
      )}
      
      <div className="document-preview-simplified-header">
        <div className="document-preview-simplified-number">{documentNumber}</div>
        <div className="document-preview-simplified-date">{date}</div>
      </div>
      
      {title && (
        <div className="document-preview-simplified-title">{title}</div>
      )}
      
      {country && (
        <div className="document-preview-simplified-country">
          <span className="document-preview-simplified-label">Country:</span>
          <span className="document-preview-simplified-value">{country}</span>
        </div>
      )}
      
      {itemCount !== undefined && itemCount !== null && (
        <div className="document-preview-simplified-info">
          <span className="document-preview-simplified-label">Items:</span>
          <span className="document-preview-simplified-value">{itemCount}</span>
        </div>
      )}
      
      {(documentType === 'Offer' || documentType === 'Fattura') && total !== undefined && total !== null && (
        <div className="document-preview-simplified-total">
          <span className="document-preview-simplified-label">Total:</span>
          <span className="document-preview-simplified-value">{currencySymbol}{formatCurrency(total)}</span>
        </div>
      )}
      
      {content && (
        <div className="document-preview-simplified-content">
          {content.length > 60 ? `${content.substring(0, 60)}...` : content}
        </div>
      )}
      
      <div className="document-preview-simplified-metadata">
        {signatureStatus && (
          <div className="document-preview-simplified-signature">
            <span className="document-preview-simplified-label">Signature:</span>
            <span className={`document-preview-simplified-signature-status signature-${signatureStatus.toLowerCase().replace(/\s+/g, '-')}`}>
              {signatureStatus}
            </span>
          </div>
        )}
        <div className="document-preview-simplified-modified">
          <span className="document-preview-simplified-label">Last changed:</span>
          <span className="document-preview-simplified-value">{lastModified || date}</span>
        </div>
        {isEditable === false && (
          <div className="document-preview-simplified-locked">
            <span className="document-preview-simplified-label">Status:</span>
            <span className="document-preview-simplified-value">Locked</span>
          </div>
        )}
      </div>
    </div>
  );
};

