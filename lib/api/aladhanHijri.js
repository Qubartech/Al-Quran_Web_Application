import { ALADHAN_API_BASE_URL } from "./config";

/**
 * Fetch Gregorian to Hijri calendar for a given month and year
 */
export async function fetchGregorianToHijriCalendar({
  year,
  month,
  adjustment = 0
}) {
  const cacheKey = `quran_g2h_v1_${year}_${month}_adj${adjustment}`;

  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.data)) {
          return { success: true, data: parsed.data, fromCache: true };
        }
      }
    } catch (e) {}
  }

  try {
    let url = `${ALADHAN_API_BASE_URL}/gToHCalendar/${month}/${year}`;
    if (adjustment !== 0) {
      url += `?adjustment=${adjustment}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    if (json && json.code === 200 && Array.isArray(json.data)) {
      const result = { success: true, data: json.data };
      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
        } catch (e) {}
      }
      return result;
    }

    throw new Error(json?.data || "Failed to fetch Hijri calendar data.");
  } catch (err) {
    console.error("Error fetching gToHCalendar:", err);
    return {
      success: false,
      error: err.message || "Failed to retrieve Hijri calendar."
    };
  }
}

/**
 * Convert a specific Gregorian date (DD-MM-YYYY) to Hijri
 */
export async function convertGregorianToHijri(dateDDMMYYYY, adjustment = 0) {
  try {
    let url = `${ALADHAN_API_BASE_URL}/gToH/${dateDDMMYYYY}`;
    if (adjustment !== 0) {
      url += `?adjustment=${adjustment}`;
    }
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (json && json.code === 200 && json.data) {
      return { success: true, data: json.data };
    }
    throw new Error("Failed to convert date.");
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Convert a specific Hijri date (DD-MM-YYYY) to Gregorian
 */
export async function convertHijriToGregorian(hijriDDMMYYYY, adjustment = 0) {
  try {
    let url = `${ALADHAN_API_BASE_URL}/hToG/${hijriDDMMYYYY}`;
    if (adjustment !== 0) {
      url += `?adjustment=${adjustment}`;
    }
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    if (json && json.code === 200 && json.data) {
      return { success: true, data: json.data };
    }
    throw new Error("Failed to convert date.");
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export const HIJRI_MONTHS = [
  { id: 1, nameEn: "Muharram", nameAr: "مُحَرَّم", desc: "1st month of Islamic calendar. Month of Ashura." },
  { id: 2, nameEn: "Safar", nameAr: "صَفَر", desc: "2nd month of Islamic calendar." },
  { id: 3, nameEn: "Rabi' al-Awwal", nameAr: "رَبِيع الأَوَّل", desc: "3rd month. Birth of Prophet Muhammad (ﷺ)." },
  { id: 4, nameEn: "Rabi' al-Thani", nameAr: "رَبِيع الثَّانِي", desc: "4th month of Islamic calendar." },
  { id: 5, nameEn: "Jumada al-Awwal", nameAr: "جُمَادَى الأُولَى", desc: "5th month of Islamic calendar." },
  { id: 6, nameEn: "Jumada al-Thani", nameAr: "جُمَادَى الثَّانِيَة", desc: "6th month of Islamic calendar." },
  { id: 7, nameEn: "Rajab", nameAr: "رَجَب", desc: "7th month. One of the 4 Sacred Months. Isra & Mi'raj." },
  { id: 8, nameEn: "Sha'ban", nameAr: "شَعْبَان", desc: "8th month. Month preceding Ramadan. Shab-e-Barat." },
  { id: 9, nameEn: "Ramadan", nameAr: "رَمَضَان", desc: "9th month. Holy month of fasting & Quran revelation." },
  { id: 10, nameEn: "Shawwal", nameAr: "شَوَّال", desc: "10th month. Starts with Eid al-Fitr & 6 Sunnah fasts." },
  { id: 11, nameEn: "Dhul Qa'dah", nameAr: "ذُو القَعْدَة", desc: "11th month. Sacred month preceding Hajj." },
  { id: 12, nameEn: "Dhul Hijjah", nameAr: "ذُو الحِجَّة", desc: "12th month. Month of Hajj, Arafah & Eid al-Adha." }
];
