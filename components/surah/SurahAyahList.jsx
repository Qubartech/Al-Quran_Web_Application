"use client";

import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/context/AudioProvider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

import SurahPlayBtn from "./SurahPlayBtn";

const ayahAnim = { animation: "ayahHighlight 7s" };

const SurahAyahList = ({
  arabicAyah = [],
  englishTransAyah = [],
  ayahAudio = [],
  pageId,
  surahName,
}) => {
  const [ayahNum, setAyahNum] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [englishTrans, setEnglishTrans] = useState(englishTransAyah || []);

  const audio = useAudio();

  const list = useMemo(
    () => (Array.isArray(ayahAudio) ? ayahAudio.map((a) => a.audio) : []),
    [ayahAudio]
  );

  /** PLAY CONTROL **/
  function playControl(ayahIndex) {
    audio?.playList(list, ayahIndex, pageId, surahName);
    setAyahNum(ayahIndex);

    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        const elId = `sura_${pageId}_ayah_${ayahIndex + 1}`;
        const el = document.getElementById(elId);
        if (el) {
          el.tabIndex = -1;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus({ preventScroll: true });
        }
      });
    }
  }

  /** AUTO SCROLL ON CURRENT AYAH */
  useEffect(() => {
    if (!audio) return;
    const idx = audio.currentIndex;
    if (idx == null || idx < 0) return;
    if (audio.playlistId !== pageId) return;

    setAyahNum(idx);

    requestAnimationFrame(() => {
      const elId = `sura_${pageId}_ayah_${idx + 1}`;
      const el = document.getElementById(elId);
      if (el) {
        el.tabIndex = -1;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus({ preventScroll: true });
      }
    });
  }, [audio, audio?.currentIndex, audio?.src, pageId]);

  /** REFRESH WHEN PLAY/PAUSE TICKS CHANGE */
  useEffect(() => {
    if (!audio) return;
    setRefreshTick((t) => t + 1);
  }, [audio, audio?.playTick, audio?.pauseTick]);

  /** AUDIO PAUSE STATE */
  useEffect(() => {
    setIsPaused(audio?.paused ?? true);
  }, [audio?.paused]);

  /** SYNC TRANSLATIONS IF UPDATED */
  useEffect(() => {
    setEnglishTrans(englishTransAyah || []);
  }, [englishTransAyah]);

  /**
   * Get a full translation string for an ayah.
   * Tries multiple likely fields (from Quran.com + normalization).
   */
  function getFullTranslation(ayah, idx) {
    if (!ayah) return "";
    const direct = [
      ayah?.translation?.text,
      Array.isArray(ayah?.translations) && ayah.translations[0]?.text,
      ayah?.translation_text,
      ayah?.translation_text_simple,
      englishTrans?.[idx]?.text,
      englishTrans?.[idx]?.translation?.text,
      englishTrans?.[idx]?.__raw__?.translation?.text,
      englishTrans?.[idx]?.__raw__?.translations?.[0]?.text,
      ayah?.text,
    ];
    for (const d of direct) {
      if (typeof d === "string" && d.trim()) return d.trim();
    }
    // Build from word-by-word translations if verse-level missing
    if (Array.isArray(ayah?.words)) {
      const joined = ayah.words
        .map((w) =>
          typeof w?.translation?.text === "string"
            ? w.translation.text.trim()
            : ""
        )
        .filter(Boolean)
        .join(" ");
      if (joined) return joined;
    }
    return "";
  }

  return (
    <TooltipProvider delayDuration={200}>
      <>
        {Array.isArray(arabicAyah) &&
          arabicAyah.map((ayah, idx) => {
            const isPlaying =
              audio?.playlistId === pageId && audio?.currentIndex === idx;

            // make sure ayah.words is an array to avoid runtime errors
            const words = Array.isArray(ayah?.words) ? ayah.words : [];

            const fullTranslation = getFullTranslation(ayah, idx);

            return (
              <div
                key={idx}
                className="py-1"
                id={`sura_${pageId}_ayah_${idx + 1}`}
                tabIndex={-1}
              >
                <div className="px-2 md:px-5 py-5 border-b border-gray-200 dark:border-gray-700 flex gap-3 justify-between w-full transition-colors">
                  {/* LEFT SIDE — AYAH NUMBER + PLAY BTN */}
                  <div className="md:w-12 flex items-center justify-center">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex flex-col items-center">
                      {pageId}:{idx + 1}
                      <div className="w-full flex justify-center">
                        <SurahPlayBtn
                          isPlaying={
                            audio?.open &&
                            audio.playlistId === pageId &&
                            audio.currentIndex === idx &&
                            !isPaused
                          }
                          playControl={() => playControl(idx)}
                          pauseControl={() => audio?.pause()}
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE — ARABIC WORDS + ENGLISH */}
                  <div className="w-full">
                    {/* ARABIC WORD-BY-WORD */}
                    <div
                      className={`font-semibold text-end font-arabic font-amiri ayah-arabic-text pb-7 ${
                        isPlaying
                          ? "text-primaryColor"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                      style={isPlaying ? ayahAnim : {}}
                    >
                      <span className="inline-flex flex-wrap gap-2 leading-loose justify-end">
                        {words.length > 0 ? (
                          [...words].reverse().map((w, wIdx) => (
                            <Tooltip key={wIdx}>
                              <TooltipTrigger className="cursor-pointer hover:text-primaryColor transition">
                                {w?.text_uthmani || w?.text || ""}
                              </TooltipTrigger>

                              <TooltipContent className="text-sm max-w-xs text-start">
                                <b>{w?.translation?.text || ""}</b>
                                <div className="text-gray-400 text-xs">
                                  {w?.transliteration?.text || ""}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          ))
                        ) : (
                          <span>{ayah?.text_uthmani || ayah?.text || ""}</span>
                        )}
                      </span>
                    </div>

                    {/* FULL ENGLISH TRANSLATION */}
                    <div className="text-gray-700 dark:text-gray-300 ayah-text">
                      {fullTranslation ||
                        // If still empty, try englishTrans array fallback directly
                        englishTrans?.[idx]?.text ||
                        englishTrans?.[idx]?.translation?.text}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </>
    </TooltipProvider>
  );
};

export default SurahAyahList;
