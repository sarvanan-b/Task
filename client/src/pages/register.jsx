import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import Loading from "../components/Loader";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";

const Register = () => {
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [registerUser, {isLoading}] = useRegisterMutation();

  const submitHandler = async (data) => {
   try {
    // Convert checkbox value to boolean
    const registrationData = {
      ...data,
      isAdmin: data.isAdmin || false
    };

    await registerUser(registrationData).unwrap();
    
    if (registrationData.isAdmin) {
      toast.success("Admin account created successfully! Please login.");
    } else {
      toast.success("Registration successful! Please login.");
    }
    
    navigate("/login");
    
   } catch (error) {
    console.log(error);
    
    // Handle different error types
    if (error?.status === 400 && error?.data?.message?.includes("already exists")) {
      toast.error("Email already registered. Please use a different email or try logging in.");
    } else if (error?.status === 400 && error?.data?.message?.includes("Invalid user data")) {
      toast.error("Invalid registration data. Please check all fields and try again.");
    } else if (error?.status === 'FETCH_ERROR') {
      toast.error("Network error. Please check your connection and try again.");
    } else if (error?.status === 'PARSING_ERROR') {
      toast.error("Server error. Please try again later.");
    } else if (error?.status === 422) {
      toast.error("Validation error. Please check your input and try again.");
    } else {
      toast.error(error?.data?.message || "Registration failed. Please try again.");
    }
   }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  },[user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-700">
      {/* Main Container */}
      <div className="relative w-full max-w-4xl p-10 flex items-center justify-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full p-8 text-white">
          <h1 className="text-5xl font-bold">Join Us</h1>
          <p className="mt-4 text-lg">Create your account to get started</p>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-1/2 p-8">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-center text-white">Sign Up</h2>

            {/* Name */}
            <Textbox
              placeholder="Your full name"
              type="text"
              name="name"
              label="Full Name"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-green-500"
              register={register("name", {
                required: "Name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />

            {/* Email */}
            <Textbox
              placeholder="email@example.com"
              type="email"
              name="email"
              label="Email Address"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-green-500"
              register={register("email", {
                required: "Email Address is required!",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address"
                }
              })}
              error={errors.email ? errors.email.message : ""}
            />

            {/* Title */}
            <Textbox
              placeholder="Your job title"
              type="text"
              name="title"
              label="Job Title"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-green-500"
              register={register("title", {
                required: "Job title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />

            {/* Role */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Role</label>
              <select
                {...register("role", { required: "Role is required!" })}
                className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select your role</option>
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
                <option value="other">Other</option>
              </select>
              {errors.role && (
                <span className="text-red-300 text-sm">{errors.role.message}</span>
              )}
            </div>

            {/* Admin Privileges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  {...register("isAdmin")}
                  className="w-4 h-4 text-green-500 bg-white bg-opacity-20 border-white rounded focus:ring-green-500 focus:ring-2"
                />
                <label className="text-white text-sm font-medium">
                  Register as Administrator
                </label>
              </div>
              <div className="bg-yellow-500 bg-opacity-20 border border-yellow-400 rounded-lg p-3">
                <p className="text-yellow-200 text-xs">
                  ⚠️ <strong>Admin Warning:</strong> Administrator accounts have full access to manage users, tasks, and system settings. Only select this if you are authorized to have admin privileges.
                </p>
              </div>
            </div>

            {/* Password */}
            <Textbox
              placeholder="Your password"
              type="password"
              name="password"
              label="Password"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-green-500"
              register={register("password", {
                required: "Password is required!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              error={errors.password ? errors.password.message : ""}
            />

            {/* Submit Button */}
            {isLoading ? ( <Loading/>):<Button
              type="submit"
              label="Create Account"
              className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-lg hover:opacity-90"
            />}

            {/* Login Link */}
            <div className="text-center">
              <span className="text-white">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate("/log-in")}
                className="text-green-300 hover:underline"
              >
                Login here
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
