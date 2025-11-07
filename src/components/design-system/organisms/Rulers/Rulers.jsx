import React, { useState, useRef, useEffect } from 'react';
import { Ruler } from '../../atoms/Ruler/Ruler';
import { Guideline } from '../../atoms/Guideline/Guideline';
import { IconButton } from '../../molecules/IconButton/IconButton';
import './Rulers.css';

export const Rulers = ({
  containerRef,
  children,
  className = '',
  ...props
}) => {
  const [horizontalGuidelines, setHorizontalGuidelines] = useState([]);
  const [verticalGuidelines, setVerticalGuidelines] = useState([]);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const rulersRef = useRef(null);
  const containerRectRef = useRef(null);

  const updateContainerRect = () => {
    if (containerRef?.current) {
      containerRectRef.current = containerRef.current.getBoundingClientRect();
    } else if (rulersRef.current) {
      const contentElement = rulersRef.current.querySelector('.rulers-content');
      if (contentElement) {
        containerRectRef.current = contentElement.getBoundingClientRect();
      }
    }
  };

  useEffect(() => {
    const updateScrollOffset = () => {
      if (containerRef?.current) {
        setScrollOffset({
          x: containerRef.current.scrollLeft || 0,
          y: containerRef.current.scrollTop || 0,
        });
      } else if (rulersRef.current) {
        const contentElement = rulersRef.current.querySelector('.rulers-content');
        if (contentElement) {
          setScrollOffset({
            x: contentElement.scrollLeft || 0,
            y: contentElement.scrollTop || 0,
          });
        }
      }
    };

    updateScrollOffset();
    updateContainerRect();

    const container = containerRef?.current || rulersRef.current?.querySelector('.rulers-content');
    if (container) {
      container.addEventListener('scroll', updateScrollOffset);
    }
    window.addEventListener('resize', updateContainerRect);
    window.addEventListener('scroll', updateContainerRect, true);

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollOffset);
      }
      window.removeEventListener('resize', updateContainerRect);
      window.removeEventListener('scroll', updateContainerRect, true);
    };
  }, [containerRef]);

  const handleRulerMouseDown = (e, orientation) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isHorizontal = orientation === 'horizontal';
    updateContainerRect();
    const containerRect = containerRectRef.current;
    
    if (!containerRect) return;
    
    const rulerSize = 32; // Match CSS --ruler-size
    const tempId = 'temp-guideline';
    let isDragging = true;

    const handleMouseMove = (moveEvent) => {
      if (!isDragging || !containerRect) return;
      
      const currentPosition = isHorizontal ? moveEvent.clientY : moveEvent.clientX;
      // Account for ruler offset
      const relativePosition = isHorizontal
        ? currentPosition - containerRect.top
        : currentPosition - containerRect.left;
      
      // Create or update temporary guideline while dragging
      const tempGuideline = {
        id: tempId,
        position: relativePosition,
      };
      
      if (isHorizontal) {
        setHorizontalGuidelines(prev => {
          const filtered = prev.filter(g => g.id !== tempId);
          return [...filtered, tempGuideline];
        });
      } else {
        setVerticalGuidelines(prev => {
          const filtered = prev.filter(g => g.id !== tempId);
          return [...filtered, tempGuideline];
        });
      }
    };

    const handleMouseUp = (upEvent) => {
      if (!isDragging) return;
      isDragging = false;
      
      updateContainerRect();
      const finalContainerRect = containerRectRef.current;
      if (!finalContainerRect) return;
      
      const finalPosition = isHorizontal ? upEvent.clientY : upEvent.clientX;
      const relativePosition = isHorizontal
        ? finalPosition - finalContainerRect.top
        : finalPosition - finalContainerRect.left;
      
      // Check if dragged outside the page (remove guideline)
      const isOutside = isHorizontal
        ? (finalPosition < finalContainerRect.top || finalPosition > finalContainerRect.bottom)
        : (finalPosition < finalContainerRect.left || finalPosition > finalContainerRect.right);
      
      if (isOutside) {
        // Remove temporary guideline
        if (isHorizontal) {
          setHorizontalGuidelines(prev => prev.filter(g => g.id !== tempId));
        } else {
          setVerticalGuidelines(prev => prev.filter(g => g.id !== tempId));
        }
      } else {
        // Create permanent guideline
        const newGuideline = {
          id: `guideline-${Date.now()}-${Math.random()}`,
          position: relativePosition,
        };
        
        if (isHorizontal) {
          setHorizontalGuidelines(prev => {
            const filtered = prev.filter(g => g.id !== tempId);
            return [...filtered, newGuideline];
          });
        } else {
          setVerticalGuidelines(prev => {
            const filtered = prev.filter(g => g.id !== tempId);
            return [...filtered, newGuideline];
          });
        }
      }
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleGuidelineDragStart = (e, position) => {
    e.preventDefault();
    e.stopPropagation();
    updateContainerRect();
  };

  const handleGuidelineDrag = (e, newPosition) => {
    updateContainerRect();
    const containerRect = containerRectRef.current;
    if (!containerRect) return;
    
    const guidelineElement = e.target.closest('.guideline');
    if (!guidelineElement) return;
    
    const guidelineId = guidelineElement.dataset?.guidelineId;
    if (!guidelineId) return;
    
    const isHorizontal = guidelineElement.classList.contains('guideline-horizontal');
    // Convert viewport coordinates to relative position within container
    const relativePosition = isHorizontal
      ? newPosition - containerRect.top
      : newPosition - containerRect.left;
    
    // Clamp position to container bounds
    const clampedPosition = isHorizontal
      ? Math.max(0, Math.min(relativePosition, containerRect.height))
      : Math.max(0, Math.min(relativePosition, containerRect.width));
    
    if (isHorizontal) {
      setHorizontalGuidelines(prev =>
        prev.map(g => g.id === guidelineId ? { ...g, position: clampedPosition } : g)
      );
    } else {
      setVerticalGuidelines(prev =>
        prev.map(g => g.id === guidelineId ? { ...g, position: clampedPosition } : g)
      );
    }
  };

  const handleGuidelineDragEnd = (e, finalPosition) => {
    updateContainerRect();
    const containerRect = containerRectRef.current;
    
    if (containerRect) {
      const isOutside = e.clientY < containerRect.top || 
                       e.clientY > containerRect.bottom ||
                       e.clientX < containerRect.left ||
                       e.clientX > containerRect.right;
      
      if (isOutside) {
        // Find and remove the guideline that was dragged
        const guidelineElement = e.target.closest('.guideline');
        if (guidelineElement) {
          const guidelineId = guidelineElement.dataset?.guidelineId;
          if (guidelineId) {
            setHorizontalGuidelines(prev => prev.filter(g => g.id !== guidelineId));
            setVerticalGuidelines(prev => prev.filter(g => g.id !== guidelineId));
          }
        }
      }
    }
  };

  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  const updateDimensions = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const handleClearGuidelines = () => {
    setHorizontalGuidelines([]);
    setVerticalGuidelines([]);
  };

  return (
    <div ref={rulersRef} className={`rulers-container ${className}`} {...props}>
      <div className="rulers-wrapper">
        <div
          className="ruler-top"
          onMouseDown={(e) => handleRulerMouseDown(e, 'horizontal')}
        >
          <Ruler
            orientation="horizontal"
            width={dimensions.width}
            scrollOffset={scrollOffset.x}
          />
          {(horizontalGuidelines.length > 0 || verticalGuidelines.length > 0) && (
            <div 
              className="clear-guidelines-button"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <IconButton
                icon="x"
                size="sm"
                variant="ghost"
                onClick={handleClearGuidelines}
                aria-label="Clear all guidelines"
                title="Clear all guidelines"
              />
            </div>
          )}
        </div>
        <div className="rulers-content-wrapper">
          <div
            className="ruler-left"
            onMouseDown={(e) => handleRulerMouseDown(e, 'vertical')}
          >
            <Ruler
              orientation="vertical"
              height={dimensions.height - 32}
              scrollOffset={scrollOffset.y}
            />
          </div>
          <div className="rulers-content">
            {children}
            {horizontalGuidelines.map((guideline) => (
              <Guideline
                key={guideline.id}
                orientation="horizontal"
                position={guideline.position}
                onDragStart={handleGuidelineDragStart}
                onDrag={handleGuidelineDrag}
                onDragEnd={handleGuidelineDragEnd}
                data-guideline-id={guideline.id}
              />
            ))}
            {/* Distance indicators between horizontal guidelines */}
            {horizontalGuidelines.length > 1 && (() => {
              const sortedGuidelines = [...horizontalGuidelines].sort((a, b) => a.position - b.position);
              const distances = [];
              for (let i = 0; i < sortedGuidelines.length - 1; i++) {
                const distance = Math.abs(sortedGuidelines[i + 1].position - sortedGuidelines[i].position);
                const midPosition = (sortedGuidelines[i].position + sortedGuidelines[i + 1].position) / 2;
                distances.push({
                  id: `distance-${sortedGuidelines[i].id}-${sortedGuidelines[i + 1].id}`,
                  distance,
                  position: midPosition,
                });
              }
              return distances.map((dist) => (
                <div
                  key={dist.id}
                  className="guideline-distance-indicator"
                  style={{
                    top: `${dist.position}px`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {Math.round(dist.distance)}px
                </div>
              ));
            })()}
            {verticalGuidelines.map((guideline) => (
              <Guideline
                key={guideline.id}
                orientation="vertical"
                position={guideline.position}
                onDragStart={handleGuidelineDragStart}
                onDrag={handleGuidelineDrag}
                onDragEnd={handleGuidelineDragEnd}
                data-guideline-id={guideline.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

