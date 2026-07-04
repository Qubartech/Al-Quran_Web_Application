"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, RefreshCw, Copy, Check } from "lucide-react";

const INSPIRATIONAL_AYAHS = [
  {
    arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "For indeed, with hardship [will be] ease.",
    surah: "Al-Inshirah",
    reference: "94:5"
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "So remember Me; I will remember you.",
    surah: "Al-Baqarah",
    reference: "2:152"
  },
  {
    arabic: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    translation: "My mercy encompasses all things.",
    surah: "Al-A'raf",
    reference: "7:156"
  },
  {
    arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "Indeed, Allah is with the patient.",
    surah: "Al-Baqarah",
    reference: "2:153"
  },
  {
    arabic: "وَوَجَدَكَ ضَالًّا فَهَدَىٰ",
    translation: "And He found you lost and guided [you].",
    surah: "Ad-Duha",
    reference: "93:7"
  },
  {
    arabic: "وَقُولُوا لِلنَّاسِ حُسْنًا",
    translation: "And speak to people good [words].",
    surah: "Al-Baqarah",
    reference: "2:83"
  },
  {
    arabic: "إِنَّ رَبِّي قَرِيبٌ مُّجِيبٌ",
    translation: "Indeed, my Lord is near and responsive.",
    surah: "Hud",
    reference: "11:61"
  },
  {
    arabic: "وَعَلَى اللَّهِ فَتَوَكَّلُوا إِن كُنتُم مُّؤْمِنِينَ",
    translation: "And upon Allah let the believers rely.",
    surah: "Al-Ma'idah",
    reference: "5:23"
  },
  {
    arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
    translation: "Our Lord, let not our hearts deviate after You have guided us.",
    surah: "Aal-E-Imran",
    reference: "3:8"
  },
  {
    arabic: "وَأَنْ لَيْسَ لِلْإِنْسَانِ إِلَّا مَا سَعَىٰ",
    translation: "And that there is not for man except that for which he strives.",
    surah: "An-Najm",
    reference: "53:39"
  }
];

const POPULAR_SURAHS = [
  { name: "Yaseen", id: 36, subtitle: "Heart of Quran", icon: "✨" },
  { name: "Al-Mulk", id: 67, subtitle: "The Sovereignty", icon: "👑" },
  { name: "Al-Kahf", id: 18, subtitle: "The Cave", icon: "⛰️" },
  { name: "Ar-Rahman", id: 55, subtitle: "The Merciful", icon: "🌸" },
  { name: "Al-Waqi'ah", id: 56, subtitle: "The Event", icon: "💎" }
];

export default function HomeWelcome() {
  const [greeting, setGreeting] = useState("Assalamu Alaikum");
  const [ayah, setAyah] = useState(INSPIRATIONAL_AYAHS[0]);
  const [copied, setCopied] = useState(false);
  const [rotating, setRotating] = useState(false);

  useEffect(() => {
    // Choose greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Assalamu Alaikum, Good Morning");
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Assalamu Alaikum, Good Afternoon");
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Assalamu Alaikum, Good Evening");
    } else {
      setGreeting("Assalamu Alaikum, Good Night");
    }

    // Set static random ayah on initial mount
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

  return (
    <div className="flex flex-col gap-6 w-full mb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden p-6 rounded-2xl glass border border-primaryColor/10 dark:border-emerald-500/10 flex flex-col justify-center min-h-[120px] shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primaryColor/5 to-teal-500/5 dark:from-primaryColor/10 dark:to-teal-500/10 z-0"></div>
        <div className="relative z-10 flex flex-col gap-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light">
            Welcome to Quran App
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {greeting}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Read, listen, study and contemplate the words of Allah.
          </p>
        </div>
      </div>

      {/* Daily Ayah & Popular Surahs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Daily Ayah Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col justify-between group transition-all duration-300">
          <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-primaryColor/5 dark:bg-emerald-500/5 blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
              <BookOpen size={14} />
              Daily Inspiration
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-slate-800 text-gray-400 hover:text-primaryColor transition-colors"
                title="Copy Verse"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
              <button
                onClick={handleRefreshAyah}
                disabled={rotating}
                className="p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-slate-800 text-gray-400 hover:text-primaryColor transition-colors"
                title="Refresh Verse"
              >
                <RefreshCw size={14} className={rotating ? "animate-spin text-primaryColor" : ""} />
              </button>
            </div>
          </div>

          <div className="my-2 flex flex-col gap-4">
            {/* Arabic Text */}
            <p className="font-arabic text-2xl md:text-3xl text-right leading-loose text-slate-800 dark:text-slate-100 font-medium select-none min-h-[48px]">
              {ayah.arabic}
            </p>
            {/* Translation */}
            <p className="text-sm italic text-gray-650 dark:text-gray-300 leading-relaxed font-sans">
              &quot;{ayah.translation}&quot;
            </p>
          </div>

          <div className="mt-4 border-t border-gray-100 dark:border-slate-800/80 pt-3 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 font-semibold">
            <span>Surah {ayah.surah}</span>
            <span className="bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor dark:text-primaryColor-light px-2.5 py-0.5 rounded-full">
              Verse {ayah.reference}
            </span>
          </div>
        </div>

        {/* Popular Surahs Card */}
        <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light mb-3 block">
              Quick Access
            </span>
            <div className="flex flex-col gap-2">
              {POPULAR_SURAHS.map((s) => (
                <Link
                  href={`/surah/${s.id}`}
                  key={s.id}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-200/40 dark:border-slate-800/40 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 bg-white/30 dark:bg-slate-900/30 hover:bg-white/60 dark:bg-slate-800/30 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base select-none shrink-0 group-hover:scale-110 transition-transform">{s.icon}</span>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primaryColor transition-colors">
                        Surah {s.name}
                      </h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {s.subtitle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-primaryColor transition-colors pl-2">
                    #{s.id}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
