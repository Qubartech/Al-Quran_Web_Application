"use client";

import React, { useState } from "react";
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
  Moon
} from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const QUICK_CITIES = [
  { city: "Makkah", country: "Saudi Arabia" },
  { city: "Madinah", country: "Saudi Arabia" },
  { city: "Dhaka", country: "Bangladesh" },
  { city: "London", country: "United Kingdom" },
  { city: "New York", country: "United States" },
  { city: "Cairo", country: "Egypt" },
  { city: "Istanbul", country: "Turkey" },
  { city: "Dubai", country: "United Arab Emirates" },
  { city: "Kuala Lumpur", country: "Malaysia" }
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
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full print:hidden">
      
      {/* Top Banner / Hero Title */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-4 sm:p-6 md:p-8 text-white shadow-xl shadow-emerald-950/20 border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] sm:text-xs font-semibold tracking-wider uppercase">
              <Sparkles size={13} className="text-emerald-400 shrink-0" />
              <span>AlAdhan Calculation Engine</span>
            </div>
            
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-200 bg-clip-text text-transparent">
              Prayer Times Calendar
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Comprehensive monthly timetable with accurate Fajr, Dhuhr, Asr, Maghrib, Isha, Tahajjud times, and Hijri dates.
            </p>
          </div>

          {/* Quick Location & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Location Badge */}
            <div className="flex-1 sm:flex-initial flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-slate-100 min-w-0">
              <MapPin size={16} className="text-emerald-400 shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] sm:text-xs text-slate-400 leading-tight">Location</span>
                <span className="font-semibold text-white truncate max-w-[130px] sm:max-w-[180px]">
                  {activeLocation ? `${activeLocation.city}${activeLocation.country ? `, ${activeLocation.country}` : ""}` : "Loading..."}
                </span>
              </div>
            </div>

            {/* GPS Reset Button */}
            <button
              onClick={onResetGps}
              title="Use GPS Geolocation"
              className="p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all cursor-pointer shrink-0"
            >
              <Navigation size={16} />
            </button>

            {/* Calculation Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2.5 sm:px-4 sm:py-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white transition-all text-xs sm:text-sm font-bold cursor-pointer shrink-0 shadow-lg shadow-emerald-900/30 flex items-center gap-1.5"
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>

        {/* Quick Cities Bar */}
        <div className="mt-4 pt-3 sm:mt-6 sm:pt-5 border-t border-white/10 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1 shrink-0">
            <Globe size={12} /> Quick City:
          </span>
          {QUICK_CITIES.map((loc) => (
            <button
              key={loc.city}
              onClick={() => onSearchLocation(loc.city)}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-[11px] sm:text-xs text-slate-200 hover:text-white transition-colors border border-white/10 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {loc.city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Control Strip (Mobile Responsive Stack) */}
      <div className="flex flex-col gap-3 p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none">
        
        {/* Row 1: Month/Year Navigation & Hijri Summary */}
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Month Dropdown */}
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value, 10))}
              className="px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold text-xs sm:text-sm border border-transparent hover:border-emerald-500 focus:outline-none transition-all cursor-pointer"
            >
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            {/* Year Selector */}
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10))}
              className="px-2.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold text-xs sm:text-sm border border-transparent hover:border-emerald-500 focus:outline-none transition-all cursor-pointer"
            >
              {Array.from({ length: 11 }, (_, i) => 2024 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              onClick={handleNextMonth}
              className="p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>

            <button
              onClick={handleToday}
              className="px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:bg-emerald-500/20 transition-all border border-emerald-500/20 shrink-0"
            >
              Today
            </button>
          </div>

          {/* Hijri Month Banner */}
          {hijriSummary && (
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-bold flex items-center gap-1.5 max-w-full truncate">
              <CalendarIcon size={14} className="text-amber-500 shrink-0" />
              <span className="truncate">{hijriSummary}</span>
            </div>
          )}
        </div>

        {/* Row 2: Search City Form & Export Options */}
        <div className="flex items-center gap-2 w-full">
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city..."
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60 focus:border-emerald-500 focus:outline-none transition-colors"
            />
            <Search size={15} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          </form>

          {/* Export Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-500 text-white hover:bg-emerald-600 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Download size={15} />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 p-2 text-xs flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setShowExportMenu(false)}
              >
                <button
                  onClick={onPrint}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-left transition-colors"
                >
                  <Printer size={15} className="text-emerald-500" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={onExportCSV}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-left transition-colors"
                >
                  <FileSpreadsheet size={15} className="text-teal-500" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={onExportICS}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-left transition-colors"
                >
                  <CalendarIcon size={15} className="text-sky-500" />
                  <span>Export iCal (.ics)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Full Width Segmented View Mode Controls */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 w-full">
          <button
            onClick={() => setViewMode("table")}
            title="Table View"
            className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              viewMode === "table"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <List size={15} />
            <span>Table</span>
          </button>

          <button
            onClick={() => setViewMode("grid")}
            title="Monthly Grid View"
            className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid size={15} />
            <span>Grid</span>
          </button>

          <button
            onClick={() => setViewMode("year")}
            title="Annual 12-Month View"
            className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              viewMode === "year"
                ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <CalendarDays size={15} />
            <span>Year</span>
          </button>

          <button
            onClick={() => setViewMode("hijri")}
            title="Gregorian-Hijri Calendar & Converter"
            className={`py-2 px-1 rounded-xl text-[11px] font-bold flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
              viewMode === "hijri"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Moon size={15} className="text-amber-500" />
            <span>Hijri</span>
          </button>
        </div>

      </div>

    </div>
  );
}
