"use client";

import React, { useState } from "react";
import {
  convertGregorianToHijri,
  convertHijriToGregorian,
  HIJRI_MONTHS
} from "@/lib/api/aladhanHijri";
import {
  Calendar as CalendarIcon,
  Sparkles,
  ArrowRightLeft,
  Search,
  CheckCircle2,
  Bookmark,
  Moon,
  Sun,
  Loader2,
  ChevronRight
} from "lucide-react";

export default function HijriCalendarView({
  days,
  year,
  month,
  todayStr,
  onAdjustmentChange,
  adjustment = 0
}) {
  // Converter tool states
  const [gDateInput, setGDateInput] = useState("");
  const [convertedHijri, setConvertedHijri] = useState(null);
  const [converting, setConverting] = useState(false);

  // Convert Gregorian date handler
  const handleConvertGregorian = async (e) => {
    e.preventDefault();
    if (!gDateInput) return;
    setConverting(true);
    
    // Expect input format YYYY-MM-DD or DD-MM-YYYY
    let parts = gDateInput.split("-");
    if (parts.length === 3) {
      let formatted = "";
      if (parts[0].length === 4) {
        // YYYY-MM-DD -> DD-MM-YYYY
        formatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
      } else {
        formatted = gDateInput;
      }
      
      const res = await convertGregorianToHijri(formatted, adjustment);
      if (res.success && res.data) {
        setConvertedHijri(res.data);
      } else {
        alert("Failed to convert date. Please ensure valid date format.");
      }
    }
    setConverting(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. Date Converter & Hijri Meta Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Converter Box */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ArrowRightLeft size={18} />
              </span>
              <h3 className="text-lg font-extrabold text-white">
                Gregorian &lt;–&gt; Hijri Date Converter
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Convert any Gregorian date to its exact Islamic lunar Hijri date according to Umm al-Qura calculation.
            </p>
          </div>

          <form onSubmit={handleConvertGregorian} className="flex items-center gap-3 flex-wrap">
            <input
              type="date"
              value={gDateInput}
              onChange={(e) => setGDateInput(e.target.value)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800 text-white text-xs font-bold border border-slate-700 focus:border-emerald-500 focus:outline-none"
            />
            
            <button
              type="submit"
              disabled={converting}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold transition-all shadow-md shadow-emerald-950/30 flex items-center gap-2 cursor-pointer"
            >
              {converting ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Convert Date
            </button>
          </form>

          {/* Converted Result */}
          {convertedHijri && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex flex-col gap-1 animate-in fade-in">
              <span className="font-extrabold text-sm text-white">
                Hijri Date: {convertedHijri.hijri?.day} {convertedHijri.hijri?.month?.en} ({convertedHijri.hijri?.month?.ar}) {convertedHijri.hijri?.year} AH
              </span>
              <span className="text-[11px] text-emerald-300/80">
                Day: {convertedHijri.hijri?.weekday?.en} ({convertedHijri.hijri?.weekday?.ar}) | Gregorian: {convertedHijri.gregorian?.readable}
              </span>
            </div>
          )}
        </div>

        {/* Hijri Adjustment Selector */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Moon size={18} />
              </span>
              <h3 className="text-lg font-extrabold text-white">
                Moonsighting Offset
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Adjust Hijri date by +/- days based on your local country&apos;s official moonsighting committee.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[-2, -1, 0, 1, 2].map((offset) => (
              <button
                key={offset}
                onClick={() => onAdjustmentChange(offset)}
                className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all border ${
                  adjustment === offset
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-950/40"
                    : "bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500/40"
                }`}
              >
                {offset > 0 ? `+${offset}` : offset} d
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2. Side-by-Side Monthly Table */}
      <div className="w-full flex flex-col gap-2">
        <div className="sm:hidden flex items-center justify-between text-[11px] font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="flex items-center gap-1 text-amber-400">
            <Moon size={13} /> Hijri & Gregorian Alignment
          </span>
          <span className="text-[10px] text-slate-400">↔ Scroll right for Arabic details</span>
        </div>

        <div className="w-full overflow-x-auto rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl backdrop-blur-md">
          <table className="w-full text-left text-xs border-collapse min-w-[640px] sm:min-w-full">
            <thead>
              <tr className="bg-slate-800/90 text-slate-200 border-b border-slate-800 font-extrabold uppercase tracking-wider sticky top-0 z-10">
                <th className="py-4 px-4 text-center sticky left-0 bg-slate-800 z-20 shadow-md">Day</th>
                <th className="py-4 px-4">Gregorian Date</th>
                <th className="py-4 px-4">Day of Week</th>
                <th className="py-4 px-4 text-amber-400">Hijri Date (English)</th>
                <th className="py-4 px-4 text-amber-400 text-right">Hijri Date (Arabic)</th>
                <th className="py-4 px-4 text-center">Islamic Events & Badges</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {days.map((d, idx) => {
                const greg = d.gregorian || {};
                const hijri = d.hijri || {};
                
                const rawParts = (greg.date || "").split("-"); // "26-08-2026"
                const formattedISO = partsToISO(rawParts);
                const isToday = formattedISO === todayStr;
                const isFriday = greg.weekday?.en === "Friday";
                const holidays = hijri.holidays || [];

                return (
                  <tr
                    key={greg.date || idx}
                    className={`transition-all hover:bg-emerald-500/10 ${
                      isToday
                        ? "bg-emerald-500/20 font-bold border-l-4 border-l-emerald-500"
                        : isFriday
                        ? "bg-slate-850"
                        : idx % 2 === 1
                        ? "bg-slate-950/40"
                        : "bg-slate-900"
                    }`}
                  >
                    {/* Day Number (Sticky on scroll) */}
                    <td className={`py-4 px-4 text-center font-black sticky left-0 z-10 shadow-sm ${
                      isToday ? "bg-emerald-950 text-emerald-300" : isFriday ? "bg-slate-850 text-white" : "bg-slate-900 text-slate-200"
                    }`}>
                      <div className="flex items-center justify-center gap-1.5">
                        {isToday && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />}
                        <span>{greg.day}</span>
                      </div>
                    </td>

                    {/* Gregorian Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-white">
                        {greg.month?.en} {greg.day}, {greg.year}
                      </span>
                    </td>

                    {/* Day of Week */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className={isFriday ? "text-emerald-400 font-extrabold" : "text-slate-300 font-semibold"}>
                          {greg.weekday?.en}
                        </span>
                        <span className="text-[11px] text-slate-500 font-arabic">
                          ({hijri.weekday?.ar})
                        </span>
                      </div>
                    </td>

                    {/* Hijri Date English */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-extrabold text-amber-300">
                        {hijri.day} {hijri.month?.en} {hijri.year} AH
                      </span>
                    </td>

                    {/* Hijri Date Arabic */}
                    <td className="py-4 px-4 whitespace-nowrap text-right font-arabic font-extrabold text-amber-200 text-sm">
                      {hijri.day} {hijri.month?.ar} {hijri.year} هـ
                    </td>

                    {/* Badges & Holidays */}
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        {isToday && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-extrabold text-[10px] uppercase">
                            Today
                          </span>
                        )}

                        {holidays.map((h, hIdx) => (
                          <span
                            key={hIdx}
                            className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold"
                          >
                            {h}
                          </span>
                        ))}

                        {isFriday && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                            Jumu&apos;ah
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 12 Islamic Months Reference Guide */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-400" size={20} />
          <h3 className="text-lg font-extrabold text-white">
            The 12 Hijri Months of the Islamic Calendar
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {HIJRI_MONTHS.map((hm) => (
            <div
              key={hm.id}
              className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400">
                  {hm.id}. {hm.nameEn}
                </span>
                <span className="font-arabic font-bold text-amber-300 text-sm">
                  {hm.nameAr}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {hm.desc}
              </p>
            </div>
          ))}
        </div>
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
