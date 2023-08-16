

import SurahPlayBtn from "@/components/SurahPlayBtn";
import getSingleSurah from "@/lib/api/getSingleSurah";


async function Surah({ params }) {
  const { id } = params || {};
  const singleSurah = await getSingleSurah(id);

  const { data } = singleSurah || {};
  const { ayahs: arabicAyah, englishName } = data[0] || {};
  const { ayahs: englishTransAyah } = data[1] || {};
  const { ayahs: ayahAudio } = data[2] || {};

  console.log(ayahAudio);

  return (
    <div className="px-5 pt-4 pb-28">
      <div className="text-2xl font-bold">{englishName}</div>
      {arabicAyah.map((ayah, idx) => {
        return (
          <div key={idx} className="py-2">
            <div className=" bg-white rounded-md p-3">
              <div className="text-lg text-end">{ayah.text}</div>
              <div>{englishTransAyah[idx].text}</div>
              <SurahPlayBtn playNum={idx} AudioArr={ayahAudio}/>
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
    </div>
  );
}

export default Surah;
