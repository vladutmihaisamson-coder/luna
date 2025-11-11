import { useNavigate } from 'react-router-dom';
import { DocumentPreviewSimplified } from './DocumentPreviewSimplified';
import './DocumentOverview.css';

export const DocumentOverview = ({ documentId, title, previewContent, documentNumber, date, documentType, total, currencySymbol = '€', isSelected, onSelect, searchQuery, content, itemCount, direction, needsAttention, signatureStatus, lastModified, isEditable }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    // Don't navigate if clicking on the checkbox
    if (e.target.closest('.document-checkbox-wrapper')) {
      return;
    }
    navigate(`/document/${documentId}`);
  };

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(documentId, e.target.checked);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getDocumentTypeClass = () => {
    if (!documentType) return '';
    const normalizedType = documentType.toLowerCase();
    if (normalizedType.includes('transport')) return 'document-preview-transport';
    if (normalizedType.includes('offer')) return 'document-preview-offer';
    if (normalizedType.includes('fattura') || normalizedType.includes('invoice')) return 'document-preview-invoice';
    if (normalizedType.includes('agreement')) return 'document-preview-agreement';
    if (normalizedType.includes('purchase') || normalizedType.includes('order')) return 'document-preview-purchase-order';
    return '';
  };

  return (
    <div className="document-overview">
      <div 
        className={`document-preview ${getDocumentTypeClass()}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      >
        <div className="document-checkbox-wrapper">
          <input
            type="checkbox"
            className="document-checkbox"
            checked={isSelected || false}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${title}`}
          />
        </div>
        <div className="document-preview-content">
          <DocumentPreviewSimplified
            documentNumber={documentNumber}
            date={date}
            documentType={documentType}
            title={title}
            total={total}
            currencySymbol={currencySymbol}
            itemCount={itemCount}
            direction={direction}
            content={content}
            signatureStatus={signatureStatus}
            lastModified={lastModified}
            isEditable={isEditable}
          />
        </div>
      </div>
    </div>
  );
};

