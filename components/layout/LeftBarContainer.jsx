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
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[20000] md:hidden animate-fadeIn cursor-pointer"
          onClick={toggleSidebar}
        />
      )}

      {/* LeftBar Sidebar Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-[20000] w-80 max-w-[calc(100vw-40px)] h-screen bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-slate-900 dark:text-slate-100 border-r border-slate-200/80 dark:border-slate-800 shadow-2xl flex flex-col
        transition-all duration-300 ease-in-out
        ${isLeftBarOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-full opacity-0 invisible"}
        md:relative md:translate-x-0 md:opacity-100 md:visible md:inset-auto md:z-0 md:w-96 md:h-[calc(100vh-130px)] md:bg-white/70 md:dark:bg-slate-900/60 md:border md:border-slate-200/80 md:dark:border-slate-800/80 md:backdrop-blur-xl md:shadow-xl md:rounded-3xl md:shrink-0 md:overflow-hidden
        ${isLeftBarOpen ? "md:flex" : "md:hidden"}
      `}>
        <LeftBar data={data} />
      </div>

      {/* Main Reading Pane */}
      <div className="w-full rounded-3xl h-[calc(100vh-130px)] overflow-y-auto scroll-smooth duration-700 bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-xl hover-scrollbar flex-1 relative">
        {children}
      </div>
    </div>
  );
}
