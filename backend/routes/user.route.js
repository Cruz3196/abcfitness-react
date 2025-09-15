import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

// importing controllers
import { createUser, loginUser, logoutUser, refresh} from "../controllers/auth.controller.js";
import { getProfile, editUserInfo, deleteUserAccount, viewAllClasses, bookClass,viewBookedClasses } from "../controllers/user.controller.js";

const router = express.Router();

// authentication routes
router.post("/signup", createUser)
router.post("/login", loginUser)
router.post("/refresh-token", refresh)

// booking class
router.post("/bookings/:classId", protectRoute, bookClass);
router.get("/bookings/viewBookedclasses", protectRoute, viewBookedClasses)

// Profile route for logged in users / profile management
router.get("/profile",protectRoute, getProfile)
router.put("/updateProfile", protectRoute ,editUserInfo);
router.delete("/deleteAccount", protectRoute, deleteUserAccount)

// Trainer Management 
router.get("/viewAllClasses", viewAllClasses)

// logging out the user
router.post("/logout", logoutUser)


export default router;