import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <div className="profile-actions">
        <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        <Button variant="danger" onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  );
}

export default Profile;
