import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccessibilityRating } from '../utils/accessibility';
import './ColorResearch.css';

const colors = [
  {
    name: 'Electric Blue',
    hex: '#0F4FB8',
    originalHex: '#2978FF',
    description: 'fresh, tech-forward, trustworthy'
  }
];

function ColorResearch() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const accessibilityInfo = getAccessibilityRating(selectedColor.hex, '#FFFFFF');

  return (
    <div className="color-research">
      <header className="color-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Color Research Lab</h1>
        <p>Test and explore WCAG-compliant design system colors on different components</p>
      </header>

      <div className="color-selector">
        {colors.map((color) => (
          <button
            key={color.hex}
            className={`color-option ${selectedColor.hex === color.hex ? 'active' : ''}`}
            onClick={() => setSelectedColor(color)}
          >
            <div className="color-swatch" style={{ backgroundColor: color.hex }}></div>
            <div className="color-info">
              <strong>{color.name}</strong>
              <span>{color.hex}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="color-showcase">
        <div className="showcase-header">
          <h2>{selectedColor.name}</h2>
          <p className="color-description">{selectedColor.description}</p>
          
          <div className="accessibility-info">
            <h3>Accessibility Check</h3>
            <div className="accessibility-grid">
              <div className="color-comparison">
                <div className="color-box">
                  <div className="color-label">Original</div>
                  <div className="color-square" style={{ backgroundColor: selectedColor.originalHex }}>
                    <span>{selectedColor.originalHex}</span>
                  </div>
                </div>
                <div className="arrow">→</div>
                <div className="color-box">
                  <div className="color-label">WCAG Compliant</div>
                  <div className="color-square" style={{ backgroundColor: selectedColor.hex }}>
                    <span>{selectedColor.hex}</span>
                  </div>
                </div>
              </div>
              
              <div className="wcag-results">
                <div className="wcag-metric">
                  <span className="metric-label">Contrast Ratio (on white):</span>
                  <span className="metric-value">{accessibilityInfo.ratio}:1</span>
                </div>
                <div className="wcag-badges">
                  <span className={`wcag-badge ${accessibilityInfo.passesAA ? 'pass' : 'fail'}`}>
                    {accessibilityInfo.passesAA ? '✓' : '✗'} WCAG AA
                  </span>
                  <span className={`wcag-badge ${accessibilityInfo.passesAALarge ? 'pass' : 'fail'}`}>
                    {accessibilityInfo.passesAALarge ? '✓' : '✗'} AA Large Text
                  </span>
                  <span className={`wcag-badge ${accessibilityInfo.passesAAA ? 'pass' : 'fail'}`}>
                    {accessibilityInfo.passesAAA ? '✓' : '✗'} WCAG AAA
                  </span>
                </div>
                <div className="accessibility-note">
                  <strong>Rating:</strong> {accessibilityInfo.rating} - {
                    accessibilityInfo.passesAA 
                      ? 'Excellent for all text sizes' 
                      : accessibilityInfo.passesAALarge 
                        ? 'Good for large text only' 
                        : 'Needs improvement'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="components-grid">
          {/* Buttons Section */}
          <section className="component-section">
            <h3>Buttons</h3>
            <div className="component-examples">
              <button 
                className="demo-button primary" 
                style={{ backgroundColor: selectedColor.hex }}
              >
                Primary Button
              </button>
              <button className="demo-button outline">
                Secondary Button
              </button>
              <button className="demo-button ghost">
                Tertiary Button
              </button>
            </div>
            <p className="component-note">
              ℹ️ Only primary buttons use Electric Blue. Secondary and tertiary buttons use subtle gray tones.
            </p>
          </section>

          {/* Cards Section */}
          <section className="component-section">
            <h3>Cards</h3>
            <div className="component-examples">
              <div className="demo-card accent-border">
                <h4>Card with Accent Border</h4>
                <p>Clean card with subtle gray border for content organization</p>
              </div>
              <div className="demo-card colored-bg">
                <h4>Card with Subtle Background</h4>
                <p>Light gray background for visual separation</p>
              </div>
            </div>
          </section>

          {/* Badges Section */}
          <section className="component-section">
            <h3>Badges & Tags</h3>
            <div className="component-examples badges">
              <span className="demo-badge solid">
                Default
              </span>
              <span className="demo-badge outline">
                Outline
              </span>
              <span className="demo-badge subtle">
                Subtle
              </span>
            </div>
            <p className="component-note">
              ℹ️ Badges use subtle gray tones for neutral information display.
            </p>
          </section>

          {/* Alerts Section */}
          <section className="component-section">
            <h3>Alerts & Notifications</h3>
            <div className="component-examples">
              <div className="demo-alert">
                <div className="alert-icon">ℹ</div>
                <div>
                  <strong>Information Alert</strong>
                  <p>This is a neutral informational message with subtle gray styling</p>
                </div>
              </div>
            </div>
          </section>

          {/* Form Elements Section */}
          <section className="component-section">
            <h3>Form Elements</h3>
            <div className="component-examples">
              <input 
                type="text" 
                className="demo-input" 
                placeholder="Input field"
              />
              <div className="demo-checkbox-group">
                <label className="demo-checkbox">
                  <input type="checkbox" />
                  <span>Checkbox option</span>
                </label>
                <label className="demo-checkbox">
                  <input type="radio" name="demo-radio" />
                  <span>Radio option</span>
                </label>
              </div>
            </div>
            <p className="component-note">
              ℹ️ Form elements use gray borders. On focus, they show Electric Blue to indicate interaction.
            </p>
          </section>

          {/* Progress & Loading Section */}
          <section className="component-section">
            <h3>Progress & Loading</h3>
            <div className="component-examples">
              <div className="demo-progress">
                <div 
                  className="progress-bar" 
                  style={{ 
                    backgroundColor: selectedColor.hex,
                    width: '65%' 
                  }}
                ></div>
              </div>
              <div className="demo-spinner-container">
                <div 
                  className="demo-spinner" 
                  style={{ borderTopColor: selectedColor.hex }}
                ></div>
              </div>
            </div>
            <p className="component-note">
              ℹ️ Progress indicators use Electric Blue to show active state and completion.
            </p>
          </section>

          {/* Links & Text Section */}
          <section className="component-section">
            <h3>Links & Text Highlights</h3>
            <div className="component-examples">
              <p>
                This is a paragraph with a{' '}
                <a href="#" style={{ color: selectedColor.hex }}>
                  link
                </a>
                {' '}and some{' '}
                <mark>highlighted text</mark>
                {' '}in the content.
              </p>
            </div>
            <p className="component-note">
              ℹ️ Links use Electric Blue. Text highlights use subtle gray for emphasis.
            </p>
          </section>

          {/* Icons & Decorative Elements */}
          <section className="component-section">
            <h3>Icons & Decorative Elements</h3>
            <div className="component-examples icons">
              <div className="demo-icon-circle">
                ✓
              </div>
              <div className="demo-icon-circle outline">
                →
              </div>
              <div className="demo-icon-circle subtle">
                ★
              </div>
            </div>
            <p className="component-note">
              ℹ️ Icons use subtle gray tones. Use Electric Blue only for primary icon actions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ColorResearch;

