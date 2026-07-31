"use client";

import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/context/AudioProvider";
import { useUser } from "@/context/UserProvider";
import { Bookmark } from "lucide-react";

// Add custom animation style
const ayahAnim = {
  animation: "ayahHighlight 7s",
};
import SurahAudioPlayer from "@/components/audio/SurahAudioPlayer";
import SurahPlayBtn from "./SurahPlayBtn";
// import { useRouter } from "next/router";

const SurahAyahList = ({
  arabicAyah,
  englishTransAyah,
  ayahAudio,
  pageId,
  surahName,
}) => {
  const [ayahNum, setAyahNum] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [englishTrans, setEnglishTrans] = useState(englishTransAyah || []);
  const audio = useAudio();
  const { user, session } = useUser();
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [bookmarks, setBookmarks] = useState({});

  useEffect(() => {
    if (!user || !session?.access_token) {
      setBookmarks({});
      return;
    }
    fetch("/api/favorites/ayah", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach((item) => {
            map[`${item.surahNumber}_${item.ayahNumber}`] = true;
          });
          setBookmarks(map);
        }
      })
      .catch((e) => console.error("Error fetching bookmarks:", e));
  }, [user, session?.access_token]);

  const toggleBookmark = async (ayahIdx) => {
    if (!user || !session?.access_token) {
      alert("Please Sign In to bookmark/whitelist Ayahs!");
      return;
    }
    const ayahNumber = ayahIdx + 1;
    const key = `${pageId}_${ayahNumber}`;
    const isBookmarked = !!bookmarks[key];

    try {
      if (isBookmarked) {
        await fetch(`/api/favorites/ayah?surahNumber=${pageId}&ayahNumber=${ayahNumber}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        setBookmarks((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } else {
        const ayahObj = arabicAyah[ayahIdx];
        const translationText = englishTrans[ayahIdx]?.text || "";
        await fetch("/api/favorites/ayah", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            surahNumber: pageId,
            ayahNumber,
            surahName: surahName || "",
            arabicText: ayahObj?.text || "",
            translation: translationText,
          }),
        });
        setBookmarks((prev) => ({
          ...prev,
          [key]: true,
        }));
      }
    } catch (e) {
      console.error("Error toggling bookmark:", e);
    }
  };

  useEffect(() => {
    const onTimeUpdate = (e) => {
      setAudioCurrentTime(e.detail.currentTime);
    };
    window.addEventListener("quran-audio-timeupdate", onTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", onTimeUpdate);
    };
  }, []);

  function getActiveWordIndex(ayah, currentTimeSeconds) {
    if (!ayah?.segments || ayah.segments.length === 0) return -1;
    const currentTimeMs = currentTimeSeconds * 1000;

    const activeSegment = ayah.segments.find(
      (seg) => currentTimeMs >= seg[1] && currentTimeMs <= seg[2]
    );

    if (activeSegment) {
      return activeSegment[0] - 1; // Return 0-indexed position
    }
    return -1;
  }

  // Track the active ayah index based on audioCurrentTime
  const activeAyahIndex = useMemo(() => {
    const timeMs = audioCurrentTime * 1000;
    return arabicAyah.findIndex(
      (ayah) => timeMs >= ayah.timestamp_from && timeMs <= ayah.timestamp_to
    );
  }, [arabicAyah, audioCurrentTime]);

  // Sync scroll on active ayah index change
  useEffect(() => {
    if (activeAyahIndex !== -1 && !isPaused) {
      const elId = `sura_${pageId}_ayah_${activeAyahIndex + 1}`;
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeAyahIndex, isPaused, pageId]);

  // Dispatch active ayah index to custom event listener in AudioPlayer
  useEffect(() => {
    if (activeAyahIndex !== -1) {
      window.dispatchEvent(
        new CustomEvent("quran-audio-ayah-change", {
          detail: { ayahIndex: activeAyahIndex },
        })
      );
    }
  }, [activeAyahIndex]);

  function playControl(ayahIndex) {
    const targetAyah = arabicAyah[ayahIndex];
    if (!targetAyah) return;
    const seekTime = (targetAyah.timestamp_from || 0) / 1000;

    const isCurrentSurahPlaying =
      audio?.src &&
      (audio?.playlistId === pageId ||
        audio?.playlistId === `surah_${pageId}` ||
        String(audio?.playlistId) === String(pageId) ||
        String(audio?.playlistId) === `surah_${pageId}`);

    // Check if the full Surah audio is already playing
    if (isCurrentSurahPlaying) {
      window.dispatchEvent(
        new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
      );
      if (isPaused) {
        audio?.resume();
      }
    } else {
      // Load and play full Surah starting from exact Ayah timestamp
      audio?.playSurah(pageId, surahName, seekTime);
      
      // Log to Recently Played
      if (user && session?.access_token) {
        fetch("/api/recent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            surahNumber: pageId,
            surahName: surahName || "",
            englishName: surahName || "",
          }),
        }).catch((err) => console.error("Error logging recent play:", err));
      }
    }
  }

  function playAdjacentAudio(playNext = true) {
    let nextIdx = activeAyahIndex;
    if (playNext && activeAyahIndex < arabicAyah.length - 1) {
      nextIdx = activeAyahIndex + 1;
    } else if (!playNext && activeAyahIndex > 0) {
      nextIdx = activeAyahIndex - 1;
    } else {
      audio?.close();
      return;
    }
    playControl(nextIdx);
  }

  const closePlayer = () => {
    audio?.close();
  };

  // Force re-render when audio play/pause ticks change so isPlaying updates immediately
  useEffect(() => {
    if (!audio) return;
    setRefreshTick((t) => t + 1);
  }, [audio, audio?.playTick, audio?.pauseTick]);

  // Track paused explicitly from provider
  useEffect(() => {
    setIsPaused(audio?.paused ?? true);
  }, [audio, audio?.paused]);

  // Keep local english translation in sync with prop when it changes
  useEffect(() => {
    setEnglishTrans(englishTransAyah || []);
  }, [englishTransAyah]);

  // React to language/identifier changes from Settings and refetch translation
  useEffect(() => {
    const fetchByIdentifier = async (identifier) => {
      try {
        const url = `https://api.quran.com/api/v4/verses/by_chapter/${pageId}?per_page=300&translations=${identifier}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        const verses = Array.isArray(json?.verses) ? json.verses : [];
        const newTransAyahs = verses.map((v) => ({
          text: v.translations?.[0]?.text || "",
          number: v.verse_number,
        }));
        if (newTransAyahs.length) setEnglishTrans(newTransAyahs);
      } catch {}
    };

    if (!pageId || typeof window === "undefined") return;

    // Initial load from storage
    const identifier = localStorage.getItem("app_translation_identifier");
    if (identifier) fetchByIdentifier(identifier);

    // Listen to storage changes (e.g., settings change in another tab/component)
    const onStorage = (e) => {
      if (e.key === "app_translation_identifier" && e.newValue) {
        fetchByIdentifier(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pageId]);

  return (
    <>
      {/* Audio player is rendered globally via AudioProvider */}

      <div className="flex flex-col gap-3 md:gap-4 mt-2">
        {arabicAyah.map((ayah, idx) => {
          const isPlaying =
            (audio?.playlistId === pageId || audio?.playlistId === `surah_${pageId}`) && activeAyahIndex === idx;
          const { text } = ayah || {};
          
          // Stagger animation delay for first 10 visible verses
          const animDelay = idx < 10 ? `${idx * 0.04}s` : '0s';
          
          return (
            <div
              key={idx}
              className="animate-slideUp outline-none focus:outline-none focus-visible:outline-none"
              id={`sura_${pageId}_ayah_${idx + 1}`}
              tabIndex={-1}
              style={{ animationDelay: animDelay }}
            >
              <div className={`px-3 md:px-6 py-3 md:py-6 flex flex-col md:flex-row gap-2 md:gap-5 w-full transition-all duration-300 rounded-xl verse-card outline-none focus:outline-none ${
                isPlaying
                  ? "bg-primaryColor/[0.06] dark:bg-emerald-500/[0.08] border border-primaryColor/25 dark:border-emerald-500/25 verse-active-glow shadow-sm"
                  : "bg-white/20 dark:bg-slate-900/10 border border-gray-200/20 dark:border-slate-800/20 hover:border-gray-300/30 dark:hover:border-slate-700/30"
              }`}>
                
                {/* Action Controls — Right-aligned horizontal row on mobile, vertical column on desktop */}
                <div className="flex flex-row md:flex-col items-center justify-end md:justify-center gap-2 md:gap-2.5 shrink-0 md:pt-0.5 min-w-[32px] md:min-w-[36px] w-full md:w-auto">
                  
                  {/* Islamic Star Ayah Badge */}
                  <div className={`ayah-badge w-8 h-8 md:w-9 md:h-9 shrink-0 transition-all ${
                    isPlaying
                      ? "bg-primaryColor dark:bg-emerald-500 shadow-md shadow-emerald-500/20"
                      : "bg-primaryColor/10 dark:bg-emerald-500/10"
                  }`}>
                    <span className={`text-[8px] md:text-[9.5px] font-black leading-none ${
                      isPlaying
                        ? "text-white"
                        : "text-primaryColor dark:text-primaryColor-light"
                    }`}>
                      {pageId}:{idx + 1}
                    </span>
                  </div>
                  
                  {/* Play Button */}
                  <SurahPlayBtn
                    key={`spb_${idx}_pid_${audio?.playlistId ?? "-"}_ci_${
                      audio?.currentIndex ?? -1
                    }_open_${audio?.open ? 1 : 0}_paused_${
                      audio?.paused ? 1 : 0
                    }_play_${audio?.playTick ?? 0}_pause_${
                      audio?.pauseTick ?? 0
                    }_active_${activeAyahIndex === idx ? 1 : 0}_src_${audio?.src ?? "-"}`}
                    isPlaying={
                      audio?.open &&
                      (audio?.playlistId === pageId || audio?.playlistId === `surah_${pageId}`) &&
                      activeAyahIndex === idx &&
                      !isPaused
                    }
                    playControl={() => playControl(idx)}
                    pauseControl={() => audio?.pause()}
                  />
                  
                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(idx)}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                      bookmarks[`${pageId}_${idx + 1}`]
                        ? "text-emerald-500 bg-emerald-500/10"
                        : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                    }`}
                    title="Bookmark Ayah"
                  >
                    <Bookmark size={14} fill={bookmarks[`${pageId}_${idx + 1}`] ? "currentColor" : "none"} className="shrink-0" />
                  </button>
                </div>

                {/* Content Column — Arabic + Translation */}
                <div className="w-full min-w-0">
                  {ayah.words && ayah.words.length > 0 ? (
                    (() => {
                      const activeWordIndex = getActiveWordIndex(ayah, audioCurrentTime);
                      return (
                        <div
                          className="flex flex-wrap gap-x-2.5 gap-y-4 justify-start w-full pb-5"
                          dir="rtl"
                        >
                          {ayah.words.map((word, wIdx) => {
                            const isWord = word.char_type_name === "word";
                            const wordText =
                              word.text_qpc_hafs ||
                              word.text_uthmani ||
                              word.text;
                            const wordTrans = word.translation?.text;
                            const wordTranslit = word.transliteration?.text;

                            const isActiveWord = isPlaying && activeWordIndex === wIdx;
                            const isDimmedStyle = isPlaying && activeWordIndex !== -1 && !isActiveWord;
                            const shouldShowAutoTooltip = isActiveWord && (audio?.showWordTooltip ?? true);

                            return (
                              <div
                                key={wIdx}
                                className={`relative flex flex-col items-center justify-center p-1 rounded-lg transition-all duration-200 group cursor-pointer outline-none focus:outline-none ${
                                  isActiveWord
                                    ? "z-10"
                                    : isDimmedStyle
                                    ? "opacity-40 hover:opacity-100"
                                    : "hover:bg-gray-100/70 dark:hover:bg-slate-800/40"
                                }`}
                              >
                                {/* Arabic word */}
                                <span
                                  className={`font-semibold select-none transition-all duration-150 font-arabic ayah-arabic-text ${
                                    isActiveWord
                                      ? "text-emerald-500 dark:text-emerald-400 font-bold scale-110 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]"
                                      : isDimmedStyle
                                      ? "text-gray-900/30 dark:text-gray-100/30"
                                      : "text-gray-900 dark:text-gray-100 group-hover:text-primaryColor"
                                  }`}
                                  dir="rtl"
                                >
                                  {wordText}
                                </span>

                                {/* Tooltip on Hover OR when Word is Active (controlled by user setting) */}
                                {isWord && (wordTrans || wordTranslit) && (
                                  <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 flex-col items-center bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[11px] p-2 rounded-xl shadow-2xl z-30 pointer-events-none whitespace-nowrap min-w-[65px] border border-emerald-500/30 transition-all duration-200 ${
                                    shouldShowAutoTooltip ? "flex animate-fadeIn" : "hidden group-hover:flex"
                                  }`}>
                                    {wordTranslit && (
                                      <span className="font-bold text-emerald-300 font-sans tracking-wide mb-0.5" dir="ltr">
                                        {wordTranslit}
                                      </span>
                                    )}
                                    {wordTrans && (
                                      <span className="text-gray-200 font-sans text-center font-normal leading-normal" dir="ltr">
                                        {wordTrans}
                                      </span>
                                    )}
                                    {/* Tooltip triangle arrow */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900 dark:border-t-slate-800"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()
                  ) : (
                    <div
                      className={`font-semibold text-end font-arabic ayah-arabic-text pb-5 ${
                        isPlaying
                          ? "text-primaryColor"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                      style={isPlaying ? ayahAnim : {}}
                    >
                      {text}
                    </div>
                  )}
                  
                  {/* Gradient fade divider */}
                  <div className="verse-divider my-2"></div>
                  
                  {/* Translation */}
                  <div className="text-gray-700 dark:text-gray-300 ayah-text pt-2 leading-relaxed">
                    {englishTrans[idx]?.text}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SurahAyahList;
