import { useState } from "react";
import { useForm } from "react-hook-form";
import api from "../../../Services/api";
import { toast } from "sonner";

const PostForm = () => {
  const category = ["Web", "AI/ML", "Desgin", "Mobile"];
  const [select, setSelect] = useState("Web");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const createPost = async (data: any) => {
    setLoading(true);
    data.category = select;
    console.log("Form Data:", data);
    try{
      const response = await api.post(`/projects`, data,{withCredentials:true});
      console.log("Post created successfully:", response.data);
      setError(null);
      reset();
      toast.success("Project created successfully!");
    }catch(error){
      console.log("Error creating post:", error);
      setError((error as any).response?.data?.message || "Error creating post. Please try again.");
    }finally{
      setLoading(false);
    }
  }



  return (
    <form onSubmit={handleSubmit(createPost)} className="h-full w-full flex flex-col gap-4">
      {/* titel  */}
      <div className="flex flex-col ">
        <label
          className="text-[13px] font-semibold pt-3 pb-1.5"
          htmlFor="titel"
        >
          Project Titel
        </label>
        <input
          {...register("title", {
            required: "Project title is required",
            minLength: {
              value: 2,
              message: "Project title must be at least 2 characters",
            },
          })}
          placeholder="Medi vault"
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="text"
          id="title"
        />
      </div>
      {errors.title && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.title.message) || "Project title is required"}
        </span>
      )}

      {/* description */}
      <div className="flex flex-col ">
        <label
          className="text-[13px] font-semibold pt-3 pb-1.5"
          htmlFor="description"
        >
          Description
        </label>
        <textarea
          {...register("description", {
            required: "Project description is required",
            minLength: {
              value: 10,
              message: "Project description must be at least 10 characters",
            },
          })}
          placeholder="Description of project "
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          rows={3}
          id="description"
        />
      </div>

      {errors.description && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.description.message) || "Project description is required"}
        </span>
      )}

      {/* category */}
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
        {...register("tech", {
          required: "Tech stack is required",
          minLength: {
            value: 5,
            message: "Tech stack must be at least 5 characters"
          }
        })}
        placeholder="React , Java"
        className="border border-[#CFCCC3] placeholder:text-gray-400 rounded-[10px] p-3 text-[14px] min-h-11"
        type="text"
        id="tech"
      />
      </div>
      {errors.tech && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.tech.message) || "Tech stack is required"}
        </span>
      )}

      <div className="flex flex-col ">
        <label
          className="text-[13px] font-semibold pt-3 pb-1.5"
          htmlFor="roles"
        >
          Roles needed (comma seprated)
        </label>
        <input
          {...register("roles", {
            required: "Roles needed is required",
            minLength: {
              value: 5,
              message: "Roles needed must be at least 5 characters"
            }
          })}
          placeholder="UX Desginer , Web developer"
          className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
          type="text"
          id="roles"
        />
      </div>
      {errors.roles && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.roles.message) || "Roles needed is required"}
        </span>
      )}

      {/* team size */}
      <div className="flex flex-col ">
        <label
          className="text-[13px] font-semibold pt-3 pb-1.5"
          htmlFor="teamSize"
        >
          Team Size
        </label>
        <input
        {...register("teamSize", {
          required: "Team size is required",
          min: {
            value: 1,
            message: "Team size must be at least 1"
          }
        })}
        placeholder="Enter team size"
        className="border placeholder:text-gray-400 border-[#CFCCC3] rounded-[10px] p-3 text-[14px] min-h-11"
        type="number"
        id="teamSize"
      />
      </div>
      {errors.teamSize && (
        <span className="mt-1 text-sm text-red-500">
          {String(errors.teamSize.message) || "Team size is required" }
        </span>
      )}
      {
        error && (
          <span className="mt-1 text-sm text-red-500">
            {error}
          </span>
        )
      }

      <button type="submit" className="w-full text-center bg-[#2F4BE0] p-3 text-white rounded-[10px] min-h-11 mt-5">
        {loading ? "Publishing..." : "Publish Project"}
      </button>
    </form>
  );
};

export default PostForm;
