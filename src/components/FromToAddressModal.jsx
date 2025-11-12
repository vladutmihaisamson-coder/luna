import { useState, useEffect, useRef } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Icon } from './design-system/atoms/Icon/Icon';
import { Button } from './design-system/atoms/Button/Button';
import { Input } from './design-system/atoms/Input/Input';
import './FromToAddressModal.css';

export const FromToAddressModal = ({
  isOpen,
  onClose,
  label,
  name = '',
  address = [],
  onSave,
  onSearch
}) => {
  const [editedName, setEditedName] = useState(name);
  const [editedAddress, setEditedAddress] = useState(Array.isArray(address) ? address.join(', ') : address);
  const [editedEmail, setEditedEmail] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [businessSearchQuery, setBusinessSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isBusinessSearchExpanded, setIsBusinessSearchExpanded] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setEditedName(name);
      setEditedAddress(Array.isArray(address) ? address.join(', ') : address);
      setEditedEmail('');
      setEditedPhone('');
      setBusinessSearchQuery('');
      setSearchResults([]);
      setIsBusinessSearchExpanded(false);
    }
  }, [isOpen, name, address]);

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

  const handleSearch = async () => {
    if (!businessSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // Call the search function passed as prop
      if (onSearch) {
        const results = await onSearch(businessSearchQuery);
        setSearchResults(results || []);
      } else {
        // Fallback: mock search results
        setSearchResults([
          {
            id: 1,
            name: 'ABC Logistics Ltd.',
            address: '123 Warehouse St, Industrial Park, New York, NY 10001'
          },
          {
            id: 2,
            name: 'XYZ Distribution Co.',
            address: '456 Delivery Ave, Commerce District, Los Angeles, CA 90001'
          }
        ].filter(item => 
          item.name.toLowerCase().includes(businessSearchQuery.toLowerCase()) ||
          item.address.toLowerCase().includes(businessSearchQuery.toLowerCase())
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
    // Fill both name and address when selecting a result
    if (result.name) {
      setEditedName(result.name);
    }
    if (result.address) {
      setEditedAddress(Array.isArray(result.address) ? result.address.join(', ') : result.address);
    }
    setBusinessSearchQuery('');
    setSearchResults([]);
    setIsBusinessSearchExpanded(false);
  };

  const handleSave = () => {
    if (onSave) {
      // Pass both name and address as an object
      // Convert address string back to array if needed
      const addressArray = editedAddress ? [editedAddress] : [];
      onSave({ name: editedName, address: addressArray });
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
          <div className="from-to-modal-description-wrapper">
            <p className="from-to-modal-description">
              Edit {label} information
            </p>
            <div className={`search-business-wrapper ${isBusinessSearchExpanded ? 'expanded' : ''}`}>
              {isBusinessSearchExpanded ? (
                <div className="search-business-input-wrapper">
                  <Icon name="search" size="sm" variant="outline" />
                  <input
                    type="text"
                    className="search-business-input"
                    placeholder="Search businesses online..."
                    value={businessSearchQuery}
                    onChange={(e) => setBusinessSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                    onBlur={() => {
                      if (!businessSearchQuery.trim()) {
                        setIsBusinessSearchExpanded(false);
                      }
                    }}
                    autoFocus={true}
                  />
                  {businessSearchQuery && (
                    <button
                      className="search-business-clear"
                      onClick={() => {
                        setBusinessSearchQuery('');
                      }}
                      aria-label="Clear search"
                    >
                      <Icon name="x" size="sm" variant="outline" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="search-business-tooltip-wrapper">
                  <IconButton
                    icon="search"
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      setIsBusinessSearchExpanded(true);
                    }}
                    aria-label="Search businesses online"
                    className="search-business-button"
                  />
                  <div className="search-business-tooltip">
                    Search businesses online to quickly add client information
                  </div>
                </div>
              )}
            </div>
          </div>

          {isBusinessSearchExpanded && searchResults.length > 0 && (
            <div className="from-to-search-results">
              <div className="from-to-search-results-header">Search Results</div>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="from-to-search-result-item"
                  onClick={() => handleSelectResult(result)}
                >
                  <div className="from-to-search-result-name">{result.name}</div>
                  <div className="from-to-search-result-address">
                    {Array.isArray(result.address) ? result.address.join(', ') : result.address}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form id="from-to-form" className="from-to-form">
            <div className="form-fields-wrapper">
              <div className="form-field">
                <label htmlFor="from-to-name">Client Name *</label>
                <Input
                  id="from-to-name"
                  type="text"
                  value={editedName}
                  onChange={(value) => setEditedName(value)}
                  placeholder="Enter client name"
                  required
                  className="form-input-square"
                />
              </div>
              <div className="form-field">
                <label htmlFor="from-to-address">Address *</label>
                <Input
                  id="from-to-address"
                  type="text"
                  value={editedAddress}
                  onChange={(value) => setEditedAddress(value)}
                  placeholder="Enter client address"
                  required
                  className="form-input-square"
                />
              </div>
              <div className="form-field">
                <label htmlFor="from-to-email">Email</label>
                <Input
                  id="from-to-email"
                  type="email"
                  value={editedEmail}
                  onChange={(value) => setEditedEmail(value)}
                  placeholder="Enter client email"
                  className="form-input-square"
                />
              </div>
              <div className="form-field">
                <label htmlFor="from-to-phone">Phone</label>
                <Input
                  id="from-to-phone"
                  type="tel"
                  value={editedPhone}
                  onChange={(value) => setEditedPhone(value)}
                  placeholder="Enter client phone"
                  className="form-input-square"
                />
              </div>
            </div>
          </form>
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

