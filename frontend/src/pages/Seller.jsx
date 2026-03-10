import React, { useState } from "react";
import SellerNavbar from "../components/SellerNavbar";
import SellerUnderNavbar from "../components/sellerUnderNavbar";
export default function Seller() {
  const [activePage, setActivePage] = useState("dashboard"); // default page

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <SellerNavbar />

      <div className="flex">
        {/* Sidebar */}
        <SellerUnderNavbar setActivePage={setActivePage} activePage={activePage} />

        {/* Right-side content */}
        <div className="flex-1 px-6 md:px-16 lg:px-24 py-8">
          {/* Dashboard Content */}
          {activePage === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
              <p>Here you can show dashboard summary or whatever you want.</p>
            </div>
          )}

         

          {/* Chat Content */}
          {activePage === "chat" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Chat Section</h1>
              <p>Here you can show chat messages or chat interface.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
