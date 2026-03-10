import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../Context/AppContext.jsx";

export default function SellerNavbar() {
    const navigate = useNavigate();
    const { sellerLogout } = useStore();  // ✅ Correct function

    const handleLogout = () => {
        console.log('🚪 Logging out seller...');
        sellerLogout();    // ✅ This will clear sellerAuth properly
        navigate("/");     // Redirect to home
    };

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 lg:px-24 py-4 border-b bg-white shadow-sm">
            <h1 className="text-2xl font-bold text-orange-500">
                Seller Dashboard
            </h1>

            <button
                onClick={handleLogout}
                className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
            >
                Logout
            </button>
        </nav>
    );
}