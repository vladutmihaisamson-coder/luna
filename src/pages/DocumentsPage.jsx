import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { DocumentOverview } from '../components/DocumentOverview';
import { TransportDocument } from '../components/TransportDocument';
import { OfferDocument } from '../components/OfferDocument';
import { FatturaDocument } from '../components/FatturaDocument';
import './DocumentsPage.css';

export const DocumentsPage = () => {
  return (
    <div className="documents-page">
      <BackButton />
      <div className="documents-page-header">
        <Link to="/table-components-showcase" className="test-table-link">
          Test Table
        </Link>
      </div>
      <div className="documents-page-grid">
        <DocumentOverview 
          documentId="transport-001"
          title="Transport Document"
          documentNumber="TD-2025-001"
          date="Nov 6, 2025"
          documentType="Transport"
          previewContent={<TransportDocument />}
        />
        <DocumentOverview 
          documentId="offer-001"
          title="Offer"
          documentNumber="OF-2025-001"
          date="Nov 5, 2025"
          documentType="Offer"
          previewContent={<OfferDocument />}
        />
        <DocumentOverview 
          documentId="fattura-001"
          title="Fattura"
          documentNumber="FT-2025-001"
          date="Nov 4, 2025"
          documentType="Fattura"
          previewContent={<FatturaDocument />}
        />
        <DocumentOverview 
          documentId="transport-002"
          title="Transport Document"
          documentNumber="TD-2025-002"
          date="Nov 3, 2025"
          documentType="Transport"
          previewContent={<TransportDocument />}
        />
        <DocumentOverview 
          documentId="offer-002"
          title="Offer"
          documentNumber="OF-2025-002"
          date="Nov 2, 2025"
          documentType="Offer"
          previewContent={<OfferDocument />}
        />
        <DocumentOverview 
          documentId="fattura-002"
          title="Fattura"
          documentNumber="FT-2025-002"
          date="Nov 1, 2025"
          documentType="Fattura"
          previewContent={<FatturaDocument />}
        />
      </div>
    </div>
  );
};

