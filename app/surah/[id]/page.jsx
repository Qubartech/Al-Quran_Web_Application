import SurahAyahList from "@/components/surah/SurahAyahList";
import getSingleSurah from "@/lib/api/getSingleSurah";
import { cookies } from "next/headers";

async function Surah({ params }) {
  const { id } = params || {};

  // Read language and translation identifier from cookies
  const cookieStore = cookies();
  const langCode = cookieStore.get("__language__")?.value || "bn";
  const editionIdentifier =
    cookieStore.get("__translation_identifier__")?.value || undefined;

  // Prefer user-selected reciter id from cookie, fallback to 7 (Mishary al-Afasy)
  const reciterId = cookieStore.get("__reciter_id__")?.value || "7";

  // Fetch surah text + word-by-word data (from your getSingleSurah)
  // getSingleSurah should call Quran.com and return { arabicAyah: verses[], ... }
  const singleSurah = await getSingleSurah(id, langCode, editionIdentifier);

  // Expecting getSingleSurah to return { arabicAyah: [...], englishTransAyah: [...] }
  // Quran.com returns verse objects that may contain:
  // - verse.text_uthmani
  // - verse.words[] (word-by-word)
  // - verse.translation?.text (sometimes)
  // - verse.translations (array) OR verse.translation
  const arabicAyah = singleSurah?.arabicAyah || [];

  // NORMALIZE full-translation for each ayah into the shape SurahAyahList expects.
  // We'll look for the common fields in Quran.com responses and fall back sensibly.
  const englishTransAyah = arabicAyah.map((v) => {
    // prefer verse.translation.text, then v.translations[0].text, then v.translation_text, then empty
    const text =
      v?.translation?.text ||
      (Array.isArray(v?.translations) && v.translations[0]?.text) ||
      v?.translation_text ||
      v?.translation_text_simple ||
      "";

    // Keep both "text" and "translation" keys so SurahAyahList usage works either way
    return {
      text,
      translation: { text },
      // include original verse object in case SurahAyahList wants word-by-word under the same index
      __raw__: v,
    };
  });

  // -------------------------
  // Fetch per-ayah audio files
  // -------------------------
  const audioBaseFallback = "https://verses.quran.foundation/"; // used when url is relative
  let ayahAudio = [];
  try {
    const audioRes = await fetch(
      `https://api.quran.com/api/v4/recitations/${reciterId}/by_chapter/${id}?per_page=50`,
      { next: { revalidate: 60 } }
    );

    if (audioRes.ok) {
      const audioJson = await audioRes.json();
      const audioFiles = audioJson?.audio_files || [];

      ayahAudio = audioFiles.map((f) => {
        let url = f?.url || "";
        if (url && !/^https?:\/\//i.test(url)) {
          if (url.startsWith("/")) url = url.slice(1);
          url = `${audioBaseFallback}${url}`;
        }
        return {
          audio: url,
          verse_key: f?.verse_key || null,
        };
      });
    } else {
      ayahAudio = [];
    }
  } catch (err) {
    ayahAudio = [];
  }

  // Align ayahAudio order with arabicAyah
  if (arabicAyah.length && ayahAudio.length) {
    const audioMap = ayahAudio.reduce((acc, a) => {
      if (a?.verse_key) acc[a.verse_key] = a;
      return acc;
    }, {});
    ayahAudio = arabicAyah.map((v) => {
      const verseKey = v?.verse_key || `${id}:${v?.verse_number || ""}`;
      const found = audioMap[verseKey];
      return {
        audio: found?.audio || "",
        verse_key: verseKey,
      };
    });
  } else {
    // Ensure parity length for SurahAyahList indexing
    ayahAudio =
      ayahAudio.length === arabicAyah.length
        ? ayahAudio
        : arabicAyah.map((v) => ({
            audio: "",
            verse_key: v?.verse_key || `${id}:${v?.verse_number || ""}`,
          }));
  }

  // Determine a friendly surah name (best-effort)
  let englishName = "Surah";
  // try singleSurah.meta.chapter.name_simple or first verse metadata
  if (singleSurah?.meta?.chapter?.name_simple) {
    englishName = singleSurah.meta.chapter.name_simple;
  } else if (arabicAyah[0]?.chapter_name) {
    englishName = arabicAyah[0].chapter_name;
  } else if (arabicAyah[0]?.verse_key) {
    englishName = `Surah ${arabicAyah[0].verse_key.split(":")[0]}`;
  }

  return (
    <div className="px-5 min-h-screen bg-white dark:bg-gray-800 dark:text-gray-100">
      <div
        className="py-7 border-b border-gray-200 dark:border-gray-700 
          bg-gray-100 dark:bg-gray-800 mt-4 rounded-lg bg-[url('/bg.jpg')] 
          bg-repeat relative overflow-hidden"
      >
        <div
          className="backdrop-blur-[2px] bg-white/30 dark:bg-black/40 
            absolute top-0 left-0 w-full h-full"
        ></div>

        <div className="relative z-10 flex flex-col gap-4 justify-center items-center text-gray-900 dark:text-gray-100">
          <div className="text-4xl font-semibold tracking-wide">
            {englishName}
          </div>
        </div>
      </div>

      <SurahAyahList
        arabicAyah={arabicAyah}
        // pass the normalized translations (text + translation.text)
        englishTransAyah={englishTransAyah}
        ayahAudio={ayahAudio}
        pageId={id}
        surahName={englishName}
      />
    </div>
  );
}

export default Surah;
