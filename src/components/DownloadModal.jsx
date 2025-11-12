import { useState, useEffect, useRef } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Button } from './design-system/atoms/Button/Button';
import { Icon } from './design-system/atoms/Icon/Icon';
import './DownloadModal.css';

export const DownloadModal = ({ isOpen, onClose, onDownload, documentTitle }) => {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const modalRef = useRef(null);

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

  // Handle escape key and click outside
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

  const handleDownload = () => {
    if (onDownload) {
      onDownload(selectedFormat);
    }
    onClose();
  };

  if (!isOpen) return null;

  const formats = [
    { value: 'pdf', label: 'PDF', description: 'Portable Document Format', icon: 'file' },
    { value: 'word', label: 'Word', description: 'Microsoft Word Document', icon: 'file' },
    { value: 'html', label: 'HTML', description: 'HyperText Markup Language', icon: 'file' },
    { value: 'text', label: 'Text', description: 'Plain Text File', icon: 'file' },
  ];

  return (
    <div className="download-modal-overlay" onClick={onClose}>
      <div className="download-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="download-modal-header">
          <h2 className="download-modal-title">Download Document</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>
        
        <div className="download-modal-content">
          <p className="download-modal-description">
            Select the format you want to download the document in:
          </p>
          
          <div className="download-format-options">
            {formats.map((format) => (
              <div
                key={format.value}
                className={`download-format-option ${selectedFormat === format.value ? 'selected' : ''}`}
                onClick={() => setSelectedFormat(format.value)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedFormat(format.value);
                  }
                }}
              >
                <div className="download-format-radio">
                  <input
                    type="radio"
                    name="download-format"
                    value={format.value}
                    checked={selectedFormat === format.value}
                    onChange={() => setSelectedFormat(format.value)}
                    id={`format-${format.value}`}
                  />
                  <label htmlFor={`format-${format.value}`} className="download-format-label">
                    <div className="download-format-info">
                      <span className="download-format-name">{format.label}</span>
                      <span className="download-format-description">{format.description}</span>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="download-modal-footer">
          <Button 
            variant="default" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDownload}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

