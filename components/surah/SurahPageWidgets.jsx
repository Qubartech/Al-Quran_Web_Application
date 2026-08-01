"use client";

import Link from "next/link";
import { QURANICAUDIO_BASE_URL } from "@/lib/api/config";
import { useUser } from "@/context/UserProvider";
import { useAudio } from "@/context/AudioProvider";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  BookOpen,
  Layers,
  Play,
  Headphones,
  ArrowRight,
  History,
  Bookmark,
  Loader2,
  Star,
  Heart,
  Moon,
  Compass,
} from "lucide-react";

// Curated Islamic reminders (Hadith excerpts & Duas)
const ISLAMIC_REMINDERS = [
  {
    text: "The best among you are those who learn the Quran and teach it.",
    source: "Sahih al-Bukhari 5027",
    icon: "📖",
  },
  {
    text: "Indeed, with hardship comes ease.",
    source: "Quran 94:6",
    icon: "🌅",
  },
  {
    text: "Whoever reads Surah Al-Kahf on Friday, light shall shine for him between two Fridays.",
    source: "Sahih al-Jami 6470",
    icon: "💡",
  },
  {
    text: "The Messenger of Allah (ﷺ) said: \"Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.\"",
    source: "Sahih Muslim 804",
    icon: "🤲",
  },
  {
    text: "And when My servants ask you concerning Me — indeed I am near.",
    source: "Quran 2:186",
    icon: "✨",
  },
  {
    text: "So remember Me; I will remember you.",
    source: "Quran 2:152",
    icon: "💚",
  },
];

const QUICK_LINKS = [
  { href: "/surah/1", label: "Al-Fatihah", desc: "The Opening", icon: Star },
  { href: "/surah/36", label: "Ya-Sin", desc: "Heart of Quran", icon: Heart },
  { href: "/surah/67", label: "Al-Mulk", desc: "The Sovereignty", icon: Moon },
  { href: "/juz", label: "Juz / Paras", desc: "Browse by Juz", icon: Layers },
  { href: "/player", label: "Dedicated Player", desc: "Audio recitations", icon: Headphones },
];

