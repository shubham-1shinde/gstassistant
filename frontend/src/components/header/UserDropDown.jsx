import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import Logout from "./Logout.jsx";

function UserDropdown({ name = "Shubham Shinde.", email = "shubhamshinde0225@gmail.com", role = "Owner" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    
  };

  return (
    <div className="relative" ref={dropdownRef}>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
      >
        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">

          {/* User Info */}
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{email}</p>
            <span className="inline-block mt-2 text-xs font-semibold text-blue-600">
              {role}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
          >
            <Logout size={16} className="text-gray-500" />
          </button>

        </div>
      )}
    </div>
  );
}

export default UserDropdown;