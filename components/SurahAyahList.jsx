"use client";

import { useEffect, useMemo, useState } from "react";
import { useAudio } from "@/context/AudioProvider";

// Add custom animation style
const ayahAnim = {
  animation: "ayahHighlight 7s",
};
import SurahAudioPlayer from "./SurahAudioPlayer";
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
  const audio = useAudio();

  const list = useMemo(() => ayahAudio.map((a) => a.audio), [ayahAudio]);

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

  function playAdjacentAudio(playNext = true) {
    let ayahToPlay = null;

    if (playNext && ayahNum < arabicAyah.length - 1) ayahToPlay = ayahNum + 1;
    else if (!playNext && ayahNum > 0) ayahToPlay = ayahNum - 1;
    else {
      ayahToPlay = null;
      audio?.close();
    }

    ayahToPlay && playControl(ayahToPlay);
  }

  const closePlayer = () => {
    audio?.close();
  };

  useEffect(() => {
    if (!audio) return;
    const idx = audio.currentIndex;
    if (idx == null || idx < 0) return;
    const belongsHere = audio.playlistId === pageId;
    if (!belongsHere) return;

    setAyahNum(idx);
    if (typeof window !== "undefined") {
      // Avoid modifying URL to prevent flashing
      requestAnimationFrame(() => {
        const elId = `sura_${pageId}_ayah_${idx + 1}`;
        const el = document.getElementById(elId);
        if (el) {
          el.tabIndex = -1;
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus({ preventScroll: true });
          // Keep URL unchanged
        }
      });
    }
  }, [audio, audio?.currentIndex, audio?.src, list, pageId]);

  // Force re-render when audio play/pause ticks change so isPlaying updates immediately
  useEffect(() => {
    if (!audio) return;
    setRefreshTick((t) => t + 1);
  }, [audio, audio?.playTick, audio?.pauseTick]);

  // Track paused explicitly from provider
  useEffect(() => {
    setIsPaused(audio?.paused ?? true);
  }, [audio, audio?.paused]);

  return (
    <>
      {/* Audio player is rendered globally via AudioProvider */}

      {arabicAyah.map((ayah, idx) => {
        const isPlaying =
          audio?.playlistId === pageId && audio?.currentIndex === idx;
        const { text } = ayah || {};
        return (
          <>
            <div
              key={idx}
              className="py-1"
              id={`sura_${pageId}_ayah_${idx + 1}`}
              tabIndex={-1}
            >
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex gap-6 justify-between w-full transition-colors">
                <div className="w-12 flex items-center">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center">
                    {pageId}:{idx + 1}
                    <div className="w-full">
                      <SurahPlayBtn
                        key={`spb_${idx}_pid_${audio?.playlistId ?? "-"}_ci_${
                          audio?.currentIndex ?? -1
                        }_open_${audio?.open ? 1 : 0}_paused_${
                          audio?.paused ? 1 : 0
                        }_play_${audio?.playTick ?? 0}_pause_${
                          audio?.pauseTick ?? 0
                        }_src_${audio?.src ?? "-"}`}
                        isPlaying={
                          audio?.open &&
                          audio?.playlistId === pageId &&
                          audio?.currentIndex === idx &&
                          !isPaused
                        }
                        playControl={() => playControl(idx)}
                        pauseControl={() => audio?.pause()}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div
                    className={`text-xl md:text-3xl font-semibold text-end font-arabic pb-7 ${
                      isPlaying
                        ? "text-primary"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                    style={isPlaying ? ayahAnim : {}}
                  >
                    {text}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300">
                    {englishTransAyah[idx].text}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default SurahAyahList;
