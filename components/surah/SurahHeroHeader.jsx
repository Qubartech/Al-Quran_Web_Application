"use client";

import { useAudio } from "@/context/AudioProvider";
import { Play, Pause, MapPin, BookOpen, Layers } from "lucide-react";
import { useState, useEffect } from "react";

export default function SurahHeroHeader({
  surahNumber,
  englishName,
  arabicName,
  translatedName,
  revelationPlace,
  versesCount,
}) {
  const audio = useAudio();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isMatch =
    audio?.playlistId === surahNumber ||
    audio?.playlistId === `surah_${surahNumber}` ||
    String(audio?.playlistId) === String(surahNumber) ||
    String(audio?.playlistId) === `surah_${surahNumber}`;

  const isCurrentSurahPlaying = audio?.open && !audio?.paused && isMatch;

  const handlePlaySurah = () => {
    if (isCurrentSurahPlaying) {
      audio?.pause();
    } else if (audio?.open && isMatch) {
      audio?.resume();
    } else {
      audio?.playSurah(surahNumber, englishName);
    }
  };

  return (
    <>
      {/* ── 1. Main Hero Banner Content ── */}
      <div className="relative py-10 md:py-12 px-6 md:px-10 rounded-3xl overflow-hidden glass shadow-2xl mb-6 border border-emerald-500/25 dark:border-emerald-500/30 animate-fadeIn">
        
        {/* Islamic Ambient Glows & Mesh Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-emerald-600/10 dark:from-emerald-500/15 dark:via-teal-500/10 dark:to-emerald-600/15 z-0 pointer-events-none" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/15 dark:bg-emerald-400/20 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-teal-500/15 dark:bg-teal-400/15 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-emerald-500/15 dark:bg-emerald-400/15 rounded-full blur-3xl z-0 pointer-events-none" />

        {/* Islamic Geometric Pattern Backdrop (Rub el Hizb 8-Point Stars) */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.08] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamicStarPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1" className="text-emerald-500 dark:text-emerald-400">
                  <polygon points="30,0 39,9 51,9 51,21 60,30 51,39 51,51 39,51 30,60 21,51 9,51 9,39 0,30 9,21 9,9 21,9" />
                  <circle cx="30" cy="30" r="10" />
                  <path d="M 0,0 L 60,60 M 60,0 L 0,60" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicStarPattern)" />
          </svg>
        </div>

        {/* Islamic Arch Silhouettes on Left & Right Sides */}
        <div className="absolute top-0 left-0 bottom-0 w-24 md:w-40 opacity-[0.05] dark:opacity-[0.1] pointer-events-none z-0 hidden sm:block">
          <svg viewBox="0 0 100 200" className="w-full h-full text-emerald-500" fill="currentColor">
            <path d="M0,0 L100,0 C100,60 80,100 0,120 Z" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-24 md:w-40 opacity-[0.05] dark:opacity-[0.1] pointer-events-none z-0 hidden sm:block transform scale-x-[-1]">
          <svg viewBox="0 0 100 200" className="w-full h-full text-emerald-500" fill="currentColor">
            <path d="M0,0 L100,0 C100,60 80,100 0,120 Z" />
          </svg>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-5">
          
          {/* Islamic Star Number Badge */}
          <div
            onClick={handlePlaySurah}
            className="relative group cursor-pointer"
            title="Click to play full Surah audio"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-40 blur-md group-hover:opacity-80 transition-opacity" />
            <div className="ayah-badge w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center transition-transform group-hover:scale-105">
              <span className="text-base md:text-xl font-black tracking-tight">{surahNumber}</span>
            </div>
          </div>

          {/* Surah Title Calligraphy & English Name */}
          <div className="flex flex-col items-center gap-2 max-w-3xl">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {englishName}
              </h1>
              {arabicName && (
                <span className="font-arabic text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                  {arabicName}
                </span>
              )}
            </div>

            {/* Translated Meaning */}
            {translatedName && (
              <p className="text-sm md:text-base font-semibold text-emerald-600/90 dark:text-emerald-400/90 italic">
                &quot;{translatedName}&quot;
              </p>
            )}
          </div>

          {/* Metadata Badges & Play Button */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {/* Quick Play Button */}
            <button
              onClick={handlePlaySurah}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-extrabold text-xs md:text-sm transition-all duration-300 shadow-xl cursor-pointer ${
                isCurrentSurahPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30 scale-105"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30 hover:scale-105"
              }`}
            >
              {isCurrentSurahPlaying ? (
                <>
                  <Pause size={16} fill="currentColor" />
                  <span>Pause Recitation</span>
                </>
              ) : (
                <>
                  <Play size={16} fill="currentColor" className="ml-0.5" />
                  <span>Play Full Surah</span>
                </>
              )}
            </button>

            {/* Location Chip */}
            {revelationPlace && (
              <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-gray-200/50 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm capitalize backdrop-blur-md">
                <MapPin size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                {revelationPlace}
              </span>
            )}

            {/* Verses Count Chip */}
            {versesCount && (
              <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-gray-200/50 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
                <BookOpen size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                {versesCount} Ayahs
              </span>
            )}

            {/* Surah Index Chip */}
            <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/60 dark:bg-slate-900/60 border border-gray-200/50 dark:border-slate-800/80 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
              <Layers size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
              Surah {surahNumber} / 114
            </span>
          </div>

        </div>
      </div>

      {/* ── 2. Compact Sticky Header Bar on Scroll ── */}
      <div
        className={`fixed top-16 left-0 right-0 z-40 transition-all duration-300 transform ${
          isScrolled
            ? "translate-y-0 opacity-100 pointer-events-auto shadow-md"
            : "-translate-y-full opacity-0 pointer-events-none"
        } bg-white/85 dark:bg-slate-900/90 backdrop-blur-xl border-b border-emerald-500/20 dark:border-emerald-500/30 px-4 py-2.5`}
      >
        <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Badge + Surah Names */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {surahNumber}
            </div>
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100 truncate">
                {englishName}
              </span>
              {arabicName && (
                <span className="font-arabic text-base md:text-xl text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                  {arabicName}
                </span>
              )}
              {translatedName && (
                <span className="hidden lg:inline text-xs text-gray-500 dark:text-gray-400 italic truncate">
                  ({translatedName})
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Action Controls & Metadata */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {versesCount && (
              <span className="hidden sm:inline-block text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-full border border-gray-200/60 dark:border-slate-700/60">
                {versesCount} Ayahs
              </span>
            )}
            <button
              onClick={handlePlaySurah}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs transition-all shadow-sm ${
                isCurrentSurahPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                  : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/20"
              }`}
            >
              {isCurrentSurahPlaying ? (
                <>
                  <Pause size={14} fill="currentColor" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                  <span className="hidden sm:inline">Play Surah</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
