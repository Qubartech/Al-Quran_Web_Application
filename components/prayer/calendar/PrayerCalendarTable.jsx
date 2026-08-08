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
    <div className="w-full flex flex-col gap-2">
      {/* Mobile Scroll Hint */}
      <div className="sm:hidden flex items-center justify-between text-[11px] font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
        <span className="flex items-center gap-1 text-emerald-400">
          <Clock size={13} /> Full Monthly Table
        </span>
        <span className="text-[10px] text-slate-400">↔ Scroll right for all timings</span>
      </div>

      <div className="w-full overflow-x-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-md">
        <table className="w-full text-left text-xs border-collapse min-w-[760px] md:min-w-full">

          {/* Table Header */}
          <thead>
            <tr className="bg-slate-800/90 text-slate-200 border-b border-slate-800 font-extrabold uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md">
              <th className="py-4 px-4 text-center sticky left-0 bg-slate-800 z-20 shadow-md">Day</th>
              <th className="py-4 px-4">Gregorian Date</th>
              <th className="py-4 px-4">Hijri Date</th>
              <th className="py-4 px-3 text-emerald-400">
                <div className="flex items-center gap-1.5">
                  <Sunrise size={14} /> Fajr
                </div>
              </th>
              <th className="py-4 px-3 text-amber-400">
                <div className="flex items-center gap-1.5">
                  <Sun size={14} /> Sunrise
                </div>
              </th>
              <th className="py-4 px-3 text-teal-400">
                <div className="flex items-center gap-1.5">
                  <Sun size={14} /> Dhuhr
                </div>
              </th>
              <th className="py-4 px-3 text-orange-400">
                <div className="flex items-center gap-1.5">
                  <CloudSun size={14} /> Asr
                </div>
              </th>
              <th className="py-4 px-3 text-rose-400">
                <div className="flex items-center gap-1.5">
                  <Sunset size={14} /> Maghrib
                </div>
              </th>
              <th className="py-4 px-3 text-indigo-400">
                <div className="flex items-center gap-1.5">
                  <Moon size={14} /> Isha
                </div>
              </th>
              <th className="py-4 px-3 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Clock size={14} /> Qiyam / Midnight
                </div>
              </th>
              <th className="py-4 px-3 text-center">Fasting</th>
              <th className="py-4 px-4 text-center">Badges & Details</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-800/60 font-medium">
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
                  className={`group cursor-pointer transition-all hover:bg-emerald-500/10 ${isToday
                      ? "bg-emerald-500/20 font-bold border-l-4 border-l-emerald-500"
                      : isFriday
                        ? "bg-slate-850"
                        : idx % 2 === 1
                          ? "bg-slate-950/40"
                          : "bg-slate-900"
                    }`}
                >
                  {/* Day Number (Sticky on Horizontal Scroll) */}
                  <td className={`py-3.5 px-4 text-center font-black sticky left-0 z-10 shadow-sm ${isToday ? "bg-emerald-950 text-emerald-300" : isFriday ? "bg-slate-850 text-white" : "bg-slate-900 text-slate-200"
                    }`}>
                    <div className="flex items-center justify-center gap-1">
                      {isToday && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                      <span>{greg.day}</span>
                    </div>
                  </td>

                  {/* Gregorian Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-white">
                        {greg.month?.en?.substring(0, 3)} {greg.day}, {greg.year}
                      </span>
                      <span className={`text-[11px] ${isFriday ? "text-emerald-400 font-bold" : "text-slate-400"}`}>
                        {dayOfWeek}
                      </span>
                    </div>
                  </td>

                  {/* Hijri Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-amber-300">
                        {hijri.day} {hijri.month?.en}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {hijri.year} AH ({hijri.weekday?.ar})
                      </span>
                    </div>
                  </td>

                  {/* Fajr */}
                  <td className="py-3.5 px-3 font-extrabold text-slate-100 whitespace-nowrap">
                    {formatTime12(t.Fajr)}
                  </td>

                  {/* Sunrise */}
                  <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap font-medium">
                    {formatTime12(t.Sunrise)}
                  </td>

                  {/* Dhuhr */}
                  <td className="py-3.5 px-3 font-extrabold text-slate-100 whitespace-nowrap">
                    {formatTime12(t.Dhuhr)}
                  </td>

                  {/* Asr */}
                  <td className="py-3.5 px-3 font-extrabold text-slate-100 whitespace-nowrap">
                    {formatTime12(t.Asr)}
                  </td>

                  {/* Maghrib */}
                  <td className="py-3.5 px-3 font-extrabold text-rose-300 whitespace-nowrap">
                    {formatTime12(t.Maghrib)}
                  </td>

                  {/* Isha */}
                  <td className="py-3.5 px-3 font-extrabold text-slate-100 whitespace-nowrap">
                    {formatTime12(t.Isha)}
                  </td>

                  {/* Qiyam / Last Third */}
                  <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap text-[11px]">
                    <div className="flex flex-col">
                      <span className="font-bold">{formatTime12(t.Lastthird)} (Qiyam)</span>
                      <span className="text-[10px] text-slate-400">Mid: {formatTime12(t.Midnight)}</span>
                    </div>
                  </td>

                  {/* Fasting Duration */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-xl bg-teal-500/15 text-teal-300 border border-teal-500/30 font-extrabold text-[11px]">
                      {fasting}
                    </span>
                  </td>

                  {/* Badges & Tracker */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {isToday && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-black text-[10px] uppercase">
                          Today
                        </span>
                      )}

                      {completedCount > 0 && (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 size={11} /> {completedCount}/5
                        </span>
                      )}

                      {badges.map((b, bIdx) => (
                        <span
                          key={bIdx}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold border ${b.color}`}
                        >
                          {b.title}
                        </span>
                      ))}

                      <ChevronRight size={15} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all ml-1" />
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
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
