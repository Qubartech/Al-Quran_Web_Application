"use client";

import { useEffect, useState } from "react";
import { PanelLeft } from "lucide-react";
import LeftBar from "./LeftBar";

export default function LeftBarContainer({ data, children }) {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(true);

  useEffect(() => {
    const handleToggle = (e) => {
      setIsLeftBarOpen((prev) => {
        const nextState = e?.detail !== undefined ? Boolean(e.detail) : !prev;
        return nextState;
      });
    };

    window.addEventListener("quran-toggle-leftbar", handleToggle);
    return () => window.removeEventListener("quran-toggle-leftbar", handleToggle);
  }, []);

  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent("quran-toggle-leftbar"));
  };

  return (
    <div className="flex justify-between px-2 md:px-0 gap-4 w-full my-6 text-gray-900 dark:text-gray-100 transition-all relative">
      {/* LeftBar Sidebar */}
      {isLeftBarOpen && (
        <div className="w-80 md:w-96 hidden md:block max-h-full h-[calc(100vh-130px)] overflow-hidden rounded-2xl glass shrink-0 transition-all duration-300 animate-fadeIn">
          <LeftBar data={data} />
        </div>
      )}

      {/* Main Reading Pane */}
      <div className="w-full rounded-2xl h-[calc(100vh-130px)] overflow-y-auto scroll-smooth duration-700 glass hover-scrollbar flex-1 relative">
        {/* Floating Sidebar re-open pill when collapsed */}
        {!isLeftBarOpen && (
          <button
            onClick={toggleSidebar}
            className="hidden md:flex items-center gap-2 fixed top-24 left-8 z-50 px-4 py-2 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 text-xs font-black transition-all cursor-pointer animate-fadeIn border border-emerald-400/40"
            title="Show Sidebar"
          >
            <PanelLeft size={16} />
            <span>Show Sidebar</span>
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
