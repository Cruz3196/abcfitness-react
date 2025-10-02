import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createCheckoutSession, checkoutSuccess,createClassCheckoutSession, classCheckoutSuccess} from '../controllers/payment.controller.js';


const router = express.Router();

// product payment routes
router.post("/createCheckoutSession", protectRoute, createCheckoutSession);
router.post("/checkoutSuccess", protectRoute, checkoutSuccess);

// booking payment routes
router.post("/createClassCheckoutSession", protectRoute, createClassCheckoutSession);
router.post("/classCheckoutSuccess", protectRoute, classCheckoutSuccess);

export default router;