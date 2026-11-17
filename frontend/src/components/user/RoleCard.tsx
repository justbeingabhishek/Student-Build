import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../../context/UserContext";

const RoleCard = ({ role }: { role: string }) => {
  const navigate = useNavigate();
  const { applicationInfo, setApplicationInfo }: any = useContext(userContext);

  return (
    <div className="bg-white border border-[#E4E1D9] flex items-center rounded-[14px] py-3 px-4">
      <div className="w-full flex justify-between items-center">
        <span className="text-[14px] font-bold capitalize">{role}</span>
        <button
          onClick={() => {
            setApplicationInfo({ ...applicationInfo, role: role });
            navigate("/apply");
          }}
          className="bg-[#2F4BE0] text-white px-4 text-[14px] min-h-11 rounded-[10px] "
        >
          Apply
        </button>
        {/* <button className="bg-white text-[#16151A] border border-[#DAD7CF] px-4 text-[14px] min-h-11 ">Applied</button>
            <button className="bg-white text-[#16151A] border border-[#DAD7CF] px-4 text-[14px] min-h-11 ">Your Project</button> */}
      </div>
    </div>
  );
};

export default RoleCard;
