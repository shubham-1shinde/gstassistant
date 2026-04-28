import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { CheckCircle, AlertCircle, Clock, Calendar } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 

function ComplianceCalendar() {
  //const { business } = useSelector((state) => state.auth);
  const business = useSelector((state) => state.business.businessData);
  const navigate = useNavigate();

  const [filings, setFilings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompliance = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/v1/complience/getcomplience/${business._id}`
        );
        //console.log("Compliance calendar fetched successfully:", res.data.data);

        setFilings(res.data.data);
      } catch (error) {
        console.error("Error fetching compliance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompliance();
  }, [business, navigate]);

 
  const today = new Date();

  const completed = filings.filter((f) => f.status === "completed").length;
  const pending = filings.filter((f) => f.status === "pending").length;
  const upcoming = filings.filter((f) => f.status === "upcoming").length;


  const getDaysLeft = (date) => {
    const diff = Math.ceil(
      (new Date(date) - today) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("en-IN", { month: "short" });
    return `${day} ${month}`;
  };

  const StatusIcon = ({ status }) => {
    if (status === "completed") {
      return <CheckCircle size={20} className="text-green-500 shrink-0" />;
    }

    if (status === "pending") {
      return <AlertCircle size={20} className="text-orange-400 shrink-0" />;
    }

    return <Clock size={20} className="text-blue-400 shrink-0" />;
  };


  const grouped = useMemo(() => {
    return filings.reduce((acc, f) => {
      if (!acc[f.month]) acc[f.month] = [];
      acc[f.month].push(f);
      return acc;
    }, {});
  }, [filings]);

  
  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading compliance calendar...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Compliance Calendar</h1>
        <p className="text-gray-500">
          Important GST filing dates and deadlines
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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

      {/* Monthly Groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([month, items]) => (
          <div key={month} className="bg-white rounded-xl border overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b bg-gray-50">
              <Calendar size={16} className="text-blue-500" />
              <h3 className="font-semibold text-gray-700">{month}</h3>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {items.map((item, index) => {
                const daysLeft = getDaysLeft(item.date);

                return (
                  <div
                    key={item._id || index}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
                  >
                    {/* Left */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        <StatusIcon status={item.status} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        {formatDate(item.date)}
                      </p>

                      {item.status === "upcoming" && daysLeft > 0 && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {daysLeft} days left
                        </p>
                      )}

                      {item.status === "pending" && (
                        <p className="text-xs text-orange-400 mt-0.5 font-medium">
                          {daysLeft === 0
                            ? "Due today"
                            : daysLeft < 0
                            ? `${Math.abs(daysLeft)} days overdue`
                            : `${daysLeft} days left`}
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

        {filings.length === 0 && (
          <div className="bg-white p-8 rounded-xl border text-center text-gray-500">
            No compliance data found.
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplianceCalendar;