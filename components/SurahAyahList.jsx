"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import SurahAudioPlayer from "./SurahAudioPlayer";
import SurahPlayBtn from "./SurahPlayBtn";
// import { useRouter } from "next/router";

const SurahAyahList = ({ arabicAyah, englishTransAyah, ayahAudio, pageId }) => {
  const [ayahNum, setAyahNum] = useState(null);
  const [audioSrc, setAudioSrc] = useState("");
  const router = useRouter();

  function playControl(ayahNum) {
    setAudioSrc(ayahAudio[ayahNum].audio);
    setAyahNum(ayahNum);
    router.push(`/surah/${pageId}/#${ayahNum}`);
  }

  function playAdjacentAudio(playNext = true) {
    let ayahToPlay = null;

    if (playNext && ayahNum < arabicAyah.length - 1) ayahToPlay = ayahNum + 1;
    else if (!playNext && ayahNum > 1) ayahToPlay = ayahNum - 1;
    else {
      ayahToPlay = null;
      setAudioSrc("");
    }

    ayahToPlay && playControl(ayahToPlay);
  }

  return (
    <>
      <SurahAudioPlayer src={audioSrc} playAdjacentAudio={playAdjacentAudio} />

      {arabicAyah.map((ayah, idx) => {
        const isPlaying = ayahNum === idx && audioSrc !== "";
        return (
          <div key={idx} className="py-2" id={idx}>
            <div className=" bg-white rounded-md p-3 shadow-sm">
              <div
                className={`text-md md:text-xl font-semibold text-end ${
                  isPlaying ? "text-red-500" : ""
                }`}
              >
                {ayah.text}
              </div>
              <div>{englishTransAyah[idx].text}</div>
              <SurahPlayBtn
                isPlaying={isPlaying}
                playControl={() => playControl(idx)}
              />
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
