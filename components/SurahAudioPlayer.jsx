"use client";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

function SurahAudioPlayer({ src, playAdjacentAudio }) {
  return (
    <>
      {src && (
        <div className="fixed bottom-0 left-0 w-full">
          <AudioPlayer
            autoPlay
            className=""
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
