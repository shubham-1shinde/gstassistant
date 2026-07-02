import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCurrentMonthAndFY } from "../utils/date";
import { TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";

function GSTSummary() {

  const [purchases, setPurchases] = React.useState([]);
  const [invoices, setInvoices] = React.useState([]);
  const navigate = useNavigate();
  const businessData = useSelector((state) => state.business.businessData);
  const { month, financialYear } = getCurrentMonthAndFY();

  React.useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/purchase/get-purchases/${businessData._id}`);
        setPurchases(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/invoice/get-invoices/${businessData._id}`);
        setInvoices(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPurchases();
    fetchInvoices();
  }, [navigate]);



  const exportGST = async () => {

      const businessId = businessData._id;
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/gst/export`, {
          businessId,
          month,
          financialYear
      });
      //console.log("GST export response:", res.data);

      const { downloadUrl } = res.data;
      //console.log("Download URL:", downloadUrl);
      

      // trigger download
      window.open(downloadUrl, "_blank");
  };

  
  const totalTaxableSales = invoices.reduce((sum, inv) => sum + (Number(inv.taxableAmount) || 0), 0);
  const totalTaxablePurchases = purchases.reduce((sum, p) => sum + (Number(p.taxableAmount) || 0), 0);

  const totalOutputGST = invoices.reduce((sum, inv) => {
    const rate = parseFloat(inv.gstRate) / 100 || 0;
    return sum + (Number(inv.taxableAmount) || 0) * rate;
  }, 0);

  const totalInputGST = purchases.reduce((sum, p) => sum + (Number(p.totalGST) || 0), 0);
  const netGSTPayable = totalOutputGST - totalInputGST;

  const cgst = totalOutputGST / 2;
  const sgst = totalOutputGST / 2;
  const igst = 0;

  const fmt = (val) =>
    `₹${Math.abs(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">

    {/* Header */}
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      {/* Left Side */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          GST Summary
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Overview of your GST performance
        </p>
      </div>

      {/* Right Side Button */}
      <button
        className="group relative inline-flex w-full sm:w-auto justify-center items-center gap-2 px-5 py-2.5 rounded-lg
        bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium
        shadow-md hover:shadow-xl transition-all duration-300
        hover:scale-[1.05] active:scale-95 overflow-hidden"
        onClick={() => exportGST()}
      >
        {/* shine effect */}
        <span
          className="absolute inset-0 w-full h-full bg-white/10
          translate-x-[-100%] group-hover:translate-x-[100%]
          transition-transform duration-700"
        />

        <svg
          className="relative z-10 w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v3h16v-3"
          />
        </svg>

        <span className="relative z-10">Export File</span>
      </button>
    </div>

    {/* Net GST Card */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-5 sm:p-6 mb-8 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <p className="text-sm opacity-80">Net GST Payable</p>

        <h2 className="text-3xl sm:text-4xl font-bold mt-1 break-words">
          {fmt(netGSTPayable)}
        </h2>

        <p className="text-sm opacity-80 mt-1">
          {netGSTPayable > 0
            ? "GST payable"
            : netGSTPayable < 0
            ? "Refund due"
            : "Balanced"}
        </p>
      </div>

      <div className="bg-white/20 p-4 rounded-xl self-end sm:self-auto">
        <DollarSign size={32} />
      </div>
    </div>

    {/* GST Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

      {/* Output GST */}
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border hover:shadow-lg transition">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-green-500" />
          <h3 className="font-semibold text-gray-700">Output GST</h3>
        </div>

        <p className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 break-words">
          {fmt(totalOutputGST)}
        </p>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>CGST</span>
            <span>{fmt(cgst)}</span>
          </div>

          <div className="flex justify-between">
            <span>SGST</span>
            <span>{fmt(sgst)}</span>
          </div>

          <div className="flex justify-between">
            <span>IGST</span>
            <span>{fmt(igst)}</span>
          </div>
        </div>
      </div>

      {/* Input GST */}
      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border hover:shadow-lg transition">
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="text-blue-500" />
          <h3 className="font-semibold text-gray-700">Input GST</h3>
        </div>

        <p className="text-2xl sm:text-3xl font-bold text-gray-800 break-words">
          {fmt(totalInputGST)}
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Claimable ITC
        </p>
      </div>
    </div>

    {/* Sales + Purchases */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border hover:shadow-lg transition">
        <p className="text-sm text-gray-500">Total Sales</p>

        <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 break-words">
          {fmt(totalTaxableSales)}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border hover:shadow-lg transition">
        <p className="text-sm text-gray-500">Total Purchases</p>

        <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1 break-words">
          {fmt(totalTaxablePurchases)}
        </p>
      </div>
    </div>

    {/* Calculation Breakdown */}
    <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 border">
      <div className="flex items-center gap-2 mb-6">
        <FileText className="text-gray-500" />
        <h3 className="font-semibold text-gray-700">
          GST Calculation
        </h3>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Output GST</span>
          <span>{fmt(totalOutputGST)}</span>
        </div>

        <div className="flex justify-between text-blue-600">
          <span>- Input GST</span>
          <span>- {fmt(totalInputGST)}</span>
        </div>

        <div className="border-t pt-4 flex justify-between font-semibold text-base sm:text-lg">
          <span>Net GST</span>

          <span
            className={`${netGSTPayable < 0 ? "text-green-600" : ""} break-words`}
          >
            {netGSTPayable < 0 ? "-" : ""}
            {fmt(netGSTPayable)}
          </span>
        </div>
      </div>
    </div>

  </div>
);
}

export default GSTSummary;