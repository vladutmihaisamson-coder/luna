import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '../../design-system/atoms/Textarea/Textarea';
import './EditableTextCell.css';

export const EditableTextCell = ({ 
  value, 
  onChange, 
  placeholder = 'Enter description',
  className = '',
  autoResize = true
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);
  const displayRef = useRef(null);

  // Format text to convert lines starting with "-" to bullet points
  const formatTextWithBullets = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => {
      // If line starts with "- " or just "-", convert to bullet
      if (line.trim().startsWith('-')) {
        // Remove the "-" prefix
        const content = line.replace(/^-\s*/, '');
        return { type: 'bullet', content, original: line };
      }
      return { type: 'text', content: line, original: line };
    });
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleBlur = (e) => {
    setIsFocused(false);
  };

  // Sync display height with textarea height
  useEffect(() => {
    if (!isFocused && textareaRef.current && displayRef.current) {
      displayRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, isFocused]);

  const formattedLines = formatTextWithBullets(value || '');

  return (
    <div className={`editable-text-cell-wrapper ${isFocused ? 'is-focused' : ''}`}>
      {!isFocused && value && (
        <div 
          ref={displayRef}
          className="editable-text-cell-display"
          onClick={() => {
            if (textareaRef.current) {
              textareaRef.current.focus();
            }
          }}
        >
          {formattedLines.map((line, index) => (
            <div key={index} className={line.type === 'bullet' ? 'bullet-line' : 'text-line'}>
              {line.type === 'bullet' && <span className="bullet-point">•</span>}
              <span className="line-content">{line.content || '\u00A0'}</span>
            </div>
          ))}
        </div>
      )}
      <Textarea
        ref={textareaRef}
        className={`editable-text-cell ${isFocused ? 'is-editing' : 'is-hidden'} ${className}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoResize={autoResize}
        rows={1}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};

