import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { DocumentOverview } from '../components/DocumentOverview';
import { TransportDocument } from '../components/TransportDocument';
import { OfferDocument } from '../components/OfferDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import { IconButton } from '../components/design-system/molecules/IconButton/IconButton';
import { Icon } from '../components/design-system/atoms/Icon/Icon';
import { Button } from '../components/design-system/atoms/Button/Button';
import { Dropdown } from '../components/design-system/organisms/Dropdown/Dropdown';
import { DocumentTypeSelectionModal } from '../components/DocumentTypeSelectionModal';
import { textContainsQuery } from '../utils/textHighlight';
import './DocumentsPage.css';

export const DocumentsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'folder'
  const [documentFilter, setDocumentFilter] = useState('all'); // 'all', 'in', 'out'
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(12); // Initial number of documents to show
  const [openDropdown, setOpenDropdown] = useState(null); // 'received' | 'when' | 'who' | 'category' | null
  const [selectedFilters, setSelectedFilters] = useState({
    received: null,
    when: null,
    who: null,
    category: null,
  });
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const moreMenuRef = useRef(null);
  const moreButtonRef = useRef(null);
  const searchInputRef = useRef(null);
  const receivedDropdownRef = useRef(null);
  const whenDropdownRef = useRef(null);
  const whoDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  const handleCreateNewDocument = () => {
    setIsCreateModalOpen(true);
  };

  const handleSelectDocumentType = (type) => {
    // Generate a new document ID and navigate to a new document of the selected type
    const newDocumentId = `${type}-new-${Date.now()}`;
    navigate(`/document/${newDocumentId}?type=${type}`);
  };

  const handleMoreMenuToggle = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleViewModeChange = () => {
    setViewMode(viewMode === 'grid' ? 'folder' : 'grid');
    setIsMoreMenuOpen(false);
  };

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const handleDropdownSelect = (dropdownName, value) => {
    // Handle filter selection
    setSelectedFilters(prev => ({
      ...prev,
      [dropdownName]: value,
    }));
    setOpenDropdown(null);
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      received: null,
      when: null,
      who: null,
      category: null,
    });
    setSearchQuery('');
    setIsSearchExpanded(false);
  };

  // Check if any filter pills are active (not including IN/OUT/ALL toggle)
  const hasActiveFilters = useMemo(() => {
    return Object.values(selectedFilters).some(value => value !== null) || 
           searchQuery.trim().length > 0;
  }, [selectedFilters, searchQuery]);

  const getFilterLabel = (dropdownName, value, options) => {
    if (!value) return null;
    const option = options.find(opt => opt.value === value);
    return option ? option.label : null;
  };

  // Get filter options based on document filter type (IN/OUT/ALL)
  const getFilterOptions = (filterType) => {
    const isIn = documentFilter === 'in';
    const isOut = documentFilter === 'out';
    const isAll = documentFilter === 'all';

    const filterOptions = {
      received: isIn 
        ? [
            { value: 'today', label: 'Today' },
            { value: 'this-week', label: 'This Week' },
            { value: 'this-month', label: 'This Month' },
            { value: 'this-year', label: 'This Year' },
          ]
        : isOut
        ? [
            { value: 'today', label: 'Today' },
            { value: 'this-week', label: 'This Week' },
            { value: 'this-month', label: 'This Month' },
            { value: 'this-year', label: 'This Year' },
          ]
        : [
            { value: 'today', label: 'Today' },
            { value: 'this-week', label: 'This Week' },
            { value: 'this-month', label: 'This Month' },
            { value: 'this-year', label: 'This Year' },
          ],
      when: isIn
        ? [
            { value: 'today', label: 'Today' },
            { value: 'yesterday', label: 'Yesterday' },
            { value: 'this-week', label: 'This Week' },
            { value: 'last-week', label: 'Last Week' },
            { value: 'this-month', label: 'This Month' },
          ]
        : isOut
        ? [
            { value: 'today', label: 'Today' },
            { value: 'yesterday', label: 'Yesterday' },
            { value: 'this-week', label: 'This Week' },
            { value: 'last-week', label: 'Last Week' },
            { value: 'this-month', label: 'This Month' },
          ]
        : [
            { value: 'today', label: 'Today' },
            { value: 'yesterday', label: 'Yesterday' },
            { value: 'this-week', label: 'This Week' },
            { value: 'last-week', label: 'Last Week' },
            { value: 'this-month', label: 'This Month' },
          ],
      who: isIn
        ? [
            { value: 'all', label: 'All Senders' },
            { value: 'client-1', label: 'XYZ Distribution Co.' },
            { value: 'client-2', label: 'Global Enterprises Ltd.' },
            { value: 'client-3', label: 'Innovation Tech SpA' },
          ]
        : isOut
        ? [
            { value: 'all', label: 'All Recipients' },
            { value: 'client-1', label: 'ABC Logistics Inc.' },
            { value: 'client-2', label: 'Premium Shipping Ltd.' },
            { value: 'client-3', label: 'Fast Track Solutions' },
          ]
        : [
            { value: 'all', label: 'All Contacts' },
            { value: 'client-1', label: 'XYZ Distribution Co.' },
            { value: 'client-2', label: 'Global Enterprises Ltd.' },
            { value: 'client-3', label: 'Innovation Tech SpA' },
            { value: 'client-4', label: 'ABC Logistics Inc.' },
            { value: 'client-5', label: 'Premium Shipping Ltd.' },
          ],
      category: isIn
        ? [
            { value: 'all', label: 'All Types' },
            { value: 'transport', label: 'Transport' },
            { value: 'offer', label: 'Offer' },
            { value: 'invoice', label: 'Invoice' },
          ]
        : isOut
        ? [
            { value: 'all', label: 'All Types' },
            { value: 'transport', label: 'Transport' },
            { value: 'offer', label: 'Offer' },
            { value: 'invoice', label: 'Invoice' },
          ]
        : [
            { value: 'all', label: 'All Types' },
            { value: 'transport', label: 'Transport' },
            { value: 'offer', label: 'Offer' },
            { value: 'invoice', label: 'Invoice' },
          ],
    };

    return filterOptions[filterType] || [];
  };

  // Reset filters when document filter changes
  useEffect(() => {
    setSelectedFilters({
      received: null,
      when: null,
      who: null,
      category: null,
    });
  }, [documentFilter]);

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      // Focus the input when expanding
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    } else {
      // Clear search when collapsing
      setSearchQuery('');
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchExpanded &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        !event.target.closest('.filter-search-button') &&
        !event.target.closest('.more-options-wrapper')
      ) {
        setIsSearchExpanded(false);
        setSearchQuery('');
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isSearchExpanded]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target)
      ) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMoreMenuOpen]);

  // Helper function to parse date string to Date object
  const parseDate = (dateString) => {
    const months = { "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11 };
    const parts = dateString.split(", ");
    const datePart = parts[0].split(" ");
    const year = parseInt(parts[1]);
    const month = months[datePart[0]];
    const day = parseInt(datePart[1]);
    return new Date(year, month, day);
  };

  const documents = [
    { documentId: "transport-001", title: "XYZ Distribution Co.", documentNumber: "TD-2025-001", date: "Nov 6, 2025", dateObj: parseDate("Nov 6, 2025"), documentType: "Transport", clientId: "client-1", direction: "in", content: "Office furniture delivery to warehouse. Premium office chairs, ergonomic desks, monitor stands, keyboard sets, wireless mice, desk lamps.", previewContent: <TransportDocument /> },
    { documentId: "offer-001", title: "Global Enterprises Ltd.", documentNumber: "OF-2025-001", date: "Nov 5, 2025", dateObj: parseDate("Nov 5, 2025"), documentType: "Offer", clientId: "client-2", direction: "in", total: 7750.00, content: "Premium office chairs, ergonomic desks, monitor stands, keyboard sets, wireless mice, desk lamps. Professional workspace solutions.", previewContent: <OfferDocument /> },
    { documentId: "fattura-001", title: "Innovation Tech SpA", documentNumber: "FT-2025-001", date: "Nov 4, 2025", dateObj: parseDate("Nov 4, 2025"), documentType: "Fattura", clientId: "client-3", direction: "in", total: 11736.40, content: "Web development services, UI/UX design consultation, API integration, database optimization, code review and testing.", previewContent: <FatturaDocument /> },
    { documentId: "transport-002", title: "ABC Manufacturing Inc.", documentNumber: "TD-2025-002", date: "Nov 3, 2025", dateObj: parseDate("Nov 3, 2025"), documentType: "Transport", clientId: "client-1", direction: "out", content: "Industrial equipment shipment. Heavy machinery, production tools, assembly line components.", previewContent: <TransportDocument /> },
    { documentId: "offer-002", title: "Premium Retail Group", documentNumber: "OF-2025-002", date: "Nov 2, 2025", dateObj: parseDate("Nov 2, 2025"), documentType: "Offer", clientId: "client-2", direction: "out", total: 7750.00, content: "Retail furniture and fixtures. Display shelves, checkout counters, storage solutions for retail spaces.", previewContent: <OfferDocument /> },
    { documentId: "fattura-002", title: "Creative Agency Milano", documentNumber: "FT-2025-002", date: "Nov 1, 2025", dateObj: parseDate("Nov 1, 2025"), documentType: "Fattura", clientId: "client-3", direction: "out", total: 11736.40, content: "Brand identity design, marketing materials, social media graphics, website design and development.", previewContent: <FatturaDocument /> },
    { documentId: "transport-003", title: "Pacific Shipping Co.", documentNumber: "TD-2025-003", date: "Oct 30, 2025", dateObj: parseDate("Oct 30, 2025"), documentType: "Transport", clientId: "client-1", direction: "in", previewContent: <TransportDocument /> },
    { documentId: "offer-003", title: "Metro Business Solutions", documentNumber: "OF-2025-003", date: "Oct 29, 2025", dateObj: parseDate("Oct 29, 2025"), documentType: "Offer", clientId: "client-2", direction: "in", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-003", title: "Studio Design Roma", documentNumber: "FT-2025-003", date: "Oct 28, 2025", dateObj: parseDate("Oct 28, 2025"), documentType: "Fattura", clientId: "client-3", direction: "in", total: 11736.40, previewContent: <FatturaDocument /> },
    { documentId: "transport-004", title: "North American Logistics", documentNumber: "TD-2025-004", date: "Oct 27, 2025", dateObj: parseDate("Oct 27, 2025"), documentType: "Transport", clientId: "client-1", direction: "out", previewContent: <TransportDocument /> },
    { documentId: "offer-004", title: "Enterprise Solutions Group", documentNumber: "OF-2025-004", date: "Oct 26, 2025", dateObj: parseDate("Oct 26, 2025"), documentType: "Offer", clientId: "client-2", direction: "out", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-004", title: "Tech Consulting Italia", documentNumber: "FT-2025-004", date: "Oct 25, 2025", dateObj: parseDate("Oct 25, 2025"), documentType: "Fattura", clientId: "client-3", direction: "out", total: 11736.40, previewContent: <FatturaDocument /> },
    { documentId: "transport-005", title: "Global Freight Services", documentNumber: "TD-2025-005", date: "Oct 24, 2025", dateObj: parseDate("Oct 24, 2025"), documentType: "Transport", clientId: "client-1", direction: "in", previewContent: <TransportDocument /> },
    { documentId: "offer-005", title: "Corporate Office Supplies", documentNumber: "OF-2025-005", date: "Oct 23, 2025", dateObj: parseDate("Oct 23, 2025"), documentType: "Offer", clientId: "client-2", direction: "in", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-005", title: "Digital Solutions Srl", documentNumber: "FT-2025-005", date: "Oct 22, 2025", dateObj: parseDate("Oct 22, 2025"), documentType: "Fattura", clientId: "client-3", direction: "in", total: 11736.40, previewContent: <FatturaDocument /> },
    { documentId: "transport-006", title: "International Cargo Ltd.", documentNumber: "TD-2025-006", date: "Oct 21, 2025", dateObj: parseDate("Oct 21, 2025"), documentType: "Transport", clientId: "client-1", direction: "out", previewContent: <TransportDocument /> },
    { documentId: "offer-006", title: "Premium Services Inc.", documentNumber: "OF-2025-006", date: "Oct 20, 2025", dateObj: parseDate("Oct 20, 2025"), documentType: "Offer", clientId: "client-2", direction: "out", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-006", title: "Creative Studio Torino", documentNumber: "FT-2025-006", date: "Oct 19, 2025", dateObj: parseDate("Oct 19, 2025"), documentType: "Fattura", clientId: "client-3", direction: "out", total: 11736.40, previewContent: <FatturaDocument /> },
    { documentId: "transport-007", title: "Express Logistics Group", documentNumber: "TD-2025-007", date: "Oct 18, 2025", dateObj: parseDate("Oct 18, 2025"), documentType: "Transport", clientId: "client-1", direction: "in", previewContent: <TransportDocument /> },
    { documentId: "offer-007", title: "Business Partners Co.", documentNumber: "OF-2025-007", date: "Oct 17, 2025", dateObj: parseDate("Oct 17, 2025"), documentType: "Offer", clientId: "client-2", direction: "in", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-007", title: "Marketing Agency Firenze", documentNumber: "FT-2025-007", date: "Oct 16, 2025", dateObj: parseDate("Oct 16, 2025"), documentType: "Fattura", clientId: "client-3", direction: "in", total: 11736.40, previewContent: <FatturaDocument /> },
    { documentId: "transport-008", title: "Worldwide Shipping Corp.", documentNumber: "TD-2025-008", date: "Oct 15, 2025", dateObj: parseDate("Oct 15, 2025"), documentType: "Transport", clientId: "client-1", direction: "out", previewContent: <TransportDocument /> },
    { documentId: "offer-008", title: "Strategic Consulting LLC", documentNumber: "OF-2025-008", date: "Oct 14, 2025", dateObj: parseDate("Oct 14, 2025"), documentType: "Offer", clientId: "client-2", direction: "out", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-008", title: "Legal Services Napoli", documentNumber: "FT-2025-008", date: "Oct 13, 2025", dateObj: parseDate("Oct 13, 2025"), documentType: "Fattura", clientId: "client-3", direction: "out", total: 11736.40, previewContent: <FatturaDocument /> },
    { documentId: "transport-009", title: "Fast Track Delivery", documentNumber: "TD-2025-009", date: "Oct 12, 2025", dateObj: parseDate("Oct 12, 2025"), documentType: "Transport", clientId: "client-1", direction: "in", previewContent: <TransportDocument /> },
    { documentId: "offer-009", title: "Innovation Hub Ltd.", documentNumber: "OF-2025-009", date: "Oct 11, 2025", dateObj: parseDate("Oct 11, 2025"), documentType: "Offer", clientId: "client-2", direction: "in", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-009", title: "Architecture Studio Venezia", documentNumber: "FT-2025-009", date: "Oct 10, 2025", dateObj: parseDate("Oct 10, 2025"), documentType: "Fattura", clientId: "client-3", direction: "in", total: 11736.40, previewContent: <FatturaDocument /> },
    { documentId: "transport-010", title: "Continental Transport", documentNumber: "TD-2025-010", date: "Oct 9, 2025", dateObj: parseDate("Oct 9, 2025"), documentType: "Transport", clientId: "client-1", direction: "out", previewContent: <TransportDocument /> },
    { documentId: "offer-010", title: "Global Trade Solutions", documentNumber: "OF-2025-010", date: "Oct 8, 2025", dateObj: parseDate("Oct 8, 2025"), documentType: "Offer", clientId: "client-2", direction: "out", total: 7750.00, previewContent: <OfferDocument /> },
    { documentId: "fattura-010", title: "Engineering Firm Bologna", documentNumber: "FT-2025-010", date: "Oct 7, 2025", dateObj: parseDate("Oct 7, 2025"), documentType: "Fattura", clientId: "client-3", direction: "out", total: 11736.40, previewContent: <FatturaDocument /> },
  ];

  // Filter documents based on selected filters
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    // Filter by IN/OUT/ALL toggle
    if (documentFilter !== 'all') {
      filtered = filtered.filter(doc => doc.direction === documentFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.documentNumber.toLowerCase().includes(query) ||
        doc.documentType.toLowerCase().includes(query) ||
        (doc.content && textContainsQuery(doc.content, query))
      );
    }

    // Filter by "received" (when it was received - date range)
    if (selectedFilters.received) {
      const now = new Date();
      const docDate = (doc) => doc.dateObj;
      
      filtered = filtered.filter(doc => {
        const date = docDate(doc);
        switch (selectedFilters.received) {
          case 'today':
            return date.toDateString() === now.toDateString();
          case 'this-week':
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return date >= weekAgo;
          case 'this-month':
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          case 'this-year':
            return date.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Filter by "when" (more specific date filters)
    if (selectedFilters.when) {
      const now = new Date();
      const docDate = (doc) => doc.dateObj;
      
      filtered = filtered.filter(doc => {
        const date = docDate(doc);
        switch (selectedFilters.when) {
          case 'today':
            return date.toDateString() === now.toDateString();
          case 'yesterday':
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            return date.toDateString() === yesterday.toDateString();
          case 'this-week':
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return date >= weekAgo;
          case 'last-week':
            const twoWeeksAgo = new Date(now);
            twoWeeksAgo.setDate(now.getDate() - 14);
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);
            return date >= twoWeeksAgo && date < oneWeekAgo;
          case 'this-month':
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Filter by "who" (client/sender)
    if (selectedFilters.who && selectedFilters.who !== 'all') {
      filtered = filtered.filter(doc => doc.clientId === selectedFilters.who);
    }

    // Filter by "category" (document type)
    if (selectedFilters.category && selectedFilters.category !== 'all') {
      const typeMap = {
        'transport': 'Transport',
        'offer': 'Offer',
        'invoice': 'Fattura'
      };
      const documentType = typeMap[selectedFilters.category];
      if (documentType) {
        filtered = filtered.filter(doc => doc.documentType === documentType);
      }
    }

    return filtered;
  }, [documents, documentFilter, selectedFilters, searchQuery]);

  const visibleDocuments = useMemo(() => {
    return filteredDocuments.slice(0, itemsToShow);
  }, [filteredDocuments, itemsToShow]);

  const groupedDocuments = useMemo(() => {
    const groups = {
      Transport: [],
      Offer: [],
      Fattura: []
    };
    
    visibleDocuments.forEach(doc => {
      if (groups[doc.documentType]) {
        groups[doc.documentType].push(doc);
      }
    });
    
    return groups;
  }, [visibleDocuments]);

  const hasMore = itemsToShow < filteredDocuments.length;

  const handleShowMore = () => {
    setItemsToShow(prev => Math.min(prev + 12, filteredDocuments.length));
  };

  const handleDocumentSelect = (documentId, isSelected) => {
    setSelectedDocuments(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(documentId);
      } else {
        newSet.delete(documentId);
      }
      return newSet;
    });
  };

  // Reset pagination when filters change
  useEffect(() => {
    setItemsToShow(12);
  }, [documentFilter, selectedFilters, searchQuery]);

  return (
    <div className="documents-page">
      <BackButton />
      <div className="documents-toggle-selector">
        <button
          className={`toggle-option ${documentFilter === 'all' ? 'active' : ''}`}
          onClick={() => setDocumentFilter('all')}
        >
          All
        </button>
        <button
          className={`toggle-option ${documentFilter === 'in' ? 'active' : ''}`}
          onClick={() => setDocumentFilter('in')}
        >
          IN
        </button>
        <button
          className={`toggle-option ${documentFilter === 'out' ? 'active' : ''}`}
          onClick={() => setDocumentFilter('out')}
        >
          OUT
        </button>
      </div>
      <div className={`documents-filter-bar ${isSearchExpanded ? 'search-expanded' : ''}`}>
        <div className="filter-pill-wrapper" ref={receivedDropdownRef}>
          <button 
            className="filter-pill"
            onClick={() => handleDropdownToggle('received')}
            aria-expanded={openDropdown === 'received'}
          >
            <span className="filter-pill-title">Received</span>
            <span className={`filter-pill-description ${selectedFilters.received ? 'filter-pill-description-active' : ''}`}>
              {selectedFilters.received 
                ? getFilterLabel('received', selectedFilters.received, getFilterOptions('received'))
                : 'When it was received?'}
            </span>
            <Icon name="chevron-down" size="sm" variant="outline" className="filter-pill-chevron" />
          </button>
          <Dropdown
            isOpen={openDropdown === 'received'}
            onClose={handleDropdownClose}
            options={getFilterOptions('received')}
            selectedValue={selectedFilters.received}
            onSelect={(value) => handleDropdownSelect('received', value)}
            position="bottom"
            align="left"
          />
        </div>
        <div className="filter-pill-wrapper" ref={whenDropdownRef}>
          <button 
            className="filter-pill"
            onClick={() => handleDropdownToggle('when')}
            aria-expanded={openDropdown === 'when'}
          >
            <span className="filter-pill-title">When</span>
            <span className={`filter-pill-description ${selectedFilters.when ? 'filter-pill-description-active' : ''}`}>
              {selectedFilters.when 
                ? getFilterLabel('when', selectedFilters.when, getFilterOptions('when'))
                : 'When it was received?'}
            </span>
            <Icon name="chevron-down" size="sm" variant="outline" className="filter-pill-chevron" />
          </button>
          <Dropdown
            isOpen={openDropdown === 'when'}
            onClose={handleDropdownClose}
            options={getFilterOptions('when')}
            selectedValue={selectedFilters.when}
            onSelect={(value) => handleDropdownSelect('when', value)}
            position="bottom"
            align="left"
          />
        </div>
        <div className="filter-pill-wrapper" ref={whoDropdownRef}>
          <button 
            className="filter-pill"
            onClick={() => handleDropdownToggle('who')}
            aria-expanded={openDropdown === 'who'}
          >
            <span className="filter-pill-title">Who</span>
            <span className={`filter-pill-description ${selectedFilters.who ? 'filter-pill-description-active' : ''}`}>
              {selectedFilters.who 
                ? getFilterLabel('who', selectedFilters.who, getFilterOptions('who'))
                : documentFilter === 'in' 
                  ? 'Who sent the doc?'
                  : documentFilter === 'out'
                  ? 'Who received the doc?'
                  : 'Who sent/received the doc?'}
            </span>
            <Icon name="chevron-down" size="sm" variant="outline" className="filter-pill-chevron" />
          </button>
          <Dropdown
            isOpen={openDropdown === 'who'}
            onClose={handleDropdownClose}
            options={getFilterOptions('who')}
            selectedValue={selectedFilters.who}
            onSelect={(value) => handleDropdownSelect('who', value)}
            position="bottom"
            align="left"
          />
        </div>
        <div className="filter-pill-wrapper" ref={categoryDropdownRef}>
          <button 
            className="filter-pill"
            onClick={() => handleDropdownToggle('category')}
            aria-expanded={openDropdown === 'category'}
          >
            <span className="filter-pill-title">Category</span>
            <span className={`filter-pill-description ${selectedFilters.category ? 'filter-pill-description-active' : ''}`}>
              {selectedFilters.category 
                ? getFilterLabel('category', selectedFilters.category, getFilterOptions('category'))
                : 'What type of doc it is?'}
            </span>
            <Icon name="chevron-down" size="sm" variant="outline" className="filter-pill-chevron" />
          </button>
          <Dropdown
            isOpen={openDropdown === 'category'}
            onClose={handleDropdownClose}
            options={getFilterOptions('category')}
            selectedValue={selectedFilters.category}
            onSelect={(value) => handleDropdownSelect('category', value)}
            position="bottom"
            align="left"
          />
        </div>
        <div className="search-input-wrapper" ref={searchInputRef}>
          <input
            type="text"
            className="search-input"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsSearchExpanded(false);
                setSearchQuery('');
              }
            }}
          />
        </div>
        {hasActiveFilters && (
          <IconButton
            icon="reset"
            variant="default"
            size="sm"
            onClick={handleResetFilters}
            aria-label="Reset all filters"
            className="reset-filters-button"
          />
        )}
        <IconButton
          icon={isSearchExpanded ? "x" : "search"}
          variant="default"
          size="md"
          onClick={handleSearchToggle}
          aria-label={isSearchExpanded ? "Close search" : "Search documents"}
          className="filter-search-button"
        />
        <div className="more-options-wrapper" ref={moreButtonRef}>
          <IconButton
            icon="more"
            variant="default"
            size="md"
            onClick={handleMoreMenuToggle}
            aria-label="More options"
            aria-expanded={isMoreMenuOpen}
            className="more-options-button"
          />
          {isMoreMenuOpen && (
            <div className="more-options-dropdown" ref={moreMenuRef}>
              <button
                className="more-options-item"
                onClick={handleViewModeChange}
              >
                <Icon name={viewMode === 'grid' ? 'folder' : 'grid'} size="sm" variant="filled" />
                <span>{viewMode === 'grid' ? 'Folder View' : 'Grid View'}</span>
              </button>
              <Link
                to="/table-components-showcase"
                className="more-options-item"
                onClick={() => setIsMoreMenuOpen(false)}
              >
                <span>Test Table</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      {viewMode === 'grid' ? (
        <>
          <div className="documents-page-grid">
            {visibleDocuments.map((doc) => (
              <DocumentOverview
                key={doc.documentId}
                documentId={doc.documentId}
                title={doc.title}
                documentNumber={doc.documentNumber}
                date={doc.date}
                documentType={doc.documentType}
                previewContent={doc.previewContent}
                total={doc.total}
                currencySymbol="€"
                isSelected={selectedDocuments.has(doc.documentId)}
                onSelect={handleDocumentSelect}
                searchQuery={searchQuery}
                content={doc.content}
              />
            ))}
          </div>
          {hasMore && (
            <div className="documents-show-more">
              <Button
                variant="default"
                size="md"
                onClick={handleShowMore}
              >
                Show More
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="documents-page-folders">
          {Object.entries(groupedDocuments).map(([category, docs]) => (
            <div key={category} className="document-folder">
              <div className="document-folder-tab">
                <Icon name="folder" size="sm" variant="filled" className="document-folder-tab-icon" />
                <span className="document-folder-tab-label">{category}</span>
                <span className="document-folder-tab-count">{docs.length}</span>
              </div>
              <div className="document-folder-body">
                <div className="document-folder-papers">
                  {docs.slice(-3).reverse().map((doc) => (
                    <div key={doc.documentId} className="document-folder-paper">
                      <div className="document-folder-paper-content">
                        <div className="document-folder-paper-title">{doc.title}</div>
                        <div className="document-folder-paper-meta">{doc.documentNumber}</div>
                      </div>
                    </div>
                  ))}
                  {docs.length > 3 && (
                    <div className="document-folder-paper-more">+{docs.length - 3} more</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="top-action-buttons-container">
        <IconButton
          icon="user"
          variant="default"
          size="lg"
          onClick={() => {}}
          aria-label="Profile"
        />
        <IconButton
          icon="plus"
          variant="primary"
          size="lg"
          onClick={handleCreateNewDocument}
          aria-label="Create new document"
        />
      </div>
      <DocumentTypeSelectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelectDocumentType={handleSelectDocumentType}
      />
    </div>
  );
};

