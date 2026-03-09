import { Router } from 'express';
import { storeNDVI, getNDVI } from '../controllers/satelliteController';

const router = Router();

router.post('/', storeNDVI);
router.get('/:farm_id', getNDVI);

export default router;
