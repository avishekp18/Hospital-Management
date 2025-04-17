import { useState, useEffect } from 'react';
import { Table, Card, Button, Spinner, Container } from 'react-bootstrap';
import { getAdminStats, getUsers, updateUserRole, getSystemSettings } from '../services/api';
import '../pages/CSS/AdminDashboard.css'; // External CSS
import AdminStats from '../components/AdminStats'; // Import AdminStats component

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, settingsRes] = await Promise.all([
        getAdminStats(),
        getUsers(),
        getSystemSettings()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map((user) => user._id === userId ? { ...user, role: newRole } : user));
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <Container className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      {loading ? (
        <Spinner animation="border" className="loading-spinner" />
      ) : (
        <>
          {/* AdminStats Component */}
          <AdminStats stats={stats} />

          <h2 className="section-title">User Management</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleRoleUpdate(user._id, 'admin')}>
                      Make Admin
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h2 className="section-title">System Settings</h2>
          <Card className="settings-card">
            <Card.Body>
              <Card.Title>System Mode</Card.Title>
              <Card.Text>{settings.mode}</Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
}

export default AdminDashboard;
