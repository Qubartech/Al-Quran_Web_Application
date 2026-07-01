export default async function getTranslationEditions() {
  try {
    const res = await fetch(
      "https://api.quran.com/api/v4/resources/translations",
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    if (!json?.translations) return [];

    const languageNameToIso = {
      bengali: "bn",
      english: "en",
      urdu: "ur",
      hindi: "hi",
      spanish: "es",
      french: "fr",
      german: "de",
      indonesian: "id",
      turkish: "tr",
      tamil: "ta",
      russian: "ru",
      persian: "fa",
      chinese: "zh",
      malay: "ms",
      portuguese: "pt",
      japanese: "ja",
      korean: "ko",
      swahili: "sw",
      albanian: "sq",
      bosnian: "bs",
      nepali: "ne",
      somali: "so",
      uzbek: "uz",
      tajik: "tg",
      swedish: "sv",
      italian: "it",
      gujarati: "gu",
      marathi: "mr",
      telugu: "te",
      malayalam: "ml",
      kannada: "kn",
      thai: "th",
      sinhala: "si",
      "sinhala, sinhalese": "si",
      pashto: "ps",
      dari: "prs",
      romanian: "ro",
      kinyarwanda: "rw",
      sindhi: "sd",
      azeri: "az",
      azerbaijani: "az",
      bambara: "bm",
      divehi: "dv",
      yoruba: "yo",
    };

    return json.translations.map((t) => {
      const langCode =
        languageNameToIso[t.language_name.toLowerCase()] || t.language_name;
      return {
        identifier: String(t.id),
        language: langCode,
        name: t.name,
        englishName: t.translated_name?.name || t.name,
        format: "text",
      };
    });
  } catch (e) {
    return [];
  }
}
