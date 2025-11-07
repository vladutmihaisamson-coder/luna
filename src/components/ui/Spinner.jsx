import './Spinner.css';

/**
 * Spinner Component
 * 
 * @param {Object} props
 * @param {('sm'|'md'|'lg')} props.size - Spinner size
 * @param {string} props.className - Additional CSS classes
 */
export function Spinner({ 
  size = 'md',
  className = '',
  ...props
}) {
  const classes = [
    'luna-spinner',
    `luna-spinner--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="status" aria-label="Loading" {...props}>
      <span className="luna-spinner__sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;

