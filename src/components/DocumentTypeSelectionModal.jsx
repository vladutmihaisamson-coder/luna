import { useEffect, useRef, useState } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { DocumentOverview } from './DocumentOverview';
import { Input } from './design-system/atoms/Input/Input';
import { Select } from './design-system/atoms/Select/Select';
import { Button } from './design-system/atoms/Button/Button';
import './DocumentTypeSelectionModal.css';

export const DocumentTypeSelectionModal = ({
  isOpen,
  onClose,
  onSelectDocumentType
}) => {
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'clients' | 'users'
  
  // Client form state
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  // User form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('user');

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

  const documentTypes = [
    {
      type: 'transport',
      title: 'Transport Document',
      description: 'Create a transport document for shipping and logistics',
      preview: (
        <DocumentOverview
          documentId="preview-transport"
          title="Metal Powder Industries"
          documentNumber="TD-2025-001"
          date="Nov 7, 2025"
          documentType="Transport"
          itemCount={8}
          direction="out"
          content="Hydraulic Press HPC-300 Unit, Hydraulic System Components, Control Panel Assembly, Installation Tools, Press Tooling, Spare Parts Package, Technical Documentation, Safety Equipment."
        />
      )
    },
    {
      type: 'offer',
      title: 'Offer',
      description: 'Create an offer document with pricing and terms',
      preview: (
        <DocumentOverview
          documentId="preview-offer"
          title="Ceramic Manufacturing Co."
          documentNumber="OF-2025-001"
          date="Nov 7, 2025"
          documentType="Offer"
          total={125000.00}
          currencySymbol="€"
          direction="out"
          content="Hydraulic Powder Compaction Press HPC-500, Automated Control System, Press Tooling Set, Installation Service, Spare Parts Package, Technical Documentation."
        />
      )
    },
    {
      type: 'fattura',
      title: 'Invoice',
      description: 'Create an invoice document for billing',
      preview: (
        <DocumentOverview
          documentId="preview-fattura"
          title="Advanced Materials Ltd."
          documentNumber="FT-2025-001"
          date="Nov 6, 2025"
          documentType="Invoice"
          total={87500.00}
          currencySymbol="€"
          direction="out"
          content="Mechanical Press Rebuild Service, Control System Upgrade, New Hydraulic Pumps, Safety Interlocks Installation, Operator Training."
        />
      )
    },
    {
      type: 'agreement',
      title: 'Agreement',
      description: 'Create an agreement contract document',
      preview: (
        <DocumentOverview
          documentId="preview-agreement"
          title="Powder Tech Solutions"
          documentNumber="AG-2025-001"
          date="Nov 4, 2025"
          documentType="Agreement"
          itemCount={6}
          direction="out"
          content="Retrofitting agreement for mechanical press upgrade. Includes modernization of control system, safety upgrades, and performance optimization."
        />
      )
    },
    {
      type: 'purchase-order',
      title: 'Purchase Order',
      description: 'Create a purchase order for products you want to buy',
      preview: (
        <DocumentOverview
          documentId="preview-po"
          title="Industrial Parts Supply Co."
          documentNumber="PO-2025-001"
          date="Nov 8, 2025"
          documentType="Purchase Order"
          itemCount={12}
          direction="in"
          content="Hydraulic Cylinder Seal Kit, Pressure Relief Valve, Control Panel Circuit Board, Hydraulic Oil Filter Element, Pneumatic Fittings Set, Steel Guide Rails, Safety Interlock Switch, Hydraulic Pump Replacement, Electrical Cable Harness, Tooling Inserts, Lubrication System Components, Control Software License."
        />
      )
    }
  ];

  const handleSelect = (type) => {
    if (onSelectDocumentType) {
      onSelectDocumentType(type);
    }
    onClose();
  };

  // Reset to documents tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('documents');
      // Reset form states
      setClientName('');
      setClientAddress('');
      setClientEmail('');
      setClientPhone('');
      setUserName('');
      setUserEmail('');
      setUserRole('user');
    }
  }, [isOpen]);

  const renderDocumentsTab = () => (
    <>
      <p className="document-type-modal-description">
        Select a document type to get started
      </p>
      <div className="document-type-grid">
        {documentTypes.map((docType) => (
          <button
            key={docType.type}
            className="document-type-card"
            onClick={() => handleSelect(docType.type)}
          >
            <div className="document-type-preview">
              {docType.preview}
            </div>
            <div className="document-type-info">
              <h3 className="document-type-card-title">{docType.title}</h3>
              <p className="document-type-card-description">{docType.description}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const handleClientSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement client creation logic
    console.log('Creating client:', { clientName, clientAddress, clientEmail, clientPhone });
    // Close modal after creation
    onClose();
  };

  const renderClientsTab = () => {

    return (
      <div className="modal-tab-content">
        <p className="document-type-modal-description">
          Add a new client to your database
        </p>
        <form onSubmit={handleClientSubmit} className="client-form">
          <div className="form-field">
            <label htmlFor="client-name">Client Name *</label>
            <div className="form-input-wrapper">
              <Input
                id="client-name"
                type="text"
                value={clientName}
                onChange={(value) => setClientName(value)}
                placeholder="Enter client name"
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="client-address">Address</label>
            <div className="form-input-wrapper">
              <Input
                id="client-address"
                type="text"
                value={clientAddress}
                onChange={(value) => setClientAddress(value)}
                placeholder="Enter client address"
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="client-email">Email</label>
            <div className="form-input-wrapper">
              <Input
                id="client-email"
                type="email"
                value={clientEmail}
                onChange={(value) => setClientEmail(value)}
                placeholder="Enter client email"
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="client-phone">Phone</label>
            <div className="form-input-wrapper">
              <Input
                id="client-phone"
                type="tel"
                value={clientPhone}
                onChange={(value) => setClientPhone(value)}
                placeholder="Enter client phone"
              />
            </div>
          </div>
          <div className="form-actions">
            <Button type="button" variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Client
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement user creation logic
    console.log('Creating user:', { userName, userEmail, userRole });
    // Close modal after creation
    onClose();
  };

  const renderUsersTab = () => {

    return (
      <div className="modal-tab-content">
        <p className="document-type-modal-description">
          Add a new user to the application
        </p>
        <form onSubmit={handleUserSubmit} className="user-form">
          <div className="form-field">
            <label htmlFor="user-name">Name *</label>
            <div className="form-input-wrapper">
              <Input
                id="user-name"
                type="text"
                value={userName}
                onChange={(value) => setUserName(value)}
                placeholder="Enter user name"
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="user-email">Email *</label>
            <div className="form-input-wrapper">
              <Input
                id="user-email"
                type="email"
                value={userEmail}
                onChange={(value) => setUserEmail(value)}
                placeholder="Enter user email"
                required
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="user-role">Role</label>
            <div className="form-input-wrapper">
              <Select
                id="user-role"
                value={userRole}
                onChange={(value) => setUserRole(value)}
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'manager', label: 'Manager' }
                ]}
              />
            </div>
          </div>
          <div className="form-actions">
            <Button type="button" variant="default" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create User
            </Button>
          </div>
        </form>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="document-type-modal-overlay">
      <div className="document-type-modal" ref={modalRef}>
        <div className="document-type-modal-header">
          <h2 className="document-type-modal-title">Create New</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>

        <div className="document-type-modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
          <button
            className={`modal-tab ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            Clients
          </button>
          <button
            className={`modal-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        <div className="document-type-modal-content">
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'clients' && renderClientsTab()}
          {activeTab === 'users' && renderUsersTab()}
        </div>
      </div>
    </div>
  );
};

