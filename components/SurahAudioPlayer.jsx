"use client";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function SurahAudioPlayer({
  src,
  playAdjacentAudio,
  onClose,
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
    mq.addEventListener
      ? mq.addEventListener("change", update)
      : mq.addListener(update);
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener("change", update)
        : mq.removeListener(update);
    };
  }, []);

  if (!src) return null;

  // Pause underlying audio without unmounting when pauseTick changes
  useEffect(() => {
    if (!pauseTick) return;
    try {
      const audioEl = playerRef.current?.audio?.current;
      audioEl?.pause?.();
    } catch (e) {
      // ignore
    }
  }, [pauseTick]);

  // Ensure playback resumes/starts when playTick changes (e.g., same src)
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
      <div className="relative">
        <button
          className="absolute -top-7 right-4 m-4 px-3 py-1 rounded-full bg-gray-800 text-white text-xs shadow"
          onClick={onClose}
          aria-label="Close audio player"
        >
          X
        </button>
      </div>
      <AudioPlayer
        ref={playerRef}
        autoPlay
        className="bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-none [&_.rhap_time]:text-gray-600 dark:[&_.rhap_time]:text-gray-300 dark:[&_.rhap_main]:!text-gray-300 dark:[&_.rhap_header]:!text-gray-300 dark:[&_.rhap_controls]:!text-gray-300"
        src={src}
        onEnded={playAdjacentAudio}
        onClickNext={playAdjacentAudio}
        onClickPrevious={() => playAdjacentAudio(false)}
        layout={isMdUp ? "horizontal" : "stacked"}
        showSkipControls
        header={
          title
            ? `${title} - Ayah ${
                typeof currentIndex === "number" && currentIndex >= 0
                  ? currentIndex + 1
                  : ""
              }`
            : "Surah audio is playing"
        }
      />
    </div>
  );
}

export default SurahAudioPlayer;
