export async function getQFChapters(language = "en") {
  const url = `/api/qf/chapters${language ? `?language=${encodeURIComponent(language)}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch chapters: ${res.status}`);
  const data = await res.json();
  if (!data?.ok) throw new Error(data?.error || "Chapters request failed");
  return data.chapters || [];
}

export function mapChaptersToSurahList(chapters = []) {
  return chapters.map((c) => ({
    number: c.id,
    englishName: c.name_simple || c.name_complex || String(c.id),
    englishNameTranslation: c.translated_name?.name || "",
    name: c.name_arabic || c.name_complex || c.name_simple || String(c.id),
    numberOfAyahs: c.verses_count || 0,
  }));
}
