"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  RefreshCw, 
  Copy, 
  Check, 
  Play, 
  Pause, 
  Sparkles, 
  Sun, 
  Moon, 
  Sunrise, 
  Sunset,
  ArrowRight,
  Search,
  Volume2,
  Share2,
  Compass,
  Bookmark
} from "lucide-react";
import NamazTimeWrapper from "@/components/NamazTimeWrapper";
import QuickAccessCard from "./QuickAccessCard";
import TodayCalendarCard from "./TodayCalendarCard";
import { useAudio } from "@/context/AudioProvider";

const INSPIRATIONAL_AYAHS = [
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease.",
    surah: "Al-Inshirah",
    surahNum: 94,
    ayahNum: 5,
    reference: "94:5"
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "So remember Me; I will remember you.",
    surah: "Al-Baqarah",
    surahNum: 2,
    ayahNum: 152,
    reference: "2:152"
  },
  {
    arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    translation: "My mercy encompasses all things.",
    surah: "Al-A'raf",
    surahNum: 7,
    ayahNum: 156,
    reference: "7:156"
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Indeed, Allah is with the patient.",
    surah: "Al-Baqarah",
    surahNum: 2,
    ayahNum: 153,
    reference: "2:153"
  },
  {
    arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
    translation: "And He found you lost and guided [you].",
    surah: "Ad-Duha",
    surahNum: 93,
    ayahNum: 7,
    reference: "93:7"
  },
  {
    arabic: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ",
    translation: "Indeed, my Lord is near and responsive.",
    surah: "Hud",
    surahNum: 11,
    ayahNum: 61,
    reference: "11:61"
  },
  {
    arabic: "وَعَلَى اللَّهِ فَتَوَكَّلُوا إِن كُنتُم مُّؤْمِنِينَ",
    translation: "And upon Allah let the believers rely.",
    surah: "Al-Ma'idah",
    surahNum: 5,
    ayahNum: 23,
    reference: "5:23"
  },
  {
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
    translation: "Our Lord, let not our hearts deviate after You have guided us.",
    surah: "Aal-E-Imran",
    surahNum: 3,
    ayahNum: 8,
    reference: "3:8"
  }
];

const POPULAR_QUICK_SURAHS = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة" },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة" },
  { number: 18, name: "Al-Kahf", arabic: "الكهف" },
  { number: 36, name: "Ya-Sin", arabic: "يس" },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن" },
  { number: 67, name: "Al-Mulk", arabic: "الملك" },
];

