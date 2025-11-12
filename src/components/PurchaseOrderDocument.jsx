import { useState, useMemo, useEffect } from 'react';
import { Document } from './design-system/organisms/Document/Document';
import { DocumentTitle } from './DocumentTitle';
import { FromTo } from './FromTo';
import { DivTable } from './DivTable';
import { SignatureFooter } from './SignatureFooter';
import { EditableTextCell } from './table/components/EditableTextCell';
import { QuantityCell } from './table/components/QuantityCell';
import { UnitCell } from './table/components/UnitCell';
import { DeleteButton } from './design-system/molecules/DeleteButton/DeleteButton';
import { ResetButton } from './design-system/molecules/ResetButton/ResetButton';
import { DragHandle } from './table/components/DragHandle';
import './PurchaseOrderDocument.css';

export const PurchaseOrderDocument = ({ onHasChanges, onSave, onRevert, isEmpty = false, useWebPPI = false }) => {
  const initialPOItems = isEmpty ? [
    { id: 1, description: '', quantity: 1, unit: 'pieces' }
  ] : [
    { id: 1, description: 'Programmable Logic Controller (PLC) System', quantity: 1, unit: 'units' },
    { id: 2, description: 'Variable Frequency Drive (VFD) 15kW', quantity: 2, unit: 'units' },
    { id: 3, description: 'Servo Motor Drive Unit', quantity: 3, unit: 'units' },
    { id: 4, description: 'HMI Touchscreen Display 12-inch', quantity: 1, unit: 'units' },
    { id: 5, description: 'Control Panel Enclosure IP65', quantity: 1, unit: 'units' },
    { id: 6, description: 'Safety Relay Module', quantity: 2, unit: 'units' },
    { id: 7, description: 'Proximity Sensors Set', quantity: 8, unit: 'pieces' },
    { id: 8, description: 'Pressure Transducer 0-100 bar', quantity: 4, unit: 'pieces' },
    { id: 9, description: 'Position Encoder Absolute', quantity: 2, unit: 'pieces' },
    { id: 10, description: 'Power Distribution Unit', quantity: 1, unit: 'units' },
    { id: 11, description: 'Control Software License', quantity: 1, unit: 'license' },
    { id: 12, description: 'Ethernet Communication Module', quantity: 1, unit: 'units' }
  ];
  const initialDate = new Date().toISOString().split('T')[0];

  const [poItems, setPoItems] = useState(initialPOItems);
  const [documentDate, setDocumentDate] = useState(initialDate);
  const [savedPoItems, setSavedPoItems] = useState(initialPOItems);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const unitOptions = ['pieces', 'sets', 'boxes', 'pallets', 'kg', 'tons', 'liters', 'units', 'license'];

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleDatePickerToggle = (isOpen) => {
    setShowDatePicker(isOpen);
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const dateChanged = documentDate !== savedDate;
    const itemsChanged = JSON.stringify(poItems) !== JSON.stringify(savedPoItems);
    return dateChanged || itemsChanged;
  }, [poItems, savedPoItems, documentDate, savedDate]);

  // Notify parent component about changes
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanges);
    }
  }, [hasChanges, onHasChanges]);

  // Save changes
  const saveChanges = () => {
    setSavedPoItems(JSON.parse(JSON.stringify(poItems)));
    setSavedDate(documentDate);
    if (onSave) onSave();
  };

  // Revert changes
  const revertChanges = () => {
    setPoItems(JSON.parse(JSON.stringify(savedPoItems)));
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
    setPoItems(prevItems => {
      const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
      const newItem = {
        id: maxId + 1,
        description: '',
        quantity: 1,
        unit: 'pieces'
      };
      return [...prevItems, newItem];
    });
  };

  const updateItem = (id, field, value) => {
    setPoItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const incrementQuantity = (id) => {
    setPoItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity || 0;
        return { ...item, quantity: currentQty + 1 };
      }
      return item;
    }));
  };

  const decrementQuantity = (id) => {
    setPoItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity || 0;
        return { ...item, quantity: Math.max(0, currentQty - 1) };
      }
      return item;
    }));
  };

  const deleteItem = (id) => {
    setPoItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const resetRow = (id) => {
    setPoItems(prevItems => prevItems.map(item =>
      item.id === id ? { id: item.id, description: '', quantity: 1, unit: 'pieces' } : item
    ));
  };

  const renderPORow = (item, index, items) => {
    const totalCount = items.length;
    const actionButton = totalCount > 1 ? 'delete' : 'reset';
    const defaultValues = { description: '', quantity: 1, unit: 'pieces' };
    const isDefault = 
      item.description === defaultValues.description &&
      item.quantity === defaultValues.quantity &&
      item.unit === defaultValues.unit;

    return (
      <>
        <div className="div-drag-handle-cell">
          <DragHandle />
        </div>
        <div className="div-table-cell">
          <EditableTextCell
            value={item.description}
            onChange={(value) => updateItem(item.id, 'description', value)}
            className="po-description-cell"
          />
        </div>
        <div className="div-table-cell">
          <QuantityCell
            value={item.quantity}
            onChange={(value) => updateItem(item.id, 'quantity', value)}
            onIncrement={() => incrementQuantity(item.id)}
            onDecrement={() => decrementQuantity(item.id)}
          />
        </div>
        <div className="div-table-cell">
          <UnitCell
            value={item.unit}
            onChange={(value) => updateItem(item.id, 'unit', value)}
            options={unitOptions}
          />
        </div>
        <div className="div-row-action-cell">
          {actionButton === 'delete' ? (
            <DeleteButton onClick={() => deleteItem(item.id)} className="row-action-button" />
          ) : actionButton === 'reset' && !isDefault ? (
            <ResetButton onClick={() => resetRow(item.id)} className="row-action-button" />
          ) : null}
        </div>
      </>
    );
  };

  const CM_PER_ROW = 1.0;
  const FOOTER_HEIGHT_CM = 3.0;
  const ADD_BUTTON_CM = 0.8;
  const BUTTON_TO_FOOTER_GAP_CM = 0.5;
  const MIN_SPACE_BEFORE_FOOTER_CM = 0.3;

  const calculatePageBreaks = useMemo(() => {
    const pageContent = [];
    let currentPageItems = [];
    let currentPageHeightCm = 0;
    let isFirstPage = true;

    const DOCUMENT_HEIGHT_CM = 29.7 - 2.4;
    const HEADER_HEIGHT_CM = 4.0;
    const INITIAL_CONTENT_HEIGHT_CM = HEADER_HEIGHT_CM;

    const MAX_CONTENT_HEIGHT_FIRST_PAGE_WITH_FOOTER = DOCUMENT_HEIGHT_CM - INITIAL_CONTENT_HEIGHT_CM - FOOTER_HEIGHT_CM - ADD_BUTTON_CM - BUTTON_TO_FOOTER_GAP_CM - MIN_SPACE_BEFORE_FOOTER_CM;
    const MAX_CONTENT_HEIGHT_FIRST_PAGE_WITHOUT_FOOTER = DOCUMENT_HEIGHT_CM - INITIAL_CONTENT_HEIGHT_CM - ADD_BUTTON_CM - BUTTON_TO_FOOTER_GAP_CM - MIN_SPACE_BEFORE_FOOTER_CM;
    const MAX_CONTENT_HEIGHT_SUBSEQUENT_PAGE = DOCUMENT_HEIGHT_CM - ADD_BUTTON_CM - BUTTON_TO_FOOTER_GAP_CM - MIN_SPACE_BEFORE_FOOTER_CM;

    poItems.forEach((item, index) => {
      const itemHeight = CM_PER_ROW;

      let maxAllowedHeight = MAX_CONTENT_HEIGHT_SUBSEQUENT_PAGE;
      if (isFirstPage) {
        const remainingHeightForContent = DOCUMENT_HEIGHT_CM - INITIAL_CONTENT_HEIGHT_CM - (currentPageHeightCm + itemHeight);
        if (remainingHeightForContent >= (FOOTER_HEIGHT_CM + ADD_BUTTON_CM + BUTTON_TO_FOOTER_GAP_CM + MIN_SPACE_BEFORE_FOOTER_CM)) {
          maxAllowedHeight = MAX_CONTENT_HEIGHT_FIRST_PAGE_WITH_FOOTER;
        } else {
          maxAllowedHeight = MAX_CONTENT_HEIGHT_FIRST_PAGE_WITHOUT_FOOTER;
        }
      }

      if (currentPageHeightCm + itemHeight > maxAllowedHeight && currentPageItems.length > 0) {
        pageContent.push({
          items: currentPageItems,
          isFirstPage: isFirstPage,
          hasFooter: false
        });
        currentPageItems = [];
        currentPageHeightCm = 0;
        isFirstPage = false;
      }

      currentPageItems.push(item);
      currentPageHeightCm += itemHeight;
    });

    if (currentPageItems.length > 0) {
      pageContent.push({
        items: currentPageItems,
        isFirstPage: isFirstPage,
        hasFooter: true
      });
    } else if (pageContent.length === 0) {
      pageContent.push({
        items: [],
        isFirstPage: true,
        hasFooter: true
      });
    }

    return pageContent;
  }, [poItems]);

  const pages = calculatePageBreaks;

  return (
    <div className="document-pages">
      {pages.map((page, pageIndex) => (
        <Document key={pageIndex} size="a4" orientation="portrait" padding={true} useWebPPI={useWebPPI}>
          {page.isFirstPage && (
            <>
              <DocumentTitle
                title="Purchase Order"
                documentNumber="PO-2025-001"
                date={documentDate}
                onDateChange={handleDateChange}
                showDatePicker={showDatePicker}
                onDatePickerToggle={handleDatePickerToggle}
              />

              <FromTo
                fromLabel="Buyer"
                toLabel="Supplier"
                fromName="Your Company Name"
                fromAddress={[
                  '123 Main Street',
                  'City, State, ZIP',
                  'Country'
                ]}
                toName={isEmpty ? '' : 'Bosch Rexroth'}
                toAddress={isEmpty ? [] : [
                  '456 Industrial Avenue',
                  'Manufacturing District, State, ZIP',
                  'Country'
                ]}
              />
            </>
          )}

          <div className="document-content-section">
            <DivTable
              items={page.items}
              columns={['Description', 'Quantity', 'Unit']}
              renderRow={renderPORow}
              onAddNewRow={pageIndex === pages.length - 1 ? addNewRow : undefined}
              showRulers={false}
              totalItemsCount={poItems.length}
            />
          </div>

          {page.hasFooter && (
            <SignatureFooter
              signatures={[
                { label: 'Buyer Signature' },
                { label: 'Supplier Signature' }
              ]}
            />
          )}
        </Document>
      ))}
    </div>
  );
};

