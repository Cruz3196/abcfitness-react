// in routes/trainer.route.js
import express from "express";
import { createTrainerProfile, updateTrainerProfile, createClass, getMyClasses, updatingClass, deleteClass, viewClassById, viewClassAttendees} from "../controllers/trainer.controller.js";
// Import your new middleware
import { protectRoute, authorize} from "../middleware/auth.middleware.js"; 

const router = express.Router();

// A user must be logged in AND have the 'trainer' role to create their profile.
router.post("/creatingTrainerProfile", protectRoute, authorize("trainer"), createTrainerProfile);
router.put("/updatingTrainerProfile", protectRoute, authorize("trainer"), updateTrainerProfile);

// class routes that a trainer can control classes
router.post("/createClass", protectRoute, authorize("trainer"), createClass); // creating a class
router.get("/viewMyClasses", protectRoute, authorize("trainer"), getMyClasses); // posted classes
router.get("/viewClass/:classId", viewClassById); // viewing a class by id
router.put("/updatingClass/:classId", protectRoute, authorize("trainer"), updatingClass); // updating a class
router.delete("/deletingClass/:classId", protectRoute, authorize("trainer"), deleteClass); // deleting a class

// viewing books in a specific class
router.get("/viewBookedUsers/:classId", protectRoute, authorize("trainer"), viewClassAttendees); // viewing booked users in a specific class

export default router;