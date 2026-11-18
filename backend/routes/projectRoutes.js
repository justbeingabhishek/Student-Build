import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {projects,
    getProjects, 
    getProjectById,
     updateOneProject,
     searchProject,
      deleteProject} from "../controllers/projectController.js";

import { applyToProject } from "../controllers/applicationController.js";


const router = express.Router();

//create project
router.post("/",authMiddleware,projects)

//get all projects
router.get("/",authMiddleware,getProjects);

// search project
router.get("/search/project",authMiddleware,searchProject)

//get project by id
router.get("/:id",authMiddleware,getProjectById);

// update project
router.put("/:id",authMiddleware, updateOneProject);
//delete project
router.delete("/:id",authMiddleware,deleteProject);


export default router