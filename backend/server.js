import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import body_parser from "body-parser";

import TestRoutes from "./routes/TestRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import usersRoutes from "./routes/usersRoutes.js"
import applicationRoutes from "./routes/applicationRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })

  .catch((error) => {
    console.log("Database connection failed:", error);
  });

console.log(TestRoutes);

app.use("/api", TestRoutes);
console.log(authRoutes);
app.use("/api/auth",authRoutes);



app.use("/api/projects",projectRoutes);

app.use("/api/users",usersRoutes);

app.use("/api/application",applicationRoutes);