import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { DocumentOverview } from '../components/DocumentOverview';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import { ValueChart } from '../components/ValueChart';
import { IconButton } from '../components/design-system/molecules/IconButton/IconButton';
import { Button } from '../components/design-system/atoms/Button/Button';
import './ClientViewPage.css';

export const ClientViewPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [previewDocument, setPreviewDocument] = useState(null);

  // Mock documents data - in a real app, this would come from an API
  const parseDate = (dateString) => {
    const months = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
    const parts = dateString.split(', ');
    const datePart = parts[0].split(' ');
    const year = parseInt(parts[1]);
    const month = months[datePart[0]];
    const day = parseInt(datePart[1]);
    return new Date(year, month, day);
  };

  const allDocuments = [
    { documentId: "test-doc-001", title: "TEST_CLIENT_QA_001", documentNumber: "TEST-2025-001", date: "Nov 9, 2025", dateObj: parseDate("Nov 9, 2025"), documentType: "Transport", clientId: "test-client-1", direction: "out", content: "Test document for QA purposes.", previewContent: null, needsAttention: false },
    { documentId: "offer-001", title: "SACME", documentNumber: "OF-2025-001", date: "Nov 7, 2025", dateObj: parseDate("Nov 7, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 125000.00, content: "Hydraulic Powder Compaction Press HPC-500", previewContent: null, needsAttention: true, signatureStatus: "Awaiting Signature", lastModified: "Nov 7, 2025", isEditable: true },
    { documentId: "fattura-001", title: "Brembo S.p.A.", documentNumber: "FT-2025-001", date: "Nov 6, 2025", dateObj: parseDate("Nov 6, 2025"), documentType: "Invoice", clientId: "client-2", direction: "out", total: 87500.00, content: "Mechanical Press Rebuild Service", previewContent: null, needsAttention: true },
    { documentId: "transport-001", title: "Thyssenkrupp Materials", documentNumber: "TD-2025-001", date: "Nov 5, 2025", dateObj: parseDate("Nov 5, 2025"), documentType: "Transport", clientId: "client-3", direction: "out", content: "Hydraulic Press HPC-300 Unit", previewContent: null },
    { documentId: "agreement-001", title: "Schaeffler Group", documentNumber: "AG-2025-001", date: "Nov 4, 2025", dateObj: parseDate("Nov 4, 2025"), documentType: "Agreement", clientId: "client-4", direction: "out", itemCount: 6, content: "Retrofitting agreement", previewContent: null, needsAttention: true, signatureStatus: "Pending", lastModified: "Nov 4, 2025", isEditable: false },
    { documentId: "offer-002", title: "Industrial Press Systems", documentNumber: "OF-2025-002", date: "Nov 3, 2025", dateObj: parseDate("Nov 3, 2025"), documentType: "Offer", clientId: "client-1", direction: "out", total: 95000.00, content: "Used mechanical powder compaction press", previewContent: null },
  ];

  // Filter documents for this client
  const clientDocuments = useMemo(() => {
    return allDocuments.filter(doc => doc.clientId === clientId || doc.title === clientId);
  }, [clientId, allDocuments]);

  // Client address and contact details mapping (same as DocumentsPage)
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

  // Get client info from first document or use clientId as fallback
  const clientInfo = useMemo(() => {
    let clientName = clientId;
    let clientDetails = {};
    
    if (clientDocuments.length === 0) {
      // If no documents found, still create client info from clientId
      clientDetails = clientDetailsMap[clientId] || {};
    } else {
      const firstDoc = clientDocuments[0];
      clientName = firstDoc.title;
      // Try to get details from firstDoc.title first, then fallback to clientId
      clientDetails = clientDetailsMap[firstDoc.title] || clientDetailsMap[clientId] || {};
    }
    
    // Ensure address is always present - use client name/ID as fallback if not in map
    const address = clientDetails.address || `${clientName}, Location TBD`;
    
    if (clientDocuments.length === 0) {
      return {
        name: clientName,
        clientId: clientId,
        documentCount: 0,
        totalValue: 0,
        lastDocumentDate: '',
        documentTypes: [],
        address: address,
        phone: clientDetails.phone,
        email: clientDetails.email
      };
    }
    
    const firstDoc = clientDocuments[0];
    const totalValue = clientDocuments
      .filter(doc => doc.total)
      .reduce((sum, doc) => sum + doc.total, 0);
    const documentTypes = [...new Set(clientDocuments.map(doc => doc.documentType))];
    const lastDocument = [...clientDocuments].sort((a, b) => b.dateObj - a.dateObj)[0];
    
    return {
      name: clientName,
      clientId: firstDoc.clientId || clientId,
      documentCount: clientDocuments.length,
      totalValue,
      lastDocumentDate: lastDocument.date,
      documentTypes,
      address: address,
      phone: clientDetails.phone,
      email: clientDetails.email
    };
  }, [clientDocuments, clientId]);

  const handleSelectDocument = (documentId, isSelected) => {
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

  const handleSelectAll = () => {
    if (selectedDocuments.size === clientDocuments.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(clientDocuments.map(doc => doc.documentId)));
    }
  };

  const handleArchive = () => {
    console.log('Archive documents:', Array.from(selectedDocuments));
    // TODO: Implement archive functionality
  };

  const handleDownload = () => {
    console.log('Download documents:', Array.from(selectedDocuments));
    // TODO: Implement download functionality
  };

  const handlePrint = () => {
    console.log('Print documents:', Array.from(selectedDocuments));
    // TODO: Implement print functionality
  };

  const areAllSelected = selectedDocuments.size === clientDocuments.length && clientDocuments.length > 0;

  return (
    <div className="client-view-page">
      <div className="client-view-header">
        <div className="client-view-header-left">
          <BackButton />
          <div className="client-view-title-section">
            <h1 className="client-view-title">{clientInfo.name}</h1>
            {clientInfo.clientId && (
              <div className="client-view-id">ID: {clientInfo.clientId}</div>
            )}
          </div>
        </div>
        <div className="client-view-header-right">
          {selectedDocuments.size > 0 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                icon="archive"
                onClick={handleArchive}
              >
                Archive
              </Button>
              <Button
                variant="ghost"
                size="lg"
                icon="download"
                onClick={handleDownload}
              >
                Download
              </Button>
              <Button
                variant="ghost"
                size="lg"
                icon="print"
                onClick={handlePrint}
              >
                Print
              </Button>
            </>
          )}
          <IconButton
            icon="edit"
            variant="secondary"
            size="xl"
            onClick={() => console.log('Edit client')}
            aria-label="Edit client"
          />
        </div>
      </div>

      <div className="client-view-content">
        <div className="client-view-info">
          <div className="client-view-info-item">
            <span className="client-view-info-label">Documents:</span>
            <span className="client-view-info-value">{clientInfo.documentCount}</span>
          </div>
          {clientInfo.totalValue !== undefined && clientInfo.totalValue !== null && clientInfo.totalValue > 0 && (
            <div className="client-view-info-item">
              <span className="client-view-info-label">Total Value:</span>
              <span className="client-view-info-value">€{clientInfo.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}
          {clientInfo.lastDocumentDate && (
            <div className="client-view-info-item">
              <span className="client-view-info-label">Last Document:</span>
              <span className="client-view-info-value">{clientInfo.lastDocumentDate}</span>
            </div>
          )}
          {clientInfo.documentTypes && clientInfo.documentTypes.length > 0 && (
            <div className="client-view-info-item">
              <span className="client-view-info-label">Types:</span>
              <span className="client-view-info-value">{clientInfo.documentTypes.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="client-view-details-section">
          <div className="client-view-details">
            <div className="client-view-detail-item">
              <span className="client-view-detail-label">Address:</span>
              <span className="client-view-detail-value">
                {clientInfo.address}
              </span>
            </div>
            {clientInfo.phone && (
              <div className="client-view-detail-item">
                <span className="client-view-detail-label">Phone:</span>
                <span className="client-view-detail-value">{clientInfo.phone}</span>
              </div>
            )}
            {clientInfo.email && (
              <div className="client-view-detail-item">
                <span className="client-view-detail-label">Email:</span>
                <span className="client-view-detail-value">{clientInfo.email}</span>
              </div>
            )}
          </div>
          {clientInfo.address && !clientInfo.address.includes('Location TBD') && (
            <div className="client-view-map-container">
              <iframe
                className="client-view-map"
                title="Client Location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(clientInfo.address)}&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        <div className="client-view-chart-section">
          <ValueChart 
            documents={clientDocuments} 
            documentTypes={clientInfo.documentTypes || []}
          />
        </div>

        <div className="client-view-documents-section">
          <div className="client-view-documents-header">
            <Button
              variant="ghost"
              size="md"
              onClick={handleSelectAll}
            >
              {areAllSelected ? 'Unselect All' : 'Select All'}
            </Button>
          </div>
          <div className="client-view-documents-grid">
            {clientDocuments.map((doc) => (
              <DocumentOverview
                key={doc.documentId}
                documentId={doc.documentId}
                title={doc.title}
                previewContent={doc.previewContent}
                documentNumber={doc.documentNumber}
                date={doc.date}
                documentType={doc.documentType}
                total={doc.total}
                currencySymbol="€"
                isSelected={selectedDocuments.has(doc.documentId)}
                onSelect={handleSelectDocument}
                onPreview={setPreviewDocument}
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
        </div>

        <div className="client-view-danger-zone">
          <div className="client-view-danger-zone-content">
            <h2 className="client-view-danger-zone-title">Danger Zone</h2>
            <div className="client-view-danger-zone-description">
              <p>Deleting a client will:</p>
              <ul className="client-view-danger-zone-list">
                <li>Permanently remove the client from the system</li>
                <li>Archive all associated documents (documents will not be deleted for safety reasons)</li>
                <li>This action cannot be undone</li>
              </ul>
              <p>Please be certain before proceeding.</p>
            </div>
            <Button
              variant="danger"
              size="md"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${clientInfo.name}"? This action cannot be undone.`)) {
                  console.log('Delete client:', clientInfo.clientId);
                  // TODO: Implement delete functionality
                  navigate('/documents?tab=clients');
                }
              }}
            >
              Delete Client
            </Button>
          </div>
        </div>
      </div>

      {previewDocument && (
        <DocumentPreviewModal
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
          {...previewDocument}
        />
      )}
    </div>
  );
};

