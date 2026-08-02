"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { QURAN_API_BASE_URL } from "@/lib/api/config";
import { useAudio } from "@/context/AudioProvider";
import { useUser } from "@/context/UserProvider";
import { Bookmark, Copy, Check, Repeat1, Share2 } from "lucide-react";
import SurahPlayBtn from "@/components/surah/SurahPlayBtn";

export default function JuzAyahList({
  arabicAyah,
  englishTransAyah,
  juzId
}) {
  const [refreshTick, setRefreshTick] = useState(0);
  const { user, session } = useUser();
  const [bookmarks, setBookmarks] = useState({});
  const [isPaused, setIsPaused] = useState(true);
  const [englishTrans, setEnglishTrans] = useState(englishTransAyah || []);
  const [segmentsMap, setSegmentsMap] = useState({});
  const [loadingSurah, setLoadingSurah] = useState(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [repeatAyahIndex, setRepeatAyahIndex] = useState(null);
  const [copiedAyahIdx, setCopiedAyahIdx] = useState(null);
  const [sharedAyahIdx, setSharedAyahIdx] = useState(null);
  const audio = useAudio();

  // Listen to time updates from global audio player
  useEffect(() => {
    const onTimeUpdate = (e) => {
      setAudioCurrentTime(e.detail.currentTime);
    };
    window.addEventListener("quran-audio-timeupdate", onTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", onTimeUpdate);
    };
  }, []);

  // Compute active ayah index in the Juz list based on current playback time of the active Surah
  const activeAyahIndex = useMemo(() => {
    if (!audio || !audio.playlistId || !audio.playlistId.startsWith("surah_")) return -1;
    const playingSurahNum = parseInt(audio.playlistId.split("_")[1], 10);
    const timeMs = audioCurrentTime * 1000;
    const surahTimestamps = segmentsMap[playingSurahNum];

    if (!surahTimestamps) return -1;

    return arabicAyah.findIndex((ayah) => {
      if (ayah.surahNumber !== playingSurahNum) return false;
      const seg = surahTimestamps.find((s) => s.verse_key === ayah.verseKey);
      if (!seg) return false;
      return timeMs >= seg.timestamp_from && timeMs < seg.timestamp_to;
    });
  }, [arabicAyah, audio, audioCurrentTime, segmentsMap]);

  // Sync scroll on active ayah index change
  useEffect(() => {
    if (activeAyahIndex !== -1 && activeAyahIndex !== undefined && !isPaused) {
      const elId = `juz_${juzId}_ayah_${activeAyahIndex}`;
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeAyahIndex, isPaused, juzId]);

  // Force re-render when audio ticks change
  useEffect(() => {
    if (!audio) return;
    setRefreshTick((t) => t + 1);
  }, [audio, audio?.playTick, audio?.pauseTick]);

  // Track paused explicitly
  useEffect(() => {
    setIsPaused(audio?.paused ?? true);
  }, [audio, audio?.paused]);

  // Keep local english translation in sync with prop
  useEffect(() => {
    setEnglishTrans(englishTransAyah || []);
  }, [englishTransAyah]);

  // Fetch bookmarks
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
    const target = arabicAyah[ayahIdx];
    if (!target) return;
    const { surahNumber, verseKey, surahName } = target;
    const ayahNumber = parseInt(verseKey.split(":")[1], 10);
    const key = `${surahNumber}_${ayahNumber}`;
    const isBookmarked = !!bookmarks[key];

    try {
      if (isBookmarked) {
        await fetch(`/api/favorites/ayah?surahNumber=${surahNumber}&ayahNumber=${ayahNumber}`, {
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
        const translationText = englishTrans[ayahIdx]?.text || "";
        await fetch("/api/favorites/ayah", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            surahNumber,
            ayahNumber,
            surahName: surahName || "",
            arabicText: target.text || "",
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

  // Handle settings changes and update translation dynamically
  useEffect(() => {
    const fetchByIdentifier = async (identifier) => {
      try {
        const url = `${QURAN_API_BASE_URL}/verses/by_juz/${juzId}?per_page=600&translations=${identifier}`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        const verses = Array.isArray(json?.verses) ? json.verses : [];
        
        // Sort verses to ensure chronological order
        const sortedVerses = [...verses].sort((a, b) => {
          const [sA, vA] = a.verse_key.split(":").map(Number);
          const [sB, vB] = b.verse_key.split(":").map(Number);
          if (sA !== sB) return sA - sB;
          return vA - vB;
        });

        const newTransAyahs = sortedVerses.map((v) => ({
          text: v.translations?.[0]?.text || "",
          number: v.verse_number,
          verseKey: v.verse_key,
        }));
        if (newTransAyahs.length) setEnglishTrans(newTransAyahs);
      } catch {}
    };

    if (!juzId || typeof window === "undefined") return;

    const identifier = localStorage.getItem("app_translation_identifier");
    if (identifier) fetchByIdentifier(identifier);

    const onStorage = (e) => {
      if (e.key === "app_translation_identifier" && e.newValue) {
        fetchByIdentifier(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [juzId]);

  // Extract active word index in an ayah based on the play timestamp
  function getActiveWordIndex(ayah, currentTimeSeconds) {
    const surahTimestamps = segmentsMap[ayah.surahNumber];
    if (!surahTimestamps) return -1;
    const verseSeg = surahTimestamps.find((s) => s.verse_key === ayah.verseKey);
    if (!verseSeg || !verseSeg.segments || verseSeg.segments.length === 0) return -1;
    const currentTimeMs = currentTimeSeconds * 1000;

    const activeSegment = verseSeg.segments.find(
      (seg) => currentTimeMs >= seg[1] && currentTimeMs <= seg[2]
    );

    if (activeSegment) {
      return activeSegment[0] - 1; // Return 0-indexed position
    }
    return -1;
  }

  async function playControl(idx) {
    const target = arabicAyah[idx];
    if (!target) return;
    const { surahNumber, verseKey, surahName } = target;

    let reciterId = "7";
    try {
      reciterId = localStorage.getItem("app_reciter_id") || "7";
    } catch {}

    let timestamps = segmentsMap[surahNumber];
    if (!timestamps) {
      setLoadingSurah(surahNumber);
      try {
        const res = await fetch(
          `${QURAN_API_BASE_URL}/chapter_recitations/${reciterId}/${surahNumber}?segments=true`
        );
        if (res.ok) {
          const json = await res.json();
          timestamps = json.audio_file?.timestamps || [];
          setSegmentsMap((prev) => ({
            ...prev,
            [surahNumber]: timestamps,
          }));
        }
      } catch (err) {
        console.error("Failed to load segments", err);
      } finally {
        setLoadingSurah(null);
      }
    }

    if (!timestamps) return; // Fetch failed or was cancelled
    const verseSeg = timestamps.find((t) => t.verse_key === verseKey);
    const seekTime = (verseSeg?.timestamp_from || 0) / 1000;

    const isCurrentSurahPlaying =
      audio?.src &&
      (audio?.playlistId === surahNumber ||
        audio?.playlistId === `surah_${surahNumber}` ||
        String(audio?.playlistId) === String(surahNumber) ||
        String(audio?.playlistId) === `surah_${surahNumber}`);

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
      audio?.playSurah(surahNumber, surahName, seekTime);
      
      // Log to Recently Played
      if (user && session?.access_token) {
        fetch("/api/recent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            surahNumber,
            surahName: surahName || "",
            englishName: surahName || "",
          }),
        }).catch((err) => console.error("Error logging recent play:", err));
      }

      // Store the seek time so SurahAudioPlayer will seek to it when metadata/audio loads
      if (typeof window !== "undefined") {
        window.pendingQuranAudioSeekTime = seekTime;
      }
    }
  }

  // Single Ayah Repeat Loop Handler for Juz
  const lastSeekTimeRef = useRef(0);

  useEffect(() => {
    if (repeatAyahIndex === null) return;
    const targetAyah = arabicAyah[repeatAyahIndex];
    if (!targetAyah) return;
    const surahTimestamps = segmentsMap[targetAyah.surahNumber];
    if (!surahTimestamps) return;
    const seg = surahTimestamps.find((s) => s.verse_key === targetAyah.verseKey);
    if (!seg) return;

    const fromMs = typeof seg.timestamp_from === "number" ? seg.timestamp_from : 0;
    const toMs = typeof seg.timestamp_to === "number" ? seg.timestamp_to : 0;

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
  }, [repeatAyahIndex, arabicAyah, segmentsMap]);

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
      const textToCopy = `Surah ${ayah?.surahName ? ayah.surahName + " " : ""}(${ayah?.verseKey || idx + 1})\n\n${arabicText}\n\n${translationText}`;
      
      navigator.clipboard.writeText(textToCopy);
      setCopiedAyahIdx(idx);
      setTimeout(() => setCopiedAyahIdx(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const shareAyah = async (ayah, idx) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/surah/${ayah?.surahNumber}#sura_${ayah?.surahNumber}_ayah_${ayah?.verseKey?.split(":")[1] || idx + 1}` : "";
    const arabicText = ayah?.text || (ayah?.words || []).map((w) => w.text_uthmani || w.text).join(" ");
    const translationText = englishTrans[idx]?.text || "";
    const shareData = {
      title: `Verse (${ayah?.verseKey || idx + 1})`,
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

  // Auto-dispatch active ayah change to custom event listener in AudioPlayer
  useEffect(() => {
    if (activeAyahIndex !== -1 && activeAyahIndex !== undefined) {
      window.dispatchEvent(
        new CustomEvent("quran-audio-ayah-change", {
          detail: { ayahIndex: activeAyahIndex },
        })
      );
    }
  }, [activeAyahIndex]);

  return (
    <div className="flex flex-col w-full pb-10">
      {arabicAyah.map((ayah, idx) => {
        const isPlaying = activeAyahIndex === idx;
        const { text, verseKey, surahName, surahNameArabic, surahNumber } = ayah || {};
        
        // Check if we should render a Surah header divider
        const isNewSurah =
          idx === 0 ||
          arabicAyah[idx].surahNumber !== arabicAyah[idx - 1].surahNumber;

        const activeWordIndex = getActiveWordIndex(ayah, audioCurrentTime);

        return (
          <div key={idx} className="w-full flex flex-col">
            {isNewSurah && (
              <div className="my-8 p-6 rounded-2xl glass border border-primaryColor/10 dark:border-emerald-500/10 text-center relative overflow-hidden shadow-sm animate-fadeIn">
                <div className="absolute inset-0 bg-gradient-to-r from-primaryColor/5 to-emerald-500/5 dark:from-primaryColor/10 dark:to-emerald-500/5"></div>
                <div className="relative z-10 flex flex-col gap-1 items-center justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light">
                    Surah {surahNumber}
                  </span>
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                    <span>{surahName}</span>
                    {surahNameArabic && (
                      <span className="font-arabic text-2xl text-primaryColor dark:text-primaryColor-light ml-1 font-normal">
                        {surahNameArabic}
                      </span>
                    )}
                  </h3>
                </div>
              </div>
            )}

            <div
              id={`juz_${juzId}_ayah_${idx}`}
              tabIndex={-1}
              className={`px-4 md:px-6 py-4 md:py-5 flex flex-col gap-3.5 w-full transition-all duration-300 rounded-2xl ${
                isPlaying
                  ? "bg-primaryColor/5 border border-primaryColor/20 shadow-sm dark:bg-emerald-500/10"
                  : "bg-white/20 dark:bg-slate-900/10 border border-gray-200/20 dark:border-slate-800/20 hover:border-gray-300/30 dark:hover:border-slate-700/30"
              }`}
            >
              
              {/* Top Action Header Bar */}
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
                    <span className="text-[7.5px] md:text-[9px] font-black leading-none select-none">
                      {verseKey}
                    </span>
                  </div>

                  {/* Play Button */}
                  <div>
                    {loadingSurah === surahNumber ? (
                      <div className="w-7 h-7 border-2 border-primaryColor border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <SurahPlayBtn
                        isPlaying={
                          audio?.open &&
                          audio?.playlistId === `surah_${surahNumber}` &&
                          activeAyahIndex === idx &&
                          !isPaused
                        }
                        playControl={() => playControl(idx)}
                        pauseControl={() => audio?.pause()}
                      />
                    )}
                  </div>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => toggleBookmark(idx)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                      bookmarks[`${surahNumber}_${parseInt(verseKey.split(":")[1], 10)}`]
                        ? "text-emerald-500 bg-emerald-500/10"
                        : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                    }`}
                    title="Bookmark Ayah"
                  >
                    <Bookmark size={15} fill={bookmarks[`${surahNumber}_${parseInt(verseKey.split(":")[1], 10)}`] ? "currentColor" : "none"} className="shrink-0" />
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
                {/* Words view or simple text */}
                {ayah.words && ayah.words.length > 0 ? (
                  <div
                    className="flex flex-wrap gap-x-1 sm:gap-x-2 md:gap-x-2.5 gap-y-2 md:gap-y-4 justify-start w-full pb-3"
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
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-900 dark:border-t-slate-800"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`font-semibold text-end font-arabic ayah-arabic-text pb-3 ${
                      isPlaying
                        ? "text-primaryColor"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {text}
                  </div>
                )}

                {/* English / Bengali translation */}
                <div className="text-gray-700 dark:text-gray-300 ayah-text leading-relaxed pt-2 border-t border-gray-100 dark:border-slate-800/80">
                  {englishTrans[idx]?.text}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
