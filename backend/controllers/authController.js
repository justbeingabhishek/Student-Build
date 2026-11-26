import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyResetPasswordOtpSchema,
  resetPasswordSchema,
} from "../validations/authValidation.js";
import User from "../models/User.Model.js";
import { sendPasswordResetOtp } from "../services/api.js";

const resetOtpLifetimeMs = 10 * 60 * 1000;
const resetOtpResendWaitMs = 60 * 1000;
const maxResetOtpAttempts = 5;

const hashResetOtp = (otp) =>
  createHash("sha256").update(otp).digest("hex");

const clearResetOtp = (user) => {
  user.passwordResetOtpHash = undefined;
  user.passwordResetOtpExpiresAt = undefined;
  user.passwordResetOtpAttempts = 0;
  user.passwordResetOtpSentAt = undefined;
};

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

const forgotPassword = async (req, res) => {
  const result = forgotPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Enter a valid email address." });
  }

  const { email } = result.data;
  const user = await User.findOne({ email }).select(
    "+passwordResetOtpSentAt",
  );
  const genericResponse = {
    success: true,
    message:
      "If an account exists for this email, a verification code has been sent.",
  };

  if (!user) {
    return res.status(202).json(genericResponse);
  }

  const now = new Date();
  if (
    user.passwordResetOtpSentAt &&
    now.getTime() - user.passwordResetOtpSentAt.getTime() <
      resetOtpResendWaitMs
  ) {
    return res.status(202).json(genericResponse);
  }

  const otp = randomInt(100000, 1000000).toString();
  user.passwordResetOtpHash = hashResetOtp(otp);
  user.passwordResetOtpExpiresAt = new Date(
    now.getTime() + resetOtpLifetimeMs,
  );
  user.passwordResetOtpAttempts = 0;
  user.passwordResetOtpSentAt = now;
  await user.save();

  try {
    await sendPasswordResetOtp(user.email, user.name, otp);
  } catch (error) {
    clearResetOtp(user);
    await user.save();
    console.error(
      "Unable to deliver password reset code:",
      error instanceof Error ? error.message : "Unknown email service error",
    );
    return res.status(503).json({
      success: false,
      message: "We couldn’t send a verification code right now. Please try again.",
    });
  }

  return res.status(202).json(genericResponse);
};

const invalidResetOtpResponse = {
  success: false,
  message: "The verification code is invalid or expired. Request a new code.",
};

const getUserWithValidResetOtp = async (email, otp) => {
  const user = await User.findOne({ email }).select(
    "+passwordResetOtpHash +passwordResetOtpExpiresAt +passwordResetOtpAttempts",
  );
  const now = new Date();

  if (
    !user ||
    !user.passwordResetOtpHash ||
    !user.passwordResetOtpExpiresAt ||
    user.passwordResetOtpExpiresAt <= now
  ) {
    return null;
  }

  const attempts = user.passwordResetOtpAttempts ?? 0;
  if (attempts >= maxResetOtpAttempts) {
    clearResetOtp(user);
    await user.save();
    return null;
  }

  const submittedHash = Buffer.from(hashResetOtp(otp), "hex");
  const storedHash = Buffer.from(user.passwordResetOtpHash, "hex");
  const matches =
    submittedHash.length === storedHash.length &&
    timingSafeEqual(submittedHash, storedHash);

  if (!matches) {
    const update = {};
    if (attempts + 1 >= maxResetOtpAttempts) {
      update.$unset = {
        passwordResetOtpHash: "",
        passwordResetOtpExpiresAt: "",
        passwordResetOtpAttempts: "",
        passwordResetOtpSentAt: "",
      };
    } else {
      update.$inc = { passwordResetOtpAttempts: 1 };
    }

    const attemptFilter =
      attempts === 0
        ? {
            $or: [
              { passwordResetOtpAttempts: 0 },
              { passwordResetOtpAttempts: { $exists: false } },
            ],
          }
        : { passwordResetOtpAttempts: attempts };

    await User.updateOne(
      {
        _id: user._id,
        passwordResetOtpHash: user.passwordResetOtpHash,
        ...attemptFilter,
      },
      update,
    );
    return null;
  }

  return user;
};

const verifyPasswordResetOtp = async (req, res) => {
  const result = verifyResetPasswordOtpSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address and 6-digit code.",
    });
  }

  const { email, otp } = result.data;
  const user = await getUserWithValidResetOtp(email, otp);
  if (!user) {
    return res.status(400).json(invalidResetOtpResponse);
  }

  return res.status(200).json({
    success: true,
    message: "Verification code is valid.",
  });
};

const resetPassword = async (req, res) => {
  const result = resetPasswordSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid password reset details." });
  }

  const { email, otp, newPassword } = result.data;
  const user = await getUserWithValidResetOtp(email, otp);
  if (!user) {
    return res.status(400).json(invalidResetOtpResponse);
  }

  const now = new Date();
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const updateResult = await User.updateOne(
    {
      _id: user._id,
      passwordResetOtpHash: user.passwordResetOtpHash,
      passwordResetOtpExpiresAt: { $gt: now },
      passwordResetOtpAttempts: { $lt: maxResetOtpAttempts },
    },
    {
      $set: { password: hashedPassword },
      $unset: {
        passwordResetOtpHash: "",
        passwordResetOtpExpiresAt: "",
        passwordResetOtpAttempts: "",
        passwordResetOtpSentAt: "",
      },
    },
  );

  if (updateResult.matchedCount !== 1) {
    return res.status(400).json(invalidResetOtpResponse);
  }

  return res.status(200).json({
    success: true,
    message: "Password updated successfully.",
  });
};

const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export {
  signup,
  login,
  logout,
  forgotPassword,
  verifyPasswordResetOtp,
  resetPassword,
};
