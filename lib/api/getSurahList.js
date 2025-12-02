import 'server-only';
import { qfContentFetch } from "@/lib/qf/content";

// Return structure remains { data: [...] } to keep Home page usage intact
export default async function getSurahList(language = "en") {
  const path = language
    ? `/content/api/v4/chapters?language=${encodeURIComponent(language)}`
    : "/content/api/v4/chapters";
  const res = await qfContentFetch(path);
  if (!res.ok) {
    throw new Error(`Failed to fetch chapters: ${res.status}`);
  }
  const json = await res.json();
  const chapters = json?.chapters || [];
  // Map to existing SurahList expected shape
  const data = chapters.map((c) => ({
    number: c.id,
    englishName: c.name_simple || c.name_complex || String(c.id),
    englishNameTranslation: c.translated_name?.name || "",
    name: c.name_arabic || c.name_complex || c.name_simple || String(c.id),
    numberOfAyahs: c.verses_count || 0,
  }));
  return { data };
}
