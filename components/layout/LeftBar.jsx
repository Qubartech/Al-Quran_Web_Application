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
  const [verseQuery, setVerseQuery] = useState("");
  const [pageQuery, setPageQuery] = useState("");
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

  const filteredVerseNumbers = useMemo(() => {
    const total = currentSurahObj?.numberOfAyahs || 7;
    const allVerses = Array.from({ length: total }, (_, i) => i + 1);
    const vq = verseQuery.trim();
    if (!vq) return allVerses;
    return allVerses.filter((v) => String(v).includes(vq));
  }, [currentSurahObj, verseQuery]);

  const filteredPages = useMemo(() => {
    const allPages = Array.from({ length: 604 }, (_, i) => i + 1);
    const pq = pageQuery.trim();
    if (!pq) return allPages;
    return allPages.filter((p) => String(p).includes(pq));
  }, [pageQuery]);

  const handleScrollToVerse = (verseIndex) => {
    if (activeSurahNumber !== selectedSurahNumber) {
      window.location.href = `/surah/${selectedSurahNumber}#sura_${selectedSurahNumber}_ayah_${verseIndex}`;
    } else {
      const el = document.getElementById(`sura_${selectedSurahNumber}_ayah_${verseIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        el.focus();
      }
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

        {/* Search Header for SURAH Tab */}
        {activeTab === "surah" && (
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Surah"
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" size={14} />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

        {/* Search Header for VERSE Tab */}
        {activeTab === "verse" && (
          <div className="grid grid-cols-12 gap-2 w-full">
            <div className="col-span-8 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Surah"
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium"
              />
              <Search className="absolute left-2.5 top-2.5 text-gray-400 dark:text-slate-500" size={14} />
            </div>
            <div className="col-span-4 relative">
              <input
                type="text"
                value={verseQuery}
                onChange={(e) => setVerseQuery(e.target.value)}
                placeholder="Verse"
                className="w-full px-2.5 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-center"
              />
            </div>
          </div>
        )}

        {/* Search Header for PAGE Tab */}
        {activeTab === "page" && (
          <div className="relative w-full">
            <input
              type="text"
              value={pageQuery}
              onChange={(e) => setPageQuery(e.target.value)}
              placeholder="Search Page"
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-gray-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-slate-500" size={14} />
            {pageQuery && (
              <button
                onClick={() => setPageQuery("")}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        )}

      </div>

      {/* Main Tab Body Content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-0.5 py-0.5 hover-scrollbar">
        
        {/* ── 1. SURAH TAB ── */}
        {activeTab === "surah" && (
          <div className="flex flex-col gap-1">
            {filteredSurahs.map((surah) => {
              const isActive = surah?.number === activeSurahNumber;
              const isPlayingSurah = surah?.number === playingSurahNumber && !audio?.paused;
              return (
                <Link
                  href={`/surah/${surah?.number}`}
                  key={surah?.number}
                  onClick={() => setSelectedSurahNumber(surah?.number)}
                  className="w-full"
                >
                  <div
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                      isActive
                        ? "active-surah-card bg-slate-800/90 text-white border-slate-700 shadow-sm"
                        : isPlayingSurah
                        ? "border-amber-500/40 dark:border-amber-400/40 bg-amber-500/10 dark:bg-amber-500/15"
                        : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className="text-xs font-mono font-bold w-5 shrink-0 text-gray-400 dark:text-gray-500">
                        {isPlayingSurah ? <Volume2 size={13} className="text-amber-500" /> : surah?.number}
                      </span>
                      <span className="text-xs font-bold truncate group-hover:text-emerald-500 transition-colors">
                        {surah?.englishName}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── 2. VERSE TAB ── */}
        {activeTab === "verse" && (
          <div className="grid grid-cols-12 gap-2 h-full">
            <div className="col-span-8 flex flex-col gap-1 overflow-y-auto hover-scrollbar pr-0.5">
              {filteredSurahs.map((surah) => {
                const isSelected = surah?.number === selectedSurahNumber;
                return (
                  <button
                    key={surah?.number}
                    onClick={() => setSelectedSurahNumber(surah?.number)}
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-slate-800/90 text-white border-slate-700 font-extrabold shadow-sm"
                        : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-xs font-mono font-bold w-4 shrink-0 opacity-60">
                        {surah?.number}
                      </span>
                      <span className="text-xs font-bold truncate">
                        {surah?.englishName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="col-span-4 flex flex-col gap-1 border-l border-gray-200/20 dark:border-slate-800/60 pl-1.5 overflow-y-auto hover-scrollbar">
              {filteredVerseNumbers.map((vNum) => (
                <button
                  key={vNum}
                  onClick={() => handleScrollToVerse(vNum)}
                  className="w-full py-2 rounded-xl text-xs font-mono font-bold text-center transition-all bg-gray-200/50 dark:bg-slate-800/50 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {vNum}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. JUZ TAB ── */}
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
                  <span className="text-[10px] text-gray-400">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── 4. PAGE TAB (Quran.com Style: Vertical Page List Page 1 to Page 604) ── */}
        {activeTab === "page" && (
          <div className="flex flex-col gap-1 overflow-y-auto hover-scrollbar">
            {filteredPages.map((pNum) => {
              const isPageActive = params?.id && String(params.id) === String(pNum);
              return (
                <Link href={`/page/${pNum}`} key={pNum} className="w-full">
                  <div
                    className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isPageActive
                        ? "bg-slate-800/90 text-white border-slate-700 font-extrabold shadow-sm"
                        : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <span className="text-xs font-bold">Page {pNum}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
