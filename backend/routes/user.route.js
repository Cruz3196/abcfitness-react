import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

// importing controllers
import { createUser, loginUser, logoutUser, refresh} from "../controllers/auth.controller.js";
import { getProfile, editUserInfo, deleteUserAccount, viewAllClasses, bookClass,viewBookedClasses, cancelBooking, submitFeedback, updateFeedback, deleteFeedback, allTrainers, viewTrainer, forgotPassword, resetPassword, getOrderHistory, fetchFeedBackByClass, getOrderById} from "../controllers/user.controller.js";

const router = express.Router();

// authentication routes
router.post("/signup", createUser)
router.post("/login", loginUser)
router.post("/refresh-token", refresh)
router.post("/logout", logoutUser)

//forgot password and reset password routes will be added later
router.post("/forgotPassword",forgotPassword);
router.put("/resetPassword/:token", resetPassword);

// Profile route for logged in users / profile management
router.get("/profile",protectRoute, getProfile)
router.put("/updateProfile", protectRoute ,editUserInfo);
router.delete("/deleteAccount", protectRoute, deleteUserAccount)

// Account GetHistory Order 
router.get("/orderHistory", protectRoute, getOrderHistory);
router.get("/orders/:orderId", protectRoute, getOrderById); 

// User Booking class routes 
router.get("/ourClasses", viewAllClasses)
router.post("/bookings/:classId", protectRoute, bookClass);
// once logged in user can view their booked classes
router.get("/bookings", protectRoute, viewBookedClasses)
router.delete("/cancelBooking/:bookingId", protectRoute, cancelBooking)

// Feedback routes 
router.post("/submitFeedback/:classId", protectRoute, submitFeedback);
router.put("/updateFeedback/:reviewId", protectRoute, updateFeedback);
router.delete("/deleteFeedback/:reviewId", protectRoute, deleteFeedback);
router.get("/feedback/:classId", fetchFeedBackByClass)

// Trainer Management 
router.get("/ourTrainers", allTrainers)
router.get("/viewTrainer/:trainerId", viewTrainer)


export default router;