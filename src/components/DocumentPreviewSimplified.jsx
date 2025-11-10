import React from 'react';
import { DocumentTag } from './DocumentTag';
import { Icon } from './design-system/atoms/Icon/Icon';
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
  content
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
          {direction && (
            <div className="document-preview-simplified-direction-icon">
              <Icon 
                name={direction === 'in' ? 'inbox' : 'send'} 
                size="xs" 
                variant="outline"
              />
            </div>
          )}
        </div>
      )}
      
      <div className="document-preview-simplified-header">
        <div className="document-preview-simplified-number">{documentNumber}</div>
        <div className="document-preview-simplified-date">{date}</div>
      </div>
      
      {title && (
        <div className="document-preview-simplified-title">{title}</div>
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
      
      <div className="document-preview-simplified-footer">
        <div className="document-preview-simplified-line"></div>
        <div className="document-preview-simplified-line"></div>
      </div>
    </div>
  );
};

