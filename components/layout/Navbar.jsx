"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import SettingsDrawer from "@/components/settings/SettingsDrawer";
import AuthModal from "@/components/auth/AuthModal";
import ProfileEditModal from "@/components/auth/ProfileEditModal";
import { useUser } from "@/context/UserProvider";
import { useSidebar } from "@/context/SidebarProvider";
import {
  Settings,
  Menu,
  X,
  BookOpen,
  Layers,
  Play,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  PanelLeft,
  Clock,
  Calendar
} from "lucide-react";

function Navbar() {
  const { user, signOut } = useUser();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const pathname = usePathname();
  const isReadingPage = /^\/(surah|juz|page)\/\d+/.test(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleOpenSettings = () => {
      setMobileMenuOpen(false);
      setSettingsOpen(true);
    };
    const handleOpenAuth = () => {
      setMobileMenuOpen(false);
      setAuthModalOpen(true);
    };

    window.addEventListener("quran-open-settings", handleOpenSettings);
    window.addEventListener("quran-open-auth", handleOpenAuth);
    return () => {
      window.removeEventListener("quran-open-settings", handleOpenSettings);
      window.removeEventListener("quran-open-auth", handleOpenAuth);
    };
  }, []);

  const openSettings = () => {
    setMobileMenuOpen(false);
    setSettingsOpen(true);
  };
  const closeSettings = () => setSettingsOpen(false);

  const navLinks = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Surahs", href: "/surah", icon: BookOpen },
    { name: "Juz / Paras", href: "/juz", icon: Layers },
    { name: "Prayer & Tracker", href: "/prayer", icon: Clock },
    { name: "Prayer Calendar", href: "/prayer/calendar", icon: Calendar },
    { name: "Learn Quran", href: "/learn", icon: GraduationCap },
    { name: "Dedicated Player", href: "/player", icon: Play }
  ];

  return (
    <nav className="px-3 sm:px-6 bg-background/80 text-foreground backdrop-blur-xl transition-all duration-300 fixed top-0 left-0 right-0 w-full z-[10000] border-b border-border/50 shadow-sm dark:shadow-slate-950/50">
      <div className="max-w-screen-2xl mx-auto py-2.5 sm:py-3.5 flex justify-between items-center">
        {/* Logo container */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isReadingPage && (
            <button
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar Navigation"
              title="Toggle Sidebar Navigation"
              className="mr-0.5 p-1.5 sm:p-2 rounded-xl text-gray-500 hover:text-emerald-500 hover:bg-emerald-500/10 dark:text-gray-400 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 transition-all cursor-pointer border border-transparent hover:border-emerald-500/20 shrink-0"
            >
              <PanelLeft size={18} />
            </button>
          )}

          <Link href="/" className="hover:opacity-95 transition-all flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/25">
              Q
            </span>
            <span className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-550 to-cyan-500 dark:from-emerald-400 dark:via-teal-350 dark:to-cyan-400 bg-clip-text text-transparent tracking-tight">
              Al-Quran
            </span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = link.href === "/"
              ? pathname === "/"
              : link.href === "/prayer"
                ? pathname === "/prayer"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 text-xs font-bold transition-all duration-300 px-4 py-2 rounded-xl border border-transparent ${isActive
                    ? "text-primaryColor bg-primaryColor/10 dark:text-primaryColor-light dark:bg-primaryColor-light/10 border-primaryColor/10 dark:border-primaryColor-light/10"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }`}
              >
                <Icon size={14} className={isActive ? "text-primaryColor dark:text-primaryColor-light animate-pulse" : ""} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Buttons & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Settings Button */}
          <button
            onClick={openSettings}
            aria-label="Open settings"
            className="p-2 sm:p-2.5 rounded-xl bg-foreground/5 text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all duration-300 border border-transparent hover:border-foreground/5 shrink-0"
          >
            <Settings size={17} className="animate-[spin_8s_linear_infinite] hover:animate-[spin_2s_linear_infinite]" />
          </button>

          {/* Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/60 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 border border-gray-200/20 dark:border-slate-800/40 transition-all text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0"
              >
                <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black shrink-0 text-[11px]">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline-block max-w-[75px] md:max-w-[110px] truncate">{user.email.split("@")[0]}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 shrink-0 ${profileDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 z-50 w-52 rounded-2xl border border-gray-200/40 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl shadow-xl py-2 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-900/60 text-[10px] text-gray-500 dark:text-gray-400 font-bold truncate">
                      {user.email}
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-primaryColor/5 hover:text-primaryColor dark:hover:text-emerald-400 transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-primaryColor/5 hover:text-primaryColor dark:hover:text-emerald-400 transition-colors"
                    >
                      <UserCheck size={14} />
                      Edit Profile
                    </button>

                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await signOut();
                        router.push("/");
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/5 transition-colors border-t border-gray-100 dark:border-slate-900/60 mt-1"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md shadow-emerald-500/10 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0"
            >
              Sign In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-xl bg-foreground/5 text-foreground/70 hover:text-foreground transition-all duration-300 shrink-0"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Right Side Navigation Drawer (Body Portal) */}
      {mounted && mobileMenuOpen && createPortal(
        <div className="md:hidden">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-[20000] bg-slate-950/75 backdrop-blur-sm animate-fadeIn cursor-pointer"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Right Slide-in Drawer with smooth slideInRight animation */}
          <div className="fixed top-0 right-0 bottom-0 z-[20000] w-72 sm:w-80 h-full bg-slate-950 text-slate-100 backdrop-blur-2xl border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slideInRight">

            {/* Drawer Header */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm font-black shadow-md shadow-emerald-500/25">
                    Q
                  </span>
                  <span className="text-xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
                    Al-Quran
                  </span>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 px-3 mb-1">
                  Main Menu
                </span>

                {navLinks.map((link) => {
                  const isActive = link.href === "/"
                    ? pathname === "/"
                    : link.href === "/prayer"
                      ? pathname === "/prayer"
                      : pathname.startsWith(link.href);
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3.5 text-sm font-extrabold py-3 px-4 rounded-2xl transition-all ${isActive
                          ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-md"
                          : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                        }`}
                    >
                      <Icon size={18} className={isActive ? "text-emerald-400 animate-pulse" : "text-slate-400"} />
                      <span>{link.name}</span>
                    </Link>
                  );
                })}

                {user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 text-sm font-extrabold py-3 px-4 rounded-2xl transition-all ${pathname === "/dashboard"
                        ? "text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 shadow-md"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                      }`}
                  >
                    <LayoutDashboard size={18} className={pathname === "/dashboard" ? "text-emerald-400" : "text-slate-400"} />
                    <span>User Dashboard</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col gap-3">
              {user ? (
                <div className="flex flex-col gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black text-xs shrink-0">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-black text-slate-200 truncate">{user.email}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">Active Member</span>
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await signOut();
                      router.push("/");
                    }}
                    className="mt-1 w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-rose-500/20 cursor-pointer"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-black shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck size={16} />
                  Sign In to Account
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openSettings();
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-extrabold transition-all flex items-center justify-center gap-2 border border-slate-800 cursor-pointer"
              >
                <Settings size={15} />
                App Preferences
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Settings Drawer */}
      <SettingsDrawer open={settingsOpen} onClose={closeSettings} />

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Profile Edit Modal */}
      <ProfileEditModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </nav>
  );
}

export default Navbar;