export default function SurahPageWidgets() {
  const { user, session } = useUser();
  const audio = useAudio();

  const [recents, setRecents] = useState([]);
  const [favoriteAyahs, setFavoriteAyahs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reminderIndex, setReminderIndex] = useState(0);

  // Rotate daily reminder based on date
  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    setReminderIndex(seed % ISLAMIC_REMINDERS.length);
  }, []);

  // Fetch user activity
  useEffect(() => {
    if (!user || !session?.access_token) return;

    setLoading(true);
    Promise.all([
      fetch("/api/recent", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()),
      fetch("/api/favorites/ayah", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()),
    ])
      .then(([recentsData, ayahsData]) => {
        setRecents(Array.isArray(recentsData) ? recentsData.slice(0, 4) : []);
        setFavoriteAyahs(Array.isArray(ayahsData) ? ayahsData.slice(0, 3) : []);
      })
      .catch((e) => console.error("Error loading activity:", e))
      .finally(() => setLoading(false));
  }, [user, session?.access_token]);

  const playSurah = (surahNumber, surahName) => {
    const fullAudioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;
    audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, surahName);
  };

  const currentReminder = ISLAMIC_REMINDERS[reminderIndex];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Widget: Islamic Reminder */}
      <div className="relative overflow-hidden p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-orange-500/3 to-rose-500/5 dark:from-amber-500/8 dark:via-orange-500/5 dark:to-rose-500/8 pointer-events-none z-0"></div>
        <div className="relative z-10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-4">
            <Moon size={14} />
            Daily Reminder
          </h3>
          <div className="flex gap-3">
            <span className="text-2xl shrink-0 mt-0.5">{currentReminder.icon}</span>
            <div>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium italic">
                &ldquo;{currentReminder.text}&rdquo;
              </p>
              <span className="text-[10px] font-bold text-amber-600/70 dark:text-amber-400/70 mt-2 block">
                — {currentReminder.source}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Widget: Quran Insights */}
      <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
          <TrendingUp size={14} />
          Quran Insights
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-white/25 dark:bg-slate-900/30 border border-gray-200/20 dark:border-slate-800/20 flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">114</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Chapters (Surahs)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/25 dark:bg-slate-900/30 border border-gray-200/20 dark:border-slate-800/20 flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">6,236</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Verses (Ayahs)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/25 dark:bg-slate-900/30 border border-gray-200/20 dark:border-slate-800/20 flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">86</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Meccan (Makki)</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white/25 dark:bg-slate-900/30 border border-gray-200/20 dark:border-slate-800/20 flex flex-col gap-0.5">
            <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">28</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">Medinan (Madani)</span>
          </div>
        </div>
      </div>

      {/* Widget: Quick Navigation */}
      <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
          <Compass size={14} />
          Quick Access
        </h3>
        <div className="flex flex-col gap-2">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-3 rounded-xl bg-white/20 dark:bg-slate-900/10 border border-gray-200/20 dark:border-slate-800/20 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor dark:text-primaryColor-light flex items-center justify-center group-hover:bg-primaryColor group-hover:text-white transition-all">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-primaryColor transition-colors truncate">
                      {link.label}
                    </h4>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate">
                      {link.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-primaryColor transition-colors shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Widget: My Activity */}
      <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
          <History size={14} />
          My Activity
        </h3>

        {!user ? (
          <div className="flex flex-col items-center text-center p-4 py-6 rounded-xl border border-gray-200/30 dark:border-slate-800/40 bg-white/15 dark:bg-slate-900/10">
            <Bookmark size={24} className="text-gray-400 mb-2.5" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Track Your Progress</h4>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold leading-relaxed mb-4">
              Sign In to save your reading history, bookmark verses, and track your Quran journey.
            </p>
            <Link
              href="/login"
              className="px-4 py-2 text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all shadow-sm"
            >
              Sign In
            </Link>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-slate-500">
            <Loader2 className="animate-spin text-primaryColor" size={18} />
            <span className="text-[10px] font-bold">Loading activity...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Recent Reads */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-2">
                <History size={12} />
                Recent Reads
              </span>
              {recents.length === 0 ? (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 italic pl-1">No reading history yet.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {recents.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/20 dark:bg-slate-900/10 border border-gray-150/20 dark:border-slate-850/20"
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate">
                          Surah {item.surahName}
                        </h4>
                        <p className="text-[8px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Surah #{item.surahNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => playSurah(item.surahNumber, item.surahName)}
                          className="p-1 rounded bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor hover:bg-primaryColor hover:text-white dark:hover:bg-primaryColor transition-all"
                        >
                          <Play size={10} fill="currentColor" />
                        </button>
                        <Link
                          href={`/surah/${item.surahNumber}`}
                          className="text-[9px] font-extrabold text-gray-400 hover:text-primaryColor pl-0.5"
                        >
                          Read →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bookmarked Ayahs */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-2">
                <BookOpen size={12} />
                Bookmarked Ayahs
              </span>
              {favoriteAyahs.length === 0 ? (
                <p className="text-[10px] text-gray-500 dark:text-gray-400 italic pl-1">No bookmarks yet.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {favoriteAyahs.map((item) => (
                    <Link
                      key={item.id}
                      href={`/surah/${item.surahNumber}`}
                      className="block p-2.5 rounded-xl bg-white/20 dark:bg-slate-900/10 border border-gray-150/20 dark:border-slate-850/20 hover:border-primaryColor/30 dark:hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex justify-between items-center text-[8px] text-gray-400 dark:text-gray-500 font-bold mb-1">
                        <span>{item.surahName}</span>
                        <span>Ayah {item.ayahNumber}</span>
                      </div>
                      <p className="font-arabic text-sm text-right text-slate-800 dark:text-slate-200 truncate" dir="rtl">
                        {item.arabicText}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
