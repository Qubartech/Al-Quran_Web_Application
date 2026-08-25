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
  const cookieStore = await cookies();
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

      {/* ── Bismillah Illuminated Manuscript Frame ── */}
      {showBismillah && (
        <div className="flex justify-center my-6 animate-fadeIn" style={{ animationDelay: '0.15s' }}>
          <div className="relative py-6 px-8 md:px-16 rounded-3xl glass border border-emerald-500/20 dark:border-emerald-500/30 text-center max-w-xl w-full shadow-lg overflow-hidden group">
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/10 to-amber-500/5 dark:from-emerald-400/5 dark:via-teal-400/10 dark:to-amber-400/5 pointer-events-none" />
            
            {/* Ornamental side brackets */}
            <div className="relative z-10 flex items-center justify-center gap-4">
              <span className="text-emerald-500/40 dark:text-emerald-400/40 text-xl font-arabic select-none">
                ﷽
              </span>
            </div>

            <p className="relative z-10 bismillah-text font-arabic text-2xl sm:text-3xl md:text-4xl text-slate-800 dark:text-slate-100 font-bold tracking-wide select-none drop-shadow-sm my-1">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="relative z-10 text-xs sm:text-sm text-emerald-700/80 dark:text-emerald-400/80 font-medium italic mt-1.5">
              In the Name of Allah—the Most Compassionate, Most Merciful
            </p>
          </div>
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
