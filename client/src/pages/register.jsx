import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import Loading from "../components/Loader";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";

const Register = () => {
  const { user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [registerUser, {isLoading}] = useRegisterMutation();

  const submitHandler = async (data) => {
   try {
    // Remove confirmPassword from data before sending to backend
    const { confirmPassword, ...registrationData } = data;
    await registerUser(registrationData).unwrap();
    toast.success("Registration successful! Please login.");
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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required!",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full p-3 pr-12 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-red-300 text-sm">{errors.password.message}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-white font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password!",
                    validate: (value) => {
                      const password = document.querySelector('input[name="password"]').value;
                      return value === password || "Passwords do not match!";
                    }
                  })}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full p-3 pr-12 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  {showConfirmPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-red-300 text-sm">{errors.confirmPassword.message}</span>
              )}
            </div>

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
