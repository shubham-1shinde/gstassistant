import React from "react";
import { TrendingUp, TrendingDown, DollarSign, FileText } from "lucide-react";

function GSTSummary({ invoices = [], purchases = [] }) {

  // --- Calculations ---
  const totalTaxableSales = invoices.reduce((sum, inv) => sum + (Number(inv.taxableValue) || 0), 0);
  const totalTaxablePurchases = purchases.reduce((sum, p) => sum + (Number(p.taxableValue) || 0), 0);

  const totalOutputGST = invoices.reduce((sum, inv) => {
    const rate = parseFloat(inv.gstRate) / 100 || 0;
    return sum + (Number(inv.taxableValue) || 0) * rate;
  }, 0);

  const totalInputGST = purchases.reduce((sum, p) => sum + (Number(p.gstPaid) || 0), 0);

  const netGSTPayable = totalOutputGST - totalInputGST;

  const cgst = totalOutputGST / 2;
  const sgst = totalOutputGST / 2;
  const igst = 0;

  const fmt = (val) =>
    `₹${Math.abs(val).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">GST Summary</h1>
        <p className="text-gray-500">Comprehensive overview of your GST position</p>
      </div>

      {/* Net GST Payable Banner */}
      <div className="bg-white rounded-xl border p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Net GST Payable</p>
          <h2 className="text-4xl font-bold text-gray-800">{fmt(netGSTPayable)}</h2>
          <p className="text-sm text-gray-400 mt-1">
            {netGSTPayable === 0
              ? "No GST liability or refund due"
              : netGSTPayable > 0
              ? "GST payable to government"
              : "Refund due from government"}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl">
          <DollarSign size={32} className="text-green-600" />
        </div>
      </div>

      {/* Output GST + Input GST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Output GST (Sales) */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-green-500" />
            <h3 className="font-semibold text-gray-700">Output GST (Sales)</h3>
          </div>
          <p className="text-sm text-gray-400">Total Output GST</p>
          <p className="text-3xl font-bold text-gray-800 mb-5">{fmt(totalOutputGST)}</p>
          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>CGST</span>
              <span className="font-medium">{fmt(cgst)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>SGST</span>
              <span className="font-medium">{fmt(sgst)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>IGST</span>
              <span className="font-medium">{fmt(igst)}</span>
            </div>
          </div>
        </div>

        {/* Input GST (Purchases) */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={16} className="text-blue-500" />
            <h3 className="font-semibold text-gray-700">Input GST (Purchases)</h3>
          </div>
          <p className="text-sm text-gray-400">Total Input Tax Credit</p>
          <p className="text-3xl font-bold text-gray-800 mb-4">{fmt(totalInputGST)}</p>
          <p className="text-sm text-gray-400">
            This amount can be used to offset output GST liability
          </p>
        </div>
      </div>

      {/* Total Sales + Total Purchases */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Total Sales */}
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-gray-500 mb-2">Total Sales (Taxable Value)</p>
          <p className="text-3xl font-bold text-gray-800">{fmt(totalTaxableSales)}</p>
        </div>

        {/* Total Purchases */}
        <div className="bg-white rounded-xl border p-6">
          <p className="text-sm text-gray-500 mb-2">Total Purchases (Taxable Value)</p>
          <p className="text-3xl font-bold text-gray-800">{fmt(totalTaxablePurchases)}</p>
        </div>
      </div>

      {/* GST Calculation Breakdown */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-700">GST Calculation</h3>
        </div>

        <div className="space-y-3">
          {/* Output GST row */}
          <div className="flex justify-between text-sm text-gray-600 pb-3 border-b">
            <span>Output GST (From Sales)</span>
            <span className="font-medium">{fmt(totalOutputGST)}</span>
          </div>

          {/* Input GST row */}
          <div className="flex justify-between text-sm text-gray-600 pb-3 border-b">
            <span className="text-blue-500">- Input GST (From Purchases)</span>
            <span className="font-medium text-blue-500">- {fmt(totalInputGST)}</span>
          </div>

          {/* Net GST Payable */}
          <div className="flex justify-between text-sm font-bold text-gray-800 pt-1">
            <span>Net GST Payable</span>
            <span className={netGSTPayable >= 0 ? "text-gray-800" : "text-green-600"}>
              {netGSTPayable < 0 ? "-" : ""}{fmt(netGSTPayable)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

export default GSTSummary;