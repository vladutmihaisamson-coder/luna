import { useState, useEffect, useRef } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
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
  const [editedAddress, setEditedAddress] = useState(address);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [onlineResults, setOnlineResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [searchMode, setSearchMode] = useState('local'); // 'local' or 'online'
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setEditedName(name);
      setEditedAddress(address);
      setSearchQuery('');
      setSearchResults([]);
      setOnlineResults([]);
      setSearchMode('local');
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
      setOnlineResults([]);
      return;
    }

    if (searchMode === 'local') {
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
    } else {
      // Online search
      setIsSearchingOnline(true);
      try {
        // Search online sources (using a mock API call - in production, use a real company search API)
        await searchOnlineCompanies(searchQuery);
      } catch (error) {
        console.error('Online search error:', error);
        setOnlineResults([]);
      } finally {
        setIsSearchingOnline(false);
      }
    }
  };

  const searchOnlineCompanies = async (query) => {
    // Mock online search - in production, this would call a real API like:
    // - Companies House API (UK)
    // - OpenCorporates API
    // - Google Places API
    // - Or a custom company database API
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock results from online sources
    const mockOnlineResults = [
      {
        id: 'online-1',
        name: `${query} Industries Inc.`,
        address: ['789 Corporate Blvd, Business District', 'Chicago, IL 60601', 'United States'],
        source: 'Online Database',
        website: 'www.example.com'
      },
      {
        id: 'online-2',
        name: `${query} Manufacturing Ltd.`,
        address: ['456 Industrial Way, Manufacturing Zone', 'Detroit, MI 48201', 'United States'],
        source: 'Online Database',
        website: 'www.example2.com'
      },
      {
        id: 'online-3',
        name: `${query} Solutions GmbH`,
        address: ['123 Business Park, Technology Center', 'Berlin, 10115', 'Germany'],
        source: 'Online Database',
        website: 'www.example3.com'
      }
    ];
    
    setOnlineResults(mockOnlineResults);
  };

  const handleSelectResult = (result) => {
    // Fill both name and address when selecting a result
    if (result.name) {
      setEditedName(result.name);
    }
    if (result.address) {
      setEditedAddress(result.address);
    }
    setSearchQuery('');
    setSearchResults([]);
    setOnlineResults([]);
  };

  const handleSave = () => {
    if (onSave) {
      // Pass both name and address as an object
      onSave({ name: editedName, address: editedAddress });
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
            <h3 className="from-to-modal-section-title">Search</h3>
            <div className="from-to-search-mode-toggle">
              <button
                className={`search-mode-button ${searchMode === 'local' ? 'active' : ''}`}
                onClick={() => setSearchMode('local')}
              >
                Local Database
              </button>
              <button
                className={`search-mode-button ${searchMode === 'online' ? 'active' : ''}`}
                onClick={() => setSearchMode('online')}
              >
                Online Sources
              </button>
            </div>
            <div className="from-to-search-container">
              <div className="from-to-search-input-wrapper">
                <input
                  type="text"
                  className="from-to-search-input"
                  placeholder={searchMode === 'local' ? "Search for client address..." : "Search online for companies..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <IconButton
                icon="search"
                variant="ghost"
                size="sm"
                onClick={handleSearch}
                disabled={isSearching || isSearchingOnline}
                aria-label="Search"
                className="from-to-search-button"
              />
            </div>

            {isSearchingOnline && (
              <div className="from-to-search-loading">
                <span>Searching online sources...</span>
              </div>
            )}

            {searchMode === 'local' && searchResults.length > 0 && (
              <div className="from-to-search-results">
                <div className="from-to-search-results-header">Local Results</div>
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

            {searchMode === 'online' && onlineResults.length > 0 && (
              <div className="from-to-search-results">
                <div className="from-to-search-results-header">Online Results</div>
                {onlineResults.map((result) => (
                  <div
                    key={result.id}
                    className="from-to-search-result-item from-to-online-result"
                    onClick={() => handleSelectResult(result)}
                  >
                    <div className="from-to-search-result-header-row">
                      <div className="from-to-search-result-name">{result.name}</div>
                      {result.source && (
                        <span className="from-to-search-result-source">{result.source}</span>
                      )}
                    </div>
                    <div className="from-to-search-result-address">
                      {result.address.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                    {result.website && (
                      <div className="from-to-search-result-website">{result.website}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="from-to-modal-section">
            <h3 className="from-to-modal-section-title">Edit Client</h3>
            <div className="from-to-client-editor">
              <div className="from-to-name-field">
                <label className="from-to-field-label">Name</label>
                <Input
                  type="text"
                  value={editedName}
                  onChange={(value) => setEditedName(value)}
                  placeholder="Client name"
                />
              </div>
              <div className="from-to-address-field">
                <label className="from-to-field-label">Address</label>
                <div className="from-to-address-editor">
                  {editedAddress.map((line, index) => (
                    <div key={index} className="from-to-address-line">
                      <div className="from-to-address-input-wrapper">
                        <Input
                          type="text"
                          value={line}
                          onChange={(value) => handleAddressLineChange(index, value)}
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

