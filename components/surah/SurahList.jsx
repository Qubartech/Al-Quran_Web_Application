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
  Sparkles,
  X,
  BookOpen,
  Volume2
} from "lucide-react";
import { useAudio } from "@/context/AudioProvider";

export default function SurahList({ data }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // 'all', 'makkah', 'madinah'
  const [sortBy, setSortBy] = useState("number"); // 'number', 'ayahs', 'name'
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc'
  const [viewMode, setViewMode] = useState("grid"); // 'grid', 'list'

  const audio = useAudio();
  const surahData = useMemo(() => data || [], [data]);

  // Play surah audio directly from card
  const handlePlaySurah = (e, surah) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audio) return;

    const surahId = `surah_${surah.number}`;
    const isCurrentPlaying = audio.trackId === surahId && audio.isPlaying;

    if (isCurrentPlaying) {
      audio.togglePlay();
    } else {
      const fullAudioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${surah.number}.mp3`;
      audio.playList([fullAudioUrl], 0, surahId, surah.englishName);
    }
  };

  // Filtered and Sorted list
  const filteredAndSortedSurahs = useMemo(() => {
    let result = [...surahData];

    // Search filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((s) => {
        const en = s.englishName?.toLowerCase() || "";
        const tr = s.englishNameTranslation?.toLowerCase() || "";
        const ar = s.name?.toLowerCase() || "";
        const num = String(s.number);
        return en.includes(query) || tr.includes(query) || ar.includes(query) || num.includes(query);
      });
    }

    // Revelation place filter
    if (filterType !== "all") {
      result = result.filter((s) => {
        const rev = (s.revelationType || "").toLowerCase();
        return rev.includes(filterType);
      });
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "number") {
        comparison = a.number - b.number;
      } else if (sortBy === "ayahs") {
        comparison = a.numberOfAyahs - b.numberOfAyahs;
      } else if (sortBy === "name") {
        comparison = a.englishName.localeCompare(b.englishName);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [surahData, searchQuery, filterType, sortBy, sortOrder]);

  const counts = useMemo(() => {
    let makki = 0;
    let madani = 0;
    surahData.forEach((s) => {
      const rev = (s.revelationType || "").toLowerCase();
      if (rev.includes("makkah") || rev.includes("meccan")) makki++;
      else if (rev.includes("madinah") || rev.includes("medinan")) madani++;
    });
    return { all: surahData.length, makki, madani };
  }, [surahData]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Control Bar: Search + Filters + View Switcher */}
      <div className="flex flex-col gap-4 p-5 md:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl">
        
        {/* Row 1: Search Input & Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Surah name, translation, or number (e.g. 36, Ya-Sin)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-semibold shadow-inner transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Controls: Sort Dropdown & Grid/List Switcher */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            
            {/* Sort selection */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-700 dark:text-slate-200 text-xs font-bold focus:outline-none px-2 py-1 cursor-pointer"
              >
                <option value="number" className="dark:bg-slate-900">Sort by Number</option>
                <option value="ayahs" className="dark:bg-slate-900">Sort by Verses</option>
                <option value="name" className="dark:bg-slate-900">Sort by Name</option>
              </select>
              <button
                onClick={toggleSortOrder}
                className={`p-1.5 rounded-xl transition-all ${
                  sortOrder === "desc"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
              >
                <ArrowUpDown size={14} className={sortOrder === "desc" ? "rotate-180 transition-transform" : "transition-transform"} />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
            </div>

          </div>

        </div>

        {/* Row 2: Category Filter Pills & Counter */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilterType("all")}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                filterType === "all"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              All Surahs ({counts.all})
            </button>

            <button
              onClick={() => setFilterType("makkah")}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                filterType === "makkah"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Meccan / Makki ({counts.makki})
            </button>

            <button
              onClick={() => setFilterType("madinah")}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                filterType === "madinah"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              Medinan / Madani ({counts.madani})
            </button>
          </div>

          <span className="text-xs font-bold text-slate-400 hidden sm:block">
            Showing {filteredAndSortedSurahs.length} of 114
          </span>
        </div>

      </div>

      {/* Empty Search Result State */}
      {filteredAndSortedSurahs.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
          <BookOpen size={36} className="text-slate-300 dark:text-slate-700" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Surah found matching &quot;{searchQuery}&quot;
          </h3>
          <p className="text-xs text-slate-400">
            Try searching by Surah name, Arabic title, or verse count.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
          >
            Clear Search Filter
          </button>
        </div>
      )}

      {/* Grid View Directory */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedSurahs.map((surah) => {
            const isPlayingThis = audio?.trackId === `surah_${surah.number}` && audio?.isPlaying;
            const isMakki = (surah.revelationType || "").toLowerCase().includes("makkah") || (surah.revelationType || "").toLowerCase().includes("meccan");

            return (
              <Link
                key={surah.number}
                href={`/surah/${surah.number}`}
                className={`group relative p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between gap-4 overflow-hidden ${
                  isPlayingThis
                    ? "bg-emerald-500/10 border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.01]"
                    : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/70 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl"
                }`}
              >
                {/* Background Ambient Glow */}
                <div className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full bg-emerald-500/5 group-hover:scale-150 transition-transform pointer-events-none"></div>

                {/* Top Row: Number Badge & Arabic Title */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    {/* Star Geometric Badge */}
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black font-mono text-xs transition-all shadow-sm ${
                      isPlayingThis
                        ? "bg-emerald-600 text-white shadow-emerald-600/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                    }`}>
                      {surah.number}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {surah.englishName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium truncate max-w-[130px]">
                        {surah.englishNameTranslation}
                      </span>
                    </div>
                  </div>

                  {/* Arabic Name */}
                  <span className="font-arabic text-xl font-bold text-slate-800 dark:text-slate-200 group-hover:scale-105 transition-transform" dir="rtl">
                    {surah.name}
                  </span>
                </div>

                {/* Bottom Row: Metadata & Audio Trigger */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 z-10">
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {surah.numberOfAyahs} Verses
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full ${
                      isMakki
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {isMakki ? "Makki" : "Madani"}
                    </span>
                  </div>

                  {/* Audio Play Button */}
                  <button
                    type="button"
                    onClick={(e) => handlePlaySurah(e, surah)}
                    className={`p-2 rounded-xl transition-all ${
                      isPlayingThis
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 animate-pulse"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white"
                    }`}
                    title={isPlayingThis ? "Pause" : "Listen Audio"}
                  >
                    {isPlayingThis ? <Pause size={14} className="fill-white" /> : <Play size={14} className="fill-emerald-600 dark:fill-emerald-400 group-hover:fill-white" />}
                  </button>
                </div>

              </Link>
            );
          })}
        </div>
      ) : (
        /* List View Directory */
        <div className="flex flex-col gap-2.5">
          {filteredAndSortedSurahs.map((surah) => {
            const isPlayingThis = audio?.trackId === `surah_${surah.number}` && audio?.isPlaying;
            const isMakki = (surah.revelationType || "").toLowerCase().includes("makkah") || (surah.revelationType || "").toLowerCase().includes("meccan");

            return (
              <Link
                key={surah.number}
                href={`/surah/${surah.number}`}
                className={`group p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                  isPlayingThis
                    ? "bg-emerald-500/10 border-2 border-emerald-500 shadow-md"
                    : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200/70 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-xs ${
                    isPlayingThis
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}>
                    {surah.number}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {surah.englishName}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {surah.englishNameTranslation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="font-arabic text-lg font-bold text-slate-800 dark:text-slate-200">
                    {surah.name}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 font-mono hidden sm:inline">
                      {surah.numberOfAyahs} Verses
                    </span>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isMakki
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}>
                      {isMakki ? "Makki" : "Madani"}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handlePlaySurah(e, surah)}
                      className={`p-2 rounded-xl transition-all ${
                        isPlayingThis
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white"
                      }`}
                    >
                      {isPlayingThis ? <Pause size={14} className="fill-white" /> : <Play size={14} className="fill-emerald-600 dark:fill-emerald-400 group-hover:fill-white" />}
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
