"use client";

import React, { useState } from "react";
import { usePrayerTracker } from "@/context/PrayerTrackerContext";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  Download,
  Printer,
  FileSpreadsheet,
  CalendarDays,
  LayoutGrid,
  List,
  Sparkles,
  Navigation,
  Globe,
  Moon,
  Check,
} from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const QUICK_CITIES = [
  { city: "Makkah", country: "Saudi Arabia", latitude: 21.4225, longitude: 39.8262 },
  { city: "Madinah", country: "Saudi Arabia", latitude: 24.4672, longitude: 39.6111 },
  { city: "Dhaka", country: "Bangladesh", latitude: 23.8103, longitude: 90.4125 },
  { city: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278 },
  { city: "New York", country: "United States", latitude: 40.7128, longitude: -74.0060 },
  { city: "Cairo", country: "Egypt", latitude: 30.0444, longitude: 31.2357 },
  { city: "Istanbul", country: "Turkey", latitude: 41.0082, longitude: 28.9784 },
  { city: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708 },
  { city: "Kuala Lumpur", country: "Malaysia", latitude: 3.1390, longitude: 101.6869 },
  { city: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832 },
  { city: "Jakarta", country: "Indonesia", latitude: -6.2088, longitude: 106.8456 },
  { city: "Karachi", country: "Pakistan", latitude: 24.8607, longitude: 67.0011 }
];

