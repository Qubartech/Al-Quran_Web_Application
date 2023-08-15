import getSurahList from "@/lib/api/getSurahList";

export default async function Home() {
  const surahList = await getSurahList();
  const { data } = surahList || {};
  console.log(surahList);

  return (
    <main className="bg-gray-100 px-20">
      <h1 className="pt-5 pb-3 text-xl font-bold">Surah List</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data?.map((surah, idx) => {
          return (
            <div key={idx} className="w-full bg-white p-4 rounded-md shadow-sm">
              <div>{surah.englishName}</div>
              <div>{surah.name}</div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
