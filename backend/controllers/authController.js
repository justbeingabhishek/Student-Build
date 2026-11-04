import bcrypt  from "bcrypt";
import jwt from "jsonwebtoken";
import {signupSchema,loginSchema} from "../validations/authValidation.js";
import User from "../models/User.Model.js";



const signup = async (req, res) => {
    //Validate the request body using zod schema
    const result = signupSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message:"Invalid signup data",
            error: result.error.issues,
        });
    }
    //get validated data 
    const {name,email,password} = result.data;

    //Check exisitng user
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.send(409).json({
            message: "User already exists with this email"
        })
    }
    //Hasing the password
    const hashedPassword = await bcrypt.hash(password,10);

    //creating new user on DB
    try{
        const user = await User.create({
        name,
        email,
        password: hashedPassword, // stroing the hashed password in MONGODB
    });
    res.status(201).json({
        message: "User created successfully",
        user:{
            id: user._id,
            name: user.name,
            email: user.email
        },
    });
    }
    catch (error){
        return res.status(500).json({
            message:("Internal Server Error",error),
        })
    }
    
    console.log(hashedPassword);
    console.log(result.data)
    
    res.send("password hashed successfully");

}


const login = async(req,res)=>{
    const result = loginSchema.safeParse(req.body);

    //validation
    if(!result.success){
        return res.status(400).json({
            message:"Wrong login information"
        })
    }

    // validated data
    const {email,password} = result.data;

    const userExist = await User.findOne({email}).select("+password");
    if(!userExist){
        res.status(401).json({
            message: "Invalid Credentials",
        })
    }
    const isMatched = await bcrypt.compare(password, userExist.password)

    if(!isMatched){
        return res.status(401).json({
            message: "Wrong Password"
        })
    }
    const token = jwt.sign({id:userExist._id},process.env.JWT_SECRET,{expiresIn:"1h"});
    return res.status(200).json({
        message: "Login Successful",
        token:token,
    })
}



export { signup ,login};