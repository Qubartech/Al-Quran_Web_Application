"use client";

import React from "react";
import { formatTime12 } from "@/lib/api/aladhanCalendar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock } from "lucide-react";

const WEEKDAYS = [
  { en: "Sun", ar: "الأحد" },
  { en: "Mon", ar: "الإثنين" },
  { en: "Tue", ar: "الثلاثاء" },
  { en: "Wed", ar: "الأربعاء" },
  { en: "Thu", ar: "الخميس" },
  { en: "Fri", ar: "الجمعة" },
  { en: "Sat", ar: "السبت" }
];

export default function PrayerCalendarGrid({
  days,
  todayStr,
  onSelectDay,
  trackerStatusMap = {}
}) {
  if (!days || days.length === 0) return null;

  // Compute offset for 1st day of month
  const firstDay = days[0];
  const firstGreg = firstDay?.date?.gregorian || {};
  const weekdayName = firstGreg.weekday?.en || "Sunday";
  
  const weekdayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };
  const paddingSlots = weekdayMap[weekdayName] || 0;

  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-4">
      
      {/* 7 Day Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center">
        {WEEKDAYS.map((w, idx) => (
          <div
            key={w.en}
            className={`py-1.5 sm:py-3 rounded-xl sm:rounded-2xl border transition-all ${
              idx === 5
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-extrabold"
                : "bg-slate-900/80 border-slate-800 text-slate-300 font-bold"
            }`}
          >
            <div className="text-[10px] sm:text-xs uppercase tracking-wider">{w.en}</div>
            <div className="text-[9px] font-arabic opacity-70 hidden sm:block mt-0.5">{w.ar}</div>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2.5 md:gap-3.5">
        
        {/* Leading empty boxes */}
        {Array.from({ length: paddingSlots }).map((_, i) => (
          <div
            key={`pad-${i}`}
            className="min-h-[95px] sm:min-h-[140px] md:min-h-[160px] rounded-2xl sm:rounded-3xl bg-slate-900/10 border border-slate-800/40 opacity-30 pointer-events-none"
          />
        ))}

        {/* Calendar Day Boxes */}
        {days.map((d, idx) => {
          const greg = d.date?.gregorian || {};
          const hijri = d.date?.hijri || {};
          const t = d.cleanTimings || {};
          
          const rawParts = (greg.date || "").split("-");
          const formattedISO = partsToISO(rawParts);
          const isToday = formattedISO === todayStr;
          const isFriday = greg.weekday?.en === "Friday";
          const badges = d.badges || [];

          const trackerDay = trackerStatusMap[formattedISO] || null;
          const completedCount = trackerDay ? Object.values(trackerDay).filter(Boolean).length : 0;

          const fajrShort = formatTime12(t.Fajr);
          const maghribShort = formatTime12(t.Maghrib);

          return (
            <div
              key={greg.date || idx}
              onClick={() => onSelectDay(d)}
              className={`group relative min-h-[95px] sm:min-h-[140px] md:min-h-[165px] p-1.5 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-md ${
                isToday
                  ? "bg-gradient-to-br from-emerald-500/20 via-teal-950/40 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/40"
                  : isFriday
                  ? "bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850"
                  : "bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 shadow-md"
              }`}
            >
              {/* Card Header: Gregorian & Hijri Date */}
              <div className="flex items-start justify-between gap-0.5 pb-1 sm:pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm sm:text-lg md:text-2xl font-black ${
                      isToday ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {greg.day}
                  </span>

                  {isToday && (
                    <span className="hidden md:inline-flex px-1.5 py-0 rounded bg-emerald-500 text-white font-black text-[9px] uppercase">
                      Today
                    </span>
                  )}
                </div>

                {/* Hijri Date Display */}
                <div className="flex flex-col items-end text-right min-w-0">
                  <span className="text-[9px] sm:text-xs font-bold text-amber-400 truncate max-w-[34px] sm:max-w-none">
                    {hijri.day} {hijri.month?.en?.substring(0, 3)}
                  </span>
                  <span className="hidden sm:block text-[10px] text-amber-300/70 font-arabic font-bold">
                    {hijri.month?.ar}
                  </span>
                </div>
              </div>

              {/* Timing Schedule Chips */}
              <div className="my-1 sm:my-2 flex flex-col gap-0.5 sm:gap-1 text-[9px] sm:text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 hidden sm:inline-flex">Fajr</span>
                  <span className="text-slate-400 sm:hidden">F</span>
                  <span className="font-bold text-[9px] sm:text-[11px]">{fajrShort}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 hidden sm:inline-flex">Maghrib</span>
                  <span className="text-slate-400 sm:hidden">M</span>
                  <span className="font-bold text-rose-300 text-[9px] sm:text-[11px]">{maghribShort}</span>
                </div>
              </div>

              {/* Card Footer: Badges & Fasting info */}
              <div className="flex items-center justify-between gap-1 mt-auto pt-1 sm:pt-2 border-t border-slate-800/80 text-[8px] sm:text-[10px]">
                {badges.length > 0 ? (
                  <span className={`px-1 py-0.5 rounded font-bold truncate max-w-[42px] sm:max-w-[95px] text-[8px] sm:text-[9px] border ${badges[0].color}`}>
                    {badges[0].title}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[8px] sm:text-[10px] truncate max-w-[42px] sm:max-w-none">
                    {d.fasting?.formatted || ""}
                  </span>
                )}

                {completedCount > 0 && (
                  <span className="text-emerald-400 font-extrabold flex items-center gap-0.5 text-[9px] shrink-0">
                    <CheckCircle2 size={10} /> <span className="hidden sm:inline">{completedCount}/5</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function partsToISO(parts) {
  if (!parts || parts.length < 3) return "";
  const dd = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const yyyy = parts[2];
  return `${yyyy}-${mm}-${dd}`;
}
