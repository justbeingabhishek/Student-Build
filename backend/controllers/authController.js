import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { signupSchema, loginSchema } from "../validations/authValidation.js";
import User from "../models/User.Model.js";

const isProduction =
  process.env.NODE_ENV === "production" || process.env.RENDER === "true";

const signup = async (req, res) => {
  //Validate the request body using zod schema
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid signup data",
      error: result.error.issues,
    });
  }
  //get validated data
  const { name, email, password } = result.data;

  //Check exisitng user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists with this email",
    });
  }
  //Hasing the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //creating new user on DB
  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // stroing the hashed password in MONGODB
      profile: `https://api.dicebear.com/10.x/voxel-bot/svg?seed=${name}`,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: ("Internal Server Error", error),
    });
  }
};

const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  //validation
  if (!result.success) {
    return res.status(400).json({
      message: "Wrong login information",
    });
  }

  // validated data
  const { email, password } = result.data;

  const userExist = await User.findOne({ email }).select("+password");

  if (!userExist) {
    return res.status(401).json({
      message: "Invalid Credentials",
    });
  }
  const isMatched = await bcrypt.compare(password, userExist.password);

  if (!isMatched) {
    return res.status(401).json({
      message: "Wrong Password",
    });
  }

  const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    success: true,
    message: "Login Successful",
    user: {
      id: userExist._id,
      name: userExist.name,
      email: userExist.email,
      profile: userExist.profile,
    },
  });
};
export { signup, login };
