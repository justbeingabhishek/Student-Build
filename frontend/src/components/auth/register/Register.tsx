import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../../../../Services/api.ts";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({});

  const navigate = useNavigate();

  const handleSignup = async(data: SignupFormValues) => {
    console.log("SIGNUP DATA:", data);
    try{
      const response = await api.post("/auth/signup", data);
      if(response.data.success){
        toast.success("Signup successful! Please log in.");
        navigate("/login");
        console.log("User signed up successfully:", response.data.user);
      }
      console.log("SIGNUP RESPONSE:", response.data);
    }catch(error){
      console.error("SIGNUP ERROR:", error);
    }

    // Add signup API here
  };

  return (
    <div className="min-h-screen bg-[#f7f6f3] px-4 pt-10 pb-6 md:px-4.5 md:pt-17.5">
      <div className="mx-auto w-full max-w-275">

        {/* Logo */}
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-4.5 bg-[#3048e8] text-2xl font-bold text-white md:mb-8 md:h-18 md:w-18 md:text-[34px]">
          D
        </div>

        {/* Heading */}
        <h1 className="mb-2 text-3xl font-bold tracking-[-1px] text-black md:text-[46px] md:tracking-[-1.5px]">
          Find your circle.
        </h1>

        <p className="mb-4.5 text-base text-[#59677f] md:text-[23px]">
          Discover teammates. Ship projects together.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(handleSignup)}>

          {/* Full Name */}
          <div className="mb-4.75 flex flex-col">
            <label className="mb-2.25 text-base font-semibold md:text-[18px]">
              Full name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="h-14 w-full rounded-xl border border-[#d4d0c7] bg-white px-4 text-base outline-none focus:border-[#3048e8] md:h-16.5 md:rounded-4 md:px-4.75 md:text-[20px]"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Name must have at least 2 characters",
                },
              })}
            />

            {errors.name && (
              <span className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="mb-4.75 flex flex-col">
            <label className="mb-2.25 text-base font-semibold md:text-[18px]">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="h-14 w-full rounded-xl border border-[#d4d0c7] bg-white px-4 text-base outline-none focus:border-[#3048e8] md:h-16.5 md:rounded-4 md:px-4.75 md:text-[20px]"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />

            {errors.email && (
              <span className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="mb-4.75 flex flex-col">
            <label className="mb-2.25 text-base font-semibold md:text-[18px]">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="h-14 w-full rounded-xl border border-[#d4d0c7] bg-white px-4 text-base outline-none focus:border-[#3048e8] md:h-16.5 md:rounded-4 md:px-4.75 md:text-[20px]"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />

            {errors.password && (
              <span className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="mt-2.5 h-14 w-full rounded-4 bg-[#3048e8] text-base font-bold text-white transition hover:bg-[#263bd0] md:h-16.5 md:text-[20px]"
          >
            Create account
          </button>
        </form>

        {/* Bottom Actions */}
        <div className="mt-4.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => (window.location.href = "/login")}
            className="rounded-full border border-[#dedbd3] bg-white px-4 py-3 text-base hover:bg-[#eeece7] md:px-5 md:py-3.5 md:text-[19px]"
          >
            Have an account? Log in
          </button>

          <button
            type="button"
            onClick={() => (window.location.href = "/forgot-password")}
            className="rounded-full border border-[#dedbd3] bg-white px-4 py-3 text-base hover:bg-[#eeece7] md:px-5.25 md:py-3.5 md:text-[19px]"
          >
            Forgot password?
          </button>
        </div>

      </div>
    </div>
  );
};

export default Signup;