export default function HomeWelcome() {
  const audio = useAudio();
  const [greetingInfo, setGreetingInfo] = useState({ text: "Assalamu Alaikum", icon: Sun });
  const [ayah, setAyah] = useState(INSPIRATIONAL_AYAHS[0]);
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) {
      setGreetingInfo({ text: "Good Morning & Peace be upon you", icon: Sunrise });
    } else if (hour >= 11 && hour < 16) {
      setGreetingInfo({ text: "Good Afternoon & Blessed Day", icon: Sun });
    } else if (hour >= 16 && hour < 20) {
      setGreetingInfo({ text: "Good Evening & Blessed Time", icon: Sunset });
    } else {
      setGreetingInfo({ text: "Good Night & Peaceful Rest", icon: Moon });
    }

    const randomIdx = Math.floor(Math.random() * INSPIRATIONAL_AYAHS.length);
    setAyah(INSPIRATIONAL_AYAHS[randomIdx]);
  }, []);

  const handleRefreshAyah = () => {
    setRotating(true);
    let nextAyah;
    do {
      const idx = Math.floor(Math.random() * INSPIRATIONAL_AYAHS.length);
      nextAyah = INSPIRATIONAL_AYAHS[idx];
    } while (nextAyah.reference === ayah.reference);

    setTimeout(() => {
      setAyah(nextAyah);
      setRotating(false);
    }, 400);
  };

  const handleCopy = async () => {
    const textToCopy = `"${ayah.translation}" - Surah ${ayah.surah} (${ayah.reference})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePlayAyah = () => {
    if (!audio) return;
    const trackId = `ayah_${ayah.surahNum}_${ayah.ayahNum}`;
    const isPlayingCurrent = (audio.playlistId === trackId || audio.trackId === trackId) && !audio.paused;

    if (isPlayingCurrent) {
      audio.pause();
    } else {
      const surahPadded = String(ayah.surahNum).padStart(3, "0");
      const ayahPadded = String(ayah.ayahNum).padStart(3, "0");
      const singleAyahAudioUrl = `https://verses.quran.com/Alafasy/mp3/${surahPadded}${ayahPadded}.mp3`;
      audio.playList([singleAyahAudioUrl], 0, trackId, `Surah ${ayah.surah} • Ayah ${ayah.ayahNum}`);
    }
  };

  const GreetingIcon = greetingInfo.icon;
  const isAudioPlayingThis = 
    (audio?.playlistId === `ayah_${ayah.surahNum}_${ayah.ayahNum}` || audio?.trackId === `ayah_${ayah.surahNum}_${ayah.ayahNum}`) && 
    !audio?.paused;

  const openGlobalSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("quran-open-global-search"));
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mb-8">
      
      {/* ── 1. Luxury Hero Welcome Banner ── */}
      <div className="relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-3xl glass border border-emerald-500/20 dark:border-emerald-500/30 shadow-xl transition-all duration-300 animate-fadeIn">
        
        {/* Background Gradient & Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/40 dark:from-slate-950/95 dark:via-emerald-950/40 dark:to-slate-900/90 z-0 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-3xl z-0 pointer-events-none" />

        {/* Islamic Arabesque Geometric Pattern */}
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="islamicHomePattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600 dark:text-emerald-400">
                  <polygon points="35,0 45.5,10.5 59.5,10.5 59.5,24.5 70,35 59.5,45.5 59.5,59.5 45.5,59.5 35,70 24.5,59.5 10.5,59.5 10.5,45.5 0,35 10.5,24.5 10.5,10.5 24.5,10.5" />
                  <circle cx="35" cy="35" r="14" />
                  <circle cx="35" cy="35" r="6" />
                  <path d="M 0,0 L 70,70 M 70,0 L 0,70" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#islamicHomePattern)" />
          </svg>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-200 text-xs font-extrabold backdrop-blur-md border border-emerald-200/50 dark:border-slate-800 shadow-2xs">
                <GreetingIcon size={14} className="text-amber-500 animate-pulse" /> {greetingInfo.text}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold backdrop-blur-md border border-emerald-500/20 shadow-2xs">
                <Sparkles size={14} className="text-emerald-600 dark:text-emerald-400" /> Al-Quran Divine Portal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
              Assalamu Alaikum Wa Rahmatullah
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
              Read, listen, memorize, and reflect upon the Holy Quran with word-by-word translations, studio-quality recitations, and daily prayer tracking.
            </p>

            {/* Quick Popular Surah Jump Pills */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mr-1">
                Quick Jump:
              </span>
              {POPULAR_QUICK_SURAHS.map((s) => (
                <Link
                  key={s.number}
                  href={`/surah/${s.number}`}
                  className="px-2.5 py-1 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-emerald-500/15 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 group"
                >
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">
                    #{s.number}
                  </span>
                  <span>{s.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <Link
              href="/surah/1"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen size={16} />
              Start Reading (Surah 1)
            </Link>

            <button
              onClick={openGlobalSearch}
              className="px-5 py-3 rounded-2xl bg-white/80 hover:bg-white dark:bg-slate-900/80 dark:hover:bg-slate-900 text-slate-800 dark:text-white text-xs font-black backdrop-blur-md border border-emerald-500/30 dark:border-slate-700 transition-all flex items-center justify-center gap-2 shadow-2xs hover:scale-[1.02] cursor-pointer"
            >
              <Search size={16} className="text-emerald-500" />
              <span>Search Quran</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-gray-100 dark:bg-slate-800 rounded border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 ml-1">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

      </div>

      {/* ── 2. Interactive Verse of the Day Card ── */}
      <div className="w-full">
        <div className="p-5 sm:p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 dark:border-emerald-500/30 shadow-lg relative overflow-hidden flex flex-col justify-between group transition-all duration-300">
          
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-emerald-500/10 dark:bg-emerald-400/5 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-gray-200/50 dark:border-slate-800 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Sparkles size={16} />
              Verse of the Day & Contemplation
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayAyah}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isAudioPlayingThis
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                    : "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                }`}
                title="Play Audio Recitation"
              >
                {isAudioPlayingThis ? (
                  <>
                    <div className="flex items-center gap-0.5 h-3">
                      <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                      <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                      <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                    </div>
                    <Pause size={13} />
                    <span>Playing</span>
                  </>
                ) : (
                  <>
                    <Play size={13} className="fill-current" />
                    <span>Listen Audio</span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Copy Verse with Translation"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>

              <button
                onClick={handleRefreshAyah}
                disabled={rotating}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer"
                title="Inspire Me (Shuffle Verse)"
              >
                <RefreshCw size={16} className={rotating ? "animate-spin text-emerald-600" : ""} />
              </button>
            </div>
          </div>

          {/* Ayah Content */}
          <div className="my-3 flex flex-col gap-4">
            <p className="font-arabic text-2xl sm:text-3xl md:text-4xl text-right leading-loose text-slate-900 dark:text-slate-100 font-semibold select-none min-h-[56px] drop-shadow-xs" dir="rtl">
              {ayah.arabic}
            </p>

            <p className="text-sm sm:text-base italic text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
              &ldquo;{ayah.translation}&rdquo;
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-4 border-t border-gray-200/50 dark:border-slate-800 pt-4 flex justify-between items-center text-xs font-bold text-gray-500 dark:text-gray-400">
            <Link
              href={`/surah/${ayah.surahNum}`}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors group"
            >
              <span>Read Full Surah {ayah.surah}</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/20 font-mono font-black">
              Verse {ayah.reference}
            </span>
          </div>

        </div>
      </div>

      {/* ── 3. Today's Calendar & Prayer Habits Widget ── */}
      <TodayCalendarCard />

      {/* ── 4. Equal Height Quick Access Grid & Namaz Widget ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <QuickAccessCard className="h-full" />
        <NamazTimeWrapper className="h-full" />
      </div>

    </div>
  );
}
