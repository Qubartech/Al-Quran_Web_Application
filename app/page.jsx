import getSurahList from "@/lib/api/getSurahList";
import HomeWelcome from "@/components/home/HomeWelcome";
import MainContentTabs from "@/components/home/MainContentTabs";
import SidebarResources from "@/components/home/SidebarResources";

export default async function Home() {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors my-10 px-3 md:px-0">
      <HomeWelcome />
      <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-0">
        <div className="w-full">
          <MainContentTabs surahData={data} />
        </div>

        <div className="w-full lg:w-[400px] lg:sticky lg:top-20 pt-5 lg:pt-10 shrink-0">
          <SidebarResources />
        </div>
      </div>
    </main>
  );
}
