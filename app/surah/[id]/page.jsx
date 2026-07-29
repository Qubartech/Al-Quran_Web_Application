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
  const reciterId = cookieStore.get("__reciter_id__")?.value || "7";

  const singleSurah = await getSingleSurah(id, langCode, editionIdentifier, reciterId);
  // console.log(singleSurah)

  const { data } = singleSurah || {};
  const { ayahs: arabicAyah, englishName, arabicName, number: surahNumber, versesCount, revelationPlace, translatedName, audioUrl } = data[0] || {};
  const { ayahs: englishTransAyah } = data[1] || {};
  const { ayahs: ayahAudio } = data[2] || {};

  // Surah At-Tawbah (9) does not begin with Bismillah
  const showBismillah = Number(id) !== 9 && Number(id) !== 1;

  return (
    <div className="px-3 md:px-5 py-4 min-h-screen bg-transparent text-gray-950 dark:text-gray-100">

      {/* ── Premium Hero Header ── */}
      <div className="py-10 md:py-12 rounded-2xl relative overflow-hidden glass shadow-sm mb-2 animate-fadeIn">
        {/* Layered gradient backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-primaryColor/5 via-emerald-500/3 to-teal-500/5 dark:from-primaryColor/10 dark:via-emerald-500/5 dark:to-teal-500/8 z-0"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-primaryColor/5 dark:bg-primaryColor-light/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0"></div>
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-emerald-500/5 dark:bg-emerald-500/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 z-0"></div>

        <div className="relative z-10 flex flex-col gap-4 justify-center items-center text-gray-900 dark:text-gray-100">

          {/* Surah Number Badge — Gradient border with glow */}
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primaryColor to-emerald-400 dark:from-primaryColor-light dark:to-emerald-300 opacity-20 blur-md group-hover:opacity-30 transition-opacity"></div>
            <div className="relative w-10 h-10 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primaryColor/15 to-emerald-500/10 dark:from-primaryColor-light/15 dark:to-emerald-400/10 border-2 border-primaryColor/40 dark:border-primaryColor-light/40 flex items-center justify-center shadow-lg shadow-primaryColor/10">
              <span className="text-sm md:text-lg font-bold text-primaryColor dark:text-primaryColor-light">{surahNumber}</span>
            </div>
          </div>

          {/* Surah Name — Elevated typography */}
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold tracking-wide flex items-center justify-center gap-4 flex-wrap">
              <span>{englishName}</span>
              {arabicName && (
                <span className="font-arabic text-3xl md:text-4xl text-primaryColor dark:text-primaryColor-light font-semibold">
                  {arabicName}
                </span>
              )}
            </div>

            {/* Translated Meaning */}
            {translatedName && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
                &quot;{translatedName}&quot;
              </p>
            )}
          </div>

          {/* Metadata Chips */}
          <div className="flex items-center gap-3 mt-1">
            {revelationPlace && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-800/40 border border-gray-200/30 dark:border-slate-700/30 text-xs font-semibold text-gray-600 dark:text-gray-300 capitalize shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primaryColor dark:text-primaryColor-light" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                {revelationPlace}
              </span>
            )}
            {versesCount && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 dark:bg-slate-800/40 border border-gray-200/30 dark:border-slate-700/30 text-xs font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primaryColor dark:text-primaryColor-light" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                {versesCount} Ayahs
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Ornamental Divider ── */}
      <div className="ornamental-divider my-4 mx-4 md:mx-8">
        <svg width="20" height="20" viewBox="0 0 20 20" className="text-primaryColor/50 dark:text-primaryColor-light/50 shrink-0" fill="currentColor">
          <polygon points="10,0 13,7 20,7 14.5,11.5 16.5,19 10,14.5 3.5,19 5.5,11.5 0,7 7,7" />
        </svg>
      </div>

      {/* ── Bismillah Decoration ── */}
      {showBismillah && (
        <div className="text-center py-6 md:py-8 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
          <p className="bismillah-text font-arabic text-primaryColor dark:text-primaryColor-light opacity-80 select-none">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-medium italic">
            In the name of Allah, the Most Gracious, the Most Merciful
          </p>
        </div>
      )}

      {/* ── Ayah List ── */}
      <SurahAyahList
        arabicAyah={arabicAyah}
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
        pageId={id}
        surahName={englishName}
        fullAudioUrl={audioUrl}
      />
    </div>
  );
}

export default Surah;
