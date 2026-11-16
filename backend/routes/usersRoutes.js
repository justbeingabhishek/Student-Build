import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserProfile , updateUserProfile,getUserById, getUserProject } from '../controllers/userController.js';

const router = express.Router();

router.get("/me",authMiddleware,getUserProfile)
router.put("/me",authMiddleware,updateUserProfile)
router.get("/:id",authMiddleware,getUserById)
router.get("/me/projects",authMiddleware,getUserProject)


export default router;