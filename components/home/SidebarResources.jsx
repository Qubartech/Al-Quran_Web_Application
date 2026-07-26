"use client";

import { useEffect, useState } from "react";
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
  Compass 
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
        setRecents(Array.isArray(recentsData) ? recentsData.slice(0, 3) : []);
        setFavoriteAyahs(Array.isArray(ayahsData) ? ayahsData.slice(0, 2) : []);
      })
      .catch((e) => console.error("Error loading sidebar activity:", e))
      .finally(() => setLoading(false));
  }, [user, session?.access_token]);

  const playSurah = (surahNumber, surahName) => {
    const fullAudioUrl = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;
    audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, surahName);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Widget 1: Quran Insights (Stats) */}
      <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
          <TrendingUp size={14} />
          Quran Insights
        </h3>
        
        <div className="grid grid-cols-2 gap-3.5">
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

      {/* Widget 2: User Activity (Recents & Bookmarks) */}
      <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col gap-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
          <Compass size={14} />
          My Activity
        </h3>

        {!user ? (
          /* Unauthenticated CTA */
          <div className="flex flex-col items-center text-center p-4 py-6 rounded-xl border border-gray-200/30 dark:border-slate-800/40 bg-white/15 dark:bg-slate-900/10">
            <Bookmark size={24} className="text-gray-400 mb-2.5" />
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">Track Your Progress</h4>
            <p className="text-[10px] text-gray-550 dark:text-gray-400 font-semibold leading-relaxed mb-4">
              Sign In to save your reading history, bookmark important verses, and view insights.
            </p>
            <Link
              href="/login"
              className="px-4 py-2 text-[10px] font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg transition-all shadow-sm"
            >
              Sign In
            </Link>
          </div>
        ) : loading ? (
          /* Loading Indicator */
          <div className="flex items-center justify-center py-10 gap-2 text-slate-500">
            <Loader2 className="animate-spin text-primaryColor" size={18} />
            <span className="text-[10px] font-bold">Loading dashboard...</span>
          </div>
        ) : (
          /* Authenticated Dashboard widgets */
          <div className="flex flex-col gap-4">
            {/* Recent Played */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-2">
                <History size={12} />
                Recent Reads
              </span>
              {recents.length === 0 ? (
                <p className="text-[10px] text-gray-500 dark:text-gray-450 italic pl-1">No reading history.</p>
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

            {/* Whitelisted Ayahs */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 flex items-center gap-1 mb-2">
                <BookOpen size={12} />
                Bookmarked Ayahs
              </span>
              {favoriteAyahs.length === 0 ? (
                <p className="text-[10px] text-gray-500 dark:text-gray-455 italic pl-1">No bookmarks.</p>
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
