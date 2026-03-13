"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceBookingController_1 = require("../controllers/serviceBookingController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authorizeMiddleware_1 = require("../middlewares/authorizeMiddleware");
const router = (0, express_1.Router)();
// ✅ Create Booking
router.post("/bookings", authMiddleware_1.authenticate, (0, authorizeMiddleware_1.authorize)(["farmer", "admin"]), serviceBookingController_1.createBooking);
// ✅ Get My Bookings
router.get("/bookings", authMiddleware_1.authenticate, (0, authorizeMiddleware_1.authorize)(["farmer", "admin"]), serviceBookingController_1.getBookings);
exports.default = router;
