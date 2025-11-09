import { useEffect, useRef } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { DocumentOverview } from './DocumentOverview';
import { TransportDocument } from './TransportDocument';
import { OfferDocument } from './OfferDocument';
import { FatturaDocument } from './FatturaDocument';
import './DocumentTypeSelectionModal.css';

export const DocumentTypeSelectionModal = ({
  isOpen,
  onClose,
  onSelectDocumentType
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const documentTypes = [
    {
      type: 'transport',
      title: 'Transport Document',
      description: 'Create a transport document for shipping and logistics',
      preview: (
        <DocumentOverview
          documentId="preview-transport"
          title="Transport Document"
          documentNumber="TD-2025-001"
          date="Preview"
          documentType="Transport"
          previewContent={<TransportDocument isEmpty={true} />}
        />
      )
    },
    {
      type: 'offer',
      title: 'Offer',
      description: 'Create an offer document with pricing and terms',
      preview: (
        <DocumentOverview
          documentId="preview-offer"
          title="Offer"
          documentNumber="OF-2025-001"
          date="Preview"
          documentType="Offer"
          previewContent={<OfferDocument isEmpty={true} />}
        />
      )
    },
    {
      type: 'fattura',
      title: 'Invoice',
      description: 'Create an invoice document for billing',
      preview: (
        <DocumentOverview
          documentId="preview-fattura"
          title="Invoice"
          documentNumber="FT-2025-001"
          date="Preview"
          documentType="Fattura"
          previewContent={<FatturaDocument isEmpty={true} />}
        />
      )
    }
  ];

  const handleSelect = (type) => {
    if (onSelectDocumentType) {
      onSelectDocumentType(type);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="document-type-modal-overlay">
      <div className="document-type-modal" ref={modalRef}>
        <div className="document-type-modal-header">
          <h2 className="document-type-modal-title">Create New Document</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>

        <div className="document-type-modal-content">
          <p className="document-type-modal-description">
            Select a document type to get started
          </p>
          <div className="document-type-grid">
            {documentTypes.map((docType) => (
              <button
                key={docType.type}
                className="document-type-card"
                onClick={() => handleSelect(docType.type)}
              >
                <div className="document-type-preview">
                  {docType.preview}
                </div>
                <div className="document-type-info">
                  <h3 className="document-type-card-title">{docType.title}</h3>
                  <p className="document-type-card-description">{docType.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

