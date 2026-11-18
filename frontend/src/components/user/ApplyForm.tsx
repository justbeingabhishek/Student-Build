import { useForm } from "react-hook-form";
import api from "../../../Services/api";
import { useContext, useState } from "react";
import { userContext } from "../../context/UserContext";
import { toast } from "sonner";


const ApplyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const {applicationInfo} : any = useContext(userContext);
  const [loading,setLoading] = useState(false);

  const sendApplication = async(data : any)=>{
    setLoading(true);
    try {
        console.log("data : ",data);
        data.role = applicationInfo.role;
        data.owner = applicationInfo.owner._id;
        data.project = applicationInfo._id;
        console.log("data : ",data);
        const response = await api.post('/application/project/apply',data);
        if(response?.data.success){
          toast.success("Application submited");
          reset();
        }
    } catch (error) {
      console.log("Error",(error as any).message);
      toast.error((error as any)?.response?.data?.message || "internal server error");
    }finally{
      setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit(sendApplication)} className="w-full flex flex-col gap-3">
      {/* why to join */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-semibold" htmlFor="reason">
          Why do you want to join?
        </label>
        <textarea
          {...register("reason", {
            required: "*required",
            minLength: {
              value: 10,
              message: "reason  must be of at least 10 characters",
            },
          })}
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          id="reason"
          rows={3}
        />
      </div>

      {errors.reason && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.reason.message)}
        </span>
      )}

      {/* portfolio link */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-semibold" htmlFor="link">
          Portfolio or GitHub link
        </label>
        <input
          {...register("link", {
            required: "*required",
          })}
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="text"
          id="link"
        />
      </div>

      {errors.link && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.link.message)}
        </span>
      )}

      {/* email */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-semibold" htmlFor="email">
          Email
        </label>
        <input
          {...register("email", {
            required: "*required",
          })}
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="email"
          id="email"
        />
      </div>

      {errors.email && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.email.message)}
        </span>
      )}


      <button type="submit" className="w-full text-center bg-[#2F4BE0] p-3 text-white rounded-[10px] min-h-11 mt-5">
        {loading ? "Submiting application" : "Submit application"}
      </button>
    </form>
  );
};

export default ApplyForm;
