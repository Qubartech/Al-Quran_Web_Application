import getSurahList from "@/lib/api/getSurahList";
import Link from "next/link";

async function LeftBar() {
  const surahList = await getSurahList();
  const { data } = surahList || {};
  // console.log(data);

  return (
    <div className="px-5 rounded-md text-gray-900 dark:text-gray-100 transition-colors glass">
      <div className="text-2xl font-semibold py-2 text-gray-800 dark:text-gray-100">
        Surah List
      </div>
      {/* <h1 className="text-4xl">hi</h1> */}

      {data?.map((surah, idx) => {
        return (
          <Link href={`/surah/${surah?.number}`} key={idx}>
            <div className="w-full p-5 rounded-md shadow-sm flex items-center border border-transparent hover:border hover:border-primaryColor group max-h-full overflow-hidden transition-colors my-1">
              <div className="h-12 w-16 bg-gray-200 dark:bg-gray-700 group-hover:text-white group-hover:bg-primaryColor rotate-[496deg] text-black dark:text-gray-100 flex items-center justify-center rounded-md transition-colors">
                <div className="rotate-[-496deg] font-semibold">{idx + 1}</div>
              </div>
              <div className="pl-4 flex justify-between w-full font-semibold">
                <div className="">
                  <div className="text-gray-800 dark:text-gray-100">
                    {surah?.englishName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold group-hover:text-primaryColor">
                    {surah?.englishNameTranslation}
                  </div>
                </div>
                {/* <div className="text-end">
                  <div>{surah?.name}</div>
                  <div className="text-xs text-gray-500 font-semibold group-hover:text-primaryColor">
                    {surah?.numberOfAyahs} Ayahs
                  </div>
                </div> */}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default LeftBar;
