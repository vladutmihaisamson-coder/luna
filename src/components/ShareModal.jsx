import { useEffect, useRef, useState } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Button } from './design-system/atoms/Button/Button';
import { FiLink2, FiMail, FiDownload, FiPaperclip } from 'react-icons/fi';
import html2pdf from 'html2pdf.js';
import './ShareModal.css';

export const ShareModal = ({ isOpen, onClose, documentTitle, documentUrl }) => {
  const modalRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    // Generate a shareable URL (in a real app, this would be from your backend)
    if (isOpen) {
      const currentUrl = window.location.href;
      setShareUrl(currentUrl);
    }
  }, [isOpen]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error('Failed to copy link:', err);
    });
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out this document: ${documentTitle || 'Document'}`);
    const body = encodeURIComponent(`I wanted to share this document with you:\n\n${shareUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleEmailWithAttachment = async () => {
    setIsGeneratingPDF(true);
    
    try {
      // Get the document element
      const element = document.querySelector('.document-pages') || document.querySelector('.fattura-document');
      if (!element) {
        alert('Document not found. Please try again.');
        setIsGeneratingPDF(false);
        return;
      }

      const filename = `${documentTitle || 'document'}.pdf`;

      // Generate PDF as blob
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

      // Generate PDF and get blob
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      
      // Create a temporary download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL after a short delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);

      // Open email client with instructions
      const subject = encodeURIComponent(`Document: ${documentTitle || 'Document'}`);
      const body = encodeURIComponent(
        `Please find the attached document.\n\n` +
        `The PDF file "${filename}" has been downloaded to your default download folder. ` +
        `Please attach it to this email before sending.\n\n` +
        `Document link: ${shareUrl}`
      );
      
      // Small delay to ensure download starts
      setTimeout(() => {
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
        setIsGeneratingPDF(false);
        onClose();
      }, 500);
      
    } catch (error) {
      console.error('Error generating PDF for email:', error);
      alert('Failed to generate PDF. Please try downloading the PDF first and then attach it manually.');
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = () => {
    // Trigger the download functionality by dispatching a custom event
    // The DocumentViewPage will listen for this event
    window.dispatchEvent(new CustomEvent('downloadDocument'));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay">
      <div className="share-modal" ref={modalRef}>
        <div className="share-modal-header">
          <h2 className="share-modal-title">Share Document</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>
        <div className="share-modal-content">
          <div className="share-options">
            <button 
              className="share-option-button"
              onClick={handleCopyLink}
            >
              <div className="share-option-icon">
                <FiLink2 size={24} />
              </div>
              <div className="share-option-content">
                <h3 className="share-option-title">Copy Link</h3>
                <p className="share-option-description">Copy a link to share this document</p>
              </div>
              {copied && (
                <span className="share-option-status">Copied!</span>
              )}
            </button>

            <button 
              className="share-option-button"
              onClick={handleEmailShare}
            >
              <div className="share-option-icon">
                <FiMail size={24} />
              </div>
              <div className="share-option-content">
                <h3 className="share-option-title">Email Link</h3>
                <p className="share-option-description">Share link via email</p>
              </div>
            </button>

            <button 
              className="share-option-button"
              onClick={handleEmailWithAttachment}
              disabled={isGeneratingPDF}
            >
              <div className="share-option-icon">
                <FiPaperclip size={24} />
              </div>
              <div className="share-option-content">
                <h3 className="share-option-title">Email with PDF</h3>
                <p className="share-option-description">
                  {isGeneratingPDF ? 'Generating PDF...' : 'Attach PDF to email'}
                </p>
              </div>
            </button>

            <button 
              className="share-option-button"
              onClick={handleDownloadPDF}
            >
              <div className="share-option-icon">
                <FiDownload size={24} />
              </div>
              <div className="share-option-content">
                <h3 className="share-option-title">Download PDF</h3>
                <p className="share-option-description">Download as PDF to share</p>
              </div>
            </button>
          </div>

          <div className="share-link-section">
            <label className="share-link-label">Document Link</label>
            <div className="share-link-input-wrapper">
              <input
                type="text"
                className="share-link-input"
                value={shareUrl}
                readOnly
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleCopyLink}
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

