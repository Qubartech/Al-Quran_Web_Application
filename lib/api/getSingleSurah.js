import getTranslationEditions from "./getTranslationEditions";
import { QURAN_API_BASE_URL, AUDIO_CDN_BASE_URL } from "./config";

// langCode: language code like 'bn', 'en', 'ur'.
// editionIdentifier: specific identifier (e.g., '161'); if provided, used directly.
export default async function getSingleSurah(
  id,
  langCode = "bn",
  editionIdentifier,
  reciterId = "7"
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

  // Fallback to default identifier if resolution fails (161 for bn, 131 for en/other)
  if (!identifier) {
    identifier = langCode === "bn" ? "161" : "131";
  }

  const safeReciterId = reciterId && !isNaN(Number(reciterId)) ? reciterId : "7";

  try {
    const [versesRes, audioRes, chapterRes, segmentsRes] = await Promise.all([
      fetch(
        `${QURAN_API_BASE_URL}/verses/by_chapter/${id}?per_page=300&language=${langCode}&words=true&word_fields=text_qpc_hafs,text_indopak,text_uthmani,code_v1,code_v2&translations=${identifier}`
      ),
      fetch(
        `${QURAN_API_BASE_URL}/recitations/${safeReciterId}/by_chapter/${id}`
      ),
      fetch(
        `${QURAN_API_BASE_URL}/chapters/${id}?language=en`
      ),
      fetch(
        `${QURAN_API_BASE_URL}/chapter_recitations/${safeReciterId}/${id}?segments=true`
      ),
    ]);

    // Handle primary endpoints
    if (!versesRes.ok || !chapterRes.ok) {
      throw new Error(`Failed to fetch Surah ${id} verses or chapter metadata`);
    }

    const versesData = await versesRes.json();
    const chapterData = await chapterRes.json();
    const verses = versesData.verses || [];
    const chapter = chapterData.chapter || {};

    // Handle audio files safely (fallback if specific reciter fails)
    let audioFiles = [];
    if (audioRes.ok) {
      const audioData = await audioRes.json();
      audioFiles = audioData.audio_files || [];
    } else {
      try {
        const fallbackAudioRes = await fetch(
          `${QURAN_API_BASE_URL}/recitations/7/by_chapter/${id}`
        );
        if (fallbackAudioRes.ok) {
          const fallbackData = await fallbackAudioRes.json();
          audioFiles = fallbackData.audio_files || [];
        }
      } catch {
        audioFiles = [];
      }
    }

    const segmentsData = segmentsRes.ok ? await segmentsRes.json() : {};
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
          ? `${AUDIO_CDN_BASE_URL}/${audioMatch.url}`
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
        {
          ayahs: arabicAyah,
          englishName,
          arabicName,
          number: surahNumber,
          versesCount,
          revelationPlace,
          translatedName,
          audioUrl: segmentsData.audio_file?.audio_url || "",
        },
        { ayahs: englishTransAyah },
        { ayahs: ayahAudio },
      ],
    };
  } catch (e) {
    throw new Error(e.message || "Failed to load Surah data");
  }
}
