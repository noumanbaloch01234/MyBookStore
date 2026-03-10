import React from "react";
import { useForm } from "react-hook-form";

export default function Contact() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("Contact Form Data:", data);

    // yahan API call / email service aa sakti hai

    reset(); // form clear after submit
  };

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 text-center text-base-content">

      <h1 className="text-4xl font-bold mb-6 text-error">Contact Us</h1>
      <p className="text-base-content/70 text-lg mb-4">
        Have questions or need support? Reach out to us anytime!
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto bg-base-100 p-6 rounded-lg shadow-md space-y-4"

      >

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg p-2
           focus:outline-none focus:ring-2 focus:ring-primary"

            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 3,
                message: "Name must be at least 3 characters",
              },
            })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Your Email"
            className="w-full border border-base-300 bg-base-100 text-base-content rounded-lg p-2
           focus:outline-none focus:ring-2 focus:ring-primary"

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

        {/* Message */}
        <div>
          <textarea
            placeholder="Your Message"
            rows="4"
            className="w-full border border-gray-300 rounded-lg p-2
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
            {...register("message", {
              required: "Message is required",
              minLength: {
                value: 10,
                message: "Message must be at least 10 characters",
              },
            })}
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg
                     hover:bg-red-700 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
