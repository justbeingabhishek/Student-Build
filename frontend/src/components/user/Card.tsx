const Card = () => {
  const bg = [
    "bg-linear-[135deg] from-[#2F4BE0] to-[#8FA2FF]",
    "bg-linear-[135deg] from-[#0F766E] to-[#6EE7B7]",
    "bg-linear-[135deg] from-[#C2410C] to-[#FDBA74]",
    "bg-linear-[135deg] from-[#7C3AED] to-[#C4B5FD]",
    "bg-linear-[135deg] from-[#1D4ED8] to-[#F9A8D4]",
  ];
  const random = Math.floor(Math.random() * 5);
  return (
    <div className="min-h-70 w-full bg-[#FFFFFF] border-[#E4E1D9] border rounded-[14px] shrink-0 overflow-hidden">
      <div className={`h-35 ${bg[random]} relative`}>
        <span className="absolute bottom-2 left-2 text-[44px] text-white/55 font-mono  font-extrabold">
          AP
        </span>
      </div>
      <div className="px-2 flex-col flex gap-1 py-4">
        
        {/* information */}
        <div className="w-full flex  text-[13px]  justify-between text-[#5C5964] ">
          <span>Piyush Negi</span>
          <span>3 applications</span>
        </div>

        {/* titel */}
        <div>
          <span className="text-[18px] font-bold tracking-[-0.02em] ">
            Alog Visualizer
          </span>
        </div>

        {/* description */}
        <div className="text-[#5C5964] text-[16px]">
          <span>Easy to visualise alogirthims easy learning.</span>
        </div>

        {/* tech stack */}
        <div className="flex text-[#3D3A44] capitalize text-[12px] font-[500px] gap-2 text-sm ">
          <span>react</span>
          <span>mongoDB</span>
          <span>Java script</span>
        </div>

        {/* needs  */}
        <div className="text-[13px] text-[#5C5964] font-[500px]  flex gap-2">
          <span>Needs: </span>
          <div className="">
            <span>Qa tester</span>,<span>Ux desginer</span>
          </div>
        </div>

        <div className="font-medium flex gap-2 pt-2 w-full">
          <button className="bg-[#2F4BE0] text-white w-[70%] border-[#DAD7CF] rounded-[10px] p-2">
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
