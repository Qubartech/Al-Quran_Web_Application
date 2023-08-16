"use client";

import { useState } from "react";
import SurahAudioPlayer from "./SurahAudioPlayer";
import SurahPlayBtn from "./SurahPlayBtn";
import { useRouter } from "next/navigation";
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

  function autoplayNext() {
    if (ayahNum < arabicAyah.length - 1) playControl(ayahNum + 1);
    else setAudioSrc("");
  }

  return (
    <>
      <SurahAudioPlayer src={audioSrc} autoplayNext={autoplayNext} />

      {arabicAyah.map((ayah, idx) => {
        return (
          <div key={idx} className="py-2" id={idx}>
            <div className=" bg-white rounded-md p-3 shadow-sm">
              <div
                className={`text-md md:text-xl font-semibold text-end ${
                  ayahNum === idx && audioSrc !== "" && "text-red-500"
                }`}
                
              >
                {ayah.text}
              </div>
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
