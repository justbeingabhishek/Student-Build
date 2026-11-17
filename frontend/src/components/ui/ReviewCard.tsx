import { Link2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../Services/api";
import { toast } from "sonner";

type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

interface ReviewCardProps {
  name: string;
  role: string;
  initials: string;
  avatarColor?: string;
  message: string;
  portfolio: string;
  skills: string[];
  status: string;
  id: string;
  fetchApplcation : any
}

const ReviewCard = ({
  name,
  role,
  initials,
  avatarColor = "#7C3AED",
  message,
  portfolio,
  skills,
  status,
  id,
  fetchApplcation
}: ReviewCardProps) => {
  console.log("postfolio : ", portfolio);


  async function updateStatus(data : string){
    console.log("data  : ",data);
    try {
      const response = await api.put(`/application/status/${id}`,{status : data});
      toast.success(response.data.message);
      fetchApplcation();
    } catch (error) {
      console.log("error ");
      toast.error((error as any).response.data.message);
    }
  }





  return (
    <div className="w-full rounded-[14px] border border-[#E4E1D9] bg-white p-3.5">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[14px] font-bold text-white"
          style={{ backgroundColor: avatarColor }}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <h3 className="text-[16px] font-bold text-[#16151A]">{name}</h3>
          <p className="text-[13px] text-[#5C5964]">{role}</p>
        </div>
      </div>

      {/* Message */}
      <div className="mt-3 rounded-[10px] bg-[#F7F6F2] p-3">
        <p className="text-[13px] font-semibold text-[#3D3A44]">
          Why they want to join
        </p>

        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-[14px] leading-normal text-[#16151A]">
          {message}
        </p>
      </div>

      {portfolio && (
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <a
            href={portfolio}
            target="_blank"
            rel="noopener noreferrer"
            title={portfolio}
            className="inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-full border border-[#DAD7CF] bg-white px-3 text-[13px] font-semibold text-[#2F4BE0] no-underline"
          >
            <Link2 size={14} strokeWidth={2} className="shrink-0" />

            <span className="truncate">
              {portfolio.replace(/^https?:\/\//, "")}
            </span>
          </a>
        </div>
      )}

      {/* Skills */}
      <p className="mt-2.5 text-[13px] text-[#5C5964]">
        Skills: {skills.join(", ")}
      </p>

      {/* Actions - Pending only */}
      {status === "pending" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => {
              updateStatus("accepted");
            }}
            className="min-h-11 flex-1 rounded-[10px] bg-[#2F4BE0] px-4 text-[14px] font-semibold text-white transition-colors hover:bg-[#243BC0]"
          >
            Accept
          </button>

          <button
          onClick={() => {
             updateStatus("rejected");
          }}
           className="min-h-11 flex-1 rounded-[10px] border border-[#F0C4BF] bg-white px-4 text-[14px] font-semibold text-[#B42318] transition-colors hover:bg-[#FFF5F4]">
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
