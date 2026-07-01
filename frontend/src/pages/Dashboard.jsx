import React, {useState} from "react";
import axios from "../utils/axios.js";
import { useSelector } from "react-redux";
import { FaChartBar, FaFileInvoice, FaShoppingCart, FaCalendarAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import GSTOverview from "../components/dashboard/GSTOverview.jsx";

export default function Dashboard() {

  const businessData = useSelector((state) => state.business.businessData);
  const [values, setValues] = React.useState('');

  const fetchNumericValues = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/dashboard/get-numerical-values`, { businessId: businessData._id });
          //console.log("business", businessData);
          
          setValues(response.data);
      
        } catch (error) {
          console.error('Error fetching numerical values:', error);
          setError('Failed to fetch numerical values. Please check your authentication.');
        }
      };

  React.useEffect(() => {
    fetchNumericValues();
  }, []);

  //console.log("values", values);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <GSTOverview values={values}/>
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