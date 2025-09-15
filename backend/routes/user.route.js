import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";

// importing controllers
import { createUser, loginUser, logoutUser, refresh, getProfile } from "../controllers/auth.controller.js";
import { editUserInfo } from "../controllers/user.controller.js";

const router = express.Router();

// authentication routes
router.post("/signup", createUser)
router.post("/login", loginUser)
router.post("/refresh-token", refresh)


// Profile route for logged in users / profile management
router.get("/profile",protectRoute, getProfile)
router.put("/updateProfile", protectRoute ,editUserInfo);


// logging out the user
router.post("/logout", logoutUser)


export default router;