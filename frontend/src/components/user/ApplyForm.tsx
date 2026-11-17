import { useForm } from "react-hook-form";

const ApplyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  const sendApplication = async(data : any)=>{
    try {
        console.log("data : ",data);
    } catch (error) {
      console.log("Error",(error as any).message);
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

      <span className="text-[13px] text-[#B42318]">Must not be empty</span>

      <button type="submit" className="w-full text-center bg-[#2F4BE0] p-3 text-white rounded-[10px] min-h-11 mt-5">
        Submit application
      </button>
    </form>
  );
};

export default ApplyForm;
