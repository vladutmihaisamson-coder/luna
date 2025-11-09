import React from 'react';

/**
 * Highlights matching text in a string with a yellow background
 * @param {string} text - The text to search in
 * @param {string} query - The search query
 * @returns {Array|string} Array of React elements with highlighted matches, or original text
 */
export const highlightText = (text, query) => {
  if (!query || !text || typeof text !== 'string') {
    return text;
  }

  try {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!escapedQuery) return text;
    
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);
    
    const result = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part === undefined || part === null) continue;
      
      // When splitting with a capturing group, every other part (starting from index 1) is a match
      // Check if this part matches the query (case-insensitive)
      const queryLower = query.toLowerCase();
      const partLower = String(part).toLowerCase();
      if (partLower === queryLower) {
        result.push(React.createElement('mark', { key: i, className: 'search-highlight' }, part));
      } else if (part !== '') {
        result.push(part);
      }
    }
    
    return result.length > 0 ? result : text;
  } catch (error) {
    console.error('Error highlighting text:', error);
    return text;
  }
};

/**
 * Checks if text contains the search query (case-insensitive)
 * @param {string} text - The text to search in
 * @param {string} query - The search query
 * @returns {boolean} True if text contains query
 */
export const textContainsQuery = (text, query) => {
  if (!query || !text) return false;
  return text.toLowerCase().includes(query.toLowerCase());
};

