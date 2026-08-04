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
  ArrowRight
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
      
      {/* Widget 1: Quran Insights & Metrics */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <TrendingUp size={16} />
          Quran Insights & Structure
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">114</span>
            <span className="text-[11px] font-bold text-slate-400">Chapters (Surahs)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">6,236</span>
            <span className="text-[11px] font-bold text-slate-400">Verses (Ayahs)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">86</span>
            <span className="text-[11px] font-bold text-slate-400">Meccan (Makki)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 flex flex-col gap-0.5">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">28</span>
            <span className="text-[11px] font-bold text-slate-400">Medinan (Madani)</span>
          </div>
        </div>
      </div>

      {/* Widget 2: User Activity (Recents & Bookmarks) */}
      <div className="p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl flex flex-col gap-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <Compass size={16} />
          My Personal Activity
        </h3>

        {!user ? (
          /* Unauthenticated CTA */
          <div className="flex flex-col items-center text-center p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
              <Bookmark size={24} />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 mb-1">Track Your Progress</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mb-4">
              Sign In to save your reading history, bookmark favorite verses, and sync across devices.
            </p>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-md shadow-emerald-600/20 text-center"
            >
              Sign In to Quran App
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                <History size={14} className="text-emerald-500" />
                Recent Reading History
              </span>
              {recents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No recent reading history found.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {recents.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          Surah {item.surahName}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Chapter #{item.surahNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => playSurah(item.surahNumber, item.surahName)}
                          className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                <BookOpen size={14} className="text-emerald-500" />
                Bookmarked Ayahs
              </span>
              {favoriteAyahs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No bookmarks saved yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {favoriteAyahs.map((item) => (
                    <Link
                      key={item.id}
                      href={`/surah/${item.surahNumber}`}
                      className="block p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-500/30 transition-all"
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold mb-1">
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
