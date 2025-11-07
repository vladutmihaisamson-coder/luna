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
  const RULER_SIZE = 32; // Match CSS --ruler-size
  const [horizontalGuidelines, setHorizontalGuidelines] = useState([]);
  const [verticalGuidelines, setVerticalGuidelines] = useState([]);
  const [scrollOffset, setScrollOffset] = useState({ x: 0, y: 0 });
  const rulersRef = useRef(null);
  const draggingGuidelineRef = useRef(null);

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

    const container = containerRef?.current || rulersRef.current?.querySelector('.rulers-content');
    if (container) {
      container.addEventListener('scroll', updateScrollOffset);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollOffset);
      }
    };
  }, [containerRef]);

  const getMaxPosition = (isHorizontal) =>
    isHorizontal ? Math.max(0, window.innerHeight - RULER_SIZE) : Math.max(0, window.innerWidth - RULER_SIZE);

  const clampPosition = (position, isHorizontal) => {
    const maxPosition = getMaxPosition(isHorizontal);
    return Math.max(0, Math.min(position, maxPosition));
  };

  const handleRulerMouseDown = (e, orientation) => {
    e.preventDefault();
    e.stopPropagation();
    
    const isHorizontal = orientation === 'horizontal';
    const tempId = 'temp-guideline';
    let isDragging = true;

    const handleMouseMove = (moveEvent) => {
      if (!isDragging) return;
      
      moveEvent.preventDefault();

      const currentPosition = isHorizontal ? moveEvent.clientY : moveEvent.clientX;
      const offsetPosition = currentPosition - RULER_SIZE;
      const clampedPosition = clampPosition(offsetPosition, isHorizontal);
      
      // Create or update temporary guideline while dragging
      const tempGuideline = {
        id: tempId,
        position: clampedPosition,
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
      
      upEvent.preventDefault();

      const finalPosition = isHorizontal ? upEvent.clientY : upEvent.clientX;
      const offsetPosition = finalPosition - RULER_SIZE;
      const clampedPosition = clampPosition(offsetPosition, isHorizontal);

      const isOnRuler = finalPosition <= RULER_SIZE;
      const isBeyondViewport = isHorizontal
        ? finalPosition >= window.innerHeight
        : finalPosition >= window.innerWidth;

      if (isOnRuler || isBeyondViewport) {
        if (isHorizontal) {
          setHorizontalGuidelines(prev => prev.filter(g => g.id !== tempId));
        } else {
          setVerticalGuidelines(prev => prev.filter(g => g.id !== tempId));
        }
      } else {
        // Create permanent guideline
        const newGuideline = {
          id: `guideline-${Date.now()}-${Math.random()}`,
          position: clampedPosition,
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
    
    // Store reference to the guideline element being dragged
    const guidelineElement = e.currentTarget?.closest?.('.guideline') || 
                             e.target?.closest?.('.guideline');
    if (guidelineElement) {
      draggingGuidelineRef.current = {
        id: guidelineElement.dataset?.guidelineId,
        isHorizontal: guidelineElement.classList.contains('guideline-horizontal')
      };
    }
  };

  const handleGuidelineDrag = (e, newPosition) => {
    // Use stored reference from drag start
    const draggingGuideline = draggingGuidelineRef.current;
    if (!draggingGuideline || !draggingGuideline.id) return;
    
    const { id: guidelineId, isHorizontal } = draggingGuideline;

    const offsetPosition = newPosition - RULER_SIZE;
    const clampedPosition = clampPosition(offsetPosition, isHorizontal);
    
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
    // Use stored reference from drag start
    const draggingGuideline = draggingGuidelineRef.current;
    
    if (draggingGuideline && draggingGuideline.id) {
      const isHorizontal = draggingGuideline.isHorizontal;
      const isOnRuler = finalPosition <= RULER_SIZE;
      const isBeyondViewport = isHorizontal
        ? finalPosition >= window.innerHeight
        : finalPosition >= window.innerWidth;

      if (isOnRuler || isBeyondViewport || finalPosition < 0) {
        const guidelineId = draggingGuideline.id;
        if (isHorizontal) {
          setHorizontalGuidelines(prev => prev.filter(g => g.id !== guidelineId));
        } else {
          setVerticalGuidelines(prev => prev.filter(g => g.id !== guidelineId));
        }
      }
    }
    
    // Clear the dragging reference
    draggingGuidelineRef.current = null;
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
            height={Math.max(0, dimensions.height - RULER_SIZE)}
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
              const rulerSize = 32; // Match --ruler-size
              for (let i = 0; i < sortedGuidelines.length - 1; i++) {
                const distance = Math.abs(sortedGuidelines[i + 1].position - sortedGuidelines[i].position);
                const midPosition = (sortedGuidelines[i].position + sortedGuidelines[i + 1].position) / 2;
                distances.push({
                  id: `distance-${sortedGuidelines[i].id}-${sortedGuidelines[i + 1].id}`,
                  distance,
                  position: midPosition + rulerSize, // Account for ruler offset
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
                    position: 'fixed',
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

