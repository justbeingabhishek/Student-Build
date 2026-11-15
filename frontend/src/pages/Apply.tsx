import Back from "../components/ui/Back";
import ApplyForm from "../components/user/ApplyForm";

const Apply = () => {
  return (
    <div className="h-full w-full flex py-3 flex-col  pb-20  gap-3">
      <div>
        <Back />
      </div>
      <div>
        <h2 className="font-bold text-2xl text-[#16151A] ">
          Apply to CampusCart
        </h2>
        <span className="text-[13px] text-[#5C5964] mt-4">
          Role: <span className="font-bold">Designer</span>
        </span>
      </div>
      <div className="flex items-center flex-col gap-8">
        <ApplyForm />
      </div>
    </div>
  );
};

export default Apply;
