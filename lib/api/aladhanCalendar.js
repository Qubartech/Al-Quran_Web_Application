import { ALADHAN_API_BASE_URL } from "./config";

/**
 * Clean timing string by stripping offset suffix if present
 * e.g., "04:20 (+06)" -> "04:20"
 */
export function cleanTime(timeStr) {
  if (!timeStr) return "--:--";
  return timeStr.split(" ")[0];
}

/**
 * Format 24-hour time "18:21" to 12-hour "6:21 PM"
 */
export function formatTime12(timeStr) {
  const clean = cleanTime(timeStr);
  if (!clean || !clean.includes(":")) return clean;
  
  const [hStr, mStr] = clean.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  
  if (isNaN(h) || isNaN(m)) return clean;
  
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  
  const formattedMinutes = m < 10 ? `0${m}` : m;
  return `${h}:${formattedMinutes} ${ampm}`;
}

/**
 * Calculate fasting duration in hours and minutes from Fajr to Maghrib
 */
export function calculateFastingDuration(fajrTime, maghribTime) {
  const cFajr = cleanTime(fajrTime);
  const cMaghrib = cleanTime(maghribTime);
  
  if (!cFajr.includes(":") || !cMaghrib.includes(":")) return null;
  
  const [fH, fM] = cFajr.split(":").map(Number);
  const [mH, mM] = cMaghrib.split(":").map(Number);
  
  const fajrMinutes = fH * 60 + fM;
  const maghribMinutes = mH * 60 + mM;
  
  let diff = maghribMinutes - fajrMinutes;
  if (diff < 0) diff += 24 * 60; // crossover midnight
  
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  
  return { hours, mins, formatted: `${hours}h ${mins}m` };
}

/**
 * Determine special Islamic events or fasting days
 */
export function getIslamicDayBadge(dayData) {
  if (!dayData || !dayData.date || !dayData.date.hijri) return [];
  
  const hijri = dayData.date.hijri;
  const dayNum = parseInt(hijri.day, 10);
  const monthNum = parseInt(hijri.month?.number, 10);
  const holidays = hijri.holidays || [];
  
  const badges = [];

  // API provided holidays
  if (Array.isArray(holidays) && holidays.length > 0) {
    holidays.forEach(h => {
      badges.push({ title: h, type: "holiday", color: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" });
    });
  }

  // 1st of Ramadan
  if (monthNum === 9 && dayNum === 1) {
    badges.push({ title: "1st Ramadan", type: "ramadan", color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" });
  }

  // Ayyam al-Beed (White Days - 13, 14, 15 Hijri of any month except Tashreeq in Dhul Hijjah)
  if ([13, 14, 15].includes(dayNum) && !(monthNum === 12 && dayNum === 13)) {
    badges.push({ title: `White Day (${dayNum})`, type: "white_day", color: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30" });
  }

  // Friday / Jumu'ah
  const weekday = dayData.date.gregorian?.weekday?.en || "";
  if (weekday === "Friday" && badges.length === 0) {
    badges.push({ title: "Jumu'ah", type: "jumuah", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" });
  }

  return badges;
}

/**
 * Fetch calendar data for a specific year and month from AlAdhan API with client caching & fallback retries
 */
export async function fetchMonthlyCalendar({
  year,
  month,
  city = "Dhaka",
  country = "Bangladesh",
  latitude = null,
  longitude = null,
  method = 3,
  school = 0,
  midnightMode = 0,
  latitudeAdjustmentMethod = 3,
  tune = null,
  adjustment = 0
}) {
  const cacheKey = `quran_cal_v2_${city}_${country}_${latitude}_${longitude}_${year}_${month}_m${method}_s${school}_mid${midnightMode}`;

  // Check sessionStorage cache first to prevent rate limiting & instant loading!
  if (typeof window !== "undefined") {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.data) && parsed.data.length > 0) {
          return { success: true, data: parsed.data, meta: parsed.meta, fromCache: true };
        }
      }
    } catch (e) {
      console.warn("SessionCache read warning:", e);
    }
  }

  const queryParams = `method=${method}&school=${school}&midnightMode=${midnightMode}&latitudeAdjustmentMethod=${latitudeAdjustmentMethod}` +
    (adjustment ? `&adjustment=${adjustment}` : "") +
    (tune ? `&tune=${tune}` : "");

  const tryFetch = async (url) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const json = await res.json();
      if (json && json.code === 200 && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
      throw new Error(json?.data || "Invalid response format");
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  try {
    let rawData = null;

    // 1st Attempt: City-based endpoint (more resilient against rate limits and coords mismatches)
    const cityUrl = `${ALADHAN_API_BASE_URL}/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&${queryParams}`;
    
    try {
      rawData = await tryFetch(cityUrl);
    } catch (cityErr) {
      // 2nd Attempt: Coordinate-based endpoint if lat/lng available
      if (latitude !== null && longitude !== null) {
        const coordUrl = `${ALADHAN_API_BASE_URL}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&${queryParams}`;
        rawData = await tryFetch(coordUrl);
      } else {
        throw cityErr;
      }
    }

    // Enrich days with cleaned times & fasting metadata
    const days = rawData.map(day => {
      const timings = day.timings || {};
      const cleanTimings = {
        Fajr: cleanTime(timings.Fajr),
        Sunrise: cleanTime(timings.Sunrise),
        Dhuhr: cleanTime(timings.Dhuhr),
        Asr: cleanTime(timings.Asr),
        Sunset: cleanTime(timings.Sunset),
        Maghrib: cleanTime(timings.Maghrib),
        Isha: cleanTime(timings.Isha),
        Imsak: cleanTime(timings.Imsak),
        Midnight: cleanTime(timings.Midnight),
        Firstthird: cleanTime(timings.Firstthird),
        Lastthird: cleanTime(timings.Lastthird)
      };

      const fasting = calculateFastingDuration(cleanTimings.Fajr, cleanTimings.Maghrib);
      const badges = getIslamicDayBadge(day);

      return {
        ...day,
        cleanTimings,
        fasting,
        badges
      };
    });

    const result = {
      success: true,
      data: days,
      meta: days[0]?.meta || null
    };

    // Save to sessionStorage cache
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(result));
      } catch (e) {}
    }

    return result;

  } catch (err) {
    console.error("Error in fetchMonthlyCalendar:", err);
    return {
      success: false,
      error: err.message === "The user aborted a request."
        ? "Network request timed out. Please retry."
        : (err.message || "Could not retrieve calendar timing data from AlAdhan API.")
    };
  }
}
