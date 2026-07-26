"use client";

import Link from "next/link";
import { Layers, Play, User, Settings } from "lucide-react";

const POPULAR_SURAHS = [
  { name: "Yaseen", id: 36, subtitle: "Heart of Quran", icon: "✨" },
  { name: "Al-Mulk", id: 67, subtitle: "The Sovereignty", icon: "👑" },
  { name: "Al-Kahf", id: 18, subtitle: "The Cave", icon: "⛰️" },
  { name: "Ar-Rahman", id: 55, subtitle: "The Merciful", icon: "🌸" },
  { name: "Al-Waqi'ah", id: 56, subtitle: "The Event", icon: "💎" }
];

export default function QuickAccessCard() {
  const triggerSettings = () => {
    window.dispatchEvent(new CustomEvent("quran-open-settings"));
  };

  return (
    <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-full min-h-[440px] group transition-all duration-300">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <span className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light block">
          Quick Access
        </span>
        
        {/* Popular Surahs list */}
        <div className="flex flex-col gap-2">
          {POPULAR_SURAHS.map((s) => (
            <Link
              href={`/surah/${s.id}`}
              key={s.id}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200/40 dark:border-slate-800/40 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 bg-white/30 dark:bg-slate-900/30 hover:bg-white/60 dark:bg-slate-800/30 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm select-none shrink-0 group-hover:scale-110 transition-transform">{s.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate group-hover:text-primaryColor transition-colors">
                    Surah {s.name}
                  </h4>
                  <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate font-semibold leading-none mt-0.5">
                    {s.subtitle}
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-gray-400 group-hover:text-primaryColor transition-colors pl-2">
                #{s.id}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Tools Divider */}
      <div className="border-t border-gray-200/50 dark:border-slate-800/50 my-4"></div>

      {/* Grid of 4 Tools */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-450 dark:text-gray-550 mb-2.5 block">
          Quran Resources & Tools
        </span>
        <div className="grid grid-cols-2 gap-2">
          {/* Juz List */}
          <Link
            href="/juz"
            className="flex items-center gap-2 p-2 rounded-xl border border-gray-200/30 dark:border-slate-800/40 bg-white/10 dark:bg-slate-900/10 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-gray-700 dark:text-gray-300 hover:text-primaryColor dark:hover:text-emerald-450 transition-all font-bold text-[10px]"
          >
            <Layers size={13} className="text-gray-450 dark:text-gray-500 shrink-0" />
            <span>Juz / Paras</span>
          </Link>
          {/* Dedicated Player */}
          <Link
            href="/player"
            className="flex items-center gap-2 p-2 rounded-xl border border-gray-200/30 dark:border-slate-800/40 bg-white/10 dark:bg-slate-900/10 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-gray-700 dark:text-gray-300 hover:text-primaryColor dark:hover:text-emerald-450 transition-all font-bold text-[10px]"
          >
            <Play size={13} className="text-gray-450 dark:text-gray-500 shrink-0" />
            <span>Audio Player</span>
          </Link>
          {/* User Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded-xl border border-gray-200/30 dark:border-slate-800/40 bg-white/10 dark:bg-slate-900/10 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-gray-700 dark:text-gray-300 hover:text-primaryColor dark:hover:text-emerald-450 transition-all font-bold text-[10px]"
          >
            <User size={13} className="text-gray-450 dark:text-gray-500 shrink-0" />
            <span>My Favorites</span>
          </Link>
          {/* App Settings */}
          <button
            onClick={triggerSettings}
            className="flex items-center gap-2 p-2 rounded-xl border border-gray-200/30 dark:border-slate-800/40 bg-white/10 dark:bg-slate-900/10 hover:bg-primaryColor/10 dark:hover:bg-emerald-500/10 text-gray-700 dark:text-gray-300 hover:text-primaryColor dark:hover:text-emerald-450 transition-all font-bold text-[10px] text-left"
          >
            <Settings size={13} className="text-gray-450 dark:text-gray-500 shrink-0" />
            <span>App Settings</span>
          </button>
        </div>
      </div>

    </div>
  );
}
