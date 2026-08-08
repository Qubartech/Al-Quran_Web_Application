"use client";

import React from "react";
import { formatTime12 } from "@/lib/api/aladhanCalendar";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  Calendar,
  Sunrise,
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  UtensilsCrossed,
  MapPin
} from "lucide-react";

export default function PrayerDayDetailModal({
  dayData,
  onClose,
  activeLocation
}) {
  const tracker = usePrayerTracker();

  if (!dayData) return null;

  const greg = dayData.date?.gregorian || {};
  const hijri = dayData.date?.hijri || {};
  const t = dayData.cleanTimings || {};

  // Formatted ISO date for tracker context
  const rawParts = (greg.date || "").split("-"); // "26-08-2026"
  const formattedISO = partsToISO(rawParts);

  const dailyStatus = tracker?.getDailyStatus ? tracker.getDailyStatus(formattedISO) : {};
  const badges = dayData.badges || [];
  const fasting = dayData.fasting;

  const corePrayers = [
    { name: "Fajr", icon: Sunrise, time: t.Fajr, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20", desc: "Dawn Prayer" },
    { name: "Dhuhr", icon: Sun, time: t.Dhuhr, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", desc: "Noon Prayer" },
    { name: "Asr", icon: CloudSun, time: t.Asr, color: "text-amber-400 bg-amber-500/10 border-amber-500/20", desc: "Afternoon Prayer" },
    { name: "Maghrib", icon: Sunset, time: t.Maghrib, color: "text-rose-400 bg-rose-500/10 border-rose-500/20", desc: "Sunset Prayer / Iftar" },
    { name: "Isha", icon: Moon, time: t.Isha, color: "text-blue-400 bg-blue-500/10 border-blue-500/20", desc: "Night Prayer" }
  ];

  const handleTogglePrayer = (prayerName) => {
    if (tracker?.togglePrayerStatus) {
      tracker.togglePrayerStatus(formattedISO, prayerName);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[20000] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-emerald-950/40 overflow-hidden flex flex-col max-h-[85vh] text-slate-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="shrink-0 p-5 md:p-6 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="emerald" className="font-extrabold text-[11px] px-2.5 py-0.5">
                {greg.weekday?.en}
              </Badge>
              <span className="text-xs font-bold text-amber-400">
                {hijri.day} {hijri.month?.en} ({hijri.month?.ar}) {hijri.year} AH
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white mt-1.5 tracking-tight">
              {greg.month?.en} {greg.day}, {greg.year}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1 flex flex-col gap-5 text-xs">
          
          {/* Islamic Holidays & Event Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {badges.map((b, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border ${b.color}`}
                >
                  {b.title}
                </span>
              ))}
            </div>
          )}

          {/* Fasting & Night Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
                <UtensilsCrossed size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Fasting Duration</span>
                <span className="font-extrabold text-sm text-white">
                  {fasting?.formatted || "--"}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Suhoor: {formatTime12(t.Fajr)} | Iftar: {formatTime12(t.Maghrib)}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Clock size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Tahajjud / Qiyam</span>
                <span className="font-extrabold text-sm text-white">
                  {formatTime12(t.Lastthird)}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Midnight: {formatTime12(t.Midnight)}
                </span>
              </div>
            </div>
          </div>

          {/* Core Daily Prayers List with Status Toggles */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-slate-400 font-extrabold uppercase tracking-wider text-[10px] px-1">
              <span>Prayer Name</span>
              <span>Time & Habit Tracker</span>
            </div>

            {corePrayers.map((p) => {
              const IconComp = p.icon;
              const isCompleted = dailyStatus?.[p.name.toLowerCase()] || false;

              return (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 md:p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${p.color}`}>
                      <IconComp size={16} />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs md:text-sm text-white">
                        {p.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">{p.desc}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-xs md:text-sm text-slate-200">
                      {formatTime12(p.time)}
                    </span>

                    <button
                      onClick={() => handleTogglePrayer(p.name)}
                      className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 font-bold text-xs ${
                        isCompleted
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-950/30"
                          : "bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700"
                      }`}
                      title={isCompleted ? "Completed" : "Mark as Completed"}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Sticky Footer */}
        <div className="shrink-0 p-4 border-t border-slate-800 bg-slate-900/90 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-400" />
            <span className="truncate max-w-[200px]">{activeLocation?.city}{activeLocation?.country ? `, ${activeLocation.country}` : ""}</span>
          </div>

          <Button size="sm" variant="secondary" onClick={onClose} className="text-xs rounded-xl px-4">
            Close
          </Button>
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
