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
