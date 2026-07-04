import SurahAyahList from "@/components/surah/SurahAyahList";
import getSingleSurah from "@/lib/api/getSingleSurah";
import { cookies } from "next/headers";

async function Surah({ params }) {
  const { id } = params || {};
  // Read language and translation identifier from cookies to persist across refreshes
  const cookieStore = cookies();
  const langCode = cookieStore.get("__language__")?.value || "bn";
  const editionIdentifier = cookieStore.get(
    "__translation_identifier__"
  )?.value;

  const singleSurah = await getSingleSurah(id, langCode, editionIdentifier);
  // console.log(singleSurah)

  const { data } = singleSurah || {};
  const { ayahs: arabicAyah, englishName, arabicName, number: surahNumber, versesCount, revelationPlace, translatedName } = data[0] || {};
  const { ayahs: englishTransAyah } = data[1] || {};
  const { ayahs: ayahAudio } = data[2] || {};

  return (
    <div className="px-5 py-4 min-h-screen bg-transparent text-gray-950 dark:text-gray-100">
      <div className="py-8 border-b border-gray-200/50 dark:border-slate-800/80 bg-gray-50/40 dark:bg-slate-900/40 rounded-2xl relative overflow-hidden glass shadow-sm mb-6 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-br from-primaryColor/5 to-emerald-500/5 dark:from-primaryColor/10 dark:to-emerald-500/5 z-0"></div>
        <div className="relative z-10 flex flex-col gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
          {/* Surah Number Badge */}
          <div className="w-12 h-12 rounded-full bg-primaryColor/10 dark:bg-primaryColor-light/10 border-2 border-primaryColor dark:border-primaryColor-light flex items-center justify-center">
            <span className="text-lg font-bold text-primaryColor dark:text-primaryColor-light">{surahNumber}</span>
          </div>
          {/* Surah Name */}
          <div className="text-4xl font-semibold tracking-wide flex items-center gap-4">
            <span>{englishName}</span>
            {arabicName && (
              <span className="font-arabic text-3xl text-primaryColor font-normal dark:text-primaryColor-light ml-2">
                {arabicName}
              </span>
            )}
          </div>
          {/* Translated Meaning */}
          {translatedName && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              &quot;{translatedName}&quot;
            </p>
          )}
          {/* Metadata Row */}
          <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-1">
            {revelationPlace && (
              <span className="flex items-center gap-1 capitalize">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                {revelationPlace}
              </span>
            )}
            {versesCount && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                {versesCount} Ayahs
              </span>
            )}
          </div>
        </div>
      </div>
      <SurahAyahList
        arabicAyah={arabicAyah}
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
        pageId={id}
        surahName={englishName}
      />
    </div>
  );
}

export default Surah;
