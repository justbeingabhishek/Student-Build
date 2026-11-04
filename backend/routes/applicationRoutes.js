import express from 'express'
import { 
    applyToProject,
     getMyApplications,
     getProjectApplications,
     updateApplicationStatus } from '../controllers/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

//apply to project
router.post("/projects/:id/apply",authMiddleware,applyToProject);

router.get("/me",authMiddleware,getMyApplications);

router.get("/projects/:id",authMiddleware,getProjectApplications)

router.patch("/:id/status",authMiddleware,updateApplicationStatus)
export default router