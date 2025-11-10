import { useState } from 'react';
import { Document } from './design-system/organisms/Document/Document';
import { DocumentTitle } from './DocumentTitle';
import { EditableTextCell } from './table/components/EditableTextCell';
import './ExtractedDocumentViewer.css';

export const ExtractedDocumentViewer = ({ extractedData, onSave, onClose }) => {
  const [editedPages, setEditedPages] = useState(extractedData?.pages || []);
  const [documentDate, setDocumentDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  if (!extractedData) return null;

  const handlePageTextChange = (pageNumber, newText) => {
    setEditedPages(prev => 
      prev.map(page => 
        page.pageNumber === pageNumber 
          ? { ...page, text: newText }
          : page
      )
    );
  };

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleDatePickerToggle = (isOpen) => {
    setShowDatePicker(isOpen);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...extractedData,
        pages: editedPages,
        date: documentDate
      });
    }
  };

  return (
    <div className="extracted-document-viewer">
      <div className="extracted-document-header">
        <h2 className="extracted-document-title">
          Extracted Document: {extractedData.fileName}
        </h2>
        <div className="extracted-document-actions">
          <button 
            className="extracted-document-button"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            className="extracted-document-button primary"
            onClick={handleSave}
          >
            Save Document
          </button>
        </div>
      </div>

      <div className="extracted-document-pages">
        {editedPages.map((page, index) => (
          <Document 
            key={page.pageNumber} 
            size="a4" 
            orientation="portrait" 
            padding={true}
          >
            {index === 0 && (
              <DocumentTitle
                title="Extracted Document"
                documentNumber={`EXT-${new Date().getFullYear()}-${String(page.pageNumber).padStart(3, '0')}`}
                date={documentDate}
                onDateChange={handleDateChange}
                showDatePicker={showDatePicker}
                onDatePickerToggle={handleDatePickerToggle}
              />
            )}

            <div className="extracted-document-content">
              <div className="extracted-page-header">
                <span className="extracted-page-number">Page {page.pageNumber}</span>
              </div>
              
              <div className="extracted-text-content">
                <EditableTextCell
                  value={page.text}
                  onChange={(value) => handlePageTextChange(page.pageNumber, value)}
                  placeholder="Extracted text will appear here..."
                  className="extracted-text-cell"
                />
              </div>

              {page.imageData && (
                <div className="extracted-page-image">
                  <img 
                    src={page.imageData} 
                    alt={`Page ${page.pageNumber}`}
                    className="extracted-image"
                  />
                </div>
              )}
            </div>
          </Document>
        ))}
      </div>
    </div>
  );
};

