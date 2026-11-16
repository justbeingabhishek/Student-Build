import { success } from "zod";
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
        const userId = req.userid;

        console.log("userid : ",userId);
        if(!userId){
            return res.status(401).json({
                success : false,
                message  : "Unable to fetch projects"
            })
        }

        const projects = await Project.find({
            owner : userId
        })

        if(projects.length==0){
            return res.status(401).json({
                success:false,
                message : "0 projects under this user id"
            })
        }

        res.status(200).json({
            success : true,
            projects
        })

    }catch(err){
        console.log("error : ",err.message);
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }
}

export {getUserProfile,getUserProject,updateUserProfile,getUserById}