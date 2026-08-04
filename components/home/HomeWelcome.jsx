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
  ArrowRight
} from "lucide-react";
import NamazTimeWrapper from "@/components/NamazTimeWrapper";
import QuickAccessCard from "./QuickAccessCard";
import { useAudio } from "@/context/AudioProvider";
import { QURANICAUDIO_BASE_URL } from "@/lib/api/config";

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
    const isPlayingCurrent = audio.trackId === trackId && audio.isPlaying;

    if (isPlayingCurrent) {
      audio.togglePlay();
    } else {
      const audioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${ayah.surahNum}.mp3`;
      audio.playList([audioUrl], 0, trackId, `Surah ${ayah.surah} (${ayah.reference})`);
    }
  };

  const GreetingIcon = greetingInfo.icon;
  const isAudioPlayingThis = audio?.trackId === `ayah_${ayah.surahNum}_${ayah.ayahNum}` && audio?.isPlaying;

  return (
    <div className="flex flex-col gap-6 w-full mb-8">
      
      {/* 1. Hero Welcome Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-xl shadow-emerald-500/10 flex flex-col justify-between min-h-[140px] transition-all duration-300">
        
        {/* Decorative Glow */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-56 h-56 rounded-full bg-teal-300/10 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-extrabold backdrop-blur-md border border-white/20">
                <GreetingIcon size={14} className="text-amber-300 animate-pulse" /> {greetingInfo.text}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-100 text-[11px] font-bold border border-white/15">
                <Sparkles size={12} className="text-amber-300" /> Al-Quran Divine Portal
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight drop-shadow-sm">
              Assalamu Alaikum Wa Rahmatullah
            </h1>
            <p className="text-xs md:text-sm text-emerald-100 font-medium leading-relaxed">
              Read, listen, memorize, and reflect upon the Holy Quran with word-by-word guidance, audio recitations, and daily prayer tracking.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/learn"
              className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-black transition-all shadow-lg hover:scale-105 flex items-center gap-1.5"
            >
              <BookOpen size={15} className="text-emerald-600" />
              Learn Tajweed
            </Link>

            <Link
              href="/player"
              className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-black backdrop-blur-md border border-white/25 transition-all flex items-center gap-1.5"
            >
              <Play size={15} className="fill-white" />
              Audio Player
            </Link>
          </div>
        </div>

      </div>

      {/* 2. Interactive Verse of the Day Card */}
      <div className="w-full">
        <div className="p-5 sm:p-6 md:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between group transition-all duration-300">
          
          <div className="absolute -right-20 -top-20 w-52 h-52 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700"></div>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <BookOpen size={16} />
              Verse of the Day & Inspiration
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayAyah}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isAudioPlayingThis
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                }`}
                title="Play Audio Recitation"
              >
                {isAudioPlayingThis ? (
                  <>
                    <Pause size={14} className="fill-white" /> Playing
                  </>
                ) : (
                  <>
                    <Play size={14} className="fill-emerald-600 dark:fill-emerald-400" /> Listen Audio
                  </>
                )}
              </button>

              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition-colors"
                title="Copy Verse"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>

              <button
                onClick={handleRefreshAyah}
                disabled={rotating}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition-colors"
                title="Inspire Me (Shuffle Verse)"
              >
                <RefreshCw size={16} className={rotating ? "animate-spin text-emerald-600" : ""} />
              </button>
            </div>
          </div>

          {/* Ayah Content */}
          <div className="my-3 flex flex-col gap-5">
            <p className="font-arabic text-2xl md:text-4xl text-right leading-loose text-slate-900 dark:text-slate-100 font-semibold select-none min-h-[56px] drop-shadow-sm" dir="rtl">
              {ayah.arabic}
            </p>

            <p className="text-sm md:text-base italic text-slate-700 dark:text-slate-300 leading-relaxed font-sans font-medium">
              &quot;{ayah.translation}&quot;
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <Link
              href={`/surah/${ayah.surahNum}`}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <span>Surah {ayah.surah}</span>
              <ArrowRight size={13} />
            </Link>

            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-mono">
              Verse {ayah.reference}
            </span>
          </div>

        </div>
      </div>

      {/* 3. Equal Height Quick Access Grid & Namaz Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <QuickAccessCard className="h-full" />
        <NamazTimeWrapper className="h-full" />
      </div>

    </div>
  );
}
