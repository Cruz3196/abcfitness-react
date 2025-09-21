import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { changeUserStatus, viewAllUsers, viewAllTrainers, pendingTrainerProfiles, viewClassInsights ,deleteUser } from '../controllers/admin.controller.js';

const router = express.Router();

// viewing all users & trainers from the data base
router.get('/users', protectRoute, adminRoute, viewAllUsers);
router.get('/trainers', protectRoute, adminRoute, viewAllTrainers);
router.get('/trainers/pending-profiles', protectRoute, adminRoute, pendingTrainerProfiles); // viewing pending trainer profiles
router.get('/classes', protectRoute, adminRoute,viewClassInsights) // viewing class insights

//deleting a user from the database, will need user id from DB to test in postman
router.delete('/users/:userId', protectRoute, adminRoute, deleteUser);

// will need to put user id in from DB to test in post man 
router.put('/users/:userId/statusChange', protectRoute, adminRoute, changeUserStatus);

export default router; 