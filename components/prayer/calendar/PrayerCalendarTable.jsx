"use client";

import React from "react";
import { formatTime12 } from "@/lib/api/aladhanCalendar";
import {
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function PrayerCalendarTable({
  days,
  todayStr,
  onSelectDay,
  trackerStatusMap = {}
}) {
  if (!days || days.length === 0) {
    return (
      <div className="w-full p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
        No prayer timings available for this month.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <table className="w-full text-left text-xs border-collapse">
        
        {/* Table Header */}
        <thead>
          <tr className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider">
            <th className="py-4 px-4 text-center">Day</th>
            <th className="py-4 px-4">Gregorian Date</th>
            <th className="py-4 px-4">Hijri Date</th>
            <th className="py-4 px-3 text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center gap-1.5">
                <Sunrise size={14} /> Fajr
              </div>
            </th>
            <th className="py-4 px-3 text-amber-600 dark:text-amber-400">
              <div className="flex items-center gap-1.5">
                <Sun size={14} /> Sunrise
              </div>
            </th>
            <th className="py-4 px-3 text-teal-600 dark:text-teal-400">
              <div className="flex items-center gap-1.5">
                <Sun size={14} /> Dhuhr
              </div>
            </th>
            <th className="py-4 px-3 text-orange-600 dark:text-orange-400">
              <div className="flex items-center gap-1.5">
                <CloudSun size={14} /> Asr
              </div>
            </th>
            <th className="py-4 px-3 text-rose-600 dark:text-rose-400">
              <div className="flex items-center gap-1.5">
                <Sunset size={14} /> Maghrib
              </div>
            </th>
            <th className="py-4 px-3 text-indigo-600 dark:text-indigo-400">
              <div className="flex items-center gap-1.5">
                <Moon size={14} /> Isha
              </div>
            </th>
            <th className="py-4 px-3 text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <Clock size={14} /> Qiyam / Midnight
              </div>
            </th>
            <th className="py-4 px-3 text-center">Fasting</th>
            <th className="py-4 px-4 text-center">Badges & Details</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
          {days.map((d, idx) => {
            const greg = d.date?.gregorian || {};
            const hijri = d.date?.hijri || {};
            const t = d.cleanTimings || {};
            
            // Format YYYY-MM-DD for checking today
            const rawParts = (greg.date || "").split("-"); // "26-08-2026" => DD-MM-YYYY
            const formattedISO = partsToISO(rawParts);
            const isToday = formattedISO === todayStr;

            const dayOfWeek = greg.weekday?.en || "";
            const isFriday = dayOfWeek === "Friday";
            const badges = d.badges || [];
            const fasting = d.fasting?.formatted || "--";

            const trackerDay = trackerStatusMap[formattedISO] || null;
            const completedCount = trackerDay ? Object.values(trackerDay).filter(Boolean).length : 0;

            return (
              <tr
                key={greg.date || idx}
                onClick={() => onSelectDay(d)}
                className={`group cursor-pointer transition-all hover:bg-emerald-500/5 dark:hover:bg-emerald-500/10 ${
                  isToday
                    ? "bg-emerald-500/10 dark:bg-emerald-500/20 font-bold border-l-4 border-l-emerald-500"
                    : isFriday
                    ? "bg-slate-50/50 dark:bg-slate-800/30"
                    : idx % 2 === 1
                    ? "bg-slate-50/30 dark:bg-slate-950/20"
                    : "bg-white dark:bg-slate-900"
                }`}
              >
                {/* Day Number */}
                <td className="py-3.5 px-4 text-center font-extrabold text-slate-700 dark:text-slate-200">
                  <div className="flex items-center justify-center gap-1">
                    {isToday && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                    <span>{greg.day}</span>
                  </div>
                </td>

                {/* Gregorian Date */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-extrabold text-slate-900 dark:text-slate-100">
                      {greg.month?.en?.substring(0, 3)} {greg.day}, {greg.year}
                    </span>
                    <span className={`text-[11px] ${isFriday ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-500 dark:text-slate-400"}`}>
                      {dayOfWeek}
                    </span>
                  </div>
                </td>

                {/* Hijri Date */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-bold text-amber-600 dark:text-amber-400">
                      {hijri.day} {hijri.month?.en}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {hijri.year} AH ({hijri.weekday?.ar})
                    </span>
                  </div>
                </td>

                {/* Fajr */}
                <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {formatTime12(t.Fajr)}
                </td>

                {/* Sunrise */}
                <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {formatTime12(t.Sunrise)}
                </td>

                {/* Dhuhr */}
                <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {formatTime12(t.Dhuhr)}
                </td>

                {/* Asr */}
                <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {formatTime12(t.Asr)}
                </td>

                {/* Maghrib */}
                <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {formatTime12(t.Maghrib)}
                </td>

                {/* Isha */}
                <td className="py-3.5 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                  {formatTime12(t.Isha)}
                </td>

                {/* Qiyam / Last Third */}
                <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                  <div className="flex flex-col">
                    <span>{formatTime12(t.Lastthird)} (Qiyam)</span>
                    <span className="text-[10px] text-slate-400">Mid: {formatTime12(t.Midnight)}</span>
                  </div>
                </td>

                {/* Fasting Duration */}
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span className="px-2.5 py-1 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 font-bold text-[11px]">
                    {fasting}
                  </span>
                </td>

                {/* Badges & Tracker */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 flex-wrap">
                    {isToday && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-extrabold text-[10px] uppercase">
                        Today
                      </span>
                    )}

                    {completedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 size={11} /> {completedCount}/5
                      </span>
                    )}

                    {badges.map((b, bIdx) => (
                      <span
                        key={bIdx}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${b.color}`}
                      >
                        {b.title}
                      </span>
                    ))}

                    <ChevronRight size={15} className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all ml-1" />
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}

// Convert DD-MM-YYYY to YYYY-MM-DD
function partsToISO(parts) {
  if (!parts || parts.length < 3) return "";
  const dd = parts[0].padStart(2, "0");
  const mm = parts[1].padStart(2, "0");
  const yyyy = parts[2];
  return `${yyyy}-${mm}-${dd}`;
}
