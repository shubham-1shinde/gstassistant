import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

function CreateNewBusiness({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({
    businessName: "",
    gstin: "",
    state: "",
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.businessName.trim()) newErrors.businessName = "Business name is required";
    if (!form.gstin.trim()) newErrors.gstin = "GSTIN is required";
    else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(form.gstin))
      newErrors.gstin = "Enter a valid GSTIN (e.g. 27ABCDE1234F2Z5)";
    if (!form.state) newErrors.state = "Please select a state";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onAdd(form);
    setForm({ businessName: "", gstin: "", state: "" });
    setErrors({});
  };

  const handleClose = () => {
    setForm({ businessName: "", gstin: "", state: "" });
    setErrors({});
    onClose();
  };


  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
    "Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
  ]
  

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Add New Business</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Business Name
            </label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="ABC Enterprises"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.businessName ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.businessName && (
              <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>
            )}
          </div>

          {/* GSTIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              GSTIN
            </label>
            <input
              type="text"
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              placeholder="27ABCDE1234F1Z5"
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.gstin ? "border-red-400" : "border-gray-200"
              }`}
            />
            {errors.gstin && (
              <p className="text-xs text-red-500 mt-1">{errors.gstin}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              State
            </label>
            <select
              name="state"
              value={form.state}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                errors.state ? "border-red-400" : "border-gray-200"
              }`}
            >
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
            {errors.state && (
              <p className="text-xs text-red-500 mt-1">{errors.state}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
          <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Add Business
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateNewBusiness;