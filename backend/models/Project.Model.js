import mongoose  from "mongoose";
import { number } from "zod";

const projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },

    description:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    }, 
    techStack: {
        type:[String],
        required:true,
        default:[]
    },
    teamSize:{
        type:String,
        required:true
    },
    rolesNeeded:{
        type:[String],
        required:true,
        default:[]
    },
    coverImage:{
        type:String,
        default:""
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    application : {
        type : number,
        default : 0
    },
    category:{
        type:String,
        default:""
    },
    team : [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Users'
        }
    ]
})

const Project = mongoose.model("Project",projectSchema);
export default Project;