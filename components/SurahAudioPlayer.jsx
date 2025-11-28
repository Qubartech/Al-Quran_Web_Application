"use client";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function SurahAudioPlayer({
  src,
  playNext,
  playPrev,
  onClose,
  onPause,
  onPlay,
  title,
  currentIndex,
  pauseTick,
  playTick,
}) {
  const playerRef = useRef(null);
  const [isMdUp, setIsMdUp] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsMdUp(mq.matches);
    update();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
    } else {
      mq.onchange = update;
    }
    return () => {
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", update);
      } else {
        mq.onchange = null;
      }
    };
  }, []);

  if (!src) return null;

  useEffect(() => {
    if (!pauseTick) return;
    try {
      const audioEl = playerRef.current?.audio?.current;
      audioEl?.pause?.();
    } catch (e) {
      // ignore
    }
  }, [pauseTick]);

  useEffect(() => {
    if (!playTick) return;
    try {
      const audioEl = playerRef.current?.audio?.current;
      audioEl?.play?.();
    } catch (e) {
      // ignore
    }
  }, [playTick]);

  return (
    <div className="fixed bottom-0 left-0 w-full glass z-50">
      <AudioPlayer
        ref={playerRef}
        autoPlay
        className="bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none [&_.rhap_time]:text-gray-600 dark:[&_.rhap_time]:text-gray-300 dark:[&_.rhap_main]:!text-gray-300 dark:[&_.rhap_header]:!text-gray-300 dark:[&_.rhap_controls]:!text-gray-300"
        src={src}
        onEnded={playNext}
        onClickNext={playNext}
        onClickPrevious={playPrev}
        onPause={onPause}
        onPlay={onPlay}
        layout={isMdUp ? "horizontal" : "stacked"}
        showSkipControls
        header={
          <div className="flex items-center justify-between w-full">
            <div className="text-sm md:text-base font-semibold text-gray-900 dark:text-gray-300">
              {title
                ? `${title} - Ayah ${
                    typeof currentIndex === "number" && currentIndex >= 0
                      ? currentIndex + 1
                      : ""
                  }`
                : "Surah audio is playing"}
            </div>
            <button
              onClick={onClose}
              aria-label="Close audio player"
              className="ml-3 px-3 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        }
      />
    </div>
  );
}

export default SurahAudioPlayer;
