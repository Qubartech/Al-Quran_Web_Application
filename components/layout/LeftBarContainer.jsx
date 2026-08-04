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
        fixed inset-y-0 left-0 z-[80] w-80 max-w-[calc(100vw-40px)] h-screen bg-slate-950 text-slate-100 border-r border-slate-800 shadow-2xl flex flex-col
        transition-all duration-300 ease-in-out
        ${isLeftBarOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-full opacity-0 invisible"}
        md:relative md:translate-x-0 md:opacity-100 md:visible md:inset-auto md:z-0 md:w-96 md:h-[calc(100vh-130px)] md:bg-transparent md:border-none md:shadow-none md:rounded-2xl md:glass md:shrink-0 md:overflow-hidden
        ${isLeftBarOpen ? "md:flex" : "md:hidden"}
      `}>
        <LeftBar data={data} />
      </div>

      {/* Main Reading Pane */}
      <div className="w-full rounded-2xl h-[calc(100vh-130px)] overflow-y-auto scroll-smooth duration-700 glass hover-scrollbar flex-1 relative">
        {children}
      </div>
    </div>
  );
}
