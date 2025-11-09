import { useState, useEffect, useRef } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Button } from './design-system/atoms/Button/Button';
import { Input } from './design-system/atoms/Input/Input';
import './FromToAddressModal.css';

export const FromToAddressModal = ({
  isOpen,
  onClose,
  label,
  address = [],
  onSave,
  onSearch
}) => {
  const [editedAddress, setEditedAddress] = useState(address);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setEditedAddress(address);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen, address]);

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

  const handleAddressLineChange = (index, value) => {
    const newAddress = [...editedAddress];
    newAddress[index] = value;
    setEditedAddress(newAddress);
  };

  const handleAddLine = () => {
    setEditedAddress([...editedAddress, '']);
  };

  const handleRemoveLine = (index) => {
    const newAddress = editedAddress.filter((_, i) => i !== index);
    setEditedAddress(newAddress);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Call the search function passed as prop
      if (onSearch) {
        const results = await onSearch(searchQuery);
        setSearchResults(results || []);
      } else {
        // Fallback: mock search results
        setSearchResults([
          {
            id: 1,
            name: 'ABC Logistics Ltd.',
            address: ['123 Warehouse St, Industrial Park', 'New York, NY 10001', '+1 (555) 123-4567']
          },
          {
            id: 2,
            name: 'XYZ Distribution Co.',
            address: ['456 Delivery Ave, Commerce District', 'Los Angeles, CA 90001', '+1 (555) 987-6543']
          }
        ].filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.address.some(line => line.toLowerCase().includes(searchQuery.toLowerCase()))
        ));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result) => {
    setEditedAddress(result.address);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedAddress);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="from-to-modal-overlay">
      <div className="from-to-modal" ref={modalRef}>
        <div className="from-to-modal-header">
          <h2 className="from-to-modal-title">Edit {label} Address</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>

        <div className="from-to-modal-content">
          <div className="from-to-modal-section">
            <h3 className="from-to-modal-section-title">Search Database</h3>
            <div className="from-to-search-container">
              <div className="from-to-search-input-wrapper">
                <input
                  type="text"
                  className="from-to-search-input"
                  placeholder="Search for client address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <IconButton
                icon="filter"
                variant="ghost"
                size="sm"
                onClick={handleSearch}
                disabled={isSearching}
                aria-label="Search"
                className="from-to-search-button"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="from-to-search-results">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="from-to-search-result-item"
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="from-to-search-result-name">{result.name}</div>
                    <div className="from-to-search-result-address">
                      {result.address.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="from-to-modal-section">
            <h3 className="from-to-modal-section-title">Edit Address</h3>
            <div className="from-to-address-editor">
              {editedAddress.map((line, index) => (
                <div key={index} className="from-to-address-line">
                  <div className="from-to-address-input-wrapper">
                    <input
                      type="text"
                      className="from-to-address-input"
                      value={line}
                      onChange={(e) => handleAddressLineChange(index, e.target.value)}
                      placeholder={`Address line ${index + 1}`}
                    />
                  </div>
                  <IconButton
                    icon="delete"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLine(index)}
                    aria-label="Remove line"
                  />
                </div>
              ))}
              <Button
                variant="ghost"
                className="from-to-add-line-button"
                onClick={handleAddLine}
              >
                + Add Line
              </Button>
            </div>
          </div>
        </div>

        <div className="from-to-modal-footer">
          <Button
            variant="default"
            className="from-to-modal-button"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="from-to-modal-button"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

