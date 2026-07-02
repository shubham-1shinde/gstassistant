import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import Logout from "./Logout.jsx";

function UserDropdown({ name = "Shubham Shinde.", email = "shubhamshinde0225@gmail.com", role = "Owner" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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
        className="flex items-center gap-1.5 sm:gap-2 hover:bg-gray-100 px-2 sm:px-3 py-1.5 rounded-lg transition"
      >
        {/* Avatar */}
        <div className="bg-blue-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
          <User size={14} className="sm:hidden" />
          <User size={16} className="hidden sm:block" />
        </div>

        {/* Name — hidden on very small screens */}
        <span className="hidden xs:inline sm:inline text-sm font-medium text-gray-700 max-w-[100px] sm:max-w-none truncate">
          {name}
        </span>

        {/* Chevron */}
        <svg
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">

          {/* User Info */}
          <div className="px-4 py-3 sm:py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{email}</p>
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