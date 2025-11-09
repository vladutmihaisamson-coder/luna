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

  return (
    <div className={`document-tag ${className}`} {...props}>
      <Badge variant="outline" size="sm">
        <span className="document-tag-text">{displayText}</span>
      </Badge>
    </div>
  );
};

export default DocumentTag;

