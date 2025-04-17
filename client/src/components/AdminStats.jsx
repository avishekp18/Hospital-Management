import PropTypes from 'prop-types';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FaUserMd, FaUserInjured, FaCalendarCheck, FaBed, FaMoneyBillWave, FaCapsules } from 'react-icons/fa';
import '../components/com_css/nav.css'; // Importing the external CSS file for styling

function AdminStats({ stats }) {
  const data = [
    { name: 'Patients', value: stats.totalPatients || 0 },
    { name: 'Doctors', value: stats.totalDoctors || 0 },
    { name: 'Appointments', value: stats.appointmentsToday || 0 },
    { name: 'Available Beds', value: stats.availableBeds || 0 },
    { name: 'Pending Bills', value: stats.pendingBills || 0 },
    { name: 'Stock Alerts', value: stats.stockAlerts || 0 },
  ];

  const COLORS = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6610f2'];

  return (
    <Container className="admin-stats-container">
      <h2 className="admin-stats-title">Admin Dashboard Overview</h2>
      
      <Row>
        {/* Statistics Cards */}
        {[
          { title: "Total Patients", value: stats.totalPatients || 0, icon: <FaUserInjured />, color: "#007bff" },
          { title: "Total Doctors", value: stats.totalDoctors || 0, icon: <FaUserMd />, color: "#28a745" },
          { title: "Appointments Today", value: stats.appointmentsToday || 0, icon: <FaCalendarCheck />, color: "#ffc107" },
          { title: "Available Beds", value: stats.availableBeds || 0, icon: <FaBed />, color: "#dc3545" },
          { title: "Pending Bills", value: stats.pendingBills || 0, icon: <FaMoneyBillWave />, color: "#17a2b8" },
          { title: "Stock Alerts", value: stats.stockAlerts || 0, icon: <FaCapsules />, color: "#6610f2" }
        ].map((stat, index) => (
          <Col key={index} xs={12} sm={6} md={4}>
            <Card className="stat-card" style={{ borderLeft: `5px solid ${stat.color}` }}>
              <Card.Body>
                <div className="stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
                <Card.Title className="stat-title">{stat.title}</Card.Title>
                <Card.Text className="stat-value">{stat.value}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="chart-container">
        {/* Bar Chart */}
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h4 className="chart-title">Statistics Overview</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#007bff" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col md={6}>
          <Card className="chart-card">
            <Card.Body>
              <h4 className="chart-title">Distribution Overview</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data} dataKey="value" outerRadius={100} fill="#8884d8" label>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

AdminStats.propTypes = {
  stats: PropTypes.shape({
    totalPatients: PropTypes.number,
    totalDoctors: PropTypes.number,
    appointmentsToday: PropTypes.number,
    availableBeds: PropTypes.number,
    pendingBills: PropTypes.number,
    stockAlerts: PropTypes.number,
  }).isRequired,
};

export default AdminStats;
