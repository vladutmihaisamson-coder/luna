import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { TransportDocument } from '../components/TransportDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import { OfferDocument } from '../components/OfferDocument';
import { ShareModal } from '../components/ShareModal';
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

  // Determine document type from URL query parameter or documentId
  const getDocumentType = () => {
    const typeParam = searchParams.get('type');
    if (typeParam) return typeParam;
    if (documentId?.startsWith('fattura-')) return 'fattura';
    if (documentId?.startsWith('offer-')) return 'offer';
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
    if (window.__documentSave) {
      window.__documentSave();
    }
  };

  const handleRevert = () => {
    if (window.__documentRevert) {
      window.__documentRevert();
    }
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
              size="md"
              onClick={handleRevert}
              aria-label="Revert changes"
            />
            <IconButton
              icon="save"
              variant="primary"
              size="md"
              onClick={handleSave}
              aria-label="Save changes"
            />
            <div className="button-separator"></div>
          </>
        )}
        <IconButton
          icon="print"
          variant="default"
          size="md"
          onClick={handlePrint}
          aria-label="Print document"
        />
        <IconButton
          icon="download"
          variant="default"
          size="md"
          onClick={handleDownload}
          aria-label="Download document"
        />
        <IconButton
          icon="share"
          variant="default"
          size="md"
          onClick={() => setIsShareModalOpen(true)}
          aria-label="Share document"
        />
      </div>
      
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        documentTitle={`${documentType}-${documentId}`}
        documentUrl={window.location.href}
      />
      
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
      ) : (
        <TransportDocument 
          onHasChanges={setHasUnsavedChanges}
          onSave={handleSave}
          onRevert={handleRevert}
          isEmpty={isNewDocument}
        />
      )}
    </div>
  );
};

