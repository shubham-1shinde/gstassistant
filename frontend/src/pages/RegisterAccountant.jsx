import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Phone, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from 'react-hook-form';

// ✅ OUTSIDE the component — fixes the cursor/focus bug
const InputField = ({
  label,
  type = "text",
  placeholder,
  icon,
  rightElement,
  error,
  ...inputProps
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>

    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>

      <input
        type={type}
        placeholder={placeholder}
        {...inputProps}
        className={`w-full border rounded-lg pl-10 pr-10 py-2.5 text-sm text-gray-800 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition
        ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"}`}
      />

      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>

    {error && (
      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <span>⚠</span> {error.message}
      </p>
    )}
  </div>
);

function RegisterAccountant() {
  const navigate = useNavigate();

  const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();


  const onSubmit = async (data) => {
    console.log("Form submitted:", data);
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/v1/accountant/create`, data);
    console.log("Response:", response.data);
    navigate("/thank-you");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="flex rounded-2xl shadow-2xl overflow-hidden w-[85vw] h-[88vh]">

        {/* LEFT — Banner */}
        <div className="bg-gradient-to-b from-blue-900 to-blue-600 w-[300px] flex-shrink-0 flex flex-col items-center justify-center text-center px-10">
          <div className="bg-white/20 p-5 rounded-2xl mb-6">
            <Building2 size={48} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">GST Assistant</h1>
          <p className="text-blue-200 text-sm mt-3 leading-relaxed">Compliance Made Easy</p>
          <div className="mt-10 space-y-3 text-left w-full">
            {["Manage GST Invoices", "Track Input Tax Credit", "File Returns on Time", "Stay Compliant"].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-300 shrink-0" />
                <p className="text-blue-100 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="flex-1 bg-white flex flex-col justify-center px-12 py-8 overflow-y-auto">

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-800">Create your Account</h2>
            <p className="text-gray-400 text-sm mt-1">Register as an accountant on GST Assistant</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                name="fullName"
                placeholder="Shubham Shinde"
                icon={<User size={16} />}
                {...register('fullName', { required: 'Name is required' })}
                
              />
              <InputField
                label="Email Address"
                name="email"
                type="email"
                placeholder="shubham@example.com"
                icon={<Mail size={16} />}
                {...register('email', { required: 'Email is required' })}
               
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="9876543210"
                icon={<Phone size={16} />}
                {...register('phone', { required: 'Phone number is required' })}
               
              />
              <InputField
                label="Firm / Practice Name"
                name="firmName"
                placeholder="Shinde & Associates"
                icon={<Building2 size={16} />}
                {...register('firmName', { required: 'Firm name is required' })}
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                onClick={() => console.log("Submitting form...")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-base font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Create Account
              </button>
            </div>

          </form>

          <p className="text-center text-xs text-gray-300 mt-8">
            © 2024 GST Assistant. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}

export default RegisterAccountant;