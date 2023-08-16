"use client";

import { useState } from "react";
import SurahAudioPlayer from "./SurahAudioPlayer";
import SurahPlayBtn from "./SurahPlayBtn";

const SurahAyahList = ({ arabicAyah, englishTransAyah, ayahAudio }) => {
  const [audioSrc, setAudioSrc] = useState("");
  const [pause, setPause] = useState(false);

  function playControl(ayahNum) {
    setAudioSrc("");
    setAudioSrc(ayahAudio[ayahNum].audio);
    setPause(true);
  }

  return (
    <>
      <SurahAudioPlayer src={audioSrc} pause={pause} />

      {arabicAyah.map((ayah, idx) => {
        return (
          <div key={idx} className="py-2">
            <div className=" bg-white rounded-md p-3">
              <div className="text-lg text-end">{ayah.text}</div>
              <div>{englishTransAyah[idx].text}</div>
              <SurahPlayBtn playControl={() => playControl(idx)} />
            </div>
            {/* {englishTransAyah.((ayah, idx) => {
              return (
                <div key={idx} className="py-2">
                  <div className="text-end bg-white rounded-md p-3">
                    {ayah.text}
                  </div>
                </div>
              );
            })} */}
          </div>
        );
      })}
    </>
  );
};

export default SurahAyahList;
