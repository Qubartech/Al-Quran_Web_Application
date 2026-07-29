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
      className={`p-1 md:p-1.5 rounded-full transition-all duration-200 ${
        isPlaying
          ? "bg-primaryColor text-white shadow-md shadow-primaryColor/25 scale-105"
          : "bg-primaryColor/10 dark:bg-emerald-500/10 text-primaryColor dark:text-primaryColor-light hover:bg-primaryColor hover:text-white hover:scale-105 hover:shadow-md hover:shadow-primaryColor/20"
      }`}
      aria-label={isPlaying ? "Pause ayah" : "Play ayah"}
    >
      {isPlaying ? (
        <Pause size={12} fill="currentColor" className="md:w-3.5 md:h-3.5" />
      ) : (
        <Play size={12} fill="currentColor" className="md:w-3.5 md:h-3.5" />
      )}
    </button>
  );
}

export default SurahPlayBtn;
