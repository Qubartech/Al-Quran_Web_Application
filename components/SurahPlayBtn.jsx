"use client";

function SurahPlayBtn({ playControl, isPlaying, setShowPlayer }) {
  return (
    <button
      onClick={() => {
        playControl(); setShowPlayer(true);
      }}
      className={`rounded-md mt-2 ${
        isPlaying ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {isPlaying ? (
        <box-icon name="pause-circle"></box-icon>
      ) : (
        <box-icon name="play-circle"></box-icon>
      )}
    </button>
  );
}

export default SurahPlayBtn;
