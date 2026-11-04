import { projectSchema,updateProject } from "../validations/projectValidation.js"
import Project from "../models/Project.Model.js";


//creating projects route
const projects = async (req,res)=>{

    const result = projectSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            message:"Invalid data"
        })
    }

   const {title,description,techStack,requiredSkills,teamSize,deadline} = result.data

try{
    const project = await Project.create({
    owner:req.userid,
    title,
    description,
    techStack,
    requiredSkills,
    teamSize,
    deadline,
})
return res.status(201).json({
    message:"Project created successfully",
    project
})
}
catch(error){
    res.status(500).json({
        message: " Could not create project in database"
    })
}

}

// getting  all projects route
const getProjects = async (req,res)=>{
    try{
        const projects = await Project.find()
        return res.status(200).json({
            message:"Projects fetched successfully",
            projects
        })
    }
    catch(error){
        res.status(500).json({
            message: " Could not fetch projects from database"
        })
    }
    

}

// getting project by id route
const getProjectById = async (req,res)=>{
 const projectId = req.params.id;
 const userid = req.userid
    
    try{
        const project = await Project.findById(projectId)
         if(project){
            return res.status(200).json({
                message: "Project found",
                project,
            });
         }
         else{
            return res.status(404).json({
            message:"Project  not found,",
        });
         }
        }
    catch(error){
        return res.status(500).json({
            message:" Could not fetch projects,",
        });
        }
    }   
   
//update existing project
const updateOneProject = async (req,res)=>{
    const projectId = req.params.id;
    const userid = req.userid;
    
    try{
        const project = await Project.findById(projectId);

        if(!project){
            return res.status(404).json({
                message:"Project not found"
            });
        }
        
        const ownerId = project.owner;

         if(!ownerId.equals(userid)){
            return res.status(403).json({
                message: "Access denied. You are not the owner"
            });
        }
        const result = updateProject.safeParse(req.body);

        if(!result.success){
           return res.status(400).json({
                message:"Invalid data entered"
            });
        }

            const {title,description,techStack,requiredSkills,teamSize,deadline} = result.data
            const updatedProject = await Project.findByIdAndUpdate(projectId,
                {$set:result.data},
                {new:true,
                runValidators:true
            });
        
        return res.status(200).json({
            message:"Project updated successfully",
            updatedProject
        })
        
    }
    catch(error){
        res.status(500).json({
            message:"Could not fetch the data"
        })
    }

};

//delete any project
const deleteProject = async (req,res)=>{
const projectId = req.params.id;
 const user = req.userid

try{
const project = await Project.findById(projectId);
if(!project){
    return res.status(404).json({
        message:"Project does not exists"
    })
}
else{
    const ownerId = project.owner
    if(!ownerId.equals(req.userid)){
       return res.status(403).json({
            message:"You do not have the permission to delete this"
        })
    }
    else{
      const deletedProject =  await Project.findByIdAndDelete(projectId)
      if (!deletedProject) {
      return res.status(404).json({ message: 'Item not found' });
    }

   return res.status(200).json({ message: 'Deleted', deleted: deletedProject });
    }
 }
}

catch(error){
    
        res.status(500).json({
            message:"Could not delete the project"
        })
    
}
}
 





export  { projects,getProjects, getProjectById, updateOneProject, deleteProject }