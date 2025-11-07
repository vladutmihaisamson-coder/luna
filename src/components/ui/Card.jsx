import './Card.css';

/**
 * Card Component
 * 
 * @param {Object} props
 * @param {('default'|'accent'|'subtle')} props.variant - Card style variant
 * @param {boolean} props.hoverable - Enable hover effect
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 */
export function Card({ 
  variant = 'default',
  hoverable = false,
  children,
  className = '',
  ...props
}) {
  const classes = [
    'luna-card',
    `luna-card--${variant}`,
    hoverable && 'luna-card--hoverable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

export default Card;

