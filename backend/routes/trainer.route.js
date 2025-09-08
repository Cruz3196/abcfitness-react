import express from "express";

//importing controllers 
import { createTrainer } from "../controllers/trainer.controller.js";

import { productRoute } from "./product.route.js";  

const router = express.Router();

// this will be done with admin privileges
router.post("/Createtrainer", createTrainer);


export default router; 