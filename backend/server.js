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
import connectDb from "./config/connectDb.js";

dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
app.use(express.json());

await connectDb();

app.use("/api", TestRoutes);


app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/application", applicationRoutes);
