import getSurahList from "@/lib/api/getSurahList";
import Link from "next/link";

export default async function Home() {
  const surahList = await getSurahList();
  const { data } = surahList || {};
  console.log(surahList);

  return (
    <main className="bg-gray-100 md:px-20 px-4">
      <h1 className="pt-5 pb-3 text-xl font-bold">Surah List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {data?.map((surah, idx) => {
          return (
            <Link href={`/surah/${surah.number}`} key={idx}>
              <div className="w-full bg-white p-5 rounded-md shadow-sm flex items-center border boerder-transparent hover:border hover:border-red-500 group">
                <div className="h-10 w-10 bg-gray-200 group-hover:text-white group-hover:bg-red-500 rotate-45 text-black flex items-center justify-center rounded-md">
                  <div className="rotate-[-45deg] font-semibold">{idx + 1}</div>
                </div>
                <div className="pl-4 flex justify-between w-full font-semibold">
                  <div className="">
                    <div>{surah.englishName}</div>
                    <div className="text-xs text-gray-500 font-semibold group-hover:text-red-500">
                      {surah.englishNameTranslation}
                    </div>
                  </div>
                  <div className="text-end">
                    <div>{surah.name}</div>
                    <div className="text-xs text-gray-500 font-semibold group-hover:text-red-500">
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
