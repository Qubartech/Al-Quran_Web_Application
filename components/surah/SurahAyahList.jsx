"use client";

import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/context/AudioProvider";

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
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

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

  const fullAudioUrl = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${pageId}.mp3`;

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
    const seekTime = targetAyah.timestamp_from / 1000;

    // Check if the full Surah audio is already playing
    if (audio?.playlistId === pageId) {
      window.dispatchEvent(
        new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
      );
      if (isPaused) {
        audio?.resume();
      }
    } else {
      // Load and play the full Surah audio
      audio?.playList([fullAudioUrl], 0, pageId, surahName);
      // Wait for player state to populate, then seek
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
        );
      }, 300);
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

      {arabicAyah.map((ayah, idx) => {
        const isPlaying =
          audio?.playlistId === pageId && activeAyahIndex === idx;
        const { text } = ayah || {};
        return (
          <div
              key={idx}
              className="py-1"
              id={`sura_${pageId}_ayah_${idx + 1}`}
              tabIndex={-1}
            >
              <div className={`px-2 md:px-5 py-5 flex gap-3 justify-between w-full transition-colors ${idx < arabicAyah.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                <div className="md:w-12 flex items-center justify-center">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center">
                    {pageId}:{idx + 1}
                    <div className="w-full flex justify-center">
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
                          audio?.playlistId === pageId &&
                          activeAyahIndex === idx &&
                          !isPaused
                        }
                        playControl={() => playControl(idx)}
                        pauseControl={() => audio?.pause()}
                      />
                    </div>
                    </div>
                </div>

                <div className="w-full">
                  {ayah.words && ayah.words.length > 0 ? (
                    (() => {
                      const activeWordIndex = getActiveWordIndex(ayah, audioCurrentTime);
                      return (
                        <div
                          className="flex flex-wrap gap-x-3 gap-y-5 justify-start w-full pb-7"
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
                            const isHighlightStyle = isActiveWord;
                            const isDimmedStyle = isPlaying && activeWordIndex !== -1 && !isActiveWord;

                            return (
                              <div
                                key={wIdx}
                                className="relative flex flex-col items-center justify-center p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-200/30 dark:hover:border-gray-700/30"
                              >
                                {/* Arabic word */}
                                <span
                                  className={`text-2xl md:text-3xl font-semibold select-none transition-all duration-150 font-arabic ${
                                    isHighlightStyle
                                      ? "text-primaryColor scale-110 font-bold"
                                      : isDimmedStyle
                                      ? "text-gray-900/30 dark:text-gray-100/30"
                                      : "text-gray-900 dark:text-gray-100 group-hover:text-primaryColor"
                                  }`}
                                  dir="rtl"
                                >
                                  {wordText}
                                </span>

                                {/* Tooltip on Hover */}
                                {isWord && (wordTrans || wordTranslit) && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center bg-gray-900 dark:bg-gray-800 text-white text-[11px] p-2 rounded shadow-lg z-30 pointer-events-none whitespace-nowrap min-w-[60px] border border-gray-700">
                                    {wordTranslit && (
                                      <span className="font-semibold text-gray-300 font-sans tracking-wide mb-0.5" dir="ltr">
                                        {wordTranslit}
                                      </span>
                                    )}
                                    {wordTrans && (
                                      <span className="text-gray-400 font-sans text-center font-normal leading-normal" dir="ltr">
                                        {wordTrans}
                                      </span>
                                    )}
                                    {/* Tooltip triangle arrow */}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900 dark:border-t-gray-800"></div>
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
                      className={`font-semibold text-end font-arabic ayah-arabic-text pb-7 ${
                        isPlaying
                          ? "text-primaryColor"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                      style={isPlaying ? ayahAnim : {}}
                    >
                      {text}
                    </div>
                  )}
                  <div className="text-gray-700 dark:text-gray-300 ayah-text pt-2 border-t border-gray-100 dark:border-gray-800">
                    {englishTrans[idx]?.text}
                  </div>
                </div>
              </div>
            </div>
        );
      })}
    </>
  );
};

export default SurahAyahList;
