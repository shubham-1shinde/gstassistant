import { useState } from "react";
import { Plus, Building2, CheckCircle } from "lucide-react";
import CreateNewBusiness from "../components/selectBusiness/CreateNewBusiness.jsx";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { currentBusiness } from "../store/businessSlice.js";

function SelectBusiness({ onSelectBusiness }) {

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const dispatch = useDispatch();

  const handleAddBusiness = async (formData) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/business/create-new-business`, formData);
      
  
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/business/get-businesses`);
      setBusinesses(data?.data || []);
      setShowModal(false);
      const businessData = res.data.data;
      //console.log("businessData", res.data.data);
      if (businessData) {
        dispatch(currentBusiness({businessData}));
      }
    } catch (err) {
      console.error('Failed to create business:', err);
    }
  };
  const navigate = useNavigate();


  useEffect(() => {

    const controller = new AbortController();

    const fetchBusinesses = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/v1/business/get-businesses`, {
          signal: controller.signal,
        });
        setBusinesses(data?.data || []);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
      }
    };

    fetchBusinesses();
    return () => controller.abort();
  }, [navigate]);

  return (
  <div className="min-h-screen bg-gray-50 p-4 md:p-8">

    {/* Header Row */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
      
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
          Select Business
        </h1>
        <p className="text-gray-500 text-xs md:text-sm mt-1">
          Choose a business to continue
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 w-full md:w-auto"
      >
        <Plus size={18} />
        Create New Business
      </button>
    </div>

    {/* Business Cards Grid */}
    {businesses.length === 0 ? (
      <div className="bg-white rounded-xl border p-10 md:p-16 text-center text-gray-400">
        <Building2 size={36} className="mx-auto mb-3 text-gray-300" />
        <p className="text-xs md:text-sm">
          No businesses yet. Add your first business to get started.
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        
        {businesses.map((biz) => (
          <button
            key={biz.id}
            className={`text-left bg-white rounded-xl border-2 p-4 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group ${
              selected === biz.id
                ? "border-blue-500 ring-2 ring-blue-100"
                : "border-gray-100 hover:border-blue-300"
            }`}
            onClick={async () => {
              const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/v1/business/get-business`,
                { _id: biz._id }
              );

              const businessData = res.data.data;

              if (businessData) {
                dispatch(currentBusiness({ businessData }));
                navigate("/dashboard");
              }
            }}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Building2 size={22} className="text-blue-600" />
              </div>

              {selected === biz.id && (
                <CheckCircle size={20} className="text-blue-500" />
              )}
            </div>

            {/* Business Name */}
            <h2 className="text-sm md:text-base font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
              {biz.businessName}
            </h2>

            {/* GSTIN */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide font-medium w-10">
                  GSTIN
                </span>
                <span className="text-[10px] md:text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {biz.gstin}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide font-medium w-10">
                  State
                </span>
                <span className="text-xs text-gray-600">{biz.state}</span>
              </div>
            </div>

            {/* Select indicator */}
            <div
              className={`mt-4 text-xs font-semibold transition-colors ${
                selected === biz.id
                  ? "text-blue-600"
                  : "text-gray-300 group-hover:text-blue-400"
              }`}
            >
              {selected === biz.id ? "✓ Selected" : "Click to select"}
            </div>
          </button>
        ))}
      </div>
    )}

    {/* Modal */}
    <CreateNewBusiness
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      onAdd={handleAddBusiness}
    />
  </div>
);
}

export default SelectBusiness;