import JuzAyahList from "@/components/juz/JuzAyahList";
import getSingleJuz from "@/lib/api/getSingleJuz";
import { juzList } from "@/lib/juzData";
import { cookies } from "next/headers";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";

export async function generateMetadata({ params }) {
  const { id } = params || {};
  return {
    title: `Juz ${id} - Quran Application`,
    description: `Read Holy Quran Juz ${id}`,
  };
}

async function Juz({ params }) {
  const { id } = params || {};
  const juzId = parseInt(id, 10);
  
  const cookieStore = cookies();
  const langCode = cookieStore.get("__language__")?.value || "bn";
  const editionIdentifier = cookieStore.get(
    "__translation_identifier__"
  )?.value;

  const singleJuz = await getSingleJuz(juzId, langCode, editionIdentifier);
  const { data } = singleJuz || {};
  const { ayahs: arabicAyah } = data[0] || {};
  const { ayahs: englishTransAyah } = data[1] || {};
  const { ayahs: ayahAudio } = data[2] || {};

  const juzMeta = juzList.find((j) => j.number === juzId);

  return (
    <div className="px-5 min-h-screen bg-white dark:bg-slate-900 dark:text-gray-100 max-w-screen-xl mx-auto pt-6">
      {/* Back button */}
      <div className="mb-4">
        <Link href="/juz" className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-primaryColor transition-colors">
          <IoChevronBack size={16} />
          Back to Juz List
        </Link>
      </div>

      {/* Header card */}
      <div className="py-8 border-b border-gray-200/50 dark:border-slate-800/80 bg-gray-50 dark:bg-slate-900 mt-2 rounded-2xl relative overflow-hidden glass shadow-sm mb-6 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-br from-primaryColor/5 to-emerald-500/5 dark:from-primaryColor/10 dark:to-emerald-500/5 z-0"></div>
        <div className="relative z-10 flex flex-col gap-3 justify-center items-center text-gray-900 dark:text-gray-100">
          <div className="w-12 h-12 rounded-full bg-primaryColor/10 dark:bg-emerald-500/10 border-2 border-primaryColor dark:border-primaryColor-light flex items-center justify-center">
            <span className="text-lg font-bold text-primaryColor dark:text-primaryColor-light">{juzId}</span>
          </div>
          <div className="text-3xl font-bold tracking-wide flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <span>Juz {juzId}</span>
            {juzMeta && (
              <span className="text-gray-550 dark:text-gray-400 font-medium text-xl md:text-2xl">
                ({juzMeta.nameEnglish})
              </span>
            )}
            {juzMeta && (
              <span className="font-arabic text-2xl text-primaryColor dark:text-primaryColor-light font-normal">
                {juzMeta.nameArabic}
              </span>
            )}
          </div>
          {juzMeta && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold bg-white/40 dark:bg-slate-800/40 px-3 py-1 rounded-full border border-gray-250/20 dark:border-slate-800/20">
              Range: {juzMeta.start} to {juzMeta.end}
            </p>
          )}
        </div>
      </div>

      <JuzAyahList
        arabicAyah={arabicAyah}
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
        juzId={juzId}
      />
    </div>
  );
}

export default Juz;
