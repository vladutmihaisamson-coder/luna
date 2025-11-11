import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DocumentOverview } from '../components/DocumentOverview';
import { ClientOverview } from '../components/ClientOverview';
import { TransportDocument } from '../components/TransportDocument';
import { OfferDocument } from '../components/OfferDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import { AgreementDocument } from '../components/AgreementDocument';
import { PurchaseOrderDocument } from '../components/PurchaseOrderDocument';
import { IconButton } from '../components/design-system/molecules/IconButton/IconButton';
import { Icon } from '../components/design-system/atoms/Icon/Icon';
import { Button } from '../components/design-system/atoms/Button/Button';
import { FilterPill } from '../components/design-system';
import { Dropdown } from '../components/design-system/organisms/Dropdown/Dropdown';
import { DocumentTypeSelectionModal } from '../components/DocumentTypeSelectionModal';
import { PDFUploadModal } from '../components/PDFUploadModal';
import { ExtractedDocumentViewer } from '../components/ExtractedDocumentViewer';
import { EmptyState } from '../components/EmptyState';
import { textContainsQuery } from '../utils/textHighlight';
import './DocumentsPage.css';

export const DocumentsPage = () => {
  const navigate = useNavigate();
  // Load saved state from localStorage
  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem('documentsPageState');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved state:', e);
    }
    return null;
  };

  // Save state to localStorage
  const saveState = (state) => {
    try {
      localStorage.setItem('documentsPageState', JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  };

  const savedState = loadSavedState();
  const [viewMode, setViewMode] = useState(savedState?.viewMode || 'grid'); // 'grid' or 'folder'
  const [documentFilter, setDocumentFilter] = useState(savedState?.documentFilter || 'all'); // 'all', 'in', 'out'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPDFUploadModalOpen, setIsPDFUploadModalOpen] = useState(false);
  const [extractedDocument, setExtractedDocument] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(24); // Initial number of documents to show
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [openDropdown, setOpenDropdown] = useState(null); // Track which filter pill dropdown is open
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isFilterPanelClosing, setIsFilterPanelClosing] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState(savedState?.headerSearchQuery || '');
  const [activeTab, setActiveTab] = useState(savedState?.activeTab || 'all'); // 'all', 'latest', 'archived', or 'clients'
  const searchInputRef = useRef(null);
  const moreButtonRef = useRef(null);
  const moreMenuRef = useRef(null);
  const headerSearchInputRef = useRef(null);
  const pageContainerRef = useRef(null);

  const handleCreateNewDocument = () => {
    setIsCreateModalOpen(true);
  };

  const handleSelectDocumentType = (type) => {
    // Generate a new document ID and navigate to a new document of the selected type
    const newDocumentId = `${type}-new-${Date.now()}`;
    navigate(`/document/${newDocumentId}?type=${type}`);
  };

  const handleViewModeChange = () => {
    setViewMode(viewMode === 'grid' ? 'folder' : 'grid');
  };

  // Create filters array for FilterPillGroup based on documentFilter
  const filters = useMemo(() => {
    const isIn = documentFilter === 'in';
    const isOut = documentFilter === 'out';

    return [
      {
        id: 'direction',
        title: 'Direction',
        placeholder: 'All documents',
        options: [
          { value: 'all', label: 'All' },
          { value: 'in', label: 'IN' },
          { value: 'out', label: 'OUT' },
        ],
        selectedValue: documentFilter,
      },
      {
        id: 'when',
        title: 'When',
        placeholder: 'When was it received?',
        options: [
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'this-week', label: 'This Week' },
          { value: 'last-week', label: 'Last Week' },
          { value: 'this-month', label: 'This Month' },
          { value: 'this-year', label: 'This Year' },
        ],
        selectedValue: null,
      },
      {
        id: 'who',
        title: 'Who',
        placeholder: isIn 
          ? 'Who sent the doc?'
          : isOut
          ? 'Who received the doc?'
          : 'Who sent/received the doc?',
        options: isIn
          ? [
              { value: 'all', label: 'All Senders' },
              { value: 'client-1', label: 'SACME' },
              { value: 'client-2', label: 'Brembo S.p.A.' },
              { value: 'client-3', label: 'Thyssenkrupp Materials' },
              { value: 'client-4', label: 'Schaeffler Group' },
              { value: 'client-5', label: 'Bosch Rexroth' },
              { value: 'client-6', label: 'Festo AG' },
              { value: 'client-7', label: 'Siemens Industry' },
              { value: 'client-8', label: 'ABB Automation' },
              { value: 'client-9', label: 'Parker Hannifin' },
            ]
          : isOut
          ? [
              { value: 'all', label: 'All Recipients' },
              { value: 'client-1', label: 'SACME' },
              { value: 'client-2', label: 'Brembo S.p.A.' },
              { value: 'client-3', label: 'Thyssenkrupp Materials' },
              { value: 'client-4', label: 'Schaeffler Group' },
              { value: 'client-5', label: 'Bosch Rexroth' },
              { value: 'client-6', label: 'Festo AG' },
              { value: 'client-7', label: 'Siemens Industry' },
              { value: 'client-8', label: 'ABB Automation' },
              { value: 'client-9', label: 'Parker Hannifin' },
            ]
          : [
              { value: 'all', label: 'All Contacts' },
              { value: 'client-1', label: 'SACME' },
              { value: 'client-2', label: 'Brembo S.p.A.' },
              { value: 'client-3', label: 'Thyssenkrupp Materials' },
              { value: 'client-4', label: 'Schaeffler Group' },
              { value: 'client-5', label: 'Bosch Rexroth' },
              { value: 'client-6', label: 'Festo AG' },
              { value: 'client-7', label: 'Siemens Industry' },
              { value: 'client-8', label: 'ABB Automation' },
              { value: 'client-9', label: 'Parker Hannifin' },
            ],
        selectedValue: null,
      },
      {
        id: 'category',
        title: 'Category',
        placeholder: 'What type of doc it is?',
        options: [
          { value: 'all', label: 'All Types' },
          { value: 'transport', label: 'Transport' },
          { value: 'offer', label: 'Offer' },
          { value: 'invoice', label: 'Invoice' },
          { value: 'agreement', label: 'Agreement' },
          { value: 'purchase-order', label: 'Purchase Order' },
        ],
        selectedValue: null,
      },
    ];
  }, [documentFilter]);

  // Initialize filterState from saved state or filters
  const [filterState, setFilterState] = useState(() => {
    if (savedState?.filterState) {
      // Merge saved filter state with current filters structure
      return filters.map(newFilter => {
        const savedFilter = savedState.filterState.find(f => f.id === newFilter.id);
        if (savedFilter && savedFilter.selectedValue !== null) {
          const optionExists = newFilter.options.some(opt => opt.value === savedFilter.selectedValue);
          if (optionExists) {
            return { ...newFilter, selectedValue: savedFilter.selectedValue };
          }
        }
        return newFilter;
      });
    }
    return filters;
  });

  // Update filter state when filters array changes (documentFilter changes)
  // Preserve selected values for filters that don't depend on direction
  useEffect(() => {
    setFilterState(prev => {
      return filters.map(newFilter => {
        const oldFilter = prev.find(f => f.id === newFilter.id);
        // For direction filter, always use the new value
        if (newFilter.id === 'direction') {
          return newFilter;
        }
        // For other filters, preserve the selected value if it's still valid
        if (oldFilter && oldFilter.selectedValue !== null) {
          const optionExists = newFilter.options.some(opt => opt.value === oldFilter.selectedValue);
          if (optionExists) {
            return { ...newFilter, selectedValue: oldFilter.selectedValue };
          }
        }
        return newFilter;
      });
    });
  }, [filters]);

  const handleFilterChange = (filterId, value) => {
    // Handle direction filter separately to update documentFilter
    // The useEffect will update filterState when documentFilter changes
    if (filterId === 'direction') {
      setDocumentFilter(value);
      setOpenDropdown(null);
      return; // Don't update filterState directly, let useEffect handle it
    }
    
    setFilterState(prev => 
      prev.map(filter => 
        filter.id === filterId 
          ? { ...filter, selectedValue: value }
          : filter
      )
    );
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (filterId) => {
    setOpenDropdown(openDropdown === filterId ? null : filterId);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const handleMoreMenuToggle = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleResetFilters = () => {
    setDocumentFilter('all');
    setFilterState(prev => 
      prev.map(filter => 
        filter.id === 'direction' 
          ? { ...filter, selectedValue: 'all' }
          : { ...filter, selectedValue: null }
      )
    );
    setSearchQuery('');
    setHeaderSearchQuery('');
    setIsSearchExpanded(false);
  };

  // Get selected filter values for filtering logic
  const selectedFilters = useMemo(() => {
    return {
      when: filterState.find(f => f.id === 'when')?.selectedValue || null,
      who: filterState.find(f => f.id === 'who')?.selectedValue || null,
      category: filterState.find(f => f.id === 'category')?.selectedValue || null,
    };
  }, [filterState]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    const hasFilterSelected = filterState.some(filter => {
      const value = filter.selectedValue;
      // For direction filter, check if it's not 'all'
      if (filter.id === 'direction') {
        return value !== null && value !== undefined && value !== 'all';
      }
      // For other filters, check if any value is selected
      return value !== null && value !== undefined && value !== 'all';
    });
    const hasSearchQuery = (searchQuery && searchQuery.trim().length > 0) || 
                           (headerSearchQuery && headerSearchQuery.trim().length > 0);
    return hasFilterSelected || hasSearchQuery;
  }, [filterState, searchQuery, headerSearchQuery]);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Save state to localStorage whenever key state changes
  useEffect(() => {
    const stateToSave = {
      activeTab,
      headerSearchQuery,
      documentFilter,
      viewMode,
      filterState: filterState.map(f => ({ id: f.id, selectedValue: f.selectedValue }))
    };
    saveState(stateToSave);
  }, [activeTab, headerSearchQuery, documentFilter, viewMode, filterState]);

  // Restore scroll position on mount
  useEffect(() => {
    if (savedState?.scrollPosition && pageContainerRef.current) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        window.scrollTo(0, savedState.scrollPosition);
      }, 100);
    }
  }, []); // Only run on mount

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      const currentState = {
        activeTab,
        headerSearchQuery,
        documentFilter,
        viewMode,
        filterState: filterState.map(f => ({ id: f.id, selectedValue: f.selectedValue })),
        scrollPosition
      };
      saveState(currentState);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [activeTab, headerSearchQuery, documentFilter, viewMode, filterState]);

  // Close dropdowns and menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target) &&
          moreButtonRef.current && !moreButtonRef.current.contains(event.target)) {
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
    { documentId: "test-doc-001", title: "TEST_CLIENT_QA_001", documentNumber: "TEST-2025-001", date: "Nov 9, 2025", dateObj: parseDate("Nov 9, 2025"), documentType: "Transport", clientId: "test-client-1", direction: "out", content: "Test document for QA purposes. This is a sample transport document used for testing the document management system functionality.", previewContent: <TransportDocument />, needsAttention: false, signatureStatus: null, lastModified: "Nov 9, 2025", isEditable: true },
    { documentId: "offer-001", title: "SACME", documentNumber: "OF-2025-001", date: "Nov 7, 2025", dateObj: parseDate("Nov 7, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 125000.00, content: "Hydraulic Powder Compaction Press HPC-500, Automated Control System, Press Tooling Set, Installation Service, Spare Parts Package, Technical Documentation.", previewContent: <OfferDocument />, needsAttention: true, signatureStatus: "Awaiting Signature", lastModified: "Nov 7, 2025", isEditable: true },
    { documentId: "fattura-001", title: "Brembo S.p.A.", documentNumber: "FT-2025-001", date: "Nov 6, 2025", dateObj: parseDate("Nov 6, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 87500.00, content: "Mechanical Press Rebuild Service, Control System Upgrade, New Hydraulic Pumps, Safety Interlocks Installation, Operator Training.", previewContent: <FatturaDocument />, needsAttention: true },
    { documentId: "transport-001", title: "Thyssenkrupp Materials", documentNumber: "TD-2025-001", date: "Nov 5, 2025", dateObj: parseDate("Nov 5, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Hydraulic Press HPC-300 Unit, Hydraulic System Components, Control Panel Assembly, Installation Tools, Press Tooling, Spare Parts Package, Technical Documentation, Safety Equipment.", previewContent: <TransportDocument /> },
    { documentId: "agreement-001", title: "Schaeffler Group", documentNumber: "AG-2025-001", date: "Nov 4, 2025", dateObj: parseDate("Nov 4, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 6, content: "Retrofitting agreement for mechanical press upgrade. Includes modernization of control system, safety upgrades, and performance optimization.", previewContent: <AgreementDocument />, needsAttention: true, signatureStatus: "Pending", lastModified: "Nov 4, 2025", isEditable: false },
    { documentId: "offer-002", title: "Industrial Press Systems", documentNumber: "OF-2025-002", date: "Nov 3, 2025", dateObj: parseDate("Nov 3, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 95000.00, content: "Used mechanical powder compaction press MPC-400. Recently rebuilt, includes full documentation and 6-month warranty.", previewContent: <OfferDocument /> },
    { documentId: "fattura-002", title: "Compaction Equipment Inc.", documentNumber: "FT-2025-002", date: "Nov 2, 2025", dateObj: parseDate("Nov 2, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 45000.00, content: "Press retrofitting service. Control system upgrade, new hydraulic pumps, safety interlocks installation, operator training.", previewContent: <FatturaDocument /> },
    { documentId: "transport-002", title: "Material Processing Corp.", documentNumber: "TD-2025-002", date: "Nov 1, 2025", dateObj: parseDate("Nov 1, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Shipment of new hydraulic compaction press HPC-600. Complete system with tooling, spare parts package, and technical documentation.", previewContent: <TransportDocument /> },
    { documentId: "offer-003", title: "Precision Press Manufacturing", documentNumber: "OF-2025-003", date: "Oct 31, 2025", dateObj: parseDate("Oct 31, 2025"), documentType: "Offer", clientId: "client-1", direction: "in", total: 65000.00, content: "Purchase offer for used hydraulic press HPC-250. Includes inspection, dismantling, and transport to our facility.", previewContent: <OfferDocument /> },
    { documentId: "fattura-003", title: "Press Rebuild Services", documentNumber: "FT-2025-003", date: "Oct 30, 2025", dateObj: parseDate("Oct 30, 2025"), documentType: "Invoice", clientId: "client-2", direction: "in", total: 32000.00, content: "Invoice for press rebuild service received. Complete overhaul of mechanical press including new components and testing.", previewContent: <FatturaDocument /> },
    { documentId: "transport-003", title: "Heavy Equipment Logistics", documentNumber: "TD-2025-003", date: "Oct 29, 2025", dateObj: parseDate("Oct 29, 2025"), documentType: "Transport", clientId: "client-3", direction: "in", content: "Received shipment of used mechanical press MPC-350. Press requires inspection and rebuild before resale.", previewContent: <TransportDocument /> },
    { documentId: "agreement-002", title: "Custom Press Solutions", documentNumber: "AG-2025-002", date: "Oct 28, 2025", dateObj: parseDate("Oct 28, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 5, content: "Construction agreement for custom hydraulic press. Design specifications, manufacturing timeline, delivery terms, and warranty conditions.", previewContent: <AgreementDocument />, signatureStatus: "Signed", lastModified: "Oct 29, 2025", isEditable: false },
    { documentId: "offer-004", title: "Powder Processing Equipment", documentNumber: "OF-2025-004", date: "Oct 27, 2025", dateObj: parseDate("Oct 27, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 78000.00, content: "Rebuilt mechanical press MPC-500. Complete restoration with new bearings, seals, and updated control system. Ready for immediate use.", previewContent: <OfferDocument /> },
    { documentId: "fattura-004", title: "Compaction Systems Ltd.", documentNumber: "FT-2025-004", date: "Oct 26, 2025", dateObj: parseDate("Oct 26, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 55000.00, content: "Retrofitting service invoice. Modernization of hydraulic press control system, installation of new safety features, and performance testing.", previewContent: <FatturaDocument /> },
    { documentId: "transport-004", title: "Industrial Machinery Transport", documentNumber: "TD-2025-004", date: "Oct 25, 2025", dateObj: parseDate("Oct 25, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Delivery of retrofitted hydraulic press HPC-400. Includes updated control panel, new hydraulic components, and installation support.", previewContent: <TransportDocument /> },
    { documentId: "offer-005", title: "Press Equipment Suppliers", documentNumber: "OF-2025-005", date: "Oct 24, 2025", dateObj: parseDate("Oct 24, 2025"), documentType: "Offer", clientId: "client-1", direction: "in", total: 42000.00, content: "Offer to purchase used mechanical press MPC-200. Press requires rebuild but has good structural condition and original tooling.", previewContent: <OfferDocument /> },
    { documentId: "fattura-005", title: "Equipment Restoration Services", documentNumber: "FT-2025-005", date: "Oct 23, 2025", dateObj: parseDate("Oct 23, 2025"), documentType: "Invoice", clientId: "client-2", direction: "in", total: 28000.00, content: "Received invoice for press inspection and assessment service. Complete evaluation of mechanical press condition and rebuild recommendations.", previewContent: <FatturaDocument /> },
    { documentId: "transport-005", title: "Specialized Cargo Services", documentNumber: "TD-2025-005", date: "Oct 22, 2025", dateObj: parseDate("Oct 22, 2025"), documentType: "Transport", clientId: "client-3", direction: "in", content: "Received hydraulic press HPC-180 for rebuild. Press includes original documentation and tooling. Scheduled for complete restoration.", previewContent: <TransportDocument /> },
    { documentId: "agreement-003", title: "Press Modernization Partners", documentNumber: "AG-2025-003", date: "Oct 21, 2025", dateObj: parseDate("Oct 21, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 7, content: "Service agreement for press modernization project. Includes design review, component upgrades, installation, and operator training program.", previewContent: <AgreementDocument /> },
    { documentId: "po-001", title: "Bosch Rexroth", documentNumber: "PO-2025-001", date: "Nov 8, 2025", dateObj: parseDate("Nov 8, 2025"), documentType: "Purchase Order", clientId: "client-5", direction: "in", itemCount: 12, content: "Hydraulic Cylinder Seal Kit, Pressure Relief Valve, Control Panel Circuit Board, Hydraulic Oil Filter Element, Pneumatic Fittings Set, Steel Guide Rails, Safety Interlock Switch, Hydraulic Pump Replacement, Electrical Cable Harness, Tooling Inserts, Lubrication System Components, Control Software License.", previewContent: <PurchaseOrderDocument />, signatureStatus: "Signed", lastModified: "Nov 8, 2025", isEditable: false },
    { documentId: "po-002", title: "Festo AG", documentNumber: "PO-2025-002", date: "Nov 5, 2025", dateObj: parseDate("Nov 5, 2025"), documentType: "Purchase Order", clientId: "client-6", direction: "in", itemCount: 15, content: "Hydraulic Seals, Pressure Gauges, Control Valves, Oil Filters, Pneumatic Cylinders, Steel Bearings, Safety Switches, Hydraulic Pumps, Electrical Connectors, Tooling Components, Lubrication Pumps, Control Modules, Sensor Arrays, Actuator Systems, Maintenance Kits.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "po-003", title: "Siemens Industry", documentNumber: "PO-2025-003", date: "Nov 2, 2025", dateObj: parseDate("Nov 2, 2025"), documentType: "Purchase Order", clientId: "client-7", direction: "in", itemCount: 10, content: "Hydraulic Hoses, Pressure Sensors, Control Panels, Filter Housings, Pneumatic Valves, Guide Rails, Safety Relays, Pump Motors, Cable Assemblies, Tooling Fixtures.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "po-004", title: "ABB Automation", documentNumber: "PO-2025-004", date: "Oct 30, 2025", dateObj: parseDate("Oct 30, 2025"), documentType: "Purchase Order", clientId: "client-8", direction: "in", itemCount: 14, content: "Hydraulic Cylinders, Pressure Switches, Control Valves, Filter Cartridges, Pneumatic Fittings, Steel Rods, Safety Sensors, Pump Assemblies, Electrical Wires, Tooling Plates, Lubrication Systems, Control Boards, Position Sensors, Actuator Motors.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "po-005", title: "Parker Hannifin", documentNumber: "PO-2025-005", date: "Oct 28, 2025", dateObj: parseDate("Oct 28, 2025"), documentType: "Purchase Order", clientId: "client-9", direction: "in", itemCount: 11, content: "Hydraulic Fittings, Pressure Transducers, Control Modules, Oil Filters, Pneumatic Actuators, Guide Blocks, Safety Buttons, Hydraulic Motors, Cable Ties, Tooling Clamps, Lubrication Pumps.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "offer-006", title: "Advanced Compaction Systems", documentNumber: "OF-2025-006", date: "Oct 20, 2025", dateObj: parseDate("Oct 20, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 135000.00, content: "New hydraulic powder compaction press HPC-700. Latest model with advanced control system, automated tooling, and comprehensive warranty.", previewContent: <OfferDocument /> },
    { documentId: "fattura-006", title: "Press Maintenance Experts", documentNumber: "FT-2025-006", date: "Oct 19, 2025", dateObj: parseDate("Oct 19, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 38000.00, content: "Press rebuild service completed. Full restoration including new hydraulic system, updated controls, safety upgrades, and performance certification.", previewContent: <FatturaDocument /> },
    { documentId: "transport-006", title: "Heavy Machinery Haulers", documentNumber: "TD-2025-006", date: "Oct 18, 2025", dateObj: parseDate("Oct 18, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Delivery of custom-built mechanical press MPC-600. Special order with enhanced features, includes installation and commissioning services.", previewContent: <TransportDocument /> },
    { documentId: "offer-007", title: "Used Press Marketplace", documentNumber: "OF-2025-007", date: "Oct 17, 2025", dateObj: parseDate("Oct 17, 2025"), documentType: "Offer", clientId: "client-1", direction: "in", total: 35000.00, content: "Purchase offer for mechanical press MPC-150. Press requires rebuild but includes original tooling and technical documentation.", previewContent: <OfferDocument /> },
    { documentId: "fattura-007", title: "Equipment Inspection Services", documentNumber: "FT-2025-007", date: "Oct 16, 2025", dateObj: parseDate("Oct 16, 2025"), documentType: "Invoice", clientId: "client-2", direction: "in", total: 15000.00, content: "Received invoice for press evaluation service. Technical assessment, condition report, and rebuild cost estimate for hydraulic press.", previewContent: <FatturaDocument /> },
    { documentId: "transport-007", title: "Industrial Transport Solutions", documentNumber: "TD-2025-007", date: "Oct 15, 2025", dateObj: parseDate("Oct 15, 2025"), documentType: "Transport", clientId: "client-3", direction: "in", content: "Received used hydraulic press HPC-200 for rebuild. Press arrives with partial documentation. Scheduled for complete restoration and upgrade.", previewContent: <TransportDocument /> },
    { documentId: "agreement-004", title: "Press Construction Services", documentNumber: "AG-2025-004", date: "Oct 14, 2025", dateObj: parseDate("Oct 14, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 8, content: "Construction agreement for new mechanical press. Custom specifications, manufacturing schedule, quality standards, delivery terms, and warranty coverage.", previewContent: <AgreementDocument /> },
    { documentId: "offer-008", title: "Rebuilt Press Specialists", documentNumber: "OF-2025-008", date: "Oct 13, 2025", dateObj: parseDate("Oct 13, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 68000.00, content: "Fully rebuilt mechanical press MPC-300. Complete restoration with new components, updated safety systems, and 12-month warranty included.", previewContent: <OfferDocument /> },
    { documentId: "fattura-008", title: "Press Retrofit Solutions", documentNumber: "FT-2025-008", date: "Oct 12, 2025", dateObj: parseDate("Oct 12, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 52000.00, content: "Retrofitting service invoice. Control system modernization, hydraulic upgrades, safety enhancements, and comprehensive testing completed.", previewContent: <FatturaDocument /> },
    { documentId: "transport-008", title: "Machinery Delivery Services", documentNumber: "TD-2025-008", date: "Oct 11, 2025", dateObj: parseDate("Oct 11, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Delivery of rebuilt hydraulic press HPC-450. Includes updated control system, new hydraulic components, tooling, and installation support.", previewContent: <TransportDocument /> },
    { documentId: "offer-009", title: "Press Equipment Brokers", documentNumber: "OF-2025-009", date: "Oct 10, 2025", dateObj: parseDate("Oct 10, 2025"), documentType: "Offer", clientId: "client-1", direction: "in", total: 48000.00, content: "Purchase offer for used hydraulic press HPC-350. Press requires rebuild but has complete tooling set and original documentation.", previewContent: <OfferDocument /> },
    { documentId: "fattura-009", title: "Press Rebuild Contractors", documentNumber: "FT-2025-009", date: "Oct 9, 2025", dateObj: parseDate("Oct 9, 2025"), documentType: "Invoice", clientId: "client-2", direction: "in", total: 25000.00, content: "Received invoice for press rebuild service. Complete overhaul including new bearings, seals, hydraulic components, and control system updates.", previewContent: <FatturaDocument /> },
    { documentId: "transport-009", title: "Heavy Equipment Movers", documentNumber: "TD-2025-009", date: "Oct 8, 2025", dateObj: parseDate("Oct 8, 2025"), documentType: "Transport", clientId: "client-3", direction: "in", content: "Received mechanical press MPC-250 for restoration. Press includes original tooling and technical manuals. Scheduled for complete rebuild.", previewContent: <TransportDocument /> },
    { documentId: "agreement-005", title: "Press Engineering Services", documentNumber: "AG-2025-005", date: "Oct 7, 2025", dateObj: parseDate("Oct 7, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 6, content: "Retrofitting agreement for hydraulic press upgrade. Includes design modifications, component replacement, installation, and operator training.", previewContent: <AgreementDocument />, archived: true },
    { documentId: "offer-010", title: "Vintage Press Collection", documentNumber: "OF-2024-001", date: "Sep 15, 2024", dateObj: parseDate("Sep 15, 2024"), documentType: "Offer", clientId: "client-1", direction: "out", total: 25000.00, content: "Vintage mechanical press from 1980s. Fully functional but requires modernization.", previewContent: <OfferDocument />, archived: true },
    { documentId: "fattura-010", title: "Legacy Equipment Services", documentNumber: "FT-2024-002", date: "Sep 10, 2024", dateObj: parseDate("Sep 10, 2024"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 18000.00, content: "Historical press restoration service completed. Preserved original components and documentation.", previewContent: <FatturaDocument />, archived: true },
    { documentId: "transport-010", title: "Archive Transport Services", documentNumber: "TD-2024-003", date: "Sep 5, 2024", dateObj: parseDate("Sep 5, 2024"), documentType: "Transport", clientId: "client-3", direction: "in", content: "Archived press unit received for historical preservation. Documented and stored in archive facility.", previewContent: <TransportDocument />, archived: true },
  ];

  // Filter documents based on selected filters
  const filteredDocuments = useMemo(() => {
    let filtered = [...documents];

    // Filter by tab (latest, all, archived, or clients)
    if (activeTab === 'latest') {
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      filtered = filtered.filter(doc => doc.dateObj >= sevenDaysAgo && !doc.archived);
      // Sort by date (newest first)
      filtered = filtered.sort((a, b) => b.dateObj - a.dateObj);
    } else if (activeTab === 'archived') {
      filtered = filtered.filter(doc => doc.archived === true);
      // Sort by date (newest first)
      filtered = filtered.sort((a, b) => b.dateObj - a.dateObj);
    } else if (activeTab === 'clients') {
      // For 'clients' tab, exclude archived documents and sort by client name, then by date
      filtered = filtered.filter(doc => !doc.archived);
      filtered = filtered.sort((a, b) => {
        // First sort by client name (title), then by date (newest first)
        if (a.title !== b.title) {
          return a.title.localeCompare(b.title);
        }
        return b.dateObj - a.dateObj;
      });
    } else {
      // For 'all' tab, exclude archived documents and sort by date (newest first)
      filtered = filtered.filter(doc => !doc.archived);
      filtered = filtered.sort((a, b) => b.dateObj - a.dateObj);
    }

    // Filter by IN/OUT/ALL toggle
    if (documentFilter !== 'all') {
      filtered = filtered.filter(doc => doc.direction === documentFilter);
    }

    // Filter by search query (from filter pill or header search)
    const combinedSearchQuery = (searchQuery || headerSearchQuery || '').trim();
    if (combinedSearchQuery) {
      const query = combinedSearchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.documentNumber.toLowerCase().includes(query) ||
        doc.documentType.toLowerCase().includes(query) ||
        (doc.content && textContainsQuery(doc.content, query))
      );
    }

    // Filter by "when" (date range)
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
          case 'this-year':
            return date.getFullYear() === now.getFullYear();
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
        'invoice': 'Invoice',
        'agreement': 'Agreement',
        'purchase-order': 'Purchase Order'
      };
      const documentType = typeMap[selectedFilters.category];
      if (documentType) {
        filtered = filtered.filter(doc => doc.documentType === documentType);
      }
    }

    return filtered;
  }, [documents, documentFilter, selectedFilters, searchQuery, headerSearchQuery, activeTab]);

  const visibleDocuments = useMemo(() => {
    return filteredDocuments.slice(0, itemsToShow);
  }, [filteredDocuments, itemsToShow]);

  // Client address and contact details mapping
  const clientDetailsMap = {
    'SACME': {
      address: 'Via Industriale 45, 20121 Milano, Italy',
      phone: '+39 02 1234 5678',
      email: 'contact@sacme.it'
    },
    'Brembo S.p.A.': {
      address: 'Via Brembo 25, 24035 Curno, Italy',
      phone: '+39 035 605 111',
      email: 'info@brembo.com'
    },
    'Thyssenkrupp Materials': {
      address: 'Thyssenkrupp Allee 1, 45143 Essen, Germany',
      phone: '+49 201 844 0',
      email: 'info@thyssenkrupp.com'
    },
    'Schaeffler Group': {
      address: 'Industriestraße 1-3, 91074 Herzogenaurach, Germany',
      phone: '+49 9132 82 0',
      email: 'info@schaeffler.com'
    },
    'Bosch Rexroth': {
      address: 'Glockeraustraße 2, 89275 Elchingen, Germany',
      phone: '+49 7308 81 0',
      email: 'info@boschrexroth.de'
    },
    'Festo AG': {
      address: 'Ruiter Straße 82, 73734 Esslingen, Germany',
      phone: '+49 711 347 0',
      email: 'info@festo.com'
    },
    'Industrial Press Systems': {
      address: '123 Manufacturing Blvd, Detroit, MI 48201, USA',
      phone: '+1 313 555 0123',
      email: 'sales@industrialpress.com'
    },
    'Compaction Equipment Inc.': {
      address: '456 Industrial Way, Chicago, IL 60601, USA',
      phone: '+1 312 555 0456',
      email: 'info@compactionequip.com'
    },
    'Material Processing Corp.': {
      address: '789 Factory Street, Pittsburgh, PA 15201, USA',
      phone: '+1 412 555 0789',
      email: 'contact@materialprocessing.com'
    },
    'Precision Press Manufacturing': {
      address: '321 Production Avenue, Cleveland, OH 44101, USA',
      phone: '+1 216 555 0321',
      email: 'sales@precisionpress.com'
    },
    'Press Rebuild Services': {
      address: '654 Service Road, Milwaukee, WI 53201, USA',
      phone: '+1 414 555 0654',
      email: 'info@pressrebuild.com'
    },
    'Heavy Equipment Logistics': {
      address: '987 Transport Lane, Columbus, OH 43201, USA',
      phone: '+1 614 555 0987',
      email: 'contact@heavylogistics.com'
    },
    'Custom Press Solutions': {
      address: '147 Engineering Drive, Cincinnati, OH 45201, USA',
      phone: '+1 513 555 0147',
      email: 'info@custompress.com'
    },
    'Powder Processing Equipment': {
      address: '258 Processing Way, Indianapolis, IN 46201, USA',
      phone: '+1 317 555 0258',
      email: 'sales@powderprocessing.com'
    },
    'Compaction Systems Ltd.': {
      address: '369 Systems Street, Toronto, ON M5H 2N2, Canada',
      phone: '+1 416 555 0369',
      email: 'info@compactionsystems.ca'
    },
    'Press Equipment Suppliers': {
      address: '741 Supply Boulevard, Montreal, QC H3A 0G4, Canada',
      phone: '+1 514 555 0741',
      email: 'contact@pressequipment.ca'
    },
    'Equipment Restoration Services': {
      address: '852 Restoration Road, Vancouver, BC V6B 1A1, Canada',
      phone: '+1 604 555 0852',
      email: 'info@restorationservices.ca'
    },
    'Specialized Cargo Services': {
      address: '963 Cargo Avenue, Calgary, AB T2P 1J4, Canada',
      phone: '+1 403 555 0963',
      email: 'contact@specializedcargo.ca'
    },
    'Press Modernization Partners': {
      address: '159 Modernization Drive, Ottawa, ON K1A 0A6, Canada',
      phone: '+1 613 555 0159',
      email: 'info@modernizationpartners.ca'
    },
    'Legacy Equipment Services': {
      address: '357 Legacy Lane, Boston, MA 02101, USA',
      phone: '+1 617 555 0357',
      email: 'info@legacyequipment.com'
    },
    'Archive Transport Services': {
      address: '741 Archive Street, Philadelphia, PA 19101, USA',
      phone: '+1 215 555 0741',
      email: 'contact@archivetransport.com'
    }
  };

  // Extract unique clients from documents
  const clients = useMemo(() => {
    if (activeTab !== 'clients') return [];
    
    const clientMap = new Map();
    
    documents.forEach(doc => {
      if (doc.archived) return; // Skip archived documents
      
      const clientKey = doc.clientId || doc.title;
      if (!clientMap.has(clientKey)) {
        clientMap.set(clientKey, {
          clientId: doc.clientId || clientKey,
          clientName: doc.title,
          documents: [],
          totalValue: 0,
          documentTypes: new Set()
        });
      }
      
      const client = clientMap.get(clientKey);
      client.documents.push(doc);
      if (doc.total) {
        client.totalValue += doc.total;
      }
      if (doc.documentType) {
        client.documentTypes.add(doc.documentType);
      }
    });
    
    // Convert to array and calculate additional info
    return Array.from(clientMap.values()).map(client => {
      const sortedDocs = client.documents.sort((a, b) => b.dateObj - a.dateObj);
      const clientDetails = clientDetailsMap[client.clientName] || {};
      // Ensure address is always present - use client name as fallback if not in map
      const address = clientDetails.address || `${client.clientName}, Location TBD`;
      return {
        clientId: client.clientId,
        clientName: client.clientName,
        documentCount: client.documents.length,
        totalValue: client.totalValue,
        lastDocumentDate: sortedDocs[0]?.date || '',
        documentTypes: Array.from(client.documentTypes),
        address: address,
        phone: clientDetails.phone,
        email: clientDetails.email
      };
    }).sort((a, b) => a.clientName.localeCompare(b.clientName));
  }, [documents, activeTab]);

  const groupedDocuments = useMemo(() => {
    const groups = {
      Transport: [],
      Offer: [],
      Invoice: []
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

  const handleUnselectAll = () => {
    setSelectedDocuments(new Set());
  };

  const handleSelectAll = () => {
    const allDocumentIds = new Set(visibleDocuments.map(doc => doc.documentId));
    setSelectedDocuments(allDocumentIds);
  };

  const handleArchive = () => {
    const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.documentId));
    console.log('Archiving documents:', selectedDocs.map(doc => doc.documentId));
    // TODO: Implement archive functionality
    // For now, just clear selection after archiving
    setSelectedDocuments(new Set());
  };

  const handleDownload = () => {
    const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.documentId));
    console.log('Downloading documents:', selectedDocs.map(doc => doc.documentId));
    // TODO: Implement batch download functionality
    // For now, navigate to each document and trigger download, or implement batch PDF generation
    selectedDocs.forEach(doc => {
      // Could navigate to document and trigger download, or implement batch processing
      console.log(`Would download: ${doc.documentId}`);
    });
  };

  const handlePrint = () => {
    const selectedDocs = documents.filter(doc => selectedDocuments.has(doc.documentId));
    console.log('Printing documents:', selectedDocs.map(doc => doc.documentId));
    // TODO: Implement batch print functionality
    // For now, could open print dialogs or generate a combined PDF
    if (selectedDocs.length > 0) {
      // Open each document in a new window and print, or implement batch printing
      selectedDocs.forEach(doc => {
        const url = `/documents/${doc.documentId}?type=${doc.documentType}`;
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            setTimeout(() => {
              printWindow.print();
            }, 500);
          };
        }
      });
    }
  };


  const handlePDFUpload = () => {
    setIsPDFUploadModalOpen(true);
  };

  const handleDocumentExtracted = (extractedData) => {
    setExtractedDocument(extractedData);
    setIsPDFUploadModalOpen(false);
  };

  const handleExtractedDocumentSave = (documentData) => {
    // Here you can save the extracted document to your documents list
    // For now, we'll just close the viewer
    console.log('Saving extracted document:', documentData);
    setExtractedDocument(null);
  };

  const handleExtractedDocumentClose = () => {
    setExtractedDocument(null);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setItemsToShow(24);
  }, [documentFilter, selectedFilters, searchQuery]);


  return (
    <div className="documents-page" ref={pageContainerRef}>
      <div className="documents-top-bar">
        <div className="luna-logo">
          <div className="luna-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.752 15.002A9.717 9.717 0 0 1 12 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.598.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" fill="currentColor"/>
            </svg>
          </div>
          <span className="luna-logo-text">Luna</span>
        </div>
        
        <div className="header-search-container">
          <div className="header-search-input-wrapper">
            <Icon name="search" size="sm" variant="outline" />
            <input
              ref={headerSearchInputRef}
              type="text"
              className="header-search-input"
              placeholder="Search documents..."
              value={headerSearchQuery}
              onChange={(e) => setHeaderSearchQuery(e.target.value)}
            />
            {headerSearchQuery && (
              <button
                className="header-search-clear"
                onClick={() => {
                  setHeaderSearchQuery('');
                  headerSearchInputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <Icon name="x" size="sm" variant="outline" />
              </button>
            )}
          </div>
        </div>
        
        <div className="top-action-buttons-container">
          <IconButton
            icon="user"
            variant="ghost"
            size="lg"
            onClick={() => {}}
            aria-label="Profile"
          />
          <IconButton
            icon="upload"
            variant="ghost"
            size="lg"
            onClick={handlePDFUpload}
            aria-label="Upload PDF document"
          />
          <IconButton
            icon="plus"
            variant="primary"
            size="xl"
            onClick={handleCreateNewDocument}
            aria-label="Create new document"
          />
        </div>
      </div>
      <div className="documents-content-section">
        <div className="documents-content-container">
          <div className="documents-content-container-left">
            <div className="documents-tabs">
              <button
                className={`documents-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`documents-tab ${activeTab === 'latest' ? 'active' : ''}`}
                onClick={() => setActiveTab('latest')}
              >
                Latest
              </button>
              <button
                className={`documents-tab ${activeTab === 'archived' ? 'active' : ''}`}
                onClick={() => setActiveTab('archived')}
              >
                Archived
              </button>
              <button
                className={`documents-tab ${activeTab === 'clients' ? 'active' : ''}`}
                onClick={() => setActiveTab('clients')}
              >
                Clients
              </button>
            </div>
          </div>
          <div className="documents-content-container-right">
            {(isFilterPanelOpen || isFilterPanelClosing) && (
              <div className={`documents-filter-fields-container ${isFilterPanelClosing ? 'closing' : ''}`}>
                {filterState.map((filter) => (
                  <div key={filter.id} className="documents-filter-field">
                    <select
                      className="documents-filter-select"
                      value={filter.selectedValue || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value || null)}
                    >
                      <option value="">{filter.placeholder}</option>
                      {filter.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
            {hasActiveFilters && (
              <IconButton
                icon="reset"
                variant="ghost"
                size="lg"
                onClick={handleResetFilters}
                aria-label="Clear all filters"
              />
            )}
            <div className="filters-button-wrapper">
              <IconButton
                icon={isFilterPanelOpen ? "x" : "sliders"}
                variant="ghost"
                size="lg"
                onClick={() => {
                  if (isFilterPanelOpen) {
                    setIsFilterPanelClosing(true);
                    setTimeout(() => {
                      setIsFilterPanelOpen(false);
                      setIsFilterPanelClosing(false);
                    }, 300);
                  } else {
                    setIsFilterPanelOpen(true);
                  }
                }}
                aria-label={isFilterPanelOpen ? "Close filters" : "Filters"}
              />
              {hasActiveFilters && !isFilterPanelOpen && (
                <span className="filters-button-dot" aria-label="Filters active"></span>
              )}
            </div>
            {selectedDocuments.size > 0 && (
              <>
                <IconButton
                  icon="archive"
                  variant="ghost"
                  size="lg"
                  onClick={handleArchive}
                  aria-label="Archive selected documents"
                />
                <IconButton
                  icon="download"
                  variant="ghost"
                  size="lg"
                  onClick={handleDownload}
                  aria-label="Download selected documents"
                />
                <IconButton
                  icon="print"
                  variant="ghost"
                  size="lg"
                  onClick={handlePrint}
                  aria-label="Print selected documents"
                />
                <Button
                  icon="x"
                  variant="ghost"
                  size="lg"
                  onClick={handleUnselectAll}
                  aria-label={`Unselect ${selectedDocuments.size} document${selectedDocuments.size !== 1 ? 's' : ''}`}
                >
                  Unselect ({selectedDocuments.size})
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {viewMode === 'grid' ? (
        <>
          {activeTab === 'clients' ? (
            <>
              {clients.length === 0 ? (
                <EmptyState
                  icon="user"
                  title="No clients found"
                  message="No clients found in your documents."
                  action={
                    <Button
                      variant="primary"
                      size="md"
                      icon="plus"
                      onClick={handleCreateNewDocument}
                    >
                      Create Document
                    </Button>
                  }
                />
              ) : (
                <>
                  <div className="documents-page-grid">
                    {clients.map((client) => (
                      <ClientOverview
                        key={client.clientId}
                        clientId={client.clientId}
                        clientName={client.clientName}
                        documentCount={client.documentCount}
                        totalValue={client.totalValue}
                        currencySymbol="€"
                        lastDocumentDate={client.lastDocumentDate}
                        documentTypes={client.documentTypes}
                        address={client.address}
                        phone={client.phone}
                        email={client.email}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {visibleDocuments.length === 0 ? (
                <EmptyState
                  icon="file-text"
                  title={activeTab === 'archived' ? 'No archived documents' : activeTab === 'latest' ? 'No recent documents' : 'No documents found'}
                  message={
                    activeTab === 'archived' 
                      ? 'You don\'t have any archived documents yet.'
                      : activeTab === 'latest'
                      ? 'No documents were created in the last 7 days.'
                      : searchQuery || Object.keys(selectedFilters).length > 0
                      ? 'Try adjusting your search or filters to see more results.'
                      : 'Get started by creating your first document.'
                  }
                  action={
                    !searchQuery && Object.keys(selectedFilters).length === 0 && (
                      <Button
                        variant="primary"
                        size="md"
                        icon="plus"
                        onClick={handleCreateNewDocument}
                      >
                        Create Document
                      </Button>
                    )
                  }
                />
              ) : (
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
                        itemCount={doc.itemCount}
                        direction={doc.direction}
                        needsAttention={doc.needsAttention}
                        signatureStatus={doc.signatureStatus}
                        lastModified={doc.lastModified}
                        isEditable={doc.isEditable}
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
              )}
            </>
          )}
        </>
      ) : (
        <div className="documents-page-folders">
          {Object.keys(groupedDocuments).length === 0 ? (
            <EmptyState
              icon="folder"
              title="No documents"
              message="You don't have any documents yet. Create your first document to get started."
              action={
                <Button
                  variant="primary"
                  size="md"
                  icon="plus"
                  onClick={handleCreateNewDocument}
                >
                  Create Document
                </Button>
              }
            />
          ) : (
            Object.entries(groupedDocuments).map(([category, docs]) => (
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
          ))
          )}
        </div>
      )}
      <DocumentTypeSelectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelectDocumentType={handleSelectDocumentType}
      />
      
      <PDFUploadModal
        isOpen={isPDFUploadModalOpen}
        onClose={() => setIsPDFUploadModalOpen(false)}
        onDocumentExtracted={handleDocumentExtracted}
      />

      {extractedDocument && (
        <ExtractedDocumentViewer
          extractedData={extractedDocument}
          onSave={handleExtractedDocumentSave}
          onClose={handleExtractedDocumentClose}
        />
      )}

      <footer className="documents-page-footer">
        <div className="documents-page-footer-content">
          <Link to="/test-table" className="documents-page-footer-link">
            Test Table Page
          </Link>
        </div>
      </footer>
    </div>
  );
};

