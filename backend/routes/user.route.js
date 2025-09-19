import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

// importing controllers
import { createUser, loginUser, logoutUser, refresh} from "../controllers/auth.controller.js";
import { getProfile, editUserInfo, deleteUserAccount, viewAllClasses, bookClass,viewBookedClasses, cancelBooking, submitFeedback, updateFeedback, deleteFeedback, allTrainers, viewTrainer} from "../controllers/user.controller.js";

const router = express.Router();

// authentication routes
router.post("/signup", createUser)
router.post("/login", loginUser)
router.post("/refresh-token", refresh)
router.post("/logout", logoutUser)

// Profile route for logged in users / profile management
router.get("/profile",protectRoute, getProfile)
router.put("/updateProfile", protectRoute ,editUserInfo);
router.delete("/deleteAccount", protectRoute, deleteUserAccount)

// User Booking class routes 
router.post("/bookings/:classId", protectRoute, bookClass);
router.get("/bookings/viewBookedclasses", protectRoute, viewBookedClasses)
router.post("/cancelBooking/:classId", protectRoute, cancelBooking)

// Feedback routes 
router.post("/submitFeedback/:classId", protectRoute, submitFeedback);
router.put("/updateFeedback/:reviewId", protectRoute, updateFeedback);
router.delete("/deleteFeedback/:reviewId", protectRoute, deleteFeedback);

// Trainer Management 
router.get("/ourClasses", viewAllClasses)
router.get("/ourTrainers", allTrainers)
router.get("/viewTrainer/:trainerId", viewTrainer)


export default router;