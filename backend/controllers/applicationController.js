import { application } from "express";
import Application from "../models/Application.Model.js";
import Project from "../models/Project.Model.js";
import applicationStatusSchema from "../validations/applicationStatusvalidation.js";
import { email, success } from "zod";
import User from "../models/User.Model.js";
import { sendMail } from "../services/api.js";
import Notification from "../models/Notification.Model.js";

const applyToProject = async (req, res) => {
  const userid = req.userid;
  const result = applicationStatusSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid signup data",
      error: result.error.issues,
    });
  }

  const { reason, link, email, project, role } = result.data;
  try {
    //check if project exists or not
    const isProjectExists = await Project.findById(project);

    if (!isProjectExists) {
      return res.status(401).json({
        success: false,
        message: "Project not exists",
      });
    }

    if (userid === isProjectExists.owner.toString()) {
      return res.status(401).json({
        success: false,
        message: "cannot apply for own project",
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
      owner: isProjectExists.owner,
      email: email,
      portfolioLink: link,
      status: "pending",
    });

    isProjectExists.application += 1;
    await isProjectExists.save();

    await User.findByIdAndUpdate(userid, {
      $push: { Myapplications: apllication._id },
    });

    await Notification.create({
      recipient: isProjectExists.owner,
      actor: userid,
      project: isProjectExists._id,
      application: apllication._id,
      type: "application_received",
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

    const status =
      typeof req.body.status === "string" ? req.body.status.toLowerCase() : "";

    if (status !== "accepted" && status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
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

    application.status = status;
    await application.save();

    if (status === "accepted") {
      const updatedProject = await Project.findByIdAndUpdate(
        application.project._id,
        {
          $addToSet: { team: application.user._id },
          $pull: { rolesNeeded: application.role },
        },
      );

      if (!updatedProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }

      await Notification.create({
        recipient: application.user._id,
        actor: application.owner._id,
        project: application.project._id,
        application: application._id,
        type: "application_accepted",
      });

      sendMail(
        application?.email,
        application?.user?.name,
        application?.project.title,
        application.role,
        application?.owner?.name,
      );
    }

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
