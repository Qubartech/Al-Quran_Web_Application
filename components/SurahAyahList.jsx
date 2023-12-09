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
        const { text } = ayah || {};
        return (
          <>
            <div key={idx} className="py-1" id={idx}>
              <div className="p-5 border-b flex gap-6 justify-between w-full">
                <div className="w-12 flex items-center">
                  <div className="text-xs font-semibold text-gray-600 flex flex-col items-center justify-center">
                    {pageId}:{idx + 1}
                    <div className="w-full">
                      <SurahPlayBtn
                        isPlaying={isPlaying}
                        playControl={() => playControl(idx)}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full">
                  <div
                    className={`text-xl md:text-3xl font-semibold  text-end font-arabic pb-7 ${
                      isPlaying ? "text-red-500" : ""
                    }`}
                  >
                    {text}
                  </div>
                  <div>{englishTransAyah[idx].text}</div>
                </div>
              </div>
            </div>
          </>
        );
      })}
    </>
  );
};

export default SurahAyahList;
