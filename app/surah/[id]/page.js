import SurahAyahList from "@/components/SurahAyahList";
import getSingleSurah from "@/lib/api/getSingleSurah";

async function Surah({ params }) {
  const { id } = params || {};
  const singleSurah = await getSingleSurah(id);

  const { data } = singleSurah || {};
  const { ayahs: arabicAyah, englishName } = data[0] || {};
  const { ayahs: englishTransAyah } = data[1] || {};
  const { ayahs: ayahAudio } = data[2] || {};

  return (
    <div className="px-5 pt-4 pb-28">
      <div className="text-2xl font-bold">{englishName}</div>
      <SurahAyahList
        arabicAyah={arabicAyah}
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
      />
    </div>
  );
}

export default Surah;
