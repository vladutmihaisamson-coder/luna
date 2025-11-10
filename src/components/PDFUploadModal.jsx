import { useState, useRef } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Button } from './design-system/atoms/Button/Button';
import './PDFUploadModal.css';

export const PDFUploadModal = ({ isOpen, onClose, onDocumentExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Import PDF.js dynamically
      const pdfjsLib = await import('pdfjs-dist');
      // Set worker source - using CDN for reliability
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      }

      // Import Tesseract dynamically
      const Tesseract = await import('tesseract.js');

      // Read PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const extractedPages = [];
      const totalPages = pdf.numPages;

      // Process each page
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setProgress((pageNum / totalPages) * 50); // First 50% for PDF extraction

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });

        // Render page to canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Convert canvas to image for OCR
        const imageData = canvas.toDataURL('image/png');
        
        // Perform OCR on the page
        setProgress(50 + (pageNum / totalPages) * 50); // Second 50% for OCR
        
        const { data: { text } } = await Tesseract.recognize(imageData, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              const progressPercent = 50 + (pageNum / totalPages) * 50 + (m.progress * (50 / totalPages));
              setProgress(progressPercent);
            }
          }
        });

        extractedPages.push({
          pageNumber: pageNum,
          text: text,
          imageData: imageData
        });
      }

      setProgress(100);
      
      // Call the callback with extracted data
      if (onDocumentExtracted) {
        onDocumentExtracted({
          fileName: file.name,
          pages: extractedPages,
          totalPages: totalPages
        });
      }

      // Close modal after a short delay
      setTimeout(() => {
        setIsProcessing(false);
        onClose();
      }, 500);

    } catch (err) {
      console.error('Error processing PDF:', err);
      setError(`Error processing PDF: ${err.message}`);
      setIsProcessing(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="pdf-upload-modal-overlay" onClick={onClose}>
      <div className="pdf-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pdf-upload-modal-header">
          <h2 className="pdf-upload-modal-title">Upload PDF Document</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close upload modal"
          />
        </div>

        <div className="pdf-upload-modal-content">
          {error && (
            <div className="pdf-upload-error">
              {error}
            </div>
          )}

          {isProcessing ? (
            <div className="pdf-upload-processing">
              <div className="pdf-upload-progress-bar">
                <div 
                  className="pdf-upload-progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="pdf-upload-progress-text">
                Processing PDF... {Math.round(progress)}%
              </p>
              <p className="pdf-upload-progress-detail">
                Extracting text and performing OCR...
              </p>
            </div>
          ) : (
            <div className="pdf-upload-dropzone">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <div className="pdf-upload-icon">📄</div>
              <p className="pdf-upload-instructions">
                Click the button below to upload a PDF document
              </p>
              <p className="pdf-upload-hint">
                The document will be processed using OCR to extract text
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={handleUploadClick}
              >
                Choose PDF File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

