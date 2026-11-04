import User from "../models/User.Model.js"

import updateProfileSchema from "../validations/userValidation.js"

const getUserProfile = async (req,res)=>{
    const userid = req.userid;
    try{
        const user = await User.findById(req.userid)

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

         const updatedUserProfile = await User.findByIdAndUpdate(req.userid,
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
export {getUserProfile,updateUserProfile,getUserById}