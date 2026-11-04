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
    college : {
        type:String
    },
    year:{
        type:Number
    },
    bio:{
        type:String,
       
    },
    skills:{
        type:[String],
        default:[],
    },
    github:{
        type:String,
       
    },
    portfolio:{
        type:String,
       
    },
    createdAt: {
        type:Date,
        default:Date.now
    },
});

const User = mongoose.model('Users',userSchema);

export default User;