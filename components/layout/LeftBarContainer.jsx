"use client";

import { useSidebar } from "@/context/SidebarProvider";
import LeftBar from "./LeftBar";
import { PanelLeft } from "lucide-react";

export default function LeftBarContainer({ data, children }) {
  const { isLeftBarOpen, toggleSidebar } = useSidebar();

  return (
    <div className="flex justify-between px-2 md:px-0 gap-4 w-full my-6 text-gray-900 dark:text-gray-100 transition-all relative">
      {/* Mobile Sidebar Backdrop */}
      {isLeftBarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] md:hidden animate-fadeIn cursor-pointer"
          onClick={toggleSidebar}
        />
      )}

      {/* LeftBar Sidebar Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-[70] w-80 max-w-[calc(100vw-50px)] h-screen bg-background border-r border-border shadow-2xl flex flex-col
        transition-all duration-300 ease-in-out
        ${isLeftBarOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-full opacity-0 invisible"}
        md:relative md:translate-x-0 md:opacity-100 md:visible md:inset-auto md:z-0 md:w-96 md:h-[calc(100vh-130px)] md:bg-transparent md:border-none md:shadow-none md:rounded-2xl md:glass md:shrink-0 md:overflow-hidden
        ${isLeftBarOpen ? "md:flex" : "md:hidden"}
      `}>
        <LeftBar data={data} />
      </div>

      {/* Main Container wrapping Top Control Bar + Reading Pane */}
      <div className="flex-1 flex flex-col h-[calc(100vh-130px)] relative min-w-0">
        {/* Top Control Bar for Inside Pages */}
        <div className="flex items-center gap-2 mb-3.5 shrink-0 px-1 md:px-0">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:text-emerald-500 hover:bg-emerald-500/10 dark:text-gray-300 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer font-semibold text-xs md:text-sm shadow-xs bg-white/60 dark:bg-slate-900/60 backdrop-blur-md"
            title={isLeftBarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <PanelLeft size={16} />
            <span>{isLeftBarOpen ? "Hide Sidebar" : "Show Sidebar"}</span>
          </button>
        </div>

        {/* Main Reading Pane */}
        <div className="w-full rounded-2xl overflow-y-auto scroll-smooth duration-700 glass hover-scrollbar flex-1 relative">
          {children}
        </div>
      </div>
    </div>
  );
}
