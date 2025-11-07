import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TransportDocument } from '../components/TransportDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import html2pdf from 'html2pdf.js';
import './DocumentViewPage.css';

export const DocumentViewPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Determine document type from documentId
  const getDocumentType = () => {
    if (documentId?.startsWith('fattura-')) return 'fattura';
    if (documentId?.startsWith('offer-')) return 'offer';
    return 'transport';
  };

  const documentType = getDocumentType();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
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
  };

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
      <button 
        className="back-button" 
        onClick={handleBack}
        aria-label="Go back"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      
      <div className="action-buttons">
        {hasUnsavedChanges && (
          <>
            <button 
              className="action-button revert-button" 
              onClick={handleRevert}
              aria-label="Revert changes"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
            </button>
            <button 
              className="action-button save-button" 
              onClick={handleSave}
              aria-label="Save changes"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
            </button>
            <div className="button-separator"></div>
          </>
        )}
        <button 
          className="action-button" 
          onClick={handlePrint}
          aria-label="Print document"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>
        <button 
          className="action-button" 
          onClick={handleDownload}
          aria-label="Download document"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
      </div>
      
      {documentType === 'fattura' ? (
        <FatturaDocument 
          onHasChanges={setHasUnsavedChanges}
          onSave={handleSave}
          onRevert={handleRevert}
        />
      ) : (
        <TransportDocument 
          onHasChanges={setHasUnsavedChanges}
          onSave={handleSave}
          onRevert={handleRevert}
        />
      )}
    </div>
  );
};

