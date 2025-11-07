import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  EditableTextCell, 
  QuantityCell, 
  UnitCell
} from '../components/table';
import {
  Icon,
  Button,
  Input,
  Textarea,
  Select,
  IconButton,
  DeleteButton,
  ResetButton,
  DropdownItem,
  Dropdown
} from '../components/design-system';
import './TableComponentsShowcasePage.css';

export const TableComponentsShowcasePage = () => {
  const [textValue, setTextValue] = useState('Sample description text');
  const [quantityValue, setQuantityValue] = useState(10);
  const [unitValue, setUnitValue] = useState('boxes');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('option1');

  const unitOptions = ['boxes', 'pallets', 'pieces', 'units', 'sets', 'set', 'unit', 'kg', 'tons', 'liters'];

  return (
    <div className="table-components-showcase-page">
      <div className="table-components-showcase-content">
        <div className="table-components-showcase">
          <div className="page-header">
            <h1>Table Components Showcase</h1>
            <Link to="/test-table" className="test-table-link">
              <Button variant="primary">View Test Table →</Button>
            </Link>
          </div>
          
          <div className="design-system-section">
            <h3>Design Tokens</h3>
            <p>All components use centralized design tokens for colors, spacing, typography, and more.</p>
          </div>

          <div className="design-system-section">
            <h3>Atoms</h3>
            
            <div className="component-demo">
              <h4>Icon</h4>
              <div className="demo-icons">
                <p style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>Filled Icons (Default)</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <Icon name="plus" size="sm" />
                  <Icon name="minus" size="sm" />
                  <Icon name="delete" size="sm" />
                  <Icon name="reset" size="sm" />
                  <Icon name="drag" size="sm" />
                  <Icon name="filter" size="sm" />
                </div>
              </div>
            </div>

            <div className="component-demo">
              <h4>Button</h4>
              <div className="demo-buttons">
                <Button variant="default">Default</Button>
                <Button variant="primary">Primary</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="default" size="sm">Small</Button>
              </div>
            </div>

            <div className="component-demo">
              <h4>Input</h4>
              <div className="demo-cell">
                <Input
                  value={textValue}
                  onChange={setTextValue}
                  placeholder="Enter text"
                />
              </div>
            </div>

            <div className="component-demo">
              <h4>Textarea</h4>
              <div className="demo-cell">
                <Textarea
                  value={textValue}
                  onChange={setTextValue}
                  placeholder="Enter description"
                  autoResize={true}
                />
              </div>
            </div>

            <div className="component-demo">
              <h4>Select</h4>
              <div className="demo-cell">
                <Select
                  value={unitValue}
                  onChange={setUnitValue}
                  options={unitOptions}
                  placeholder="Select unit"
                />
              </div>
            </div>

            <div className="component-demo">
              <h4>DropdownItem</h4>
              <div className="demo-cell" style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '200px' }}>
                <DropdownItem 
                  value="option1" 
                  label="Option 1" 
                  onClick={(value) => console.log('Selected:', value)}
                />
                <DropdownItem 
                  value="option2" 
                  label="Option 2" 
                  onClick={(value) => console.log('Selected:', value)}
                  isSelected={true}
                />
                <DropdownItem 
                  value="option3" 
                  label="Option 3" 
                  onClick={(value) => console.log('Selected:', value)}
                />
              </div>
            </div>
          </div>

          <div className="design-system-section">
            <h3>Molecules</h3>
            
            <div className="component-demo">
              <h4>IconButton</h4>
              <div className="demo-buttons">
                <IconButton icon="plus" variant="default" />
                <IconButton icon="delete" variant="danger" />
                <IconButton icon="reset" variant="default" />
                <IconButton icon="plus" variant="ghost" />
              </div>
            </div>
          </div>

          <div className="design-system-section">
            <h3>Organisms</h3>
            
            <div className="component-demo">
              <h4>Dropdown</h4>
              <div className="demo-cell" style={{ position: 'relative', minHeight: '200px' }}>
                <Button 
                  variant="default" 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  icon="chevron-down"
                  iconPosition="right"
                >
                  {selectedDropdownValue || 'Select option'}
                </Button>
                <Dropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                  options={[
                    { value: 'option1', label: 'Option 1' },
                    { value: 'option2', label: 'Option 2' },
                    { value: 'option3', label: 'Option 3' },
                    { value: 'option4', label: 'Option 4' }
                  ]}
                  selectedValue={selectedDropdownValue}
                  onSelect={(value) => setSelectedDropdownValue(value)}
                  position="bottom"
                  align="left"
                />
              </div>
              <p className="demo-value">Selected: {selectedDropdownValue}</p>
            </div>
          </div>

          <div className="design-system-section">
            <h3>Table Components (Molecules/Organisms)</h3>
            
            <div className="component-demo">
              <h4>EditableTextCell</h4>
              <div className="demo-cell">
                <EditableTextCell
                  value={textValue}
                  onChange={setTextValue}
                  placeholder="Enter description"
                />
              </div>
              <p className="demo-value">Value: {textValue || '(empty)'}</p>
            </div>

            <div className="component-demo">
              <h4>QuantityCell</h4>
              <div className="demo-cell">
                <QuantityCell
                  value={quantityValue}
                  onChange={setQuantityValue}
                  onIncrement={() => setQuantityValue(prev => prev + 1)}
                  onDecrement={() => setQuantityValue(prev => Math.max(0, prev - 1))}
                  min={0}
                />
              </div>
              <p className="demo-value">Value: {quantityValue}</p>
            </div>

            <div className="component-demo">
              <h4>UnitCell</h4>
              <div className="demo-cell">
                <UnitCell
                  value={unitValue}
                  onChange={setUnitValue}
                  options={unitOptions}
                  placeholder="Unit"
                />
              </div>
              <p className="demo-value">Value: {unitValue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

