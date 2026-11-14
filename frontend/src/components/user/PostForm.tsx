import { useState } from "react";

const PostForm = () => {
  const category = ["Web", "AI/ML", "Desgin", "Mobile"];
  const [select, setSelect] = useState("Web");

  return (
    <form className="h-full w-full flex flex-col gap-4">
      <div className="flex flex-col ">
        <label
          className="text-[13px] font-semibold pt-3 pb-1.5"
          htmlFor="titel"
        >
          Project Titel
        </label>
        <input
          placeholder="Medi vault"
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="text"
          id="description"
        />
      </div>

      <div className="flex flex-col ">
        <label
          className="text-[13px] font-semibold pt-3 pb-1.5"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          placeholder="Description of project "
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          rows={3}
          id="description"
        />
      </div>

      <div className="flex flex-col ">
        <span className="text-[13px] font-semibold pt-3 pb-1.5">Category</span>
        <div
          className="bar flex gap-2 text-[#16151A]
                flex-wrap"
        >
          {category.map((item, idx) => {
            return (
              <span
                key={idx}
                onClick={() => setSelect(item)}
                className={`border text-[#16151A] border-[#DAD7CF]  px-3 py-1.5 flex items-center justify-center text-[13px] min-h-9 rounded-2xl ${select == item ? "border border-[#16151A] bg-[#16151A] text-[#FFFFFF] " : ""} `}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>

      {/* teck stack */}

      <div className="flex flex-col ">
        <label className="text-[13px] font-semibold pt-3 pb-1.5" htmlFor="tech">
          Tech Stack (comma seprated)
        </label>
        <input
          placeholder="React , Java"
          className="border border-[#CFCCC3] placeholder:text-gray-400 rounded-[10px] p-3 text-[14px] min-h-11"
          type="text"
          id="tech"
        />
      </div>

      <div className="flex flex-col ">
        <label
          className="text-[13px] font-semibold pt-3 pb-1.5"
          htmlFor="roles"
        >
          Roles needed (comma seprated)
        </label>
        <input
          placeholder="UX Desginer , Web developer"
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="text"
          id="roles"
        />
      </div>

      <button className="w-full text-center bg-[#2F4BE0] p-3 text-white rounded-[10px] min-h-11 mt-5">
        Publish Project
      </button>
    </form>
  );
};

export default PostForm;
