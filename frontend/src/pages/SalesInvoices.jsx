import React, { useState } from "react";
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

const handleAdd = async (invoice) => {


  const payload = {
    ...invoice,
    businessId: businessData._id
  };

  setOpenModal(false);

  //console.log("New Invoice Added:", payload);

  const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/invoice/create-invoice`, payload)
  .then((response) => {
    //console.log("Invoice created successfully:", response.data);
    setInvoices(prev => [response.data.data, ...prev]);
  });
    
};

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/invoice/get-invoices/${businessData._id}`);
      //console.log("Fetched Invoices:", response.data);
      setInvoices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setError('Failed to fetch invoices. Please check your authentication.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      <div className="flex items-center justify-between mb-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Sales Invoices</h1>
          <p className="text-slate-500 mt-1 text-sm">Manage your sales invoices and track GST</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
            <Upload size={18} />
            Import from Billing Software
          </button>
          <button
            onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Invoice
          </button>
        </div>
      </div>
      

      {/* Tab + Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 pt-5 pb-0 border-b border-slate-100">
          <span className="inline-block text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-3 px-1">
            All Invoices
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-slate-400 text-sm">Loading invoices...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-red-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">{error}</p>
            <button onClick={fetchInvoices} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Retry</button>
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-slate-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-sm">No invoices yet. Create your first invoice to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Invoice No.</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Total (₹)</th>
                  <th className="px-6 py-3 text-right">GST Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(inv.invoiceDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}</td>
                    <td className="px-6 py-4 text-right text-gray-700">₹{Number(inv.totalAmount).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4 text-right text-blue-600 font-semibold">{inv.gstRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreateInvoice
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onAdd={handleAdd}
      />

    </div>
  );
}

export default SalesInvoices;