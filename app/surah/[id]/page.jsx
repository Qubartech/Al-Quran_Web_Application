import SurahAyahList from "@/components/surah/SurahAyahList";
import SurahHeroHeader from "@/components/surah/SurahHeroHeader";
import getSingleSurah from "@/lib/api/getSingleSurah";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

async function Surah({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const surahNum = Number(id);
  
  if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
    notFound();
  }

  // Read language and translation identifier from cookies to persist across refreshes
  const cookieStore = cookies();
  const langCode = cookieStore.get("__language__")?.value || "bn";
  const editionIdentifier = cookieStore.get(
    "__translation_identifier__"
  )?.value;
  const reciterId = cookieStore.get("__reciter_id__")?.value || "7";

  const singleSurah = await getSingleSurah(id, langCode, editionIdentifier, reciterId);

  const { data } = singleSurah || {};
  const { ayahs: arabicAyah, englishName, arabicName, number: surahNumber, versesCount, revelationPlace, translatedName, audioUrl } = data?.[0] || {};
  const { ayahs: englishTransAyah } = data?.[1] || {};
  const { ayahs: ayahAudio } = data?.[2] || {};

  // Surah At-Tawbah (9) does not begin with Bismillah
  const showBismillah = Number(id) !== 9 && Number(id) !== 1;

  return (
    <div className="px-3 md:px-5 py-4 min-h-screen bg-transparent text-gray-950 dark:text-gray-100">

      {/* ── Upgraded State-of-the-Art Hero Header ── */}
      <SurahHeroHeader
        surahNumber={surahNumber}
        englishName={englishName}
        arabicName={arabicName}
        translatedName={translatedName}
        revelationPlace={revelationPlace}
        versesCount={versesCount}
      />

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
