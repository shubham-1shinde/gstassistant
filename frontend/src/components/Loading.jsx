import React from "react";
import { Building2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-slate-100 to-blue-50">
      <div className="flex flex-col items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-600 p-2.5 rounded-xl">
            <Building2 size={24} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-blue-900 leading-tight">GST Assistant</p>
            <p className="text-xs text-gray-400 leading-tight">Compliance Made Easy</p>
          </div>
        </div>

        {/* Spinner */}
        <div className="relative w-14 h-14">
          {/* Static background ring */}
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          {/* Spinning arc */}
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent animate-spin"></div>
          {/* Center pulse dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm text-gray-500">Loading, please wait</p>
          {/* Animated dots */}
          <div className="flex justify-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Loading;