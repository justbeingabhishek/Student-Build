import { useEffect, useState } from "react";
import api from "../../Services/api";
import ProjectCard from "../components/user/ProjectCard";

const MyProjects = () => {
  const [project,setProject] = useState([]);

  const fetchMyProject = async()=>{
    try {
      const resposne = await api.get('/users/me/projects');
      setProject(resposne.data.projects);
    } catch (error) {
      console.log("error : ",error);
    }
  }

  useEffect(()=>{
    fetchMyProject();
  },[])

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-bold text-2xl tracking-[-0.02em]">My Projects</h2>
      </div>
      <div className="flex items-center flex-col gap-3.5">
        {
          project.map((project : any,idx : number)=>{
            return <ProjectCard project={project} key={idx} />
          })
        }
      </div>
    </div>
  );
};

export default MyProjects;
