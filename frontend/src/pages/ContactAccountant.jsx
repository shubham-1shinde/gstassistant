import React, { useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
  Wallet,
  ClipboardCheck,
  BadgeCheck,
  Clock3,
  Star,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

const BENEFITS = [
  {
    icon: FileCheck2,
    title: "GST Filing Accuracy",
    copy: "Avoid penalties with expert filing",
  },
  {
    icon: Wallet,
    title: "ITC Optimization",
    copy: "Maximize input tax credit",
  },
  {
    icon: ClipboardCheck,
    title: "Compliance Support",
    copy: "Stay updated with GST rules",
  },
  {
    icon: BadgeCheck,
    title: "Audit Ready Reports",
    copy: "Clean financial reporting",
  },
];

const HELP_TYPES = ["GST Filing", "ITC Issues", "Invoice Help", "Compliance"];

const ContactAccountant = () => {
  const [helpType, setHelpType] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Contact Accountant
          </h1>
          <p className="text-gray-500 mt-1">
            Get expert help for GST filing, ITC, invoices &amp; compliance
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            GST Assistant • Professional Support System
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hire card — receipt-style signature */}
          <div className="bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
                  <UserCheck size={24} />
                </div>
                <div> 
                  <h2 className="text-xl font-semibold leading-tight">
                    Hire an Accountant
                  </h2>
                  <p className="text-sm text-blue-100 mt-0.5">
                    Connect with GST professionals in minutes
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 pb-4 space-y-5 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-700">
                    <Clock3 size={14} />
                    <p className="text-xl font-bold">24×7</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Expert Support</p>
                </div>

                <div className="rounded-xl border border-green-100 bg-green-50/70 p-3 text-center">
                  <div className="flex items-center justify-center gap-1 text-green-700">
                    <Star size={14} className="fill-green-700" />
                    <p className="text-xl font-bold">100%</p>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">Verified CAs</p>
                </div>
              </div>

              <button
                className="
                  group w-full bg-gradient-to-r from-blue-600 to-indigo-600
                  hover:from-blue-700 hover:to-indigo-700 text-white py-3.5
                  rounded-xl font-semibold shadow-md transition-all duration-300
                  hover:shadow-lg active:scale-[0.99]
                  flex items-center justify-center gap-2
                "
              >
                <UserCheck size={18} />
                <Link to="/list-accountants">
                  Hire Accountant
                </Link>
                
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={14} className="text-green-600" />
                Verified GST professionals • Secure consultation
              </div>
            </div>

            {/* Receipt-style perforated edge — signature touch tying the card to invoices/receipts */}
            <div className="relative h-4 bg-white">
              <div
                className="absolute inset-x-0 top-0 h-4"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 8px 0, transparent 7px, #f9fafb 7.5px)",
                  backgroundSize: "16px 16px",
                  backgroundRepeat: "repeat-x",
                }}
              />
              <div className="absolute inset-x-5 top-2 border-t border-dashed border-gray-200" />
            </div>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Why Hire an Accountant?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BENEFITS.map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="border rounded-lg p-4 bg-gray-50 hover:bg-blue-50/50 hover:border-blue-100 transition-colors flex gap-3"
                >
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-blue-600">
                    <Icon size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation form 
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Consult an Accountant
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Share a few details and a verified CA will reach out to you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Full Name
              </label>
              <input
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g. Rohan Mehta"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                GST Number{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="22AAAAA0000A1Z5"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Type of Help
              </label>
              <select
                value={helpType}
                onChange={(e) => setHelpType(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700"
              >
                <option value="">Select an option</option>
                {HELP_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Describe your issue
              </label>
              <textarea
                rows="4"
                className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="Tell us what you need help with..."
              />
            </div>

            <div className="md:col-span-3 flex items-center justify-between pt-1">
              <p className="text-xs text-gray-400">
                We typically respond within a few hours.
              </p>
              <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
                <Send size={16} />
                Send Request
              </button>
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default ContactAccountant;