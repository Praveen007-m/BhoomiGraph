import { Router } from 'express';
import { createBooking, getBookings } from '../controllers/serviceBookingController';
import { authenticate } from '../middlewares/authMiddleware';
import { authorize } from "../middlewares/authorizeMiddleware";

const router = Router();

// ✅ Create Booking
router.post(
  
  "/bookings",
  authenticate,
  authorize(["farmer", "admin"]),
  createBooking
);


// ✅ Get My Bookings
router.get(
  "/bookings",
  authenticate,
  authorize(["farmer", "admin"]),
  getBookings
);

export default router;