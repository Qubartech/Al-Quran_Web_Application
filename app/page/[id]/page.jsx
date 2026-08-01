import JuzAyahList from "@/components/juz/JuzAyahList";
import getSinglePage from "@/lib/api/getSinglePage";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  return {
    title: `Page ${id} - Quran Application`,
    description: `Read Holy Quran Page ${id}`,
  };
}

async function PageRoute({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const pageId = parseInt(id, 10);
  
  if (isNaN(pageId) || pageId < 1 || pageId > 604) {
    notFound();
  }

  const cookieStore = cookies();
  const langCode = cookieStore.get("__language__")?.value || "bn";
  const editionIdentifier = cookieStore.get(
    "__translation_identifier__"
  )?.value;
  const reciterId = cookieStore.get("__reciter_id__")?.value || "7";

  const singlePage = await getSinglePage(pageId, langCode, editionIdentifier, reciterId);
  const { data } = singlePage || {};
  const { ayahs: arabicAyah } = data?.[0] || {};
  const { ayahs: englishTransAyah } = data?.[1] || {};
  const { ayahs: ayahAudio } = data?.[2] || {};

  const firstAyah = arabicAyah?.[0];
  const pageJuz = firstAyah?.juz || 1;
  const firstSurahName = firstAyah?.surahName || "Quran";

  return (
    <div className="px-5 min-h-screen bg-white dark:bg-slate-900 dark:text-gray-100 max-w-screen-xl mx-auto pt-6">
      {/* Back button */}
      <div className="mb-4">
        <Link href="/surah" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-emerald-500 transition-colors">
          <IoChevronBack size={16} />
          Back to Quran
        </Link>
      </div>

      {/* Header card (Quran.com Style) */}
      <div className="py-8 border-b border-gray-200/50 dark:border-slate-800/80 bg-gray-50 dark:bg-slate-900 mt-2 rounded-2xl relative overflow-hidden glass shadow-sm mb-6 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/5 z-0"></div>
        <div className="relative z-10 flex flex-col gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{pageId}</span>
          </div>
          <div className="text-3xl font-black tracking-tight flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span>Page {pageId}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium text-xl md:text-2xl">
              ({firstSurahName})
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold bg-white/40 dark:bg-slate-800/40 px-3.5 py-1 rounded-full border border-gray-200/30 dark:border-slate-800/40">
            Juz {pageJuz} &bull; Mushaf Page {pageId} / 604
          </p>
        </div>
      </div>

      <JuzAyahList
        arabicAyah={arabicAyah}
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
        juzId={`page_${pageId}`}
      />
    </div>
  );
}

export default PageRoute;
