import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FilterPill } from '../../molecules/FilterPill/FilterPill';
import { IconButton } from '../../molecules/IconButton/IconButton';
import { Icon } from '../../atoms/Icon/Icon';
import './FilterPillGroup.css';

export const FilterPillGroup = ({
  filters = [],
  onFilterChange,
  onReset,
  showResetButton = true,
  showSearchButton = false,
  searchValue = '',
  onSearchChange,
  onSearchToggle,
  isSearchExpanded = false,
  showMoreButton = false,
  moreMenuItems = [],
  onMoreMenuItemClick,
  className = '',
  ...props
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [initialWidth, setInitialWidth] = useState(null);
  const [hasMeasured, setHasMeasured] = useState(false);
  const searchInputRef = useRef(null);
  const moreButtonRef = useRef(null);
  const moreMenuRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Measure initial width only once when component mounts and search is not expanded
  useEffect(() => {
    if (groupRef.current && !hasMeasured && !isSearchExpanded) {
      // Use requestAnimationFrame to ensure measurement happens after render
      requestAnimationFrame(() => {
        if (groupRef.current && !isSearchExpanded) {
          const width = groupRef.current.offsetWidth;
          if (width > 0) {
            setInitialWidth(width);
            setHasMeasured(true);
          }
        }
      });
    }
  }, [hasMeasured, isSearchExpanded]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        moreMenuRef.current &&
        !moreMenuRef.current.contains(event.target) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target)
      ) {
        setIsMoreMenuOpen(false);
      }
    };

    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isMoreMenuOpen]);

  const handleDropdownToggle = (filterId) => {
    setOpenDropdown(openDropdown === filterId ? null : filterId);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const handleFilterSelect = (filterId, value) => {
    if (onFilterChange) {
      onFilterChange(filterId, value);
    }
    setOpenDropdown(null);
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  const handleMoreMenuToggle = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const handleMoreMenuItemClick = (item) => {
    if (onMoreMenuItemClick) {
      onMoreMenuItemClick(item);
    }
    setIsMoreMenuOpen(false);
  };

  const hasActiveFilters = filters.some(filter => filter.selectedValue !== null && filter.selectedValue !== undefined) || 
                           (searchValue && searchValue.trim().length > 0);

  // Calculate the width style based on state
  const widthStyle = useMemo(() => {
    // Don't apply width styles until we've measured the initial width
    // This prevents animation jumps
    if (!hasMeasured) {
      return undefined;
    }
    
    if (isSearchExpanded) {
      // When expanded, use 100% width
      return { width: '100%', maxWidth: '1200px' };
    }
    
    // When collapsed, use the measured width
    if (initialWidth) {
      return { width: `${initialWidth}px` };
    }
    
    return undefined;
  }, [isSearchExpanded, initialWidth, hasMeasured]);

  return (
    <div 
      ref={groupRef}
      className={`filter-pill-group ${isSearchExpanded ? 'search-expanded' : ''} ${hasMeasured ? 'width-measured' : ''} ${className}`}
      style={widthStyle}
      {...props}
    >
      {filters.map((filter) => (
        <FilterPill
          key={filter.id}
          id={filter.id}
          title={filter.title}
          placeholder={filter.placeholder}
          options={filter.options}
          selectedValue={filter.selectedValue}
          onSelect={handleFilterSelect}
          isOpen={openDropdown === filter.id}
          onToggle={handleDropdownToggle}
          onClose={handleDropdownClose}
          position={filter.position || 'bottom'}
          align={filter.align || 'left'}
        />
      ))}
      
      {showResetButton && hasActiveFilters && (
        <IconButton
          icon="reset"
          variant="default"
          size="lg"
          onClick={handleReset}
          aria-label="Reset all filters"
          className="reset-filters-button"
        />
      )}
      
      {showSearchButton && (
        <>
          <div className="search-input-wrapper" ref={searchInputRef}>
            <input
              type="text"
              className="search-input"
              placeholder="Search documents..."
              value={searchValue}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onSearchToggle && onSearchToggle(false);
                  onSearchChange && onSearchChange('');
                }
              }}
            />
          </div>
          <IconButton
            icon={isSearchExpanded ? "x" : "search"}
            variant="default"
            size="lg"
            onClick={() => onSearchToggle && onSearchToggle(!isSearchExpanded)}
            aria-label={isSearchExpanded ? "Close search" : "Open search"}
          />
        </>
      )}
      
      {showMoreButton && (
        <div className="more-options-wrapper" ref={moreButtonRef}>
          <IconButton
            icon="more"
            variant="ghost"
            size="lg"
            onClick={handleMoreMenuToggle}
            aria-label="More options"
            aria-expanded={isMoreMenuOpen}
            className="more-options-button"
          />
          {isMoreMenuOpen && moreMenuItems.length > 0 && (
            <div className="more-options-dropdown" ref={moreMenuRef}>
              {moreMenuItems.map((item, index) => (
                <button
                  key={item.id || index}
                  className="more-options-item"
                  onClick={() => handleMoreMenuItemClick(item)}
                >
                  {item.icon && (
                    <Icon name={item.icon} size="sm" variant={item.iconVariant || 'filled'} />
                  )}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPillGroup;

