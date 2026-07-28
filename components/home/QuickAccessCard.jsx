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
  { name: "Al-Ikhlas", id: 112, subtitle: "The Sincerity", icon: "🕊️", ayahs: 4, color: "from-sky-500/20 to-cyan-500/20" },
  { name: "Ad-Duha", id: 93, subtitle: "The Morning Hours", icon: "🌅", ayahs: 11, color: "from-orange-500/20 to-yellow-500/20" },
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
  { href: "/player", label: "Audio Player", desc: "Listen to recitations", icon: Play, color: "text-emerald-500" },
  { href: "/dashboard", label: "My Favorites", desc: "Saved & bookmarked", icon: Heart, color: "text-rose-500" },
  { href: null, label: "App Settings", desc: "Customize experience", icon: Settings, color: "text-amber-500", isSettings: true },
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
    <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col gap-5 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
          <Star size={14} className="fill-primaryColor/20" />
          Quick Access
        </span>
        <Link
          href="/surah"
          className="text-[10px] font-bold text-gray-400 hover:text-primaryColor flex items-center gap-1 transition-colors"
        >
          All Surahs
          <ArrowRight size={10} />
        </Link>
      </div>

      {/* Popular Surahs Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {POPULAR_SURAHS.map((s) => (
          <Link
            href={`/surah/${s.id}`}
            key={s.id}
            className="group relative overflow-hidden p-3 rounded-xl border border-gray-200/40 dark:border-slate-700/50 hover:border-primaryColor/40 dark:hover:border-emerald-500/40 bg-white/30 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-all duration-200 shadow-sm dark:shadow-slate-900/20"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base select-none group-hover:scale-110 transition-transform duration-200">{s.icon}</span>
                <div className="min-w-0">
                  <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 truncate group-hover:text-primaryColor transition-colors">
                    {s.name}
                  </h4>
                  <p className="text-[8px] text-gray-500 dark:text-gray-400 truncate font-semibold leading-none mt-0.5">
                    {s.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-gray-200/30 dark:border-slate-600/30">
                <span className="text-[8px] font-bold text-primaryColor dark:text-primaryColor-light">{s.ayahs} Ayahs</span>
                <span className="text-[8px] font-bold text-gray-400 dark:text-gray-500">#{s.id}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Did You Know - Quran Fact */}
      <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-amber-500/8 via-orange-500/5 to-rose-500/8 dark:from-amber-500/15 dark:via-orange-500/10 dark:to-rose-500/15 border border-amber-500/15 dark:border-amber-400/20">
        <div className="flex items-start gap-2.5">
          <div className="h-7 w-7 shrink-0 rounded-lg bg-amber-500/15 dark:bg-amber-500/25 text-amber-500 dark:text-amber-400 flex items-center justify-center mt-0.5">
            <Sparkles size={13} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Did You Know?
              </span>
              <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15">
                {currentFact.category}
              </span>
            </div>
            <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {currentFact.fact}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5 block flex items-center gap-1.5">
          <BookOpen size={11} />
          Resources & Tools
        </span>
        <div className="grid grid-cols-2 gap-2">
          {TOOL_ITEMS.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200/40 dark:border-slate-700/50 bg-white/25 dark:bg-slate-800/40 hover:bg-white/50 dark:hover:bg-slate-700/50 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 transition-all group/tool shadow-sm dark:shadow-slate-900/20">
                <div className={`h-7 w-7 shrink-0 rounded-lg bg-gray-100/60 dark:bg-slate-700/60 flex items-center justify-center ${item.color} group-hover/tool:scale-105 transition-transform`}>
                  <Icon size={13} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 block truncate group-hover/tool:text-primaryColor transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[8px] text-gray-400 dark:text-gray-500 block truncate font-medium">
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
