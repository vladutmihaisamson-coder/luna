import { useState } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Button } from './design-system/atoms/Button/Button';
import { FromToAddressModal } from './FromToAddressModal';
import './FromTo.css';

export const FromTo = ({
  fromLabel = 'From',
  toLabel = 'To',
  fromAddress = [],
  toAddress = [],
  onFromAddressChange,
  onToAddressChange,
  onFromSearch,
  onToSearch,
  className = ''
}) => {
  const [isFromModalOpen, setIsFromModalOpen] = useState(false);
  const [isToModalOpen, setIsToModalOpen] = useState(false);

  const handleFromSave = (newAddress) => {
    if (onFromAddressChange) {
      onFromAddressChange(newAddress);
    }
  };

  const handleToSave = (newAddress) => {
    if (onToAddressChange) {
      onToAddressChange(newAddress);
    }
  };

  return (
    <>
      <div className={`from-to ${className}`}>
        <div className="from-to-section">
          <div className="from-to-party">
            <div className="from-to-label-wrapper">
              <h3 className="from-to-label">{fromLabel}</h3>
              {fromAddress.length > 0 && (
                <IconButton
                  icon="edit"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFromModalOpen(true)}
                  aria-label="Edit From address"
                  className="from-to-dropdown-button"
                />
              )}
            </div>
            {fromAddress.length > 0 ? (
              fromAddress.map((line, index) => (
                <p key={index} className="from-to-line">
                  {line}
                </p>
              ))
            ) : (
              <>
                <p className="from-to-line from-to-placeholder">No address provided</p>
                <Button
                  variant="default"
                  size="sm"
                  icon="plus"
                  iconVariant="outline"
                  onClick={() => setIsFromModalOpen(true)}
                  className="from-to-add-button"
                >
                  Add
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="from-to-section">
          <div className="from-to-party">
            <div className="from-to-label-wrapper">
              <h3 className="from-to-label">{toLabel}</h3>
              {toAddress.length > 0 && (
                <IconButton
                  icon="edit"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsToModalOpen(true)}
                  aria-label="Edit To address"
                  className="from-to-dropdown-button"
                />
              )}
            </div>
            {toAddress.length > 0 ? (
              toAddress.map((line, index) => (
                <p key={index} className="from-to-line">
                  {line}
                </p>
              ))
            ) : (
              <>
                <p className="from-to-line from-to-placeholder">No address provided</p>
                <Button
                  variant="default"
                  size="sm"
                  icon="plus"
                  iconVariant="outline"
                  onClick={() => setIsToModalOpen(true)}
                  className="from-to-add-button"
                >
                  Add
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <FromToAddressModal
        isOpen={isFromModalOpen}
        onClose={() => setIsFromModalOpen(false)}
        label={fromLabel}
        address={fromAddress}
        onSave={handleFromSave}
        onSearch={onFromSearch}
      />

      <FromToAddressModal
        isOpen={isToModalOpen}
        onClose={() => setIsToModalOpen(false)}
        label={toLabel}
        address={toAddress}
        onSave={handleToSave}
        onSearch={onToSearch}
      />
    </>
  );
};

