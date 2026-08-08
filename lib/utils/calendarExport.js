import { formatTime12 } from "@/lib/api/aladhanCalendar";

/**
 * Export monthly calendar data as a downloadable CSV file
 */
export function exportCalendarToCSV(days, locationName, monthName, year) {
  if (!days || days.length === 0) return;

  const headers = [
    "Gregorian Date",
    "Day of Week",
    "Hijri Date",
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Sunset",
    "Maghrib",
    "Isha",
    "Midnight",
    "Last Third (Qiyam)",
    "Fasting Duration"
  ];

  const rows = days.map(d => {
    const greg = d.date?.gregorian || {};
    const hijri = d.date?.hijri || {};
    const t = d.cleanTimings || {};
    const fasting = d.fasting?.formatted || "";

    const gregDateStr = greg.date || "";
    const dayName = greg.weekday?.en || "";
    const hijriStr = `${hijri.day} ${hijri.month?.en || ""} ${hijri.year}`;

    return [
      `"${gregDateStr}"`,
      `"${dayName}"`,
      `"${hijriStr}"`,
      `"${formatTime12(t.Fajr)}"`,
      `"${formatTime12(t.Sunrise)}"`,
      `"${formatTime12(t.Dhuhr)}"`,
      `"${formatTime12(t.Asr)}"`,
      `"${formatTime12(t.Sunset)}"`,
      `"${formatTime12(t.Maghrib)}"`,
      `"${formatTime12(t.Isha)}"`,
      `"${formatTime12(t.Midnight)}"`,
      `"${formatTime12(t.Lastthird)}"`,
      `"${fasting}"`
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  const cleanLoc = (locationName || "Calendar").replace(/[^a-zA-Z0-9]/g, "_");
  link.setAttribute("download", `Prayer_Calendar_${cleanLoc}_${monthName}_${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export monthly calendar data as an iCal (.ics) file for Google / Apple / Outlook Calendars
 */
export function exportCalendarToICS(days, locationName, monthName, year) {
  if (!days || days.length === 0) return;

  const sanitizeStr = (str) => (str || "").replace(/[,;\\]/g, "\\$&");
  
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AlQuranApp//PrayerTimesCalendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Prayer Times - ${sanitizeStr(locationName)} (${monthName} ${year})`,
    "X-WR-TIMEZONE:UTC"
  ];

  const prayersList = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  days.forEach(d => {
    const greg = d.date?.gregorian || {};
    const t = d.cleanTimings || {};
    
    // Format DD-MM-YYYY to YYYYMMDD
    const rawDate = greg.date || ""; // "26-08-2026"
    if (!rawDate.includes("-")) return;
    const parts = rawDate.split("-");
    if (parts.length < 3) return;
    const yyyy = parts[2];
    const mm = parts[1].padStart(2, "0");
    const dd = parts[0].padStart(2, "0");
    const dateStamp = `${yyyy}${mm}${dd}`;

    prayersList.forEach(prayerKey => {
      const timeStr = t[prayerKey]; // e.g. "04:20"
      if (!timeStr || !timeStr.includes(":")) return;

      const [hh, min] = timeStr.split(":");
      const dtStart = `${dateStamp}T${hh.padStart(2, "0")}${min.padStart(2, "0")}00`;
      
      // Calculate End Time (15 mins after start)
      let endH = parseInt(hh, 10);
      let endM = parseInt(min, 10) + 15;
      if (endM >= 60) {
        endH = (endH + 1) % 24;
        endM = endM % 60;
      }
      const dtEnd = `${dateStamp}T${String(endH).padStart(2, "0")}${String(endM).padStart(2, "0")}00`;

      icsContent.push("BEGIN:VEVENT");
      icsContent.push(`UID:prayer-${prayerKey}-${dateStamp}@alquranapp`);
      icsContent.push(`DTSTAMP:${dateStamp}T000000Z`);
      icsContent.push(`DTSTART:${dtStart}`);
      icsContent.push(`DTEND:${dtEnd}`);
      icsContent.push(`SUMMARY:${prayerKey} Prayer (${sanitizeStr(locationName)})`);
      icsContent.push(`DESCRIPTION:${prayerKey} Salah time for ${d.date?.readable || ""} in ${sanitizeStr(locationName)}. Hijri: ${d.date?.hijri?.day} ${d.date?.hijri?.month?.en} ${d.date?.hijri?.year}`);
      icsContent.push(`LOCATION:${sanitizeStr(locationName)}`);
      icsContent.push("END:VEVENT");
    });
  });

  icsContent.push("END:VCALENDAR");

  const blob = new Blob([icsContent.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const cleanLoc = (locationName || "Calendar").replace(/[^a-zA-Z0-9]/g, "_");
  link.download = `Prayer_Calendar_${cleanLoc}_${monthName}_${year}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Open print view for the prayer calendar
 */
export function triggerCalendarPrint() {
  window.print();
}
