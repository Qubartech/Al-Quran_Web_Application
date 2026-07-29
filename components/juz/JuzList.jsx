"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Play,
  Pause,
  ArrowUpDown,
  X,
  Compass
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
    const isCurrentPlaying = audio.trackId === trackId && audio.isPlaying;

    if (isCurrentPlaying) {
      audio.togglePlay();
    } else {
      const startInfo = juzSurahStartMap[juz.number] || { surahNum: juz.number, name: juz.nameEnglish };
      const fullAudioUrl = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${startInfo.surahNum}.mp3`;
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
          num.includes(query)
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
      {/* Control Bar: Search + Filters + Views */}
      <div className="flex flex-col gap-4 p-4 md:p-5 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm">
        {/* Row 1: Search Bar & View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Juz number, name, or starting verse..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primaryColor/30 text-xs font-semibold shadow-inner transition-all"
            />
            <Search className="absolute left-3.5 top-3 text-gray-400" size={15} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Controls: View mode + Sort */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort selection */}
            <div className="flex items-center gap-1 bg-white/50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-bold focus:outline-none focus:ring-0 px-2 py-1 cursor-pointer appearance-none pr-6 [&>option]:bg-white [&>option]:dark:bg-slate-800 [&>option]:text-slate-800 [&>option]:dark:text-slate-200"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 4px center",
                }}
              >
                <option value="number">Sort by Number</option>
                <option value="name">Sort by Name</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className={`p-1.5 rounded-lg transition-all ${
                  sortOrder === "desc"
                    ? "bg-primaryColor/15 text-primaryColor dark:text-primaryColor-light"
                    : "text-gray-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-gray-200/40 dark:hover:bg-slate-700/40"
                }`}
                title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
              >
                <ArrowUpDown
                  size={14}
                  className={sortOrder === "desc" ? "rotate-180 transition-transform" : "transition-transform"}
                />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-gray-200/50 dark:border-slate-700/50">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-primaryColor text-white shadow-sm shadow-emerald-500/20"
                    : "text-gray-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-gray-200/40 dark:hover:bg-slate-700/40"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-primaryColor text-white shadow-sm shadow-emerald-500/20"
                    : "text-gray-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-gray-200/40 dark:hover:bg-slate-700/40"
                }`}
                title="List View"
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Juz List / Grid Display */}
      {filteredAndSortedJuz.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl glass border border-white/20 dark:border-slate-800/80">
          <Compass className="w-12 h-12 text-gray-400 mb-3 animate-pulse" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Juz Found</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
            We couldn&apos;t find any Juz matching &quot;{searchQuery}&quot;. Try adjusting your search term.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 px-4 py-2 text-xs font-bold bg-primaryColor/10 text-primaryColor dark:text-primaryColor-light hover:bg-primaryColor hover:text-white rounded-xl transition-all"
          >
            Reset Search
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5 pb-10">
          {filteredAndSortedJuz.map((juz) => {
            const trackId = `juz_${juz.number}`;
            const isPlaying = audio?.trackId === trackId && audio?.isPlaying;

            return (
              <Link href={`/juz/${juz.number}`} key={juz.number} className="group">
                <div className="w-full p-4 rounded-2xl flex items-center justify-between border border-transparent dark:border-slate-800/80 hover:border-primaryColor/40 dark:hover:border-emerald-500/40 group-hover:shadow-md transition-all duration-300 glass glass-hover relative overflow-hidden">
                  <div className="flex items-center gap-3.5 min-w-0 pr-2">
                    {/* Juz Number Badge / Play Button */}
                    <div className="relative shrink-0">
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                          isPlaying
                            ? "bg-primaryColor text-white shadow-md shadow-emerald-500/30 scale-105"
                            : "bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor dark:text-primaryColor-light border-2 border-primaryColor/20 group-hover:border-transparent group-hover:bg-primaryColor group-hover:text-white"
                        }`}
                      >
                        {isPlaying ? <span className="animate-pulse">▶</span> : juz.number}
                      </div>

                      {/* Quick Play Overlay Button */}
                      <button
                        onClick={(e) => handlePlayJuz(e, juz)}
                        className="absolute inset-0 rounded-xl bg-primaryColor text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                        title={`Play Audio for Juz ${juz.number}`}
                      >
                        {isPlaying ? (
                          <Pause size={16} fill="white" />
                        ) : (
                          <Play size={16} fill="white" className="ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-primaryColor transition-colors truncate">
                          {juz.nameEnglish}
                        </h3>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border bg-primaryColor/10 text-primaryColor dark:text-primaryColor-light border-primaryColor/20 shrink-0">
                          Juz {juz.number}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">
                        {juz.start} — {juz.end.split(" ")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Arabic Name & Verse Count */}
                  <div className="text-end shrink-0 pl-2">
                    <span className="font-arabic text-xl text-slate-800 dark:text-slate-100 group-hover:text-primaryColor transition-colors font-medium">
                      {juz.nameArabic}
                    </span>
                    <p className="text-[9px] font-bold text-primaryColor dark:text-primaryColor-light mt-0.5">
                      Para {juz.number}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="flex flex-col gap-2 pb-10">
          {filteredAndSortedJuz.map((juz) => {
            const trackId = `juz_${juz.number}`;
            const isPlaying = audio?.trackId === trackId && audio?.isPlaying;

            return (
              <Link href={`/juz/${juz.number}`} key={juz.number} className="group">
                <div className="w-full px-5 py-3 rounded-xl flex items-center justify-between border border-transparent dark:border-slate-800/80 hover:border-primaryColor/40 dark:hover:border-emerald-500/40 transition-all duration-200 glass glass-hover">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="text-xs font-black text-gray-400 group-hover:text-primaryColor w-8">
                      #{juz.number}
                    </div>

                    <button
                      onClick={(e) => handlePlayJuz(e, juz)}
                      className={`p-2 rounded-lg transition-all ${
                        isPlaying
                          ? "bg-primaryColor text-white shadow-sm"
                          : "bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor hover:bg-primaryColor hover:text-white"
                      }`}
                      title="Play Audio"
                    >
                      {isPlaying ? (
                        <Pause size={14} fill="white" />
                      ) : (
                        <Play size={14} fill="currentColor" className="ml-0.5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primaryColor transition-colors truncate">
                          {juz.nameEnglish}
                        </h4>
                        <span className="text-[10px] text-gray-400 hidden md:inline-block">•</span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate hidden md:inline-block">
                          {juz.start} — {juz.end}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-primaryColor/10 text-primaryColor dark:text-primaryColor-light border-primaryColor/20">
                      Juz {juz.number}
                    </span>
                    <span className="font-arabic text-lg text-slate-800 dark:text-slate-100 group-hover:text-primaryColor transition-colors w-24 text-right">
                      {juz.nameArabic}
                    </span>
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
