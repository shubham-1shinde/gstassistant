import React from "react";
import { NavLink } from "react-router-dom";
import { FaChartBar, FaFileInvoice, FaShoppingCart, FaCalendarAlt, FaRobot  } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Building2 } from "lucide-react";
import { useSelector } from "react-redux";

function Sidebar() {

  const menuItems = [
    { to: "/", icon: <MdDashboard />, label: "Dashboard" },
    { to: "/invoices", icon: <FaFileInvoice />, label: "Sales Invoices" },
    { to: "/purchases", icon: <FaShoppingCart />, label: "Purchase Bills" },
    { to: "/itc-tracker", icon: <FaChartBar />, label: "ITC Tracker" },
    { to: "/gst-summary", icon: <FaChartBar />, label: "GST Summary" },
    { to: "/compliance", icon: <FaCalendarAlt />, label: "Compliance Calendar" },
    { to: "/taxbot", icon: <FaRobot  />, label: "Tax Bot" },
  ];

  const businessData = useSelector((state) => state.business.businessData);
  const userData = useSelector((state) => state.auth.userData);
  //console.log("Sidebar businessData", businessData);


  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col">

      {/* 1. Logo */}
      <div className="p-6 border-b border-blue-600">
        <h2 className="text-xl font-bold">GST Assistant</h2>
        <p className="text-sm text-blue-200">Compliance Made Easy</p>
      </div>

      {/* 2. Current Business Card */}
      {businessData.ownerId === userData._id 
        ? <div className="mx-4 mt-4 mb-2 bg-blue-800/60 border border-blue-600 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg shrink-0">
                <Building2 size={18} className="text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  {businessData.ownerId === userData._id ? businessData.businessName : ""}
                </p>
                <p className="text-xs font-mono text-blue-300 truncate mt-0.5">
                  {businessData.ownerId === userData._id ? businessData.gstin : ""}
                </p>
              </div>
            </div>
          </div>
        : null
      }

      {/* 3. Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="flex flex-col gap-2">
          {menuItems.map(({ to, icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isActive
                    ? "bg-blue-500 text-white"
                    : "text-blue-100 hover:bg-blue-600"
                  }`
                }
              >
                <div className="flex-shrink-0 text-lg">{icon}</div>
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-blue-200">
        © 2026 GST Assistant | All rights reserved.
      </div>

    </aside>
  );
}

export default Sidebar;