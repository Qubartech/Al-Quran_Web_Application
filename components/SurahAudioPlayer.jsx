"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function SurahAudioPlayer({ src, playAdjacentAudio, onClose }) {
  return (
    <>
      {src && (
        <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-50 transition-colors">
          {/* <div className="relative">
            <button
              className="absolute top-0 right-0 m-4 p-2 rounded-full bg-gray-800 text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div> */}
          <AudioPlayer
            autoPlay
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-none dark:[&_.rhap_time]:text-gray-300 [&_.rhap_time]:text-gray-600"
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
