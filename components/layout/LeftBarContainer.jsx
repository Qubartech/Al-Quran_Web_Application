"use client";

import { useSidebar } from "@/context/SidebarProvider";
import LeftBar from "./LeftBar";

export default function LeftBarContainer({ data, children }) {
  const { isLeftBarOpen } = useSidebar();

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
        {children}
      </div>
    </div>
  );
}
