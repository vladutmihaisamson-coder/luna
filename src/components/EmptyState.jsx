import { Icon } from './design-system/atoms/Icon/Icon';
import './EmptyState.css';

export const EmptyState = ({
  icon = 'inbox',
  title = 'Nothing found',
  message = 'No items match your current filters or search.',
  action,
  className = ''
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon">
        <Icon name={icon} size="xl" variant="outline" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {message && (
        <p className="empty-state-message">{message}</p>
      )}
      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
};