export default function PrayerCalendarHeader({
  year,
  month,
  setYear,
  setMonth,
  activeLocation,
  onSearchLocation,
  onResetGps,
  hijriSummary,
  viewMode,
  setViewMode,
  onOpenSettings,
  onExportCSV,
  onExportICS,
  onPrint,
  loading
}) {
  const tracker = usePrayerTracker();
  const [searchInput, setSearchInput] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleToday = () => {
    const now = new Date();
    setYear(now.getFullYear());
    setMonth(now.getMonth() + 1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    onSearchLocation(searchInput.trim());
    setSearchInput("");
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full print:hidden">
      
      {/* ── Top Luxury Hero Banner ── */}
      <div className="relative overflow-hidden rounded-3xl glass border border-emerald-500/20 dark:border-emerald-500/30 p-6 sm:p-8 md:p-10 text-slate-900 dark:text-white shadow-xl transition-all duration-300 animate-fadeIn">
        
        {/* Ambient Gradients & Glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 via-teal-50/70 to-emerald-100/40 dark:from-slate-950/95 dark:via-emerald-950/40 dark:to-slate-900/90 z-0 pointer-events-none" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 dark:bg-emerald-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-teal-500/15 dark:bg-teal-400/10 rounded-full blur-3xl z-0 pointer-events-none" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-amber-500/15 dark:bg-amber-400/10 rounded-full blur-3xl z-0 pointer-events-none" />

        {/* Islamic Arabesque Geometric Pattern Backdrop */}
        <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="calHeaderPattern" width="70" height="70" patternUnits="userSpaceOnUse">
                <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-emerald-600 dark:text-emerald-400">
                  <polygon points="35,0 45.5,10.5 59.5,10.5 59.5,24.5 70,35 59.5,45.5 59.5,59.5 45.5,59.5 35,70 24.5,59.5 10.5,59.5 10.5,45.5 0,35 10.5,24.5 10.5,10.5 24.5,10.5" />
                  <circle cx="35" cy="35" r="14" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#calHeaderPattern)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold tracking-wider uppercase shadow-2xs">
                <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>AlAdhan Astronomical Engine</span>
              </span>

              {tracker?.user ? (
                tracker?.isSyncedWithAccount ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-500/30 backdrop-blur-md shadow-2xs">
                    Account Synced
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px] font-black border border-amber-500/30 backdrop-blur-md animate-pulse">
                    Syncing...
                  </span>
                )
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-300/40 dark:border-slate-700 backdrop-blur-md">
                  Local Storage (Guest)
                </span>
              )}
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-xs">
              Prayer Times Calendar
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-medium">
              Complete monthly and yearly timetables with accurate Fajr, Sunrise, Dhuhr, Asr, Maghrib, Isha, and fasting durations.
            </p>
          </div>

          {/* Quick Location & Settings Controls */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Location Badge */}
            <div className="flex-1 sm:flex-initial flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 min-w-0 shadow-sm">
              <MapPin size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-extrabold tracking-wider leading-tight">Current Location</span>
                <span className="font-black text-slate-900 dark:text-white truncate max-w-[130px] sm:max-w-[190px]">
                  {activeLocation ? `${activeLocation.city}${activeLocation.country ? `, ${activeLocation.country}` : ""}` : "Loading..."}
                </span>
              </div>
            </div>

            {/* GPS Reset Button */}
            <button
              type="button"
              onClick={onResetGps}
              title="Use GPS Geolocation"
              className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-slate-800 border border-emerald-500/20 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <Navigation size={18} />
            </button>

            {/* Calculation Settings Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-xs sm:text-sm font-black cursor-pointer shrink-0 shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              <SlidersHorizontal size={17} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* ── Quick Cities Bar (Fully Interactive & Fixed) ── */}
        <div className="mt-6 pt-4 border-t border-emerald-200/50 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1.5 shrink-0 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
            <Globe size={13} /> Quick City:
          </span>
          {QUICK_CITIES.map((loc) => {
            const isSelected =
              activeLocation?.city?.toLowerCase() === loc.city.toLowerCase();

            return (
              <button
                key={loc.city}
                type="button"
                onClick={() => onSearchLocation(loc)}
                className={`px-3.5 py-1.5 rounded-xl text-xs transition-all border whitespace-nowrap shrink-0 cursor-pointer font-bold shadow-2xs flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 font-black"
                    : "bg-white/80 dark:bg-slate-900/80 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-slate-700 dark:text-slate-200 border-slate-200/80 dark:border-slate-800"
                }`}
              >
                {isSelected && <Check size={12} className="stroke-[3]" />}
                {loc.city}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Control Strip Panel - Month / Year Nav & View Modes ── */}
      <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 shadow-sm backdrop-blur-xl">
        
        {/* Row 1: Month/Year Controls + Hijri Summary Pill */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
          
          {/* Navigation Controls Group */}
          <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0 cursor-pointer shadow-2xs"
              title="Previous Month"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Month Dropdown */}
            <div className="relative flex items-center">
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-extrabold text-xs border border-slate-200 dark:border-slate-700 hover:border-emerald-500 focus:outline-none transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selector */}
            <div className="relative flex items-center">
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-extrabold text-xs border border-slate-200 dark:border-slate-700 hover:border-emerald-500 focus:outline-none transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                {Array.from({ length: 11 }, (_, i) => 2024 + i).map((y) => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shrink-0 cursor-pointer shadow-2xs"
              title="Next Month"
            >
              <ChevronRight size={16} />
            </button>

            <button
              onClick={handleToday}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs hover:bg-emerald-500/20 transition-all border border-emerald-500/20 shrink-0 cursor-pointer shadow-2xs"
            >
              Today
            </button>
          </div>

          {/* Hijri Month Summary Banner */}
          {hijriSummary && (
            <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-black flex items-center justify-center gap-1.5 shrink-0 shadow-2xs">
              <CalendarIcon size={14} className="text-amber-500 shrink-0" />
              <span className="truncate">{hijriSummary}</span>
            </div>
          )}
        </div>

        {/* Row 2: Search Bar + View Switcher + Export Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          
          {/* Custom Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search any custom city/country..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <button
              type="submit"
              disabled={!searchInput.trim()}
              className="absolute right-1.5 top-1.5 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Go
            </button>
          </form>

          {/* View Modes & Export Trigger */}
          <div className="flex items-center gap-2 justify-between sm:justify-end flex-wrap">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
              {[
                { id: "grid", label: "Grid", icon: LayoutGrid },
                { id: "table", label: "Table", icon: List },
                { id: "year", label: "Year", icon: CalendarDays },
                { id: "hijri", label: "Hijri", icon: Moon }
              ].map((vm) => {
                const Icon = vm.icon;
                const isActive = viewMode === vm.id;
                return (
                  <button
                    key={vm.id}
                    onClick={() => setViewMode(vm.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon size={14} />
                    <span className="hidden sm:inline">{vm.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Export & Print Controls */}
            <div className="relative flex items-center gap-1.5">
              <button
                type="button"
                onClick={onPrint}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Print Timetable"
              >
                <Printer size={15} />
                <span className="hidden md:inline">Print</span>
              </button>

              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Download size={15} />
                <span>Export</span>
              </button>

              {/* Export Dropdown Menu */}
              {showExportMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 p-1.5 flex flex-col gap-1 animate-in fade-in"
                  onClick={() => setShowExportMenu(false)}
                >
                  <button
                    type="button"
                    onClick={onExportCSV}
                    className="w-full px-3 py-2 text-xs font-bold text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <FileSpreadsheet size={15} className="text-emerald-500" />
                    <span>Export as CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={onExportICS}
                    className="w-full px-3 py-2 text-xs font-bold text-left rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    <CalendarDays size={15} className="text-sky-500" />
                    <span>Export to iCal (.ics)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
