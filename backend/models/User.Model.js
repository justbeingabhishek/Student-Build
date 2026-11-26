import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    password :{
        type:String,
        required:true,
        select:false
    },
    passwordResetOtpHash: {
        type: String,
        select: false,
    },
    passwordResetOtpExpiresAt: {
        type: Date,
        select: false,
    },
    passwordResetOtpAttempts: {
        type: Number,
        default: 0,
        select: false,
    },
    passwordResetOtpSentAt: {
        type: Date,
        select: false,
    },
    college : {
        type:String,
        default : ""
    },
    year:{
        type:Number,
        default: 0
    },
    bio:{
        type:String,
        default : ""
       
    },
    skills:{
        type:[String],
        default:[],
    },
    github:{
        type:String,
        default : ""
    },
    portfolio:{
        type:String,
        default : ""
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
    profile : {
        type:String,  
        required:true 
    },
    Myapplications : {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Applications',
    },
    MyProjects : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
    } ],
    SavedProject : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Project',
    } ],
});

const User = mongoose.model('Users',userSchema);

export default User;