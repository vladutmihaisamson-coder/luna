import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BackButton } from '../components/BackButton';
import { DivTable } from '../components/DivTable';
import { DocumentTitle } from '../components/DocumentTitle';
import { FromTo } from '../components/FromTo';
import { SignatureFooter } from '../components/SignatureFooter';
import { DocumentOverview } from '../components/DocumentOverview';
import { TableHeader } from '../components/table/components/TableHeader.jsx';
import { TableHeaderCell } from '../components/table/components/TableHeaderCell.jsx';
import { EditableTextCell } from '../components/table/components/EditableTextCell.jsx';
import { QuantityCell } from '../components/table/components/QuantityCell.jsx';
import { UnitCell } from '../components/table/components/UnitCell.jsx';
import { PriceCell } from '../components/table/components/PriceCell.jsx';
import { TotalCell } from '../components/table/components/TotalCell.jsx';
import { TotalRow } from '../components/table/components/TotalRow.jsx';
import { Button, IconButton, Document } from '../components/design-system';
import './TestTablePage.css';

export const TestTablePage = () => {
  const [cellExampleDescription, setCellExampleDescription] = useState('Sample description text');
  const [cellExampleQuantity, setCellExampleQuantity] = useState(10);
  const [cellExampleUnit, setCellExampleUnit] = useState('boxes');
  const [cellExamplePrice, setCellExamplePrice] = useState(50.00);
  const [cellExampleTotal, setCellExampleTotal] = useState(500.00);
  const [documentTitleDate, setDocumentTitleDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDocumentTitleDatePicker, setShowDocumentTitleDatePicker] = useState(false);

  const unitOptions = ['boxes', 'pallets', 'pieces', 'units', 'sets', 'set', 'unit', 'kg', 'tons', 'liters'];

  const handleDocumentTitleDateChange = (newDate) => {
    setDocumentTitleDate(newDate);
  };

  const handleDocumentTitleDatePickerToggle = (isOpen) => {
    setShowDocumentTitleDatePicker(isOpen);
  };

  return (
    <div className="test-table-page">
      <BackButton />
      <div className="test-table-page-content">
        <div className="page-header">
          <h1>Test Table</h1>
          <Link to="/table-components-showcase" className="components-link">
            <Button variant="default">← Table Components Showcase</Button>
          </Link>
        </div>
        
        <div className="icon-button-example">
          <h2>IconButton Component Examples</h2>
          <p>Icon button component with different variants, sizes, and icons.</p>
          <div className="icon-button-example-container">
            <div className="icon-button-example-item">
              <h3>Variants</h3>
              <div className="icon-button-example-wrapper">
                <IconButton icon="plus" variant="default" size="md" aria-label="Default" />
                <IconButton icon="plus" variant="primary" size="md" aria-label="Primary" />
                <IconButton icon="plus" variant="ghost" size="md" aria-label="Ghost" />
                <IconButton icon="delete" variant="danger" size="md" aria-label="Danger" />
              </div>
              <p className="icon-button-example-value">default, primary, ghost, danger</p>
            </div>
            
            <div className="icon-button-example-item">
              <h3>Sizes</h3>
              <div className="icon-button-example-wrapper">
                <IconButton icon="plus" variant="default" size="sm" aria-label="Small" />
                <IconButton icon="plus" variant="default" size="md" aria-label="Medium" />
                <IconButton icon="plus" variant="default" size="lg" aria-label="Large" />
              </div>
              <p className="icon-button-example-value">sm, md, lg</p>
            </div>
            
            <div className="icon-button-example-item">
              <h3>Icons</h3>
              <div className="icon-button-example-wrapper">
                <IconButton icon="plus" variant="ghost" size="md" aria-label="Plus" />
                <IconButton icon="minus" variant="ghost" size="md" aria-label="Minus" />
                <IconButton icon="delete" variant="ghost" size="md" aria-label="Delete" />
                <IconButton icon="reset" variant="ghost" size="md" aria-label="Reset" />
                <IconButton icon="filter" variant="ghost" size="md" aria-label="Filter" />
                <IconButton icon="chevron-down" variant="ghost" size="md" aria-label="Chevron Down" />
                <IconButton icon="chevron-left" variant="ghost" size="md" aria-label="Chevron Left" />
                <IconButton icon="x" variant="ghost" size="md" aria-label="Close" />
              </div>
              <p className="icon-button-example-value">plus, minus, delete, reset, filter, chevron-down, chevron-left, x</p>
            </div>
          </div>
        </div>
        
        <div className="table-cells-example">
          <h2>Table Cell Components Examples</h2>
          <p>Individual cell components that can be used in table rows.</p>
          <div className="table-cells-example-container">
            <div className="cell-example-item">
              <h3>EditableTextCell</h3>
              <div className="cell-example-wrapper">
                <EditableTextCell
                  value={cellExampleDescription}
                  onChange={setCellExampleDescription}
                  placeholder="Enter description"
                />
              </div>
              <p className="cell-example-value">Value: {cellExampleDescription || '(empty)'}</p>
            </div>
            
            <div className="cell-example-item">
              <h3>QuantityCell</h3>
              <div className="cell-example-wrapper">
                <QuantityCell
                  value={cellExampleQuantity}
                  onChange={setCellExampleQuantity}
                  onIncrement={() => setCellExampleQuantity(prev => prev + 1)}
                  onDecrement={() => setCellExampleQuantity(prev => Math.max(0, prev - 1))}
                  min={0}
                />
              </div>
              <p className="cell-example-value">Value: {cellExampleQuantity}</p>
            </div>
            
            <div className="cell-example-item">
              <h3>UnitCell</h3>
              <div className="cell-example-wrapper">
                <UnitCell
                  value={cellExampleUnit}
                  onChange={setCellExampleUnit}
                  options={unitOptions}
                  placeholder="Unit"
                />
              </div>
              <p className="cell-example-value">Value: {cellExampleUnit}</p>
            </div>
            
            <div className="cell-example-item">
              <h3>PriceCell</h3>
              <div className="cell-example-wrapper">
                <PriceCell
                  value={cellExamplePrice}
                  onChange={setCellExamplePrice}
                  min={0}
                  currencySymbol="€"
                />
              </div>
              <p className="cell-example-value">Value: €{cellExamplePrice.toFixed(2)}</p>
            </div>
            
            <div className="cell-example-item">
              <h3>TotalCell</h3>
              <div className="cell-example-wrapper">
                <TotalCell
                  value={cellExampleTotal}
                  currencySymbol="€"
                />
              </div>
              <p className="cell-example-value">Value: €{cellExampleTotal.toFixed(2)}</p>
            </div>
            
            <div className="cell-example-item">
              <h3>TotalRow</h3>
              <div className="cell-example-wrapper">
                <TotalRow
                  label="Total"
                  value={cellExampleTotal}
                  currencySymbol="€"
                />
              </div>
              <p className="cell-example-value">Total row component displayed below table</p>
            </div>
          </div>
        </div>

        <div className="table-header-cell-example">
          <h2>TableHeaderCell Component Example</h2>
          <p>Atom component for individual table header cells.</p>
          <div className="table-header-cell-example-container">
            <div className="cell-example-item">
              <h3>TableHeaderCell</h3>
              <div className="cell-example-wrapper">
                <table className="cargo-table">
                  <thead>
                    <tr>
                      <TableHeaderCell>Title</TableHeaderCell>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="table-header-example">
          <h2>TableHeader Component Example</h2>
          <p>Table header component with customizable columns.</p>
          <div className="table-header-example-container">
            <table className="cargo-table">
              <TableHeader columns={['Description', 'Quantity', 'Unit']} />
            </table>
          </div>
        </div>

        <div className="table-component-example">
          <h2>DivTable Component Example</h2>
          <p>Complete table component with all features including row management, cell editing, and action buttons.</p>
          <div className="table-component-example-container">
            <DivTable showRulers={false} />
          </div>
        </div>

        <div className="document-title-example">
          <h2>DocumentTitle Component Example</h2>
          <p>Reusable document title component with title, document number, and date. The date can be editable with a date picker.</p>
          <div className="document-title-example-container">
            <div className="document-title-example-item">
              <h3>Editable Date</h3>
              <div className="document-title-example-wrapper">
                <DocumentTitle
                  title="Transport Document"
                  documentNumber="TD-2025-001"
                  date={documentTitleDate}
                  onDateChange={handleDocumentTitleDateChange}
                  showDatePicker={showDocumentTitleDatePicker}
                  onDatePickerToggle={handleDocumentTitleDatePickerToggle}
                />
              </div>
              <p className="document-title-example-value">Date: {documentTitleDate}</p>
            </div>
            
            <div className="document-title-example-item">
              <h3>Read-only Date</h3>
              <div className="document-title-example-wrapper">
                <DocumentTitle
                  title="Invoice"
                  documentNumber="INV-2025-042"
                  date="2025-01-15"
                />
              </div>
              <p className="document-title-example-value">Date is read-only (no onDateChange provided)</p>
            </div>
            
            <div className="document-title-example-item">
              <h3>No Date</h3>
              <div className="document-title-example-wrapper">
                <DocumentTitle
                  title="Quote"
                  documentNumber="QT-2025-123"
                />
              </div>
              <p className="document-title-example-value">No date provided</p>
            </div>
          </div>
        </div>

        <div className="from-to-example">
          <h2>FromTo Component Example</h2>
          <p>Component for displaying "From" and "To" address sections side by side in documents.</p>
          <div className="from-to-example-container">
            <div className="from-to-example-item">
              <h3>With Addresses</h3>
              <div className="from-to-example-wrapper">
                <FromTo
                  fromLabel="From"
                  toLabel="To"
                  fromAddress={[
                    'ABC Logistics Ltd.',
                    '123 Warehouse St, Industrial Park',
                    'New York, NY 10001',
                    '+1 (555) 123-4567'
                  ]}
                  toAddress={[
                    'XYZ Distribution Co.',
                    '456 Delivery Ave, Commerce District',
                    'Los Angeles, CA 90001',
                    '+1 (555) 987-6543'
                  ]}
                />
              </div>
            </div>
            
            <div className="from-to-example-item">
              <h3>With Custom Labels</h3>
              <div className="from-to-example-wrapper">
                <FromTo
                  fromLabel="Shipper"
                  toLabel="Consignee"
                  fromAddress={[
                    'Company Name',
                    'Address Line 1',
                    'City, Country'
                  ]}
                  toAddress={[
                    'Client Company',
                    'Client Address',
                    'Client City, Country'
                  ]}
                />
              </div>
            </div>
            
            <div className="from-to-example-item">
              <h3>Empty Addresses</h3>
              <div className="from-to-example-wrapper">
                <FromTo
                  fromLabel="From"
                  toLabel="To"
                  fromAddress={[]}
                  toAddress={[]}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="document-component-example">
          <h2>Document Component Example</h2>
          <p>Generic document component with A4 real-life size that can contain different types of atoms, molecules, or text.</p>
          <div className="document-component-example-container">
            <Document>
              <DocumentTitle
                title="Sample Document"
                documentNumber="DOC-2025-001"
                date={documentTitleDate}
                onDateChange={handleDocumentTitleDateChange}
                showDatePicker={showDocumentTitleDatePicker}
                onDatePickerToggle={handleDocumentTitleDatePickerToggle}
              />
              <FromTo
                fromLabel="From"
                toLabel="To"
                fromAddress={[]}
                toAddress={[]}
              />
              <div className="document-content-section">
                <DivTable showRulers={false} />
              </div>
              <SignatureFooter
                signatures={[
                  { label: 'Shipper Signature' },
                  { label: 'Carrier Signature' }
                ]}
              />
            </Document>
          </div>
        </div>

        <div className="div-table-component-example">
          <h2>DivTable Component Example</h2>
          <p>Table component recreated using only div groups instead of table elements. All functionality remains the same.</p>
          <div className="div-table-component-example-container">
            <DivTable showRulers={false} />
          </div>
        </div>

        <div className="signature-footer-example">
          <h2>SignatureFooter Component Example</h2>
          <p>Footer component for signatures that stays at the bottom of the first page.</p>
          <div className="signature-footer-example-container">
            <div className="signature-footer-example-item">
              <h3>Default Signatures</h3>
              <div className="signature-footer-example-wrapper">
                <div style={{ position: 'relative', height: '400px', width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', boxSizing: 'border-box' }}>
                  <div style={{ padding: '20px' }}>
                    <p>Document content goes here...</p>
                    <p>The signature footer will appear at the bottom of this container.</p>
                  </div>
                  <SignatureFooter
                    signatures={[
                      { label: 'Shipper Signature' },
                      { label: 'Carrier Signature' }
                    ]}
                  />
                </div>
              </div>
            </div>
            
            <div className="signature-footer-example-item">
              <h3>Custom Signatures</h3>
              <div className="signature-footer-example-wrapper">
                <div style={{ position: 'relative', height: '400px', width: '100%', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', boxSizing: 'border-box' }}>
                  <div style={{ padding: '20px' }}>
                    <p>Document content goes here...</p>
                    <p>The signature footer will appear at the bottom of this container.</p>
                  </div>
                  <SignatureFooter
                    signatures={[
                      { label: 'Sender Signature' },
                      { label: 'Receiver Signature' },
                      { label: 'Witness Signature' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="document-overview-example">
          <h2>DocumentOverview Component Example</h2>
          <p>Document preview thumbnail component that displays a preview of the document with title, number, date, and type tag.</p>
          <div className="document-overview-example-container">
            <div className="document-overview-example-item">
              <h3>Transport Document</h3>
              <div className="document-overview-example-wrapper">
                <DocumentOverview
                  documentId="transport-001"
                  title="XYZ Distribution Co."
                  documentNumber="TD-2025-001"
                  date="2025-01-15"
                  documentType="Transport"
                  previewContent={
                    <Document>
                      <DocumentTitle
                        title="Transport Document"
                        documentNumber="TD-2025-001"
                        date="2025-01-15"
                      />
                      <FromTo
                        fromLabel="From"
                        toLabel="To"
                        fromAddress={['ABC Logistics Ltd.', '123 Warehouse St']}
                        toAddress={['XYZ Distribution Co.', '456 Delivery Ave']}
                      />
                    </Document>
                  }
                />
              </div>
            </div>
            
            <div className="document-overview-example-item">
              <h3>Invoice Document</h3>
              <div className="document-overview-example-wrapper">
                <DocumentOverview
                  documentId="invoice-001"
                  title="Innovation Tech SpA"
                  documentNumber="INV-2025-042"
                  date="2025-01-20"
                  documentType="Fattura"
                  previewContent={
                    <Document>
                      <DocumentTitle
                        title="Fattura"
                        documentNumber="INV-2025-042"
                        date="2025-01-20"
                      />
                      <FromTo
                        fromLabel="From"
                        toLabel="To"
                        fromAddress={['Digital Services SRL', 'Via Roma 45']}
                        toAddress={['Innovation Tech SpA', 'Corso Vittorio Emanuele 78']}
                      />
                    </Document>
                  }
                />
              </div>
            </div>
            
            <div className="document-overview-example-item">
              <h3>Offer Document</h3>
              <div className="document-overview-example-wrapper">
                <DocumentOverview
                  documentId="offer-001"
                  title="Global Enterprises Ltd."
                  documentNumber="OFF-2025-123"
                  date="2025-01-18"
                  documentType="Offer"
                  previewContent={
                    <Document>
                      <DocumentTitle
                        title="Offer"
                        documentNumber="OFF-2025-123"
                        date="2025-01-18"
                      />
                      <FromTo
                        fromLabel="From"
                        toLabel="To"
                        fromAddress={['Tech Solutions Inc.', '123 Business Park']}
                        toAddress={['Global Enterprises Ltd.', '456 Corporate Boulevard']}
                      />
                    </Document>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

