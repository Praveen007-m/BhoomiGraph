import { Router } from 'express';
import { createFarm, getFarms, updateFarm, deleteFarm, uploadBoundary } from '../controllers/farmController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorizeMiddleware';
import { surveyUpload } from '../middlewares/uploadMiddleware'; // Reuse general S3/Multer setup

const router = Router();

router.use(authenticate);

router.post('/', authorize(['farmer']), createFarm);
router.get('/', authorize(['farmer', 'admin']), getFarms);
router.put('/:id', authorize(['farmer']), updateFarm);
router.delete('/:id', authorize(['farmer']), deleteFarm);

// GIS Boundary Upload
router.post('/upload-boundary', authorize(['farmer']), surveyUpload.single('file'), uploadBoundary);

export default router;