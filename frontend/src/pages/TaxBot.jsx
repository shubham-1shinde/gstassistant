import { useState, useRef, useEffect } from "react";

const SUGGESTED_QUESTIONS = [
  "What is my GST liability for this month?",
  "How do I claim Input Tax Credit?",
  "When is my GSTR-3B due date?",
  "Explain reverse charge mechanism",
  "What are the GST rates for IT services?",
  "How to file GSTR-1 online?",
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    text: "Namaste, Shubham! 👋 I'm your **GST Tax Bot** — your personal compliance assistant.\n\nI can help you with:\n- GST calculations & filings\n- ITC claims & reconciliation\n- Compliance deadlines & penalties\n- Invoice & billing queries\n\nWhat would you like to know today?",
    time: "09:00 AM",
  },
];

function Avatar({ role }) {
  if (role === "bot") {
    return (
      <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-white text-sm font-bold">TB</span>
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center flex-shrink-0">
      <span className="text-blue-700 text-sm font-bold">SS</span>
    </div>
  );
}

function MessageBubble({ msg }) {
  const isBot = msg.role === "bot";

  const renderText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <p key={i} className={`${line.startsWith("-") ? "flex gap-2" : ""} ${i > 0 ? "mt-1" : ""}`}>
          {line.startsWith("-") && <span className="text-blue-400 mt-0.5">▸</span>}
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="font-semibold">
                {part}
              </strong>
            ) : (
              <span key={j}>{line.startsWith("-") && j === 0 ? part.slice(1).trim() : part}</span>
            )
          )}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isBot ? "justify-start" : "justify-end flex-row-reverse"} items-end`}>
      <Avatar role={msg.role} />
      <div className={`max-w-[72%] ${isBot ? "" : "items-end flex flex-col"}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isBot
              ? "bg-white border border-gray-100 text-gray-700 rounded-bl-sm"
              : "bg-blue-700 text-white rounded-br-sm"
          }`}
        >
          {renderText(msg.text)}
        </div>
        <span className="text-xs text-gray-400 mt-1 px-1">{msg.time}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center flex-shrink-0 shadow-md">
        <span className="text-white text-sm font-bold">TB</span>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const BOT_RESPONSES = {
  default: "I'm processing your query about GST compliance. Based on the latest GST regulations, let me provide you with accurate information...\n\nFor more specific answers, please ensure you've provided your GSTIN and relevant billing period.",
  itc: "**Input Tax Credit (ITC)** can be claimed when:\n- You have a valid tax invoice\n- Goods/services are used for business\n- Supplier has filed GSTR-1\n- You've filed GSTR-3B\n\nYour current available ITC is **₹1,525** for FY 2025-26.",
  gstr: "**GSTR-3B Due Dates (FY 2025-26):**\n- Turnover > ₹5 Cr: 20th of next month\n- Turnover ≤ ₹5 Cr (Cat I): 22nd\n- Turnover ≤ ₹5 Cr (Cat II): 24th\n\nYour next filing deadline is **20th April 2026**.",
  liability: "Based on your current data:\n- **Total Sales:** ₹20,000\n- **Output GST:** ₹3,051\n- **Input ITC:** ₹1,525\n- **Net GST Payable:** ₹1,526\n\nYour liability has increased **5.7%** vs last period.",
  rate: "**GST Rates for IT Services:**\n- Software development: **18%**\n- IT consulting: **18%**\n- BPO services: **18%**\n- Hardware (computers): **18%**\n- Mobile phones: **12%**",
};

function getResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes("itc") || lower.includes("input tax")) return BOT_RESPONSES.itc;
  if (lower.includes("gstr") || lower.includes("due date") || lower.includes("filing")) return BOT_RESPONSES.gstr;
  if (lower.includes("liability") || lower.includes("payable") || lower.includes("month")) return BOT_RESPONSES.liability;
  if (lower.includes("rate") || lower.includes("it service") || lower.includes("percent")) return BOT_RESPONSES.rate;
  return BOT_RESPONSES.default;
}

export default function TaxBot() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTopics] = useState(["GST Filing", "ITC Claims", "Invoicing"]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const userMsg = { id: Date.now(), role: "user", text: text.trim(), time: now };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botText = getResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: botText,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="flex flex-1 gap-5 p-6 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-gradient-to-r from-blue-700 to-blue-800">
              <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center shadow-md">
                <span className="text-2xl">🤖</span>
              </div>
              <div>
                <h3 className="text-white font-semibold text-base">GST Tax Bot</h3>
                <p className="text-blue-200 text-xs">Powered by AI • Expert in Indian GST</p>
              </div>
              <div className="ml-auto flex gap-2">
                {activeTopics.map((t) => (
                  <span key={t} className="bg-white/15 text-white text-xs px-2.5 py-1 rounded-full border border-white/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-gray-50/50">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            <div className="px-6 py-3 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Quick Questions</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="px-5 py-4 bg-white border-t border-gray-100">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <span className="text-gray-400 text-lg">💬</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                  placeholder="Ask about GST, ITC, filing deadlines..."
                  className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <span>Send</span>
                  <span className="text-xs">↑</span>
                </button>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">
                Tax Bot can make mistakes. Verify important tax decisions with a CA.
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-72 flex flex-col gap-4 overflow-y-auto">
            {/* GST Snapshot */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>📊</span> Your GST Snapshot
              </h4>
              <div className="space-y-3">
                {[
                  { label: "Total Sales", value: "₹20,000", color: "text-blue-700", bg: "bg-blue-50", change: "+12.4%", up: true },
                  { label: "Output GST", value: "₹3,051", color: "text-purple-700", bg: "bg-purple-50", change: "+8.2%", up: true },
                  { label: "Input ITC", value: "₹1,525", color: "text-green-700", bg: "bg-green-50", change: "-3.1%", up: false },
                  { label: "Net Payable", value: "₹1,526", color: "text-orange-700", bg: "bg-orange-50", change: "+5.7%", up: true },
                ].map((item) => (
                  <div key={item.label} className={`${item.bg} rounded-xl px-3 py-2.5 flex items-center justify-between`}>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                    </div>
                    <span className={`text-xs font-medium ${item.up ? "text-green-600" : "text-red-500"}`}>
                      {item.up ? "▲" : "▼"} {item.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Deadlines */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>📅</span> Upcoming Deadlines
              </h4>
              <div className="space-y-3">
                {[
                  { form: "GSTR-1", date: "11 Apr 2026", days: 26, status: "Pending" },
                  { form: "GSTR-3B", date: "20 Apr 2026", days: 35, status: "Pending" },
                  { form: "GSTR-9", date: "31 Dec 2026", days: 290, status: "Annual" },
                ].map((d) => (
                  <div key={d.form} className="flex items-center justify-between border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{d.form}</p>
                      <p className="text-xs text-gray-400">{d.date}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          d.days < 30
                            ? "bg-red-50 text-red-600"
                            : d.days < 60
                            ? "bg-yellow-50 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {d.days}d left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <span>⚡</span> Quick Actions
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: "🧾", label: "Add Invoice" },
                  { icon: "📥", label: "Add Bill" },
                  { icon: "📤", label: "File GSTR-1" },
                  { icon: "📑", label: "File GSTR-3B" },
                ].map((a) => (
                  <button
                    key={a.label}
                    className="flex flex-col items-center gap-1.5 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-gray-100 rounded-xl py-3 px-2 transition-all group"
                  >
                    <span className="text-xl">{a.icon}</span>
                    <span className="text-xs text-gray-600 group-hover:text-blue-700 font-medium text-center leading-tight">
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}