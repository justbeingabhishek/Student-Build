import { application } from "express";
import Application from "../models/Application.Model.js";
import Project from "../models/Project.Model.js";
import applicationStatusSchema from "../validations/applicationStatusvalidation.js";

const applyToProject = async (req, res) => {
  const projectId = req.params.id;
  const userid = req.userid;

  try {
    const project = await Project.findById(projectId);
    if (project) {
      const application = await Application.findOne({
        user: userid,
        project: projectId,
      });
      if (application) {
        return res.status(409).json({
          message: "Already applied",
        });
      } else {
        const newApplication = await Application.create({
          user: userid,
          project: projectId,
        });
        res.status(201).json({
          message: "Applied to project successfully",
          newApplication,
        });
      }
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

const getMyApplications = async (req, res) => {
  const userid = req.userid;

  try {
    const application = await Application.find({ user: userid });

    if (application.length === 0) {
      return res.status(404).json({
        message: "Not found",
      });
    }
    return res.status(200).json({
      application,
    });
  } catch (error) {
    return res.status(500).json({
        message:"server error"
    })
  }
};

const getProjectApplications = async (req,res)=>{
    const userid = req.userid;
    const projectId = req.params.id;

    try{
        const project = await Project.findById(projectId)
        if(!project){
            return res.status(404).json({
                message:"no project application"
            })
        }
        else{
            const owner =  project.owner;
            if(!owner.equals(userid)){
                 return res.status(403).json({
                message: "Access denied. You are not the owner"
            })
            }
        }
         const application = await Application.find({project:projectId})
        if(application.length===0){
             return res.status(404).json({
        message: "Not found",
        });
        }
        return res.status(200).json({
            application
        })
    }
    catch(error){
        return res.status(500).json({
        message:"server error"
    })
    }
};

const updateApplicationStatus = async (req,res)=>{
   const applicationId  = req.params.id;
   const userid = req.userid;

   
    const result = applicationStatusSchema.safeParse(req.body);
    if(!result.success){
       return res.status(400).json({
            message:"Invalid data"
        })
    }

    try{
      const application = await Application.findById(applicationId);
       if(!application){
            return res.status(404).json({
                message:"no  application exists"
            })
        }

        else{
          const project = await Project.findById(application.project)
          if(!project){
            return res.status(404).json({
              message:"project does not exists"
            })
          }
          
          const ownerId = project.owner
          if(!ownerId.equals(userid)){
            return res.status(403).json({
              message :"You are not the owner"
            })
          }
        }

        const applicationStatus = await Application.findByIdAndUpdate(applicationId,
          {$set:result.data},
          {new:true,runValidators:true
          })

          return res.status(200).json({
            message:"Application status updated",
            applicationStatus
          })
    }
  catch(error){
    console.log(error);
    return res.status(500).json({
        message: error.message
    });
}
}
export { applyToProject, getMyApplications, getProjectApplications, updateApplicationStatus};
