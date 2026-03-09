import { Router } from 'express';
import * as agronomistController from '../controllers/agronomistController';
import { authenticate } from '../../../middlewares/authMiddleware';
import { authorize } from '../../../middlewares/authorizeMiddleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['agronomist']));

router.get('/dashboard', agronomistController.getDashboard);
router.get('/farms', agronomistController.getFarms);
router.get('/farms/:id', agronomistController.getFarmDetails);
router.get('/advisories', agronomistController.getAdvisories);
router.get('/advisories/:id', agronomistController.getAdvisoryDetails);
router.post('/advisories', agronomistController.createAdvisory);
router.patch('/advisories/:id', agronomistController.updateAdvisory);

export default router;
