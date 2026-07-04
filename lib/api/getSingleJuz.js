import { error } from "next/navigation";
import getTranslationEditions from "./getTranslationEditions";
import getSurahList from "./getSurahList";

export default async function getSingleJuz(
  id,
  langCode = "bn",
  editionIdentifier
) {
  let identifier = editionIdentifier;

  // Auto-migrate legacy non-numeric identifiers (e.g. "bn.bengali" -> undefined)
  if (identifier && isNaN(Number(identifier))) {
    identifier = undefined;
  }

  if (!identifier) {
    try {
      const editions = await getTranslationEditions();
      const match = editions.find(
        (e) => e.language === langCode && e.format === "text"
      );
      // Use only the identifier that matches the requested language.
      identifier =
        match?.identifier ||
        editions.find((e) => e.language === langCode)?.identifier;
    } catch {
      identifier = undefined;
    }
  }

  if (!identifier) error();

  try {
    const [versesRes, audioRes, surahListRes] = await Promise.all([
      fetch(
        `https://api.quran.com/api/v4/verses/by_juz/${id}?per_page=600&language=${langCode}&words=true&word_fields=text_qpc_hafs,text_indopak,text_uthmani,code_v1,code_v2&translations=${identifier}`
      ),
      fetch(
        `https://api.quran.com/api/v4/recitations/7/by_juz/${id}?per_page=600`
      ),
      getSurahList()
    ]);

    if (!versesRes.ok || !audioRes.ok) {
      error();
    }

    const versesData = await versesRes.json();
    const audioData = await audioRes.json();
    const surahList = surahListRes?.data || [];

    const verses = versesData.verses || [];
    const audioFiles = audioData.audio_files || [];

    // Sort verses by surah and then by verse number just in case the API returns them unordered
    const sortedVerses = [...verses].sort((a, b) => {
      const [sA, vA] = a.verse_key.split(":").map(Number);
      const [sB, vB] = b.verse_key.split(":").map(Number);
      if (sA !== sB) return sA - sB;
      return vA - vB;
    });

    const arabicAyah = sortedVerses.map((v) => {
      const surahNum = parseInt(v.verse_key.split(":")[0], 10);
      const surahInfo = surahList.find((s) => s.number === surahNum);
      return {
        text: v.text_qpc_hafs || v.text_uthmani || v.text_simple || "",
        number: v.verse_number,
        numberInSurah: v.verse_number,
        verseKey: v.verse_key,
        surahNumber: surahNum,
        surahName: surahInfo?.englishName || `Surah ${surahNum}`,
        surahNameArabic: surahInfo?.name || "",
        words: v.words || [],
        juz: v.juz_number,
        page: v.page_number
      };
    });

    const englishTransAyah = sortedVerses.map((v) => ({
      text: v.translations?.[0]?.text || "",
      number: v.verse_number,
      verseKey: v.verse_key,
    }));

    const ayahAudio = sortedVerses.map((v) => {
      const audioMatch = audioFiles.find((a) => a.verse_key === v.verse_key);
      return {
        number: v.verse_number,
        verseKey: v.verse_key,
        audio: audioMatch
          ? `https://audio.qurancdn.com/${audioMatch.url}`
          : "",
      };
    });

    return {
      data: [
        { ayahs: arabicAyah, number: id },
        { ayahs: englishTransAyah },
        { ayahs: ayahAudio },
      ],
    };
  } catch (e) {
    error();
  }
}
