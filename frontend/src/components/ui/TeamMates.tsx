import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";

interface TeamMember {
  _id: string;
  name?: string;
  profile?: string;
  role?: string | null;
}

const TeamMates = ({
  data,
  ownerId,
}: {
  data: TeamMember;
  ownerId?: string;
}) => {
  const navigate = useNavigate();
  const context = useContext(userContext);
  const currentUserId = context?.user?._id ?? context?.user?.id;
  const isCurrentUser = currentUserId === data._id;
  const initials =
    data.name
      ?.trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";
  const isOwner = ownerId === data._id;

  return (
    <button
      type="button"
      onClick={() => navigate(isCurrentUser ? "/profile" : `/user/${data._id}`)}
      aria-label={`View ${isCurrentUser ? "your" : data.name || "member"} profile`}
      className="flex w-full min-w-0 items-center gap-3 rounded-xl border border-[#EAE8E2] bg-[#FCFCFB] p-3 text-left transition-colors hover:border-[#DAD7CF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4BE0]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white bg-[#2F4BE0] text-sm font-bold uppercase text-white shadow-sm">
        {data.profile ? (
          <img
            src={data.profile}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          initials
        )}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#16151A]">
          {data.name || "Unknown"}{" "}
          <span className="font-normal text-[#5C5964]">
            ({isOwner ? "Owner" : data.role || "Team member"})
          </span>
        </p>
        <p className="mt-0.5 text-xs text-[#77747C]">
          {isOwner ? "Project owner" : "Accepted team member"}
        </p>
      </div>

      {isOwner && (
        <span className="shrink-0 rounded-full bg-[#EEF1FF] px-2.5 py-1 text-[10px] font-semibold text-[#2F4BE0]">
          Owner
        </span>
      )}
    </button>
  );
};

export default TeamMates;