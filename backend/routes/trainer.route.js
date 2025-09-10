// in routes/trainer.route.js
import express from "express";
import { createTrainerProfile, updateTrainerProfile, createClass } from "../controllers/trainer.controller.js";
// Import your new middleware
import { protectRoute, trainerRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// A user must be logged in AND have the 'trainer' role to create their profile.
router.post("/creatingTrainerProfile", protectRoute, trainerRoute, createTrainerProfile);
router.post("/createClass", protectRoute, trainerRoute, createClass);
router.put("/updatingTrainerProfile", protectRoute, trainerRoute, updateTrainerProfile);


export default router;