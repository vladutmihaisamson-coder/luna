import { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentOverview } from '../components/DocumentOverview';
import { TransportDocument } from '../components/TransportDocument';
import { OfferDocument } from '../components/OfferDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import { AgreementDocument } from '../components/AgreementDocument';
import { PurchaseOrderDocument } from '../components/PurchaseOrderDocument';
import { IconButton } from '../components/design-system/molecules/IconButton/IconButton';
import { Icon } from '../components/design-system/atoms/Icon/Icon';
import { Button } from '../components/design-system/atoms/Button/Button';
import { Dropdown } from '../components/design-system/organisms/Dropdown/Dropdown';
import { DocumentTypeSelectionModal } from '../components/DocumentTypeSelectionModal';
import { PDFUploadModal } from '../components/PDFUploadModal';
import { ExtractedDocumentViewer } from '../components/ExtractedDocumentViewer';
import { textContainsQuery } from '../utils/textHighlight';
import './DocumentsPage.css';

export const DocumentsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'folder'
  const [documentFilter, setDocumentFilter] = useState('all'); // 'all', 'in', 'out'
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPDFUploadModalOpen, setIsPDFUploadModalOpen] = useState(false);
  const [extractedDocument, setExtractedDocument] = useState(null);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsToShow, setItemsToShow] = useState(24); // Initial number of documents to show
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
            { value: 'client-1', label: 'Metal Powder Industries' },
            { value: 'client-2', label: 'Ceramic Manufacturing Co.' },
            { value: 'client-3', label: 'Advanced Materials Ltd.' },
            { value: 'client-4', label: 'Powder Tech Solutions' },
            { value: 'client-5', label: 'Industrial Parts Supply Co.' },
            { value: 'client-6', label: 'Equipment Parts Distributor' },
            { value: 'client-7', label: 'Manufacturing Components Ltd.' },
            { value: 'client-8', label: 'Hydraulic Components Inc.' },
            { value: 'client-9', label: 'Industrial Supplies Co.' },
          ]
        : isOut
        ? [
            { value: 'all', label: 'All Recipients' },
            { value: 'client-1', label: 'Metal Powder Industries' },
            { value: 'client-2', label: 'Ceramic Manufacturing Co.' },
            { value: 'client-3', label: 'Advanced Materials Ltd.' },
            { value: 'client-4', label: 'Powder Tech Solutions' },
            { value: 'client-5', label: 'Industrial Parts Supply Co.' },
            { value: 'client-6', label: 'Equipment Parts Distributor' },
            { value: 'client-7', label: 'Manufacturing Components Ltd.' },
            { value: 'client-8', label: 'Hydraulic Components Inc.' },
            { value: 'client-9', label: 'Industrial Supplies Co.' },
          ]
        : [
            { value: 'all', label: 'All Contacts' },
            { value: 'client-1', label: 'Metal Powder Industries' },
            { value: 'client-2', label: 'Ceramic Manufacturing Co.' },
            { value: 'client-3', label: 'Advanced Materials Ltd.' },
            { value: 'client-4', label: 'Powder Tech Solutions' },
            { value: 'client-5', label: 'Industrial Parts Supply Co.' },
            { value: 'client-6', label: 'Equipment Parts Distributor' },
            { value: 'client-7', label: 'Manufacturing Components Ltd.' },
            { value: 'client-8', label: 'Hydraulic Components Inc.' },
            { value: 'client-9', label: 'Industrial Supplies Co.' },
          ],
      category: isIn
        ? [
            { value: 'all', label: 'All Types' },
            { value: 'transport', label: 'Transport' },
            { value: 'offer', label: 'Offer' },
            { value: 'invoice', label: 'Invoice' },
            { value: 'agreement', label: 'Agreement' },
            { value: 'purchase-order', label: 'Purchase Order' },
          ]
        : isOut
        ? [
            { value: 'all', label: 'All Types' },
            { value: 'transport', label: 'Transport' },
            { value: 'offer', label: 'Offer' },
            { value: 'invoice', label: 'Invoice' },
            { value: 'agreement', label: 'Agreement' },
            { value: 'purchase-order', label: 'Purchase Order' },
          ]
        : [
            { value: 'all', label: 'All Types' },
            { value: 'transport', label: 'Transport' },
            { value: 'offer', label: 'Offer' },
            { value: 'invoice', label: 'Invoice' },
            { value: 'agreement', label: 'Agreement' },
            { value: 'purchase-order', label: 'Purchase Order' },
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
    { documentId: "offer-001", title: "Metal Powder Industries", documentNumber: "OF-2025-001", date: "Nov 7, 2025", dateObj: parseDate("Nov 7, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 125000.00, content: "Hydraulic Powder Compaction Press HPC-500, Automated Control System, Press Tooling Set, Installation Service, Spare Parts Package, Technical Documentation.", previewContent: <OfferDocument /> },
    { documentId: "fattura-001", title: "Ceramic Manufacturing Co.", documentNumber: "FT-2025-001", date: "Nov 6, 2025", dateObj: parseDate("Nov 6, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 87500.00, content: "Mechanical Press Rebuild Service, Control System Upgrade, New Hydraulic Pumps, Safety Interlocks Installation, Operator Training.", previewContent: <FatturaDocument /> },
    { documentId: "transport-001", title: "Advanced Materials Ltd.", documentNumber: "TD-2025-001", date: "Nov 5, 2025", dateObj: parseDate("Nov 5, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Hydraulic Press HPC-300 Unit, Hydraulic System Components, Control Panel Assembly, Installation Tools, Press Tooling, Spare Parts Package, Technical Documentation, Safety Equipment.", previewContent: <TransportDocument /> },
    { documentId: "agreement-001", title: "Powder Tech Solutions", documentNumber: "AG-2025-001", date: "Nov 4, 2025", dateObj: parseDate("Nov 4, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 6, content: "Retrofitting agreement for mechanical press upgrade. Includes modernization of control system, safety upgrades, and performance optimization.", previewContent: <AgreementDocument /> },
    { documentId: "offer-002", title: "Industrial Press Systems", documentNumber: "OF-2025-002", date: "Nov 3, 2025", dateObj: parseDate("Nov 3, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 95000.00, content: "Used mechanical powder compaction press MPC-400. Recently rebuilt, includes full documentation and 6-month warranty.", previewContent: <OfferDocument /> },
    { documentId: "fattura-002", title: "Compaction Equipment Inc.", documentNumber: "FT-2025-002", date: "Nov 2, 2025", dateObj: parseDate("Nov 2, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 45000.00, content: "Press retrofitting service. Control system upgrade, new hydraulic pumps, safety interlocks installation, operator training.", previewContent: <FatturaDocument /> },
    { documentId: "transport-002", title: "Material Processing Corp.", documentNumber: "TD-2025-002", date: "Nov 1, 2025", dateObj: parseDate("Nov 1, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Shipment of new hydraulic compaction press HPC-600. Complete system with tooling, spare parts package, and technical documentation.", previewContent: <TransportDocument /> },
    { documentId: "offer-003", title: "Precision Press Manufacturing", documentNumber: "OF-2025-003", date: "Oct 31, 2025", dateObj: parseDate("Oct 31, 2025"), documentType: "Offer", clientId: "client-1", direction: "in", total: 65000.00, content: "Purchase offer for used hydraulic press HPC-250. Includes inspection, dismantling, and transport to our facility.", previewContent: <OfferDocument /> },
    { documentId: "fattura-003", title: "Press Rebuild Services", documentNumber: "FT-2025-003", date: "Oct 30, 2025", dateObj: parseDate("Oct 30, 2025"), documentType: "Invoice", clientId: "client-2", direction: "in", total: 32000.00, content: "Invoice for press rebuild service received. Complete overhaul of mechanical press including new components and testing.", previewContent: <FatturaDocument /> },
    { documentId: "transport-003", title: "Heavy Equipment Logistics", documentNumber: "TD-2025-003", date: "Oct 29, 2025", dateObj: parseDate("Oct 29, 2025"), documentType: "Transport", clientId: "client-3", direction: "in", content: "Received shipment of used mechanical press MPC-350. Press requires inspection and rebuild before resale.", previewContent: <TransportDocument /> },
    { documentId: "agreement-002", title: "Custom Press Solutions", documentNumber: "AG-2025-002", date: "Oct 28, 2025", dateObj: parseDate("Oct 28, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 5, content: "Construction agreement for custom hydraulic press. Design specifications, manufacturing timeline, delivery terms, and warranty conditions.", previewContent: <AgreementDocument /> },
    { documentId: "offer-004", title: "Powder Processing Equipment", documentNumber: "OF-2025-004", date: "Oct 27, 2025", dateObj: parseDate("Oct 27, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 78000.00, content: "Rebuilt mechanical press MPC-500. Complete restoration with new bearings, seals, and updated control system. Ready for immediate use.", previewContent: <OfferDocument /> },
    { documentId: "fattura-004", title: "Compaction Systems Ltd.", documentNumber: "FT-2025-004", date: "Oct 26, 2025", dateObj: parseDate("Oct 26, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 55000.00, content: "Retrofitting service invoice. Modernization of hydraulic press control system, installation of new safety features, and performance testing.", previewContent: <FatturaDocument /> },
    { documentId: "transport-004", title: "Industrial Machinery Transport", documentNumber: "TD-2025-004", date: "Oct 25, 2025", dateObj: parseDate("Oct 25, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Delivery of retrofitted hydraulic press HPC-400. Includes updated control panel, new hydraulic components, and installation support.", previewContent: <TransportDocument /> },
    { documentId: "offer-005", title: "Press Equipment Suppliers", documentNumber: "OF-2025-005", date: "Oct 24, 2025", dateObj: parseDate("Oct 24, 2025"), documentType: "Offer", clientId: "client-1", direction: "in", total: 42000.00, content: "Offer to purchase used mechanical press MPC-200. Press requires rebuild but has good structural condition and original tooling.", previewContent: <OfferDocument /> },
    { documentId: "fattura-005", title: "Equipment Restoration Services", documentNumber: "FT-2025-005", date: "Oct 23, 2025", dateObj: parseDate("Oct 23, 2025"), documentType: "Invoice", clientId: "client-2", direction: "in", total: 28000.00, content: "Received invoice for press inspection and assessment service. Complete evaluation of mechanical press condition and rebuild recommendations.", previewContent: <FatturaDocument /> },
    { documentId: "transport-005", title: "Specialized Cargo Services", documentNumber: "TD-2025-005", date: "Oct 22, 2025", dateObj: parseDate("Oct 22, 2025"), documentType: "Transport", clientId: "client-3", direction: "in", content: "Received hydraulic press HPC-180 for rebuild. Press includes original documentation and tooling. Scheduled for complete restoration.", previewContent: <TransportDocument /> },
    { documentId: "agreement-003", title: "Press Modernization Partners", documentNumber: "AG-2025-003", date: "Oct 21, 2025", dateObj: parseDate("Oct 21, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 7, content: "Service agreement for press modernization project. Includes design review, component upgrades, installation, and operator training program.", previewContent: <AgreementDocument /> },
    { documentId: "po-001", title: "Industrial Parts Supply Co.", documentNumber: "PO-2025-001", date: "Nov 8, 2025", dateObj: parseDate("Nov 8, 2025"), documentType: "Purchase Order", clientId: "client-5", direction: "in", itemCount: 12, content: "Hydraulic Cylinder Seal Kit, Pressure Relief Valve, Control Panel Circuit Board, Hydraulic Oil Filter Element, Pneumatic Fittings Set, Steel Guide Rails, Safety Interlock Switch, Hydraulic Pump Replacement, Electrical Cable Harness, Tooling Inserts, Lubrication System Components, Control Software License.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "po-002", title: "Equipment Parts Distributor", documentNumber: "PO-2025-002", date: "Nov 5, 2025", dateObj: parseDate("Nov 5, 2025"), documentType: "Purchase Order", clientId: "client-6", direction: "in", itemCount: 15, content: "Hydraulic Seals, Pressure Gauges, Control Valves, Oil Filters, Pneumatic Cylinders, Steel Bearings, Safety Switches, Hydraulic Pumps, Electrical Connectors, Tooling Components, Lubrication Pumps, Control Modules, Sensor Arrays, Actuator Systems, Maintenance Kits.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "po-003", title: "Manufacturing Components Ltd.", documentNumber: "PO-2025-003", date: "Nov 2, 2025", dateObj: parseDate("Nov 2, 2025"), documentType: "Purchase Order", clientId: "client-7", direction: "in", itemCount: 10, content: "Hydraulic Hoses, Pressure Sensors, Control Panels, Filter Housings, Pneumatic Valves, Guide Rails, Safety Relays, Pump Motors, Cable Assemblies, Tooling Fixtures.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "po-004", title: "Hydraulic Components Inc.", documentNumber: "PO-2025-004", date: "Oct 30, 2025", dateObj: parseDate("Oct 30, 2025"), documentType: "Purchase Order", clientId: "client-8", direction: "in", itemCount: 14, content: "Hydraulic Cylinders, Pressure Switches, Control Valves, Filter Cartridges, Pneumatic Fittings, Steel Rods, Safety Sensors, Pump Assemblies, Electrical Wires, Tooling Plates, Lubrication Systems, Control Boards, Position Sensors, Actuator Motors.", previewContent: <PurchaseOrderDocument /> },
    { documentId: "po-005", title: "Industrial Supplies Co.", documentNumber: "PO-2025-005", date: "Oct 28, 2025", dateObj: parseDate("Oct 28, 2025"), documentType: "Purchase Order", clientId: "client-9", direction: "in", itemCount: 11, content: "Hydraulic Fittings, Pressure Transducers, Control Modules, Oil Filters, Pneumatic Actuators, Guide Blocks, Safety Buttons, Hydraulic Motors, Cable Ties, Tooling Clamps, Lubrication Pumps.", previewContent: <PurchaseOrderDocument /> },
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
    { documentId: "agreement-005", title: "Press Engineering Services", documentNumber: "AG-2025-005", date: "Oct 7, 2025", dateObj: parseDate("Oct 7, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 6, content: "Retrofitting agreement for hydraulic press upgrade. Includes design modifications, component replacement, installation, and operator training.", previewContent: <AgreementDocument /> },
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
  }, [documents, documentFilter, selectedFilters, searchQuery]);

  const visibleDocuments = useMemo(() => {
    return filteredDocuments.slice(0, itemsToShow);
  }, [filteredDocuments, itemsToShow]);

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
    <div className="documents-page">
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
          <Icon name="inbox" size="xs" variant="outline" />
          IN
        </button>
        <button
          className={`toggle-option ${documentFilter === 'out' ? 'active' : ''}`}
          onClick={() => setDocumentFilter('out')}
        >
          <Icon name="send" size="xs" variant="outline" />
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
            variant="ghost"
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
          {selectedDocuments.size > 0 && (
            <div className="documents-selection-bar">
              <button 
                className="documents-unselect-button"
                onClick={handleUnselectAll}
                aria-label="Unselect all documents"
              >
                <Icon name="x" size="sm" variant="outline" />
                <span>Unselect ({selectedDocuments.size})</span>
              </button>
            </div>
          )}
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
          icon="upload"
          variant="default"
          size="lg"
          onClick={handlePDFUpload}
          aria-label="Upload PDF document"
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
    </div>
  );
};

