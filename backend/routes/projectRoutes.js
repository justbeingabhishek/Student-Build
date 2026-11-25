import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {projects,getProjects,  getProjectById,
    updateOneProject,searchProject,deleteProject,
    saveProject,getSavedProjects, unsaveProject} from "../controllers/projectController.js";

import { applyToProject } from "../controllers/applicationController.js";


const router = express.Router();

//create project
router.post("/",authMiddleware,projects)

//get all projects
router.get("/",authMiddleware,getProjects);

// search project
router.get("/search/project",authMiddleware,searchProject)

// get save project
router.get("/savedProjects",authMiddleware,getSavedProjects);

//get project by id
router.get("/:id",authMiddleware,getProjectById);

// update project
router.put("/:id",authMiddleware, updateOneProject);
//delete project
router.delete("/:id",authMiddleware,deleteProject);

//save project
router.post("/:id/save",authMiddleware,saveProject);

// unsave project
router.delete("/:projectId/unsave",authMiddleware,unsaveProject);

export default router