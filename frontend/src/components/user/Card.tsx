import { useNavigate } from "react-router-dom";

const Card = ({ project }: any) => {
  const bg = [
    "bg-linear-[135deg] from-[#2F4BE0] to-[#8FA2FF]",
    "bg-linear-[135deg] from-[#0F766E] to-[#6EE7B7]",
    "bg-linear-[135deg] from-[#C2410C] to-[#FDBA74]",
    "bg-linear-[135deg] from-[#7C3AED] to-[#C4B5FD]",
    "bg-linear-[135deg] from-[#1D4ED8] to-[#F9A8D4]",
  ];
  const random = Math.floor(Math.random() * 5);
  const navigate = useNavigate();

  const gradient = project?.coverImage;

  const from = gradient?.match(/from-\[(#[0-9A-Fa-f]{6})\]/)?.[1];
  const to = gradient?.match(/to-\[(#[0-9A-Fa-f]{6})\]/)?.[1];

  console.log("bg : ", project?.coverImage);

  return (
    <div className="min-h-70 w-full bg-[#FFFFFF] border-[#E4E1D9] border rounded-[14px] shrink-0 overflow-hidden">
      <div
        style={{
          background:
            from && to
              ? `linear-gradient(135deg, ${from}, ${to})`
              : "linear-gradient(135deg, #047857, #A7F3D0)",
        }}
        className={`h-35  relative`}
      >
        <span className="absolute bottom-2 left-2 text-[44px] text-white/55 font-mono  font-extrabold">
          {project?.title?.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="px-2 flex-col flex gap-1 py-4">
        {/* information */}
        <div className="w-full flex capitalize  text-[13px]  justify-between text-[#5C5964] ">
          <span>{project?.owner?.name || "raka"}</span>
          <span>{project?.application || 0} applications</span>
        </div>

        {/* titel */}
        <div>
          <span className="text-[18px] capitalize font-bold tracking-[-0.02em] ">
            {project?.title || "Project title"}
          </span>
        </div>

        {/* description */}
        <div className="text-[#5C5964] text-[16px]">
          <span>
            {project?.description?.substring(0, 100) ||
              "Easy to visualise algorithms easy learning"}
            .
          </span>
        </div>

        {/* tech stack */}
        <div className="flex text-[#3D3A44] capitalize text-[12px] font-[500px] gap-1 text-sm ">
          {project?.techStack?.map((item: string, idx: number) => {
            return (
              <span key={idx}>
                {item} {project?.techStack?.length - 1 === idx ? "" : "."}
              </span>
            );
          })}
        </div>

        {/* needs  */}
        <div className="text-[13px] text-[#5C5964] font-[500px]  flex gap-2">
          <span>Needs: </span>
          <div className="capitalize">
            {project?.rolesNeeded?.map((item: string, idx: number) => {
              return (
                <span key={idx}>
                  {item} {project?.rolesNeeded?.length - 1 === idx ? "" : ", "}
                </span>
              );
            })}
          </div>
        </div>

        <div className="font-medium flex gap-2 pt-2 w-full">
          <button

            onClick={() => navigate(`/project-info/${project?._id}`)}
            className="bg-[#2F4BE0] text-white w-[70%] border-[#DAD7CF] rounded-[10px] p-2"
          >
            View
          </button>
          <button className="bg-white text-[#16151A] border border-[#DAD7CF]  rounded-[10px] w-[30%] p-2">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
