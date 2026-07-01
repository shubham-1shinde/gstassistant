import { useState, useEffect } from "react";
import { Search, Mail, Phone, Building2, Shield, MoreVertical, UserCheck, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-rose-500", "bg-orange-500", "bg-teal-500",
];

function ListAccountants() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);
  const [accountants, setAccountants] = useState([]);

  const fetchAccountants = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/v1/accountant/get`
      );
      //console.log("Fetched accountants:", response.data);

      setAccountants(response.data.data || []);
    } catch (error) {
      console.error("Error fetching accountants:", error);
      setError("Failed to fetch accountants");
    }
  };

  useEffect(() => {
    fetchAccountants();
  }, []);

  const filtered = accountants.filter((a) => {
    const matchSearch =
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.firmName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = (id) => {
    setAccountants((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a
      )
    );
    setOpenMenu(null);
  };

  const totalActive = accountants.filter((a) => a.status === "active").length;
  const totalInactive = accountants.filter((a) => a.status === "inactive").length;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Accountants</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all registered accountants</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-blue-100 p-2.5 rounded-lg">
            <Shield size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-gray-800">{accountants.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-green-100 p-2.5 rounded-lg">
            <UserCheck size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Active</p>
            <p className="text-2xl font-bold text-gray-800">{totalActive}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5 flex items-center gap-4">
          <div className="bg-red-100 p-2.5 rounded-lg">
            <UserX size={20} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Inactive</p>
            <p className="text-2xl font-bold text-gray-800">{totalInactive}</p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or firm..."
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-white border border-gray-200 rounded-lg p-1 gap-1">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition ${
                filter === f
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-16 text-center text-gray-400">
          <Shield size={36} className="mx-auto mb-3 text-gray-300" />
          <p className="text-sm">No accountants found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((acc, idx) => (
            <div
              key={acc.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              {/* Card Top */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between">

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-3">
                    <div className={`${avatarColors[idx % avatarColors.length]} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                      {getInitials(acc.fullName)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{acc.fullName}</p>
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                        acc.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-500"
                      }`}>
                        {acc.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* 3-dot Menu 
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === acc.id ? null : acc.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openMenu === acc.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                        <button
                          onClick={() => toggleStatus(acc.id)}
                          className={`flex items-center gap-2 w-full px-4 py-2.5 text-sm transition hover:bg-gray-50 ${
                            acc.status === "active" ? "text-red-500" : "text-green-600"
                          }`}
                        >
                          {acc.status === "active"
                            ? <><UserX size={14} /> Deactivate</>
                            : <><UserCheck size={14} /> Activate</>
                          }
                        </button>
                      </div>
                    )}
                  </div>*/}
                </div>

                {/* Firm */}
                <div className="flex items-center gap-2 mt-4">
                  <Building2 size={14} className="text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-500 truncate">{acc.firmName}</p>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 mt-2">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-500 truncate">{acc.email}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-2 mt-2">
                  <Phone size={14} className="text-gray-400 shrink-0" />
                  <p className="text-xs text-gray-500">{acc.phone}</p>
                </div>
              </div>

              {/* Card Footer 
              <div className="border-t border-gray-100 px-5 py-3 bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Joined</p>
                  <p className="text-xs font-semibold text-gray-600">{acc.joined}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Clients</p>
                  <p className="text-xs font-semibold text-blue-600">{acc.clients}</p>
                </div>
              </div>*/}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default ListAccountants;