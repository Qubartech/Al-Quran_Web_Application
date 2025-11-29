"use client";

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
      className="rounded-md mt-2 hover:text-primaryColor dark:hover:text-primaryColor-dark text-black dark:text-gray-100 transition-colors"
      aria-label={isPlaying ? "Pause ayah" : "Play ayah"}
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
