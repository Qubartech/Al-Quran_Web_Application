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
  const [activeTab, setActiveTab] = useState("surah"); // 'surah' | 'verse' | 'juz' | 'page'
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(1);

  const activeSurahNumber = useMemo(() => {
    return params?.id ? parseInt(params.id, 10) : 1;
  }, [params?.id]);

  useEffect(() => {
    if (activeSurahNumber) {
      setSelectedSurahNumber(activeSurahNumber);
    }
  }, [activeSurahNumber]);

  const playingSurahNumber = useMemo(() => {
    if (!audio?.src || !audio?.playlistId) return null;
    const pId = String(audio.playlistId);
    if (pId.startsWith("surah_")) {
      return parseInt(pId.replace("surah_", ""), 10);
    }
    return !isNaN(Number(pId)) ? parseInt(pId, 10) : null;
  }, [audio?.src, audio?.playlistId]);

  const currentSurahObj = useMemo(() => {
    return (data || []).find((s) => s.number === selectedSurahNumber) || (data || [])[0];
  }, [data, selectedSurahNumber]);

  const filteredSurahs = useMemo(() => {
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

  // Scroll active surah into view
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

  const handleScrollToVerse = (verseIndex) => {
    const el = document.getElementById(`sura_${selectedSurahNumber}_ayah_${verseIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.focus();
    }
  };

  return (
    <div className="py-3 px-3 text-gray-900 dark:text-gray-100 transition-colors bg-transparent flex flex-col h-full">
      {/* Sticky Header Section */}
      <div className="bg-transparent border-b border-gray-200/20 dark:border-slate-800/80 pb-3 mb-3 flex flex-col gap-2.5 shrink-0">
        
        {/* Top Tab Switcher (Quran.com Style: Surah | Verse | Juz | Page) */}
        <div className="flex items-center justify-between bg-gray-200/50 dark:bg-slate-900/60 p-1 rounded-xl border border-gray-200/40 dark:border-slate-800/60 text-xs font-bold">
          {[
            { id: "surah", label: "Surah" },
            { id: "verse", label: "Verse" },
            { id: "juz", label: "Juz" },
            { id: "page", label: "Page" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-primaryColor dark:text-emerald-400 shadow-xs font-black"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input for Surah / Filter */}
        {activeTab === "surah" && (
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
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-gray-150 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Tab Body Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-1 py-0.5 hover-scrollbar">
        
        {/* ── 1. SURAH TAB (Dual-Column: Surah List + Quick Verse Numbers Column) ── */}
        {activeTab === "surah" && (
          <div className="grid grid-cols-12 gap-2 h-full">
            {/* Surah List Column (8 cols) */}
            <div className="col-span-8 flex flex-col gap-2">
              {filteredSurahs.map((surah, idx) => {
                const isActive = surah?.number === activeSurahNumber;
                const isSelected = surah?.number === selectedSurahNumber;
                const isPlayingSurah = surah?.number === playingSurahNumber && !audio?.paused;
                return (
                  <Link
                    href={`/surah/${surah?.number}`}
                    key={idx}
                    onClick={() => setSelectedSurahNumber(surah?.number)}
                    className="w-full"
                  >
                    <div
                      className={`w-full p-2 rounded-xl border flex items-center transition-all duration-200 group cursor-pointer ${
                        isActive
                          ? "active-surah-card border-primaryColor/40 dark:border-emerald-500/40 bg-primaryColor/10 dark:bg-emerald-500/10 shadow-xs"
                          : isSelected
                          ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
                          : isPlayingSurah
                          ? "border-amber-500/40 dark:border-amber-400/40 bg-amber-500/10 dark:bg-amber-500/15"
                          : "border-transparent dark:border-slate-800/10 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 bg-white/20 dark:bg-slate-900/5 hover:bg-white/60 dark:hover:bg-slate-800/20"
                      }`}
                    >
                      <div
                        className={`h-7 w-7 shrink-0 border flex items-center justify-center rounded-lg font-bold text-[10px] transition-all duration-200 ${
                          isPlayingSurah
                            ? "bg-amber-500 border-transparent text-white shadow-md shadow-amber-500/30"
                            : isActive
                            ? "bg-primaryColor border-transparent text-white dark:bg-primaryColor-light dark:text-slate-950 font-extrabold"
                            : "bg-primaryColor/10 dark:bg-emerald-500/10 border-primaryColor/25 dark:border-emerald-500/25 text-primaryColor dark:text-primaryColor-light group-hover:bg-primaryColor group-hover:border-transparent group-hover:text-white"
                        }`}
                      >
                        {isPlayingSurah ? <Volume2 size={13} className="text-white" /> : surah?.number}
                      </div>

                      <div className="pl-2 flex justify-between items-center w-full min-w-0">
                        <div className="truncate pr-1">
                          <div className="text-[11px] font-bold truncate text-slate-800 dark:text-slate-200 group-hover:text-primaryColor">
                            {surah?.englishName}
                          </div>
                          <div className="text-[8.5px] text-gray-500 dark:text-gray-400 truncate leading-none">
                            {surah?.englishNameTranslation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick Verse Jump Column (4 cols) */}
            <div className="col-span-4 flex flex-col gap-1.5 border-l border-gray-200/20 dark:border-slate-800/60 pl-2">
              <div className="text-[9px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-center pb-1">
                Verse
              </div>
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-230px)] pr-0.5 hover-scrollbar">
                {Array.from({ length: currentSurahObj?.numberOfAyahs || 7 }, (_, i) => i + 1).map((vNum) => (
                  <button
                    key={vNum}
                    onClick={() => handleScrollToVerse(vNum)}
                    className="w-full py-1 rounded-md text-[11px] font-mono font-bold text-center transition-all bg-gray-100/60 dark:bg-slate-900/40 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {vNum}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. VERSE TAB (Direct Verse Grid for Active Surah) ── */}
        {activeTab === "verse" && (
          <div className="flex flex-col gap-1.5">
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 pb-1 border-b border-gray-200/20 dark:border-slate-800/60">
              {currentSurahObj?.englishName} ({currentSurahObj?.numberOfAyahs} Verses)
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-2">
              {Array.from({ length: currentSurahObj?.numberOfAyahs || 7 }, (_, i) => i + 1).map((vNum) => (
                <button
                  key={vNum}
                  onClick={() => handleScrollToVerse(vNum)}
                  className="py-2 rounded-lg text-xs font-mono font-bold text-center bg-white/40 dark:bg-slate-900/40 border border-gray-200/40 dark:border-slate-800/60 hover:bg-primaryColor hover:text-white dark:hover:bg-emerald-500 transition-all cursor-pointer shadow-2xs"
                >
                  {vNum}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. JUZ TAB (All 30 Juz Quick List) ── */}
        {activeTab === "juz" && (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((jNum) => (
              <Link href={`/juz/${jNum}`} key={jNum} className="w-full">
                <div className="p-2.5 rounded-xl border border-transparent dark:border-slate-800/10 hover:border-emerald-500/30 bg-white/20 dark:bg-slate-900/5 hover:bg-white/60 dark:hover:bg-slate-800/20 flex items-center justify-between transition-all group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                      {jNum}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-500">
                      Juz {jNum}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">Read &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── 4. PAGE TAB (Mushaf Pages 1 to 604 Grid) ── */}
        {activeTab === "page" && (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 pb-1">
              Select Mushaf Page (1 - 604)
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {Array.from({ length: 604 }, (_, i) => i + 1).map((pNum) => (
                <button
                  key={pNum}
                  onClick={() => alert(`Navigating to Mushaf Page ${pNum}`)}
                  className="py-1.5 rounded-lg text-xs font-mono font-bold text-center bg-white/40 dark:bg-slate-900/40 border border-gray-200/30 dark:border-slate-800/50 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                >
                  {pNum}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
