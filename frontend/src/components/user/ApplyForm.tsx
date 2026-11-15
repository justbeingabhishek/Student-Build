const ApplyForm = () => {
  return (
    <form className="w-full flex flex-col gap-3">
      {/* why to join */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-semibold" htmlFor="reason">
          Why do you want to join?
        </label>
        <textarea
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          id="reason"
          rows={3}
        />
      </div>

      {/* portfolio link */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-semibold" htmlFor="link">
          Portfolio or GitHub link
        </label>
        <input
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="text"
          id="link"
        />
      </div>

      {/* email */}
      <div className="flex flex-col gap-1">
        <label className="text-[13px] font-semibold" htmlFor="email">
          Email
        </label>
        <input
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="email"
          id="email"
        />
      </div>

      <span className="text-[13px] text-[#B42318]">Must not be empty</span>


         <button className="w-full text-center bg-[#2F4BE0] p-3 text-white rounded-[10px] min-h-11 mt-5">
        Submit application
      </button>
    </form>
  );
};

export default ApplyForm;
