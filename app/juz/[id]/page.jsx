import JuzAyahList from "@/components/juz/JuzAyahList";
import JuzBookmarkBtn from "@/components/juz/JuzBookmarkBtn";
import getSingleJuz from "@/lib/api/getSingleJuz";
import { juzList } from "@/lib/juzData";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Compass, Layers, Sparkles, BookOpen } from "lucide-react";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const juzId = parseInt(id, 10);
  const juzMeta = juzList.find((j) => j.number === juzId);

  return {
    title: `Juz ${id} (${juzMeta?.nameEnglish || "Quran Partition"}) - Al-Quran Application`,
    description: `Read Holy Quran Juz ${id} (${juzMeta?.nameEnglish || ""}), covering ${juzMeta?.start || ""} to ${juzMeta?.end || ""} with English translations and word-by-word recitations.`,
  };
}

async function Juz({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const juzId = parseInt(id, 10);
  
  if (isNaN(juzId) || juzId < 1 || juzId > 30) {
    notFound();
  }

  const cookieStore = await cookies();
  const langCode = cookieStore.get("__language__")?.value || "bn";
  const editionIdentifier = cookieStore.get(
    "__translation_identifier__"
  )?.value;
  const reciterId = cookieStore.get("__reciter_id__")?.value || "7";

  const singleJuz = await getSingleJuz(juzId, langCode, editionIdentifier, reciterId);
  const { data } = singleJuz || {};
  const { ayahs: arabicAyah } = data?.[0] || {};
  const { ayahs: englishTransAyah } = data?.[1] || {};
  const { ayahs: ayahAudio } = data?.[2] || {};

  const juzMeta = juzList.find((j) => j.number === juzId);
  const prevJuz = juzList.find((j) => j.number === juzId - 1);
  const nextJuz = juzList.find((j) => j.number === juzId + 1);

  return (
    <div className="px-4 sm:px-6 min-h-screen bg-transparent dark:text-gray-100 max-w-screen-xl mx-auto pt-6 pb-12 animate-fadeIn">
      
      {/* ── 1. Luxury Juz Hero Header Banner ── */}
      <div className="relative overflow-hidden p-6 sm:p-8 md:p-10 rounded-3xl glass border border-emerald-500/20 dark:border-emerald-500/30 shadow-xl mb-6 transition-all duration-300">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/40 dark:from-slate-950/95 dark:via-emerald-950/40 dark:to-slate-900/90 z-0 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl z-0 pointer-events-none" />

        {/* Islamic Arabesque Geometric Backdrop */}
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="juzHeaderPattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600 dark:text-emerald-400">
                  <polygon points="35,0 45.5,10.5 59.5,10.5 59.5,24.5 70,35 59.5,45.5 59.5,59.5 45.5,59.5 35,70 24.5,59.5 10.5,59.5 10.5,45.5 0,35 10.5,24.5 10.5,10.5 24.5,10.5" />
                  <circle cx="35" cy="35" r="14" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#juzHeaderPattern)" />
          </svg>
        </div>

        {/* Header Content */}
        <div className="relative z-10 flex flex-col items-center text-center gap-4">
          
          {/* Top Quick Prev / Next Jump Buttons */}
          <div className="w-full flex items-center justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">
            {juzId > 1 ? (
              <Link
                href={`/juz/${juzId - 1}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200/50 dark:border-slate-800 transition-all backdrop-blur-md"
                title="Previous Juz"
              >
                <ChevronLeft size={14} />
                <span className="hidden sm:inline">Juz {juzId - 1}</span>
                <span className="sm:hidden">Prev</span>
              </Link>
            ) : (
              <div className="w-16" />
            )}

            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] uppercase tracking-wider">
              Juz {juzId} of 30
            </span>

            {juzId < 30 ? (
              <Link
                href={`/juz/${juzId + 1}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-900/70 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/20 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 border border-gray-200/50 dark:border-slate-800 transition-all backdrop-blur-md"
                title="Next Juz"
              >
                <span className="hidden sm:inline">Juz {juzId + 1}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight size={14} />
              </Link>
            ) : (
              <div className="w-16" />
            )}
          </div>

          {/* SVG 8-Point Star Medallion */}
          <div className="relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="juzHeroStarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>
              <rect x="15" y="15" width="70" height="70" rx="10" fill="url(#juzHeroStarGradient)" stroke="#34d399" strokeWidth="2.5" strokeOpacity="0.4" />
              <rect x="15" y="15" width="70" height="70" rx="10" transform="rotate(45 50 50)" fill="url(#juzHeroStarGradient)" stroke="#34d399" strokeWidth="2.5" strokeOpacity="0.4" />
              <circle cx="50" cy="50" r="28" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-base md:text-xl font-black font-mono tracking-tight select-none">
              {juzId}
            </span>
          </div>

          {/* Title & Calligraphy */}
          <div className="flex flex-col items-center gap-1.5 max-w-2xl">
            <div className="flex items-center justify-center gap-3 md:gap-4 flex-wrap">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                Juz {juzId}
              </h1>
              {juzMeta?.nameEnglish && (
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-500 dark:text-gray-400">
                  ({juzMeta.nameEnglish})
                </span>
              )}
            </div>

            {juzMeta?.nameArabic && (
              <span className="font-arabic text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-200 bg-clip-text text-transparent drop-shadow-xs select-none">
                {juzMeta.nameArabic}
              </span>
            )}
          </div>

          {/* Boundary Range Pill & Bookmark */}
          {juzMeta && (
            <div className="flex items-center gap-3 flex-wrap justify-center pt-2">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-slate-900/80 px-4 py-1.5 rounded-2xl border border-emerald-500/20 dark:border-slate-800 shadow-2xs backdrop-blur-md">
                Range: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{juzMeta.start}</span> → <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{juzMeta.end}</span>
              </span>
              
              <JuzBookmarkBtn
                juzId={juzId}
                juzName={juzMeta.nameEnglish}
                startSurah={juzMeta.start}
                endSurah={juzMeta.end}
              />
            </div>
          )}

        </div>
      </div>

      {/* ── 2. Verses Content List ── */}
      <JuzAyahList
        arabicAyah={arabicAyah}
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
        juzId={juzId}
      />

      {/* ── 3. Bottom Dual Previous & Next Navigation Cards ── */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {prevJuz ? (
          <Link
            href={`/juz/${prevJuz.number}`}
            className="group relative p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between border border-slate-200/80 dark:border-slate-800/80 overflow-hidden"
          >
            <div className="flex items-center gap-3.5 min-w-0 z-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-2xs">
                <ChevronLeft size={18} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Previous Juz
                </span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  Juz {prevJuz.number} ({prevJuz.nameEnglish})
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                  {prevJuz.start}
                </span>
              </div>
            </div>
            <span className="font-arabic text-xl sm:text-2xl text-emerald-600/60 dark:text-emerald-400/60 font-semibold shrink-0 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors select-none z-10 pl-2">
              {prevJuz.nameArabic}
            </span>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}

        {nextJuz ? (
          <Link
            href={`/juz/${nextJuz.number}`}
            className="group relative p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-between border border-slate-200/80 dark:border-slate-800/80 overflow-hidden text-right"
          >
            <span className="font-arabic text-xl sm:text-2xl text-emerald-600/60 dark:text-emerald-400/60 font-semibold shrink-0 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors select-none z-10 pr-2">
              {nextJuz.nameArabic}
            </span>

            <div className="flex items-center gap-3.5 min-w-0 z-10 justify-end flex-row-reverse w-full">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-2xs">
                <ChevronRight size={18} />
              </div>
              <div className="flex flex-col min-w-0 text-left sm:text-right">
                <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Next Juz
                </span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                  Juz {nextJuz.number} ({nextJuz.nameEnglish})
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
                  {nextJuz.start}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

    </div>
  );
}

export default Juz;
