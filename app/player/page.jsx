"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { QURAN_API_BASE_URL } from "@/lib/api/config";
import { useAudio } from "@/context/AudioProvider";
import { useUser } from "@/context/UserProvider";
import { ALL_SURAHS } from "@/lib/surahMetadata";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Repeat,
  Loader2,
  Music,
  BookOpen,
  Sparkles,
  Search,
  Check,
  ChevronDown,
  Headphones,
  Sliders,
  Radio,
} from "lucide-react";

// Format seconds to mm:ss
const formatTime = (secs) => {
  if (isNaN(secs) || secs < 0) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const getSurahNumFromSrc = (src) => {
  if (!src) return null;
  const match = src.match(/murattal\/(\d+)\.mp3/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

const getActiveWordIndex = (ayah, currentTimeSeconds) => {
  if (!ayah?.segments || ayah.segments.length === 0) return -1;
  const currentTimeMs = currentTimeSeconds * 1000;

  const activeSegment = ayah.segments.find(
    (seg) => currentTimeMs >= seg[1] && currentTimeMs <= seg[2]
  );

  if (activeSegment) {
    return activeSegment[0] - 1; // 0-indexed position
  }
  return -1;
};

export default function AudioPlayerPage() {
  const audio = useAudio();
  const { user, session } = useUser();

  const [activeSurahNum, setActiveSurahNum] = useState(1);
  const [activeSurahInfo, setActiveSurahInfo] = useState(ALL_SURAHS[0]);
  const [searchFilter, setSearchFilter] = useState("");

  // Quran data states for active playback
  const [arabicAyahs, setArabicAyahs] = useState([]);
  const [translationAyahs, setTranslationAyahs] = useState([]);
  const [segments, setSegments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Audio progress states
  const [audioTime, setAudioTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Filtered surah list for selector
  const filteredSurahs = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return ALL_SURAHS;
    return ALL_SURAHS.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        s.translatedName.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [searchFilter]);

  // Update activeSurahNum based on global playlist context
  useEffect(() => {
    if (audio?.playlistId) {
      const parts = String(audio.playlistId).split("_");
      const num = parseInt(parts[1] || parts[0], 10);
      if (num >= 1 && num <= 114) {
        setActiveSurahNum(num);
        const match = ALL_SURAHS.find((s) => s.number === num);
        if (match) setActiveSurahInfo(match);
      }
    }
  }, [audio?.playlistId]);

  // Sync active play status
  useEffect(() => {
    setIsPlaying(audio?.open && !audio?.paused);
  }, [audio?.open, audio?.paused]);

  // Listen to time & duration updates
  useEffect(() => {
    const handleTimeUpdate = (e) => {
      if (typeof e.detail?.currentTime === "number") {
        setAudioTime(e.detail.currentTime);
      }
      if (typeof e.detail?.duration === "number" && e.detail.duration > 0) {
        setAudioDuration(e.detail.duration);
      }
    };
    window.addEventListener("quran-audio-timeupdate", handleTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", handleTimeUpdate);
    };
  }, []);

  // Fetch verse content & segments for the active Surah
  useEffect(() => {
    if (!activeSurahNum) return;
    setLoadingDetails(true);

    let translationId = "161"; // English Sahih International
    let reciterId = "7"; // Mishari Rashid Alafasy
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_translation_identifier");
      if (saved && !isNaN(Number(saved))) {
        translationId = saved;
      }
      const savedReciter = localStorage.getItem("app_reciter_id");
      if (savedReciter) {
        reciterId = savedReciter;
      }
    }

    const textUrl = `${QURAN_API_BASE_URL}/verses/by_chapter/${activeSurahNum}?per_page=300&translations=${translationId}&words=true&word_fields=location,text_qpc_hafs,text_indopak,text_uthmani,code_v1,code_v2`;
    const segmentsUrl = `${QURAN_API_BASE_URL}/chapter_recitations/${reciterId}/${activeSurahNum}?segments=true`;

    Promise.all([
      fetch(textUrl).then((r) => r.json()),
      fetch(segmentsUrl).then((r) => r.json()),
    ])
      .then(([textJson, segJson]) => {
        const verses = textJson.verses || [];
        const segmentList = segJson.audio_file?.timestamps || [];

        const arabic = verses.map((v) => {
          const segMatch = segmentList.find((s) => s.verse_key === v.verse_key);
          return {
            verseKey: v.verse_key,
            text: v.text_uthmani || v.text_qpc_hafs || v.text_simple || "",
            words: v.words || [],
            segments: segMatch?.segments || [],
          };
        });

        const trans = verses.map((v) => ({
          text: v.translations?.[0]?.text || "",
        }));

        setArabicAyahs(arabic);
        setTranslationAyahs(trans);
        setSegments(segmentList);
      })
      .catch((e) => console.error("Error fetching recitation details:", e))
      .finally(() => setLoadingDetails(false));
  }, [activeSurahNum]);

  // Compute active ayah based on audioTime (milliseconds check)
  const activeAyah = useMemo(() => {
    if (segments.length === 0 || arabicAyahs.length === 0) return null;
    const timeMs = audioTime * 1000;

    const activeSegIdx = segments.findIndex(
      (seg) => timeMs >= seg.timestamp_from && timeMs < seg.timestamp_to
    );

    if (activeSegIdx !== -1) {
      return {
        index: activeSegIdx,
        verseKey: arabicAyahs[activeSegIdx]?.verseKey || `${activeSurahNum}:${activeSegIdx + 1}`,
        arabic: arabicAyahs[activeSegIdx]?.text || "",
        translation: translationAyahs[activeSegIdx]?.text || "",
        number: activeSegIdx + 1,
      };
    }

    return {
      index: 0,
      verseKey: arabicAyahs[0]?.verseKey || `${activeSurahNum}:1`,
      arabic: arabicAyahs[0]?.text || "",
      translation: translationAyahs[0]?.text || "",
      number: 1,
    };
  }, [segments, arabicAyahs, translationAyahs, audioTime, activeSurahNum]);

  // Sync currently playing ayah with the global audio player
  useEffect(() => {
    if (activeAyah?.number) {
      const event = new CustomEvent("quran-audio-ayah-change", {
        detail: { ayahIndex: activeAyah.number - 1 },
      });
      window.dispatchEvent(event);
    }
  }, [activeAyah?.number]);

  // Sync page activeSurahNum with the loaded audio player source URL
  useEffect(() => {
    if (audio?.src) {
      const num = getSurahNumFromSrc(audio.src);
      if (num && num !== activeSurahNum) {
        setActiveSurahNum(num);
        const match = ALL_SURAHS.find((s) => s.number === num);
        if (match) setActiveSurahInfo(match);
      }
    }
  }, [audio?.src, activeSurahNum]);

  const selectSurah = (num) => {
    setActiveSurahNum(num);
    const selected = ALL_SURAHS.find((s) => s.number === num) || ALL_SURAHS[0];
    setActiveSurahInfo(selected);
    audio?.playSurah(num, selected?.englishName || "Surah");

    // Log to recents
    if (user && session?.access_token) {
      fetch("/api/recent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          surahNumber: num,
          surahName: selected?.englishName || "",
          englishName: selected?.englishName || "",
        }),
      }).catch((e) => console.error(e));
    }
  };

  const togglePlay = () => {
    if (!audio?.src) {
      selectSurah(activeSurahNum);
    } else if (isPlaying) {
      audio?.pause();
    } else {
      audio?.resume();
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const duration = audioDuration || audio?.duration || 0;
    if (duration > 0) {
      const targetTime = percent * duration;
      setAudioTime(targetTime);
      window.dispatchEvent(
        new CustomEvent("quran-audio-seek", { detail: { time: targetTime } })
      );
    }
  };

  const skipSeconds = (offset) => {
    const duration = audioDuration || audio?.duration || 0;
    const newTime = Math.max(0, Math.min(duration, audioTime + offset));
    setAudioTime(newTime);
    window.dispatchEvent(
      new CustomEvent("quran-audio-seek", { detail: { time: newTime } })
    );
  };

  const handleSpeedChange = (rate) => {
    setPlaybackSpeed(rate);
    setShowSpeedMenu(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("__audio_speed__", String(rate));
      } catch (e) {}
    }
    const audioEl = document.querySelector("audio");
    if (audioEl) audioEl.playbackRate = rate;
  };

  const progressPercent = audioDuration > 0 ? (audioTime / audioDuration) * 100 : 0;

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors py-6 sm:py-8 px-4 md:px-6 max-w-screen-2xl mx-auto flex flex-col gap-6 sm:gap-8">
      
      {/* ── 1. Luxury Header Banner ── */}
      <div className="relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-3xl glass border border-emerald-500/20 dark:border-emerald-500/30 shadow-xl transition-all duration-300 animate-fadeIn">
        
        {/* Background Gradients & Ambient Glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/40 dark:from-slate-950/95 dark:via-emerald-950/40 dark:to-slate-900/90 z-0 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-3xl z-0 pointer-events-none" />

        {/* Islamic Arabesque Geometric Backdrop */}
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="playerHeroPattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600 dark:text-emerald-400">
                  <polygon points="35,0 45.5,10.5 59.5,10.5 59.5,24.5 70,35 59.5,45.5 59.5,59.5 45.5,59.5 35,70 24.5,59.5 10.5,59.5 10.5,45.5 0,35 10.5,24.5 10.5,10.5 24.5,10.5" />
                  <circle cx="35" cy="35" r="14" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#playerHeroPattern)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold backdrop-blur-md border border-emerald-500/20 shadow-2xs">
                <Headphones size={14} className="text-emerald-500" />
                High-Fidelity Studio Audio
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-extrabold backdrop-blur-md border border-amber-500/20 shadow-2xs">
                <Sparkles size={13} />
                Word-by-Word Synchronized
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-xs">
              Audio Sanctuary
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Experience the Noble Quran with word-by-word synchronized highlighting, studio recitations by world-renowned Qaris, and high-precision playback controls.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 p-4 rounded-3xl border border-emerald-500/20 dark:border-slate-800 backdrop-blur-xl shrink-0 shadow-lg">
            <div className="text-center px-3">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-mono">114</span>
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Surahs</span>
            </div>
            <div className="h-10 w-px bg-emerald-100 dark:bg-slate-800" />
            <div className="text-center px-3">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100 block font-mono">128</span>
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kbps HQ</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Core Player Workspace ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ── LEFT COLUMN (5 Cols): Vinyl Turntable & Surah Selector ── */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
            
            {/* Illuminated Rotating Turntable Disc */}
            <div className="relative my-4 sm:my-6">
              {/* Radiant Glow Behind Disc */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-2xl transition-all duration-700 ${
                  isPlaying ? "scale-110 opacity-100 animate-pulse" : "scale-95 opacity-40"
                }`}
              />

              {/* Vinyl Record */}
              <div
                className={`w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full border-4 border-slate-800/90 dark:border-slate-700/80 flex items-center justify-center relative shadow-2xl bg-slate-950 transition-all ${
                  isPlaying ? "animate-[spin_20s_linear_infinite]" : ""
                }`}
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #0f172a 20%, #1e293b 25%, #0f172a 35%, #1e293b 45%, #0f172a 55%, #1e293b 65%, #0f172a 75%, #020617 100%)",
                }}
              >
                {/* Vinyl Grooves Center Label with Islamic Star & Arabic Calligraphy */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 border-2 border-amber-400/60 flex flex-col items-center justify-center shadow-inner relative overflow-hidden select-none p-2">
                  <span className="font-arabic text-base sm:text-lg font-bold text-amber-200 drop-shadow-xs">
                    {activeSurahInfo?.arabicName || "القرآن"}
                  </span>
                  <span className="text-[8px] font-extrabold uppercase tracking-widest text-emerald-100 mt-0.5">
                    Surah #{activeSurahNum}
                  </span>
                </div>

                {/* Center Spindle Hole */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 border-2 border-amber-300 shadow-md z-10" />
              </div>
            </div>

            {/* Live Animated Equalizer Waves */}
            <div className="flex items-center justify-center gap-1 my-2 h-6">
              {[40, 70, 100, 60, 90, 45, 80, 55, 95, 65, 35, 75].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all ${
                    isPlaying ? "animate-bounce" : "h-1 opacity-30"
                  }`}
                  style={{
                    height: isPlaying ? `${h}%` : "4px",
                    animationDelay: `${i * 90}ms`,
                    animationDuration: "900ms",
                  }}
                />
              ))}
            </div>

            {/* Surah & Reciter Metadata Details */}
            <div className="relative z-10 mt-3 w-full">
              <div className="flex items-center justify-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                  {activeSurahInfo?.revelationPlace || "Meccan"}
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {activeSurahInfo?.versesCount || 7} Verses
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                {activeSurahInfo?.englishName || "Al-Fatihah"}
              </h2>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                &ldquo;{activeSurahInfo?.translatedName || "The Opening"}&rdquo;
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
                <Radio size={14} className="text-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {audio?.reciterName || "Mishari Rashid al-`Afasy"}
                </span>
              </div>
            </div>

            {/* ── Searchable Surah Quick Selector ── */}
            <div className="w-full mt-6 text-left">
              <label className="block text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Quick Surah Switcher
              </label>

              <div className="relative flex items-center">
                <select
                  value={activeSurahNum}
                  onChange={(e) => selectSurah(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-bold shadow-inner cursor-pointer appearance-none pr-10"
                >
                  {ALL_SURAHS.map((s) => (
                    <option
                      key={s.number}
                      value={s.number}
                      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      {s.number}. {s.englishName} ({s.arabicName}) - {s.translatedName}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* ── RIGHT COLUMN (7 Cols): Immersive Synchronized Verse Reader & Playback Deck ── */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* ── Dynamic Illuminated Verse Display ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl flex flex-col justify-between min-h-[340px] relative overflow-hidden">
            
            {/* Top Coordinate Ribbon */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2">
                {/* 8-Point Rub el Hizb SVG Star Badge */}
                <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <rect x="18" y="18" width="64" height="64" rx="8" fill="#10b981" stroke="#34d399" strokeWidth="2.5" />
                    <rect x="18" y="18" width="64" height="64" rx="8" transform="rotate(45 50 50)" fill="#10b981" stroke="#34d399" strokeWidth="2.5" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-black text-white font-mono leading-none">
                    {activeAyah ? activeAyah.verseKey : `${activeSurahNum}:1`}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                    Verse {activeAyah ? activeAyah.number : 1} of {activeSurahInfo?.versesCount || 7}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {activeSurahInfo?.englishName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-[10px] font-extrabold uppercase">
                  {isPlaying ? "Live Synchronized" : "Ready"}
                </span>
              </div>
            </div>

            {/* Verse Content */}
            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
                <Loader2 className="animate-spin text-emerald-600 dark:text-emerald-400" size={36} />
                <span className="text-xs font-bold">Synchronizing Recitation Timestamp Tokens...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-6 py-6 text-center justify-center flex-1">
                {activeAyah ? (
                  (() => {
                    const ayahData = arabicAyahs[activeAyah.index];
                    const activeWordIndex = getActiveWordIndex(ayahData, audioTime);

                    return (
                      <>
                        {/* Word-by-Word Interactive Arabic Calligraphy */}
                        {ayahData?.words && ayahData.words.length > 0 ? (
                          <div
                            className="flex flex-wrap gap-x-3 sm:gap-x-4 gap-y-4 sm:gap-y-6 justify-center w-full pb-4"
                            dir="rtl"
                          >
                            {ayahData.words.map((word, wIdx) => {
                              const wordText = word.text_qpc_hafs || word.text_uthmani || word.text;
                              const isWord = word.char_type_name === "word";
                              const isActiveWord = isPlaying && activeWordIndex === wIdx;
                              const isHighlightStyle = isActiveWord;
                              const isDimmedStyle = isPlaying && activeWordIndex !== -1 && !isActiveWord;
                              const wordTrans = word.translation?.text;
                              const wordTranslit = word.transliteration?.text;

                              return (
                                <div
                                  key={wIdx}
                                  className={`relative flex flex-col items-center justify-center p-1 rounded-xl transition-all duration-200 group cursor-pointer ${
                                    isHighlightStyle
                                      ? "bg-emerald-500/15 dark:bg-emerald-500/25 ring-2 ring-emerald-500/60 shadow-lg scale-105"
                                      : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                  }`}
                                >
                                  <span
                                    className={`font-arabic ayah-arabic-text select-none transition-all duration-200 text-3xl sm:text-4xl md:text-5xl ${
                                      isHighlightStyle
                                        ? "text-emerald-600 dark:text-emerald-300 font-bold drop-shadow-md"
                                        : isDimmedStyle
                                        ? "text-slate-400 dark:text-slate-600"
                                        : "text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                    }`}
                                  >
                                    {wordText}
                                  </span>

                                  {/* Tooltip on Hover */}
                                  {isWord && (wordTrans || wordTranslit) && (
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center bg-slate-900 dark:bg-slate-800 text-white text-[11px] p-2 rounded-xl shadow-xl z-30 pointer-events-none whitespace-nowrap min-w-[70px] border border-slate-700">
                                      {wordTranslit && (
                                        <span className="font-bold text-amber-300 font-sans tracking-wide mb-0.5" dir="ltr">
                                          {wordTranslit}
                                        </span>
                                      )}
                                      {wordTrans && (
                                        <span className="text-slate-300 font-sans text-center font-medium leading-normal" dir="ltr">
                                          {wordTrans}
                                        </span>
                                      )}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900 dark:border-t-slate-800" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="font-arabic ayah-arabic-text text-center leading-loose text-slate-950 dark:text-slate-100 font-bold select-none text-3xl sm:text-4xl md:text-5xl">
                            {activeAyah.arabic}
                          </p>
                        )}

                        {/* Translation Block */}
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 text-left">
                          <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                            &ldquo;{activeAyah.translation}&rdquo;
                          </p>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <p className="text-xs text-center text-gray-500 font-bold">Select a Surah to begin recitation playback.</p>
                )}
              </div>
            )}
          </div>

          {/* ── Studio Control Center Deck ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl flex flex-col gap-6">
            
            {/* Seekable Waveform Progress Bar */}
            <div className="flex flex-col gap-2">
              <div
                onClick={handleSeek}
                className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer relative overflow-hidden group shadow-inner"
              >
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-150 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-mono font-bold text-gray-500 dark:text-gray-400 px-0.5">
                <span>{formatTime(audioTime)}</span>
                <span>{formatTime(audioDuration || audio?.duration || 0)}</span>
              </div>
            </div>

            {/* Playback Buttons Strip */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              
              {/* Left Speed Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-extrabold transition-all border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Sliders size={13} />
                  <span>{playbackSpeed}x</span>
                </button>

                {showSpeedMenu && (
                  <div className="absolute left-0 bottom-full mb-2 w-28 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 flex flex-col gap-1">
                    {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => handleSpeedChange(rate)}
                        className={`w-full px-3 py-1.5 text-xs font-bold text-left rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                          playbackSpeed === rate
                            ? "bg-emerald-600 text-white"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span>{rate}x</span>
                        {playbackSpeed === rate && <Check size={12} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Center Main Controls: Prev, -10s, Play/Pause, +10s, Next */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => selectSurah(Math.max(1, activeSurahNum - 1))}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-all cursor-pointer shadow-2xs"
                  title="Previous Surah"
                >
                  <SkipBack size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => skipSeconds(-10)}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
                  title="Rewind 10s"
                >
                  <RotateCcw size={17} />
                </button>

                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => skipSeconds(10)}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs"
                  title="Forward 10s"
                >
                  <RotateCw size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => selectSurah(Math.min(114, activeSurahNum + 1))}
                  className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-all cursor-pointer shadow-2xs"
                  title="Next Surah"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Right Status Badge */}
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Surah {activeSurahNum} / 114
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ── 3. Bottom All 114 Surahs Playlist Cards ── */}
      <div className="w-full mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Surah Tracklist
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Instant play any chapter from the complete 114 Surah library
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search chapters..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pb-12">
          {filteredSurahs.map((s) => {
            const isSelected = activeSurahNum === s.number;
            const isThisPlaying = isSelected && isPlaying;

            return (
              <button
                key={s.number}
                type="button"
                onClick={() => selectSurah(s.number)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500/10 dark:bg-emerald-950/40 border-2 border-emerald-500/80 dark:border-emerald-400/80 shadow-md shadow-emerald-500/10 scale-[1.02]"
                    : "bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-900 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-mono text-xs font-black ${
                      isSelected ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                    }`}
                  >
                    #{s.number}
                  </span>
                  <span className="font-arabic text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {s.arabicName}
                  </span>
                </div>

                <div className="min-w-0 w-full">
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">
                    {s.englishName}
                  </h4>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate block">
                    {s.versesCount} Verses
                  </span>
                </div>

                {isThisPlaying && (
                  <div className="flex items-center gap-0.5 h-2">
                    <span className="w-1 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1 h-full bg-emerald-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </main>
  );
}
