import './Alert.css';

/**
 * Alert Component
 * 
 * @param {Object} props
 * @param {string} props.title - Alert title
 * @param {React.ReactNode} props.children - Alert content
 * @param {string} props.icon - Icon to display (emoji or text)
 * @param {string} props.className - Additional CSS classes
 */
export function Alert({ 
  title,
  children,
  icon = 'ℹ',
  className = '',
  ...props
}) {
  const classes = [
    'luna-alert',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="luna-alert__icon">{icon}</div>
      <div className="luna-alert__content">
        {title && <strong className="luna-alert__title">{title}</strong>}
        <div className="luna-alert__message">{children}</div>
      </div>
    </div>
  );
}

export default Alert;

