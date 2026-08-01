import getTranslationEditions from "./getTranslationEditions";
import getSurahList from "./getSurahList";
import { QURAN_API_BASE_URL, AUDIO_CDN_BASE_URL } from "./config";

export default async function getSinglePage(
  id,
  langCode = "bn",
  editionIdentifier,
  reciterId = "7"
) {
  let identifier = editionIdentifier;

  if (identifier && isNaN(Number(identifier))) {
    identifier = undefined;
  }

  if (!identifier) {
    try {
      const editions = await getTranslationEditions();
      const match = editions.find(
        (e) => e.language === langCode && e.format === "text"
      );
      identifier =
        match?.identifier ||
        editions.find((e) => e.language === langCode)?.identifier;
    } catch {
      identifier = undefined;
    }
  }

  if (!identifier) {
    identifier = langCode === "bn" ? "161" : "131";
  }

  const safeReciterId = reciterId && !isNaN(Number(reciterId)) ? reciterId : "7";

  try {
    const [versesRes, audioRes, surahListRes] = await Promise.all([
      fetch(
        `${QURAN_API_BASE_URL}/verses/by_page/${id}?per_page=300&language=${langCode}&words=true&word_fields=text_qpc_hafs,text_indopak,text_uthmani,code_v1,code_v2&translations=${identifier}`
      ),
      fetch(
        `${QURAN_API_BASE_URL}/recitations/${safeReciterId}/by_page/${id}?per_page=300`
      ),
      getSurahList().catch(() => ({ data: [] }))
    ]);

    if (!versesRes.ok) {
      throw new Error(`Failed to fetch Page ${id} verses`);
    }

    const versesData = await versesRes.json();
    const verses = versesData.verses || [];
    const surahList = surahListRes?.data || [];

    let audioFiles = [];
    if (audioRes.ok) {
      const audioData = await audioRes.json();
      audioFiles = audioData.audio_files || [];
    }

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
          ? `${AUDIO_CDN_BASE_URL}/${audioMatch.url}`
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
    throw new Error(e.message || "Failed to load Page data");
  }
}
