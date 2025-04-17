import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap'; // Import Bootstrap components
import '../pages/CSS/signup.css'; // Importing the external CSS file for styling

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login: loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect logged-in users to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return 'Invalid email format';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    if (!formData.username.trim()) {
      return 'Username is required';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/signup', {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      const { token, user: newUser } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      await loginUser(formData.email, formData.password);
      setSuccess('Signup successful! Redirecting...');
      setTimeout(() => navigate('/'), 2000); // Delay redirect for feedback
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} sm={12}>
            <div className="signup-card">
              <h2 className="signup-title">Sign Up</h2>

              {/* Error and Success Messages */}
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={handleSubmit} className="signup-form">
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter your email"
                    className="input-field"
                  />
                </Form.Group>

                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Choose a username"
                    className="input-field"
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter your password"
                    className="input-field"
                  />
                </Form.Group>

                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Confirm your password"
                    className="input-field"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Signing up...' : 'Sign Up'}
                </Button>
              </Form>

              <p className="signup-footer">
                Already have an account?{' '}
                <a href="/login" className="signup-link">Login</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;
