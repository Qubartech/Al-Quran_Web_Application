"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { QURAN_API_BASE_URL } from "@/lib/api/config";
import { useAudio } from "@/context/AudioProvider";
import { useUser } from "@/context/UserProvider";
import { Bookmark, Copy, Check, Repeat1, Share2, BookOpen, GraduationCap, MessageSquare, Lightbulb, Scroll, List, BookMarked } from "lucide-react";
import TafsirModal from "./TafsirModal";

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
  const [repeatAyahIndex, setRepeatAyahIndex] = useState(null);
  const [copiedAyahIdx, setCopiedAyahIdx] = useState(null);
  const [sharedAyahIdx, setSharedAyahIdx] = useState(null);
  const [viewMode, setViewMode] = useState("verse"); // 'verse' | 'reading'
  const [tafsirModalData, setTafsirModalData] = useState({
    isOpen: false,
    surahId: null,
    ayahNumber: null,
    verseKey: "",
    arabicText: "",
    translationText: "",
  });

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

  const isCurrentSurahPlaying = useMemo(() => {
    if (!audio?.src) return false;
    const pId = String(audio?.playlistId || "").replace("surah_", "").trim();
    const curId = String(pageId || "").replace("surah_", "").trim();
    if (!pId || !curId) return false;
    return pId === curId;
  }, [audio?.src, audio?.playlistId, pageId]);

  function getActiveWordIndex(ayah, currentTimeSeconds) {
    if (!isCurrentSurahPlaying || !ayah?.segments || ayah.segments.length === 0) return -1;
    const currentTimeMs = currentTimeSeconds * 1000;

    const activeSegment = ayah.segments.find(
      (seg) => currentTimeMs >= seg[1] && currentTimeMs <= seg[2]
    );

    if (activeSegment) {
      return activeSegment[0] - 1; // Return 0-indexed position
    }
    return -1;
  }

  // Track the active ayah index based on audioCurrentTime ONLY if this Surah is currently playing
  const activeAyahIndex = useMemo(() => {
    if (!isCurrentSurahPlaying) return -1;
    const timeMs = audioCurrentTime * 1000;
    return arabicAyah.findIndex(
      (ayah) => timeMs >= ayah.timestamp_from && timeMs < ayah.timestamp_to
    );
  }, [arabicAyah, audioCurrentTime, isCurrentSurahPlaying]);

  // Sync scroll on active ayah index change ONLY if this Surah is currently playing
  useEffect(() => {
    if (isCurrentSurahPlaying && activeAyahIndex !== -1 && !isPaused) {
      const elId = `sura_${pageId}_ayah_${activeAyahIndex + 1}`;
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeAyahIndex, isCurrentSurahPlaying, isPaused, pageId]);

  // Dispatch active ayah index to custom event listener in AudioPlayer ONLY if this Surah is playing
  useEffect(() => {
    if (isCurrentSurahPlaying && activeAyahIndex !== -1) {
      window.dispatchEvent(
        new CustomEvent("quran-audio-ayah-change", {
          detail: { ayahIndex: activeAyahIndex, surahNumber: pageId },
        })
      );
    }
  }, [activeAyahIndex, isCurrentSurahPlaying, pageId]);

  // Single Ayah Repeat Loop Handler
  const lastSeekTimeRef = useRef(0);

  useEffect(() => {
    if (repeatAyahIndex === null || !isCurrentSurahPlaying) return;
    const targetAyah = arabicAyah[repeatAyahIndex];
    if (!targetAyah) return;

    const fromMs = typeof targetAyah.timestamp_from === "number" ? targetAyah.timestamp_from : 0;
    const toMs = typeof targetAyah.timestamp_to === "number" ? targetAyah.timestamp_to : 0;

    if (toMs <= fromMs) return;

    const onTimeUpdate = (e) => {
      const timeMs = (e.detail?.currentTime || 0) * 1000;
      const now = Date.now();
      if (now - lastSeekTimeRef.current < 800) return;

      if (timeMs >= toMs - 200 || timeMs < fromMs - 1500) {
        lastSeekTimeRef.current = now;
        const seekSec = fromMs / 1000;
        window.dispatchEvent(
          new CustomEvent("quran-audio-seek", { detail: { time: seekSec } })
        );
      }
    };

    window.addEventListener("quran-audio-timeupdate", onTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", onTimeUpdate);
    };
  }, [repeatAyahIndex, isCurrentSurahPlaying, arabicAyah]);

  const toggleRepeatSingleAyah = (idx) => {
    if (repeatAyahIndex === idx) {
      setRepeatAyahIndex(null);
    } else {
      setRepeatAyahIndex(idx);
      playControl(idx);
    }
  };

  const copyAyahText = (ayah, idx) => {
    try {
      const arabicText = ayah?.text || (ayah?.words || []).map((w) => w.text_uthmani || w.text).join(" ");
      const translationText = englishTrans[idx]?.text || "";
      const textToCopy = `Surah ${surahName ? surahName + " " : ""}(${pageId}:${idx + 1})\n\n${arabicText}\n\n${translationText}`;
      
      navigator.clipboard.writeText(textToCopy);
      setCopiedAyahIdx(idx);
      setTimeout(() => setCopiedAyahIdx(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const shareAyah = async (ayah, idx) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/surah/${pageId}#sura_${pageId}_ayah_${idx + 1}` : "";
    const arabicText = ayah?.text || (ayah?.words || []).map((w) => w.text_uthmani || w.text).join(" ");
    const translationText = englishTrans[idx]?.text || "";
    const shareData = {
      title: `Surah (${pageId}:${idx + 1})`,
      text: `${arabicText}\n\n${translationText}`,
      url: url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        if (e.name !== "AbortError") {
          navigator.clipboard?.writeText(url);
          setSharedAyahIdx(idx);
          setTimeout(() => setSharedAyahIdx(null), 2000);
        }
      }
    } else {
      navigator.clipboard?.writeText(url);
      setSharedAyahIdx(idx);
      setTimeout(() => setSharedAyahIdx(null), 2000);
    }
  };

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
      setAudioCurrentTime(seekTime);
      window.dispatchEvent(
        new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
      );
      if (isPaused) {
        audio?.resume();
      }
    } else {
      setAudioCurrentTime(seekTime);
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
    const fetchByIdentifier = async (rawIdentifier) => {
      try {
        const identifiers = String(rawIdentifier)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!identifiers.length) return;

        const promises = identifiers.map((id) =>
          fetch(
            `${QURAN_API_BASE_URL}/verses/by_chapter/${pageId}?per_page=300&translations=${id}`
          ).then((res) => (res.ok ? res.json() : null))
        );

        const results = await Promise.all(promises);
        const validResults = results.filter(Boolean);
        if (!validResults.length) return;

        const totalAyahs = validResults[0]?.verses?.length || 0;
        const combinedTranslations = [];

        for (let i = 0; i < totalAyahs; i++) {
          const verseTransList = [];
          validResults.forEach((resData) => {
            const verse = resData?.verses?.[i];
            const transObj = verse?.translations?.[0];
            if (transObj && transObj.text) {
              verseTransList.push({
                text: transObj.text || "",
                name: transObj.resource_name || "",
                id: transObj.resource_id,
              });
            }
          });
          combinedTranslations.push(verseTransList);
        }

        if (combinedTranslations.length) {
          setEnglishTrans(combinedTranslations);
        }
      } catch (e) {
        console.error("Error fetching translations:", e);
      }
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
      {/* ── Quran.com Style View Mode Bar: Verse by Verse vs Reading Mode ── */}
      <div className="flex items-center justify-between px-3 py-2 mb-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-gray-200/20 dark:border-slate-800/60 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
          <span className="hidden sm:inline">Viewing Mode:</span>
        </div>

        <div className="flex items-center p-1 bg-gray-200/50 dark:bg-slate-800/60 rounded-xl border border-gray-200/40 dark:border-slate-700/50 text-xs font-bold">
          <button
            onClick={() => setViewMode("verse")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "verse"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-black"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <List size={14} />
            <span>Verse by Verse</span>
          </button>
          <button
            onClick={() => setViewMode("reading")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
              viewMode === "reading"
                ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-black"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            <BookMarked size={14} />
            <span>Reading Mode</span>
          </button>
        </div>
      </div>

      {viewMode === "reading" ? (
        /* ── Quran.com Reading Mode (Continuous Mushaf Style Arabic Text with Generous Spacing & RTL Right Alignment) ── */
        <div
          className="p-4 sm:p-8 md:p-12 rounded-3xl glass border border-emerald-500/25 leading-[2.8] sm:leading-[3.2] md:leading-[3.6] text-right font-arabic text-xl sm:text-2xl md:text-3.5xl text-slate-900 dark:text-slate-100 flex flex-wrap gap-x-3 md:gap-x-4 gap-y-6 md:gap-y-8 shadow-xl justify-start w-full text-end"
          dir="rtl"
          style={{ textAlign: "right", direction: "rtl" }}
        >
          {arabicAyah.map((ayah, idx) => {
            const verseText = ayah?.text || ayah?.words?.map((w) => w.text_qpc_hafs || w.text_uthmani || w.text).join(" ");
            return (
              <span
                key={idx}
                id={`sura_${pageId}_ayah_${idx + 1}`}
                className="inline-flex items-center flex-wrap hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer select-none tracking-wide text-right"
                dir="rtl"
              >
                <span>{verseText}</span>
              </span>
            );
          })}
        </div>
      ) : (
        /* ── Verse by Verse Cards with Footer Toolbar ── */
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
                <div className={`px-4 md:px-6 py-4 md:py-5 flex flex-col gap-3.5 w-full transition-all duration-300 rounded-2xl verse-card outline-none focus:outline-none ${
                  isPlaying
                    ? "bg-primaryColor/[0.06] dark:bg-emerald-500/[0.08] border border-primaryColor/25 dark:border-emerald-500/25 verse-active-glow shadow-sm"
                    : "bg-white/20 dark:bg-slate-900/10 border border-gray-200/20 dark:border-slate-800/20 hover:border-gray-300/30 dark:hover:border-slate-700/30"
                }`}>
                  
                  {/* ── Top Header Action Bar (Quran.com Style) ── */}
                  <div className="flex items-center justify-between w-full border-b border-gray-200/15 dark:border-slate-800/40 pb-3">
                    
                    {/* Left Controls: Ayah Badge, Play, Bookmark */}
                    <div className="flex items-center gap-2 md:gap-2.5">
                      {/* Islamic Star Ayah Badge */}
                      <div
                        className={`ayah-badge w-8 h-8 md:w-9 md:h-9 shrink-0 transition-all flex items-center justify-center ${
                          isPlaying
                            ? "bg-primaryColor dark:bg-emerald-500 shadow-md shadow-emerald-500/20 text-white font-black"
                            : "bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor dark:text-primaryColor-light font-bold"
                        }`}
                      >
                        <span className="text-[8px] md:text-[9.5px] font-black leading-none select-none">
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
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                          bookmarks[`${pageId}_${idx + 1}`]
                            ? "text-emerald-500 bg-emerald-500/10"
                            : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                        }`}
                        title="Bookmark Ayah"
                      >
                        <Bookmark size={15} fill={bookmarks[`${pageId}_${idx + 1}`] ? "currentColor" : "none"} className="shrink-0" />
                      </button>
                    </div>

                    {/* Right Controls: Repeat, Copy, Share */}
                    <div className="flex items-center gap-1 md:gap-1.5">
                      {/* Single Ayah Repeat Button */}
                      <button
                        onClick={() => toggleRepeatSingleAyah(idx)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer relative ${
                          repeatAyahIndex === idx
                            ? "text-amber-500 bg-amber-500/15 border border-amber-500/30 shadow-sm"
                            : "text-gray-400 hover:text-amber-500 hover:bg-amber-500/10"
                        }`}
                        title={repeatAyahIndex === idx ? "Single Ayah Repeat ON" : "Repeat single Ayah loop"}
                      >
                        <Repeat1 size={15} className="shrink-0" />
                        {repeatAyahIndex === idx && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[8px] font-black flex items-center justify-center">
                            1
                          </span>
                        )}
                      </button>

                      {/* Copy Ayah Button */}
                      <button
                        onClick={() => copyAyahText(ayah, idx)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                          copiedAyahIdx === idx
                            ? "text-emerald-500 bg-emerald-500/15 border border-emerald-500/30"
                            : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                        }`}
                        title={copiedAyahIdx === idx ? "Copied!" : "Copy Ayah Text & Translation"}
                      >
                        {copiedAyahIdx === idx ? (
                          <Check size={15} className="shrink-0 text-emerald-500 animate-bounce" />
                        ) : (
                          <Copy size={14} className="shrink-0" />
                        )}
                      </button>

                      {/* Share Ayah Button */}
                      <button
                        onClick={() => shareAyah(ayah, idx)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                          sharedAyahIdx === idx
                            ? "text-emerald-500 bg-emerald-500/15 border border-emerald-500/30"
                            : "text-gray-400 hover:text-teal-500 hover:bg-teal-500/10"
                        }`}
                        title={sharedAyahIdx === idx ? "Link Copied!" : "Share Ayah"}
                      >
                        {sharedAyahIdx === idx ? (
                          <Check size={15} className="shrink-0 text-emerald-500 animate-bounce" />
                        ) : (
                          <Share2 size={14} className="shrink-0" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* ── Main Full-Width Content Column ── */}
                  <div className="w-full min-w-0 pt-1">
                    {ayah.words && ayah.words.length > 0 ? (
                      (() => {
                        const activeWordIndex = getActiveWordIndex(ayah, audioCurrentTime);
                        return (
                          <div
                            className="flex flex-wrap gap-x-1 sm:gap-x-2 md:gap-x-2.5 gap-y-2 md:gap-y-4 justify-start w-full pb-3 md:pb-5"
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
                                  className={`relative flex flex-col items-center justify-center px-0.5 sm:px-1 py-0.5 rounded-lg transition-all duration-200 group cursor-pointer outline-none focus:outline-none ${
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

                                  {/* Tooltip on Hover OR when Word is Active */}
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
                    
                    {/* Multi-Translation List */}
                    <div className="flex flex-col gap-3 pt-2">
                      {Array.isArray(englishTrans[idx]) ? (
                        englishTrans[idx].map((transItem, tIdx) => (
                          <div key={tIdx} className="flex flex-col gap-1">
                            {englishTrans[idx].length > 1 && (
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md w-max border border-emerald-500/20">
                                {transItem.name || `Translation ${tIdx + 1}`}
                              </span>
                            )}
                            <p className="text-gray-700 dark:text-gray-300 ayah-text leading-relaxed">
                              {transItem.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-700 dark:text-gray-300 ayah-text leading-relaxed">
                          {englishTrans[idx]?.text || englishTrans[idx]}
                        </p>
                      )}
                    </div>

                    {/* ── Quran.com Verse Card Footer Toolbar ── */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200/10 dark:border-slate-800/40 mt-3 font-medium">
                      <button
                        onClick={() => setTafsirModalData({
                          isOpen: true,
                          surahId: pageId,
                          ayahNumber: idx + 1,
                          verseKey: `${pageId}:${idx + 1}`,
                          arabicText: text || ayah?.words?.map(w => w.text_qpc_hafs || w.text_uthmani || w.text).join(" "),
                          translationText: englishTrans[idx]?.text
                        })}
                        className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-semibold transition-colors cursor-pointer bg-emerald-500/10 dark:bg-emerald-500/15 px-3 py-1 rounded-lg border border-emerald-500/20"
                      >
                        <BookOpen size={13} className="text-emerald-500" />
                        <span>Tafsirs</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tafsir Modal */}
      <TafsirModal
        isOpen={tafsirModalData.isOpen}
        onClose={() => setTafsirModalData((prev) => ({ ...prev, isOpen: false }))}
        surahId={tafsirModalData.surahId}
        ayahNumber={tafsirModalData.ayahNumber}
        verseKey={tafsirModalData.verseKey}
        arabicText={tafsirModalData.arabicText}
        translationText={tafsirModalData.translationText}
      />
    </>
  );
};

export default SurahAyahList;
