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
      className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
        isPlaying
          ? "bg-primaryColor text-white shadow-md shadow-primaryColor/25 scale-105"
          : "bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor dark:text-primaryColor-light hover:bg-primaryColor hover:text-white hover:scale-105 hover:shadow-md hover:shadow-primaryColor/20"
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
