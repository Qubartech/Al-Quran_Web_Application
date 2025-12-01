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

  // Keep local english translation in sync with prop when it changes
  useEffect(() => {
    setEnglishTrans(englishTransAyah || []);
  }, [englishTransAyah]);

  // React to language/identifier changes from Settings and refetch translation
  useEffect(() => {
    const fetchByIdentifier = async (identifier) => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_QURAN_API_URL ||
          process.env.API_URL ||
          "https://api.alquran.cloud/v1";
        const url = `${apiBase}/surah/${pageId}/editions/quran-uthmani,${identifier},ar.alafasy`;
        const res = await fetch(url);
        if (!res.ok) return;
        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];
        const transEd = data.find((d) => d?.edition?.identifier === identifier);
        const newTransAyahs = transEd?.ayahs || [];
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
              <div className="px-2 md:px-5 py-5 border-b border-gray-200 dark:border-gray-700 flex gap-3 justify-between w-full transition-colors">
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
                    className={`font-semibold text-end font-arabic font-amiri ayah-arabic-text pb-7 ${
                      isPlaying
                        ? "text-primaryColor"
                        : "text-gray-900 dark:text-gray-100"
                    }`}
                    style={isPlaying ? ayahAnim : {}}
                  >
                    {text}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 ayah-text">
                    {englishTrans[idx]?.text}
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
