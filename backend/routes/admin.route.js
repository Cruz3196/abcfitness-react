import express from "express";
import { protectRoute, authorize } from "../middleware/auth.middleware.js";
import {
  changeUserStatus,
  viewAllUsers,
  viewAllTrainers,
  pendingTrainerProfiles,
  viewClassInsights,
  deleteUser,
  getDashboardStats,
  getAllOrders,
} from "../controllers/admin.controller.js";

const router = express.Router();

// viewing all users & trainers from the data base
router.get("/users", protectRoute, authorize("admin"), viewAllUsers);
router.get("/trainers", protectRoute, authorize("admin"), viewAllTrainers);
router.get(
  "/trainers/pending-profiles",
  protectRoute,
  authorize("admin"),
  pendingTrainerProfiles
); // viewing pending trainer profiles
router.get("/classes", protectRoute, authorize("admin"), viewClassInsights); // viewing class insights
router.get("/orders", protectRoute, authorize("admin"), getAllOrders); // viewing all orders

//deleting a user from the database, will need user id from DB to test in postman
router.delete("/users/:userId", protectRoute, authorize("admin"), deleteUser);

// will need to put user id in from DB to test in post man
router.put(
  "/users/:userId/statusChange",
  protectRoute,
  authorize("admin"),
  changeUserStatus
);

// getting the dasboard statistics
router.get(
  "/dashboard/stats",
  protectRoute,
  authorize("admin"),
  getDashboardStats
);

export default router;
