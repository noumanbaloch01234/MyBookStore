import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async(data) => {



    const userInfo={
          email:data.email,
          password:data.password,
        }
        await axios.post("http://localhost:4000/users/login",userInfo)
        .then((res)=>{
          if(res.data){
            toast.success("login successfull");
            document.getElementById("my_modal_2").close()
            window.location.reload();
            
          }
          window.location.reload;
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }).catch((error)=>{
            toast.error(error.response.data.message);
        })



    // ✅ Login success ke baad
    document.getElementById("my_modal_2").close();
    navigate("/");
  };

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box w-96">

        {/* Autofocus fix */}
        <button className="absolute opacity-0 pointer-events-none" autoFocus />

        <h3 className="font-bold text-2xl text-center mb-6">Login</h3>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
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
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
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

          <button className="btn btn-primary w-full mt-4">
            Login
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Not registered?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:underline"
            onClick={() => document.getElementById("my_modal_2").close()}
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Click outside → Home */}
      <form
        method="dialog"
        className="modal-backdrop"
        onClick={() => {
          document.getElementById("my_modal_2").close();
          navigate("/");
        }}
      >
        <button>close</button>
      </form>
    </dialog>
  );
}
