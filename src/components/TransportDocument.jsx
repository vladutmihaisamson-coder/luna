import { useState, useMemo, useEffect } from 'react';
import { Document } from './design-system/organisms/Document/Document';
import { DocumentTitle } from './DocumentTitle';
import { FromTo } from './FromTo';
import { TransportReason } from './TransportReason';
import { DivTable } from './DivTable';
import { SignatureFooter } from './SignatureFooter';
import './TransportDocument.css';

export const TransportDocument = ({ onHasChanges, onSave, onRevert, isEmpty = false, useWebPPI = false }) => {
  const initialCargoItems = isEmpty ? [
    { id: 1, description: '', quantity: 1, unit: 'boxes' }
  ] : [
    { id: 1, description: 'Hydraulic Press HPC-300 Unit', quantity: 1, unit: 'piece' },
    { id: 2, description: 'Hydraulic System Components', quantity: 1, unit: 'set' },
    { id: 3, description: 'Control Panel Assembly', quantity: 1, unit: 'piece' },
    { id: 4, description: 'Installation Tools', quantity: 1, unit: 'set' },
    { id: 5, description: 'Press Tooling', quantity: 1, unit: 'set' },
    { id: 6, description: 'Spare Parts Package', quantity: 1, unit: 'box' },
    { id: 7, description: 'Technical Documentation', quantity: 1, unit: 'package' },
    { id: 8, description: 'Safety Equipment', quantity: 1, unit: 'set' }
  ];
  const initialDate = new Date().toISOString().split('T')[0];

  const [cargoItems, setCargoItems] = useState(initialCargoItems);
  const [documentDate, setDocumentDate] = useState(initialDate);
  const [transportReason, setTransportReason] = useState(isEmpty ? '' : 'conto-vendita');
  const [savedCargoItems, setSavedCargoItems] = useState(initialCargoItems);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [savedTransportReason, setSavedTransportReason] = useState(isEmpty ? '' : 'conto-vendita');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const unitOptions = ['boxes', 'pallets', 'pieces', 'kg', 'tons', 'liters', 'units'];

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleDatePickerToggle = (isOpen) => {
    setShowDatePicker(isOpen);
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const dateChanged = documentDate !== savedDate;
    const itemsChanged = JSON.stringify(cargoItems) !== JSON.stringify(savedCargoItems);
    const reasonChanged = transportReason !== savedTransportReason;
    return dateChanged || itemsChanged || reasonChanged;
  }, [cargoItems, savedCargoItems, documentDate, savedDate, transportReason, savedTransportReason]);

  // Notify parent component about changes
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanges);
    }
  }, [hasChanges, onHasChanges]);

  // Save changes
  const saveChanges = () => {
    setSavedCargoItems(JSON.parse(JSON.stringify(cargoItems)));
    setSavedDate(documentDate);
    setSavedTransportReason(transportReason);
    if (onSave) onSave();
  };

  // Revert changes
  const revertChanges = () => {
    setCargoItems(JSON.parse(JSON.stringify(savedCargoItems)));
    setDocumentDate(savedDate);
    setTransportReason(savedTransportReason);
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
    setCargoItems(prevItems => {
      const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
      const newItem = {
        id: maxId + 1,
        description: '',
        quantity: 1,
        unit: 'boxes'
      };
      return [...prevItems, newItem];
    });
  };

  const updateItem = (id, field, value) => {
    setCargoItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const incrementQuantity = (id) => {
    setCargoItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
        return { ...item, quantity: currentQty + 1 };
      }
      return item;
    }));
  };

  const decrementQuantity = (id) => {
    setCargoItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
        return { ...item, quantity: Math.max(0, currentQty - 1) };
      }
      return item;
    }));
  };

  const deleteItem = (id) => {
    setCargoItems(prevItems => {
      const filteredItems = prevItems.filter(item => item.id !== id);
      
      // If this was the last item, add a default row
      if (filteredItems.length === 0) {
        const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
        const newItem = {
          id: maxId + 1,
          description: '',
          quantity: 1,
          unit: 'boxes'
        };
        return [newItem];
      }
      return filteredItems;
    });
  };

  const resetRow = (id) => {
    setCargoItems(prevItems => prevItems.map(item => 
      item.id === id 
        ? { ...item, description: '', quantity: 1, unit: 'boxes' }
        : item
    ));
  };

  // Calculate how to split items across pages
  // Approximate heights in cm
  const PAGE_HEIGHT_CM = 29.7;
  const PADDING_CM = 1 + 1.5; // top (1cm) and bottom (1.5cm)
  const HEADER_HEIGHT_CM = 3;
  const PARTIES_SECTION_CM = 5.5;
  const TABLE_HEADER_CM = 1.5;
  const ROW_HEIGHT_CM = 1.0; // Actual row height is smaller
  const FOOTER_HEIGHT_CM = 4;
  const ADD_BUTTON_CM = 0.8; // Button container and spacing (reduced)
  const BUTTON_TO_FOOTER_GAP_CM = 1.05; // ~40px gap between button and footer (40px ≈ 1.05cm at 96 DPI)
  const MIN_SPACE_BEFORE_FOOTER_CM = FOOTER_HEIGHT_CM + ADD_BUTTON_CM + BUTTON_TO_FOOTER_GAP_CM; // Footer + Add button + 40px gap

  const pages = useMemo(() => {
    const FIRST_PAGE_AVAILABLE = PAGE_HEIGHT_CM - PADDING_CM - HEADER_HEIGHT_CM - PARTIES_SECTION_CM - TABLE_HEADER_CM;
    const CONTINUATION_PAGE_AVAILABLE = PAGE_HEIGHT_CM - PADDING_CM - TABLE_HEADER_CM;
    
    // Calculate max rows for each page type
    // First page must reserve space for footer + add button
    // Use calculated values without artificial caps to allow more content on first page
    const calculatedFirstPageRows = Math.floor((FIRST_PAGE_AVAILABLE - MIN_SPACE_BEFORE_FOOTER_CM) / ROW_HEIGHT_CM);
    const firstPageWithFooterRows = calculatedFirstPageRows;
    const calculatedFirstPageWithoutFooterRows = Math.floor((FIRST_PAGE_AVAILABLE - ADD_BUTTON_CM) / ROW_HEIGHT_CM);
    const firstPageWithoutFooterRows = calculatedFirstPageWithoutFooterRows;
    const continuationPageRows = Math.floor((CONTINUATION_PAGE_AVAILABLE - ADD_BUTTON_CM) / ROW_HEIGHT_CM);
    const lastPageRows = Math.floor((CONTINUATION_PAGE_AVAILABLE - MIN_SPACE_BEFORE_FOOTER_CM) / ROW_HEIGHT_CM);

    const result = [];
    
    if (cargoItems.length === 0) {
      result.push({
        isFirstPage: true,
        items: [],
        pageNumber: 1,
        hasFooter: true
      });
      return result;
    }

    // If all items fit on first page with footer, keep everything on one page
    if (cargoItems.length <= firstPageWithFooterRows) {
      result.push({
        isFirstPage: true,
        items: cargoItems,
        pageNumber: 1,
        hasFooter: true
      });
      return result;
    }

    // Multiple pages needed - need to ensure second page is created for footer
    let currentIndex = 0;
    let pageNumber = 1;

    // Calculate how many items for first page to ensure last page has room for footer
    const totalItems = cargoItems.length;
    let itemsForFirstPage;
    
    // If remaining items after filling first page would fit on last page with footer
    const potentialRemaining = totalItems - firstPageWithoutFooterRows;
    if (potentialRemaining > 0 && potentialRemaining <= lastPageRows) {
      // Fill first page completely, second page will have remaining + footer
      itemsForFirstPage = firstPageWithoutFooterRows;
    } else if (potentialRemaining > lastPageRows) {
      // Will need 3+ pages, fill first page
      itemsForFirstPage = firstPageWithoutFooterRows;
    } else {
      // Should not reach here due to earlier check, but safety
      itemsForFirstPage = firstPageWithFooterRows;
    }

    // Add first page with footer
    result.push({
      isFirstPage: true,
      items: cargoItems.slice(0, Math.min(totalItems, itemsForFirstPage)),
      pageNumber: pageNumber,
      hasFooter: true
    });
    currentIndex = Math.min(totalItems, itemsForFirstPage);
    pageNumber++;

    // Add continuation pages (footer always stays on first page)
    while (currentIndex < totalItems) {
      const remainingItems = totalItems - currentIndex;
      
      // Check if remaining items fit on a continuation page
      if (remainingItems <= continuationPageRows) {
        // Remaining items fit on one more page
        result.push({
          isFirstPage: false,
          items: cargoItems.slice(currentIndex, totalItems),
          pageNumber: pageNumber
        });
        break;
      } else {
        // Not the last page yet, add a middle page
        const itemsForPage = Math.min(continuationPageRows, remainingItems);
        
        result.push({
          isFirstPage: false,
          items: cargoItems.slice(currentIndex, currentIndex + itemsForPage),
          pageNumber: pageNumber
        });
        currentIndex += itemsForPage;
        pageNumber++;
      }
    }

    return result;
  }, [cargoItems]);


  return (
    <div className="document-pages">
      {pages.map((page, pageIndex) => (
        <Document key={pageIndex} size="a4" orientation="portrait" padding={true} useWebPPI={useWebPPI}>
          {page.isFirstPage && (
            <>
              <DocumentTitle
                title="Transport Document"
                documentNumber="TD-2025-001"
                date={documentDate}
                onDateChange={handleDateChange}
                showDatePicker={showDatePicker}
                onDatePickerToggle={handleDatePickerToggle}
                    />
              
              <FromTo
                fromLabel="From"
                toLabel="To"
                fromAddress={[
                  'ABC Logistics Ltd.',
                  '123 Warehouse St, Industrial Park',
                  '+1 (555) 123-4567'
                ]}
                toAddress={isEmpty ? [] : [
                  'XYZ Distribution Co.',
                  '456 Delivery Ave, Commerce District',
                  '+1 (555) 987-6543'
                ]}
              />
              
              <TransportReason
                value={transportReason}
                onChange={setTransportReason}
                isEmpty={isEmpty}
              />
            </>
          )}

          <div className="document-content-section">
            <DivTable
              items={page.items}
              columns={['Description', 'Quantity', 'Unit']}
              unitOptions={unitOptions}
              onUpdateItem={updateItem}
              onIncrementQuantity={incrementQuantity}
              onDecrementQuantity={decrementQuantity}
              onDeleteItem={deleteItem}
              onResetRow={resetRow}
              onAddNewRow={pageIndex === pages.length - 1 ? addNewRow : undefined}
              showRulers={false}
              totalItemsCount={cargoItems.length}
            />
          </div>

          {page.hasFooter && (
            <SignatureFooter
              signatures={[
                { label: 'Shipper Signature' },
                { label: 'Carrier Signature' }
              ]}
            />
          )}
        </Document>
      ))}
    </div>
  );
};

