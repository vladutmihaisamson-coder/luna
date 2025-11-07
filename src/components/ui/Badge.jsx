import './Badge.css';

/**
 * Badge Component
 * 
 * @param {Object} props
 * @param {('solid'|'outline'|'subtle')} props.variant - Badge style variant
 * @param {('sm'|'md')} props.size - Badge size
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.className - Additional CSS classes
 */
export function Badge({ 
  variant = 'solid',
  size = 'md',
  children,
  className = '',
  ...props
}) {
  const classes = [
    'luna-badge',
    `luna-badge--${variant}`,
    `luna-badge--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

export default Badge;

