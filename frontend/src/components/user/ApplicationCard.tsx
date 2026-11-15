import { useNavigate } from "react-router-dom";

type Status = "Pending" | "Accepted" | "Rejected";

interface ApplicationCardProps {
  type?: Status;
}

const tagColor = {
  Pending: "text-yellow-600 bg-yellow-100",
  Accepted: "text-green-600 bg-green-100",
  Rejected: "text-red-600 bg-red-100",
};

const ApplicationCard = ({ type = "Pending" }: ApplicationCardProps) => {
    const navigate = useNavigate();
  return (
    <div className="bg-white border border-[#E4E1D9] w-full flex flex-col  rounded-[14px] p-3.5 ">
      {/* project name */}
      <div className="w-full flex justify-between flex-wrap">
        <span className="font-bold text-[16px] text-[#16151A]">
          Alog Visualizer
        </span>
        <span
          className={`text-[12px] font-semibold rounded-md px-0.75 flex items-center ${tagColor[type]} `}
        >
          Accepted
        </span>
      </div>

      <div>
        <span className="text-[13px] text-[#5C5964] mt-1">
          <span>Backend devloper</span> · <span>Oct 28</span>
        </span>
      </div>

      <div>
        <button
        onClick={()=> navigate("/projct-info")}
         className="text-[#16151A] border border-[#DAD7CF] font-medium px-2 rounded-[10px] min-h-11 mt-2.5 ">
          View project
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
