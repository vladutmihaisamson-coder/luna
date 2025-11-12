import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Button } from './design-system/atoms/Button/Button';
import { DownloadModal } from './DownloadModal';
import { ShareModal } from './ShareModal';
import { TransportDocument } from './TransportDocument';
import { FatturaDocument } from './FatturaDocument';
import { OfferDocument } from './OfferDocument';
import { AgreementDocument } from './AgreementDocument';
import { PurchaseOrderDocument } from './PurchaseOrderDocument';
import html2pdf from 'html2pdf.js';
import './DocumentPreviewModal.css';

export const DocumentPreviewModal = ({
  isOpen,
  onClose,
  documentId,
  title,
  documentNumber,
  date,
  documentType,
  total,
  currencySymbol = '€',
  content,
  itemCount,
  direction,
  needsAttention,
  signatureStatus,
  lastModified,
  isEditable,
  country,
  showActions = false,
  buttonText = 'Go to Document'
}) => {
  const navigate = useNavigate();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleGoToDocument = () => {
    if (documentId) {
      navigate(`/document/${documentId}`);
      onClose();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Function to clone document and remove interactive controls
  const getCleanDocumentContent = () => {
    const element = document.querySelector('.document-preview-modal-document .document-pages') || 
                    document.querySelector('.document-preview-modal-document .fattura-document') ||
                    document.querySelector('.document-preview-modal-document .document');
    if (!element) return null;

    const clone = element.cloneNode(true);

    // Remove all interactive elements
    const interactiveSelectors = [
      'button', 'input', 'select', 'textarea',
      '[contenteditable="true"]', '.drag-handle', '.row-action-button',
      '.delete-button', '.add-row-button', '.unit-dropdown-controls',
      '.quantity-controls', '.unit-dropdown-button-wrapper', '.unit-dropdown',
      '[role="button"]', '.editable-text-cell', '.editable-cell',
      '.icon-button', '.button', 'a[href="#"]'
    ];

    interactiveSelectors.forEach(selector => {
      const elements = clone.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Replace editable cells with text
    clone.querySelectorAll('.editable-text-cell, .editable-cell').forEach(cell => {
      const text = cell.textContent || cell.innerText || '';
      const span = document.createElement('span');
      span.textContent = text;
      span.className = cell.className.replace('editable-text-cell', '').replace('editable-cell', '').trim();
      cell.parentNode?.replaceChild(span, cell);
    });

    // Remove interactive attributes
    clone.querySelectorAll('*').forEach(el => {
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
  };

  const handleDownload = (format = 'pdf') => {
    const element = document.querySelector('.document-preview-modal-document .document-pages') || 
                    document.querySelector('.document-preview-modal-document .fattura-document') ||
                    document.querySelector('.document-preview-modal-document .document');
    if (!element) return;

    const baseFilename = `${documentType}-${documentId}`;

    switch (format) {
      case 'pdf': {
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
      }

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

      case 'text': {
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
      }

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
  };

  // Determine document type for rendering
  const getDocumentType = () => {
    if (!documentType) return 'transport';
    const normalizedType = documentType.toLowerCase();
    if (normalizedType.includes('fattura') || normalizedType.includes('invoice')) return 'fattura';
    if (normalizedType.includes('offer')) return 'offer';
    if (normalizedType.includes('agreement')) return 'agreement';
    if (normalizedType.includes('purchase') || normalizedType.includes('order')) return 'purchase-order';
    return 'transport';
  };

  const docType = getDocumentType();

  const renderDocument = () => {
    switch (docType) {
      case 'fattura':
        return <FatturaDocument isEmpty={false} useWebPPI={true} />;
      case 'offer':
        return <OfferDocument isEmpty={false} useWebPPI={true} />;
      case 'agreement':
        return <AgreementDocument isEmpty={false} useWebPPI={true} />;
      case 'purchase-order':
        return <PurchaseOrderDocument isEmpty={false} useWebPPI={true} />;
      default:
        return <TransportDocument isEmpty={false} useWebPPI={true} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="document-preview-modal-overlay" onClick={onClose}>
      <div className="document-preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="document-preview-modal-header">
          <h2 className="document-preview-modal-title">Document Preview</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
          />
        </div>
        {showActions && (
          <div className="document-preview-modal-actions">
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
        )}
        <div className="document-preview-modal-content">
          <div className="document-preview-modal-document-wrapper">
            <div className="document-preview-modal-document">
              {renderDocument()}
            </div>
            {docType === 'offer' && documentId === 'offer-001' && (
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
          </div>
        </div>
        <div className="document-preview-modal-footer">
          <Button
            variant="default"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleGoToDocument}
          >
            {buttonText}
          </Button>
        </div>

        {showActions && (
          <>
            <DownloadModal
              isOpen={isDownloadModalOpen}
              onClose={() => setIsDownloadModalOpen(false)}
              onDownload={handleDownload}
              documentTitle={`${documentType}-${documentId}`}
            />
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              documentTitle={`${documentType}-${documentId}`}
              documentUrl={documentId ? `${window.location.origin}/document/${documentId}` : window.location.href}
            />
          </>
        )}
      </div>
    </div>
  );
};

