import getSurahList from "@/lib/api/getSurahList";
import Link from "next/link";

async function LeftBar() {
  const surahList = await getSurahList();
  const { data } = surahList || {};
  // console.log(data);

  return (
    <div className="px-5 bg-white rounded-md">
      <div className="text-2xl font-semibold py-2">Sura List</div>
      {/* <h1 className="text-4xl">hi</h1> */}

      {data?.map((surah, idx) => {
        return (
          <Link href={`/surah/${surah?.number}`} key={idx}>
            <div className="w-full bg-white p-5 rounded-md shadow-sm flex items-center border border-transparent hover:border hover:border-red-500 group max-h-full overflow-hidden">
              <div className="h-12 w-16 bg-gray-200 group-hover:text-white group-hover:bg-red-500 rotate-[496deg] text-black flex items-center justify-center rounded-md">
                <div className="rotate-[-496deg] font-semibold">{idx + 1}</div>
              </div>
              <div className="pl-4 flex justify-between w-full font-semibold">
                <div className="">
                  <div>{surah?.englishName}</div>
                  <div className="text-xs text-gray-500 font-semibold group-hover:text-red-500">
                    {surah?.englishNameTranslation}
                  </div>
                </div>
                {/* <div className="text-end">
                  <div>{surah?.name}</div>
                  <div className="text-xs text-gray-500 font-semibold group-hover:text-red-500">
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
