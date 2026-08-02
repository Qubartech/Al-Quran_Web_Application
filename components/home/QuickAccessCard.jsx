"use client";

import Link from "next/link";
import { Layers, Play, User, Settings, BookOpen, Star, Heart, Sparkles, ArrowRight, Moon, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const POPULAR_SURAHS = [
  { name: "Al-Fatihah", id: 1, subtitle: "The Opening", icon: "✨", ayahs: 7, color: "from-emerald-500/20 to-teal-500/20" },
  { name: "Ya-Sin", id: 36, subtitle: "Heart of Quran", icon: "💎", ayahs: 83, color: "from-violet-500/20 to-purple-500/20" },
  { name: "Al-Mulk", id: 67, subtitle: "The Sovereignty", icon: "👑", ayahs: 30, color: "from-amber-500/20 to-orange-500/20" },
  { name: "Al-Kahf", id: 18, subtitle: "The Cave", icon: "⛰️", ayahs: 110, color: "from-cyan-500/20 to-blue-500/20" },
  { name: "Ar-Rahman", id: 55, subtitle: "The Merciful", icon: "🌸", ayahs: 78, color: "from-rose-500/20 to-pink-500/20" },
  { name: "Al-Waqi'ah", id: 56, subtitle: "The Inevitable", icon: "💫", ayahs: 96, color: "from-indigo-500/20 to-blue-500/20" },
];

const QURAN_FACTS = [
  { fact: "The longest Surah is Al-Baqarah with 286 verses, and the shortest is Al-Kawthar with 3 verses.", category: "Structure" },
  { fact: "The word 'Allah' appears 2,698 times in the Quran.", category: "Words" },
  { fact: "Surah Al-Fatihah is also known as 'Umm Al-Kitab' — The Mother of the Book.", category: "Names" },
  { fact: "The Quran was revealed over a period of 23 years.", category: "History" },
  { fact: "Bismillah appears 114 times in the Quran — once at the start of each Surah except At-Tawbah, and twice in Surah An-Naml.", category: "Patterns" },
  { fact: "The middle verse of the Quran is in Surah Al-Kahf (18:19).", category: "Structure" },
  { fact: "Surah Ar-Rahman is known as 'The Bride of the Quran' for its beauty.", category: "Names" },
  { fact: "The Quran mentions 25 prophets by name.", category: "Content" },
];

const TOOL_ITEMS = [
  { href: "/juz", label: "Juz / Paras", desc: "Browse by Juz", icon: Layers, color: "text-blue-500" },
  { href: "/prayer", label: "Prayer & Tracker", desc: "Timings & logs", icon: Clock, color: "text-teal-500" },
  { href: "/player", label: "Audio Player", desc: "Listen recitations", icon: Play, color: "text-emerald-500" },
  { href: "/dashboard", label: "My Favorites", desc: "Saved surahs", icon: Heart, color: "text-rose-500" },
];

export default function QuickAccessCard() {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    setFactIndex(seed % QURAN_FACTS.length);
  }, []);

  const triggerSettings = () => {
    window.dispatchEvent(new CustomEvent("quran-open-settings"));
  };

  const currentFact = QURAN_FACTS[factIndex];

  return (
    <div className="p-5 md:p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-md flex flex-col gap-3 md:gap-3.5 h-fit">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-2">
          <Star size={15} className="fill-primaryColor/20" />
          Quick Access
        </span>
        <Link
          href="/surah"
          className="text-xs font-bold text-gray-400 hover:text-primaryColor flex items-center gap-1 transition-colors"
        >
          All Surahs
          <ArrowRight size={12} />
        </Link>
      </div>

      {/* Popular Surahs Grid */}
      <div className="grid grid-cols-2 gap-3">
        {POPULAR_SURAHS.map((s) => (
          <Link
            href={`/surah/${s.id}`}
            key={s.id}
            className="group relative overflow-hidden p-3.5 md:p-4 rounded-xl border border-gray-200/40 dark:border-slate-700/50 hover:border-primaryColor/40 dark:hover:border-emerald-500/40 bg-white/30 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-all duration-200 shadow-sm dark:shadow-slate-900/20"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="text-lg md:text-xl select-none group-hover:scale-110 transition-transform duration-200 shrink-0">{s.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-xs md:text-sm font-extrabold text-slate-800 dark:text-slate-200 truncate group-hover:text-primaryColor transition-colors">
                    {s.name}
                  </h4>
                  <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate font-semibold leading-tight mt-0.5">
                    {s.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200/30 dark:border-slate-600/30">
                <span className="text-[10px] md:text-xs font-bold text-primaryColor dark:text-primaryColor-light">{s.ayahs} Ayahs</span>
                <span className="text-[10px] md:text-xs font-bold text-gray-400 dark:text-gray-500">#{s.id}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Did You Know - Quran Fact */}
      <div className="relative overflow-hidden p-4 md:p-4.5 rounded-xl bg-gradient-to-br from-amber-500/8 via-orange-500/5 to-rose-500/8 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-rose-500/15 border border-amber-500/15 dark:border-amber-400/20">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 shrink-0 rounded-lg bg-amber-500/15 dark:bg-amber-500/25 text-amber-500 dark:text-amber-400 flex items-center justify-center mt-0.5">
            <Sparkles size={15} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] md:text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Did You Know?
              </span>
              <span className="text-[8px] md:text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15">
                {currentFact.category}
              </span>
            </div>
            <p className="text-xs md:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentFact.fact}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 block flex items-center gap-2">
          <BookOpen size={13} />
          Resources & Tools
        </span>
        <div className="grid grid-cols-2 gap-3">
          {TOOL_ITEMS.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-3 p-3 md:p-3.5 rounded-xl border border-gray-200/40 dark:border-slate-700/50 bg-white/25 dark:bg-slate-800/40 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 transition-all group/tool shadow-sm dark:shadow-slate-900/20">
                <div className={`h-8 w-8 shrink-0 rounded-lg bg-gray-100/60 dark:bg-slate-700/60 flex items-center justify-center ${item.color} group-hover/tool:scale-105 transition-transform`}>
                  <Icon size={15} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block truncate group-hover/tool:text-primaryColor transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 block truncate font-medium mt-0.5">
                    {item.desc}
                  </span>
                </div>
              </div>
            );

            if (item.isSettings) {
              return (
                <button key={item.label} onClick={triggerSettings} className="text-left">
                  {content}
                </button>
              );
            }

            return (
              <Link href={item.href} key={item.label}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
