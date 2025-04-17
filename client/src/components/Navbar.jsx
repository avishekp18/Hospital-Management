import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Dropdown } from 'react-bootstrap'; // Import Dropdown for username menu
import { AuthContext } from '../context/AuthContext'; // Make sure your AuthContext is correctly imported
import '../components/com_css/nav.css'; // Importing the external CSS file for styling

function NavbarComponent() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">HMS</Link>
        <Navbar.Toggle aria-controls="navbarNav" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" className="nav-link">Home</Nav.Link>

            {user && (
              <>
                {user.role === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin" className="nav-link">Admin Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/doctors" className="nav-link">Doctors</Nav.Link>
                    <Nav.Link as={Link} to="/emergency-beds" className="nav-link">Emergency Beds</Nav.Link>
                  </>
                )}
                {(user.role === 'doctor' || user.role === 'admin') && (
                  <Nav.Link as={Link} to="/patients" className="nav-link">Patients</Nav.Link>
                )}
                <Nav.Link as={Link} to="/appointments" className="nav-link">Appointments</Nav.Link>
                <Nav.Link as={Link} to="/billing" className="nav-link">Billing</Nav.Link>
                <Nav.Link as={Link} to="/pharmacy" className="nav-link">Pharmacy</Nav.Link>
                <Nav.Link as={Link} to="/lab-reports" className="nav-link">Lab Reports</Nav.Link>
                <Nav.Link as={Link} to="/notifications" className="nav-link">Notifications</Nav.Link>
              </>
            )}

            <Nav.Link as={Link} to="/contact" className="nav-link">Contact Us</Nav.Link>

            {user ? (
              <Dropdown align="end">
                {/* Circle Avatar with first letter */}
                <Dropdown.Toggle variant="link" id="dropdown-user" className="no-caret">
                  <div className="avatar-circle">{user.username[0]}</div>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
                  <Dropdown.Item as={Link} to="/notifications">Notifications</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="nav-link">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}

export default NavbarComponent;
