import { useNavigate } from 'react-router-dom';
import { DocumentTag } from './DocumentTag';
import { highlightText } from '../utils/textHighlight';
import './DocumentOverview.css';

export const DocumentOverview = ({ documentId, title, previewContent, documentNumber, date, documentType, total, currencySymbol = '€', isSelected, onSelect, searchQuery, content }) => {
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

  return (
    <div className="document-overview">
      <div 
        className="document-preview" 
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
          {previewContent}
        </div>
        {documentType && (
          <DocumentTag documentType={documentType}>
            {documentType}
          </DocumentTag>
        )}
      </div>
      <div className="document-info">
        <h3 className="document-title">
          {searchQuery && title ? highlightText(String(title), searchQuery) : title}
        </h3>
        <div className="document-metadata">
          <span className="document-id">
            {searchQuery && documentNumber ? highlightText(String(documentNumber), searchQuery) : documentNumber}
          </span>
          <span className="metadata-separator">·</span>
          <span className="document-date">{date}</span>
        </div>
        {content && searchQuery && (
          <div className="document-content-preview">
            {highlightText(String(content), searchQuery)}
          </div>
        )}
        {total !== undefined && total !== null && (
          <div className="document-total">
            {currencySymbol}{formatCurrency(total)}
          </div>
        )}
      </div>
    </div>
  );
};

