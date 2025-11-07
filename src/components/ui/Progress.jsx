import './Progress.css';

/**
 * Progress Component
 * 
 * @param {Object} props
 * @param {number} props.value - Progress value (0-100)
 * @param {('sm'|'md'|'lg')} props.size - Progress bar size
 * @param {string} props.className - Additional CSS classes
 */
export function Progress({ 
  value = 0,
  size = 'md',
  className = '',
  ...props
}) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const classes = [
    'luna-progress',
    `luna-progress--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="progressbar" aria-valuenow={clampedValue} aria-valuemin="0" aria-valuemax="100" {...props}>
      <div 
        className="luna-progress__bar" 
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}

export default Progress;

