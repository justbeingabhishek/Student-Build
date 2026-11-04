import express from "express";
import authmiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test",authmiddleware,(req,res)=>{
    res.send("Backend in working ");
})

export default router;