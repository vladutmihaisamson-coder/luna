// WCAG Accessibility Color Utilities

/**
 * Calculate relative luminance of a color
 * @param {string} hex - Hex color code
 * @returns {number} - Relative luminance value
 */
export function getLuminance(hex) {
  const rgb = hexToRgb(hex);
  const [r, g, b] = rgb.map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex to RGB
 * @param {string} hex - Hex color code
 * @returns {number[]} - [r, g, b] array
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [0, 0, 0];
}

/**
 * Calculate contrast ratio between two colors
 * @param {string} color1 - First hex color
 * @param {string} color2 - Second hex color
 * @returns {number} - Contrast ratio
 */
export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 * @param {number} ratio - Contrast ratio
 * @param {string} level - 'AA' or 'AAA'
 * @param {boolean} isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns {boolean} - Whether it passes the standard
 */
export function meetsWCAG(ratio, level = 'AA', isLargeText = false) {
  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get accessibility rating for a color
 * @param {string} color - Hex color code
 * @param {string} background - Background hex color (default white)
 * @returns {object} - Accessibility information
 */
export function getAccessibilityRating(color, background = '#FFFFFF') {
  const ratio = getContrastRatio(color, background);
  
  return {
    ratio: ratio.toFixed(2),
    passesAA: meetsWCAG(ratio, 'AA', false),
    passesAALarge: meetsWCAG(ratio, 'AA', true),
    passesAAA: meetsWCAG(ratio, 'AAA', false),
    passesAAALarge: meetsWCAG(ratio, 'AAA', true),
    rating: getRating(ratio)
  };
}

function getRating(ratio) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

