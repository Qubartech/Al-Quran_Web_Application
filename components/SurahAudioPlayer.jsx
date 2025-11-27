"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function SurahAudioPlayer({ src, playAdjacentAudio, onClose }) {
  return (
    <>
      {src && (
        <div className="fixed bottom-0 left-0 w-full glass z-50">
          <div className="relative">
            <button
              className="absolute -top-7 right-4 m-4 px-3 py-1 rounded-full bg-gray-800 text-white text-xs shadow"
              onClick={onClose}
            >
              X
            </button>
          </div>
          <AudioPlayer
            autoPlay
            className="bg-transparent text-gray-900 dark:text-gray-100 border-none dark:[&_.rhap_time]:text-gray-300 [&_.rhap_time]:text-gray-600"
            src={src}
            onEnded={playAdjacentAudio}
            onClickNext={playAdjacentAudio}
            onClickPrevious={() => playAdjacentAudio(false)}
            showSkipControls
            // other props here
          />
        </div>
      )}
    </>
  );
}

export default SurahAudioPlayer;
