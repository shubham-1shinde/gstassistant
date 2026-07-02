import { useState, useRef, useEffect, useLayoutEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";

const now = new Date();
const time = now.toLocaleTimeString("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const SUGGESTED_QUESTIONS = [
  "What are the GST rates for IT services?",
  "How do I claim Input Tax Credit?",
  "How to file GSTR-1 online?",
  "Explain reverse charge mechanism?",
  "What is GSTR-3B and how is it different from GSTR-1?",
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "bot",
    text: `Namaste! 👋 I'm your **GST Tax Bot** — your personal compliance assistant.\n\nI can help you with:\n- GST calculations & filings\n- ITC claims & reconciliation\n- Compliance deadlines & penalties\n- Invoice & billing queries\n\nWhat would you like to know today?",
    time: ${time}`,
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
    <div
      className={`flex w-full ${
        isBot ? "justify-start" : "justify-end"
      } items-end gap-3`}
    >
      {isBot && <Avatar role="bot" />}

      <div
        className={`max-w-[72%] flex flex-col ${
          isBot ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
            isBot
              ? "bg-white border border-gray-100 text-gray-700 rounded-bl-sm"
              : "bg-blue-700 text-white rounded-br-sm"
          }`}
        >
          {renderText(msg.text)}
        </div>

        <span className="text-xs text-gray-400 mt-1">
          {msg.time}
        </span>
      </div>

      {!isBot && <Avatar role="user" />}
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

export default function TaxBot() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTopics] = useState(["GST Filing", "ITC Claims", "Invoicing"]);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  const userData = useSelector((state) => state.auth.userData);
  const userId = userData?._id ?? userData?.Id;
  //console.log("userid:", userId);

  const handleScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const thresholdPx = 120; // similar to WhatsApp feel: only stick when user is at/near bottom
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsNearBottom(distanceFromBottom <= thresholdPx);
  };

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el) return;

    // Initialize state based on current scroll position (e.g., after loading history)
    handleScroll();

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll only if user is already near the bottom.
  useEffect(() => {
    if (!isNearBottom) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isNearBottom]);


  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: text.trim(),
      time: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      if (!userId) throw new Error('Missing userId');
          const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/chat/`,
        {
          message: text,
          userId
        }
      );
      //console.log("gemini response:", response);
      

      const botMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: response.data.reply,
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);

      const errorMsg = {
        id: Date.now() + 1,
        role: "bot",
        text: "⚠️ Sorry, I'm unable to process your request right now. Please try again later.",
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

 const allMessages = async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/v1/chat/${userId}`
  );

  const chats = [];

  data.data.forEach((item) => {
    const time = new Date(item.createdAt).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    chats.push({
      id: item._id + "-u",
      role: "user",
      text: item.message,
      time,
    });

    chats.push({
      id: item._id + "-b",
      role: "bot",
      text: item.reply,
      time,
    });
  });

  if (chats.length > 0) {
    setMessages(chats);
  } else {
    setMessages(INITIAL_MESSAGES);
  }
};

  useEffect(() => {
    allMessages();
  }, [userId, sendMessage]);


  return (
  <div className="flex bg-gray-50 min-h-screen font-sans">

    <div className="flex-1 flex flex-col min-h-screen">

      <div className="flex flex-1 flex-col md:flex-row gap-3 md:gap-5 p-3 md:p-6 overflow-hidden">

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

          {/* Chat Header */}
          <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-100 flex items-center gap-3 md:gap-4 bg-gradient-to-r from-blue-700 to-blue-800">

            <div className="w-10 md:w-11 h-10 md:h-11 rounded-full bg-white/20 flex items-center justify-center shadow-md">
              <span className="text-xl md:text-2xl">🤖</span>
            </div>

            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm md:text-base">
                GST Tax Bot
              </h3>
              <p className="text-blue-200 text-[10px] md:text-xs">
                Powered by AI • Expert in Indian GST
              </p>
            </div>

            <div className="ml-auto hidden md:flex gap-2">
              {activeTopics.map((t) => (
                <span
                  key={t}
                  className="bg-white/15 text-white text-xs px-2.5 py-1 rounded-full border border-white/20"
                >
                  {t}
                </span>
              ))}
            </div>

          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-5 space-y-4 md:space-y-5 bg-gray-50/50"
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-3 md:px-6 py-3 border-t border-gray-100 bg-white">

            <p className="text-[10px] md:text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">
              Quick Questions
            </p>

            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.slice(0, 5).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="
                    text-[10px] md:text-xs
                    text-blue-700 bg-blue-50 border border-blue-100
                    px-2.5 md:px-3 py-1.5 rounded-full
                    hover:bg-blue-100 active:bg-blue-200
                    transition-colors
                  "
                >
                  {q}
                </button>
              ))}
            </div>

          </div>

          {/* Input */}
          <div className="px-3 md:px-5 py-3 md:py-4 bg-white border-t border-gray-100">

            <div className="flex items-center gap-2 md:gap-3 bg-gray-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5
              focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">

              <span className="text-gray-400 text-base md:text-lg">💬</span>

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
                className="
                  bg-blue-700 hover:bg-blue-800 active:scale-95
                  disabled:opacity-40 text-white text-sm font-medium
                  px-3 md:px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2
                "
              >
                <span>Send</span>
                <span className="text-xs">↑</span>
              </button>

            </div>

            <p className="text-center text-[10px] md:text-xs text-gray-400 mt-2">
              Tax Bot can make mistakes. Verify important tax decisions with a CA.
            </p>

          </div>

        </div>

        {/* Right Panel */}
        <div className="hidden md:block w-[300px] lg:w-[350px]">
          {/* your right panel stays exactly same */}
        </div>

      </div>
    </div>
  </div>
);
}