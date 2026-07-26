"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserProvider";
import { useAudio } from "@/context/AudioProvider";
import { useRouter } from "next/navigation";
import { BookOpen, Bookmark, History, Trash2, Play, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, session, loading: authLoading } = useUser();
  const audio = useAudio();
  const router = useRouter();

  const [recents, setRecents] = useState([]);
  const [favoriteAyahs, setFavoriteAyahs] = useState([]);
  const [favoriteJuzs, setFavoriteJuzs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Sync auth state
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !session?.access_token) return;

    setLoadingData(true);
    // Fetch all dashboard data
    Promise.all([
      fetch("/api/recent", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()),
      fetch("/api/favorites/ayah", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()),
      fetch("/api/favorites/juz", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }).then((r) => r.json()),
    ])
      .then(([recentsData, ayahsData, juzsData]) => {
        setRecents(Array.isArray(recentsData) ? recentsData : []);
        setFavoriteAyahs(Array.isArray(ayahsData) ? ayahsData : []);
        setFavoriteJuzs(Array.isArray(juzsData) ? juzsData : []);
      })
      .catch((e) => console.error("Error loading dashboard data:", e))
      .finally(() => setLoadingData(false));
  }, [user, session?.access_token]);

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-160px)] gap-3 text-slate-500">
        <Loader2 className="animate-spin text-primaryColor" size={32} />
        <span className="text-sm font-bold">Authenticating...</span>
      </div>
    );
  }

  // Remove bookmark handler
  const removeAyahBookmark = async (surahNumber, ayahNumber) => {
    try {
      await fetch(`/api/favorites/ayah?surahNumber=${surahNumber}&ayahNumber=${ayahNumber}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setFavoriteAyahs((prev) =>
        prev.filter((a) => !(a.surahNumber === surahNumber && a.ayahNumber === ayahNumber))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const removeJuzBookmark = async (juzId) => {
    try {
      await fetch(`/api/favorites/juz?juzId=${juzId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      setFavoriteJuzs((prev) => prev.filter((j) => j.juzId !== juzId));
    } catch (e) {
      console.error(e);
    }
  };

  // Play Recitation trigger (seeks if already playing)
  const playAyah = async (surahNumber, ayahNumber) => {
    try {
      const res = await fetch(
        `https://api.quran.com/api/v4/chapter_recitations/7/${surahNumber}?segments=true`
      );
      if (!res.ok) return;
      const json = await res.json();
      const timestamps = json.audio_file?.timestamps || [];
      const verseKey = `${surahNumber}:${ayahNumber}`;
      const verseSeg = timestamps.find((t) => t.verse_key === verseKey);
      const seekTime = (verseSeg?.timestamp_from || 0) / 1000;

      const fullAudioUrl = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;

      audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, `Surah ${surahNumber}`);
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
        );
      }, 500);
    } catch (err) {
      console.error("Error seeking audio:", err);
    }
  };

  const playSurah = (surahNumber, surahName) => {
    const fullAudioUrl = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;
    audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, surahName);
  };

  return (
    <div className="px-5 py-8 max-w-screen-2xl mx-auto min-h-screen text-gray-900 dark:text-gray-100 transition-colors">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-primaryColor to-emerald-600 dark:from-primaryColor-light dark:to-emerald-400 bg-clip-text text-transparent dark:text-transparent">
          User Dashboard
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-semibold">
          Authenticated as: <span className="text-slate-800 dark:text-slate-200">{user.email}</span>
        </p>
      </div>

      {loadingData ? (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
          <Loader2 className="animate-spin text-primaryColor" size={24} />
          <span className="text-xs font-bold">Loading dashboard profile...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Recently Played Surahs & Whitelisted Juzs */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* Recently Played */}
            <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-md flex flex-col">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <History size={16} className="text-primaryColor" />
                Recently Played Surahs
              </h2>
              {recents.length === 0 ? (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
                  No playback history recorded.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recents.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-primaryColor/20 dark:hover:border-emerald-500/20 bg-white/20 dark:bg-slate-900/10 hover:bg-white/60 dark:hover:bg-slate-800/30 transition-all duration-200"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Surah {item.surahName}
                        </h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                          Surah #{item.surahNumber}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => playSurah(item.surahNumber, item.surahName)}
                          className="p-1.5 rounded-lg bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor hover:bg-primaryColor hover:text-white dark:hover:bg-primaryColor dark:hover:text-white transition-all"
                        >
                          <Play size={12} fill="currentColor" />
                        </button>
                        <Link
                          href={`/surah/${item.surahNumber}`}
                          className="text-[10px] font-bold text-gray-400 hover:text-primaryColor pl-1"
                        >
                          Read →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Whitelisted Juzs */}
            <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-md flex flex-col">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Bookmark size={16} className="text-primaryColor" />
                Whitelisted Juzs
              </h2>
              {favoriteJuzs.length === 0 ? (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
                  No whitelisted Juzs.
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {favoriteJuzs.map((item) => (
                    <div
                      key={item.id}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-primaryColor/20 dark:hover:border-emerald-500/20 bg-white/20 dark:bg-slate-900/10 hover:bg-white/60 dark:hover:bg-slate-800/30 transition-all duration-200"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Juz {item.juzId} — {item.juzName}
                        </h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                          Range: {item.startSurah} - {item.endSurah}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/juz/${item.juzId}`}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor dark:text-emerald-400 hover:bg-primaryColor hover:text-white dark:hover:bg-primaryColor dark:hover:text-white transition-all border border-transparent"
                        >
                          Read
                        </Link>
                        <button
                          onClick={() => removeJuzBookmark(item.juzId)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                          title="Remove Bookmark"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Column 2: Whitelisted Ayahs */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-md flex flex-col">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-primaryColor" />
                Whitelisted Ayahs / Verses
              </h2>

              {favoriteAyahs.length === 0 ? (
                <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-12">
                  No bookmarked Ayahs found. Go to Surah or Juz view to add bookmarks!
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {favoriteAyahs.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-transparent hover:border-primaryColor/15 dark:hover:border-emerald-500/15 bg-white/20 dark:bg-slate-900/10 flex flex-col gap-3 transition-all duration-200"
                    >
                      <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400 font-bold border-b border-gray-150/40 dark:border-slate-800/60 pb-1.5">
                        <Link href={`/surah/${item.surahNumber}`} className="hover:text-primaryColor">
                          {item.surahName} • Verse {item.ayahNumber}
                        </Link>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => playAyah(item.surahNumber, item.ayahNumber)}
                            className="p-1 rounded bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor hover:bg-primaryColor hover:text-white dark:hover:bg-primaryColor dark:hover:text-white transition-all flex items-center gap-1 text-[9px] font-extrabold"
                          >
                            <Play size={10} fill="currentColor" /> Play Verse
                          </button>
                          <button
                            onClick={() => removeAyahBookmark(item.surahNumber, item.ayahNumber)}
                            className="p-1 rounded text-gray-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                            title="Delete favorite"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>

                      <p className="font-arabic text-2xl text-right leading-loose text-slate-800 dark:text-slate-100 select-none">
                        {item.arabicText}
                      </p>

                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed italic">
                        {item.translation}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
