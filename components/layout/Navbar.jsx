"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import SettingsDrawer from "@/components/settings/SettingsDrawer";
import { IoSettings, IoMenu, IoClose } from "react-icons/io5";

function Navbar() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const openSettings = () => {
    setMobileMenuOpen(false);
    setSettingsOpen(true);
  };
  const closeSettings = () => setSettingsOpen(false);

  const navLinks = [
    { name: "Surahs", href: "/" },
    { name: "Juz / Paras", href: "/juz" }
  ];

  return (
    <div className="px-5 bg-white/60 dark:bg-slate-900/60 text-gray-900 dark:text-gray-150 backdrop-blur-md transition-all duration-300 fixed top-0 left-0 right-0 w-full z-50 border-b border-white/20 dark:border-slate-800/60 shadow-sm">
      <div className="max-w-screen-2xl mx-auto py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            Al-Quran
          </Link>
        </div>

        {/* Right Section: Navigation Links & Buttons grouped together */}
        <div className="flex items-center gap-6">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5 mr-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold transition-all duration-200 relative py-1 hover:text-primaryColor ${
                    isActive 
                      ? "text-primaryColor" 
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primaryColor rounded-full animate-fadeIn" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSettings}
              aria-label="Open settings"
              className="group p-2 rounded-xl bg-gray-100/50 dark:bg-slate-800/40 text-gray-600 dark:text-gray-350 hover:text-primaryColor dark:hover:text-primaryColor hover:bg-primaryColor/10 dark:hover:bg-primaryColor/10 transition-all duration-300 border border-transparent hover:border-primaryColor/20"
            >
              <IoSettings size={20} className="transition-transform duration-500 group-hover:rotate-90" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="md:hidden p-2 rounded-xl bg-gray-100/50 dark:bg-slate-800/40 text-gray-600 dark:text-gray-350 hover:text-primaryColor dark:hover:text-primaryColor transition-all duration-300 border border-transparent"
            >
              {mobileMenuOpen ? <IoClose size={20} /> : <IoMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg py-4 px-5 flex flex-col gap-3 shadow-lg rounded-b-xl animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-bold py-2 px-3 rounded-lg transition-all ${
                  isActive
                    ? "text-primaryColor bg-primaryColor/10"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}

      <SettingsDrawer open={settingsOpen} onClose={closeSettings} />
    </div>
  );
}

export default Navbar;
