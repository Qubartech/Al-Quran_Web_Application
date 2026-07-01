import getTranslationEditions from "./getTranslationEditions";

export default async function getLanguages() {
  try {
    const eds = await getTranslationEditions();
    const langs = Array.from(new Set(eds.map((e) => e.language)));
    return langs.filter(Boolean);
  } catch (e) {
    return [];
  }
}
