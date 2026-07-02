import { useState } from "react";
import { useSelector } from "react-redux";

// ── Helpers ──────────────────────────────────────────────────────────────────
function getMonthFromDate(dateStr) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
  return months[new Date(dateStr).getMonth()];
}

function getFinancialYear(dateStr) {
  const date  = new Date(dateStr);
  const year  = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month >= 4) return `${year}-${String(year + 1).slice(2)}`;
  return `${year - 1}-${String(year).slice(2)}`;
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
  "Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function AddPurchaseBill({ onAdd, onClose }) {

  const businessData = useSelector((state) => state.business);

  const [form, setForm] = useState({
    vendorName:      "",
    vendorGSTIN:     "",
    invoiceNumber:   "",
    purchaseDate:    "",
    gstRate:         18,
    vendorState:     "",
    itemDescription: "",
    hsnCode:         "",
    quantity:        "",
    unitPrice:       "",
    itcEligible:     true,
    paymentStatus:   "pending",
  });

  const quantity      = parseFloat(form.quantity)  || 0;
  const unitPrice     = parseFloat(form.unitPrice) || 0;
  const gstRate       = parseFloat(form.gstRate)   || 0;

  const taxableAmount = quantity * unitPrice;
  const gstAmount     = (taxableAmount * gstRate) / 100;
  const totalAmount   = taxableAmount + gstAmount;
  const itcClaimed    = form.itcEligible ? gstAmount : 0;

  const transactionType =
    form.vendorState && businessData.businessData.state
      ? form.vendorState === businessData.businessData.state
        ? "intrastate"
        : "interstate"
      : "";

  const cgst = transactionType === "intrastate" ? gstAmount / 2 : 0;
  const sgst = transactionType === "intrastate" ? gstAmount / 2 : 0;
  const igst = transactionType === "interstate"  ? gstAmount     : 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.vendorName || !form.quantity || !form.unitPrice) return;

    const payload = {
      invoiceNumber:   form.invoiceNumber,
      purchaseDate:    form.purchaseDate,
      month:           getMonthFromDate(form.purchaseDate),
      financialYear:   getFinancialYear(form.purchaseDate),
      vendorName:      form.vendorName,
      vendorGstin:     form.vendorGSTIN || null,
      vendorState:     form.vendorState,
      itemDescription: form.itemDescription,
      hsnCode:         form.hsnCode,
      quantity,
      unitPrice,
      gstRate,
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalGST:        gstAmount,
      totalAmount,
      itcEligible:     form.itcEligible,
      itcClaimed,
      itcStatus:       form.itcEligible ? "unclaimed" : "ineligible",
      placeOfSupply:   form.vendorState,
      transactionType,
      paymentStatus:   form.paymentStatus,
      businessId:      businessData?._id,
    };
    onAdd(payload);
  };

  // ── Input class helper ────────────────────────────────────────────────────
  const inputCls = (border = "border-slate-200") =>
    `w-full border ${border} rounded-lg px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
          <h2 className="text-base sm:text-lg font-bold text-slate-800">Add New Purchase Bill</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-3 sm:space-y-4">

          {/* Vendor Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Vendor Name</label>
            <input
              name="vendorName"
              value={form.vendorName}
              onChange={handleChange}
              placeholder="XYZ Suppliers"
              className={inputCls("border-blue-400")}
            />
          </div>

          {/* Vendor GSTIN */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Vendor GSTIN</label>
            <input
              name="vendorGSTIN"
              value={form.vendorGSTIN}
              onChange={(e) => setForm({ ...form, vendorGSTIN: e.target.value.toUpperCase() })}
              placeholder="29ABCDE1234F1Z5"
              maxLength={15}
              className={inputCls()}
            />
          </div>

          {/* Invoice Number + Purchase Date */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Invoice Number</label>
              <input
                name="invoiceNumber"
                value={form.invoiceNumber}
                onChange={handleChange}
                placeholder="VINV-001"
                className={inputCls()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={form.purchaseDate}
                onChange={handleChange}
                className={inputCls()}
              />
            </div>
          </div>

          {/* Vendor State + Transaction Type badge */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Vendor State</label>
              <select
                name="vendorState"
                value={form.vendorState}
                onChange={handleChange}
                className={inputCls()}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end pb-1">
              {transactionType && (
                <div className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium border
                  ${transactionType === "intrastate"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"}`}
                >
                  <span>{transactionType === "intrastate" ? "🟢" : "🔵"}</span>
                  <span className="leading-tight">
                    {transactionType === "intrastate" ? "Intrastate — CGST + SGST" : "Interstate — IGST"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Item Description + HSN Code */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Item Description</label>
              <input
                name="itemDescription"
                value={form.itemDescription}
                onChange={handleChange}
                placeholder="Raw Wood Material"
                className={inputCls()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">HSN Code</label>
              <input
                name="hsnCode"
                value={form.hsnCode}
                onChange={handleChange}
                placeholder="4403"
                className={inputCls()}
              />
            </div>
          </div>

          {/* Quantity + Unit Price */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="20"
                min="1"
                className={inputCls()}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Unit Price (₹)</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="250"
                min="0"
                className={inputCls()}
              />
            </div>
          </div>

          {/* GST Rate */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">GST Rate (%)</label>
            <select
              name="gstRate"
              value={form.gstRate}
              onChange={handleChange}
              className={inputCls()}
            >
              <option value={0}>0%</option>
              <option value={3}>3%</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>

          {/* Live Calculation Preview */}
          {taxableAmount > 0 && (
            <div className="bg-slate-50 rounded-lg p-3 sm:p-4 space-y-2 text-sm border border-slate-100">
              <p className="font-medium text-slate-700 mb-2">Bill Summary</p>
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount</span>
                <span>₹{taxableAmount.toLocaleString("en-IN")}</span>
              </div>
              {transactionType === "intrastate" ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST ({gstRate / 2}%)</span>
                    <span>₹{cgst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST ({gstRate / 2}%)</span>
                    <span>₹{sgst.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : transactionType === "interstate" ? (
                <div className="flex justify-between text-slate-600">
                  <span>IGST ({gstRate}%)</span>
                  <span>₹{igst.toLocaleString("en-IN")}</span>
                </div>
              ) : (
                <div className="flex justify-between text-slate-500 italic">
                  <span>GST ({gstRate}%)</span>
                  <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 border-t pt-2 mt-1">
                <span>Total Amount</span>
                <span className="font-semibold text-slate-800">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className={`flex justify-between text-sm font-medium pt-1
                ${form.itcEligible ? "text-green-700" : "text-red-500"}`}
              >
                <span>ITC Claimable</span>
                <span>
                  {form.itcEligible
                    ? `₹${itcClaimed.toLocaleString("en-IN")}`
                    : "Not Eligible"}
                </span>
              </div>
            </div>
          )}

          {/* ITC Eligibility Toggle */}
          <div className="flex items-start justify-between border border-slate-200 rounded-lg px-3 sm:px-3.5 py-3">
            <div className="pr-4">
              <p className="text-sm font-medium text-slate-700">ITC Eligible</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Turn off for diesel, alcohol, or personal-use items
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, itcEligible: !form.itcEligible })}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 mt-0.5
                ${form.itcEligible ? "bg-blue-600" : "bg-slate-300"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
                ${form.itcEligible ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Status</label>
            <div className="flex gap-2 sm:gap-3">
              {["paid", "pending"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm({ ...form, paymentStatus: status })}
                  className={`flex-1 sm:flex-none px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium border transition-all capitalize
                    ${form.paymentStatus === status
                      ? status === "paid"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100">
          <button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Add Purchase
          </button>
          <button
            onClick={onClose}
            className="flex-1 sm:flex-none text-center text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-100 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}