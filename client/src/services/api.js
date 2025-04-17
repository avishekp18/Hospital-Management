import axios from 'axios';

// Create an Axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Backend API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =========================
//  Patient APIs
// =========================
export const addPatient = (patientData) => api.post('/patients', patientData);
export const getPatients = () => api.get('/patients');
export const updatePatient = (id, patientData) => api.put(`/patients/${id}`, patientData);
export const deletePatient = (id) => api.delete(`/patients/${id}`);

// =========================
//  Doctor APIs
// =========================
export const addDoctor = (doctorData) => api.post('/doctors', doctorData);
export const getDoctors = () => api.get('/doctors');
export const updateDoctor = (id, doctorData) => api.put(`/doctors/${id}`, doctorData);
export const deleteDoctor = (id) => api.delete(`/doctors/${id}`);

// =========================
//  Appointment APIs
// =========================
export const scheduleAppointment = (appointmentData) => api.post('/appointments', appointmentData);
export const getAppointments = () => api.get('/appointments');
export const updateAppointment = (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

// =========================
//  Billing APIs
// =========================
export const createBill = (billData) => api.post('/bills', billData);
export const getBills = () => api.get('/bills');
export const deleteBill = (id) => api.delete(`/bills/${id}`);

// =========================
//  Pharmacy APIs
// =========================
export const addPharmacyItem = (itemData) => api.post('/pharmacy', itemData);
export const getPharmacyStock = () => api.get('/pharmacy');
export const updatePharmacyItem = (id, itemData) => api.put(`/pharmacy/${id}`, itemData);
export const deletePharmacyItem = (id) => api.delete(`/pharmacy/${id}`);

// =========================
//  Lab Report APIs
// =========================
export const uploadLabReport = (formData) =>
  api.post('/lab-reports/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getLabReports = (patientId) => api.get(`/lab-reports?patientId=${patientId}`);

// =========================
//  Admin APIs
// =========================
export const getAdminStats = () => api.get('/admin/stats');
export const getUsers = () => api.get('/admin/users');
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const getSystemSettings = () => api.get('/admin/settings');
export const updateSystemSettings = (settings) => api.put('/admin/settings', settings);

// =========================
//  Bed Management APIs
// =========================
export const getBeds = () => api.get('/beds');
export const updateBed = (id, bedData) => api.put(`/beds/${id}`, bedData);

// =========================
//  Notification APIs
// =========================
export const getNotifications = () => api.get('/notifications');
export const dismissNotification = (id) => api.delete(`/notifications/${id}`);

// =========================
//  Auth APIs
// =========================
export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (userData) => api.post('/auth/signup', userData);
export const submitContact = (contactData) => api.post('/contact', contactData);

export default api;
