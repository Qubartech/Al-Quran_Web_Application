import getSurahList from "@/lib/api/getSurahList";
import HomeWelcome from "@/components/home/HomeWelcome";
import SidebarResources from "@/components/home/SidebarResources";
import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles, Layers, Play, Compass, Star } from "lucide-react";

export const metadata = {
  title: "Al-Quran - Read, Listen & Contemplate",
  description: "Read, listen, and study the Holy Quran with English translations, audio recitations, prayer timings, and verse reflections.",
};

const FEATURED_SURAHS = [
  { id: 1, name: "Al-Fatihah", english: "The Opening", ayahs: 7, type: "Meccan", icon: "✨" },
  { id: 36, name: "Ya-Sin", english: "Ya-Sin (Heart of Quran)", ayahs: 83, type: "Meccan", icon: "💎" },
  { id: 67, name: "Al-Mulk", english: "The Sovereignty", ayahs: 30, type: "Meccan", icon: "👑" },
  { id: 18, name: "Al-Kahf", english: "The Cave", icon: "⛰️", ayahs: 110, type: "Meccan" },
  { id: 55, name: "Ar-Rahman", english: "The Beneficent", ayahs: 78, type: "Medinan", icon: "🌸" },
  { id: 56, name: "Al-Waqi'ah", english: "The Inevitable", ayahs: 96, type: "Meccan", icon: "💫" },
];

export default async function Home() {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors my-8 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Top Welcome Banner & Inspiration & Quick Access */}
      <HomeWelcome />

      {/* Main Content Layout (Featured Surahs + Sidebar) */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        
        {/* Left Column: Featured Surahs & Quick Sections */}
        <div className="w-full space-y-8">
          
          {/* Section 1: Featured & Popular Surahs */}
          <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-sm flex flex-col gap-5">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
                  <Star size={14} className="fill-primaryColor/20" />
                  Popular Surahs
                </span>
                <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
                  Frequently Read Chapters
                </h2>
              </div>

              <Link
                href="/surah"
                className="flex items-center gap-2 text-xs font-bold text-primaryColor dark:text-primaryColor-light hover:underline bg-primaryColor/10 dark:bg-emerald-500/10 px-4 py-2 rounded-xl transition-all"
              >
                <span>View All 114 Surahs</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Featured Surahs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {FEATURED_SURAHS.map((s) => (
                <Link href={`/surah/${s.id}`} key={s.id}>
                  <div className="p-4 rounded-xl glass glass-hover border border-transparent dark:border-slate-800/60 hover:border-primaryColor/40 transition-all flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-base select-none">{s.icon}</span>
                      <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-primaryColor transition-colors truncate">
                          {s.name}
                        </h3>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate mt-0.5">
                          {s.english}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-2">
                      <span className="text-[9px] font-extrabold text-primaryColor dark:text-primaryColor-light block">
                        #{s.id}
                      </span>
                      <span className="text-[9px] font-bold text-gray-400 block mt-0.5">
                        {s.ayahs} Ayahs
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

          {/* Section 2: Explore Quran Hub Card */}
          <div className="relative overflow-hidden p-6 md:p-8 rounded-2xl glass border border-primaryColor/10 dark:border-emerald-500/10 shadow-sm bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col gap-2 max-w-lg">
              <span className="text-xs font-extrabold uppercase tracking-wider text-primaryColor dark:text-primaryColor-light flex items-center gap-1.5">
                <Compass size={14} />
                Full Directory
              </span>
              <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                Explore the Entire Surah Directory
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                Search through all 114 Surahs, filter by Meccan and Medinan revelations, sort by verse length, and listen to complete recitations.
              </p>
            </div>

            <Link
              href="/surah"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 hover:scale-105 transition-all whitespace-nowrap flex items-center gap-2"
            >
              <BookOpen size={16} />
              Browse Surah Directory
            </Link>
          </div>

        </div>

        {/* Right Column: Sticky Sidebar (Quran Insights & User Activity) */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="lg:sticky lg:top-24">
            <SidebarResources />
          </div>
        </div>

      </div>
    </main>
  );
}
