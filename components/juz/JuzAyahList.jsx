"use client";

import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/context/AudioProvider";
import SurahPlayBtn from "@/components/surah/SurahPlayBtn";

export default function JuzAyahList({
  arabicAyah,
  englishTransAyah,
  juzId
}) {
  const [refreshTick, setRefreshTick] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [englishTrans, setEnglishTrans] = useState(englishTransAyah || []);
  const [segmentsMap, setSegmentsMap] = useState({});
  const [loadingSurah, setLoadingSurah] = useState(null);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
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
      return timeMs >= seg.timestamp_from && timeMs <= seg.timestamp_to;
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

  // Handle settings changes and update translation dynamically
  useEffect(() => {
    const fetchByIdentifier = async (identifier) => {
      try {
        const url = `https://api.quran.com/api/v4/verses/by_juz/${juzId}?per_page=600&translations=${identifier}`;
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

    let timestamps = segmentsMap[surahNumber];
    if (!timestamps) {
      setLoadingSurah(surahNumber);
      try {
        const res = await fetch(
          `https://api.quran.com/api/v4/chapter_recitations/7/${surahNumber}?segments=true`
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
    const fullAudioUrl = `https://download.quranicaudio.com/qdc/mishari_al_afasy/murattal/${surahNumber}.mp3`;

    if (audio?.playlistId === `surah_${surahNumber}`) {
      window.dispatchEvent(
        new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
      );
      if (isPaused) {
        audio?.resume();
      }
    } else {
      audio?.playList([fullAudioUrl], 0, `surah_${surahNumber}`, surahName);
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
        );
      }, 400);
    }
  }

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
              className={`px-3 md:px-6 py-6 flex gap-4 justify-between w-full transition-all duration-300 rounded-xl ${
                isPlaying
                  ? "bg-primaryColor/5 border-l-4 border-primaryColor shadow-sm dark:bg-emerald-500/10"
                  : "border-b border-gray-250/50 dark:border-slate-800/50 hover:bg-gray-50/50 dark:hover:bg-slate-800/20"
              }`}
            >
              {/* Play Button and Verse identifier */}
              <div className="flex flex-col items-center justify-start min-w-[50px] pt-1">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                  {verseKey}
                </span>
                <div className="mt-1">
                  {loadingSurah === surahNumber ? (
                    <div className="w-6 h-6 border-2 border-primaryColor border-t-transparent rounded-full animate-spin mt-2" />
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
              </div>

              {/* Verse Content */}
              <div className="w-full flex flex-col gap-4">
                {/* Words view or simple text */}
                {ayah.words && ayah.words.length > 0 ? (
                  <div
                    className="flex flex-wrap gap-x-3 gap-y-5 justify-start w-full pb-3"
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
                          className="relative flex flex-col items-center justify-center p-1 rounded-md hover:bg-gray-150 dark:hover:bg-slate-800/40 transition-all duration-200 group cursor-pointer border border-transparent hover:border-gray-200/30 dark:hover:border-slate-700/30"
                        >
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
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center bg-gray-900 dark:bg-slate-800 text-white text-[11px] p-2 rounded shadow-lg z-30 pointer-events-none whitespace-nowrap min-w-[60px] border border-gray-700 dark:border-slate-700">
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
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900 dark:border-t-slate-800"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div
                    className={`font-semibold text-end font-arabic text-3xl pb-3 ${
                      isPlaying
                        ? "text-primaryColor"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    {text}
                  </div>
                )}

                {/* English / Bengali translation */}
                <div className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed pt-2 border-t border-gray-100 dark:border-slate-800/80">
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
