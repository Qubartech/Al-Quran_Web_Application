import getSurahList from "@/lib/api/getSurahList";
import HomeWelcome from "@/components/home/HomeWelcome";
import SidebarResources from "@/components/home/SidebarResources";
import SurahList from "@/components/surah/SurahList";

export const metadata = {
  title: "Al-Quran - Read, Listen & Contemplate",
  description: "Read, listen, and study the Holy Quran with English translations, audio recitations, prayer timings, and verse reflections.",
};

export default async function Home() {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors my-8 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Top Welcome Banner & Inspiration & Quick Access */}
      <HomeWelcome />

      {/* Main Content Layout (Surah List + Sidebar) */}
      <div className="flex flex-col lg:flex-row gap-8 mt-6">

        {/* Left Column: Full Surah Directory */}
        <div className="w-full min-w-0">
          <SurahList data={data} />
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
