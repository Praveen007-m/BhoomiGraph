import { Router } from 'express';
import { createWaterResource, getWaterResources, updateWaterLevel } from '../controllers/waterResourceController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorizeMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', authorize(['farmer', 'admin', 'agronomist']), getWaterResources);
router.post('/', authorize(['farmer']), createWaterResource);
router.patch('/:id/level', authorize(['farmer']), updateWaterLevel);

export default router;
