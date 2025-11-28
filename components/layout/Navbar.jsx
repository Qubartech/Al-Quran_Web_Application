"use client";
import Link from "next/link";
import { useState } from "react";
import SettingsDrawer from "@/components/settings/SettingsDrawer";
import { IoSettings } from "react-icons/io5";

function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const openSettings = () => setSettingsOpen(true);
  const closeSettings = () => setSettingsOpen(false);

  return (
    <div className="px-5 bg-white/40 dark:bg-[rgba(26,37,60,0.4)] text-gray-900 dark:text-gray-100 backdrop-blur-md transition-colors duration-300 mb-4 shadow fixed top-0 left-0 right-0 w-full z-50 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-screen-2xl mx-auto py-4 flex justify-between items-center">
        <div className="text-3xl font-semibold">
          <Link href="/" className="text-inherit">
            Quran
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openSettings}
            aria-label="Open settings"
            className="text-inherit"
          >
            <IoSettings size={20} />
          </button>
        </div>
      </div>
      <SettingsDrawer open={settingsOpen} onClose={closeSettings} />
    </div>
  );
}

export default Navbar;
