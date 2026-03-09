import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorizeMiddleware';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(authorize(['admin']));

// Stats
router.get('/stats', adminController.getAdminStats);
router.get('/revenue', adminController.getRevenueStats);

// Users
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Farms
router.get('/farms', adminController.getAllFarms);
router.patch('/farms/:id/status', adminController.updateFarmStatus);

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:id/status', adminController.updateBookingStatus);

// Sensors
router.post('/sensors', adminController.addSensor);

// Content & Crops
router.get('/crops', adminController.manageCrops);
router.post('/crops', adminController.createCrop);

export default router;
