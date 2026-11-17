import { useContext } from "react";
import Back from "../components/ui/Back";
import ApplyForm from "../components/user/ApplyForm";
import { userContext } from "../context/UserContext";

const Apply = () => {
  const {applicationInfo} : any= useContext(userContext);

  console.log("application : ",applicationInfo);

  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-3">
      <div>
        <Back />
      </div>
      <div>
        <h2 className="font-bold text-2xl text-[#16151A] ">
          {applicationInfo?.title}
        </h2>
        <span className="text-[13px] text-[#5C5964] mt-4">
          Role: <span className="font-bold">{applicationInfo?.role}</span>
        </span>
      </div>
      <div className="flex items-center flex-col gap-8">
        <ApplyForm />
      </div>
    </div>
  );
};

export default Apply;
