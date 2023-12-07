import SurahAyahList from "@/components/SurahAyahList";
import getSingleSurah from "@/lib/api/getSingleSurah";

async function Surah({ params }) {
  const { id } = params || {};
  const singleSurah = await getSingleSurah(id);
  // console.log(singleSurah)

  const { data } = singleSurah || {};
  const { ayahs: arabicAyah, englishName } = data[0] || {};
  const { ayahs: englishTransAyah } = data[1] || {};
  const { ayahs: ayahAudio } = data[2] || {};

  return (
    <div className="px-5 py-4">
      {/* <Link href="/" className="text-2xl font-bold inline-block mb-2">{englishName}</Link> */}
      <SurahAyahList
        arabicAyah={arabicAyah}
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
        pageId={id}
      />
    </div>
  );
}

export default Surah;
