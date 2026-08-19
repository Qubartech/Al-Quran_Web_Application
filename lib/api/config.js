// Centralized API configuration and base URLs

function getValidUrl(envVal, fallback) {
  if (
    !envVal ||
    envVal === "undefined" ||
    envVal === "null" ||
    typeof envVal !== "string" ||
    !envVal.trim()
  ) {
    return fallback.replace(/\/$/, "");
  }
  return envVal.trim().replace(/\/$/, "");
}

export const QURAN_API_BASE_URL = getValidUrl(
  process.env.NEXT_PUBLIC_QURAN_API_URL || process.env.NEXT_PUBLIC_API_URL,
  "https://api.quran.com/api/v4"
);

export const AUDIO_CDN_BASE_URL = getValidUrl(
  process.env.NEXT_PUBLIC_AUDIO_CDN_URL,
  "https://audio.qurancdn.com"
);

export const QURANICAUDIO_BASE_URL = getValidUrl(
  process.env.NEXT_PUBLIC_QURANICAUDIO_URL,
  "https://download.quranicaudio.com"
);

export const ALADHAN_API_BASE_URL = getValidUrl(
  process.env.NEXT_PUBLIC_ALADHAN_API_URL,
  "https://api.aladhan.com/v1"
);

export const OPENCAGE_API_BASE_URL = getValidUrl(
  process.env.NEXT_PUBLIC_OPENCAGE_API_URL,
  "https://api.opencagedata.com/geocode/v1/json"
);

export const OPENCAGE_API_KEY =
  process.env.NEXT_PUBLIC_OPENCAGE_API_KEY &&
  process.env.NEXT_PUBLIC_OPENCAGE_API_KEY !== "undefined"
    ? process.env.NEXT_PUBLIC_OPENCAGE_API_KEY
    : "5095627cb5034881bf175823c4fc82ab";

/**
 * Accurately constructs the WBW audio URL for a given word.
 * Fixes Quran.com API's shifted audio_url indices caused by waqf/stop marks in verses.
 */
export function getWordAudioUrl(word, surahNumber, ayahNumber, wordIndex) {
  if (!word) return "";

  // 1. Prioritize word.location if available ("surah:ayah:wordPos", e.g. "25:8:16")
  if (word.location) {
    const parts = String(word.location).split(":");
    if (parts.length >= 3) {
      const s = String(parts[0]).padStart(3, "0");
      const a = String(parts[1]).padStart(3, "0");
      const w = String(parts[2]).padStart(3, "0");
      return `${AUDIO_CDN_BASE_URL}/wbw/${s}_${a}_${w}.mp3`;
    }
  }

  // 2. Derive from surahNumber, ayahNumber and wordIndex
  const sNum =
    surahNumber ||
    (word.verse_key ? word.verse_key.split(":")[0] : null);
  const aNum =
    ayahNumber ||
    (word.verse_key ? word.verse_key.split(":")[1] : null);
  const wNum =
    (typeof wordIndex === "number" ? wordIndex + 1 : null) || word.position;

  if (sNum && aNum && wNum) {
    const s = String(sNum).padStart(3, "0");
    const a = String(aNum).padStart(3, "0");
    const w = String(wNum).padStart(3, "0");
    return `${AUDIO_CDN_BASE_URL}/wbw/${s}_${a}_${w}.mp3`;
  }

  // 3. Fallback to word.audio_url
  if (word.audio_url) {
    return word.audio_url.startsWith("http")
      ? word.audio_url
      : word.audio_url.startsWith("//")
      ? `https:${word.audio_url}`
      : `${AUDIO_CDN_BASE_URL}/${word.audio_url}`;
  }

  return "";
}

