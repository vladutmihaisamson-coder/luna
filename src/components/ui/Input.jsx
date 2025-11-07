import './Input.css';

/**
 * Input Component
 * 
 * @param {Object} props
 * @param {('text'|'email'|'password'|'number'|'tel'|'url')} props.type - Input type
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.error - Error state
 * @param {boolean} props.fullWidth - Full width input
 * @param {string} props.className - Additional CSS classes
 */
export function Input({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  error = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const classes = [
    'luna-input',
    error && 'luna-input--error',
    fullWidth && 'luna-input--full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <input 
      type={type}
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  );
}

export default Input;

