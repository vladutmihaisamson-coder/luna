import { Badge } from './ui/Badge';
import './DocumentTag.css';

/**
 * DocumentTag Component
 * 
 * A standardized tag component for document thumbnails.
 * All tags have the same styling: white background with stroke.
 * 
 * @param {Object} props
 * @param {string} props.children - Tag text content
 * @param {string} props.documentType - Document type (Transport, Offer, Fattura)
 * @param {string} props.className - Additional CSS classes
 */
export const DocumentTag = ({ 
  children, 
  documentType,
  className = '',
  ...props 
}) => {
  // Map display text - show "Invoice" instead of "Fattura"
  const getDisplayText = (text) => {
    const normalizedText = text?.toLowerCase() || '';
    if (normalizedText.includes('fattura')) {
      return 'Invoice';
    }
    return text;
  };

  const displayText = getDisplayText(children);

  // Get document type class for color styling
  const getDocumentTypeClass = () => {
    if (!documentType) return '';
    const normalizedType = documentType.toLowerCase();
    if (normalizedType.includes('transport')) return 'document-tag-transport';
    if (normalizedType.includes('offer')) return 'document-tag-offer';
    if (normalizedType.includes('fattura') || normalizedType.includes('invoice')) return 'document-tag-invoice';
    if (normalizedType.includes('agreement')) return 'document-tag-agreement';
    if (normalizedType.includes('purchase') || normalizedType.includes('order')) return 'document-tag-purchase-order';
    return '';
  };

  return (
    <div className={`document-tag ${getDocumentTypeClass()} ${className}`} {...props}>
      <Badge variant="outline" size="sm">
        <span className="document-tag-text">{displayText}</span>
      </Badge>
    </div>
  );
};

export default DocumentTag;

