import { useState, useEffect } from "react";
import { X } from "lucide-react";
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

// ── Component ─────────────────────────────────────────────────────────────────
function CreateInvoice({ isOpen, onClose, onAdd }) {

  const businessData = useSelector((state) => state.business);
  const businessState = businessData?.businessData?.state;

  const [form, setForm] = useState({
    invoiceNumber:   "",
    invoiceDate:     "",
    gstRate:         18,
    customerName:    "",
    customerGstin:   "",
    customerState:   "",
    itemDescription: "",
    hsnCode:         "",
    quantity:        "",
    unitPrice:       "",
    paymentStatus:   "pending",
  });

  const quantity      = parseFloat(form.quantity)  || 0;
  const unitPrice     = parseFloat(form.unitPrice) || 0;
  const gstRate       = parseFloat(form.gstRate)   || 0;
  const taxableAmount = quantity * unitPrice;
  const gstAmount     = (taxableAmount * gstRate) / 100;
  const totalAmount   = taxableAmount + gstAmount;
  const transactionType =
    form.customerState && businessState
      ? form.customerState === businessState
        ? "intrastate"
        : "interstate"
      : "";
  const cgst = transactionType === "intrastate" ? gstAmount / 2 : 0;
  const sgst = transactionType === "intrastate" ? gstAmount / 2 : 0;
  const igst = transactionType === "interstate"  ? gstAmount     : 0;

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.invoiceNumber || !form.customerName || !form.quantity || !form.unitPrice) return;

    const payload = {
      invoiceNumber:   form.invoiceNumber,
      invoiceDate:     form.invoiceDate,
      month:           getMonthFromDate(form.invoiceDate),
      financialYear:   getFinancialYear(form.invoiceDate),
      customerName:    form.customerName,
      customerGstin:   form.customerGstin || null,
      customerState:   form.customerState,
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
      placeOfSupply:   form.customerState,
      transactionType,
      paymentStatus:   form.paymentStatus,
      businessId:      businessData?._id,
    };

    onAdd(payload);

    setForm({
      invoiceNumber:   "",
      invoiceDate:     "",
      gstRate:         18,
      customerName:    "",
      customerGstin:   "",
      customerState:   "",
      itemDescription: "",
      hsnCode:         "",
      quantity:        "",
      unitPrice:       "",
      paymentStatus:   "pending",
    });
    //console.log("Created invoice with payload:", payload);
  };

  const INDIAN_STATES = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi",
    "Jammu & Kashmir","Ladakh","Puducherry","Chandigarh",
  ];

  // ── Shared input class ────────────────────────────────────────────────────
  const inputCls = "w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white w-full sm:w-[600px] rounded-xl shadow-xl p-4 sm:p-6 relative max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-4 sm:top-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Create New Invoice</h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

          {/* Row 1: Invoice Number + Date */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-sm text-gray-600">Invoice Number</label>
              <input
                type="text"
                name="invoiceNumber"
                value={form.invoiceNumber}
                onChange={handleChange}
                placeholder="INV-001"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Invoice Date</label>
              <input
                type="date"
                name="invoiceDate"
                value={form.invoiceDate}
                onChange={handleChange}
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 2: Customer Name + GSTIN */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-sm text-gray-600">Customer Name</label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="Raj Enterprises"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">
                Customer GSTIN{" "}
                <span className="text-gray-400 text-xs">(optional for B2C)</span>
              </label>
              <input
                type="text"
                name="customerGstin"
                value={form.customerGstin}
                onChange={(e) =>
                  setForm({ ...form, customerGstin: e.target.value.toUpperCase() })
                }
                placeholder="27AABCR1234A1Z5"
                maxLength={15}
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 3: Customer State + Transaction badge */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-sm text-gray-600">Customer State</label>
              <select
                name="customerState"
                value={form.customerState}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col justify-end pb-1">
              {transactionType && (
                <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium border
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

          {/* Row 4: Item Description + HSN Code */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-sm text-gray-600">Item Description</label>
              <input
                type="text"
                name="itemDescription"
                value={form.itemDescription}
                onChange={handleChange}
                placeholder="Office Furniture"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">HSN Code</label>
              <input
                type="text"
                name="hsnCode"
                value={form.hsnCode}
                onChange={handleChange}
                placeholder="9403"
                className={inputCls}
              />
            </div>
          </div>

          {/* Row 5: Quantity + Unit Price + GST Rate */}
          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="text-sm text-gray-600">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="10"
                min="1"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Unit Price (₹)</label>
              <input
                type="number"
                name="unitPrice"
                value={form.unitPrice}
                onChange={handleChange}
                placeholder="800"
                min="0"
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">GST Rate (%)</label>
              <select
                name="gstRate"
                value={form.gstRate}
                onChange={handleChange}
                className={inputCls}
              >
                <option value={0}>0%</option>
                <option value={3}>3%</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
            </div>
          </div>

          {/* Live Calculation Preview */}
          {taxableAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2 text-sm border">
              <p className="font-medium text-gray-700 mb-2">Invoice Summary</p>
              <div className="flex justify-between text-gray-600">
                <span>Taxable Amount</span>
                <span>₹{taxableAmount.toLocaleString("en-IN")}</span>
              </div>
              {transactionType === "intrastate" ? (
                <>
                  <div className="flex justify-between text-gray-600">
                    <span>CGST ({gstRate / 2}%)</span>
                    <span>₹{cgst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>SGST ({gstRate / 2}%)</span>
                    <span>₹{sgst.toLocaleString("en-IN")}</span>
                  </div>
                </>
              ) : transactionType === "interstate" ? (
                <div className="flex justify-between text-gray-600">
                  <span>IGST ({gstRate}%)</span>
                  <span>₹{igst.toLocaleString("en-IN")}</span>
                </div>
              ) : (
                <div className="flex justify-between text-gray-500 italic">
                  <span>GST ({gstRate}%)</span>
                  <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-800 border-t pt-2 mt-1">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          )}

          {/* Row 6: Payment Status */}
          <div>
            <label className="text-sm text-gray-600">Payment Status</label>
            <div className="flex gap-2 sm:gap-3 mt-2">
              {["paid", "pending"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm({ ...form, paymentStatus: status })}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium border transition-colors capitalize
                    ${form.paymentStatus === status
                      ? status === "paid"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Create Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none border px-5 py-2 rounded-lg hover:bg-gray-100 text-sm"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateInvoice;