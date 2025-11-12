import { useState, useMemo, useRef } from 'react';
import { Dropdown } from './design-system/organisms/Dropdown/Dropdown';
import { Icon } from './design-system/atoms/Icon/Icon';
import './ValueChart.css';

export const ValueChart = ({ documents = [], documentTypes = [] }) => {
  const [selectedDocumentType, setSelectedDocumentType] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Generate data for the last 12 months
  const chartData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    // Generate last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      months.push({
        month: monthName,
        year: year,
        monthIndex: date.getMonth(),
        yearIndex: date.getFullYear(),
        value: 0
      });
    }

    // Filter documents by selected type
    const filteredDocs = selectedDocumentType === 'All' 
      ? documents 
      : documents.filter(doc => doc.documentType === selectedDocumentType);

    // Calculate values for each month
    filteredDocs.forEach(doc => {
      if (doc.dateObj && doc.total) {
        const docDate = doc.dateObj;
        const monthData = months.find(m => 
          m.monthIndex === docDate.getMonth() && 
          m.yearIndex === docDate.getFullYear()
        );
        if (monthData) {
          monthData.value += doc.total;
        }
      }
    });

    return months;
  }, [documents, selectedDocumentType]);

  // Calculate chart dimensions and scaling
  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const chartHeight = 300;
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Format value for display
  const formatValue = (value) => {
    if (value >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `€${(value / 1000).toFixed(1)}K`;
    }
    return `€${value.toFixed(0)}`;
  };

  // Prepare dropdown options
  const documentTypeOptions = [
    { value: 'All', label: 'All Types' },
    ...documentTypes.map(type => ({ value: type, label: type }))
  ];

  const selectedLabel = documentTypeOptions.find(opt => opt.value === selectedDocumentType)?.label || 'All Types';

  const handleSelect = (value) => {
    setSelectedDocumentType(value);
    setIsDropdownOpen(false);
  };

  return (
    <div className="value-chart-container">
      <div className="value-chart-header">
        <h3 className="value-chart-title">Value Over Time</h3>
        <div className="value-chart-selector" ref={dropdownRef}>
          <button
            className="value-chart-selector-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="value-chart-selector-text">{selectedLabel}</span>
            <Icon name="chevron-down" size="sm" variant="outline" />
          </button>
          <Dropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            options={documentTypeOptions}
            selectedValue={selectedDocumentType}
            onSelect={handleSelect}
            position="bottom"
            align="right"
          />
        </div>
      </div>
      <div className="value-chart-content">
        <svg 
          className="value-chart-svg" 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          <g className="chart-grid">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding.top + innerHeight * (1 - ratio);
              return (
                <line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  stroke="var(--stroke-color-subtle)"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              );
            })}
          </g>

          {/* Y-axis labels */}
          <g className="chart-y-axis">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding.top + innerHeight * (1 - ratio);
              const value = maxValue * ratio;
              return (
                <text
                  key={i}
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="var(--color-text-secondary)"
                  fontFamily="var(--font-family)"
                >
                  {formatValue(value)}
                </text>
              );
            })}
          </g>

          {/* Chart line and area */}
          <g className="chart-data">
            {/* Area fill */}
            <path
              d={`M ${padding.left} ${padding.top + innerHeight} ${chartData.map((d, i) => {
                const x = padding.left + (i / (chartData.length - 1)) * innerWidth;
                const y = padding.top + innerHeight - (d.value / maxValue) * innerHeight;
                return `L ${x} ${y}`;
              }).join(' ')} L ${padding.left + innerWidth} ${padding.top + innerHeight} Z`}
              fill="var(--color-primary)"
              fillOpacity="0.1"
              className="chart-area"
            />
            
            {/* Line */}
            <polyline
              points={chartData.map((d, i) => {
                const x = padding.left + (i / (chartData.length - 1)) * innerWidth;
                const y = padding.top + innerHeight - (d.value / maxValue) * innerHeight;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="2"
              className="chart-line"
            />

            {/* Data points */}
            {chartData.map((d, i) => {
              const x = padding.left + (i / (chartData.length - 1)) * innerWidth;
              const y = padding.top + innerHeight - (d.value / maxValue) * innerHeight;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="var(--color-primary)"
                    className="chart-point"
                  />
                  {/* Tooltip on hover */}
                  <title>{`${d.month} ${d.year}: ${formatValue(d.value)}`}</title>
                </g>
              );
            })}
          </g>

          {/* X-axis labels */}
          <g className="chart-x-axis">
            {chartData.map((d, i) => {
              const x = padding.left + (i / (chartData.length - 1)) * innerWidth;
              return (
                <text
                  key={i}
                  x={x}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--color-text-secondary)"
                  fontFamily="var(--font-family)"
                >
                  {d.month}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

