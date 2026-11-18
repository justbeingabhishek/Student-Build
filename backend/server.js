import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import body_parser from "body-parser";
import dns from "dns";
import TestRoutes from "./routes/TestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import connectDb from "./config/connectDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);


const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://student-build.vercel.app",
    ],
    credentials: true,
  }));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

await connectDb();

app.use("/api", TestRoutes);

app.use("/api/auth",authRoutes);

app.use("/api/projects",projectRoutes);

app.use("/api/users",usersRoutes);

app.use("/api/application",applicationRoutes);

app.use("/api/notifications", notificationRoutes);
