import getSurahList from "@/lib/api/getSurahList";
import SurahList from "@/components/surah/SurahList";
import { BookOpen } from "lucide-react";
import VerseOfTheDay from "@/components/surah/VerseOfTheDay";
import SurahPageWidgets from "@/components/surah/SurahPageWidgets";
import NamazTimeWrapper from "@/components/NamazTimeWrapper";

export const metadata = {
  title: "Surah Directory - Al-Quran Application",
  description: "Browse, search, and listen to all 114 Surahs of the Holy Quran with English translations and recitations.",
};

export default async function SurahPage() {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors py-8 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl glass border border-primaryColor/10 dark:border-emerald-500/10 shadow-sm mb-6 animate-fadeIn">
        <div className="absolute inset-0 bg-gradient-to-r from-primaryColor/5 via-teal-500/5 to-cyan-500/5 dark:from-primaryColor/10 dark:via-teal-500/10 dark:to-cyan-500/10 z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primaryColor dark:text-primaryColor-light flex items-center gap-2">
              <BookOpen size={14} />
              Quranic Chapters
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Surah Directory
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-relaxed font-medium">
              Explore all 114 chapters of the Holy Quran. Read translations, search verses, filter by revelation location, and listen to audio recitations.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/40 dark:bg-slate-900/40 p-3 rounded-2xl border border-gray-200/40 dark:border-slate-800/60 backdrop-blur-md shrink-0">
            <div className="text-center px-2">
              <span className="text-lg font-black text-primaryColor dark:text-primaryColor-light block">114</span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Surahs</span>
            </div>
            <div className="h-8 w-px bg-gray-200 dark:bg-slate-800"></div>
            <div className="text-center px-2">
              <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">6,236</span>
              <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Verses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: SurahList (main) + Islamic Widgets (sidebar) */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT — Main Focus: Surah Directory */}
        <div className="w-full xl:flex-1 min-w-0">
          <SurahList data={data} />
        </div>

        {/* RIGHT — Islamic Content Sidebar */}
        <div className="w-full xl:w-[340px] shrink-0">
          <div className="xl:sticky xl:top-6 space-y-6">
            {/* Verse of the Day */}
            <VerseOfTheDay />

            {/* Prayer Times */}
            <div className="rounded-2xl overflow-hidden glass border border-white/20 dark:border-slate-800/80 shadow-sm">
              <NamazTimeWrapper />
            </div>

            {/* Reminders, Stats, Quick Access, Activity */}
            <SurahPageWidgets />
          </div>
        </div>
      </div>
    </main>
  );
}
