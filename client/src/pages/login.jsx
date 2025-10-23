import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import Loading from "../components/Loader";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, {isLoading}] = useLoginMutation();

  const submitHandler = async (data) => {
   try {
    const result = await login(data).unwrap()

    dispatch(setCredentials(result))
    toast.success("Login successful! Welcome back.");
    navigate("/");
    
   } catch (error) {
    console.log(error);
    
    // Handle different error types
    if (error?.status === 401) {
      toast.error("Invalid email or password. Please check your credentials.");
    } else if (error?.status === 403) {
      toast.error("Account deactivated. Please contact administrator.");
    } else if (error?.status === 'FETCH_ERROR') {
      toast.error("Network error. Please check your connection.");
    } else if (error?.status === 'PARSING_ERROR') {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
   }
  };

  useEffect(() => {
    user && navigate("/dashboard");
  },[user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-700">
      {/* Floating Blur Circle */}
      

      {/* Main Container */}
      <div className="relative w-full max-w-4xl p-10 flex items-center justify-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full p-8 text-white">
          <h1 className="text-5xl font-bold">Welcome Back</h1>
          <p className="mt-4 text-lg">Manage all your tasks in one place</p>

        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="flex flex-col gap-6">
            <h2 className="text-3xl font-bold text-center text-white">Log In</h2>

            {/* Email */}
            <Textbox
              placeholder="email@example.com"
              type="email"
              name="email"
              label="Email Address"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-pink-500"
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
                      message: "Password must be at least 8 characters long"
                    }
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  className="w-full p-3 pr-12 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
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

            <div className="flex justify-between text-sm">
              <span className="text-white hover:underline cursor-pointer">
                Forgot Password?
              </span>
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="text-blue-300 hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </div>

            {/* Submit Button */}
            {isLoading ? ( <Loading/>):<Button
              type="submit"
              label="Submit"
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg shadow-lg hover:opacity-90"
            />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
