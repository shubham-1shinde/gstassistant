import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ─── Data ────────────────────────────────────────────────────────────────────
const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

const ALL_DATA = {
  labels: MONTHS,
  sales:  [15200,16800,14500,17200,18900,16400,19200,17800,20000,18500,21200,20000],
  output: [2318, 2563, 2212, 2624, 2883, 2501, 2928, 2715, 3051, 2822, 3234, 3051],
  itc:    [1050, 1180,  980, 1240, 1380, 1100, 1430, 1290, 1525, 1380, 1620, 1525],
  net:    [1268, 1383, 1232, 1384, 1503, 1401, 1498, 1425, 1526, 1442, 1614, 1526],
};

const Q3_DATA = {
  labels: ["Oct", "Nov", "Dec"],
  sales:  [19200, 17800, 20000],
  output: [2928,  2715,  3051],
  itc:    [1430,  1290,  1525],
  net:    [1498,  1425,  1526],
};

const Q4_DATA = {
  labels: ["Jan", "Feb", "Mar"],
  sales:  [18500, 21200, 20000],
  output: [2822,  3234,  3051],
  itc:    [1380,  1620,  1525],
  net:    [1442,  1614,  1526],
};

const VIEWS = { all: ALL_DATA, q3: Q3_DATA, q4: Q4_DATA };

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

const last = (arr) => arr[arr.length - 1];

const itcRates = (d) =>
  d.itc.map((v, i) => parseFloat(((v / d.output[i]) * 100).toFixed(1)));

// ─── Metric Card ─────────────────────────────────────────────────────────────
const CARD_STYLES = {
  sales:  { accent: "bg-blue-500",   badge: "bg-blue-50 text-blue-700",   icon: "💼" },
  output: { accent: "bg-violet-500", badge: "bg-violet-50 text-violet-700", icon: "📤" },
  itc:    { accent: "bg-teal-500",   badge: "bg-teal-50 text-teal-700",   icon: "📥" },
  net:    { accent: "bg-orange-500", badge: "bg-orange-50 text-orange-700", icon: "💰" },
};

