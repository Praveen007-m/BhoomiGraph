import { Router } from 'express';
import { registerDevice, getDevices } from '../controllers/iotController';

const router = Router();

router.post('/register', registerDevice);
router.get('/', getDevices);
router.get('/:farm_id', getDevices);

export default router;
