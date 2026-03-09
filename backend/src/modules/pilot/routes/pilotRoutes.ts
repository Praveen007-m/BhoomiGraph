import { Router } from 'express';
import * as pilotController from '../controllers/pilotController';
import { authenticate } from '../../../middlewares/authMiddleware';
import { authorize } from '../../../middlewares/authorizeMiddleware';
import { surveyUpload } from '../../../middlewares/uploadMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['pilot']));

router.get('/dashboard', pilotController.getDashboard);
router.get('/bookings', pilotController.getAssignedJobs);
router.get('/bookings/:id', pilotController.getBookingDetails);
router.patch('/bookings/:id/status', pilotController.updateJobStatus);
router.post('/bookings/:id/upload', surveyUpload.fields([
    { name: 'orthomosaic', maxCount: 1 },
    { name: 'shapefile', maxCount: 1 },
    { name: 'report', maxCount: 1 },
    { name: 'preview', maxCount: 1 }
]), pilotController.uploadSurvey);

export default router;
