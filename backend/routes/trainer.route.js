// in routes/trainer.route.js
import express from "express";
import { createTrainerProfile, updateTrainerProfile, createClass, getMyClasses, updatingClass, deleteClass, viewClassById, viewClassAttendees} from "../controllers/trainer.controller.js";
// Import your new middleware
import { protectRoute, trainerRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// A user must be logged in AND have the 'trainer' role to create their profile.
router.post("/creatingTrainerProfile", protectRoute, trainerRoute, createTrainerProfile);
router.put("/updatingTrainerProfile", protectRoute, trainerRoute, updateTrainerProfile);

// class routes that a trainer can control classes
router.post("/createClass", protectRoute, trainerRoute, createClass); // creating a class
router.get("/viewMyClasses", protectRoute, trainerRoute, getMyClasses); // posted classes
router.get("/viewClass/:classId", protectRoute, trainerRoute, viewClassById); // viewing a class by id
router.put("/updatingClass/:classId", protectRoute, trainerRoute, updatingClass); // updating a class
router.delete("/deletingClass/:classId", protectRoute, trainerRoute, deleteClass); // deleting a class

// viewing books in a specific class
router.get("/viewBookedUsers/:classId", protectRoute, trainerRoute, viewClassAttendees); // viewing booked users in a specific class

export default router;