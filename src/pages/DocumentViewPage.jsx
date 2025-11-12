import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { TransportDocument } from '../components/TransportDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import { OfferDocument } from '../components/OfferDocument';
import { AgreementDocument } from '../components/AgreementDocument';
import { PurchaseOrderDocument } from '../components/PurchaseOrderDocument';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import { ShareModal } from '../components/ShareModal';
import { SaveWarningModal } from '../components/SaveWarningModal';
import { DownloadModal } from '../components/DownloadModal';
import { IconButton } from '../components/design-system/molecules/IconButton/IconButton';
import { Icon } from '../components/design-system/atoms/Icon/Icon';
import { Button } from '../components/design-system/atoms/Button/Button';
import html2pdf from 'html2pdf.js';
import './DocumentViewPage.css';

export const DocumentViewPage = () => {
  const { documentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSaveWarningModalOpen, setIsSaveWarningModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isVersionPreviewOpen, setIsVersionPreviewOpen] = useState(false);
  const [previewVersionIndex, setPreviewVersionIndex] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);

  // Determine document type from URL query parameter or documentId
  const documentType = useMemo(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) return typeParam;
    if (documentId?.startsWith('fattura-')) return 'fattura';
    if (documentId?.startsWith('offer-')) return 'offer';
    if (documentId?.startsWith('agreement-')) return 'agreement';
    if (documentId?.startsWith('po-') || documentId?.startsWith('purchase-order-')) return 'purchase-order';
    return 'transport';
  }, [documentId, searchParams]);

  const isNewDocument = useMemo(() => documentId?.includes('-new-'), [documentId]);

  // Generate random related documents mapping
  const getRelatedDocuments = useMemo(() => {
    // All available documents with full data
    const allDocuments = [
      { documentId: "test-doc-001", documentNumber: "TEST-2025-001", documentType: "Transport", title: "TEST_CLIENT_QA_001", total: null, currencySymbol: "€", content: "Test document", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: "Nov 9, 2025", isEditable: true, country: null },
      { documentId: "offer-001", documentNumber: "OF-2025-001", documentType: "Offer", title: "SACME", total: 125000.00, currencySymbol: "€", content: "Hydraulic Powder Compaction Press", itemCount: null, direction: "out", needsAttention: true, signatureStatus: "Awaiting Signature", lastModified: "Nov 7, 2025", isEditable: true, country: null },
      { documentId: "fattura-001", documentNumber: "FT-2025-001", documentType: "Invoice", title: "Brembo S.p.A.", total: 87500.00, currencySymbol: "€", content: "Mechanical Press Rebuild Service", itemCount: null, direction: "out", needsAttention: true, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "transport-001", documentNumber: "TD-2025-001", documentType: "Transport", title: "Thyssenkrupp Materials", total: null, currencySymbol: "€", content: "Hydraulic Press HPC-300 Unit", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "agreement-001", documentNumber: "AG-2025-001", documentType: "Agreement", title: "Schaeffler Group", total: null, currencySymbol: "€", content: "Retrofitting agreement", itemCount: 6, direction: "out", needsAttention: true, signatureStatus: "Pending", lastModified: "Nov 4, 2025", isEditable: false, country: null },
      { documentId: "offer-002", documentNumber: "OF-2025-002", documentType: "Offer", title: "Industrial Press Systems", total: 95000.00, currencySymbol: "€", content: "Used mechanical powder compaction press", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "fattura-002", documentNumber: "FT-2025-002", documentType: "Invoice", title: "Compaction Equipment Inc.", total: 45000.00, currencySymbol: "€", content: "Press retrofitting service", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "transport-002", documentNumber: "TD-2025-002", documentType: "Transport", title: "Material Processing Corp.", total: null, currencySymbol: "€", content: "Shipment of new hydraulic compaction press", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "offer-003", documentNumber: "OF-2025-003", documentType: "Offer", title: "Precision Press Manufacturing", total: 65000.00, currencySymbol: "€", content: "Purchase offer for used hydraulic press", itemCount: null, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "fattura-003", documentNumber: "FT-2025-003", documentType: "Invoice", title: "Press Rebuild Services", total: 32000.00, currencySymbol: "€", content: "Invoice for press rebuild service", itemCount: null, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "transport-003", documentNumber: "TD-2025-003", documentType: "Transport", title: "Heavy Equipment Logistics", total: null, currencySymbol: "€", content: "Received shipment of used mechanical press", itemCount: null, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "agreement-002", documentNumber: "AG-2025-002", documentType: "Agreement", title: "Custom Press Solutions", total: null, currencySymbol: "€", content: "Construction agreement for custom hydraulic press", itemCount: 5, direction: "out", needsAttention: false, signatureStatus: "Signed", lastModified: "Oct 29, 2025", isEditable: false, country: null },
      { documentId: "offer-004", documentNumber: "OF-2025-004", documentType: "Offer", title: "Powder Processing Equipment", total: 78000.00, currencySymbol: "€", content: "Rebuilt mechanical press MPC-500", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "fattura-004", documentNumber: "FT-2025-004", documentType: "Invoice", title: "Compaction Systems Ltd.", total: 55000.00, currencySymbol: "€", content: "Retrofitting service invoice", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "transport-004", documentNumber: "TD-2025-004", documentType: "Transport", title: "Industrial Machinery Transport", total: null, currencySymbol: "€", content: "Delivery of retrofitted hydraulic press", itemCount: null, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "offer-005", documentNumber: "OF-2025-005", documentType: "Offer", title: "Press Equipment Suppliers", total: 42000.00, currencySymbol: "€", content: "Offer to purchase used mechanical press", itemCount: null, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "fattura-005", documentNumber: "FT-2025-005", documentType: "Invoice", title: "Equipment Restoration Services", total: 28000.00, currencySymbol: "€", content: "Received invoice for press inspection", itemCount: null, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "transport-005", documentNumber: "TD-2025-005", documentType: "Transport", title: "Specialized Cargo Services", total: null, currencySymbol: "€", content: "Received hydraulic press HPC-180", itemCount: null, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "agreement-003", documentNumber: "AG-2025-003", documentType: "Agreement", title: "Press Modernization Partners", total: null, currencySymbol: "€", content: "Service agreement for press modernization", itemCount: 7, direction: "out", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "po-001", documentNumber: "PO-2025-001", documentType: "Purchase Order", title: "Bosch Rexroth", total: null, currencySymbol: "€", content: "Programmable Logic Controller System", itemCount: 12, direction: "in", needsAttention: false, signatureStatus: "Signed", lastModified: "Nov 8, 2025", isEditable: false, country: null },
      { documentId: "po-002", documentNumber: "PO-2025-002", documentType: "Purchase Order", title: "Festo AG", total: null, currencySymbol: "€", content: "Servo Motor and Control System", itemCount: 15, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "po-003", documentNumber: "PO-2025-003", documentType: "Purchase Order", title: "Siemens Industry", total: null, currencySymbol: "€", content: "Siemens S7-1500 PLC System", itemCount: 10, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "po-004", documentNumber: "PO-2025-004", documentType: "Purchase Order", title: "ABB Automation", total: null, currencySymbol: "€", content: "ABB AC Drive and Control System", itemCount: 14, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
      { documentId: "po-005", documentNumber: "PO-2025-005", documentType: "Purchase Order", title: "Parker Hannifin", total: null, currencySymbol: "€", content: "Servo Controller and Motion Control", itemCount: 11, direction: "in", needsAttention: false, signatureStatus: null, lastModified: null, isEditable: null, country: null },
    ];

    // Create a deterministic but seemingly random mapping based on documentId hash
    const getHash = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    if (!documentId) return [];

    // Filter out current document
    const otherDocuments = allDocuments.filter(doc => doc.documentId !== documentId);
    
    // Use hash of documentId to deterministically select related documents
    const hash = getHash(documentId);
    const numRelated = 1 + (hash % 3); // 1-3 related documents
    
    const related = [];
    for (let i = 0; i < numRelated && i < otherDocuments.length; i++) {
      const index = (hash + i * 7) % otherDocuments.length;
      related.push(otherDocuments[index]);
    }

    return related;
  }, [documentId]);

  // Reset state when documentId or location changes
  useEffect(() => {
    setHasUnsavedChanges(false);
    setIsShareModalOpen(false);
    setIsSaveWarningModalOpen(false);
    setIsDownloadModalOpen(false);
  }, [documentId, location.pathname]);


  const handlePrint = () => {
    window.print();
  };

  // Function to clone document and remove interactive controls
  const getCleanDocumentContent = useCallback(() => {
    const element = document.querySelector('.document-pages') || document.querySelector('.fattura-document');
    if (!element) return null;

    // Clone the element deeply
    const clone = element.cloneNode(true);

    // Remove all interactive elements and controls
    const interactiveSelectors = [
      'button',
      'input',
      'select',
      'textarea',
      '[contenteditable="true"]',
      '.drag-handle',
      '.row-action-button',
      '.delete-button',
      '.add-row-button',
      '.div-table-add-row-button',
      '.div-table-add-row-container',
      '.unit-dropdown-controls',
      '.quantity-controls',
      '.unit-dropdown-button-wrapper',
      '.unit-dropdown',
      '[role="button"]',
      '.icon-button',
      '.button',
      'a[href="#"]',
      '.table-header-cell-delete'
    ];

    interactiveSelectors.forEach(selector => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach(el => {
        el.remove();
      });
    });

    // Replace editable cells with their text content
    clone.querySelectorAll('.editable-text-cell, .editable-cell').forEach(cell => {
      const text = cell.textContent || cell.innerText || '';
      const span = document.createElement('span');
      span.textContent = text;
      // Preserve styling classes but remove editable class
      span.className = cell.className.replace('editable-text-cell', '').replace('editable-cell', '').trim();
      cell.parentNode?.replaceChild(span, cell);
    });

    // Replace input fields with their values displayed as text
    clone.querySelectorAll('input[type="text"], input[type="number"]').forEach(input => {
      const span = document.createElement('span');
      span.textContent = input.value || input.placeholder || '';
      span.style.display = 'inline-block';
      input.parentNode?.replaceChild(span, input);
    });

    // Replace select/dropdown with selected text
    clone.querySelectorAll('select').forEach(select => {
      const span = document.createElement('span');
      const selectedOption = select.options[select.selectedIndex];
      span.textContent = selectedOption ? selectedOption.text : '';
      span.style.display = 'inline-block';
      select.parentNode?.replaceChild(span, select);
    });

    // Remove quantity and unit controls, keep only the display values
    clone.querySelectorAll('.quantity-cell, .unit-cell').forEach(cell => {
      // Find the input/select and replace with its value
      const input = cell.querySelector('input');
      const select = cell.querySelector('select');
      if (input) {
        const span = document.createElement('span');
        span.textContent = input.value || '';
        span.style.display = 'inline-block';
        cell.innerHTML = '';
        cell.appendChild(span);
      } else if (select) {
        const span = document.createElement('span');
        const selectedOption = select.options[select.selectedIndex];
        span.textContent = selectedOption ? selectedOption.text : '';
        span.style.display = 'inline-block';
        cell.innerHTML = '';
        cell.appendChild(span);
      }
    });

    // Remove all interactive attributes from remaining elements
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('onclick');
      el.removeAttribute('onchange');
      el.removeAttribute('oninput');
      el.removeAttribute('tabindex');
      el.removeAttribute('contenteditable');
      if (el.getAttribute('role') === 'button') {
        el.removeAttribute('role');
      }
      el.style.cursor = 'default';
      el.style.pointerEvents = 'none';
    });

    return clone;
  }, []);

  const handleDownload = useCallback((format = 'pdf') => {
    const element = document.querySelector('.document-pages') || document.querySelector('.fattura-document');
    if (!element) return;

    const baseFilename = `${documentType}-${documentId}`;

    switch (format) {
      case 'pdf':
        const opt = {
          margin: 0,
          filename: `${baseFilename}.pdf`,
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
        break;

      case 'html': {
        const cleanClone = getCleanDocumentContent();
        if (!cleanClone) return;

        // Get all stylesheets
        const allStyles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .filter(Boolean)
          .join('\n');

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${baseFilename}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Source Sans 3', Arial, sans-serif;
      background: #fafafa;
    }
    ${allStyles}
  </style>
</head>
<body>
  ${cleanClone.outerHTML}
</body>
</html>`;

        const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
        const htmlUrl = URL.createObjectURL(htmlBlob);
        const htmlLink = document.createElement('a');
        htmlLink.href = htmlUrl;
        htmlLink.download = `${baseFilename}.html`;
        document.body.appendChild(htmlLink);
        htmlLink.click();
        document.body.removeChild(htmlLink);
        URL.revokeObjectURL(htmlUrl);
        break;
      }

      case 'text':
        const textContent = element.innerText || element.textContent;
        const textBlob = new Blob([textContent], { type: 'text/plain' });
        const textUrl = URL.createObjectURL(textBlob);
        const textLink = document.createElement('a');
        textLink.href = textUrl;
        textLink.download = `${baseFilename}.txt`;
        document.body.appendChild(textLink);
        textLink.click();
        document.body.removeChild(textLink);
        URL.revokeObjectURL(textUrl);
        break;

      case 'word': {
        const cleanClone = getCleanDocumentContent();
        if (!cleanClone) return;

        // Get all stylesheets for Word
        const allStyles = Array.from(document.styleSheets)
          .map(sheet => {
            try {
              return Array.from(sheet.cssRules)
                .map(rule => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .filter(Boolean)
          .join('\n');

        // For Word format, create an HTML file with Word-compatible markup
        // Ensure tables are properly formatted for Word
        const wordHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${baseFilename}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Source Sans 3', Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      border: 1px solid #000;
    }
    table td, table th {
      border: 1px solid #000;
      padding: 8px;
      vertical-align: top;
    }
    table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    .div-table, .cargo-table {
      border-collapse: collapse;
    }
    .div-table-row, .div-table-cell {
      border: 1px solid #000;
    }
    ${allStyles}
  </style>
</head>
<body>
  ${cleanClone.outerHTML}
</body>
</html>`;
        const wordBlob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
        const wordUrl = URL.createObjectURL(wordBlob);
        const wordLink = document.createElement('a');
        wordLink.href = wordUrl;
        wordLink.download = `${baseFilename}.doc`;
        document.body.appendChild(wordLink);
        wordLink.click();
        document.body.removeChild(wordLink);
        URL.revokeObjectURL(wordUrl);
        break;
      }

      default:
        console.warn(`Unknown download format: ${format}`);
    }
  }, [documentType, documentId, getCleanDocumentContent]);

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

  // Lock body scroll when version preview modal is open
  useEffect(() => {
    if (isVersionPreviewOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isVersionPreviewOpen]);

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?'
      );
      if (!confirmed) return;
    }
    navigate('/');
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
    ]
  };

  return (
    <div className="document-view-page">
      <BackButton onClick={handleBack} />
      
      <div className="action-buttons">
        {hasUnsavedChanges && (
          <>
            <div className="action-button-tooltip-wrapper">
              <IconButton
                icon="reset"
                variant="default"
                size="xl"
                onClick={handleRevert}
                aria-label="Revert changes"
              />
              <div className="action-button-tooltip">Revert</div>
            </div>
            <div className="action-button-tooltip-wrapper">
              <IconButton
                icon="save"
                variant="primary"
                size="xl"
                onClick={handleSave}
                aria-label="Save changes"
              />
              <div className="action-button-tooltip">Save</div>
            </div>
            <div className="button-separator"></div>
          </>
        )}
        <div className="action-button-tooltip-wrapper">
          <IconButton
            icon="print"
            variant="default"
            size="xl"
            onClick={handlePrint}
            aria-label="Print document"
          />
          <div className="action-button-tooltip">Print</div>
        </div>
        <div className="action-button-tooltip-wrapper">
          <IconButton
            icon="download"
            variant="default"
            size="xl"
            onClick={() => setIsDownloadModalOpen(true)}
            aria-label="Download document"
          />
          <div className="action-button-tooltip">Download</div>
        </div>
        <div className="action-button-tooltip-wrapper">
          <IconButton
            icon="share"
            variant="default"
            size="xl"
            onClick={() => setIsShareModalOpen(true)}
            aria-label="Share document"
          />
          <div className="action-button-tooltip">Share</div>
        </div>
      </div>
      
      <div className="document-view-content">
        {documentType === 'fattura' ? (
          <>
            <div className="document-wrapper">
              <FatturaDocument 
                key={documentId}
                onHasChanges={setHasUnsavedChanges}
                onSave={handleSave}
                onRevert={handleRevert}
                isEmpty={isNewDocument}
                useWebPPI={true}
              />
              {!isNewDocument && (
                <div className="document-generate-button-wrapper">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon="receipt"
                    iconVariant="outline"
                    onClick={() => {
                      // TODO: Implement generate receipt functionality
                      console.log('Generate receipt from invoice');
                    }}
                    className="document-generate-button"
                  >
                    Generate Receipt
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : documentType === 'offer' ? (
          <>
            <div className="document-wrapper offer-document-wrapper">
              <OfferDocument 
                key={documentId}
                onHasChanges={setHasUnsavedChanges}
                onSave={handleSave}
                onRevert={handleRevert}
                isEmpty={isNewDocument}
                useWebPPI={true}
              />
              {!isNewDocument && (
                <div className="offer-generate-invoice-button-wrapper">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon="file-text"
                    iconVariant="outline"
                    onClick={() => {
                      // TODO: Implement generate invoice functionality
                      console.log('Generate invoice from offer');
                    }}
                    className="offer-generate-invoice-button"
                  >
                    Generate Invoice
                  </Button>
                </div>
              )}
            </div>
            {documentId === 'offer-001' && (
              <div className="offer-invoice-reference">
                <div className="offer-invoice-reference-label">Related Invoice:</div>
                <div className="offer-invoice-reference-content">
                  <div className="offer-invoice-reference-number">
                    Invoice No: FT-2025-001
                  </div>
                  <div className="offer-invoice-reference-date">
                    Date: Nov 6, 2025
                  </div>
                  <div className="offer-invoice-reference-total">
                    Amount: €87,500.00
                  </div>
                </div>
              </div>
            )}
          </>
        ) : documentType === 'agreement' ? (
          <>
            <div className="document-wrapper">
              <AgreementDocument 
                key={documentId}
                onHasChanges={setHasUnsavedChanges}
                onSave={handleSave}
                onRevert={handleRevert}
                isEmpty={isNewDocument}
                useWebPPI={true}
              />
              {!isNewDocument && (
                <div className="document-generate-button-wrapper">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon="file-text"
                    iconVariant="outline"
                    onClick={() => {
                      // TODO: Implement generate invoice from agreement functionality
                      console.log('Generate invoice from agreement');
                    }}
                    className="document-generate-button"
                  >
                    Generate Invoice
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : documentType === 'purchase-order' ? (
          <>
            <div className="document-wrapper">
              <PurchaseOrderDocument 
                key={documentId}
                onHasChanges={setHasUnsavedChanges}
                onSave={handleSave}
                onRevert={handleRevert}
                isEmpty={isNewDocument}
                useWebPPI={true}
              />
              {!isNewDocument && (
                <div className="document-generate-button-wrapper">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon="file-text"
                    iconVariant="outline"
                    onClick={() => {
                      // TODO: Implement generate receipt from purchase order functionality
                      console.log('Generate receipt from purchase order');
                    }}
                    className="document-generate-button"
                  >
                    Generate Receipt
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="document-wrapper">
              <TransportDocument 
                key={documentId}
                onHasChanges={setHasUnsavedChanges}
                onSave={handleSave}
                onRevert={handleRevert}
                isEmpty={isNewDocument}
                useWebPPI={true}
              />
              {!isNewDocument && (
                <div className="document-generate-button-wrapper">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon="truck"
                    iconVariant="outline"
                    onClick={() => {
                      // TODO: Implement generate delivery note functionality
                      console.log('Generate delivery note from transport document');
                    }}
                    className="document-generate-button"
                  >
                    Generate Delivery Note
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="document-view-sidebar">
          {!isNewDocument && (
            <>
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
                {getRelatedDocuments.length > 0 && (
                  <div className="file-details-item">
                    <span className="file-details-label">Related Documents</span>
                    <div className="file-details-related-links">
                      {getRelatedDocuments.map((relatedDoc) => (
                        <a 
                          key={relatedDoc.documentId}
                          href="#" 
                          className="file-details-related-link"
                          onClick={(e) => {
                            e.preventDefault();
                            setPreviewDocument(relatedDoc);
                          }}
                        >
                          {relatedDoc.documentType} {relatedDoc.documentNumber}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
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
                    e.stopPropagation();
                    setPreviewVersionIndex(index);
                    setIsVersionPreviewOpen(true);
                  }}>
                    Preview version
                  </a>
                </div>
              ))}
            </div>
            <a href="#" className="file-history-expand-link" onClick={(e) => {
              e.preventDefault();
              // TODO: Implement view more history functionality
              console.log('View more history');
            }}>
              <span>View more</span>
              <Icon name="chevron-down" size="sm" variant="outline" />
            </a>
          </div>
            </>
          )}
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

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        onDownload={handleDownload}
        documentTitle={`${documentType}-${documentId}`}
      />
      
      {isVersionPreviewOpen && previewVersionIndex !== null && (
        <div className="version-preview-overlay" onClick={() => setIsVersionPreviewOpen(false)}>
          <div className="version-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="version-preview-header">
              <h2 className="version-preview-title">
                Version Preview - {fileDetails.history[previewVersionIndex]?.action}
              </h2>
              <IconButton
                icon="x"
                variant="ghost"
                size="sm"
                onClick={() => setIsVersionPreviewOpen(false)}
                aria-label="Close"
              />
            </div>
            <div className="version-preview-content">
              <div className="version-preview-info">
                <div className="version-preview-info-item">
                  <span className="version-preview-label">Action:</span>
                  <span className="version-preview-value">{fileDetails.history[previewVersionIndex]?.action}</span>
                </div>
                <div className="version-preview-info-item">
                  <span className="version-preview-label">By:</span>
                  <span className="version-preview-value">{fileDetails.history[previewVersionIndex]?.by}</span>
                </div>
                <div className="version-preview-info-item">
                  <span className="version-preview-label">Date:</span>
                  <span className="version-preview-value">{fileDetails.history[previewVersionIndex]?.date}</span>
                </div>
              </div>
              <div className="version-preview-document">
                {/* TODO: Render the actual document version here */}
                <p className="version-preview-placeholder">
                  Document version preview will be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewDocument && (
        <DocumentPreviewModal
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          showActions={true}
          buttonText="Edit"
          {...previewDocument}
        />
      )}
    </div>
  );
};

