import { Router } from 'express';
import * as farmerController from '../controllers/farmerController';
import { authenticate } from '../../../middlewares/authMiddleware';
import { authorize } from '../../../middlewares/authorizeMiddleware';

const router = Router();

// All routes protected and allowed for farmers only
router.use(authenticate);
router.use(authorize(['farmer']));

router.get('/dashboard', farmerController.getDashboard);
router.get('/farms', farmerController.getFarms);
router.post('/farms', farmerController.createFarm);
router.get('/farms/:farmId/ndvi', farmerController.getNDVI);
router.get('/farms/:farmId/iot', farmerController.getIoTData);
router.get('/bookings', farmerController.getBookings);
router.post('/bookings', farmerController.createBooking);
router.get('/drone-projects', farmerController.getDroneProjects);
router.get('/alerts', farmerController.getAlerts);
router.put('/alerts/:id/read', farmerController.markAlertRead);

export default router;
