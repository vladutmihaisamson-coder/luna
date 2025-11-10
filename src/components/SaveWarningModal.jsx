import { useEffect, useRef } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Button } from './design-system/atoms/Button/Button';
import './SaveWarningModal.css';

export const SaveWarningModal = ({ isOpen, onClose, onConfirm, documentTitle }) => {
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

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="save-warning-modal-overlay">
      <div className="save-warning-modal" ref={modalRef}>
        <div className="save-warning-modal-header">
          <h2 className="save-warning-modal-title">Warning: Document Already Emitted</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>
        <div className="save-warning-modal-content">
          <p className="save-warning-modal-message">
            This document has already been emitted. Making changes to an emitted document may affect its legal validity and audit trail.
          </p>
          <p className="save-warning-modal-question">
            Are you sure you want to save these changes?
          </p>
        </div>
        <div className="save-warning-modal-footer">
          <Button
            variant="default"
            onClick={onClose}
            aria-label="Cancel"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            aria-label="Save anyway"
          >
            Save Anyway
          </Button>
        </div>
      </div>
    </div>
  );
};

