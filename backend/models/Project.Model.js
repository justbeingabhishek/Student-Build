import mongoose  from "mongoose";

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
        ref:'User',
        required:true
    }, 

    techStack: {
        type:[String],
        required:true,
        default:[]
    },

    requiredSkills:{
        type:[String],
        required:true,
        default:[]
    },

    teamSize:{
        type:Number,
        required:true,
    },

    deadline:{
        type:Date
    },

    status:{
        type:String,
        enum: ["open", "closed"],
        default: "open"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Project = mongoose.model("Project",projectSchema);
export default Project;