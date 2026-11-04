import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },

    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Project",
        required:true
    },
    
    status:{
        type:String,
        enum: ["pending","accepted","rejected"],
        default:"pending",
    },

    createdAt:{
        type:Date,
        default:Date.now,
    }
});

const Application = mongoose.model("Application",applicationSchema)
export default Application;