"use client";
import { useState } from "react";
import SurahAudioPlayer from "./SurahAudioPlayer";

function SurahPlayBtn({ playNum, AudioArr }) {
  const [audioSrc, setAudioSrc] = useState("");
  const [pause, setPause] = useState(false);
  console.log(audioSrc);

  function playControl() {
    setAudioSrc("");
    setAudioSrc(AudioArr[playNum].audio);
    setPause(true);
  }

  return (
    <>
      <button
        onClick={() => playControl()}
        className="border p-2 rounded-md mt-2"
      >
        Play Audio
      </button>
      <SurahAudioPlayer src={audioSrc} pause={pause} />
    </>
  );
}

export default SurahPlayBtn;
