import express from 'express'
import { 
    applyToProject,
     getMyApplications,
     getProjectApplications,
     updateApplicationStatus } from '../controllers/applicationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router()

//apply to project

router.post("/project/apply",authMiddleware,applyToProject);

router.get("/me",authMiddleware,getMyApplications);

router.get("/application/project/:id",authMiddleware,getProjectApplications)

router.put("/status/:id",authMiddleware,updateApplicationStatus)

export default router