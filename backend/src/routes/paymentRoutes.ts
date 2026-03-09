import { Router } from 'express';
import { createOrder, verifyPayment, getAllPayments } from '../controllers/paymentController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from '../middlewares/authorizeMiddleware';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getAllPayments);
router.post('/create-order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);

export default router;
