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

  if (!identifier) {
    try {
      const editions = await getTranslationEditions();
      const match = editions.find(
        (e) => e.language === langCode && e.format === "text"
      );
      // Use only the identifier that matches the requested language. No hardcoded fallbacks.
      identifier = match?.identifier || editions.find((e) => e.language === langCode)?.identifier;
    } catch {
      identifier = undefined;
    }
  }

  if (!identifier) error();

  const res = await fetch(
    process.env.API_URL +
      `/surah/${id}/editions/quran-uthmani,${identifier},ar.alafasy`
  );

  const surah = await res.json();
  if (!surah) error();
  return surah;
}
