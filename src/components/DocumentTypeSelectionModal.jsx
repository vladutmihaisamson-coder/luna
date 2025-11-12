import { useEffect, useRef, useState } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Icon } from './design-system/atoms/Icon/Icon';
import { DocumentOverview } from './DocumentOverview';
import { Input } from './design-system/atoms/Input/Input';
import { Select } from './design-system/atoms/Select/Select';
import { Button } from './design-system/atoms/Button/Button';
import { Dropdown } from './design-system/organisms/Dropdown/Dropdown';
import './DocumentTypeSelectionModal.css';

export const DocumentTypeSelectionModal = ({
  isOpen,
  onClose,
  onSelectDocumentType,
  initialTab = 'documents'
}) => {
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState(initialTab); // 'documents' | 'clients' | 'users'
  
  // Client form state
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  
  // User form state
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('user');
  
  // Business search state
  const [isBusinessSearchExpanded, setIsBusinessSearchExpanded] = useState(false);
  const [businessSearchQuery, setBusinessSearchQuery] = useState('');
  
  // Template search state
  const [isTemplateSearchExpanded, setIsTemplateSearchExpanded] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  
  // Role dropdown state
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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

    const handleWheel = (e) => {
      // Prevent wheel events from reaching body when modal is open
      if (!modalRef.current || !modalRef.current.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchMove = (e) => {
      // Prevent touch move events from reaching body when modal is open
      if (!modalRef.current || !modalRef.current.contains(e.target)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      // Prevent body scroll when modal is open
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        // Restore body scroll when modal closes
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isOpen, onClose, initialTab]);

  const documentTypes = [
    {
      type: 'transport',
      title: 'Transport Document',
      description: 'Create a transport document for shipping and logistics',
      preview: (
        <DocumentOverview
          documentId="preview-transport"
          title="Template - SACME"
          documentNumber="TEMPLATE-TD-001"
          date="Nov 7, 2025"
          documentType="Transport"
          itemCount={8}
          direction="out"
          content="Template document. Hydraulic Press HPC-300 Unit, Hydraulic System Components, Control Panel Assembly, Installation Tools, Press Tooling, Spare Parts Package, Technical Documentation, Safety Equipment."
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
          title="Template - Brembo S.p.A."
          documentNumber="TEMPLATE-OF-001"
          date="Nov 7, 2025"
          documentType="Offer"
          total={125000.00}
          currencySymbol="€"
          direction="out"
          content="Template document. Hydraulic Powder Compaction Press HPC-500, Automated Control System, Press Tooling Set, Installation Service, Spare Parts Package, Technical Documentation."
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
          title="Template - Thyssenkrupp Materials"
          documentNumber="TEMPLATE-FT-001"
          date="Nov 6, 2025"
          documentType="Invoice"
          total={87500.00}
          currencySymbol="€"
          direction="out"
          content="Template document. Mechanical Press Rebuild Service, Control System Upgrade, New Hydraulic Pumps, Safety Interlocks Installation, Operator Training."
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
          title="Template - Schaeffler Group"
          documentNumber="TEMPLATE-AG-001"
          date="Nov 4, 2025"
          documentType="Agreement"
          itemCount={6}
          direction="out"
          content="Template document. Retrofitting agreement for mechanical press upgrade. Includes modernization of control system, safety upgrades, and performance optimization."
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
          title="Template - Bosch Rexroth"
          documentNumber="TEMPLATE-PO-001"
          date="Nov 8, 2025"
          documentType="Purchase Order"
          itemCount={12}
          direction="in"
          content="Template document. Hydraulic Cylinder Seal Kit, Pressure Relief Valve, Control Panel Circuit Board, Hydraulic Oil Filter Element, Pneumatic Fittings Set, Steel Guide Rails, Safety Interlock Switch, Hydraulic Pump Replacement, Electrical Cable Harness, Tooling Inserts, Lubrication System Components, Control Software License."
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

  // Reset to initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Reset form states
      setClientName('');
      setClientAddress('');
      setClientEmail('');
      setClientPhone('');
      setUserName('');
      setUserEmail('');
      setUserRole('user');
      setIsBusinessSearchExpanded(false);
      setBusinessSearchQuery('');
      setIsTemplateSearchExpanded(false);
      setTemplateSearchQuery('');
      setIsRoleDropdownOpen(false);
    }
  }, [isOpen, initialTab]);

  const renderDocumentsTab = () => (
    <>
      <div className="document-type-modal-description-wrapper">
        <p className="document-type-modal-description">
          Select a document type to get started
        </p>
        <div className={`search-business-wrapper ${isTemplateSearchExpanded ? 'expanded' : ''}`}>
          {isTemplateSearchExpanded ? (
            <div className="search-business-input-wrapper">
              <Icon name="search" size="sm" variant="outline" />
              <input
                type="text"
                className="search-business-input"
                placeholder="Search templates online..."
                value={templateSearchQuery}
                onChange={(e) => setTemplateSearchQuery(e.target.value)}
                onBlur={() => {
                  if (!templateSearchQuery.trim()) {
                    setIsTemplateSearchExpanded(false);
                  }
                }}
                autoFocus={true}
              />
              {templateSearchQuery && (
                <button
                  className="search-business-clear"
                  onClick={() => {
                    setTemplateSearchQuery('');
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
                  setIsTemplateSearchExpanded(true);
                }}
                aria-label="Search templates online"
                className="search-business-button"
              />
              <div className="search-business-tooltip">
                Search templates online - free or paid - to quickly create documents
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="document-type-grid">
        {documentTypes.map((docType) => (
          <div
            key={docType.type}
            className="document-type-item"
            onClick={() => handleSelect(docType.type)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSelect(docType.type)}
          >
            <div className="document-type-preview-wrapper">
              {docType.preview}
            </div>
            <div className="document-type-info">
              <h3 className="document-type-card-title">{docType.title}</h3>
              <p className="document-type-card-description">{docType.description}</p>
            </div>
          </div>
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
        <div className="document-type-modal-description-wrapper">
          <p className="document-type-modal-description">
            Add a new client to your database
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
        <form id="client-form" onSubmit={handleClientSubmit} className="client-form">
          <div className="form-fields-wrapper">
            <div className="form-field">
              <label htmlFor="client-name">Client Name *</label>
              <Input
                id="client-name"
                type="text"
                value={clientName}
                onChange={(value) => setClientName(value)}
                placeholder="Enter client name"
                required
                className="form-input-square"
              />
            </div>
            <div className="form-field">
              <label htmlFor="client-address">Address *</label>
              <Input
                id="client-address"
                type="text"
                value={clientAddress}
                onChange={(value) => setClientAddress(value)}
                placeholder="Enter client address"
                required
                className="form-input-square"
              />
            </div>
            <div className="form-field">
              <label htmlFor="client-email">Email</label>
              <Input
                id="client-email"
                type="email"
                value={clientEmail}
                onChange={(value) => setClientEmail(value)}
                placeholder="Enter client email"
                className="form-input-square"
              />
            </div>
            <div className="form-field">
              <label htmlFor="client-phone">Phone</label>
              <Input
                id="client-phone"
                type="tel"
                value={clientPhone}
                onChange={(value) => setClientPhone(value)}
                placeholder="Enter client phone"
                className="form-input-square"
              />
            </div>
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
        <div className="document-type-modal-description-wrapper">
          <p className="document-type-modal-description">
            Add a new user to the application
          </p>
          <div className="search-business-tooltip-wrapper" style={{ visibility: 'hidden', pointerEvents: 'none' }}>
            <IconButton
              icon="search"
              variant="ghost"
              size="lg"
              aria-hidden="true"
            />
          </div>
        </div>
        <form id="user-form" onSubmit={handleUserSubmit} className="user-form">
          <div className="form-fields-wrapper">
            <div className="form-field">
              <label htmlFor="user-name">Name *</label>
              <Input
                id="user-name"
                type="text"
                value={userName}
                onChange={(value) => setUserName(value)}
                placeholder="Enter user name"
                required
                className="form-input-square"
              />
            </div>
            <div className="form-field">
              <label htmlFor="user-email">Email *</label>
              <Input
                id="user-email"
                type="email"
                value={userEmail}
                onChange={(value) => setUserEmail(value)}
                placeholder="Enter user email"
                required
                className="form-input-square"
              />
            </div>
            <div className="form-field">
              <label htmlFor="user-role">Role *</label>
              <div className="form-role-dropdown-wrapper">
                <button
                  type="button"
                  id="user-role"
                  className={`form-role-select-button ${isRoleDropdownOpen ? 'open' : ''}`}
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  aria-expanded={isRoleDropdownOpen}
                  aria-haspopup="listbox"
                  aria-required="true"
                >
                  <span className={userRole ? 'form-role-select-value' : 'form-role-select-placeholder'}>
                    {userRole === 'user' ? 'User' : userRole === 'admin' ? 'Admin' : userRole === 'manager' ? 'Manager' : 'Select role'}
                  </span>
                  <Icon name="chevron-down" size="sm" variant="outline" className="form-role-select-chevron" />
                </button>
                <Dropdown
                  isOpen={isRoleDropdownOpen}
                  onClose={() => setIsRoleDropdownOpen(false)}
                  options={[
                    { value: 'user', label: 'User' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'manager', label: 'Manager' }
                  ]}
                  selectedValue={userRole}
                  onSelect={(value) => {
                    setUserRole(value);
                    setIsRoleDropdownOpen(false);
                  }}
                  position="bottom"
                  align="left"
                  className="form-role-dropdown"
                />
              </div>
              <p className="form-field-description">
                Select the user's role to determine their access level and permissions in the system
              </p>
              <div className="role-permissions-table-wrapper">
                <table className="role-permissions-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>User</td>
                      <td>View and create documents, basic access</td>
                    </tr>
                    <tr>
                      <td>Manager</td>
                      <td>All user permissions, edit and manage documents</td>
                    </tr>
                    <tr>
                      <td>Admin</td>
                      <td>Full system access, manage users and settings</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
          <div className="modal-tab-separator"></div>
          <button
            className={`modal-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        <div 
          className="document-type-modal-content"
          onWheel={(e) => {
            const element = e.currentTarget;
            const { scrollTop, scrollHeight, clientHeight } = element;
            const isAtTop = scrollTop === 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            
            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
              e.preventDefault();
            }
          }}
          onTouchMove={(e) => {
            const element = e.currentTarget;
            const { scrollTop, scrollHeight, clientHeight } = element;
            const touch = e.touches[0];
            const touchY = touch.clientY;
            const elementRect = element.getBoundingClientRect();
            const relativeY = touchY - elementRect.top;
            
            const isAtTop = scrollTop === 0 && relativeY < 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1 && relativeY > clientHeight;
            
            if (isAtTop || isAtBottom) {
              e.preventDefault();
            }
          }}
        >
          {activeTab === 'documents' && renderDocumentsTab()}
          {activeTab === 'clients' && renderClientsTab()}
          {activeTab === 'users' && renderUsersTab()}
        </div>

        {(activeTab === 'clients' || activeTab === 'users') && (
          <div className="document-type-modal-footer">
            <Button 
              type="button" 
              variant="default" 
              onClick={onClose} 
              className="form-action-button"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              className="form-action-button"
              form={activeTab === 'clients' ? 'client-form' : 'user-form'}
            >
              {activeTab === 'clients' ? 'Create Client' : 'Create User'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

