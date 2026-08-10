import JuzList from "@/components/juz/JuzList";
import { Layers } from "lucide-react";
import SurahPageWidgets from "@/components/surah/SurahPageWidgets";

export const metadata = {
  title: "Juz Directory - Al-Quran Application",
  description: "Browse the Holy Quran by Juz (Para) partitions, listen to recitations, and explore verses.",
};

export default function JuzPage() {
  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors py-8 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden p-6 md:p-8 rounded-3xl glass border border-emerald-500/15 dark:border-emerald-500/20 shadow-sm mb-6 animate-fadeIn transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/80 via-teal-50/60 to-cyan-50/70 dark:from-emerald-950/70 dark:via-slate-900/90 dark:to-teal-950/70 z-0"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Layers size={14} />
              Quranic Partitions
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Juz Directory
            </h1>
            <p className="text-xs md:text-sm text-slate-600 dark:text-gray-400 max-w-xl leading-relaxed font-medium">
              Explore the 30 partitions (Paras) of the Holy Quran. Read verses, view starting and ending surah references, and listen to recitations.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-emerald-100/80 dark:border-slate-800 backdrop-blur-md shrink-0 shadow-2xs">
            <div className="text-center px-2">
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">30</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase">Juz</span>
            </div>
            <div className="h-8 w-px bg-emerald-100 dark:bg-slate-800"></div>
            <div className="text-center px-2">
              <span className="text-lg font-black text-slate-800 dark:text-slate-100 block">6,236</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase">Verses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: JuzList (main) + Islamic Widgets (sidebar) */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT — Main Focus: Juz Directory */}
        <div className="w-full xl:flex-1 min-w-0">
          <JuzList />
        </div>

        {/* RIGHT — Islamic Content Sidebar */}
        <div className="w-full xl:w-[340px] shrink-0">
          <div className="xl:sticky xl:top-6 space-y-6">
            <SurahPageWidgets />
          </div>
        </div>
      </div>
    </main>
  );
}
