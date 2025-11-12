import { useNavigate } from 'react-router-dom';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import './BackButton.css';

export const BackButton = ({ onClick, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <IconButton
      icon="chevron-left"
      variant="ghost"
      size="lg"
      onClick={handleClick}
      aria-label="Go back"
      className={`back-button ${className}`}
    />
  );
};

