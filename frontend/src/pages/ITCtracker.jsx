import React from "react";
import { PiggyBank, TrendingUp, AlertCircle } from "lucide-react";

function ITCTracker({ purchases = [] }) {
  const totalITC = purchases.reduce((sum, p) => sum + (Number(p.gstPaid) || 0), 0);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">ITC Tracker</h1>
        <p className="text-gray-500">Monitor your Input Tax Credit</p>
      </div>

      {/* Total ITC Card */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <p className="text-sm text-gray-500 mb-2">Total Input Tax Credit Available</p>
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <PiggyBank size={28} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              ₹{totalITC.toLocaleString("en-IN")}
            </h2>
            <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
              <TrendingUp size={14} />
              Available for offsetting output GST
            </p>
          </div>
        </div>
      </div>

      {/* ITC Details by Purchase */}
      <div className="bg-white rounded-xl border overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h3 className="text-base font-semibold text-gray-700">ITC Details by Purchase</h3>
        </div>

        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
            <AlertCircle size={36} className="text-gray-300" />
            <p className="text-sm">No purchase data available. Add purchases to track ITC.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                <tr>
                  <th className="px-6 py-3 text-left">Vendor</th>
                  <th className="px-6 py-3 text-left">GSTIN</th>
                  <th className="px-6 py-3 text-left">Invoice No.</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Taxable (₹)</th>
                  <th className="px-6 py-3 text-right">ITC (GST Paid) (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {purchases.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{bill.vendorName}</td>
                    <td className="px-6 py-4 text-gray-500 font-mono text-xs">{bill.vendorGSTIN}</td>
                    <td className="px-6 py-4 text-gray-600">{bill.invoiceNumber}</td>
                    <td className="px-6 py-4 text-gray-500">{bill.purchaseDate}</td>
                    <td className="px-6 py-4 text-right text-gray-700">
                      ₹{Number(bill.taxableValue).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-right text-green-600 font-semibold">
                      ₹{Number(bill.gstPaid).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              {/* Total Row */}
              <tfoot className="bg-green-50">
                <tr>
                  <td colSpan={5} className="px-6 py-3 text-sm font-semibold text-gray-700">
                    Total ITC Available
                  </td>
                  <td className="px-6 py-3 text-right text-green-700 font-bold text-sm">
                    ₹{totalITC.toLocaleString("en-IN")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* What is ITC Info Card */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-base font-semibold text-blue-600 mb-2">
          What is Input Tax Credit (ITC)?
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Input Tax Credit means the GST you paid on purchases can be used to reduce
          the GST you owe on sales. This helps avoid double taxation and reduces your
          overall tax liability. For example, if you paid ₹1,800 GST on purchases and
          collected ₹3,600 GST on sales, you only need to pay ₹1,800 to the government.
        </p>
      </div>

    </div>
  );
}

export default ITCTracker;