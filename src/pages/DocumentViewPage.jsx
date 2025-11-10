import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { TransportDocument } from '../components/TransportDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import { OfferDocument } from '../components/OfferDocument';
import { AgreementDocument } from '../components/AgreementDocument';
import { PurchaseOrderDocument } from '../components/PurchaseOrderDocument';
import { ShareModal } from '../components/ShareModal';
import { SaveWarningModal } from '../components/SaveWarningModal';
import { IconButton } from '../components/design-system/molecules/IconButton/IconButton';
import { Button } from '../components/design-system/atoms/Button/Button';
import html2pdf from 'html2pdf.js';
import './DocumentViewPage.css';

export const DocumentViewPage = () => {
  const { documentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaveWarningModalOpen, setIsSaveWarningModalOpen] = useState(false);

  // Determine document type from URL query parameter or documentId
  const getDocumentType = () => {
    const typeParam = searchParams.get('type');
    if (typeParam) return typeParam;
    if (documentId?.startsWith('fattura-')) return 'fattura';
    if (documentId?.startsWith('offer-')) return 'offer';
    if (documentId?.startsWith('agreement-')) return 'agreement';
    if (documentId?.startsWith('po-') || documentId?.startsWith('purchase-order-')) return 'purchase-order';
    return 'transport';
  };

  const documentType = getDocumentType();
  const isNewDocument = documentId?.includes('-new-');

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = useCallback(() => {
    const element = document.querySelector('.document-pages') || document.querySelector('.fattura-document');
    if (!element) return;

    const filename = `${documentType}-${documentId}.pdf`;

    const opt = {
      margin: 0,
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save();
  }, [documentType, documentId]);

  // Listen for download event from ShareModal
  useEffect(() => {
    const handleDownloadEvent = () => {
      handleDownload();
    };
    window.addEventListener('downloadDocument', handleDownloadEvent);
    return () => {
      window.removeEventListener('downloadDocument', handleDownloadEvent);
    };
  }, [handleDownload]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmed) return;
    }
    navigate(-1);
  };

  const handleSave = () => {
    // If it's a new document, save directly
    if (isNewDocument) {
      if (window.__documentSave) {
        window.__documentSave();
      }
    } else {
      // For existing documents, show warning modal
      setIsSaveWarningModalOpen(true);
    }
  };

  const handleConfirmSave = () => {
    if (window.__documentSave) {
      window.__documentSave();
    }
  };

  const handleRevert = () => {
    if (window.__documentRevert) {
      window.__documentRevert();
    }
  };

  // Mock file details - in a real app, this would come from an API
  const fileDetails = {
    createdBy: 'John Doe',
    createdAt: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    size: '2.4 MB',
    lastModified: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    history: [
      { action: 'Created', by: 'John Doe', date: new Date().toLocaleDateString() },
      { action: 'Modified', by: 'Jane Smith', date: new Date(Date.now() - 86400000).toLocaleDateString() },
      { action: 'Viewed', by: 'John Doe', date: new Date(Date.now() - 172800000).toLocaleDateString() },
    ]
  };

  return (
    <div className="document-view-page">
      <BackButton onClick={handleBack} />
      
      <div className="action-buttons">
        {hasUnsavedChanges && (
          <>
            <IconButton
              icon="reset"
              variant="default"
              size="lg"
              onClick={handleRevert}
              aria-label="Revert changes"
            />
            <IconButton
              icon="save"
              variant="primary"
              size="lg"
              onClick={handleSave}
              aria-label="Save changes"
            />
            <div className="button-separator"></div>
          </>
        )}
        <IconButton
          icon="print"
          variant="default"
          size="lg"
          onClick={handlePrint}
          aria-label="Print document"
        />
        <IconButton
          icon="download"
          variant="default"
          size="lg"
          onClick={handleDownload}
          aria-label="Download document"
        />
        <IconButton
          icon="share"
          variant="default"
          size="lg"
          onClick={() => setIsShareModalOpen(true)}
          aria-label="Share document"
        />
      </div>
      
      <div className="document-view-content">
        <div className="document-view-main">
          {documentType === 'fattura' ? (
            <FatturaDocument 
              onHasChanges={setHasUnsavedChanges}
              onSave={handleSave}
              onRevert={handleRevert}
              isEmpty={isNewDocument}
            />
          ) : documentType === 'offer' ? (
            <OfferDocument 
              onHasChanges={setHasUnsavedChanges}
              onSave={handleSave}
              onRevert={handleRevert}
              isEmpty={isNewDocument}
            />
          ) : documentType === 'agreement' ? (
            <AgreementDocument 
              onHasChanges={setHasUnsavedChanges}
              onSave={handleSave}
              onRevert={handleRevert}
              isEmpty={isNewDocument}
            />
          ) : documentType === 'purchase-order' ? (
            <PurchaseOrderDocument 
              onHasChanges={setHasUnsavedChanges}
              onSave={handleSave}
              onRevert={handleRevert}
              isEmpty={isNewDocument}
            />
          ) : (
            <TransportDocument 
              onHasChanges={setHasUnsavedChanges}
              onSave={handleSave}
              onRevert={handleRevert}
              isEmpty={isNewDocument}
            />
          )}
        </div>
        
        <div className="document-view-sidebar">
          <div className="file-details-section">
            <h3 className="file-details-title">File Details</h3>
            <div className="file-details-item">
              <span className="file-details-label">Created by</span>
              <span className="file-details-value">{fileDetails.createdBy}</span>
            </div>
            <div className="file-details-item">
              <span className="file-details-label">Created at</span>
              <span className="file-details-value">{fileDetails.createdAt}</span>
            </div>
            <div className="file-details-item">
              <span className="file-details-label">Size</span>
              <span className="file-details-value">{fileDetails.size}</span>
            </div>
            <div className="file-details-item">
              <span className="file-details-label">Last modified</span>
              <span className="file-details-value">{fileDetails.lastModified}</span>
            </div>
          </div>
          
          <div className="file-history-section">
            <h3 className="file-details-title">History</h3>
            <div className="file-history-list">
              {fileDetails.history.map((entry, index) => (
                <div key={index} className="file-history-item">
                  <div className="file-history-content">
                    <div className="file-history-action">{entry.action}</div>
                    <div className="file-history-meta">
                      <span className="file-history-by">{entry.by}</span>
                      <span className="file-history-date">{entry.date}</span>
                    </div>
                  </div>
                  <a href="#" className="file-history-view-link" onClick={(e) => {
                    e.preventDefault();
                    // TODO: Implement view version functionality
                    console.log('View version:', index);
                  }}>
                    View version
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentTitle={`${documentType}-${documentId}`}
        documentUrl={window.location.href}
      />
      
      <SaveWarningModal
        isOpen={isSaveWarningModalOpen}
        onClose={() => setIsSaveWarningModalOpen(false)}
        onConfirm={handleConfirmSave}
        documentTitle={`${documentType}-${documentId}`}
      />
    </div>
  );
};

