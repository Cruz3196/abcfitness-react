import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createCheckoutSession, checkoutSuccess,createBookingCheckoutSession, bookingCheckoutSuccess} from '../controllers/payment.controller.js';


const router = express.Router();

// product payment routes
router.post("/createCheckoutSession", protectRoute, createCheckoutSession);
router.post("/checkoutSuccess", protectRoute, checkoutSuccess);

// booking payment routes
router.post("/createBookingSession", protectRoute,createBookingCheckoutSession);
router.post("/bookingSuccess", protectRoute, bookingCheckoutSuccess)

export default router;