"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, BookOpen, Layers, Compass } from "lucide-react";

export default function SurahPrevNextNav({ surahList = [] }) {
  const pathname = usePathname();
  const match = pathname?.match(/^\/surah\/(\d+)(?:\/)?$/);
  if (!match) return null;

  const numericId = parseInt(match[1], 10);
  if (Number.isNaN(numericId)) return null;

  const prevId = numericId - 1;
  const nextId = numericId + 1;

  const prevSurah = surahList.find((s) => s.number === prevId);
  const nextSurah = surahList.find((s) => s.number === nextId);

  return (
    <div className="pb-10 pt-4 px-3 md:px-6 flex flex-col items-center gap-4 max-w-5xl mx-auto w-full animate-fadeIn">
      
      {/* Dual Next / Prev Interactive Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        
        {/* Previous Surah Card */}
        {prevId >= 1 ? (
          <Link
            href={`/surah/${prevId}`}
            className="group relative p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between border border-slate-200/80 dark:border-slate-800/80 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 dark:from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-3.5 min-w-0 z-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                <ChevronLeft size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Previous Surah
                </span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {prevSurah?.englishName || `Surah ${prevId}`}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {prevSurah?.numberOfAyahs ? `${prevSurah.numberOfAyahs} Verses` : `Surah ${prevId}`}
                </span>
              </div>
            </div>
            {prevSurah?.name && (
              <span className="font-arabic text-xl sm:text-2xl text-emerald-600/60 dark:text-emerald-400/60 font-semibold shrink-0 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors select-none z-10 pl-2">
                {prevSurah.name}
              </span>
            )}
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {/* Next Surah Card */}
        {nextId <= 114 ? (
          <Link
            href={`/surah/${nextId}`}
            className="group relative p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between border border-slate-200/80 dark:border-slate-800/80 overflow-hidden text-right"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-emerald-500/5 dark:from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            {nextSurah?.name && (
              <span className="font-arabic text-xl sm:text-2xl text-emerald-600/60 dark:text-emerald-400/60 font-semibold shrink-0 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors select-none z-10 pr-2">
                {nextSurah.name}
              </span>
            )}

            <div className="flex items-center gap-3.5 min-w-0 z-10 justify-end flex-row-reverse w-full">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                <ChevronRight size={18} />
              </div>
              <div className="flex flex-col min-w-0 text-left sm:text-right">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Next Surah
                </span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  {nextSurah?.englishName || `Surah ${nextId}`}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {nextSurah?.numberOfAyahs ? `${nextSurah.numberOfAyahs} Verses` : `Surah ${nextId}`}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

      </div>

      {/* Center Jump to Index Pill */}
      <Link
        href="/page"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:border-emerald-500/50 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/80 dark:border-slate-800/80 transition-all shadow-sm group cursor-pointer"
      >
        <Compass size={15} className="text-emerald-500 group-hover:rotate-45 transition-transform" />
        <span>Browse All Surahs & Juz</span>
      </Link>

    </div>
  );
}

