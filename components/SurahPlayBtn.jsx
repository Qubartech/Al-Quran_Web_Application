"use client";

function SurahPlayBtn({ playControl, isPlaying, setShowPlayer }) {
  return (
    <button
      onClick={() => {
        playControl();
        setShowPlayer(true);
      }}
      className={`rounded-md mt-2 hover:bg-red-500 dark:hover:bg-red-600 text-black dark:text-gray-100 transition-colors ${
        isPlaying ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isPlaying ? (
        <box-icon name="pause-circle" color="currentColor"></box-icon>
      ) : (
        <box-icon name="play-circle" color="currentColor"></box-icon>
      )}
    </button>
  );
}

export default SurahPlayBtn;
