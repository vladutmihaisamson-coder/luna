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
import { DeleteButton } from './design-system/molecules/DeleteButton/DeleteButton';
import { ResetButton } from './design-system/molecules/ResetButton/ResetButton';
import './FatturaDocument.css';

export const FatturaDocument = ({ onHasChanges, onSave, onRevert, isEmpty = false, useWebPPI = false }) => {
  const initialInvoiceItems = isEmpty ? [
    { id: 1, description: '', quantity: 1, unitPrice: 0, vatPercentage: 22, total: 0 }
  ] : [
    { id: 1, description: 'Mechanical Press Rebuild Service', quantity: 1, unitPrice: 45000.00, vatPercentage: 22, total: 54900.00 },
    { id: 2, description: 'Control System Upgrade', quantity: 1, unitPrice: 12000.00, vatPercentage: 22, total: 14640.00 },
    { id: 3, description: 'New Hydraulic Pumps', quantity: 2, unitPrice: 3500.00, vatPercentage: 22, total: 8540.00 },
    { id: 4, description: 'Safety Interlocks Installation', quantity: 1, unitPrice: 4500.00, vatPercentage: 22, total: 5490.00 },
    { id: 5, description: 'Operator Training', quantity: 1, unitPrice: 2500.00, vatPercentage: 22, total: 3050.00 }
  ];
  const initialDate = new Date().toISOString().split('T')[0];

  const [invoiceItems, setInvoiceItems] = useState(initialInvoiceItems);
  const [documentDate, setDocumentDate] = useState(initialDate);
  const [savedInvoiceItems, setSavedInvoiceItems] = useState(initialInvoiceItems);
  const [savedDate, setSavedDate] = useState(initialDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [vatPercentage] = useState(22);

  const handleDateChange = (newDate) => {
    setDocumentDate(newDate);
  };

  const handleDatePickerToggle = (isOpen) => {
    setShowDatePicker(isOpen);
  };

  // Calculate total with VAT for each item
  const calculateTotalWithVAT = (quantity, unitPrice, vatPercent) => {
    const qty = quantity === '' || quantity === 0 ? 0 : Number(quantity);
    const price = unitPrice === '' || unitPrice === 0 ? 0 : Number(unitPrice);
    const vat = vatPercent === '' || vatPercent === 0 ? 0 : Number(vatPercent);
    const subtotal = qty * price;
    const vatAmount = (subtotal * vat) / 100;
    return subtotal + vatAmount;
  };

  // Update totals when items change
  useEffect(() => {
    setInvoiceItems(prevItems => prevItems.map(item => ({
      ...item,
      total: calculateTotalWithVAT(item.quantity, item.unitPrice, item.vatPercentage)
    })));
  }, []);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    const dateChanged = documentDate !== savedDate;
    const itemsChanged = JSON.stringify(invoiceItems) !== JSON.stringify(savedInvoiceItems);
    return dateChanged || itemsChanged;
  }, [invoiceItems, savedInvoiceItems, documentDate, savedDate]);

  // Notify parent component about changes
  useEffect(() => {
    if (onHasChanges) {
      onHasChanges(hasChanges);
    }
  }, [hasChanges, onHasChanges]);

  // Save changes
  const saveChanges = () => {
    setSavedInvoiceItems(JSON.parse(JSON.stringify(invoiceItems)));
    setSavedDate(documentDate);
    if (onSave) onSave();
  };

  // Revert changes
  const revertChanges = () => {
    setInvoiceItems(JSON.parse(JSON.stringify(savedInvoiceItems)));
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
    setInvoiceItems(prevItems => {
      const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
      const newItem = {
        id: maxId + 1,
        description: '',
        quantity: 1,
        unitPrice: 0,
        vatPercentage: 22,
        total: 0
      };
      return [...prevItems, newItem];
    });
  };

  const updateItem = (id, field, value) => {
    setInvoiceItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Recalculate total if quantity, unitPrice, or vatPercentage changed
          if (field === 'quantity' || field === 'unitPrice' || field === 'vatPercentage') {
            updated.total = calculateTotalWithVAT(updated.quantity, updated.unitPrice, updated.vatPercentage);
          }
          return updated;
        }
        return item;
      });
      return updatedItems;
    });
  };

  const incrementQuantity = (id) => {
    setInvoiceItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
        const updated = { ...item, quantity: currentQty + 1 };
        updated.total = calculateTotalWithVAT(updated.quantity, updated.unitPrice, updated.vatPercentage);
        return updated;
      }
      return item;
    }));
  };

  const decrementQuantity = (id) => {
    setInvoiceItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        const currentQty = item.quantity === '' ? 0 : Number(item.quantity);
        const updated = { ...item, quantity: Math.max(0, currentQty - 1) };
        updated.total = calculateTotalWithVAT(updated.quantity, updated.unitPrice, updated.vatPercentage);
        return updated;
      }
      return item;
    }));
  };

  const deleteItem = (id) => {
    setInvoiceItems(prevItems => {
      const filteredItems = prevItems.filter(item => item.id !== id);
      
      // If this was the last item, add a default row
      if (filteredItems.length === 0) {
        const maxId = prevItems.length > 0 ? Math.max(...prevItems.map(item => item.id)) : 0;
        const newItem = {
          id: maxId + 1,
          description: '',
          quantity: 1,
          unitPrice: 0,
          vatPercentage: 22,
          total: 0
        };
        return [newItem];
      }
      return filteredItems;
    });
  };

  const resetRow = (id) => {
    setInvoiceItems(prevItems => prevItems.map(item => 
      item.id === id 
        ? { ...item, description: '', quantity: 1, unitPrice: 0, vatPercentage: 22, total: 0 }
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
    updateItem(id, 'unitPrice', value);
  };

  const formatCurrencyDisplay = (value) => {
    if (value === '' || value === 0 || value === '0') return '';
    return `€${Number(value).toFixed(2)}`;
  };

  // Custom renderRow function for invoice items
  const renderInvoiceRow = (item, index, items) => {
    const totalCount = items.length;
    const actionButton = totalCount > 1 ? 'delete' : 'reset';
    const defaultValues = { description: '', quantity: 1, unitPrice: 0, vatPercentage: 22, total: 0 };
    const isDefault = 
      item.description === defaultValues.description &&
      item.quantity === defaultValues.quantity &&
      item.unitPrice === defaultValues.unitPrice &&
      item.vatPercentage === defaultValues.vatPercentage;

    return (
      <>
        <div className="div-drag-handle-cell">
          <DragHandle />
        </div>
        <div className="div-table-cell">
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
        <div className="div-table-cell fattura-total-cell">
          <div className="fattura-total-display">
            {formatCurrencyDisplay(item.total)}
          </div>
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

  // Calculate pagination (similar to OfferDocument)
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
    
    if (invoiceItems.length === 0) {
      result.push({
        isFirstPage: true,
        items: [],
        pageNumber: 1,
        hasFooter: true
      });
      return result;
    }

    if (invoiceItems.length <= firstPageWithFooterRows) {
      result.push({
        isFirstPage: true,
        items: invoiceItems,
        pageNumber: 1,
        hasFooter: true
      });
      return result;
    }

    let currentIndex = 0;
    let pageNumber = 1;

    const totalItems = invoiceItems.length;
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
      items: invoiceItems.slice(0, Math.min(totalItems, itemsForFirstPage)),
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
          items: invoiceItems.slice(currentIndex, totalItems),
          pageNumber: pageNumber
        });
        break;
      } else {
        const itemsForPage = Math.min(continuationPageRows, remainingItems);
        
        result.push({
          isFirstPage: false,
          items: invoiceItems.slice(currentIndex, currentIndex + itemsForPage),
          pageNumber: pageNumber
        });
        currentIndex += itemsForPage;
        pageNumber++;
      }
    }

    return result;
  }, [invoiceItems]);

  // Calculate totals for summary
  const subtotal = invoiceItems.reduce((sum, item) => {
    const qty = item.quantity === '' || item.quantity === 0 ? 0 : Number(item.quantity);
    const price = item.unitPrice === '' || item.unitPrice === 0 ? 0 : Number(item.unitPrice);
    return sum + (qty * price);
  }, 0);
  const vatAmount = invoiceItems.reduce((sum, item) => {
    const qty = item.quantity === '' || item.quantity === 0 ? 0 : Number(item.quantity);
    const price = item.unitPrice === '' || item.unitPrice === 0 ? 0 : Number(item.unitPrice);
    const vat = item.vatPercentage === '' || item.vatPercentage === 0 ? 0 : Number(item.vatPercentage);
    const itemSubtotal = qty * price;
    return sum + ((itemSubtotal * vat) / 100);
  }, 0);
  const total = subtotal + vatAmount;

  return (
    <div className="document-pages">
      {pages.map((page, pageIndex) => (
        <Document key={pageIndex} size="a4" orientation="portrait" padding={true} useWebPPI={useWebPPI}>
          {page.isFirstPage && (
            <>
              <DocumentTitle
                title="Invoice"
                documentNumber="FT-2025-001"
                date={documentDate}
                onDateChange={handleDateChange}
                showDatePicker={showDatePicker}
                onDatePickerToggle={handleDatePickerToggle}
              />
              
              <FromTo
                fromLabel="From"
                toLabel="To"
                fromAddress={[
                  'Digital Services SRL',
                  'Via Roma 45',
                  '20121 Milano, Italia',
                  '+39 02 1234 5678'
                ]}
                toAddress={isEmpty ? [] : [
                  'Innovation Tech SpA',
                  'Corso Vittorio Emanuele 78',
                  '10121 Torino, Italia',
                  '+39 011 9876 5432'
                ]}
              />
            </>
          )}

          <div className="document-content-section">
            <DivTable
              items={page.items}
              columns={['Description', 'Quantity', 'Unit Price', 'Total']}
              renderRow={renderInvoiceRow}
              onAddNewRow={pageIndex === pages.length - 1 ? addNewRow : undefined}
              showRulers={false}
              totalItemsCount={invoiceItems.length}
            />
          </div>

          {pageIndex === pages.length - 1 && (
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
          )}

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
