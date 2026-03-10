import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthProvider";

export default function Logout() {
  const [authUser, setauthUSer] = useAuth();

  const handleLogout = () => {
    try {
      setauthUSer(null);
      localStorage.removeItem("user");
      toast.success("Logout successful");
      window.location.reload;
    } catch (error) {
      toast.error(error.message || "Logout failed");
    }
  };

  return (
    <button
      className="btn p-3 bg-red-600 text-white rounded-2xl transition-colors duration-300 hover:bg-red-700 hover:shadow-lg"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
