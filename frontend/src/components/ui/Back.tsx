import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(-1)}>
      <span className="bg-white border select-none border-[#DAD7CF] text-[#16151A] px-3.5 flex justify-center items-center text-[13px] min-h-9 font-medium cursor-pointer w-fit rounded-[999px]">
        Back
      </span>
    </div>
  );
};

export default Back;
