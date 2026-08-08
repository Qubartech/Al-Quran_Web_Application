"use client";

import React from "react";
import { Calendar, ChevronRight, Sparkles, Star } from "lucide-react";

const MONTH_METADATA = [
  { month: 1, name: "January", days: 31, highlights: ["Islamic New Year Window"] },
  { month: 2, name: "February", days: 28, highlights: ["Shab-e-Barat / Mid-Sha'ban"] },
  { month: 3, name: "March", days: 31, highlights: ["Ramadan Fasting Month"] },
  { month: 4, name: "April", days: 30, highlights: ["Laylatul Qadr & Eid al-Fitr"] },
  { month: 5, name: "May", days: 31, highlights: ["Dhul Qa'dah Special Days"] },
  { month: 6, name: "June", days: 30, highlights: ["Day of Arafah & Eid al-Adha"] },
  { month: 7, name: "July", days: 31, highlights: ["Ashura (10th Muharram)"] },
  { month: 8, name: "August", days: 31, highlights: ["Mawlid al-Nabi Window"] },
  { month: 9, name: "September", days: 30, highlights: ["Rabi' al-Thani"] },
  { month: 10, name: "October", days: 31, highlights: ["Jumada al-Awwal"] },
  { month: 11, name: "November", days: 30, highlights: ["Jumada al-Thani"] },
  { month: 12, name: "December", days: 31, highlights: ["Rajab / Isra & Mi'raj"] }
];

export default function PrayerCalendarYearView({
  year,
  currentMonth,
  onSelectMonth
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            Annual Calendar Overview — {year}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select any month to open its complete daily prayer timetable & Hijri details.
          </p>
        </div>
      </div>

      {/* 12 Months Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {MONTH_METADATA.map((m) => {
          const isCurrent = m.month === currentMonth;

          return (
            <div
              key={m.month}
              onClick={() => onSelectMonth(m.month)}
              className={`group relative p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden ${
                isCurrent
                  ? "bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/15 ring-2 ring-emerald-500/30"
                  : "bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 hover:shadow-md dark:hover:bg-slate-850"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Month {m.month}
                  </span>

                  {isCurrent && (
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white font-extrabold text-[10px] uppercase">
                      Current
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-emerald-500 transition-colors">
                  {m.name} {year}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {m.days} Days Timetable
                </p>

                {m.highlights && m.highlights.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold flex items-center gap-1"
                      >
                        <Sparkles size={10} /> {h}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-extrabold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-all">
                <span>View Timetable</span>
                <ChevronRight size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
