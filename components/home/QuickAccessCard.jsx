"use client";

import Link from "next/link";
import { Layers, Play, Pause, Star, Heart, Sparkles, ArrowRight, Clock, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useAudio } from "@/context/AudioProvider";
import { QURANICAUDIO_BASE_URL } from "@/lib/api/config";

const POPULAR_SURAHS = [
  { name: "Al-Fatihah", id: 1, subtitle: "The Opening", icon: "✨", ayahs: 7, color: "from-emerald-500/20 to-teal-500/20" },
  { name: "Ya-Sin", id: 36, subtitle: "Heart of Quran", icon: "💎", ayahs: 83, color: "from-violet-500/20 to-purple-500/20" },
  { name: "Al-Mulk", id: 67, subtitle: "The Sovereignty", icon: "👑", ayahs: 30, color: "from-amber-500/20 to-orange-500/20" },
  { name: "Al-Kahf", id: 18, subtitle: "The Cave", icon: "⛰️", ayahs: 110, color: "from-cyan-500/20 to-blue-500/20" },
  { name: "Ar-Rahman", id: 55, subtitle: "The Merciful", icon: "🌸", ayahs: 78, color: "from-rose-500/20 to-pink-500/20" },
  { name: "Al-Waqi'ah", id: 56, subtitle: "The Inevitable", icon: "💫", ayahs: 96, color: "from-indigo-500/20 to-blue-500/20" },
];

const QURAN_FACTS = [
  { fact: "The longest Surah is Al-Baqarah with 286 verses, and the shortest is Al-Kawthar with 3 verses.", category: "Structure" },
  { fact: "The word 'Allah' appears 2,698 times in the Quran.", category: "Words" },
  { fact: "Surah Al-Fatihah is also known as 'Umm Al-Kitab' — The Mother of the Book.", category: "Names" },
  { fact: "The Quran was revealed over a period of 23 years.", category: "History" },
  { fact: "Bismillah appears 114 times in the Quran — once at the start of each Surah except At-Tawbah, and twice in Surah An-Naml.", category: "Patterns" },
  { fact: "The middle verse of the Quran is in Surah Al-Kahf (18:19).", category: "Structure" },
  { fact: "Surah Ar-Rahman is known as 'The Bride of the Quran' for its beauty.", category: "Names" },
  { fact: "The Quran mentions 25 prophets by name.", category: "Content" },
];

const TOOL_ITEMS = [
  { href: "/juz", label: "Juz / Paras", desc: "Browse by 30 Juz", icon: Layers, color: "text-blue-500" },
  { href: "/prayer", label: "Prayer & Tracker", desc: "Timings & logs", icon: Clock, color: "text-teal-500" },
  { href: "/player", label: "Audio Player", desc: "Listen recitations", icon: Play, color: "text-emerald-500" },
  { href: "/dashboard", label: "My Favorites", desc: "Saved surahs", icon: Heart, color: "text-rose-500" },
];

export default function QuickAccessCard({ className = "" }) {
  const audio = useAudio();
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    setFactIndex(seed % QURAN_FACTS.length);
  }, []);

  const handlePlaySurah = (e, surah) => {
    e.preventDefault();
    e.stopPropagation();
    if (!audio) return;

    const trackId = `surah_${surah.id}`;
    const isCurrentPlaying = audio.trackId === trackId && audio.isPlaying;

    if (isCurrentPlaying) {
      audio.togglePlay();
    } else {
      const fullAudioUrl = `${QURANICAUDIO_BASE_URL}/qdc/mishari_al_afasy/murattal/${surah.id}.mp3`;
      audio.playList([fullAudioUrl], 0, trackId, surah.name);
    }
  };

  const currentFact = QURAN_FACTS[factIndex];

  return (
    <div className={`p-5 md:p-6 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 shadow-xl flex flex-col justify-between gap-4 ${className}`}>
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/80 pb-3">
        <span className="text-xs md:text-sm font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <Star size={16} className="fill-emerald-500/20" />
          Popular Surahs & Quick Access
        </span>
        <Link
          href="/surah"
          className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors"
        >
          All 114 Surahs
          <ArrowRight size={13} />
        </Link>
      </div>

      {/* Popular Surahs Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {POPULAR_SURAHS.map((s) => {
          const isPlayingThis = audio?.trackId === `surah_${s.id}` && audio?.isPlaying;

          return (
            <div
              key={s.id}
              className="group relative overflow-hidden p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 hover:border-emerald-500/40 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
              
              <Link href={`/surah/${s.id}`} className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg md:text-xl select-none group-hover:scale-110 transition-transform duration-200 shrink-0">
                      {s.icon}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {s.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate font-medium mt-0.5">
                        {s.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Play Audio Button */}
                  <button
                    type="button"
                    onClick={(e) => handlePlaySurah(e, s)}
                    className={`p-1.5 rounded-xl transition-all shrink-0 ${
                      isPlayingThis
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                    }`}
                    title={isPlayingThis ? "Pause" : "Play Recitation"}
                  >
                    {isPlayingThis ? <Pause size={13} className="fill-white" /> : <Play size={13} className="fill-emerald-600 dark:fill-emerald-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200/30 dark:border-slate-700/30 text-[10px] md:text-xs font-bold">
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">{s.ayahs} Verses</span>
                  <span className="text-slate-400 font-mono">#{s.id}</span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Did You Know - Interactive Quran Fact */}
      <div className="relative overflow-hidden p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 dark:from-amber-500/15 dark:to-rose-500/15 border border-amber-500/20">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 shrink-0 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mt-0.5 shadow-sm">
            <Sparkles size={16} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Did You Know?
              </span>
              <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase">
                {currentFact.category}
              </span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {currentFact.fact}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tools */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <BookOpen size={13} className="text-emerald-500" />
          Quran Tools & Modules
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {TOOL_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link href={item.href} key={item.label}>
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/70 hover:border-emerald-500/30 transition-all group/tool shadow-sm">
                  <div className={`h-8 w-8 shrink-0 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center ${item.color} group-hover/tool:scale-110 transition-transform shadow-sm`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate group-hover/tool:text-emerald-600 dark:group-hover/tool:text-emerald-400 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate font-medium mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
