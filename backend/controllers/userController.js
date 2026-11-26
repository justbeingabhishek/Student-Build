import { success } from "zod";
import mongoose from "mongoose";
import User from "../models/User.Model.js"

import updateProfileSchema from "../validations/userValidation.js"
import Project from "../models/Project.Model.js";

const getUserProfile = async (req,res)=>{
    const userid = req.userid;
    try{
        const user = await User.findById(userid).select("-password");

        if(!user){
            return res.status(404).json({
                message:"User not exists"
            })
        }
        else{
            res.json({
            user
         })
        }
    }
    catch(error){
        return res.status(500).json({
            message:"Server Error"
        })
    }
}

const updateUserProfile = async (req,res)=>{
    const userid = req.userid;
    

    try{
         const result = await updateProfileSchema.safeParse(req.body);
         if(!result.success){
            return res.status(400).json({
                message : "Invalid data"
            })
        }
        else{
         const {name,college,year,bio,skills,github,portfolio} = result.data;

         const updatedUserProfile = await User.findByIdAndUpdate(userid,
            {$set:result.data},
            {new:true, runValidators:true})
        
        return res.status(200).json({
            updatedUserProfile
        })
    }
}
    catch(error) {
  console.log(error);
  return res.status(500).json({ message: error.message });
}
   



}

const getUserById = async(req,res)=>{
    
    const userId = req.params.id;
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }
        else{
            return res.status(200).json({
                user
            })
        }
    }
    catch(error){
        return res.status(500).json({
            message:"Database error"
        })
    }
}


const getUserProject = async(req,res)=>{
    try{
        const userId = req.params.id || req.userid;

        if(!userId){
            return res.status(401).json({
                success : false,
                message  : "Unable to fetch projects"
            })
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        const projects = await Project.find({
            $or: [{ owner: userId }, { team: userId }],
        })
            .select("title description techStack")
            .sort({ createdAt: -1 });


        res.status(200).json({
            success : true,
            projects
        })

    }catch(err){
        console.error("Unable to fetch user projects:", err);
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export {getUserProfile,getUserProject,updateUserProfile,getUserById}