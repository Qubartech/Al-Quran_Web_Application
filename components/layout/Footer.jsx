"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Globe,
  Github,
  Twitter,
  Linkedin,
  Heart,
  ArrowUp,
  Clock,
  Headphones,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative w-full bg-slate-900 text-slate-300 border-t border-emerald-500/20 overflow-hidden mt-20">
      
      {/* Subtle Background Radial Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8 relative z-10">

        {/* ── Top Hero / Brand Strip ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-slate-800/80">
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                Q
              </span>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  Al-Quran
                </span>
                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase -mt-0.5">
                  Read • Listen • Contemplate
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block w-px h-8 bg-slate-800 mx-2" />

            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-medium">
              A modern, ad-free Islamic platform for Quran reading, verse-by-verse recitations, and daily prayer companion tools.
            </p>
          </div>

          {/* Arabic Calligraphy Badge & Socials */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-emerald-400 font-arabic text-sm tracking-wide">
              الْقُرْآنُ الْكَرِيم
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href="https://github.com/qubartech/Quran_Application_With_NextJs"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/30 transition-all"
                title="GitHub Repository"
              >
                <Github size={16} />
              </a>
              <a
                href="https://www.qubartech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/30 transition-all"
                title="Qubartech Website"
              >
                <Globe size={16} />
              </a>
              <a
                href="https://twitter.com/qubartech"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/30 transition-all"
                title="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://linkedin.com/company/qubartech"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 border border-slate-700/60 hover:border-emerald-500/30 transition-all"
                title="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>

        </div>

        {/* ── 4-Column Navigation Links ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          
          {/* Column 1: Quran Reading */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={14} className="text-emerald-400" />
              Explore Quran
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  114 Surahs Directory
                </Link>
              </li>
              <li>
                <Link href="/juz" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  30 Juz / Paras
                </Link>
              </li>
              <li>
                <Link href="/page/1" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Mushaf Page View
                </Link>
              </li>
              <li>
                <Link href="/player" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Audio Reciter Player
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Islamic Quiz & Learning
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Prayer & Salah */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Clock size={14} className="text-emerald-400" />
              Salah & Companion
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/prayer" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Daily Namaz Timings
                </Link>
              </li>
              <li>
                <Link href="/prayer/calendar" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Monthly Prayer Calendar
                </Link>
              </li>
              <li>
                <Link href="/prayer" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Habit & Streak Tracker
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Saved Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular Surahs */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" />
              Popular Surahs
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-medium text-slate-400">
              <li>
                <Link href="/surah/36" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Surah Ya-Sin (36)
                </Link>
              </li>
              <li>
                <Link href="/surah/67" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Surah Al-Mulk (67)
                </Link>
              </li>
              <li>
                <Link href="/surah/18" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Surah Al-Kahf (18)
                </Link>
              </li>
              <li>
                <Link href="/surah/55" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Surah Ar-Rahman (55)
                </Link>
              </li>
              <li>
                <Link href="/surah/56" className="hover:text-emerald-400 flex items-center gap-1.5 transition-colors group">
                  <ChevronRight size={12} className="text-slate-600 group-hover:text-emerald-400 transition-colors" />
                  Surah Al-Waqi&apos;ah (56)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Community */}
          <div className="flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Layers size={14} className="text-emerald-400" />
              Resources & Data
            </h4>
            <ul className="flex flex-col gap-2 text-xs font-medium text-slate-400">
              <li>
                <a
                  href="https://api.quran.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Quran Foundation API
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://aladhan.com/prayer-times-api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Aladhan Prayer API
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/TahirAhmad01/Quran_Application_With_NextJs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  GitHub Source Code
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.qubartech.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                >
                  Feedback & Support
                  <ExternalLink size={11} className="opacity-50" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-8 mt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>
              © {new Date().getFullYear()}{" "}
              <a
                href="https://www.qubartech.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline font-bold"
              >
                Qubartech™
              </a>
              . All Rights Reserved.
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="font-arabic text-slate-500">
              سُبْحَانَ اللَّهِ وَبِحَمْدِهِ
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span>Built with</span>
              <Heart size={12} className="text-rose-500 fill-rose-500 animate-pulse" />
              <span>for the Ummah</span>
            </div>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-800 hover:bg-emerald-500 text-slate-300 hover:text-white border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
              title="Back to Top"
              aria-label="Back to Top"
            >
              <ArrowUp size={14} />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
