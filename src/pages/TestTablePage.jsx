import { Link } from 'react-router-dom';
import { TransportDocumentTable } from '../components/TransportDocumentTable';
import { Button } from '../components/design-system';
import './TestTablePage.css';

export const TestTablePage = () => {
  return (
    <div className="test-table-page">
      <div className="test-table-page-content">
        <div className="page-header">
          <h1>Test Table</h1>
          <Link to="/table-components-showcase" className="components-link">
            <Button variant="default">← Table Components Showcase</Button>
          </Link>
        </div>
        <TransportDocumentTable />
      </div>
    </div>
  );
};

