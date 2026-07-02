import React, { useState, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import CreateInvoice from "../components/salesInvoice/CreateInvoice.jsx";
import axios from "../utils/axios.js";
import { useSelector } from "react-redux";

function SalesInvoices() {
  const [openModal, setOpenModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const businessData = useSelector((state) => state.business.businessData);
  const businessState = useSelector((state) => state.business.status);

const handleAdd = async (invoice) => {
  if (!businessState) return;

  const payload = {
    ...invoice,
    businessId: businessData._id
  };

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/v1/invoice/create-invoice`,
      payload
    );

    setInvoices((prev) => [response.data.data, ...prev]);
    setOpenModal(false);
  } catch (err) {
    console.error(err);
  }
};

const fetchInvoices = async () => {
  if (!businessData?._id) {
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/v1/invoice/get-invoices/${businessData._id}`
    );

    setInvoices(response.data.data || []);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    setError("Failed to fetch invoices");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchInvoices();
  }, []);

return (
  <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 ">

    {!businessData?._id && !loading ? (
      <div className="text-center text-gray-500 py-20">
        No business found. Please create a business to view invoices.
      </div>
    ) : loading ? (
      <div className="text-center py-20">Loading...</div>
    ) : (
      <>

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Sales Invoices
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your sales invoices and track GST
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button className="flex items-center justify-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100 w-full sm:w-auto whitespace-nowrap text-sm">
              <Upload size={18} className="flex-shrink-0" />
              <span className="truncate sm:truncate-none">
                Import from Billing Software
              </span>
            </button>

            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto whitespace-nowrap text-sm"
            >
              <Plus size={18} className="flex-shrink-0" />
              <span>Create Invoice</span>
            </button>

          </div>

        </div>

        {/* TABLE CARD */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100">

          {/* Tab */}
          <div className="px-4 sm:px-6 pt-5 pb-0 border-b border-slate-100">
            <span className="inline-block text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 px-1">
              All Invoices
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-slate-400 text-sm">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
              <div className="text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm">
                No invoices yet. Create your first invoice to get started.
              </p>
            </div>
          ) : (
            /* ✅ FIXED: Proper horizontal scroll wrapper */
            <div className="w-full overflow-hidden">
  <div
    className="overflow-x-auto"
    style={{ WebkitOverflowScrolling: "touch" }}
  >
    <table className="min-w-[650px] sm:min-w-[850px] w-full table-fixed text-sm">
  <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
    <tr>
      <th className="w-[50px] px-3 sm:px-6 py-3 text-left whitespace-nowrap">
        Invoice No.
      </th>

      <th className="w-[40px] px-3 sm:px-6 py-3 text-left whitespace-nowrap">
        Date
      </th>

      <th className="w-[10px] px-3 sm:px-6 py-3 text-right whitespace-nowrap">
        Total (₹)
      </th>

      <th className="w-[40px] px-3 sm:px-6 py-3 text-right whitespace-nowrap">
        GST Rate
      </th>
    </tr>
  </thead>

  <tbody className="divide-y divide-gray-100">
    {invoices.map((inv) => (
      <tr key={inv.id} className="hover:bg-gray-50">

        <td className="px-3 sm:px-6 py-4 whitespace-nowrap font-medium">
          {inv.invoiceNumber}
        </td>

        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-500">
          {new Date(inv.invoiceDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}
        </td>

        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right">
          ₹{Number(inv.totalAmount).toLocaleString("en-IN")}
        </td>

        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-blue-600 font-semibold">
          {inv.gstRate}
        </td>

      </tr>
    ))}
  </tbody>
</table>
  </div>
</div>
          )}

        </div>

        {/* MODAL */}
        <CreateInvoice
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onAdd={handleAdd}
        />

      </>
    )}
  </div>
);

}

export default SalesInvoices;