import { application } from "express";
import Application from "../models/Application.Model.js";
import Project from "../models/Project.Model.js";
import applicationStatusSchema from "../validations/applicationStatusvalidation.js";
import { email, success } from "zod";
import User from "../models/User.Model.js";
import { sendMail } from "../services/api.js";

const applyToProject = async (req, res) => {
  const userid = req.userid;

  console.log("req.body : ", req.body);

  const result = applicationStatusSchema.safeParse(req.body);
  console.log("result  : ", result);
  const { reason, link, email, owner, project, role } = result.data;

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid signup data",
      error: result.error.issues,
    });
  }

  if (userid === owner) {
    return res.status(401).json({
      success: false,
      message: "cannot apply for own project",
    });
  }

  console.log("project : ", project);
  try {
    //check if project exists or not
    const isProjectExists = await Project.findById(project);

    console.log("project", isProjectExists);

    if (!isProjectExists) {
      return res.status(401).json({
        success: false,
        message: "Project not exists",
      });
    }
    // check if application is already applied or not
    const application = await Application.findOne({
      user: userid,
      project: project,
    });

    if (application) {
      return res.status(409).json({
        message: "Already applied",
      });
    }

    const apllication = await Application.create({
      user: userid,
      project: project,
      reason: reason,
      role: role,
      owner: owner,
      email: email,
      portfolioLink: link,
      status: "pending",
    });

    isProjectExists.application += 1;
    isProjectExists.save();

    await User.findByIdAndUpdate(userid, {
      $push: { Myapplications: apllication._id },
    });

    res.status(201).json({
      success: true,
      message: "Applied to project successfully",
    });
  } catch (error) {
    console.log("error : ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMyApplications = async (req, res) => {
  const userid = req.userid;

  try {
    const application = await Application.find({ user: userid }).populate(
      "project",
    );

    if (application.length === 0) {
      return res.status(404).json({
        success: false,
        message: "You have not Submited any application for the project",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    return res.status(500).json({
      message: "server error",
    });
  }
};

const getProjectApplications = async (req, res) => {
  try {
    console.log("request reahces server : ");

    const userId = req.userid;
    const projectId = req.params.id;

    const query = req.query.sort;
    let sort = 1;

    if (query == "Latest") {
      sort = 1;
    } else {
      sort = -1;
    }

    const applications = await Application.find({
      project: projectId,
      owner: userId,
    })
      .populate("user", "name email skills")
      .sort({ createdAt: sort });

    return res.status(200).json({
      success: true,
      message: "Application fetched successfully",
      applications,
    });
  } catch (error) {
    console.log("error : ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userid = req.userid;

    console.log("request reaches the server : ");

    const status = req.body.status;

    if (!status) {
      return res.status(401).json({
        success: false,
        message: "status not define",
      });
    }

    const application = await Application.findById(applicationId)
      .populate("user", "name email")
      .populate("owner", "name email _id")
      .populate("project", "title description");

    if (!application) {
      return res.status(403).json({
        success: false,
        message: "Application with this id not exists",
      });
    }


    if (userid !== application.owner._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Anoutharized action",
      });
    }

    application.status = status.toLowerCase();
    application.save();

    await Project.findByIdAndUpdate(application.project, {
      $push: { team: application.user },
    });

    // (userName,projectName,role,ownerName),

    sendMail(application?.email,application?.user?.name,application?.project.title,application.role,application?.owner?.name);

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.log("error : ", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export {
  applyToProject,
  getMyApplications,
  getProjectApplications,
  updateApplicationStatus,
};
