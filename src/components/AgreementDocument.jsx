import { useState, useMemo, useEffect } from 'react';
import { Document } from './design-system/organisms/Document/Document';
import { DocumentTitle } from './DocumentTitle';
import { FromTo } from './FromTo';
import { DivTable } from './DivTable';
import { SignatureFooter } from './SignatureFooter';
import { EditableTextCell } from './table/components/EditableTextCell';
import { DragHandle } from './table/components/DragHandle';
import { RowActionButtons } from './table/components/RowActionButtons';
import './AgreementDocument.css';

export const AgreementDocument = ({ onHasChanges, onSave, onRevert, isEmpty = false }) => {
  const initialAgreementText = isEmpty 
    ? 'This agreement is entered into between the parties listed below...'
    : 'This agreement is entered into between the parties listed below. The terms and conditions of this agreement shall be binding upon both parties and their respective successors and assigns.';
  
  const initialItems = isEmpty ? [
    { id: 1, description: '' }
  ] : [
    { id: 1, description: 'Payment terms: Net 30 days from invoice date' },
    { id: 2, description: 'Delivery: Within 2 weeks of order confirmation' },
    { id: 3, description: 'Warranty: 12 months from delivery date' },
    { id: 4, description: 'Termination: Either party may terminate with 30 days written notice' }
  ];
  
  const initialDate = new Date().toISOString().split('T')[0];

  const [agreementText, setAgreementText] = useState(initialAgreementText);
  const [items, setItems] = useState(initialItems);
  const [documentDate, setDocumentDate] = useState(initialDate);
  const [savedAgreementText, setSavedAgreementText] = useState(initialAgreementText);
  const [savedItems, setSavedItems] = useState(initialItems);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleDatePickerToggle = (isOpen) => {
    setShowDatePicker(isOpen);
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const dateChanged = documentDate !== savedDate;
    const textChanged = agreementText !== savedAgreementText;
    const itemsChanged = JSON.stringify(items) !== JSON.stringify(savedItems);
    return dateChanged || textChanged || itemsChanged;
  }, [items, savedItems, agreementText, savedAgreementText, documentDate, savedDate]);

  // Notify parent component about changes
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanges);
    }
  }, [hasChanges, onHasChanges]);

  // Save changes
  const saveChanges = () => {
    setSavedItems(JSON.parse(JSON.stringify(items)));
    setSavedAgreementText(agreementText);
    setSavedDate(documentDate);
    if (onSave) onSave();
  };

  // Revert changes
  const revertChanges = () => {
    setItems(JSON.parse(JSON.stringify(savedItems)));
    setAgreementText(savedAgreementText);
    setDocumentDate(savedDate);
    if (onRevert) onRevert();
  };

  // Expose save and revert functions to parent
  useEffect(() => {
    window.__documentSave = saveChanges;
    window.__documentRevert = revertChanges;
    
    return () => {
      delete window.__documentSave;
      delete window.__documentRevert;
    };
  });

  const addNewRow = () => {
    setItems(prevItems => {
      const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
      const newItem = {
        id: maxId + 1,
        description: ''
      };
      return [...prevItems, newItem];
    });
  };

  const updateItem = (id, field, value) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const resetRow = (id) => {
    const savedItem = savedItems.find(item => item.id === id);
    if (savedItem) {
      setItems(prevItems => prevItems.map(item => 
        item.id === id ? { ...savedItem } : item
      ));
    }
  };

  const renderAgreementRow = (item) => {
    return (
      <div key={item.id} className="div-table-row">
        <DragHandle />
        <div className="div-table-cell div-description-cell-with-handle">
          <EditableTextCell
            value={item.description}
            onChange={(value) => updateItem(item.id, 'description', value)}
            placeholder="Enter agreement term..."
          />
        </div>
        <div className="div-row-action-cell">
          <RowActionButtons
            onDelete={items.length > 1 ? () => deleteItem(item.id) : undefined}
            onReset={JSON.stringify(item) !== JSON.stringify(savedItems.find(saved => saved.id === item.id)) ? () => resetRow(item.id) : undefined}
          />
        </div>
      </div>
    );
  };

  return (
    <Document size="a4" orientation="portrait" padding={true}>
      <DocumentTitle
        title="Agreement"
        documentNumber="AG-2025-001"
        date={documentDate}
        onDateChange={handleDateChange}
        showDatePicker={showDatePicker}
        onDatePickerToggle={handleDatePickerToggle}
      />
      
      <FromTo
        fromLabel="Party A"
        toLabel="Party B"
        fromAddress={[
          'ABC Company Ltd.',
          '123 Business Street',
          'City, State 12345',
          '+1 (555) 123-4567'
        ]}
        toAddress={isEmpty ? [] : [
          'XYZ Corporation',
          '456 Corporate Avenue',
          'City, State 67890',
          '+1 (555) 987-6543'
        ]}
      />

      <div className="agreement-text-section">
        <EditableTextCell
          value={agreementText}
          onChange={setAgreementText}
          placeholder="Enter agreement text..."
        />
      </div>

      <div className="document-content-section">
        <DivTable
          items={items}
          columns={['Terms']}
          renderRow={renderAgreementRow}
          onAddNewRow={addNewRow}
          showRulers={false}
          totalItemsCount={items.length}
        />
      </div>

      <SignatureFooter
        signatures={[
          { label: 'Party A Signature' },
          { label: 'Party B Signature' }
        ]}
      />
    </Document>
  );
};

