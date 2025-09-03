import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

// importing controllers
import { createUser, loginUser, logoutUser,refresh, getProfile } from "../controllers/auth.controller.js";

const router = express.Router();
//end points for signing up 
router.post("/signup", createUser)
//endpoint for logging in 
router.post("/login", loginUser)
//endpoint for logging out 
router.post("/logout", logoutUser)
// endpoint for refresh token
router.post("/refresh-token", refresh)
// getting the user 
router.get("/profile",protectRoute, getProfile)


export default router;