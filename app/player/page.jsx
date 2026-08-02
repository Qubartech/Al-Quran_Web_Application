"use client";

import { useEffect, useState, useMemo } from "react";
import { QURAN_API_BASE_URL } from "@/lib/api/config";
import { useAudio } from "@/context/AudioProvider";
import { useUser } from "@/context/UserProvider";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Loader2, 
  Music, 
  ChevronRight, 
  BookOpen 
} from "lucide-react";

const getSurahNumFromSrc = (src) => {
  if (!src) return null;
  const match = src.match(/murattal\/(\d+)\.mp3/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
};

const getActiveWordIndex = (ayah, currentTimeSeconds) => {
  if (!ayah?.segments || ayah.segments.length === 0) return -1;
  const currentTimeMs = currentTimeSeconds * 1000;

  const activeSegment = ayah.segments.find(
    (seg) => currentTimeMs >= seg[1] && currentTimeMs <= seg[2]
  );

  if (activeSegment) {
    return activeSegment[0] - 1; // Return 0-indexed position
  }
  return -1;
};

export default function AudioPlayerPage() {
  const audio = useAudio();
  const { user, session } = useUser();
  const [surahs, setSurahs] = useState([]);
  const [activeSurahNum, setActiveSurahNum] = useState(1);
  const [activeSurahInfo, setActiveSurahInfo] = useState(null);
  
  // Quran data states for active playback
  const [arabicAyahs, setArabicAyahs] = useState([]);
  const [translationAyahs, setTranslationAyahs] = useState([]);
  const [segments, setSegments] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load all Surahs on mount
  useEffect(() => {
    fetch(`${QURAN_API_BASE_URL}/chapters?language=en`)
      .then((res) => res.json())
      .then((json) => {
        const mapped = (json.chapters || []).map((c) => ({
          number: c.id,
          englishName: c.name_simple,
          name: c.name_arabic,
          numberOfAyahs: c.verses_count,
          revelationType: c.revelation_place === "makkah" ? "Meccan" : "Medinan",
          englishTranslation: c.translated_name?.name || ""
        }));
        setSurahs(mapped);
      })
      .catch((e) => console.error("Error loading chapters:", e));
  }, []);

  // Update activeSurahNum based on global playlist context
  useEffect(() => {
    if (audio?.playlistId) {
      // e.g. "surah_3" or numeric id
      const parts = String(audio.playlistId).split("_");
      const num = parseInt(parts[1] || parts[0], 10);
      if (num >= 1 && num <= 114) {
        setActiveSurahNum(num);
      }
    }
  }, [audio?.playlistId]);

  // Sync active play status
  useEffect(() => {
    setIsPlaying(audio?.open && !audio?.paused);
  }, [audio?.open, audio?.paused]);

  // Listen to progress updates
  useEffect(() => {
    const handleTimeUpdate = (e) => {
      setAudioTime(e.detail.currentTime);
    };
    window.addEventListener("quran-audio-timeupdate", handleTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", handleTimeUpdate);
    };
  }, []);

  // Fetch verse content & segments for the active Surah
  useEffect(() => {
    if (!activeSurahNum) return;
    setLoadingDetails(true);
    
    // Read translation edition from localStorage or default
    let translationId = "161"; // Default English Sahih International numeric identifier
    let reciterId = "7";
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app_translation_identifier");
      if (saved && !isNaN(Number(saved))) {
        translationId = saved;
      }
      const savedReciter = localStorage.getItem("app_reciter_id");
      if (savedReciter) {
        reciterId = savedReciter;
      }
    }

    const textUrl = `${QURAN_API_BASE_URL}/verses/by_chapter/${activeSurahNum}?per_page=300&translations=${translationId}&words=true&word_fields=text_qpc_hafs,text_indopak,text_uthmani,code_v1,code_v2`;
    const segmentsUrl = `${QURAN_API_BASE_URL}/chapter_recitations/${reciterId}/${activeSurahNum}?segments=true`;
    const chapterUrl = `${QURAN_API_BASE_URL}/chapters/${activeSurahNum}?language=en`;

    Promise.all([
      fetch(textUrl).then((r) => r.json()),
      fetch(segmentsUrl).then((r) => r.json()),
      fetch(chapterUrl).then((r) => r.json())
    ])
      .then(([textJson, segJson, chapterJson]) => {
        const verses = textJson.verses || [];
        const chapter = chapterJson.chapter || {};
        const segmentList = segJson.audio_file?.timestamps || [];
        
        setActiveSurahInfo({
          number: chapter.id,
          name: chapter.name_arabic,
          englishName: chapter.name_simple,
          englishTranslation: chapter.translated_name?.name || "",
          numberOfAyahs: chapter.verses_count,
          revelationType: chapter.revelation_place === "makkah" ? "Meccan" : "Medinan"
        });
        
        const arabic = verses.map((v) => {
          const segMatch = segmentList.find((s) => s.verse_key === v.verse_key);
          return {
            text: v.text_uthmani || v.text_qpc_hafs || v.text_simple || "",
            words: v.words || [],
            segments: segMatch?.segments || []
          };
        });
        
        const trans = verses.map((v) => ({
          text: v.translations?.[0]?.text || ""
        }));

        setArabicAyahs(arabic);
        setTranslationAyahs(trans);
        setSegments(segmentList);
      })
      .catch((e) => console.error("Error fetching recitation details:", e))
      .finally(() => setLoadingDetails(false));
  }, [activeSurahNum]);

  // Compute active ayah based on audioTime (milliseconds check)
  const activeAyah = useMemo(() => {
    if (segments.length === 0 || arabicAyahs.length === 0) return null;
    const timeMs = audioTime * 1000;
    
    const activeSegIdx = segments.findIndex(
      (seg) => timeMs >= seg.timestamp_from && timeMs < seg.timestamp_to
    );

    if (activeSegIdx !== -1) {
      return {
        index: activeSegIdx,
        arabic: arabicAyahs[activeSegIdx]?.text || "",
        translation: translationAyahs[activeSegIdx]?.text || "",
        number: activeSegIdx + 1
      };
    }

    // Default to first
    return {
      index: 0,
      arabic: arabicAyahs[0]?.text || "",
      translation: translationAyahs[0]?.text || "",
      number: 1
    };
  }, [segments, arabicAyahs, translationAyahs, audioTime]);

  // Sync currently playing ayah with the global audio player
  useEffect(() => {
    if (activeAyah?.number) {
      const event = new CustomEvent("quran-audio-ayah-change", {
        detail: { ayahIndex: activeAyah.number - 1 }
      });
      window.dispatchEvent(event);
    }
  }, [activeAyah?.number]);

  // Sync page activeSurahNum with the loaded audio player source URL to prevent playing wrong surah
  useEffect(() => {
    if (audio?.src) {
      const num = getSurahNumFromSrc(audio.src);
      if (num && num !== activeSurahNum) {
        setActiveSurahNum(num);
      }
    }
  }, [audio?.src, activeSurahNum]);

  const selectSurah = (num) => {
    setActiveSurahNum(num);
    const selected = surahs.find((s) => s.number === num);
    audio?.playSurah(num, selected?.englishName || "Surah");

    // Log to recents
    if (user && session?.access_token) {
      fetch("/api/recent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          surahNumber: num,
          surahName: selected?.englishName || "",
          englishName: selected?.englishName || "",
        }),
      }).catch((e) => console.error(e));
    }
  };

  const togglePlay = () => {
    if (!audio?.src) {
      selectSurah(activeSurahNum);
    } else if (isPlaying) {
      audio?.pause();
    } else {
      audio?.resume();
    }
  };

  const handleSeek = (e) => {
    // Dispatch seek
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const duration = audio?.duration ?? 0;
    if (duration > 0) {
      const targetTime = percent * duration;
      window.dispatchEvent(
        new CustomEvent("quran-audio-seek", { detail: { time: targetTime } })
      );
    }
  };

  return (
    <div className="px-5 py-8 min-h-[calc(100vh-100px)] max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-8 relative overflow-hidden transition-colors">
      
      {/* 1. Left Side: Spinning Disc / Reciter Visualizer Card */}
      <div className="w-full lg:w-[40%] flex flex-col items-center">
        <div className="w-full p-8 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primaryColor/5 to-emerald-500/5 dark:from-primaryColor/10 dark:to-emerald-500/5 pointer-events-none"></div>

          {/* Glowing spinning Quran disc placeholder */}
          <div className="relative my-8">
            <div className={`absolute inset-0 rounded-full bg-primaryColor/10 dark:bg-emerald-500/10 blur-xl ${isPlaying ? "animate-pulse" : ""}`}></div>
            <div className={`w-52 h-52 md:w-60 md:h-60 rounded-full border-4 border-emerald-500/20 dark:border-emerald-500/10 flex items-center justify-center relative shadow-2xl bg-white/25 dark:bg-slate-900/40 backdrop-blur-md ${
              isPlaying ? "animate-[spin_20s_linear_infinite]" : ""
            }`}>
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/30 flex items-center justify-center">
                <Music size={48} className="text-primaryColor dark:text-primaryColor-light animate-bounce" style={{ animationDuration: isPlaying ? "2.5s" : "0s" }} />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-primaryColor shadow"></div>
            </div>
          </div>

          <div className="relative z-10 mt-2">
            <span className="text-[10px] font-bold tracking-widest text-primaryColor dark:text-primaryColor-light uppercase">
              Now Playing Recitation
            </span>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1 leading-snug">
              {activeSurahInfo ? `${activeSurahInfo.englishName}` : "Surah Recitation"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
              {activeSurahInfo ? `"${activeSurahInfo.englishTranslation}"` : ""}
            </p>
            <p className="text-xs font-bold text-primaryColor dark:text-emerald-400 mt-2">
              Mishari bin Rashid Alafasy
            </p>
          </div>

          {/* Quick Dropdown selector */}
          <div className="w-full mt-8 relative z-20">
            <label className="block text-left text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 pl-1">
              Select Surah
            </label>
            <select
              value={activeSurahNum}
              onChange={(e) => selectSurah(parseInt(e.target.value, 10))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-250/20 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-primaryColor text-xs font-bold shadow-sm"
            >
              {surahs.map((s) => (
                <option key={s.number} value={s.number} className="bg-white dark:bg-slate-900">
                  {s.number}. {s.englishName} ({s.name})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Right Side: Immersive Verse Reader & Big Playback controls */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6">
        
        {/* Dynamic Verse Reader */}
        <div className="flex-1 p-8 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-2xl flex flex-col justify-center min-h-[300px] relative overflow-hidden">
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-primaryColor dark:text-primaryColor-light font-bold">
            <BookOpen size={14} />
            <span>Verse {activeAyah ? activeAyah.number : "1"}</span>
          </div>

          {loadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <Loader2 className="animate-spin text-primaryColor" size={32} />
              <span className="text-xs font-bold">Loading Surah Verses...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-6 text-center">
              {activeAyah ? (
                (() => {
                  const ayahData = arabicAyahs[activeAyah.index];
                  const activeWordIndex = getActiveWordIndex(ayahData, audioTime);
                  
                  return (
                    <>
                      {/* Arabic Words */}
                      {ayahData?.words && ayahData.words.length > 0 ? (
                        <div className="flex flex-wrap gap-x-3 gap-y-5 justify-center w-full pb-7" dir="rtl">
                          {ayahData.words.map((word, wIdx) => {
                            const wordText = word.text_qpc_hafs || word.text_uthmani || word.text;
                            const isWord = word.char_type_name === "word";
                            const isActiveWord = isPlaying && activeWordIndex === wIdx;
                            const isHighlightStyle = isActiveWord;
                            const isDimmedStyle = isPlaying && activeWordIndex !== -1 && !isActiveWord;
                            const wordTrans = word.translation?.text;
                            const wordTranslit = word.transliteration?.text;

                            return (
                              <div
                                key={wIdx}
                                className="relative flex flex-col items-center justify-center p-1 rounded-md hover:bg-gray-100/50 dark:hover:bg-gray-800/30 transition-all duration-200 group cursor-pointer border border-transparent"
                              >
                                <span
                                  className={`font-arabic ayah-arabic-text select-none transition-all duration-150 ${
                                    isHighlightStyle
                                      ? "text-primaryColor dark:text-primaryColor-light scale-110 font-bold"
                                      : isDimmedStyle
                                      ? "text-gray-900/30 dark:text-gray-100/30"
                                      : "text-slate-900 dark:text-slate-100 group-hover:text-primaryColor"
                                  }`}
                                >
                                  {wordText}
                                </span>

                                {/* Tooltip on Hover */}
                                {isWord && (wordTrans || wordTranslit) && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center bg-gray-900 dark:bg-gray-800 text-white text-[11px] p-2 rounded shadow-lg z-30 pointer-events-none whitespace-nowrap min-w-[60px] border border-gray-700">
                                    {wordTranslit && (
                                      <span className="font-semibold text-gray-300 font-sans tracking-wide mb-0.5" dir="ltr">
                                        {wordTranslit}
                                      </span>
                                    )}
                                    {wordTrans && (
                                      <span className="text-gray-400 font-sans text-center font-normal leading-normal" dir="ltr">
                                        {wordTrans}
                                      </span>
                                    )}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900 dark:border-t-gray-800"></div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="font-arabic ayah-arabic-text text-right leading-loose text-slate-950 dark:text-slate-100 font-medium select-none animate-fadeIn">
                          {activeAyah.arabic}
                        </p>
                      )}

                      {/* Translation */}
                      <p className="ayah-text text-left italic text-gray-750 dark:text-gray-300 leading-relaxed pt-4 border-t border-gray-150/40 dark:border-slate-800/60 font-sans animate-fadeIn">
                        {activeAyah.translation}
                      </p>
                    </>
                  );
                })()
              ) : (
                <p className="text-xs text-center text-gray-500 font-bold">Select a Surah to begin reading.</p>
              )}
            </div>
          )}
        </div>

        {/* Dashboard player row control center */}
        <div className="p-6 rounded-2xl glass border border-white/20 dark:border-slate-800/80 shadow-2xl flex flex-col gap-4">
          
          {/* Main Controls row */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {activeSurahInfo ? `${activeSurahInfo.revelationType} • ${activeSurahInfo.numberOfAyahs} Verses` : ""}
            </span>
            
            {/* Quick buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => selectSurah(Math.max(1, activeSurahNum - 1))}
                className="p-2.5 rounded-xl bg-gray-100/50 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:text-primaryColor dark:hover:text-primaryColor transition-all border border-transparent"
                title="Previous Surah"
              >
                <SkipBack size={18} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 flex items-center justify-center rounded-full text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              </button>

              <button
                onClick={() => selectSurah(Math.min(114, activeSurahNum + 1))}
                className="p-2.5 rounded-xl bg-gray-100/50 dark:bg-slate-800/40 text-gray-600 dark:text-gray-300 hover:text-primaryColor dark:hover:text-primaryColor transition-all border border-transparent"
                title="Next Surah"
              >
                <SkipForward size={18} fill="currentColor" />
              </button>
            </div>

            <span className="text-xs font-bold text-primaryColor dark:text-emerald-400 select-none">
              Playing Surah #{activeSurahNum}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
