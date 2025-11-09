import { useState, useMemo, useEffect } from 'react';
import { Document } from './design-system/organisms/Document/Document';
import { DocumentTitle } from './DocumentTitle';
import { FromTo } from './FromTo';
import { DivTable } from './DivTable';
import { SignatureFooter } from './SignatureFooter';
import { EditableTextCell } from './table/components/EditableTextCell';
import { QuantityCell } from './table/components/QuantityCell';
import { PriceCell } from './table/components/PriceCell';
import { TotalRow } from './table/components/TotalRow';
import { DragHandle } from './table/components/DragHandle';
import { RowActionButtons } from './table/components/RowActionButtons';
import './OfferDocument.css';

export const OfferDocument = ({ onHasChanges, onSave, onRevert, isEmpty = false }) => {
  const initialOfferItems = isEmpty ? [
    { id: 1, description: '', quantity: 1, unitPrice: 0, total: 0 }
  ] : [
    { id: 1, description: 'Premium Office Chairs', quantity: 12, unitPrice: 125.00, total: 1500.00 },
    { id: 2, description: 'Ergonomic Desks', quantity: 8, unitPrice: 350.00, total: 2800.00 },
    { id: 3, description: 'Monitor Stands', quantity: 15, unitPrice: 45.00, total: 675.00 },
    { id: 4, description: 'Keyboard Sets', quantity: 20, unitPrice: 85.00, total: 1700.00 },
    { id: 5, description: 'Wireless Mice', quantity: 25, unitPrice: 35.00, total: 875.00 },
    { id: 6, description: 'Desk Lamps', quantity: 10, unitPrice: 55.00, total: 550.00 }
  ];
  const initialDate = new Date().toISOString().split('T')[0];

  const [offerItems, setOfferItems] = useState(initialOfferItems);
  const [documentDate, setDocumentDate] = useState(initialDate);
  const [savedOfferItems, setSavedOfferItems] = useState(initialOfferItems);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [vatPercentage, setVatPercentage] = useState(22);

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleDatePickerToggle = (isOpen) => {
    setShowDatePicker(isOpen);
  };

  // Calculate total for each item
  const calculateTotal = (quantity, unitPrice) => {
    const qty = quantity === '' || quantity === 0 ? 0 : Number(quantity);
    const price = unitPrice === '' || unitPrice === 0 ? 0 : Number(unitPrice);
    return qty * price;
  };

  // Update totals when items change
  useEffect(() => {
    setOfferItems(prevItems => prevItems.map(item => ({
      ...item,
      total: calculateTotal(item.quantity, item.unitPrice)
    })));
  }, []);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const dateChanged = documentDate !== savedDate;
    const itemsChanged = JSON.stringify(offerItems) !== JSON.stringify(savedOfferItems);
    return dateChanged || itemsChanged;
  }, [offerItems, savedOfferItems, documentDate, savedDate]);

  // Notify parent component about changes
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanges);
    }
  }, [hasChanges, onHasChanges]);

  // Save changes
  const saveChanges = () => {
    setSavedOfferItems(JSON.parse(JSON.stringify(offerItems)));
    setSavedDate(documentDate);
    if (onSave) onSave();
  };

  // Revert changes
  const revertChanges = () => {
    setOfferItems(JSON.parse(JSON.stringify(savedOfferItems)));
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
    setOfferItems(prevItems => {
      const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
      const newItem = {
        id: maxId + 1,
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      };
      return [...prevItems, newItem];
    });
  };

  const updateItem = (id, field, value) => {
    setOfferItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate total if quantity or unitPrice changed
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = calculateTotal(updated.quantity, updated.unitPrice);
          }
          return updated;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const incrementQuantity = (id) => {
    setOfferItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
        const updated = { ...item, quantity: currentQty + 1 };
        updated.total = calculateTotal(updated.quantity, updated.unitPrice);
        return updated;
      }
      return item;
    }));
  };

  const decrementQuantity = (id) => {
    setOfferItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
        const updated = { ...item, quantity: Math.max(0, currentQty - 1) };
        updated.total = calculateTotal(updated.quantity, updated.unitPrice);
        return updated;
      }
      return item;
    }));
  };

  const deleteItem = (id) => {
    setOfferItems(prevItems => {
      const filteredItems = prevItems.filter(item => item.id !== id);
      
      // If this was the last item, add a default row
      if (filteredItems.length === 0) {
        const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
        const newItem = {
          id: maxId + 1,
          description: '',
          quantity: 1,
          unitPrice: 0,
          total: 0
        };
        return [newItem];
      }
      return filteredItems;
    });
  };

  const resetRow = (id) => {
    setOfferItems(prevItems => prevItems.map(item => 
      item.id === id 
        ? { ...item, description: '', quantity: 1, unitPrice: 0, total: 0 }
        : item
    ));
  };

  const handleDescriptionChange = (id, value) => {
    updateItem(id, 'description', value);
  };

  const handleQuantityChange = (id, value) => {
    updateItem(id, 'quantity', value);
  };

  const handleUnitPriceChange = (id, value) => {
    // PriceCell already handles parsing, just pass the value
    updateItem(id, 'unitPrice', value);
  };

  // Custom renderRow function for offer items
  const renderOfferRow = (item, index, items) => {
    const totalCount = items.length;
    const actionButton = totalCount > 1 ? 'delete' : 'reset';
    const defaultValues = { description: '', quantity: 1, unitPrice: 0, total: 0 };
    const isDefault = 
      item.description === defaultValues.description &&
      item.quantity === defaultValues.quantity &&
      item.unitPrice === defaultValues.unitPrice;

    return (
      <>
        <div className="div-description-cell-with-handle">
          <DragHandle />
          <EditableTextCell
            value={item.description}
            onChange={(value) => handleDescriptionChange(item.id, value)}
            placeholder="Enter description"
          />
        </div>
        <div className="div-table-cell">
          <QuantityCell
            value={item.quantity}
            onChange={(value) => handleQuantityChange(item.id, value)}
            onIncrement={() => incrementQuantity(item.id)}
            onDecrement={() => decrementQuantity(item.id)}
            min={0}
          />
        </div>
        <div className="div-table-cell">
          <PriceCell
            value={item.unitPrice}
            onChange={(value) => handleUnitPriceChange(item.id, value)}
            min={0}
            currencySymbol="€"
          />
        </div>
        <div className="div-row-action-cell">
          <RowActionButtons
            actionButton={actionButton}
            onDelete={() => deleteItem(item.id)}
            onReset={() => resetRow(item.id)}
            isDefault={isDefault}
          />
        </div>
      </>
    );
  };

  // Calculate pagination (similar to TransportDocument)
  const PAGE_HEIGHT_CM = 29.7;
  const PADDING_CM = 1 + 1.5;
  const HEADER_HEIGHT_CM = 3;
  const PARTIES_SECTION_CM = 5.5;
  const TABLE_HEADER_CM = 1.5;
  const ROW_HEIGHT_CM = 1.0;
  const FOOTER_HEIGHT_CM = 4;
  const ADD_BUTTON_CM = 0.8;
  const BUTTON_TO_FOOTER_GAP_CM = 1.05;
  const MIN_SPACE_BEFORE_FOOTER_CM = FOOTER_HEIGHT_CM + ADD_BUTTON_CM + BUTTON_TO_FOOTER_GAP_CM;

  const pages = useMemo(() => {
    const FIRST_PAGE_AVAILABLE = PAGE_HEIGHT_CM - PADDING_CM - HEADER_HEIGHT_CM - PARTIES_SECTION_CM - TABLE_HEADER_CM;
    const CONTINUATION_PAGE_AVAILABLE = PAGE_HEIGHT_CM - PADDING_CM - TABLE_HEADER_CM;
    
    const calculatedFirstPageRows = Math.floor((FIRST_PAGE_AVAILABLE - MIN_SPACE_BEFORE_FOOTER_CM) / ROW_HEIGHT_CM);
    const firstPageWithFooterRows = calculatedFirstPageRows;
    const calculatedFirstPageWithoutFooterRows = Math.floor((FIRST_PAGE_AVAILABLE - ADD_BUTTON_CM) / ROW_HEIGHT_CM);
    const firstPageWithoutFooterRows = calculatedFirstPageWithoutFooterRows;
    const continuationPageRows = Math.floor((CONTINUATION_PAGE_AVAILABLE - ADD_BUTTON_CM) / ROW_HEIGHT_CM);
    const lastPageRows = Math.floor((CONTINUATION_PAGE_AVAILABLE - MIN_SPACE_BEFORE_FOOTER_CM) / ROW_HEIGHT_CM);

    const result = [];
    
    if (offerItems.length === 0) {
      result.push({
        isFirstPage: true,
        items: [],
        pageNumber: 1,
        hasFooter: true
      });
      return result;
    }

    if (offerItems.length <= firstPageWithFooterRows) {
      result.push({
        isFirstPage: true,
        items: offerItems,
        pageNumber: 1,
        hasFooter: true
      });
      return result;
    }

    let currentIndex = 0;
    let pageNumber = 1;

    const totalItems = offerItems.length;
    let itemsForFirstPage;
    
    const potentialRemaining = totalItems - firstPageWithoutFooterRows;
    if (potentialRemaining > 0 && potentialRemaining <= lastPageRows) {
      itemsForFirstPage = firstPageWithoutFooterRows;
    } else if (potentialRemaining > lastPageRows) {
      itemsForFirstPage = firstPageWithoutFooterRows;
    } else {
      itemsForFirstPage = firstPageWithFooterRows;
    }

    result.push({
      isFirstPage: true,
      items: offerItems.slice(0, Math.min(totalItems, itemsForFirstPage)),
      pageNumber: pageNumber,
      hasFooter: true
    });
    currentIndex = Math.min(totalItems, itemsForFirstPage);
    pageNumber++;

    while (currentIndex < totalItems) {
      const remainingItems = totalItems - currentIndex;
      
      if (remainingItems <= continuationPageRows) {
        result.push({
          isFirstPage: false,
          items: offerItems.slice(currentIndex, totalItems),
          pageNumber: pageNumber
        });
        break;
      } else {
        const itemsForPage = Math.min(continuationPageRows, remainingItems);
        
        result.push({
          isFirstPage: false,
          items: offerItems.slice(currentIndex, currentIndex + itemsForPage),
          pageNumber: pageNumber
        });
        currentIndex += itemsForPage;
        pageNumber++;
      }
    }

    return result;
  }, [offerItems]);

  return (
    <div className="document-pages">
      {pages.map((page, pageIndex) => (
        <Document key={pageIndex} size="a4" orientation="portrait" padding={true}>
          {page.isFirstPage && (
            <>
              <DocumentTitle
                title="Offer"
                documentNumber="OF-2025-001"
                date={documentDate}
                onDateChange={handleDateChange}
                showDatePicker={showDatePicker}
                onDatePickerToggle={handleDatePickerToggle}
              />
              
              <FromTo
                fromLabel="From"
                toLabel="To"
                fromAddress={[
                  'Tech Solutions Inc.',
                  '123 Business Park, Suite 200',
                  'San Francisco, CA 94105',
                  '+1 (555) 123-4567'
                ]}
                toAddress={isEmpty ? [] : [
                  'Global Enterprises Ltd.',
                  '456 Corporate Boulevard',
                  'New York, NY 10001',
                  '+1 (555) 987-6543'
                ]}
              />
            </>
          )}

          <div className="document-content-section">
            <DivTable
              items={page.items}
              columns={['Description', 'Quantity', 'Unit Price']}
              renderRow={renderOfferRow}
              onAddNewRow={pageIndex === pages.length - 1 ? addNewRow : undefined}
              showRulers={false}
              totalItemsCount={offerItems.length}
            />
            {pageIndex === pages.length - 1 && (() => {
              const subtotal = offerItems.reduce((sum, item) => sum + (item.total || 0), 0);
              const vatAmount = (subtotal * vatPercentage) / 100;
              const total = subtotal + vatAmount;
              
              return (
                <>
                  <TotalRow
                    label="Subtotal"
                    value={subtotal}
                    currencySymbol="€"
                  />
                  <TotalRow
                    label={`VAT (${vatPercentage}%)`}
                    value={vatAmount}
                    currencySymbol="€"
                  />
                  <TotalRow
                    label="Total"
                    value={total}
                    currencySymbol="€"
                    isFinal={true}
                  />
                </>
              );
            })()}
          </div>

          {page.hasFooter && (
            <SignatureFooter
              signatures={[
                { label: 'Signature' }
              ]}
            />
          )}
        </Document>
      ))}
    </div>
  );
};
