import { error } from "next/navigation";
import getTranslationEditions from "./getTranslationEditions";

// langCode: language code like 'bn', 'en', 'ur'.
// editionIdentifier: specific identifier (e.g., 'bn.bengali'); if provided, used directly.
export default async function getSingleSurah(
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
    const [versesRes, audioRes, chapterRes, segmentsRes] = await Promise.all([
      fetch(
        `https://api.quran.com/api/v4/verses/by_chapter/${id}?per_page=300&language=${langCode}&words=true&word_fields=text_qpc_hafs,text_indopak,text_uthmani,code_v1,code_v2&translations=${identifier}`
      ),
      fetch(
        `https://api.quran.com/api/v4/recitations/7/by_chapter/${id}`
      ),
      fetch(
        `https://api.quran.com/api/v4/chapters/${id}?language=en`
      ),
      fetch(
        `https://api.quran.com/api/v4/chapter_recitations/7/${id}?segments=true`
      ),
    ]);

    if (!versesRes.ok || !audioRes.ok || !chapterRes.ok) {
      error();
    }

    const versesData = await versesRes.json();
    const audioData = await audioRes.json();
    const chapterData = await chapterRes.json();
    const segmentsData = segmentsRes.ok ? await segmentsRes.json() : {};

    const verses = versesData.verses || [];
    const audioFiles = audioData.audio_files || [];
    const chapter = chapterData.chapter || {};
    const segmentList = segmentsData.audio_file?.timestamps || [];

    const englishName = chapter.name_simple || "";

    const arabicAyah = verses.map((v) => {
      const segMatch = segmentList.find((s) => s.verse_key === v.verse_key);
      return {
        text: v.text_qpc_hafs || v.text_uthmani || v.text_simple || "",
        number: v.verse_number,
        numberInSurah: v.verse_number,
        words: v.words || [],
        juz: v.juz_number,
        page: v.page_number,
        timestamp_from: segMatch?.timestamp_from ?? 0,
        timestamp_to: segMatch?.timestamp_to ?? 0,
        segments: segMatch?.segments || [],
      };
    });

    const englishTransAyah = verses.map((v) => ({
      text: v.translations?.[0]?.text || "",
      number: v.verse_number,
    }));

    const ayahAudio = verses.map((v) => {
      const audioMatch = audioFiles.find((a) => a.verse_key === v.verse_key);
      return {
        number: v.verse_number,
        audio: audioMatch
          ? `https://audio.qurancdn.com/${audioMatch.url}`
          : "",
      };
    });

    const arabicName = chapter.name_arabic || "";
    const surahNumber = chapter.id || Number(id);
    const versesCount = chapter.verses_count || arabicAyah.length;
    const revelationPlace = chapter.revelation_place || "";
    const translatedName = chapter.translated_name?.name || "";

    return {
      data: [
        { ayahs: arabicAyah, englishName, arabicName, number: surahNumber, versesCount, revelationPlace, translatedName },
        { ayahs: englishTransAyah },
        { ayahs: ayahAudio },
      ],
    };
  } catch (e) {
    error();
  }
}
