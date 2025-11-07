import { useState, useMemo, useRef, useEffect } from 'react';
import { DatePickerDropdown } from './DatePickerDropdown';
import { TransportDocumentTable } from './TransportDocumentTable';
import './TransportDocument.css';

export const TransportDocument = ({ onHasChanges, onSave, onRevert }) => {
  const initialCargoItems = [
    { id: 1, description: 'Electronic Equipment', quantity: 25, unit: 'boxes' },
    { id: 2, description: 'Office Supplies', quantity: 10, unit: 'boxes' }
  ];
  const initialDate = new Date().toISOString().split('T')[0];

  const [cargoItems, setCargoItems] = useState(initialCargoItems);
  const [documentDate, setDocumentDate] = useState(initialDate);
  const [savedCargoItems, setSavedCargoItems] = useState(initialCargoItems);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRef = useRef(null);

  const unitOptions = ['boxes', 'pallets', 'pieces', 'kg', 'tons', 'liters', 'units'];

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDateClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleCloseDatePicker = () => {
    setShowDatePicker(false);
  };

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const dateChanged = documentDate !== savedDate;
    const itemsChanged = JSON.stringify(cargoItems) !== JSON.stringify(savedCargoItems);
    return dateChanged || itemsChanged;
  }, [cargoItems, savedCargoItems, documentDate, savedDate]);

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
    if (onSave) onSave();
  };

  // Revert changes
  const revertChanges = () => {
    setCargoItems(JSON.parse(JSON.stringify(savedCargoItems)));
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
  const ROW_HEIGHT_CM = 1.3;
  const FOOTER_HEIGHT_CM = 4;
  const ADD_BUTTON_CM = 1.5;

  const pages = useMemo(() => {
    const FIRST_PAGE_AVAILABLE = PAGE_HEIGHT_CM - PADDING_CM - HEADER_HEIGHT_CM - PARTIES_SECTION_CM - TABLE_HEADER_CM - ADD_BUTTON_CM;
    const CONTINUATION_PAGE_AVAILABLE = PAGE_HEIGHT_CM - PADDING_CM - TABLE_HEADER_CM - ADD_BUTTON_CM;
    const LAST_PAGE_FOOTER_SPACE = FOOTER_HEIGHT_CM;
    
    // Calculate max rows for each page type
    const firstPageWithFooterRows = Math.floor((FIRST_PAGE_AVAILABLE - LAST_PAGE_FOOTER_SPACE) / ROW_HEIGHT_CM);
    const firstPageWithoutFooterRows = Math.floor(FIRST_PAGE_AVAILABLE / ROW_HEIGHT_CM);
    const continuationPageRows = Math.floor(CONTINUATION_PAGE_AVAILABLE / ROW_HEIGHT_CM);
    const lastPageRows = Math.floor((CONTINUATION_PAGE_AVAILABLE - LAST_PAGE_FOOTER_SPACE) / ROW_HEIGHT_CM);

    const result = [];
    
    if (cargoItems.length === 0) {
      result.push({
        isFirstPage: true,
        items: [],
        pageNumber: 1
      });
      return result;
    }

    // If all items fit on first page with footer, keep everything on one page
    if (cargoItems.length <= firstPageWithFooterRows) {
      result.push({
        isFirstPage: true,
        items: cargoItems,
        pageNumber: 1
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

    // Add first page
    result.push({
      isFirstPage: true,
      items: cargoItems.slice(0, Math.min(totalItems, itemsForFirstPage)),
      pageNumber: pageNumber
    });
    currentIndex = Math.min(totalItems, itemsForFirstPage);
    pageNumber++;

    // Add continuation pages
    while (currentIndex < totalItems) {
      const remainingItems = totalItems - currentIndex;
      
      // Check if remaining items fit on last page with footer
      if (remainingItems <= lastPageRows) {
        // This is the last page with footer
        result.push({
          isFirstPage: false,
          items: cargoItems.slice(currentIndex, totalItems),
          pageNumber: pageNumber
        });
        break;
      } else {
        // Not the last page yet, add a middle page
        // Reserve space for last page by not taking all remaining items
        const itemsForPage = Math.min(continuationPageRows, remainingItems - 1);
        
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
        <div key={pageIndex} className="transport-document">
          {page.isFirstPage && (
            <>
              <div className="document-header">
                <h1>Transport Document</h1>
                <div className="document-meta">
                  <span className="document-number">TD-2025-001</span>
                  <span className="document-meta-separator">·</span>
                  <span className="document-date-wrapper">
                    <span
                      ref={dateRef}
                      className="document-date"
                      onClick={handleDateClick}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handleDateClick(e)}
                    >
                      {formatDate(documentDate)}
                    </span>
                    <DatePickerDropdown
                      value={documentDate}
                      onChange={handleDateChange}
                      onClose={handleCloseDatePicker}
                      isOpen={showDatePicker}
                    />
                  </span>
                </div>
              </div>
              
              <div className="parties-section">
                <div className="document-section">
                  <div className="party-info">
                    <p>ABC Logistics Ltd.</p>
                    <p>123 Warehouse St, Industrial Park</p>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="document-section">
                  <div className="party-info">
                    <p>XYZ Distribution Co.</p>
                    <p>456 Delivery Ave, Commerce District</p>
                    <p>+1 (555) 987-6543</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="document-section">
            <TransportDocumentTable
              items={page.items}
              unitOptions={unitOptions}
              onUpdateItem={updateItem}
              onIncrementQuantity={incrementQuantity}
              onDecrementQuantity={decrementQuantity}
              onDeleteItem={deleteItem}
              onResetRow={resetRow}
              onAddNewRow={pageIndex === pages.length - 1 ? addNewRow : undefined}
              showRulers={false}
            />
          </div>

          {pageIndex === pages.length - 1 && (
            <div className="document-footer">
              <div className="signature-section">
                <div className="signature">
                  <div className="signature-line"></div>
                  <span>Shipper Signature</span>
                </div>
                <div className="signature">
                  <div className="signature-line"></div>
                  <span>Carrier Signature</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

