import { useNavigate } from "react-router-dom"

const ProjectCard = () => {
    const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#E4E1D9] w-full flex flex-col  rounded-[14px] p-3.5 ">
        {/* project name */}
        <div className="w-full flex justify-between">
            <span className="font-bold text-[16px] text-[#16151A]">Alog Visualizer</span>
            <span className="text-[12px] font-semibold rounded-md px-0.75 flex items-center bg-[#ECEAE3] text-[#3D3A44]  ">Recruiting</span>
        </div>

        <div>
            <span className="text-[13px] text-[#5C5964] mt-1">N pending · N team members</span>
        </div>

        <div>
            <button className="bg-[#2F4BE0] font-semibold px-2 text-white rounded-[10px] min-h-11 mt-2.5 " onClick={()=> navigate("/review-applications")} >View applications</button>
        </div>
    </div>
  )
}

export default ProjectCard