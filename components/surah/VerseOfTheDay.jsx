"use client";

import { useState, useEffect } from "react";
import { BookOpen, RefreshCw, Volume2, Copy, Check, Sparkles } from "lucide-react";

// Curated list of impactful ayahs (surah:ayah)
const CURATED_AYAHS = [
  { surah: 2, ayah: 286, surahName: "Al-Baqarah" },
  { surah: 2, ayah: 255, surahName: "Al-Baqarah" },  // Ayatul Kursi
  { surah: 3, ayah: 139, surahName: "Ali 'Imran" },
  { surah: 13, ayah: 28, surahName: "Ar-Ra'd" },
  { surah: 2, ayah: 152, surahName: "Al-Baqarah" },
  { surah: 94, ayah: 5, surahName: "Ash-Sharh" },
  { surah: 94, ayah: 6, surahName: "Ash-Sharh" },
  { surah: 55, ayah: 13, surahName: "Ar-Rahman" },
  { surah: 3, ayah: 173, surahName: "Ali 'Imran" },
  { surah: 65, ayah: 3, surahName: "At-Talaq" },
  { surah: 8, ayah: 30, surahName: "Al-Anfal" },
  { surah: 9, ayah: 51, surahName: "At-Tawbah" },
  { surah: 39, ayah: 53, surahName: "Az-Zumar" },
  { surah: 20, ayah: 114, surahName: "Ta-Ha" },
  { surah: 49, ayah: 13, surahName: "Al-Hujurat" },
  { surah: 16, ayah: 97, surahName: "An-Nahl" },
  { surah: 67, ayah: 2, surahName: "Al-Mulk" },
  { surah: 21, ayah: 87, surahName: "Al-Anbiya" },
  { surah: 40, ayah: 60, surahName: "Ghafir" },
  { surah: 73, ayah: 8, surahName: "Al-Muzzammil" },
  { surah: 2, ayah: 186, surahName: "Al-Baqarah" },
  { surah: 112, ayah: 1, surahName: "Al-Ikhlas" },
  { surah: 1, ayah: 1, surahName: "Al-Fatihah" },
  { surah: 36, ayah: 58, surahName: "Ya-Sin" },
];

function getDailyIndex() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % CURATED_AYAHS.length;
}

export default function VerseOfTheDay() {
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(getDailyIndex());

  const fetchVerse = async (index) => {
    setLoading(true);
    setError(false);
    const pick = CURATED_AYAHS[index];

    try {
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${pick.surah}:${pick.ayah}`),
        fetch(`https://api.quran.com/api/v4/quran/translations/131?verse_key=${pick.surah}:${pick.ayah}`),
      ]);

      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();

      const arabicText = arabicData?.verses?.[0]?.text_uthmani || "";
      let translationText = translationData?.translations?.[0]?.text || "";
      // Strip HTML tags from translation
      translationText = translationText.replace(/<[^>]*>/g, "");

      setVerse({
        arabic: arabicText,
        translation: translationText,
        surahName: pick.surahName,
        surahNumber: pick.surah,
        ayahNumber: pick.ayah,
      });
    } catch (e) {
      console.error("Failed to fetch verse:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerse(currentIndex);
  }, [currentIndex]);

  const handleRefresh = () => {
    const newIndex = (currentIndex + 1) % CURATED_AYAHS.length;
    setCurrentIndex(newIndex);
  };

  const handleCopy = async () => {
    if (!verse) return;
    const text = `${verse.arabic}\n\n"${verse.translation}"\n\n— ${verse.surahName} (${verse.surahNumber}:${verse.ayahNumber})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm">
      {/* Gradient Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-teal-500/5 to-cyan-500/8 dark:from-emerald-500/12 dark:via-teal-500/8 dark:to-cyan-500/12 pointer-events-none z-0"></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
            <Sparkles size={14} className="animate-pulse" />
            Verse of the Day
          </h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-white/30 dark:bg-slate-900/30 text-gray-500 hover:text-primaryColor hover:bg-primaryColor/10 transition-all border border-transparent hover:border-primaryColor/20"
              title="Copy verse"
            >
              {copied ? <Check size={13} className="text-primaryColor" /> : <Copy size={13} />}
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 rounded-lg bg-white/30 dark:bg-slate-900/30 text-gray-500 hover:text-primaryColor hover:bg-primaryColor/10 transition-all border border-transparent hover:border-primaryColor/20 disabled:opacity-40"
              title="Next verse"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-primaryColor/30 border-t-primaryColor animate-spin"></div>
            <span className="text-[10px] font-bold text-gray-400">Loading verse...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
            <BookOpen size={24} className="text-gray-400" />
            <p className="text-xs text-gray-500 font-medium">Could not load verse. Please try again.</p>
            <button onClick={handleRefresh} className="text-[10px] font-bold text-primaryColor hover:underline mt-1">
              Retry
            </button>
          </div>
        ) : verse ? (
          <div className="flex flex-col gap-4">
            {/* Arabic Text */}
            <div className="p-5 rounded-xl bg-white/20 dark:bg-slate-900/20 border border-gray-200/20 dark:border-slate-800/30">
              <p
                className="font-arabic text-2xl md:text-3xl text-slate-800 dark:text-slate-100 text-right leading-[2.2] font-medium"
                dir="rtl"
              >
                {verse.arabic}
              </p>
            </div>

            {/* Translation */}
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium italic">
              &ldquo;{verse.translation}&rdquo;
            </p>

            {/* Reference */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200/30 dark:border-slate-800/40">
              <a
                href={`/surah/${verse.surahNumber}`}
                className="flex items-center gap-2 text-xs font-bold text-primaryColor dark:text-primaryColor-light hover:underline"
              >
                <BookOpen size={12} />
                {verse.surahName} ({verse.surahNumber}:{verse.ayahNumber})
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
