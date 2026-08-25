"use client";

import { Play, Pause } from "lucide-react";

function SurahPlayBtn({ playControl, pauseControl, isPlaying }) {
  const handleClick = () => {
    if (isPlaying) {
      pauseControl?.();
    } else {
      playControl?.();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
        isPlaying
          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30 scale-105 ring-2 ring-emerald-400/40"
          : "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white hover:scale-105 hover:shadow-md hover:shadow-emerald-500/20"
      }`}
      aria-label={isPlaying ? "Pause ayah" : "Play ayah"}
    >
      {isPlaying ? (
        <Pause size={14} fill="currentColor" className="shrink-0" />
      ) : (
        <Play size={14} fill="currentColor" className="ml-0.5 shrink-0" />
      )}
    </button>
  );
}

export default SurahPlayBtn;

