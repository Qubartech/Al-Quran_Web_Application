import { QURAN_API_BASE_URL } from "./config";

export const FALLBACK_RECITERS = [
  { id: "7", name: "Mishari Rashid al-`Afasy", reciter_name: "Mishari Rashid al-`Afasy", style: null },
  { id: "2", name: "AbdulBaset AbdulSamad (Murattal)", reciter_name: "AbdulBaset AbdulSamad", style: "Murattal" },
  { id: "1", name: "AbdulBaset AbdulSamad (Mujawwad)", reciter_name: "AbdulBaset AbdulSamad", style: "Mujawwad" },
  { id: "3", name: "Abdur-Rahman as-Sudais", reciter_name: "Abdur-Rahman as-Sudais", style: null },
  { id: "4", name: "Abu Bakr al-Shatri", reciter_name: "Abu Bakr al-Shatri", style: null },
  { id: "5", name: "Hani ar-Rifai", reciter_name: "Hani ar-Rifai", style: null },
  { id: "6", name: "Mahmoud Khalil Al-Husary", reciter_name: "Mahmoud Khalil Al-Husary", style: null },
  { id: "12", name: "Mahmoud Khalil Al-Husary (Muallim)", reciter_name: "Mahmoud Khalil Al-Husary", style: "Muallim" },
  { id: "9", name: "Mohamed Siddiq al-Minshawi (Murattal)", reciter_name: "Mohamed Siddiq al-Minshawi", style: "Murattal" },
  { id: "8", name: "Mohamed Siddiq al-Minshawi (Mujawwad)", reciter_name: "Mohamed Siddiq al-Minshawi", style: "Mujawwad" },
  { id: "10", name: "Sa`ud ash-Shuraym", reciter_name: "Sa`ud ash-Shuraym", style: null },
  { id: "11", name: "Mohamed al-Tablawi", reciter_name: "Mohamed al-Tablawi", style: null },
];

let cachedReciters = null;

export default async function getReciters() {
  if (cachedReciters && cachedReciters.length > 0) {
    return cachedReciters;
  }

  try {
    const res = await fetch(`${QURAN_API_BASE_URL}/resources/recitations?language=en`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) {
      return FALLBACK_RECITERS;
    }

    const data = await res.json();
    if (Array.isArray(data?.recitations) && data.recitations.length > 0) {
      const formatted = data.recitations.map((r) => {
        const rawName = r.translated_name?.name || r.reciter_name || `Reciter ${r.id}`;
        const style = r.style || null;
        const displayName = style ? `${rawName} (${style})` : rawName;
        return {
          id: String(r.id),
          name: displayName,
          reciter_name: r.reciter_name || rawName,
          style: style,
          translated_name: r.translated_name || { name: rawName },
        };
      });

      // Sort with Mishari Rashid (7) first by default, then alphabetically
      formatted.sort((a, b) => {
        if (a.id === "7") return -1;
        if (b.id === "7") return 1;
        return a.name.localeCompare(b.name);
      });

      cachedReciters = formatted;
      return formatted;
    }

    return FALLBACK_RECITERS;
  } catch (err) {
    console.error("Failed to fetch reciters list from API:", err);
    return FALLBACK_RECITERS;
  }
}
