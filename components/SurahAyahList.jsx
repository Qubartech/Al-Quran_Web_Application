"use client";

import { useState } from "react";

// Add custom animation style
const ayahAnim = {
  animation: "ayahHighlight 7s",
};
import SurahAudioPlayer from "./SurahAudioPlayer";
import SurahPlayBtn from "./SurahPlayBtn";
// import { useRouter } from "next/router";

const SurahAyahList = ({ arabicAyah, englishTransAyah, ayahAudio, pageId }) => {
  const [ayahNum, setAyahNum] = useState(null);
  const [audioSrc, setAudioSrc] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  function playControl(ayahIndex) {
    setAudioSrc(ayahAudio[ayahIndex].audio);
    setAyahNum(ayahIndex);

    if (typeof window !== "undefined") {
      try {
        history.replaceState(null, "", `#${ayahIndex}`);
      } catch (e) {}

      requestAnimationFrame(() => {
        const el = document.getElementById(String(ayahIndex));
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
    else if (!playNext && ayahNum > 1) ayahToPlay = ayahNum - 1;
    else {
      ayahToPlay = null;
      setAudioSrc("");
    }

    ayahToPlay && playControl(ayahToPlay);
  }

  const closePlayer = () => {
    setShowPlayer(false);
    // Additional logic to pause or stop audio playback if needed
  };

  return (
    <>
      {showPlayer && (
        <SurahAudioPlayer
          src={audioSrc}
          playAdjacentAudio={playAdjacentAudio}
          onClose={closePlayer}
        />
      )}

      {arabicAyah.map((ayah, idx) => {
        const isPlaying = ayahNum === idx && audioSrc !== "";
        const { text } = ayah || {};
        return (
          <>
            <div key={idx} className="py-1" id={idx} tabIndex={-1}>
              <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex gap-6 justify-between w-full bg-white dark:bg-gray-900 transition-colors">
                <div className="w-12 flex items-center">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex flex-col items-center justify-center">
                    {pageId}:{idx + 1}
                    <div className="w-full">
                      <SurahPlayBtn
                        isPlaying={isPlaying}
                        playControl={() => playControl(idx)}
                        setShowPlayer={setShowPlayer}
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
