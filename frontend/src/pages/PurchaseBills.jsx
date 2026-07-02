import React, { useState } from "react";
import AddPurchaseBill from "../components/purchaseBills/AddPurchaseBill.jsx";
import axios from "../utils/axios.js";
import { useSelector } from "react-redux";

export default function PurchaseBills() {
  const [showModal, setShowModal] = useState(false);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const businessData = useSelector((state) => state.business.businessData);

  const handleAddBill = async (bill) => {
    setShowModal(false);
    //console.log("New Bill Added:", bill);
    const payload = {
      ...bill,
      businessId: businessData._id
    };
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/purchase/create-purchase`, payload)
    .then((response) => {
      //console.log("Purchase bill created successfully:", response.data);
      setBills(prev => [response.data.data, ...prev]);
    });
  };

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/purchase/get-purchases/${businessData._id}`);
      //console.log("Fetched Purchases:", response.data);
      setBills(response.data.data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      setError('Failed to fetch purchases. Please check your authentication.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPurchases();
  }, []);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/20 p-4 md:p-8">

    {/* Page Header */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
      
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
          Purchase Bills
        </h1>
        <p className="text-slate-500 mt-1 text-xs md:text-sm">
          Track your purchases and input tax credit
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-5 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto"
      >
        <span className="text-lg leading-none">+</span>
        Add Purchase Bill
      </button>
    </div>

    {/* Table Card */}
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">

      <div className="px-4 md:px-6 pt-4 md:pt-5 pb-0 border-b border-slate-100">
        <span className="inline-block text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 px-1">
          All Purchases
        </span>
      </div>

      {bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 gap-4 px-4 text-center">
          
          <div className="text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 md:w-16 md:h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>

          <p className="text-slate-400 text-xs md:text-sm">
            No purchase bills yet. Add your first purchase to track ITC.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full text-xs md:text-sm min-w-[700px]">
            
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] md:text-xs tracking-wide">
              <tr>
                <th className="px-4 md:px-6 py-3 text-left">Vendor</th>
                <th className="px-4 md:px-6 py-3 text-left">GSTIN</th>
                <th className="px-4 md:px-6 py-3 text-left">Invoice No.</th>
                <th className="px-4 md:px-6 py-3 text-left">Date</th>
                <th className="px-4 md:px-6 py-3 text-right">Total Amount (₹)</th>
                <th className="px-4 md:px-6 py-3 text-right">GST Rate (%)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {bills.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50 transition-colors">

                  <td className="px-4 md:px-6 py-3 md:py-4 font-medium text-slate-800">
                    {bill.vendorName}
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-500 font-mono text-[10px] md:text-xs">
                    {bill.vendorGstin}
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-600">
                    {bill.invoiceNumber}
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4 text-slate-500">
                    {new Date(bill.purchaseDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4 text-right text-slate-700">
                    ₹{Number(bill.totalAmount).toLocaleString("en-IN")}
                  </td>

                  <td className="px-4 md:px-6 py-3 md:py-4 text-right text-green-600 font-semibold">
                    {bill.gstRate}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>

    {/* Modal */}
    {showModal && (
      <AddPurchaseBill
        onAdd={handleAddBill}
        onClose={() => setShowModal(false)}
      />
    )}
  </div>
);
}