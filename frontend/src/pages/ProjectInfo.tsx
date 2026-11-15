import { useNavigate } from "react-router-dom";
import RoleCard from "../components/user/RoleCard";
import Back from "../components/ui/Back";
import TeamMates from "../components/ui/TeamMates";

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

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-4">
      <Back/>
      <div className={`h-37.5 rounded-[14px]  ${bg[random]} relative`}></div>

      {/* Project information */}
      <div>
        <span className="text-[26px] font-bold tracking-[-0.02em]">
          Study Sync
        </span>
        <div className="text-[13px] text-[#5C5964] mt-1">
          By <span>Ananya Sharma</span> · Recruiting · <span>4 applicants</span>{" "}
          · <span>1 members</span>
        </div>
      </div>

      {/* description and  tech stack  */}
      <div>
        <span className="text-[15px] text-[#16151A]">
          Shared timetable and notes for hostel groups.
        </span>
        <div className="flex flex-wrap gap-4 text-[13px] mt-2">
          React Native · Node.js · MongoDB
        </div>
      </div>

      {/* Roles section  */}
      <div>
        <span className="text-[16px] font-bold ">Roles needed</span>
        <div className="flex flex-col gap-2 mt-2.5">
          <RoleCard  />
          <RoleCard />
          <RoleCard />
        </div>
      </div>

      {/* Team information */}
      {/* 40×40 circle, centered white initials, Inter 14px weight 700, never shrinks */}
      <div>
        <span className="text-[16px] font-bold text-[#16151A]">Team</span>
       <TeamMates/>
      </div>
    </div>
  );
};

export default ProjectInfo;
