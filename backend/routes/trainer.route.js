import express from "express";

//importing controllers 


import { productRoute } from "./product.route.js";  

const router = express.Router();

// this will be done with admin privileges
router.post("/createTrainerProfile", createTrainerProfile);


export default router; 