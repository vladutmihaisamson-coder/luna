import './Button.css';

/**
 * Button Component
 * 
 * @param {Object} props
 * @param {('primary'|'secondary'|'ghost')} props.variant - Button style variant
 * @param {('sm'|'md'|'lg')} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
export function Button({ 
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  children,
  className = '',
  ...props
}) {
  const classes = [
    'luna-button',
    `luna-button--${variant}`,
    `luna-button--${size}`,
    fullWidth && 'luna-button--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;

