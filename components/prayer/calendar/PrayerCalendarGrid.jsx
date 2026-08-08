"use client";

import React from "react";
import { formatTime12 } from "@/lib/api/aladhanCalendar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Moon, Sun, Sunrise, Sunset, Sparkles, Clock } from "lucide-react";

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
    <div className="w-full flex flex-col gap-4">
      
      {/* 7 Day Header */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {WEEKDAYS.map((w, idx) => (
          <div
            key={w.en}
            className={`py-3 rounded-2xl border transition-all ${
              idx === 5
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-extrabold"
                : "bg-slate-900/80 border-slate-800 text-slate-300 font-bold"
            }`}
          >
            <div className="text-xs uppercase tracking-wider">{w.en}</div>
            <div className="text-[10px] font-arabic opacity-70 mt-0.5">{w.ar}</div>
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2.5 md:gap-3.5">
        
        {/* Leading empty boxes */}
        {Array.from({ length: paddingSlots }).map((_, i) => (
          <div
            key={`pad-${i}`}
            className="min-h-[140px] md:min-h-[160px] rounded-3xl bg-slate-900/10 border border-slate-800/40 opacity-30 pointer-events-none"
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

          return (
            <div
              key={greg.date || idx}
              onClick={() => onSelectDay(d)}
              className={`group relative min-h-[140px] md:min-h-[165px] p-3 md:p-4 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-md ${
                isToday
                  ? "bg-gradient-to-br from-emerald-500/20 via-teal-950/40 to-slate-950 border-emerald-500 shadow-xl shadow-emerald-500/20 ring-2 ring-emerald-500/40 scale-[1.01]"
                  : isFriday
                  ? "bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850"
                  : "bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900 shadow-md"
              }`}
            >
              {/* Card Header: Gregorian & Hijri Date */}
              <div className="flex items-start justify-between gap-1 pb-2 border-b border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-lg md:text-2xl font-black ${
                      isToday ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {greg.day}
                  </span>

                  {isToday && (
                    <Badge variant="default" className="text-[9px] px-1.5 py-0 uppercase font-black tracking-wider">
                      Today
                    </Badge>
                  )}
                </div>

                {/* Hijri Date Display */}
                <div className="flex flex-col items-end text-right">
                  <span className="text-xs md:text-sm font-extrabold text-amber-400 whitespace-nowrap">
                    {hijri.day} {hijri.month?.en?.substring(0, 3)}
                  </span>
                  <span className="text-[10px] text-amber-300/70 font-arabic font-bold">
                    {hijri.month?.ar}
                  </span>
                </div>
              </div>

              {/* Timing Schedule Chips */}
              <div className="my-2 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                    <Sunrise size={11} className="text-indigo-400 shrink-0" /> Fajr
                  </span>
                  <span className="font-bold">{formatTime12(t.Fajr)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                    <Sunset size={11} className="text-rose-400 shrink-0" /> Maghrib
                  </span>
                  <span className="font-bold text-rose-300">{formatTime12(t.Maghrib)}</span>
                </div>
              </div>

              {/* Card Footer: Badges & Fasting info */}
              <div className="flex items-center justify-between gap-1 mt-auto pt-2 border-t border-slate-800/80 text-[10px]">
                {badges.length > 0 ? (
                  <span className={`px-2 py-0.5 rounded-lg font-bold truncate max-w-[95px] text-[9px] border ${badges[0].color}`}>
                    {badges[0].title}
                  </span>
                ) : (
                  <span className="text-slate-400 text-[10px] flex items-center gap-1">
                    <Clock size={10} className="text-teal-400 shrink-0" />
                    {d.fasting?.formatted || ""}
                  </span>
                )}

                {completedCount > 0 && (
                  <span className="text-emerald-400 font-extrabold flex items-center gap-0.5 text-[10px]">
                    <CheckCircle2 size={12} /> {completedCount}/5
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
