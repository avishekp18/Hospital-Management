import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import FeatureCard from '../components/FeatureCard';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext for user role
import '../pages/CSS/HomePage.css'; // External CSS for styling

function HomePage() {
  const { user } = useContext(AuthContext); // Get the logged-in user

  // Define features with role-based access
  const features = [
    {
      title: 'Admin Dashboard',
      description: 'Manage system users, roles, and hospital settings.',
      icon: '⚙️',
      buttonText: 'Go to Admin Dashboard',
      redirectPath: '/admin',
      roles: ['admin'],
    },
    {
      title: 'Doctor Management',
      description: 'Organize doctor schedules and specialties.',
      icon: '🩺',
      buttonText: 'Go to Doctors',
      redirectPath: '/doctors',
      roles: ['admin'],
    },
    {
      title: 'Emergency Beds',
      description: 'Monitor and manage emergency bed availability.',
      icon: '🚑',
      buttonText: 'Go to Emergency Beds',
      redirectPath: '/emergency-beds',
      roles: ['admin'],
    },
    {
      title: 'Patient Management',
      description: 'Efficiently manage patient records and history.',
      icon: '👤',
      buttonText: 'Go to Patients',
      redirectPath: '/patients',
      roles: ['admin', 'doctor'],
    },
    {
      title: 'Appointments',
      description: 'Schedule and track patient appointments.',
      icon: '📅',
      buttonText: 'Go to Appointments',
      redirectPath: '/appointments',
      roles: ['admin', 'doctor', 'receptionist'],
    },
    {
      title: 'Billing & Invoicing',
      description: 'Handle payments and generate invoices.',
      icon: '💰',
      buttonText: 'Go to Billing',
      redirectPath: '/billing',
      roles: ['admin', 'billing'],
    },
    {
      title: 'Pharmacy Management',
      description: 'Track medicine stock and prescriptions.',
      icon: '💊',
      buttonText: 'Go to Pharmacy',
      redirectPath: '/pharmacy',
      roles: ['admin', 'pharmacist'],
    },
    {
      title: 'Lab Reports',
      description: 'Upload and access lab results securely.',
      icon: '🧪',
      buttonText: 'Go to Lab Reports',
      redirectPath: '/lab-reports',
      roles: ['admin', 'lab-technician', 'doctor'],
    },
    {
      title: 'Notifications',
      description: 'Stay updated with alerts and messages.',
      icon: '🔔',
      buttonText: 'View Notifications',
      redirectPath: '/notifications',
      roles: ['admin', 'doctor', 'receptionist'],
    },
    {
      title: 'Profile',
      description: 'View and update your account details.',
      icon: '👤',
      buttonText: 'Go to Profile',
      redirectPath: '/profile',
      roles: ['admin', 'doctor', 'receptionist', 'pharmacist', 'billing', 'lab-technician'],
    },
  ];

  // Filter features based on user role
  const filteredFeatures = user
    ? features.filter(feature => feature.roles.includes(user.role))
    : [];

  return (
    <Container className="home-page-container">
      <h1 className="page-title">Welcome to HMS</h1>
      <p className="page-subtitle">
        A comprehensive solution for hospital management.
      </p>
      <Row className="feature-grid">
        {filteredFeatures.length > 0 ? (
          filteredFeatures.map((feature, index) => (
            <Col key={index} xs={12} sm={6} md={4} lg={3} className="feature-col">
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                buttonText={feature.buttonText}
                redirectPath={feature.redirectPath}
              />
            </Col>
          ))
        ) : (
          <p className="no-access-message">
            {user ? "You do not have access to any features." : "Please log in to access the system."}
          </p>
        )}
      </Row>
    </Container>
  );
}

export default HomePage;
