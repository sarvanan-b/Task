import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import Loading from "../components/Loader";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";

const Login = () => {
  const { user } = useSelector((state) => state.auth);

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
    navigate("/");
    
   } catch (error) {
    console.log(error)
    toast.error(error?.data?.message || error.message); 
    
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
              })}
              error={errors.email ? errors.email.message : ""}
            />

            {/* Password */}
            <Textbox
              placeholder="Your password"
              type="password"
              name="password"
              label="Password"
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white focus:ring-2 focus:ring-pink-500"
              register={register("password", {
                required: "Password is required!",
              })}
              error={errors.password ? errors.password.message : ""}
            />

            <span className="text-right text-sm text-white hover:underline cursor-pointer">
              Forgot Password?
            </span>

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
