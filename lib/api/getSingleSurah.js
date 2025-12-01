// app/lib/getSingleSurah.js

// Load a surah with Quran.com official API including word-by-word details
export default async function getSingleSurah(id, langCode = "en") {
  const url = `https://api.quran.com/api/v4/verses/by_chapter/${id}?words=true&word_fields=text_uthmani,translation,transliteration&language=${langCode}`;

  const res = await fetch(url, {
    next: { revalidate: 60 }, // optional caching
  });

  if (!res.ok) {
    throw new Error("Failed to load surah");
  }

  const data = await res.json();

  return {
    arabicAyah: data.verses,       // contains words[]
    englishTransAyah: data.verses, // same array, contains translation per ayah
  };
}