function MetricCard({ label, value, trend, trendUp, type, animVal }) {
  const s = CARD_STYLES[type];
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 group">
      {/* accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.accent} rounded-l-2xl`} />

      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{label}</p>
        <span className="text-base">{s.icon}</span>
      </div>

      <p className="text-2xl font-bold text-gray-800 font-mono tabular-nums">
        {fmt(animVal ?? value)}
      </p>

      <div className={`inline-flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>
        <span>{trendUp ? "▲" : "▼"}</span>
        <span>{trend}</span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GSTOverview() {
  const [view, setView] = useState("all");
  const data = VIEWS[view];

  // animated metric values on view change
  const [animSales,  setAnimSales]  = useState(last(data.sales));
  const [animOutput, setAnimOutput] = useState(last(data.output));
  const [animITC,    setAnimITC]    = useState(last(data.itc));
  const [animNet,    setAnimNet]    = useState(last(data.net));

  useEffect(() => {
    const targets = {
      sales: last(data.sales), output: last(data.output),
      itc: last(data.itc), net: last(data.net),
    };
    const setters = { sales: setAnimSales, output: setAnimOutput, itc: setAnimITC, net: setAnimNet };
    const duration = 500;
    const steps = 30;
    const interval = duration / steps;

    const timers = [];
    Object.keys(targets).forEach((key) => {
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        setters[key](Math.round(targets[key] * eased));
        if (step >= steps) { clearInterval(timer); setters[key](targets[key]); }
      }, interval);
      timers.push(timer);
    });
    return () => timers.forEach(clearInterval);
  }, [view]);

  // ── Chart configs ──────────────────────────────────────────────────────────
  const mainChartData = {
    labels: data.labels,
    datasets: [
      {
        type: "bar",
        label: "Total Sales",
        data: data.sales,
        backgroundColor: "rgba(59,130,246,0.15)",
        borderColor: "#3b82f6",
        borderWidth: 1.5,
        borderRadius: 5,
        borderSkipped: false,
        order: 2,
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "Output GST",
        data: data.output,
        backgroundColor: "rgba(139,92,246,0.7)",
        borderColor: "#8b5cf6",
        borderWidth: 0,
        borderRadius: 5,
        borderSkipped: false,
        order: 1,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Input ITC",
        data: data.itc,
        borderColor: "#14b8a6",
        backgroundColor: "rgba(20,184,166,0.07)",
        pointBackgroundColor: "#14b8a6",
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        tension: 0.45,
        fill: false,
        order: 0,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Net Payable",
        data: data.net,
        borderColor: "#f97316",
        backgroundColor: "transparent",
        pointBackgroundColor: "#f97316",
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2,
        borderDash: [5, 4],
        tension: 0.45,
        fill: false,
        order: 0,
        yAxisID: "y",
      },
    ],
  };

  const mainOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1f2937",
        bodyColor: "#6b7280",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${fmt(ctx.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { font: { size: 11 }, color: "#9ca3af" },
      },
      y: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: {
          font: { size: 11 },
          color: "#9ca3af",
          callback: (v) => "₹" + v.toLocaleString("en-IN"),
        },
      },
    },
  };

  // Donut
  const latestOutput = last(data.output);
  const latestITC    = last(data.itc);
  const latestNet    = last(data.net);

  const donutData = {
    labels: ["Output GST", "Input ITC", "Net Payable"],
    datasets: [{
      data: [latestOutput, latestITC, latestNet],
      backgroundColor: ["#8b5cf6", "#14b8a6", "#f97316"],
      borderWidth: 0,
      hoverOffset: 8,
    }],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1f2937",
        bodyColor: "#6b7280",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => {
            const tot = latestOutput + latestITC + latestNet;
            return ` ${ctx.label}: ${fmt(ctx.parsed)} (${((ctx.parsed / tot) * 100).toFixed(1)}%)`;
          },
        },
      },
    },
  };

  // ITC Utilization
  const itcLineData = {
    labels: data.labels,
    datasets: [{
      label: "ITC Utilization %",
      data: itcRates(data),
      borderColor: "#14b8a6",
      backgroundColor: "rgba(20,184,166,0.12)",
      fill: true,
      tension: 0.45,
      pointRadius: 4,
      pointBackgroundColor: "#14b8a6",
      borderWidth: 2,
    }],
  };

  const itcOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#1f2937",
        bodyColor: "#6b7280",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        callbacks: { label: (c) => ` ${c.parsed.y}%` },
      },
    },
    scales: {
      x: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 10 }, color: "#9ca3af" } },
      y: {
        grid: { color: "rgba(0,0,0,0.04)" },
        ticks: { font: { size: 10 }, color: "#9ca3af", callback: (v) => v + "%" },
        min: 30, max: 70,
      },
    },
  };

  const totalGST = latestOutput + latestITC + latestNet;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Monthly GST Overview</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              FY 2025–26 &nbsp;·&nbsp; Shubham Private Limited &nbsp;·&nbsp;
              <span className="font-mono">27ABCDE1234F2Z5</span>
            </p>
          </div>

          {/* View tabs */}
          <div className="flex gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm self-start">
            {["all", "q3", "q4"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  view === v
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {v === "all" ? "All Months" : v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Sales"    value={last(data.sales)}  animVal={animSales}  trend="12.4% vs last" trendUp type="sales" />
          <MetricCard label="Output GST"     value={last(data.output)} animVal={animOutput} trend="8.2% vs last"  trendUp type="output" />
          <MetricCard label="Input ITC"      value={last(data.itc)}    animVal={animITC}    trend="3.1% vs last"  trendUp={false} type="itc" />
          <MetricCard label="Net GST Payable" value={last(data.net)}   animVal={animNet}    trend="5.7% vs last"  trendUp type="net" />
        </div>

        {/* ── Main combo chart ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-700">Sales & GST Trend</h2>
              <p className="text-xs text-gray-400">Monthly breakdown — hover for details</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { color: "bg-blue-400",   label: "Total Sales" },
                { color: "bg-violet-500", label: "Output GST" },
                { color: "bg-teal-400",   label: "Input ITC" },
                { color: "bg-orange-400", label: "Net Payable" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="h-64">
            <Bar data={mainChartData} options={mainOptions} />
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Donut */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700">GST Composition</h2>
              <p className="text-xs text-gray-400">Latest period breakdown</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative h-40 w-40 flex-shrink-0">
                <Doughnut data={donutData} options={donutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-sm font-bold text-gray-700 font-mono">{fmt(totalGST)}</p>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                {[
                  { color: "bg-violet-500", label: "Output GST", val: latestOutput, pct: ((latestOutput/totalGST)*100).toFixed(1) },
                  { color: "bg-teal-400",   label: "Input ITC",  val: latestITC,    pct: ((latestITC/totalGST)*100).toFixed(1) },
                  { color: "bg-orange-400", label: "Net Payable", val: latestNet,   pct: ((latestNet/totalGST)*100).toFixed(1) },
                ].map(({ color, label, val, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${color}`} />
                        {label}
                      </span>
                      <span className="font-semibold text-gray-700">{fmt(val)}</span>
                    </div>
                    <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${color} transition-all duration-700`}
                        style={{ width: pct + "%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ITC Utilization */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-gray-700">ITC Utilization Rate</h2>
                <p className="text-xs text-gray-400">Input ITC as % of Output GST</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-teal-500 font-mono">
                  {itcRates(data)[itcRates(data).length - 1]}%
                </p>
                <p className="text-xs text-gray-400">Latest</p>
              </div>
            </div>
            <div className="h-40">
              <Line data={itcLineData} options={itcOptions} />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <p className="text-center text-xs text-gray-300 pb-2">
          © 2026 GST Assistant · All rights reserved
        </p>
      </div>
    </div>
  );
}