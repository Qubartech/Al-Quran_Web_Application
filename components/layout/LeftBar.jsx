"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Search, X, Volume2 } from "lucide-react";
import { useAudio } from "@/context/AudioProvider";

export default function LeftBar({ data }) {
  const params = useParams();
  const audio = useAudio();
  const [query, setQuery] = useState("");

  const activeSurahNumber = useMemo(() => {
    return params?.id ? parseInt(params.id, 10) : null;
  }, [params?.id]);

  const playingSurahNumber = useMemo(() => {
    if (!audio?.src || !audio?.playlistId) return null;
    const pId = String(audio.playlistId);
    if (pId.startsWith("surah_")) {
      return parseInt(pId.replace("surah_", ""), 10);
    }
    return !isNaN(Number(pId)) ? parseInt(pId, 10) : null;
  }, [audio?.src, audio?.playlistId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data || [];
    return (data || []).filter((s) => {
      const en = (s.englishName || "").toLowerCase();
      const tr = (s.englishNameTranslation || "").toLowerCase();
      const ar = (s.name || "").toLowerCase();
      return (
        en.includes(q) ||
        tr.includes(q) ||
        ar.includes(q) ||
        String(s.number).includes(q)
      );
    });
  }, [data, query]);

  // Scroll the active surah into view on mount or when activeSurahNumber changes
  useEffect(() => {
    if (activeSurahNumber) {
      const timer = setTimeout(() => {
        const activeEl = document.querySelector(".active-surah-card");
        if (activeEl) {
          activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeSurahNumber]);

  return (
    <div className="py-4 px-3 text-gray-900 dark:text-gray-100 transition-colors bg-transparent flex flex-col h-full">
      {/* Sticky header search title */}
      <div className="bg-transparent border-b border-gray-200/20 dark:border-slate-800/80 pb-4 mb-4 flex flex-col gap-2.5 shrink-0">
        <h2 className="text-lg font-extrabold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent">
          Surah List
        </h2>
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Surah..."
            className="w-full pl-8 pr-8 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primaryColor/30 dark:focus:ring-emerald-500/20 focus:border-primaryColor transition-all text-xs"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" size={14} />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-gray-150 dark:hover:bg-slate-805 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto pr-1 hover-scrollbar flex-1">
        {filtered.map((surah, idx) => {
          const isActive = surah?.number === activeSurahNumber;
          const isPlayingSurah = surah?.number === playingSurahNumber && !audio?.paused;
          return (
            <Link href={`/surah/${surah?.number}`} key={idx} className="w-full">
              <div
                className={`w-full p-2.5 rounded-xl border flex items-center transition-all duration-200 group cursor-pointer ${
                  isActive
                    ? "active-surah-card border-primaryColor/40 dark:border-emerald-500/40 bg-gradient-to-r from-primaryColor/10 to-emerald-500/5 dark:from-primaryColor/20 dark:to-emerald-500/10 shadow-sm shadow-primaryColor/5"
                    : isPlayingSurah
                    ? "border-amber-500/40 dark:border-amber-400/40 bg-amber-500/10 dark:bg-amber-500/15"
                    : "border-transparent dark:border-slate-800/10 hover:border-primaryColor/20 dark:hover:border-emerald-500/20 bg-white/20 dark:bg-slate-900/5 hover:bg-white/60 dark:hover:bg-slate-800/20 hover:scale-[1.01]"
                }`}
              >
                {/* Index / Audio Playing badge */}
                <div
                  className={`h-8 w-8 shrink-0 border flex items-center justify-center rounded-lg font-bold text-[11px] transition-all duration-200 ${
                    isPlayingSurah
                      ? "bg-amber-500 border-transparent text-white shadow-md shadow-amber-500/30"
                      : isActive
                      ? "bg-primaryColor border-transparent text-white dark:bg-primaryColor-light dark:text-slate-950 font-extrabold"
                      : "bg-primaryColor/10 dark:bg-emerald-500/10 border-primaryColor/25 dark:border-emerald-500/25 text-primaryColor dark:text-primaryColor-light group-hover:bg-primaryColor group-hover:border-transparent group-hover:text-white"
                  }`}
                >
                  {isPlayingSurah ? (
                    <Volume2 size={14} className="text-white" />
                  ) : (
                    surah?.number
                  )}
                </div>

                {/* Details */}
                <div className="pl-3 flex justify-between items-center w-full min-w-0">
                  <div className="truncate pr-2">
                    <div
                      className={`text-xs font-bold truncate transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? "text-primaryColor dark:text-primaryColor-light"
                          : isPlayingSurah
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-800 dark:text-slate-200 group-hover:text-primaryColor"
                      }`}
                    >
                      <span>{surah?.englishName}</span>
                    </div>
                    <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate mt-0.5 leading-none">
                      {surah?.englishNameTranslation}
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <div
                      className={`font-arabic text-sm transition-colors leading-none mb-1 ${
                        isActive
                          ? "text-primaryColor dark:text-primaryColor-light font-semibold"
                          : isPlayingSurah
                          ? "text-amber-600 dark:text-amber-400 font-semibold"
                          : "text-slate-700 dark:text-slate-300 group-hover:text-primaryColor"
                      }`}
                    >
                      {surah?.name}
                    </div>
                    <div
                      className={`text-[9px] font-bold ${
                        isActive
                          ? "text-primaryColor/80 dark:text-primaryColor-light/80"
                          : "text-primaryColor dark:text-primaryColor-light"
                      }`}
                    >
                      {surah?.numberOfAyahs} Ayahs
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-4">
            No matches found.
          </div>
        )}
      </div>
    </div>
  );
}
