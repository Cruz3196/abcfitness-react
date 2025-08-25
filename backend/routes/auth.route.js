import express from "express";

// importing controllers
import { createUser, loginUser, logoutUser } from "../controllers/auth.controller.js";

const router = express.Router();
//end points for signing up 
router.post("/signup", createUser)
//endpoint for logging in 
router.post("/login", loginUser)
//endpoint for logging out 
router.post("/logout", logoutUser)


export default router;