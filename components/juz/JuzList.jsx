"use client";

import { useState, useMemo } from "react";
import { QURANICAUDIO_BASE_URL } from "@/lib/api/config";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Play,
  Pause,
  ArrowUpDown,
  X,
  Compass,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";
import { useAudio } from "@/context/AudioProvider";
import { juzList } from "@/lib/juzData";

export default function JuzList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("number"); // 'number', 'name'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState("grid"); // 'grid', 'list'

  const audio = useAudio();

  // Mapping starting surah numbers for audio playback of each Juz
  const juzSurahStartMap = useMemo(() => ({
    1: { surahNum: 1, name: "Al-Fatihah" },
    2: { surahNum: 2, name: "Al-Baqarah" },
    3: { surahNum: 2, name: "Al-Baqarah" },
    4: { surahNum: 3, name: "Aal-E-Imran" },
    5: { surahNum: 4, name: "An-Nisa" },
    6: { surahNum: 4, name: "An-Nisa" },
    7: { surahNum: 5, name: "Al-Ma'idah" },
    8: { surahNum: 6, name: "Al-An'am" },
    9: { surahNum: 7, name: "Al-A'raf" },
    10: { surahNum: 8, name: "Al-Anfal" },
    11: { surahNum: 9, name: "At-Tawbah" },
    12: { surahNum: 11, name: "Hud" },
    13: { surahNum: 12, name: "Yusuf" },
    14: { surahNum: 15, name: "Al-Hijr" },
    15: { surahNum: 17, name: "Al-Isra" },
    16: { surahNum: 18, name: "Al-Kahf" },
    17: { surahNum: 21, name: "Al-Anbiya" },
    18: { surahNum: 23, name: "Al-Mu'minun" },
    19: { surahNum: 25, name: "Al-Furqan" },
    20: { surahNum: 27, name: "An-Naml" },
    21: { surahNum: 29, name: "Al-Ankabut" },
    22: { surahNum: 33, name: "Al-Ahzab" },
    23: { surahNum: 36, name: "Ya-Seen" },
    24: { surahNum: 39, name: "Az-Zumar" },
    25: { surahNum: 41, name: "Fussilat" },
    26: { surahNum: 46, name: "Al-Ahqaf" },
    27: { surahNum: 51, name: "Adh-Dhariyat" },
    28: { surahNum: 58, name: "Al-Mujadilah" },
    29: { surahNum: 67, name: "Al-Mulk" },
    30: { surahNum: 78, name: "An-Naba" },
  }), []);

  // Handle playing juz starting surah audio directly from card
  const handlePlayJuz = (e, juz) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audio) return;

    const trackId = `juz_${juz.number}`;
    const isCurrentPlaying =
      (audio.trackId === trackId || audio.playlistId === trackId) && !audio.paused;

    if (isCurrentPlaying) {
      audio.togglePlay ? audio.togglePlay() : audio.pause();
    } else {
      const startInfo = juzSurahStartMap[juz.number] || { surahNum: juz.number, name: juz.nameEnglish };
      const fullAudioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${startInfo.surahNum}.mp3`;
      audio.playList([fullAudioUrl], 0, trackId, `Juz ${juz.number} - ${juz.nameEnglish}`);
    }
  };

  // Filtered and Sorted list
  const filteredAndSortedJuz = useMemo(() => {
    let result = [...juzList];

    // Search filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((j) => {
        const en = j.nameEnglish?.toLowerCase() || "";
        const ar = j.nameArabic?.toLowerCase() || "";
        const start = j.start?.toLowerCase() || "";
        const end = j.end?.toLowerCase() || "";
        const num = String(j.number);
        return (
          en.includes(query) ||
          ar.includes(query) ||
          start.includes(query) ||
          end.includes(query) ||
          num.includes(query) ||
          `juz ${num}`.includes(query) ||
          `para ${num}`.includes(query)
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "number") {
        comparison = a.number - b.number;
      } else if (sortBy === "name") {
        comparison = a.nameEnglish.localeCompare(b.nameEnglish);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchQuery, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Control Bar: Search + Filters + Views ── */}
      <div className="flex flex-col gap-4 p-4 md:p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
        {/* Row 1: Search Bar & Controls */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Juz number, name, or verse boundary (e.g. 30, Amma, Kahf)..."
              className="w-full pl-11 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold shadow-inner transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Controls: Sort + View mode */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Clean Sort selection with custom chevron */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 gap-1 shadow-2xs">
              <div className="relative flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-bold border-0 !border-none outline-none !outline-none focus:outline-none focus:ring-0 focus:border-0 pl-1 pr-5 py-1 cursor-pointer appearance-none shadow-none"
                >
                  <option value="number" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Sort by Number</option>
                  <option value="name" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">Sort by Name</option>
                </select>
                <ChevronDown size={13} className="absolute right-0.5 text-slate-400 pointer-events-none" />
              </div>

              <div className="w-px h-3.5 bg-slate-300 dark:bg-slate-700 mx-0.5" />

              <button
                onClick={toggleSortOrder}
                className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                  sortOrder === "desc"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                }`}
                title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
              >
                <ArrowUpDown
                  size={13}
                  className={sortOrder === "desc" ? "rotate-180 transition-transform" : "transition-transform"}
                />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="List View"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Counter Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-gray-500 dark:text-gray-400">
          <span>Showing {filteredAndSortedJuz.length} of 30 Juz</span>
          <span className="hidden sm:inline">Each Juz contains approximately 20 pages</span>
        </div>
      </div>

      {/* ── Juz Directory Display ── */}
      {filteredAndSortedJuz.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <Compass className="w-12 h-12 text-gray-400 mb-3 animate-pulse" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Juz Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            We couldn&apos;t find any Juz matching &quot;{searchQuery}&quot;. Try adjusting your search query.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-md cursor-pointer"
          >
            Reset Search
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ── GRID VIEW ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pb-10">
          {filteredAndSortedJuz.map((juz) => {
            const trackId = `juz_${juz.number}`;
            const isPlaying =
              (audio?.trackId === trackId || audio?.playlistId === trackId) && !audio?.paused;

            return (
              <Link href={`/juz/${juz.number}`} key={juz.number} className="group">
                <div
                  className={`w-full p-5 rounded-3xl flex flex-col justify-between gap-4 border transition-all duration-300 relative overflow-hidden ${
                    isPlaying
                      ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-2 border-emerald-500/80 dark:border-emerald-400/80 shadow-xl shadow-emerald-500/15 scale-[1.01]"
                      : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-900/90 shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                  }`}
                >
                  {/* Top Row: SVG Islamic Star Medallion, Title & Arabic Calligraphy */}
                  <div className="flex items-center justify-between gap-3 z-10">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* 8-Point Rub el Hizb SVG Star Badge */}
                      <div className="relative w-10 h-10 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {isPlaying ? (
                            <>
                              <rect x="16" y="16" width="68" height="68" rx="10" fill="#10b981" stroke="#34d399" strokeWidth="2.5" />
                              <rect x="16" y="16" width="68" height="68" rx="10" transform="rotate(45 50 50)" fill="#10b981" stroke="#34d399" strokeWidth="2.5" />
                            </>
                          ) : (
                            <>
                              <rect x="16" y="16" width="68" height="68" rx="10" className="fill-emerald-500/10 dark:fill-emerald-500/20 stroke-emerald-500/30 dark:stroke-emerald-400/40 group-hover:stroke-emerald-500/60 transition-colors" strokeWidth="2.5" />
                              <rect x="16" y="16" width="68" height="68" rx="10" transform="rotate(45 50 50)" className="fill-emerald-500/10 dark:fill-emerald-500/20 stroke-emerald-500/30 dark:stroke-emerald-400/40 group-hover:stroke-emerald-500/60 transition-colors" strokeWidth="2.5" />
                            </>
                          )}
                        </svg>
                        <span
                          className={`absolute inset-0 flex items-center justify-center font-mono font-black text-xs select-none ${
                            isPlaying
                              ? "text-white"
                              : "text-emerald-700 dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                          }`}
                        >
                          {juz.number}
                        </span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                            {juz.nameEnglish}
                          </h3>
                        </div>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Para {juz.number} of 30
                        </span>
                      </div>
                    </div>

                    {/* Arabic Name */}
                    <span className="font-arabic text-xl sm:text-2xl font-bold text-emerald-600/80 dark:text-emerald-400/80 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:scale-105 transition-all shrink-0 select-none">
                      {juz.nameArabic}
                    </span>
                  </div>

                  {/* Bottom Row: Range Direction & Audio Trigger */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800/80 z-10 gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 truncate">
                      <span className="truncate">{juz.start}</span>
                      <ArrowRight size={10} className="shrink-0 text-emerald-500" />
                      <span className="truncate">{juz.end.split(" ")[0]}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handlePlayJuz(e, juz)}
                      className={`p-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center justify-center ${
                        isPlaying
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                          : "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white"
                      }`}
                      title={`Play Recitation for Juz ${juz.number}`}
                    >
                      {isPlaying ? (
                        <div className="flex items-center gap-0.5 h-3 px-0.5">
                          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      ) : (
                        <Play size={13} className="fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* ── LIST VIEW ── */
        <div className="flex flex-col gap-2.5 pb-10">
          {filteredAndSortedJuz.map((juz) => {
            const trackId = `juz_${juz.number}`;
            const isPlaying =
              (audio?.trackId === trackId || audio?.playlistId === trackId) && !audio?.paused;

            return (
              <Link href={`/juz/${juz.number}`} key={juz.number} className="group">
                <div
                  className={`w-full p-4 rounded-2xl flex items-center justify-between gap-4 border transition-all duration-200 ${
                    isPlaying
                      ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-2 border-emerald-500/80 dark:border-emerald-400/80 shadow-md"
                      : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-900 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black font-mono text-xs shrink-0 border border-emerald-500/20">
                      {juz.number}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {juz.nameEnglish}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                        {juz.start} → {juz.end}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <span className="font-arabic text-lg sm:text-xl font-bold text-emerald-600/80 dark:text-emerald-400/80 select-none">
                      {juz.nameArabic}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handlePlayJuz(e, juz)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        isPlaying
                          ? "bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-400/40"
                          : "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white"
                      }`}
                      title="Play Audio"
                    >
                      {isPlaying ? (
                        <div className="flex items-center gap-0.5 h-3 px-0.5">
                          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                          <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                        </div>
                      ) : (
                        <Play size={13} className="fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
