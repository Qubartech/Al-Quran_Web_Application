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
        const {text} = ayah || {}
        return (
          <div key={idx} className="py-2 lf" id={idx}>
            <div className=" bg-white rounded-md p-3 shadow-sm flex justify-between w-full">
              <div className="w-20 flex flex-col items-start justify-center">
                <div className="text-xs text-gray-600 px-1">{pageId}:{idx+1}</div>
                <SurahPlayBtn
                  isPlaying={isPlaying}
                  playControl={() => playControl(idx)}
                />
              </div>

              <div>
                <div
                  className={`text-xl md:text-4xl  text-end font-arabic pb-7 ${
                    isPlaying ? "text-red-500" : ""
                  }`}
                >
                  {text}
                </div>
                <div>{englishTransAyah[idx].text}</div>
              </div>
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
