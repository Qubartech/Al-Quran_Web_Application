import getSurahList from "@/lib/api/getSurahList";
import CityComponent from "@/lib/getLocation";
import Link from "next/link";

export default async function Home() {
  const surahList = await getSurahList();
  const { data } = surahList || {};

  return (
    <main className="my-10 text-gray-900 dark:text-gray-100 min-h-screen md:px-20 px-4 transition-colors">
      <CityComponent />
      <h1 className="pt-5 pb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
        Surah List
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pb-10">
        {data?.map((surah, idx) => {
          return (
            <Link href={`/surah/${surah.number}`} key={idx}>
              <div className="w-full p-5 rounded-md shadow-sm flex items-center border border-transparent dark:border-gray-700 hover:border hover:border-red-500 group bg-white dark:bg-gray-800 transition-colors">
                <div className="h-[50px] w-[60px] bg-gray-200 dark:bg-gray-700 group-hover:text-white group-hover:bg-red-500 rotate-[45deg] text-black dark:text-gray-100 flex items-center justify-center rounded-md transition-colors">
                  <div className="rotate-[-45deg] text-xl font-semibold">
                    {idx + 1}
                  </div>
                </div>
                <div className="pl-4 flex justify-between w-full font-semibold">
                  <div className="">
                    <div className="text-gray-800 dark:text-gray-100">
                      {surah.englishName}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold group-hover:text-red-500">
                      {surah.englishNameTranslation}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="text-gray-800 dark:text-gray-100">
                      {surah.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold group-hover:text-red-500">
                      {surah.numberOfAyahs} Ayahs
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
