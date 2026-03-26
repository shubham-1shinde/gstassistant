import React from 'react'
import Logout from "./Logout";
import { Link } from 'react-router-dom';
import UserDropdown from "./UserDropDown.jsx";
import { useSelector } from "react-redux";

function Header() {

  const userData = useSelector((state) => state.auth.userData);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-2xl font-semibold m-4">
              Welcome back, {userData.fullName}!
            </h1>

            <p className="text-gray-500 m-4">
              {today}
            </p>
          </div>

          <div className="flex items-center gap-4">

            <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
              <Link to="/select-business" className="flex items-center gap-2">
                Change Business
              </Link>
            </button>

            <div className="flex items-center gap-2">
              <UserDropdown
                name={userData.fullName}
                email={userData.email}
              />
            </div>

          </div>

        </div>
  )
}

export default Header