import NamazTimeWrapper from "@/components/NamazTimeWrapper";
import getSurahList from "@/lib/api/getSurahList";
import HomeWelcome from "@/components/home/HomeWelcome";
import MainContentTabs from "@/components/home/MainContentTabs";

export default async function Home() {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <main className="text-gray-900 dark:text-gray-100 min-h-screen transition-colors my-10 px-3 md:px-0">
      <HomeWelcome />
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-0">
        <div className="w-full">
          <MainContentTabs surahData={data} />
        </div>

        <div className="w-full md:w-[430px] md:sticky md:top-6 pt-5 md:pt-0">
          <NamazTimeWrapper />
        </div>
      </div>
    </main>
  );
}
