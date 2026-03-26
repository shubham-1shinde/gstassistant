import React from "react";
import { CheckCircle, AlertCircle, Clock, Calendar } from "lucide-react";

const today = new Date("2024-01-20");

const filings = [
  // January 2024
  { id: 1, month: "January 2024", title: "GSTR-1 Filing", desc: "File sales return for December", date: new Date("2024-01-11"), status: "completed" },
  { id: 2, month: "January 2024", title: "GSTR-3B Filing", desc: "Monthly summary return", date: new Date("2024-01-13"), status: "completed" },
  { id: 3, month: "January 2024", title: "GSTR-1 Filing", desc: "Quarterly return (Oct-Dec)", date: new Date("2024-01-20"), status: "pending" },

  // February 2024
  { id: 4, month: "February 2024", title: "GSTR-1 Filing", desc: "File sales return for January", date: new Date("2024-02-11"), status: "upcoming" },
  { id: 5, month: "February 2024", title: "GSTR-3B Filing", desc: "Monthly summary return", date: new Date("2024-02-13"), status: "upcoming" },
  { id: 6, month: "February 2024", title: "Annual Return Preparation", desc: "Start preparing GSTR-9", date: new Date("2024-02-28"), status: "upcoming" },

  // March 2024
  { id: 7, month: "March 2024", title: "GSTR-1 Filing", desc: "File sales return for February", date: new Date("2024-03-11"), status: "upcoming" },
  { id: 8, month: "March 2024", title: "GSTR-3B Filing", desc: "Monthly summary return", date: new Date("2024-03-13"), status: "upcoming" },
  { id: 9, month: "March 2024", title: "Financial Year End", desc: "Close FY 2023-24 books", date: new Date("2024-03-31"), status: "upcoming" },
];

const completed = filings.filter((f) => f.status === "completed").length;
const pending = filings.filter((f) => f.status === "pending").length;
const upcoming = filings.filter((f) => f.status === "upcoming").length;

const getDaysLeft = (date) => {
  const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("en-IN", { month: "short" });
  return `${day} ${month}`;
};

const StatusIcon = ({ status }) => {
  if (status === "completed")
    return <CheckCircle size={20} className="text-green-500 shrink-0" />;
  if (status === "pending")
    return <AlertCircle size={20} className="text-orange-400 shrink-0" />;
  return <Clock size={20} className="text-blue-400 shrink-0" />;
};

// Group by month
const grouped = filings.reduce((acc, f) => {
  if (!acc[f.month]) acc[f.month] = [];
  acc[f.month].push(f);
  return acc;
}, {});

function ComplianceCalendar() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Compliance Calendar</h1>
        <p className="text-gray-500">Important GST filing dates and deadlines</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">

        {/* Completed */}
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <CheckCircle size={22} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-3xl font-bold text-gray-800">{completed}</p>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-orange-100 p-2.5 rounded-lg">
            <AlertCircle size={22} className="text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-3xl font-bold text-gray-800">{pending}</p>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <Clock size={22} className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Upcoming</p>
            <p className="text-3xl font-bold text-gray-800">{upcoming}</p>
          </div>
        </div>

      </div>

      {/* Monthly Filing Groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month} className="bg-white rounded-xl border overflow-hidden">

            {/* Month Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50">
              <Calendar size={16} className="text-blue-500" />
              <h3 className="font-semibold text-gray-700">{month}</h3>
            </div>

            {/* Filing Rows */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => {
                const daysLeft = getDaysLeft(item.date);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Left: icon + text */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <StatusIcon status={item.status} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                      </div>
                    </div>

                    {/* Right: date + days left */}
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-medium text-gray-600">{formatDate(item.date)}</p>
                      {item.status === "upcoming" && daysLeft > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">{daysLeft} days left</p>
                      )}
                      {item.status === "pending" && (
                        <p className="text-xs text-orange-400 mt-0.5 font-medium">
                          {daysLeft === 0 ? "Due today" : daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </p>
                      )}
                      {item.status === "completed" && (
                        <p className="text-xs text-green-500 mt-0.5">Done</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default ComplianceCalendar;