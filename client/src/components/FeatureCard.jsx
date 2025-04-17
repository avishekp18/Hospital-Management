import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';  // Correct import for v6
import { Card, Button } from 'react-bootstrap';     // React Bootstrap components
import './Feature.css';                             // Import custom CSS for additional styling

function FeatureCard({ title, description, icon, buttonText, redirectPath, action }) {
  const navigate = useNavigate();  // Initialize the navigate hook for routing

  const handleButtonClick = () => {
    if (action) {
      action();
    } else if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <Card style={{ width: '18rem' }} className="m-2 shadow-sm">
      <Card.Body className="text-center">
        <div style={{ fontSize: '40px' }} className="mb-3">{icon}</div>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <Button 
          variant="primary" 
          onClick={handleButtonClick}
          className="w-100">
          {buttonText}
        </Button>
      </Card.Body>
    </Card>
  );
}

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  buttonText: PropTypes.string.isRequired,
  redirectPath: PropTypes.string, // Optional if a custom action is provided
  action: PropTypes.func,         // Optional custom action
};

export default FeatureCard;
