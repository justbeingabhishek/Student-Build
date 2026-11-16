import { useNavigate, useParams } from "react-router-dom";
import RoleCard from "../components/user/RoleCard";
import Back from "../components/ui/Back";
import TeamMates from "../components/ui/TeamMates";
import { useEffect, useState } from "react";
import api from "../../Services/api";

const ProjectInfo = () => {
  const bg = [
    "bg-linear-[135deg] from-[#2F4BE0] to-[#8FA2FF]",
    "bg-linear-[135deg] from-[#0F766E] to-[#6EE7B7]",
    "bg-linear-[135deg] from-[#C2410C] to-[#FDBA74]",
    "bg-linear-[135deg] from-[#7C3AED] to-[#C4B5FD]",
    "bg-linear-[135deg] from-[#1D4ED8] to-[#F9A8D4]",
  ];


  const random = Math.floor(Math.random() * 5);
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const { id } = useParams();

  const fetchProjectInformation = async () => {
    try {
      const response = await api.get(`/projects/${id}`);
      setProject(response.data.project);
    } catch (error) {
      console.error("Error fetching project information:", error);
    }
  };

  useEffect(() => {
    fetchProjectInformation();
  }, [id]);

  const gradient = project?.coverImage;


  
 (project?.team) ? project.team = [{id : project?.owner?._id,name : project?.owner?.name}] : "";

  const from = gradient?.match(/from-\[(#[0-9A-Fa-f]{6})\]/)?.[1];
  const to = gradient?.match(/to-\[(#[0-9A-Fa-f]{6})\]/)?.[1];

  console.log("Project Information:", project);

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-4">
      <Back />
      <div
        style={{
          background:
            from && to
              ? `linear-gradient(135deg, ${from}, ${to})`
              : "linear-gradient(135deg, #047857, #A7F3D0)",
        }}
        className={`h-37.5 rounded-[14px]  ${bg[random]} relative`}
      ></div>

      {/* Project information */}
      <div>
        <span className="text-[26px] capitalize font-bold tracking-[-0.02em]">
          {project?.title || "Study Sync"}
        </span>
        <div className="text-[13px] text-[#5C5964] mt-1">
          By <span>{project?.owner?.name || "Unknown"}</span> · Recruiting ·{" "}
          <span>{project?.rolesNeeded?.length || 0} applicants</span> ·{" "}
          <span>{project?.teamSize || 0} members</span>
        </div>
      </div>

      {/* description and  tech stack  */}
      <div>
        <span className="text-[15px] text-[#16151A]">
          {project?.description ||
            "Shared timetable and notes for hostel groups."}
        </span>
        <div className="flex flex-wrap gap-4 capitalize text-[13px] mt-2">
          {project?.techStack?.join(" · ") ||
            "React Native · Node.js · MongoDB"}
        </div>
      </div>

      {/* Roles section  */}
      <div>
        <span className="text-[16px] font-bold ">Roles needed</span>
        <div className="flex flex-col gap-2 mt-2.5">

          {project?.rolesNeeded?.map((role: any, idx: number) => (
            <RoleCard key={idx} role={role} />
          ))}
        </div>
      </div>

      {/* Team information */}
      {/* 40×40 circle, centered white initials, Inter 14px weight 700, never shrinks */}
      <div>
        <span className="text-[16px] font-bold text-[#16151A]">Team</span>
        {
          project?.team.map((data: any,idx :number)=>{
            return <TeamMates key={idx} data = {data}/>
          })
        }
   
      </div>
    </div>
  );
};

export default ProjectInfo;
