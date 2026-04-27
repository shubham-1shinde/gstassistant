import React, {useState} from "react";
import axios from "../utils/axios.js";
import { useSelector } from "react-redux";
import { FaChartBar, FaFileInvoice, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import GSTOverview from "../components/dashboard/GSTOverview.jsx";

export default function Dashboard() {

  const businessData = useSelector((state) => state.business.businessData);
  const [values, setValues] = React.useState("");

  const fetchNumericValues = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/dashboard/get-numerical-values`, { businessId: businessData._id });
          console.log("business", businessData);
          setValues(response.data);
        } catch (error) {
          console.error('Error fetching numerical values:', error);
          setError('Failed to fetch numerical values. Please check your authentication.');
        }
      };

  React.useEffect(() => {
    fetchNumericValues();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">

      


      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">



        {/* Dashboard Title */}
        {/*<div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Overview of your GST compliance
          </p>
        </div>*/}


        {/* Stats Cards */}
        {/*<div className="grid grid-cols-4 gap-6 mb-8">

          <StatCard title="Total Sales" value={values.totalSales} />

          <StatCard title="Output GST" value={values.outputGST} />

          <StatCard title="Input ITC" value={values.inputITC} />

          <StatCard title="Net GST Payable" value={values.netGST} />

        </div>*/}


        {/* Chart Section */}
        {/*<div className="bg-white rounded-xl shadow p-6 h-72 flex flex-col items-center justify-center">

          <h3 className="text-lg font-semibold mb-4">
            Monthly GST Overview
          </h3>

          <p className="text-gray-400 text-center">
            No data available yet. Start adding invoices and purchases to see insights.
          </p>

        </div>*/}
        <GSTOverview />
      </main>
    </div>
  );
}


function SidebarItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer 
      ${active ? "bg-blue-500" : "hover:bg-blue-600"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}


function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">

      <p className="text-gray-500 text-sm">{title}</p>

      <h3 className="text-2xl font-semibold mt-2">{value}</h3>

    </div>
  );
}