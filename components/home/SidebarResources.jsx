"use client";

import { useEffect, useState } from "react";
import { QURANICAUDIO_BASE_URL } from "@/lib/api/config";
import Link from "next/link";
import { useUser } from "@/context/UserProvider";
import { useAudio } from "@/context/AudioProvider";
import { 
  BookOpen, 
  History, 
  Bookmark, 
  Play, 
  Loader2, 
  TrendingUp, 
  Compass,
  Sparkles,
  ArrowRight,
  Layers,
  Award
} from "lucide-react";

export default function SidebarResources() {
  const { user, session } = useUser();
  const audio = useAudio();

  const [recents, setRecents] = useState([]);
  const [favoriteAyahs, setFavoriteAyahs] = useState([]);
  const [loading, setLoading] = useState(false);

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
      .catch((e) => console.error("Error loading sidebar activity:", e))
      .finally(() => setLoading(false));
  }, [user, session?.access_token]);

  const playSurah = (surahNumber, surahName) => {
    const fullAudioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;
    audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, surahName);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Widget 1: Quran Insights & Structure */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 dark:border-slate-800/80 shadow-lg flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <TrendingUp size={16} />
            Quran Insights & Structure
          </h3>
          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            Overview
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-teal-500/10 dark:from-slate-800/60 dark:to-slate-800/30 border border-emerald-500/20 dark:border-slate-700/50 flex flex-col gap-0.5 shadow-2xs">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">114</span>
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Chapters (Surahs)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/5 to-cyan-500/10 dark:from-slate-800/60 dark:to-slate-800/30 border border-teal-500/20 dark:border-slate-700/50 flex flex-col gap-0.5 shadow-2xs">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">6,236</span>
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Verses (Ayahs)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 dark:from-slate-800/60 dark:to-slate-800/30 border border-amber-500/20 dark:border-slate-700/50 flex flex-col gap-0.5 shadow-2xs">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">86</span>
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Meccan (Makki)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 dark:from-slate-800/60 dark:to-slate-800/30 border border-emerald-500/20 dark:border-slate-700/50 flex flex-col gap-0.5 shadow-2xs">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">28</span>
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400">Medinan (Madani)</span>
          </div>
        </div>

        <Link
          href="/juz"
          className="w-full py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-slate-700/60 text-xs font-extrabold transition-all flex items-center justify-center gap-2 group cursor-pointer"
        >
          <Layers size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          <span>Explore 30 Juz / Paras</span>
          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Widget 2: User Activity (Recents & Bookmarks) */}
      <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-500/20 dark:border-slate-800/80 shadow-lg flex flex-col gap-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <Compass size={16} />
          My Personal Activity
        </h3>

        {!user ? (
          /* Unauthenticated CTA */
          <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 shadow-2xs">
              <Bookmark size={24} />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-1">Track Your Progress</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-4">
              Sign in to save your reading history, bookmark favorite verses, and sync across devices.
            </p>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white transition-all shadow-md shadow-emerald-500/20 text-center cursor-pointer"
            >
              Sign In to Quran Portal
            </Link>
          </div>
        ) : loading ? (
          /* Loading Indicator */
          <div className="flex items-center justify-center py-10 gap-2 text-slate-400">
            <Loader2 className="animate-spin text-emerald-500" size={20} />
            <span className="text-xs font-bold">Loading user data...</span>
          </div>
        ) : (
          /* Authenticated Dashboard widgets */
          <div className="flex flex-col gap-5">
            {/* Recent Played */}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2.5">
                <History size={14} className="text-emerald-500" />
                Recent Reading History
              </span>
              {recents.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">No recent reading history found.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {recents.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          Surah {item.surahName}
                        </h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Chapter #{item.surahNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => playSurah(item.surahNumber, item.surahName)}
                          className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                        >
                          <Play size={12} fill="currentColor" />
                        </button>
                        <Link
                          href={`/surah/${item.surahNumber}`}
                          className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline"
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mb-2.5">
                <BookOpen size={14} className="text-emerald-500" />
                Bookmarked Ayahs
              </span>
              {favoriteAyahs.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic">No bookmarks saved yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {favoriteAyahs.map((item) => (
                    <Link
                      key={item.id}
                      href={`/surah/${item.surahNumber}`}
                      className="block p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 font-bold mb-1">
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
