import { useNavigate } from "react-router-dom";


const tagColor = {
  pending: "text-yellow-600 bg-yellow-100",
  accepted: "text-green-600 bg-green-100",
  rejected: "text-red-600 bg-red-100",
};

const ApplicationCard = ({application} : any) => {
    const navigate = useNavigate();
    type Status = keyof typeof tagColor;

    const status: Status = application.status;

  return (
    <div className="bg-white border border-[#E4E1D9] w-full flex flex-col  rounded-[14px] p-3.5 ">
      {/* project name */}
      <div className="w-full flex justify-between flex-wrap">
        <span className="font-bold capitalize text-[16px] text-[#16151A]">
          {application?.project?.title || "Unknown"}
        </span>
        <span
          className={`text-[12px] font-semibold rounded-md px-0.75 flex items-center ${tagColor[status] }`}
        >
          {application?.status}
        </span>
      </div>

      <div>
        <span className="text-[13px] text-[#5C5964] mt-1">
          <span>{application?.role || "unknown"}</span> · <span>Oct 28</span>
        </span>
      </div>

      <div>
        <button
        onClick={()=> navigate(`/project-info/${application?.project?._id}`)}
         className="text-[#16151A] border border-[#DAD7CF] font-medium px-2 rounded-[10px] min-h-11 mt-2.5 ">
          View project
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
