"use client";

function SurahPlayBtn({ playControl, isPlaying }) {
  return (
    <button
      onClick={playControl}
      className={`border p-2 rounded-md mt-2 ${isPlaying ? "opacity-50 pointer-events-none" : ""}`}
    >
      Play Audio
    </button>
  );
}

export default SurahPlayBtn;
