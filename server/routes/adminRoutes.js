import express from 'express';
import { getAdminStats, getUsers, updateUserRole, deleteUser, getSystemSettings, updateSystemSettings } from '../controllers/adminController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only Admins can access these routes
router.get('/stats', authMiddleware, roleMiddleware('admin'), getAdminStats);
router.get('/users', authMiddleware, roleMiddleware('admin'), getUsers);
router.put('/users/:id/role', authMiddleware, roleMiddleware('admin'), updateUserRole);
router.delete('/users/:id', authMiddleware, roleMiddleware('admin'), deleteUser);
router.get('/settings', authMiddleware, roleMiddleware('admin'), getSystemSettings);
router.put('/settings', authMiddleware, roleMiddleware('admin'), updateSystemSettings);

export default router;