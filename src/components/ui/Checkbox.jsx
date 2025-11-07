import './Checkbox.css';

/**
 * Checkbox Component
 * 
 * @param {Object} props
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.checked - Checked state
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.className - Additional CSS classes
 */
export function Checkbox({ 
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  const classes = [
    'luna-checkbox',
    className
  ].filter(Boolean).join(' ');

  return (
    <label className={classes}>
      <input 
        type="checkbox"
        className="luna-checkbox__input"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && <span className="luna-checkbox__label">{label}</span>}
    </label>
  );
}

export default Checkbox;

