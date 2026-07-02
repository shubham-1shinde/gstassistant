import React from 'react'
import Logout from "./Logout";
import { Link } from 'react-router-dom';
import UserDropdown from "./UserDropDown.jsx";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";

function Header({ sidebarOpen, setSidebarOpen }) {

  const userData = useSelector((state) => state.auth.userData);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
  <div className="flex items-center justify-between px-4 py-3 sm:py-0 mb-4 sm:mb-8">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-3">

      {/* ☰ Animated Sidebar Button (mobile only) */}
      <button
        onClick={() => setSidebarOpen((prev) => !prev)}
        className="md:hidden relative w-10 h-10 flex items-center justify-center"
      >
        {/* Top line */}
        <span
          className={`absolute h-0.5 w-6 bg-gray-800 transition-all duration-300
          ${sidebarOpen ? "rotate-45 translate-y-0" : "-translate-y-2"}`}
        />

        {/* Middle line */}
        <span
          className={`absolute h-0.5 w-6 bg-gray-800 transition-all duration-300
          ${sidebarOpen ? "opacity-0" : "opacity-100"}`}
        />

        {/* Bottom line */}
        <span
          className={`absolute h-0.5 w-6 bg-gray-800 transition-all duration-300
          ${sidebarOpen ? "-rotate-45 translate-y-0" : "translate-y-2"}`}
        />
      </button>

      {/* Welcome Text */}
      <div>
        <h1 className="text-lg sm:text-2xl font-semibold">
          Welcome back, {userData.fullName}!
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          {today}
        </p>
      </div>

    </div>

    {/* RIGHT SIDE */}
    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">

      {/* Change Business */}
      <button className="border px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 text-sm sm:text-base ml-16 mt-4">
        <Link to="/select-business" className="flex items-center gap-2">
          Change Business
        </Link>
      </button>

      {/* User Dropdown */}
      <div className="sm: ml-32"><UserDropdown
        name={userData.fullName}
        email={userData.email}
      /></div>
      

    </div>

  </div>
);
}

export default Header;