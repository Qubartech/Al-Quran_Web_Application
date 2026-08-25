"use client";

import Link from "next/link";
import { useAudio } from "@/context/AudioProvider";
import {
  Play,
  Pause,
  MapPin,
  BookOpen,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Volume2,
  Share2,
  Compass,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import SurahInfoModal from "./SurahInfoModal";

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
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const containerRef = useRef(null);

  const num = Number(surahNumber) || 1;
  const isMakki = (revelationPlace || "").toLowerCase().includes("makkah");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Find closest scrollable parent container or window
    const scrollParent = el.closest(".overflow-y-auto") || window;

    const handleScroll = () => {
      const scrollTop =
        scrollParent === window ? window.scrollY : scrollParent.scrollTop;
      if (scrollTop > 180) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll();
    scrollParent.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollParent.removeEventListener("scroll", handleScroll);
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

  const handleShareSurah = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Surah ${englishName} (${arabicName})`,
          text: `Read and listen to Surah ${englishName} on Holy Quran`,
          url: url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          navigator.clipboard?.writeText(url);
          setCopiedLink(true);
          setTimeout(() => setCopiedLink(false), 2000);
        }
      }
    } else {
      navigator.clipboard?.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <>
      {/* ── 1. Main Luxury Hero Banner ── */}
      <div className="relative py-8 md:py-12 px-5 md:px-10 rounded-3xl overflow-hidden glass shadow-xl mb-6 border border-emerald-500/20 dark:border-emerald-500/30 animate-fadeIn transition-all duration-300">
        
        {/* Ambient Glows & Islamic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/40 dark:from-slate-950/95 dark:via-emerald-950/40 dark:to-slate-900/90 z-0 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 dark:bg-emerald-400/15 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-3xl z-0 pointer-events-none" />

        {/* Islamic Arabesque Geometric Backdrop (Rub el Hizb 8-Point Stars) */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamicHeroPattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600 dark:text-emerald-400">
                  <polygon points="35,0 45.5,10.5 59.5,10.5 59.5,24.5 70,35 59.5,45.5 59.5,59.5 45.5,59.5 35,70 24.5,59.5 10.5,59.5 10.5,45.5 0,35 10.5,24.5 10.5,10.5 24.5,10.5" />
                  <circle cx="35" cy="35" r="14" />
                  <circle cx="35" cy="35" r="6" />
                  <path d="M 0,0 L 70,70 M 70,0 L 0,70" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicHeroPattern)" />
          </svg>
        </div>

        {/* Left & Right Decorative Arch Silhouettes */}
        <div className="absolute top-0 left-0 bottom-0 w-28 md:w-48 opacity-[0.06] dark:opacity-[0.12] pointer-events-none z-0 hidden sm:block">
          <svg viewBox="0 0 120 240" className="w-full h-full text-emerald-600 dark:text-emerald-400" fill="currentColor">
            <path d="M0,0 L120,0 C120,80 90,140 0,160 Z" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 bottom-0 w-28 md:w-48 opacity-[0.06] dark:opacity-[0.12] pointer-events-none z-0 hidden sm:block transform scale-x-[-1]">
          <svg viewBox="0 0 120 240" className="w-full h-full text-emerald-600 dark:text-emerald-400" fill="currentColor">
            <path d="M0,0 L120,0 C120,80 90,140 0,160 Z" />
          </svg>
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center gap-4 md:gap-5">

          {/* Top Row: Quick Prev / Next Jump Chips (Desktop & Mobile) */}
          <div className="w-full flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
            {num > 1 ? (
              <Link
                href={`/surah/${num - 1}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/50 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200/50 dark:border-slate-800/80 transition-all backdrop-blur-md"
                title="Previous Surah"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Surah {num - 1}</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            ) : (
              <div className="w-16" />
            )}

            {/* Centered Chapter Indicator */}
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
              Surah {num} of 114
            </span>

            {num < 114 ? (
              <Link
                href={`/surah/${num + 1}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-900/50 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200/50 dark:border-slate-800/80 transition-all backdrop-blur-md"
                title="Next Surah"
              >
                <span className="hidden sm:inline">Surah {num + 1}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <div className="w-16" />
            )}
          </div>

          {/* Ornate Islamic Medallion Badge */}
          <div
            onClick={handlePlaySurah}
            className="relative group cursor-pointer"
            title="Click to play full Surah audio"
          >
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 opacity-20 dark:opacity-30 blur-lg group-hover:opacity-60 transition-all duration-300 pointer-events-none" />
            <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="heroStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#0f766e" />
                  </linearGradient>
                </defs>
                {/* 8-Point Rub el Hizb Geometric Star with rounded stroke */}
                <rect
                  x="15"
                  y="15"
                  width="70"
                  height="70"
                  rx="10"
                  fill="url(#heroStarGradient)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                />
                <rect
                  x="15"
                  y="15"
                  width="70"
                  height="70"
                  rx="10"
                  transform="rotate(45 50 50)"
                  fill="url(#heroStarGradient)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1.5"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-white text-base md:text-xl font-black tracking-tight select-none">
                {surahNumber}
              </span>
            </div>
          </div>

          {/* Surah Title Calligraphy & English Heading */}
          <div className="flex flex-col items-center gap-1.5 max-w-3xl">
            <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {englishName}
              </h1>
              {arabicName && (
                <span className="font-arabic text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent drop-shadow-sm select-none">
                  {arabicName}
                </span>
              )}
            </div>

            {/* Translated Meaning */}
            {translatedName && (
              <p className="text-sm md:text-base font-semibold text-emerald-700 dark:text-emerald-400/90 italic">
                &ldquo;{translatedName}&rdquo;
              </p>
            )}
          </div>

          {/* Audio Visualizer Waves Indicator (when playing) */}
          {isCurrentSurahPlaying && (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 animate-fadeIn">
              <Volume2 size={15} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mr-2">
                Recitation in progress
              </span>
              <div className="flex items-center gap-1 h-3">
                <span className="wave-bar !bg-emerald-500" />
                <span className="wave-bar !bg-emerald-500" />
                <span className="wave-bar !bg-emerald-500" />
                <span className="wave-bar !bg-emerald-500" />
              </div>
            </div>
          )}

          {/* Interactive Badges & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
            {/* Quick Play Full Surah Button */}
            <button
              onClick={handlePlaySurah}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs md:text-sm transition-all duration-300 shadow-lg cursor-pointer ${
                isCurrentSurahPlaying
                  ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30 scale-105 ring-2 ring-amber-400/50"
                  : "bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30 hover:scale-105"
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

            {/* Revelation Place Pill */}
            {revelationPlace && (
              <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm capitalize backdrop-blur-md">
                <MapPin size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>{revelationPlace}</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                    isMakki
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                  }`}
                >
                  {isMakki ? "Makki" : "Madani"}
                </span>
              </span>
            )}

            {/* Verses Count Pill */}
            {versesCount && (
              <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-md">
                <BookOpen size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>{versesCount} Verses</span>
              </span>
            )}

            {/* Info Drawer Button */}
            <button
              onClick={() => setIsInfoOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/40 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title="View Surah Context & Background"
            >
              <Info size={14} className="text-emerald-500" />
              <span>Surah Info</span>
            </button>

            {/* Share Surah Button */}
            <button
              onClick={handleShareSurah}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title="Share Surah Link"
            >
              <Share2 size={14} />
              <span>{copiedLink ? "Copied!" : "Share"}</span>
            </button>
          </div>

        </div>

        {/* Surah Info Modal */}
        <SurahInfoModal
          isOpen={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
          surahNumber={surahNumber}
          englishName={englishName}
          arabicName={arabicName}
          translatedName={translatedName}
          revelationPlace={revelationPlace}
          versesCount={versesCount}
        />
      </div>

      {/* ── 2. Compact Floating Sticky Header Bar on Scroll (Quran.com Style) ── */}
      <div
        ref={containerRef}
        className={`sticky top-0 z-40 transition-all duration-300 transform ${
          isScrolled
            ? "translate-y-0 opacity-100 pointer-events-auto shadow-xl py-2.5 mb-4 rounded-2xl border"
            : "-translate-y-4 opacity-0 pointer-events-none h-0 overflow-hidden py-0 my-0 border-none"
        } bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-emerald-500/20 dark:border-emerald-500/30 px-3.5 sm:px-5 flex items-center justify-between gap-3`}
      >
        {/* Left: Surah Badge & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
            {surahNumber}
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className="font-extrabold text-sm md:text-base text-slate-900 dark:text-slate-100 truncate">
              {englishName}
            </span>
            {arabicName && (
              <span className="font-arabic text-base md:text-lg text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
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

        {/* Right: Quick Controls, Jump Nav & Mini Player */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {versesCount && (
            <span className="hidden sm:inline-block text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100/80 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-gray-200/50 dark:border-slate-700/60">
              {versesCount} Ayahs
            </span>
          )}

          {/* Quick Prev / Next Buttons (< >) */}
          <div className="flex items-center gap-0.5 bg-gray-100/70 dark:bg-slate-800/70 p-0.5 rounded-xl border border-gray-200/40 dark:border-slate-700/50">
            {num > 1 ? (
              <Link
                href={`/surah/${num - 1}`}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-700 transition-all"
                title="Previous Surah"
              >
                <ChevronLeft size={15} />
              </Link>
            ) : (
              <span className="w-7 h-7 flex items-center justify-center text-gray-300 dark:text-slate-600 cursor-not-allowed">
                <ChevronLeft size={15} />
              </span>
            )}

            {num < 114 ? (
              <Link
                href={`/surah/${num + 1}`}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-emerald-500 hover:bg-white dark:hover:bg-slate-700 transition-all"
                title="Next Surah"
              >
                <ChevronRight size={15} />
              </Link>
            ) : (
              <span className="w-7 h-7 flex items-center justify-center text-gray-300 dark:text-slate-600 cursor-not-allowed">
                <ChevronRight size={15} />
              </span>
            )}
          </div>

          {/* Mini Play / Pause Button */}
          <button
            onClick={handlePlaySurah}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all shadow-sm cursor-pointer ${
              isCurrentSurahPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20 scale-105"
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
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

