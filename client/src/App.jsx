import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import AuthProvider from './context/AuthContext'; // ✅ Import from AuthProvider.js
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import PatientManagement from './pages/PatientManagement';
import DoctorManagement from './pages/DoctorManagement';
import AppointmentScheduling from './pages/AppointmentScheduling';
import BillingInvoicing from './pages/BillingInvoicing';
import PharmacyManagement from './pages/PharmacyManagement';
import LabReports from './pages/LabReports';
import AdminDashboard from './pages/AdminDashboard';
import EmergencyBedManagement from './pages/EmergencyBedManagement';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ContactUs from './pages/ContactUs';
import Logout from './pages/Logout';
import './styles.css';
import AuthProvider from './context/AuthProvider';
import Signup from './pages/Signup'; // Import Signup page
import 'bootstrap/dist/css/bootstrap.min.css';

import Chat from './pages/Chat';




function App() {
  return (
    <AuthProvider> {/* ✅ Wrap the entire app with AuthProvider */}
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/patients" element={<PatientManagement />} />
            <Route path="/doctors" element={<DoctorManagement />} />
            <Route path="/appointments" element={<AppointmentScheduling />} />
            <Route path="/billing" element={<BillingInvoicing />} />
            <Route path="/pharmacy" element={<PharmacyManagement />} />
            <Route path="/lab-reports" element={<LabReports />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/emergency-beds" element={<EmergencyBedManagement />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Chat />} />
            <Route path="/appointments" element={<AppointmentScheduling />} />
          </Routes>
          <Chat/>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
