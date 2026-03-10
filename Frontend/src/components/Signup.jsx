import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";



export default function Signup() {
  const Navigate=useNavigate();

const location =useLocation() 
const from =location.state?.from?.pathname || "/"

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async(data) => {
   
    const userInfo={
      fullname:data.fullname,
      email:data.email,
      password:data.password,
    }
    await axios.post("http://localhost:4000/users/signup",userInfo)
    .then((res)=>{
      if(res.data){
        toast.success("signup successfull");
        Navigate(from,{replace:true});
        document.getElementById("my_modal_2").close();
        window.location.reload();
      }
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }).catch((error)=>{
        toast.error(error.response.data.message);
    })

    // yahan API call ayegi


  };

  return (
    <div className="min-h-screen flex items-center justify-center text-base-content bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">

          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

            {/* Full Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="input input-bordered w-full"
                {...register("fullname", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
              />
              {errors.fullname && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className="input input-bordered w-full"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button className="btn btn-primary w-full">
              Create Account
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={() =>
                document.getElementById("my_modal_2").showModal()
              }
            >
              Login
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
