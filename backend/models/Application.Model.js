import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },

  reason: {
    type: String,
    required: true,
  },

  portfolioLink: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
