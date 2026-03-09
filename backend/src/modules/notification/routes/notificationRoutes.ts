import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { authenticate } from '../../../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getMyNotifications);
router.patch('/:id/read', notificationController.markRead);

export default router;
