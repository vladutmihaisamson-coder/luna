import React from 'react';
import './Ruler.css';

export const Ruler = ({
  orientation = 'horizontal', // 'horizontal' or 'vertical'
  width = 0,
  height = 0,
  scrollOffset = 0,
  className = '',
  ...props
}) => {
  const isHorizontal = orientation === 'horizontal';
  const rulerStyle = {
    width: isHorizontal ? width : 'auto',
    height: isHorizontal ? 'auto' : height,
  };

  // Generate tick marks
  const tickSize = 20; // pixels per tick
  const ticks = [];
  const rulerLength = isHorizontal ? width : height;
  const numTicks = Math.ceil(rulerLength / tickSize);

  for (let i = 0; i <= numTicks; i++) {
    const position = i * tickSize - (scrollOffset % tickSize);
    if (position >= -tickSize && position <= rulerLength + tickSize) {
      const value = Math.floor((scrollOffset + position) / tickSize) * tickSize;
      const isMajorTick = value % 100 === 0;
      const isMediumTick = value % 50 === 0;
      
      ticks.push({
        position,
        value,
        isMajor: isMajorTick,
        isMedium: isMediumTick && !isMajorTick,
        isMinor: !isMajorTick && !isMediumTick,
      });
    }
  }

  return (
    <div
      className={`ruler ruler-${orientation} ${className}`}
      style={rulerStyle}
      {...props}
    >
      <div className="ruler-ticks">
        {ticks.map((tick, index) => (
          <div
            key={`${tick.position}-${index}`}
            className={`ruler-tick ruler-tick-${orientation} ${
              tick.isMajor ? 'ruler-tick-major' : 
              tick.isMedium ? 'ruler-tick-medium' : 
              'ruler-tick-minor'
            }`}
            style={
              isHorizontal
                ? { left: `${tick.position}px` }
                : { top: `${tick.position}px` }
            }
          >
            {tick.isMajor && (
              <span className="ruler-tick-label">{tick.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

