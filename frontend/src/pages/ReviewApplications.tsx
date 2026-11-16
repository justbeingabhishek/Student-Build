import { useState } from "react";
import ReviewCard from "../components/ui/ReviewCard";

const ReviewApplications = () => {
  const filters = ["Latest", "Oldest"];
  const [counts, setCount] = useState(1);

  const [activeFilter, setActiveFilter] = useState("Latest");
  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-8">
      <div>
        <h2 className="font-semibold text-2xl">AlgoViz Pro applicants</h2>
      </div>

      <div>
        <div className="flex overflow-x-scroll bar text-nowrap items-center gap-3">
          {filters.map((filter) => {
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
              min-h-9 rounded-full border px-3.5
              text-[13px] font-medium cursor-pointer transition-colors
              ${
                activeFilter == filter
                  ? "border-[#16151A] bg-[#16151A] text-white"
                  : "border-[#DAD7CF] bg-white text-[#16151A] hover:bg-[#F7F6F2]"
              }
            `}
              >
                {filter} 
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center flex-col gap-8">
        <ReviewCard
          name="Neha Gupta"
          role="UI/UX Designer"
          initials="NG"
          avatarColor="#7C3AED"
          message="I love data viz and can design clean, accessible visualizer screens."
          portfolio="https://behance.net/nehag"
          hours="8 hrs/week"
          skills={["Figma", "Design systems"]}
          status="Pending"
          onAccept={() => console.log("Accepted")}
          onReject={() => console.log("Rejected")}
        />
      </div>
    </div>
  );
};

export default ReviewApplications;
