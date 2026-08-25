import JuzList from "@/components/juz/JuzList";
import { Layers, Sparkles, BookOpen, Compass, ArrowRight } from "lucide-react";
import SurahPageWidgets from "@/components/surah/SurahPageWidgets";
import Link from "next/link";

export const metadata = {
  title: "Juz Directory (30 Paras) - Al-Quran Application",
  description: "Browse the Holy Quran by the 30 Juz (Para) partitions, listen to studio recitations, and explore verse ranges.",
};

export default function JuzPage() {
  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors py-6 sm:py-8 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* ── 1. Luxury Hero Header Banner ── */}
      <div className="relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-3xl glass border border-emerald-500/20 dark:border-emerald-500/30 shadow-xl mb-8 animate-fadeIn transition-all duration-300">
        
        {/* Ambient Gradients & Glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/40 dark:from-slate-950/95 dark:via-emerald-950/40 dark:to-slate-900/90 z-0 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-3xl z-0 pointer-events-none" />

        {/* Islamic Arabesque Geometric Backdrop (Rub el Hizb) */}
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamicJuzPattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600 dark:text-emerald-400">
                  <polygon points="35,0 45.5,10.5 59.5,10.5 59.5,24.5 70,35 59.5,45.5 59.5,59.5 45.5,59.5 35,70 24.5,59.5 10.5,59.5 10.5,45.5 0,35 10.5,24.5 10.5,10.5 24.5,10.5" />
                  <circle cx="35" cy="35" r="14" />
                  <circle cx="35" cy="35" r="6" />
                  <path d="M 0,0 L 70,70 M 70,0 L 0,70" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicJuzPattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold backdrop-blur-md border border-emerald-500/20 shadow-2xs">
                <Layers size={14} className="text-emerald-500" />
                Quranic Partitions (30 Paras)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-extrabold backdrop-blur-md border border-amber-500/20 shadow-2xs">
                <Sparkles size={13} />
                Daily Khatm Structure
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-xs">
              Juz Directory
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Explore the 30 equal partitions of the Holy Quran. Read verses, inspect starting & ending chapter boundaries, and listen to complete recitations.
            </p>

            {/* Quick Juz Jump Pills */}
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">
                Popular:
              </span>
              <Link
                href="/juz/1"
                className="px-3 py-1 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-emerald-500/15 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-800 text-xs font-bold transition-all shadow-2xs"
              >
                Juz 1 (Alif-Lam-Meem)
              </Link>
              <Link
                href="/juz/30"
                className="px-3 py-1 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-emerald-500/15 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-800 text-xs font-bold transition-all shadow-2xs"
              >
                Juz 30 (Amma)
              </Link>
              <Link
                href="/juz/15"
                className="px-3 py-1 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-emerald-500/15 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-800 text-xs font-bold transition-all shadow-2xs"
              >
                Juz 15 (Al-Isra & Kahf)
              </Link>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-emerald-500/20 dark:border-slate-800 backdrop-blur-xl shrink-0 shadow-lg">
            <div className="text-center px-3">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">30</span>
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Juz / Paras</span>
            </div>
            <div className="h-10 w-px bg-emerald-100 dark:bg-slate-800" />
            <div className="text-center px-3">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 block font-mono">6,236</span>
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ayahs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: JuzList (main) + Islamic Widgets (sidebar) */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT — Main Focus: Juz Directory */}
        <div className="w-full xl:flex-1 min-w-0">
          <JuzList />
        </div>

        {/* RIGHT — Islamic Content Sidebar */}
        <div className="w-full xl:w-[340px] shrink-0">
          <div className="xl:sticky xl:top-6 space-y-6">
            <SurahPageWidgets />
          </div>
        </div>
      </div>
    </main>
  );
}
