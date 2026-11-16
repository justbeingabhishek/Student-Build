import {
  projectSchema,
  updateProject,
} from "../validations/projectValidation.js";
import Project from "../models/Project.Model.js";
import User from "../models/User.Model.js";
import { success } from "zod";
const bg = [
  "bg-linear-[135deg] from-[#2F4BE0] to-[#8FA2FF]",
  "bg-linear-[135deg] from-[#0F766E] to-[#6EE7B7]",
  "bg-linear-[135deg] from-[#C2410C] to-[#FDBA74]",
  "bg-linear-[135deg] from-[#7C3AED] to-[#C4B5FD]",
  "bg-linear-[135deg] from-[#1D4ED8] to-[#F9A8D4]",
  "bg-linear-[135deg] from-[#1E3A8A] to-[#60A5FA]",
  "bg-linear-[135deg] from-[#134E4A] to-[#5EEAD4]",
  "bg-linear-[135deg] from-[#581C87] to-[#D8B4FE]",
  "bg-linear-[135deg] from-[#9A3412] to-[#FDBA74]",
  "bg-linear-[135deg] from-[#164E63] to-[#67E8F9]",
  "bg-linear-[135deg] from-[#312E81] to-[#A5B4FC]",
  "bg-linear-[135deg] from-[#14532D] to-[#86EFAC]",
  "bg-linear-[135deg] from-[#9F1239] to-[#FDA4AF]",
  "bg-linear-[135deg] from-[#713F12] to-[#FDE68A]",
  "bg-linear-[135deg] from-[#3730A3] to-[#818CF8]",
  "bg-linear-[135deg] from-[#065F46] to-[#6EE7B7]",
  "bg-linear-[135deg] from-[#86198F] to-[#F0ABFC]",
  "bg-linear-[135deg] from-[#9D174D] to-[#FBCFE8]",
  "bg-linear-[135deg] from-[#1E40AF] to-[#93C5FD]",
  "bg-linear-[135deg] from-[#3F6212] to-[#BEF264]",
  "bg-linear-[135deg] from-[#7F1D1D] to-[#FCA5A5]",
  "bg-linear-[135deg] from-[#4338CA] to-[#C7D2FE]",
  "bg-linear-[135deg] from-[#0E7490] to-[#A5F3FC]",
  "bg-linear-[135deg] from-[#6B21A8] to-[#E9D5FF]",
  "bg-linear-[135deg] from-[#B45309] to-[#FDE68A]",
  "bg-linear-[135deg] from-[#166534] to-[#BBF7D0]",
  "bg-linear-[135deg] from-[#BE123C] to-[#FECDD3]",
  "bg-linear-[135deg] from-[#1E3A8A] to-[#A5B4FC]",
  "bg-linear-[135deg] from-[#115E59] to-[#99F6E4]",
  "bg-linear-[135deg] from-[#6D28D9] to-[#DDD6FE]",
  "bg-linear-[135deg] from-[#C2410C] to-[#FED7AA]",
  "bg-linear-[135deg] from-[#0C4A6E] to-[#7DD3FC]",
  "bg-linear-[135deg] from-[#4C1D95] to-[#C4B5FD]",
  "bg-linear-[135deg] from-[#365314] to-[#D9F99D]",
  "bg-linear-[135deg] from-[#881337] to-[#FDA4AF]",
  "bg-linear-[135deg] from-[#1F2937] to-[#9CA3AF]",
  "bg-linear-[135deg] from-[#334155] to-[#CBD5E1]",
  "bg-linear-[135deg] from-[#312E81] to-[#C4B5FD]",
  "bg-linear-[135deg] from-[#047857] to-[#A7F3D0]",
  "bg-linear-[135deg] from-[#A21CAF] to-[#F5D0FE]",
  "bg-linear-[135deg] from-[#9F1239] to-[#FDA4AF]",
  "bg-linear-[135deg] from-[#1D4ED8] to-[#BFDBFE]",
  "bg-linear-[135deg] from-[#155E75] to-[#A5F3FC]",
  "bg-linear-[135deg] from-[#78350F] to-[#FCD34D]",
  "bg-linear-[135deg] from-[#4D7C0F] to-[#D9F99D]",
  "bg-linear-[135deg] from-[#5B21B6] to-[#E9D5FF]",
  "bg-linear-[135deg] from-[#9D174D] to-[#F9A8D4]",
  "bg-linear-[135deg] from-[#0F172A] to-[#64748B]",
  "bg-linear-[135deg] from-[#1E40AF] to-[#67E8F9]",
  "bg-linear-[135deg] from-[#7C2D12] to-[#FDBA74]",
];

const projects = async (req, res) => {
  const result = projectSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.format(),
    });
  }

  const { title, description, tech, roles, teamSize, category } = result.data;

  try {
    const project = await Project.create({
      owner: req.userid,
      title,
      description,
      techStack: tech.split(",").map((s) => s.trim()),
      rolesNeeded: roles.split(",").map((s) => s.trim()),
      teamSize,
      coverImage: bg[Math.floor(Math.random() * bg.length)],
      category,
      team: [req.userid],
    });

    await User.findByIdAndUpdate(
      req.userid,
      { $push: { MyProjects: project._id } },
      { new: true },
    );

    return res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: " Could not create project in database",
      error: error.message,
    });
  }
};

// getting  all projects route
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("owner");
    return res.status(200).json({
      message: "Projects fetched successfully",
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: " Could not fetch projects from database",
      error: error.message,
    });
  }
};

// getting project by id route
const getProjectById = async (req, res) => {
  const projectId = req.params.id;
  const userid = req.userid;

  try {
    const project = await Project.findById(projectId).populate("owner");
    if (project) {
      return res.status(200).json({
        message: "Project found",
        project,
      });
    } else {
      return res.status(404).json({
        message: "Project  not found,",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: " Could not fetch projects,",
    });
  }
};

//update existing project
const updateOneProject = async (req, res) => {
  const projectId = req.params.id;
  const userid = req.userid;

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const ownerId = project.owner;

    if (!ownerId.equals(userid)) {
      return res.status(403).json({
        message: "Access denied. You are not the owner",
      });
    }
    const result = updateProject.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data entered",
      });
    }

    const { title, description, tech, roles, teamSize } = result.data;
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $set: result.data },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "Project updated successfully",
      updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch the data",
    });
  }
};

//delete any project
const deleteProject = async (req, res) => {
  const projectId = req.params.id;
  const user = req.userid;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        message: "Project does not exists",
      });
    } else {
      const ownerId = project.owner;
      if (!ownerId.equals(req.userid)) {
        return res.status(403).json({
          message: "You do not have the permission to delete this",
        });
      } else {
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
          return res.status(404).json({ message: "Item not found" });
        }

        return res
          .status(200)
          .json({ message: "Deleted", deleted: deletedProject });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Could not delete the project",
    });
  }
};


const searchProject = async (req, res) => {
  try {
    const query = req.query.search?.trim();

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }


    const project = await Project.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { techStack: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { rolesNeeded: { $regex: query, $options: "i" } },
      ],
    }).limit(10);

    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No projects found",
        project: [],
      });
    }

    return res.status(200).json({
      success: true,
      count: project.length,
      project,
    });

  } catch (err) {
    console.log("Search controller error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  projects,
  getProjects,
  getProjectById,
  updateOneProject,
  deleteProject,
  searchProject,
};
