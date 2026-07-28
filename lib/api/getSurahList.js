
export default async function getSurahList() {
  const res = await fetch("https://api.quran.com/api/v4/chapters?language=en");

  let json = await res.json();

  if (!json || !json.chapters) throw new Error("Failed to load chapters from API");

  const data = json.chapters.map((c) => ({
    number: c.id,
    englishName: c.name_simple,
    englishNameTranslation: c.translated_name.name,
    name: c.name_arabic,
    numberOfAyahs: c.verses_count,
    revelationType: c.revelation_place, // 'makkah' or 'madinah'
  }));

  return { data };
}
