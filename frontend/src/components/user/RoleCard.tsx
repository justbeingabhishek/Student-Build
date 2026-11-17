
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";

interface RoleCardProps {
  role: string;
  appliedFor: string | null;
  applicationStatus: string | null;
  applied: boolean;
  ownProject: boolean;
}

const RoleCard = ({
  role,
  appliedFor,
  applicationStatus,
  applied,
  ownProject,
}: RoleCardProps) => {
  const navigate = useNavigate();

  const { applicationInfo, setApplicationInfo }: any =
    useContext(userContext);

  const isAppliedForThisRole = applied && appliedFor === role;

  const handleApply = () => {
    setApplicationInfo({
      ...applicationInfo,
      role,
    });

    navigate(
      `/apply/${applicationInfo._id}/?role=${encodeURIComponent(role)}`
    );
  };

  return (
    <div className="bg-white border border-[#E4E1D9] flex items-center rounded-[14px] py-3 px-4">
      <div className="w-full flex justify-between items-center">
        <span className="text-[14px] font-bold capitalize">
          {role}
        </span>

        {ownProject ? (
          <button
            disabled
            className="bg-white text-[#16151A] border rounded-[10px] border-[#DAD7CF] px-4 text-[14px] min-h-11"
          >
            Your Project
          </button>
        ) : isAppliedForThisRole ? (
          <button
            disabled
            className={`px-4 text-[14px] min-h-11 rounded-[10px] border ${
              applicationStatus === "accepted"
                ? "bg-green-50 text-green-700 border-green-200"
                : applicationStatus === "rejected"
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-white text-[#16151A] border-[#DAD7CF]"
            }`}
          >
            {applicationStatus === "accepted"
              ? "Accepted"
              : applicationStatus === "rejected"
              ? "Rejected"
              : "Applied"}
          </button>
        ) : (
          <button
            onClick={handleApply}
            className="bg-[#2F4BE0] text-white px-4 text-[14px] min-h-11 rounded-[10px] hover:bg-[#243CC0] transition-colors"
          >
            Apply
          </button>
        )}
      </div>
    </div>
  );
};

export default RoleCard;
