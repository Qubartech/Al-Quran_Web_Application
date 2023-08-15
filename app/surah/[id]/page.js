import getSingleSurah from "@/lib/api/getSingleSurah";

async function Surah({ params }) {
  const { id } = params || {};
  const singleSurah = await getSingleSurah(id);
  
  const { data } = singleSurah || {};
  const { ayahs, englishName } = data || {};

  return (
    <div className="px-5 py-4">
      <div className="text-2xl font-bold">{englishName}</div>
      {ayahs.map((ayah, idx) => {
        return (
          <div key={idx} className="py-2">
            <div className="text-end bg-white rounded-md p-3">{ayah.text}</div>
          </div>
        );
      })}
    </div>
  );
}

export default Surah;
