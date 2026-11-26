import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserProfile , updateUserProfile,getUserById, getUserProject } from '../controllers/userController.js';

const router = express.Router();

router.get("/me",authMiddleware,getUserProfile)
router.put("/me",authMiddleware,updateUserProfile)
router.get("/me/projects",authMiddleware,getUserProject)
router.get("/:id/projects",authMiddleware,getUserProject)
router.get("/:id",authMiddleware,getUserById)


export default router;