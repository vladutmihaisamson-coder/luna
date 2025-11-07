import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/Badge';
import './DocumentOverview.css';

export const DocumentOverview = ({ documentId, title, previewContent, documentNumber, date, documentType }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/document/${documentId}`);
  };

  return (
    <div className="document-overview">
      <div 
        className="document-preview" 
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <div className="document-preview-content">
          {previewContent}
        </div>
        {documentType && (
          <div className="document-type-tag" data-type={documentType?.toLowerCase()}>
            <Badge variant="solid" size="sm">
              {documentType}
            </Badge>
          </div>
        )}
      </div>
      <div className="document-info">
        <h3 className="document-title">{title}</h3>
        <div className="document-metadata">
          <span className="document-id">{documentNumber}</span>
          <span className="metadata-separator">·</span>
          <span className="document-date">{date}</span>
        </div>
      </div>
    </div>
  );
};

