// in routes/trainer.route.js
import express from "express";
import { createTrainerProfile, updateTrainerProfile, createClass, getMyClasses, updatingClass, deleteClass} from "../controllers/trainer.controller.js";
// Import your new middleware
import { protectRoute, trainerRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// A user must be logged in AND have the 'trainer' role to create their profile.
router.post("/creatingTrainerProfile", protectRoute, trainerRoute, createTrainerProfile);
router.put("/updatingTrainerProfile", protectRoute, trainerRoute, updateTrainerProfile);

// class routes that a trainer can control 
router.post("/createClass", protectRoute, trainerRoute, createClass);
router.get("/viewMyClasses", protectRoute, trainerRoute, getMyClasses);;
router.put("/updatingClass/:classId", protectRoute, trainerRoute, updatingClass);
router.delete("/deletingClass/:classId", protectRoute, trainerRoute, deleteClass);


export default router;