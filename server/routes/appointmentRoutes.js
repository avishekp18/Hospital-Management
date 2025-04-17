// server/routes/appointmentRoutes.js
import express from 'express';
import { 
  createAppointment, 
  getAppointments, 
  cancelAppointment, 
  getPatientAppointments, 
  getDoctorAppointments,
  approveAppointment,
  editAppointment,
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Log route registration for debugging
console.log('✅ Registering appointment routes...');

router.post('/', authMiddleware, roleMiddleware(['patient', 'admin']), createAppointment);
router.get('/', authMiddleware, roleMiddleware(['admin']), getAppointments);
router.get('/patients', authMiddleware, roleMiddleware(['patient']), getPatientAppointments);
router.get('/doctors', authMiddleware, roleMiddleware(['doctor']), getDoctorAppointments);
router.put('/:id/cancel', authMiddleware, roleMiddleware(['patient', 'doctor', 'admin']), cancelAppointment);
router.put('/:id/approve', authMiddleware, roleMiddleware(['doctor']), approveAppointment);
router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), editAppointment);

export default router;