"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { QURAN_API_BASE_URL, getWordAudioUrl } from "@/lib/api/config";
import { useAudio } from "@/context/AudioProvider";
import { useUser } from "@/context/UserProvider";
import {
  Bookmark,
  Copy,
  Check,
  Repeat1,
  Share2,
  BookOpen,
  List,
  BookMarked,
  Sliders,
  Type,
  Volume2,
  Sparkles,
} from "lucide-react";
import TafsirModal from "./TafsirModal";
import SurahPlayBtn from "./SurahPlayBtn";

export default function SurahAyahList({
  arabicAyah = [],
  englishTransAyah = [],
  ayahAudio = [],
  pageId,
  surahName,
}) {
  const [refreshTick, setRefreshTick] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [englishTrans, setEnglishTrans] = useState(englishTransAyah || []);
  const audio = useAudio();
  const { user, session } = useUser();
  const [playingWordAudio, setPlayingWordAudio] = useState(null);
  const wordAudioRef = useRef(null);
  const [arabicTextType, setArabicTextType] = useState("uthmani");
  const [showWordTooltips, setShowWordTooltips] = useState(true);
  const [arabicFontSize, setArabicFontSize] = useState(24);
  const [transFontSize, setTransFontSize] = useState(17);
  const [showSettingsRibbon, setShowSettingsRibbon] = useState(false);

  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [bookmarks, setBookmarks] = useState({});
  const [repeatAyahIndex, setRepeatAyahIndex] = useState(null);
  const [copiedAyahIdx, setCopiedAyahIdx] = useState(null);
  const [sharedAyahIdx, setSharedAyahIdx] = useState(null);
  const [viewMode, setViewMode] = useState("verse"); // 'verse' | 'reading'
  const [tafsirModalData, setTafsirModalData] = useState({
    isOpen: false,
    surahId: null,
    ayahNumber: null,
    verseKey: "",
    arabicText: "",
    translationText: "",
  });

  const playWordAudio = (word, wordIdx, ayahIdx, ayahObj) => {
    const audioUrl = getWordAudioUrl(
      word,
      pageId,
      ayahObj?.numberInSurah || (ayahIdx !== undefined ? ayahIdx + 1 : null),
      wordIdx
    );
    if (!audioUrl) return;

    if (wordAudioRef.current) {
      wordAudioRef.current.pause();
    }

    if (audio && typeof audio.pause === "function" && !audio.paused) {
      audio.pause();
    }

    const newAudio = new Audio(audioUrl);
    wordAudioRef.current = newAudio;

    const activeKey = `${ayahIdx}_${wordIdx}`;
    setPlayingWordAudio(activeKey);

    newAudio.play().catch((err) => {
      console.error("Error playing word audio:", err);
      setPlayingWordAudio(null);
    });

    newAudio.onended = () => {
      setPlayingWordAudio(null);
    };

    newAudio.onerror = () => {
      setPlayingWordAudio(null);
    };
  };

  useEffect(() => {
    return () => {
      if (wordAudioRef.current) {
        wordAudioRef.current.pause();
      }
    };
  }, []);

  // Sync initial preferences from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const val = localStorage.getItem("app_arabic_text_type") || "uthmani";
      setArabicTextType(val);

      const savedArSize = localStorage.getItem("app_arabic_font_size");
      if (savedArSize) {
        const parsed = parseInt(savedArSize, 10);
        if (!isNaN(parsed) && parsed >= 18 && parsed <= 44) {
          setArabicFontSize(parsed);
          document.documentElement.style.setProperty("--ayah-arabic-font-size", `${parsed}px`);
        }
      }

      const savedTransSize = localStorage.getItem("app_trans_font_size");
      if (savedTransSize) {
        const parsed = parseInt(savedTransSize, 10);
        if (!isNaN(parsed) && parsed >= 13 && parsed <= 26) {
          setTransFontSize(parsed);
          document.documentElement.style.setProperty("--ayah-font-size", `${parsed}px`);
        }
      }

      const onTextTypeChange = (e) => {
        if (e.detail?.value) {
          setArabicTextType(e.detail.value);
        }
      };
      window.addEventListener("quran-arabic-text-type-change", onTextTypeChange);
      return () => window.removeEventListener("quran-arabic-text-type-change", onTextTypeChange);
    }
  }, []);

  const handleArabicFontSizeChange = (delta) => {
    setArabicFontSize((prev) => {
      const next = Math.max(18, Math.min(44, prev + delta));
      if (typeof window !== "undefined") {
        document.documentElement.style.setProperty("--ayah-arabic-font-size", `${next}px`);
        localStorage.setItem("app_arabic_font_size", String(next));
      }
      return next;
    });
  };

  const handleTransFontSizeChange = (delta) => {
    setTransFontSize((prev) => {
      const next = Math.max(13, Math.min(26, prev + delta));
      if (typeof window !== "undefined") {
        document.documentElement.style.setProperty("--ayah-font-size", `${next}px`);
        localStorage.setItem("app_trans_font_size", String(next));
      }
      return next;
    });
  };

  const handleScriptChange = (type) => {
    setArabicTextType(type);
    if (typeof window !== "undefined") {
      localStorage.setItem("app_arabic_text_type", type);
      window.dispatchEvent(
        new CustomEvent("quran-arabic-text-type-change", { detail: { value: type } })
      );
    }
  };

  // Bookmarks handling
  useEffect(() => {
    if (!user || !session?.access_token) {
      setBookmarks({});
      return;
    }
    fetch("/api/favorites/ayah", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach((item) => {
            map[`${item.surahNumber}_${item.ayahNumber}`] = true;
          });
          setBookmarks(map);
        }
      })
      .catch((e) => console.error("Error fetching bookmarks:", e));
  }, [user, session?.access_token]);

  const toggleBookmark = async (ayahIdx) => {
    if (!user || !session?.access_token) {
      alert("Please Sign In to bookmark Ayahs to your personal whitelist!");
      return;
    }
    const ayahNumber = ayahIdx + 1;
    const key = `${pageId}_${ayahNumber}`;
    const isBookmarked = !!bookmarks[key];

    try {
      if (isBookmarked) {
        await fetch(`/api/favorites/ayah?surahNumber=${pageId}&ayahNumber=${ayahNumber}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        setBookmarks((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      } else {
        const ayahObj = arabicAyah[ayahIdx];
        const translationText = englishTrans[ayahIdx]?.text || "";
        await fetch("/api/favorites/ayah", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            surahNumber: pageId,
            ayahNumber,
            surahName: surahName || "",
            arabicText: ayahObj?.text || "",
            translation: translationText,
          }),
        });
        setBookmarks((prev) => ({
          ...prev,
          [key]: true,
        }));
      }
    } catch (e) {
      console.error("Error toggling bookmark:", e);
    }
  };

  useEffect(() => {
    const onTimeUpdate = (e) => {
      setAudioCurrentTime(e.detail.currentTime);
    };
    window.addEventListener("quran-audio-timeupdate", onTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", onTimeUpdate);
    };
  }, []);

  const isCurrentSurahPlaying = useMemo(() => {
    if (!audio?.src) return false;
    const pId = String(audio?.playlistId || "").replace("surah_", "").trim();
    const curId = String(pageId || "").replace("surah_", "").trim();
    if (!pId || !curId) return false;
    return pId === curId;
  }, [audio?.src, audio?.playlistId, pageId]);

  function getActiveWordIndex(ayah, currentTimeSeconds) {
    if (!isCurrentSurahPlaying || !ayah?.segments || ayah.segments.length === 0) return -1;
    const currentTimeMs = currentTimeSeconds * 1000;

    const activeSegment = ayah.segments.find(
      (seg) => currentTimeMs >= seg[1] && currentTimeMs <= seg[2]
    );

    if (activeSegment) {
      return activeSegment[0] - 1; // Return 0-indexed position
    }
    return -1;
  }

  // Track the active ayah index based on audioCurrentTime
  const activeAyahIndex = useMemo(() => {
    if (!isCurrentSurahPlaying) return -1;
    const timeMs = audioCurrentTime * 1000;
    return arabicAyah.findIndex(
      (ayah) => timeMs >= ayah.timestamp_from && timeMs < ayah.timestamp_to
    );
  }, [arabicAyah, audioCurrentTime, isCurrentSurahPlaying]);

  // Sync scroll on active ayah index change
  useEffect(() => {
    if (isCurrentSurahPlaying && activeAyahIndex !== -1 && !isPaused) {
      const elId = `sura_${pageId}_ayah_${activeAyahIndex + 1}`;
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [activeAyahIndex, isCurrentSurahPlaying, isPaused, pageId]);

  // Single Ayah Repeat Loop Handler
  const lastSeekTimeRef = useRef(0);

  useEffect(() => {
    if (repeatAyahIndex === null || !isCurrentSurahPlaying) return;
    const targetAyah = arabicAyah[repeatAyahIndex];
    if (!targetAyah) return;

    const fromMs = typeof targetAyah.timestamp_from === "number" ? targetAyah.timestamp_from : 0;
    const toMs = typeof targetAyah.timestamp_to === "number" ? targetAyah.timestamp_to : 0;

    if (toMs <= fromMs) return;

    const onTimeUpdate = (e) => {
      const timeMs = (e.detail?.currentTime || 0) * 1000;
      const now = Date.now();
      if (now - lastSeekTimeRef.current < 800) return;

      if (timeMs >= toMs - 200 || timeMs < fromMs - 1500) {
        lastSeekTimeRef.current = now;
        const seekSec = fromMs / 1000;
        window.dispatchEvent(
          new CustomEvent("quran-audio-seek", { detail: { time: seekSec } })
        );
      }
    };

    window.addEventListener("quran-audio-timeupdate", onTimeUpdate);
    return () => {
      window.removeEventListener("quran-audio-timeupdate", onTimeUpdate);
    };
  }, [repeatAyahIndex, isCurrentSurahPlaying, arabicAyah]);

  const toggleRepeatSingleAyah = (idx) => {
    if (repeatAyahIndex === idx) {
      setRepeatAyahIndex(null);
    } else {
      setRepeatAyahIndex(idx);
      playControl(idx);
    }
  };

  const copyAyahText = (ayah, idx) => {
    try {
      const arabicText =
        ayah?.text ||
        (ayah?.words || []).map((w) => w.text_uthmani || w.text).join(" ");
      const translationText = englishTrans[idx]?.text || "";
      const textToCopy = `Surah ${surahName ? surahName + " " : ""}(${pageId}:${idx + 1})\n\n${arabicText}\n\n${translationText}`;

      navigator.clipboard.writeText(textToCopy);
      setCopiedAyahIdx(idx);
      setTimeout(() => setCopiedAyahIdx(null), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Handle ?ayah=X or ?verse=X clean query params on page load
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const targetAyah = urlParams.get("ayah") || urlParams.get("verse");
    if (targetAyah) {
      const num = parseInt(targetAyah, 10);
      if (!isNaN(num) && num > 0) {
        const elId = `sura_${pageId}_ayah_${num}`;
        setTimeout(() => {
          const el = document.getElementById(elId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.remove("ring-2", "ring-emerald-500");
            void el.offsetWidth;
            el.classList.add("ring-2", "ring-emerald-500", "transition-all", "duration-500");
            setTimeout(() => el.classList.remove("ring-2", "ring-emerald-500"), 2000);
          }
        }, 350);
      }
    }
  }, [pageId]);

  const shareAyah = async (ayah, idx) => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/surah/${pageId}?ayah=${idx + 1}`
        : "";
    const arabicText =
      ayah?.text ||
      (ayah?.words || []).map((w) => w.text_uthmani || w.text).join(" ");
    const translationText = englishTrans[idx]?.text || "";
    const shareData = {
      title: `Surah (${pageId}:${idx + 1})`,
      text: `${arabicText}\n\n${translationText}`,
      url: url,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        if (e.name !== "AbortError") {
          navigator.clipboard?.writeText(url);
          setSharedAyahIdx(idx);
          setTimeout(() => setSharedAyahIdx(null), 2000);
        }
      }
    } else {
      navigator.clipboard?.writeText(url);
      setSharedAyahIdx(idx);
      setTimeout(() => setSharedAyahIdx(null), 2000);
    }
  };

  function playControl(ayahIndex) {
    const targetAyah = arabicAyah[ayahIndex];
    if (!targetAyah) return;
    const seekTime = (targetAyah.timestamp_from || 0) / 1000;

    const isCurrentPlaying =
      audio?.src &&
      (audio?.playlistId === pageId ||
        audio?.playlistId === `surah_${pageId}` ||
        String(audio?.playlistId) === String(pageId) ||
        String(audio?.playlistId) === `surah_${pageId}`);

    if (isCurrentPlaying) {
      setAudioCurrentTime(seekTime);
      window.dispatchEvent(
        new CustomEvent("quran-audio-seek", { detail: { time: seekTime } })
      );
      if (isPaused) {
        audio?.resume();
      }
    } else {
      setAudioCurrentTime(seekTime);
      audio?.playSurah(pageId, surahName, seekTime);

      if (user && session?.access_token) {
        fetch("/api/recent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            surahNumber: pageId,
            surahName: surahName || "",
            englishName: surahName || "",
          }),
        }).catch((err) => console.error("Error logging recent play:", err));
      }
    }
  }

  // Force re-render when audio play/pause ticks change
  useEffect(() => {
    if (!audio) return;
    setRefreshTick((t) => t + 1);
  }, [audio, audio?.playTick, audio?.pauseTick]);

  useEffect(() => {
    setIsPaused(audio?.paused ?? true);
  }, [audio, audio?.paused]);

  useEffect(() => {
    setEnglishTrans(englishTransAyah || []);
  }, [englishTransAyah]);

  // React to language/identifier changes from Settings and refetch translation
  useEffect(() => {
    const fetchByIdentifier = async (rawIdentifier) => {
      try {
        const identifiers = String(rawIdentifier)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!identifiers.length) return;

        const promises = identifiers.map((id) =>
          fetch(
            `${QURAN_API_BASE_URL}/verses/by_chapter/${pageId}?per_page=300&translations=${id}`
          ).then((res) => (res.ok ? res.json() : null))
        );

        const results = await Promise.all(promises);
        const validResults = results.filter(Boolean);
        if (!validResults.length) return;

        const totalAyahs = validResults[0]?.verses?.length || 0;
        const combinedTranslations = [];

        for (let i = 0; i < totalAyahs; i++) {
          const verseTransList = [];
          validResults.forEach((resData) => {
            const verse = resData?.verses?.[i];
            const transObj = verse?.translations?.[0];
            if (transObj && transObj.text) {
              verseTransList.push({
                text: transObj.text || "",
                name: transObj.resource_name || "",
                id: transObj.resource_id,
              });
            }
          });
          combinedTranslations.push(verseTransList);
        }

        if (combinedTranslations.length) {
          setEnglishTrans(combinedTranslations);
        }
      } catch (e) {
        console.error("Error fetching translations:", e);
      }
    };

    if (!pageId || typeof window === "undefined") return;

    const identifier = localStorage.getItem("app_translation_identifier");
    if (identifier) fetchByIdentifier(identifier);

    const onStorage = (e) => {
      if (e.key === "app_translation_identifier" && e.newValue) {
        fetchByIdentifier(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pageId]);

  return (
    <>
      {/* ── 1. Quran Reading Control Ribbon (Quran.com Style) ── */}
      <div className="flex flex-col gap-2.5 mb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-emerald-500/15 dark:border-slate-800/80 shadow-md">
          
          {/* Left: View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100/90 dark:bg-slate-800/80 rounded-xl border border-gray-200/50 dark:border-slate-700/60 text-xs font-bold">
            <button
              onClick={() => setViewMode("verse")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "verse"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-black"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <List size={14} />
              <span>Verse by Verse</span>
            </button>
            <button
              onClick={() => setViewMode("reading")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === "reading"
                  ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-black"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              <BookMarked size={14} />
              <span>Mushaf Reading</span>
            </button>
          </div>

          {/* Right: Quick Preferences & Settings Trigger */}
          <div className="flex items-center gap-2">
            {/* Quick Script Selector */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-gray-100/90 dark:bg-slate-800/80 rounded-xl border border-gray-200/50 dark:border-slate-700/60 text-[11px] font-bold">
              {[
                { id: "uthmani", label: "Uthmani" },
                { id: "indopak", label: "IndoPak" },
                { id: "tajweed", label: "Tajweed" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleScriptChange(s.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    arabicTextType === s.id
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs font-black"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Font Size Adjusters Ribbon Toggle */}
            <button
              onClick={() => setShowSettingsRibbon((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                showSettingsRibbon
                  ? "bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/20 font-black"
                  : "bg-gray-100/80 dark:bg-slate-800/80 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-slate-700/60"
              }`}
              title="Adjust Reading Typography & Tooltips"
            >
              <Type size={14} />
              <span className="hidden sm:inline">Text Size</span>
            </button>
          </div>
        </div>

        {/* Expandable Typography Ribbon */}
        {showSettingsRibbon && (
          <div className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-emerald-500/20 dark:border-emerald-500/30 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
            
            {/* Arabic Font Size */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Arabic:</span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => handleArabicFontSizeChange(-2)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-xs font-black hover:text-emerald-500 transition-colors shadow-xs"
                  title="Smaller Arabic font"
                >
                  A-
                </button>
                <span className="px-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {arabicFontSize}px
                </span>
                <button
                  onClick={() => handleArabicFontSizeChange(2)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-xs font-black hover:text-emerald-500 transition-colors shadow-xs"
                  title="Larger Arabic font"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Translation Font Size */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Translation:</span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700">
                <button
                  onClick={() => handleTransFontSizeChange(-1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-xs font-black hover:text-emerald-500 transition-colors shadow-xs"
                  title="Smaller Translation font"
                >
                  A-
                </button>
                <span className="px-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {transFontSize}px
                </span>
                <button
                  onClick={() => handleTransFontSizeChange(1)}
                  className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 text-xs font-black hover:text-emerald-500 transition-colors shadow-xs"
                  title="Larger Translation font"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Mobile Script Selector */}
            <div className="flex sm:hidden items-center gap-1.5">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Script:</span>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
                {["uthmani", "indopak", "tajweed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleScriptChange(s)}
                    className={`px-2 py-0.5 rounded capitalize ${
                      arabicTextType === s ? "bg-emerald-500 text-white font-bold" : "text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {viewMode === "reading" ? (
        /* ── 2. Quran.com Continuous Reading Mode (Mushaf Style) ── */
        <div
          className="p-5 sm:p-8 md:p-12 rounded-3xl glass border border-emerald-500/25 leading-[2.6] sm:leading-[3.0] md:leading-[3.4] text-right font-arabic text-slate-900 dark:text-slate-100 flex flex-wrap gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-6 sm:gap-y-8 md:gap-y-10 shadow-2xl justify-start w-full text-end ayah-arabic-text"
          dir="rtl"
          style={{ textAlign: "right", direction: "rtl", fontSize: "var(--ayah-arabic-font-size)" }}
        >
          {arabicAyah.map((ayah, idx) => {
            const isPlaying =
              (audio?.playlistId === pageId || audio?.playlistId === `surah_${pageId}`) &&
              activeAyahIndex === idx;

            return (
              <span
                key={idx}
                id={`sura_${pageId}_ayah_${idx + 1}`}
                className={`inline-flex items-center flex-wrap select-none tracking-wide text-right font-arabic ayah-arabic-text transition-colors duration-300 rounded-xl px-1.5 py-0.5 ${
                  isPlaying ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" : ""
                }`}
                dir="rtl"
                style={{ fontSize: "var(--ayah-arabic-font-size)" }}
              >
                {ayah.words && ayah.words.length > 0 ? (
                  ayah.words.map((word, wIdx) => {
                    const isWord = word.char_type_name === "word";
                    const wordText =
                      arabicTextType === "indopak"
                        ? word.text_indopak || word.text
                        : arabicTextType === "tajweed"
                        ? word.text_uthmani_tajweed || word.text_qpc_hafs || word.text
                        : word.text_qpc_hafs || word.text_uthmani || word.text;
                    const isWordAudioPlaying = playingWordAudio === `${idx}_${wIdx}`;

                    return (
                      <span
                        key={wIdx}
                        onClick={() => isWord && playWordAudio(word, wIdx, idx, ayah)}
                        className={`transition-all duration-150 cursor-pointer font-arabic ayah-arabic-text ${
                          isWordAudioPlaying
                            ? "text-emerald-500 dark:text-emerald-400 font-bold scale-110 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]"
                            : "hover:text-emerald-500 dark:hover:text-emerald-400"
                        }`}
                        style={{ fontSize: "var(--ayah-arabic-font-size)" }}
                      >
                        {arabicTextType === "tajweed" ? (
                          <span dangerouslySetInnerHTML={{ __html: wordText }} />
                        ) : (
                          <span>{wordText}</span>
                        )}
                        {wIdx < ayah.words.length - 1 ? " " : ""}
                      </span>
                    );
                  })
                ) : (
                  <span className="font-arabic ayah-arabic-text" style={{ fontSize: "var(--ayah-arabic-font-size)" }}>
                    {ayah.text}
                  </span>
                )}

                {/* Ornate End-of-Ayah Glyph with Verse Number (۝) */}
                <span
                  onClick={() => playControl(idx)}
                  className="inline-flex items-center justify-center mx-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-sans font-black border border-emerald-500/20 cursor-pointer hover:scale-110 transition-transform"
                  title={`Play Ayah ${idx + 1}`}
                >
                  ۝ {idx + 1}
                </span>
              </span>
            );
          })}
        </div>
      ) : (
        /* ── 3. Verse-by-Verse Elevated Cards ── */
        <div className="flex flex-col gap-4 mt-2">
          {arabicAyah.map((ayah, idx) => {
            const isPlaying =
              (audio?.playlistId === pageId || audio?.playlistId === `surah_${pageId}`) &&
              activeAyahIndex === idx;
            const { text } = ayah || {};
            const isAyahBookmarked = !!bookmarks[`${pageId}_${idx + 1}`];

            const animDelay = idx < 10 ? `${idx * 0.04}s` : "0s";

            return (
              <div
                key={idx}
                className="animate-slideUp outline-none focus:outline-none focus-visible:outline-none"
                id={`sura_${pageId}_ayah_${idx + 1}`}
                tabIndex={-1}
                style={{ animationDelay: animDelay }}
              >
                <div
                  className={`relative px-4 sm:px-6 py-5 md:py-6 flex flex-col gap-4 w-full transition-all duration-300 rounded-3xl verse-card outline-none focus:outline-none ${
                    isPlaying
                      ? "bg-emerald-500/[0.08] dark:bg-emerald-950/30 border-2 border-emerald-500/60 dark:border-emerald-400/50 verse-active-glow shadow-xl shadow-emerald-500/10"
                      : "bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 hover:bg-white dark:hover:bg-slate-900/85 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Left Neon Playing Indicator Line */}
                  {isPlaying && (
                    <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                  )}

                  {/* ── Top Header Action Bar ── */}
                  <div className="flex items-center justify-between w-full border-b border-gray-200/30 dark:border-slate-800/60 pb-3">
                    
                    {/* Left Controls: Ayah Star Badge & Play Button */}
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      {/* Islamic Star Medallion */}
                      <div
                        className={`ayah-badge w-8 h-8 sm:w-9 sm:h-9 shrink-0 transition-all flex items-center justify-center ${
                          isPlaying
                            ? "bg-emerald-500 text-white font-black shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                            : "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20"
                        }`}
                      >
                        <span className="text-[9px] sm:text-[10px] font-black leading-none select-none">
                          {pageId}:{idx + 1}
                        </span>
                      </div>

                      {/* Play Button */}
                      <SurahPlayBtn
                        key={`spb_${idx}_pid_${audio?.playlistId ?? "-"}_ci_${audio?.currentIndex ?? -1}_open_${audio?.open ? 1 : 0}_paused_${audio?.paused ? 1 : 0}_play_${audio?.playTick ?? 0}_pause_${audio?.pauseTick ?? 0}_active_${activeAyahIndex === idx ? 1 : 0}_src_${audio?.src ?? "-"}`}
                        isPlaying={
                          audio?.open &&
                          (audio?.playlistId === pageId || audio?.playlistId === `surah_${pageId}`) &&
                          activeAyahIndex === idx &&
                          !isPaused
                        }
                        playControl={() => playControl(idx)}
                        pauseControl={() => audio?.pause()}
                      />

                      {/* Single Ayah Repeat Loop Button */}
                      <button
                        onClick={() => toggleRepeatSingleAyah(idx)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer relative ${
                          repeatAyahIndex === idx
                            ? "text-amber-500 bg-amber-500/15 border border-amber-500/30 shadow-sm"
                            : "text-gray-400 hover:text-amber-500 hover:bg-amber-500/10"
                        }`}
                        title={repeatAyahIndex === idx ? "Single Ayah Repeat ON" : "Repeat this single Ayah"}
                      >
                        <Repeat1 size={15} className="shrink-0" />
                        {repeatAyahIndex === idx && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 text-white text-[8px] font-black flex items-center justify-center shadow-xs">
                            1
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Right Controls: Bookmark, Copy, Share, Tafsir */}
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      {/* Bookmark / Whitelist */}
                      <button
                        onClick={() => toggleBookmark(idx)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                          isAyahBookmarked
                            ? "text-emerald-500 bg-emerald-500/15 border border-emerald-500/30"
                            : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                        }`}
                        title={isAyahBookmarked ? "Ayah Saved to Favorites" : "Bookmark Ayah"}
                      >
                        <Bookmark
                          size={15}
                          fill={isAyahBookmarked ? "currentColor" : "none"}
                          className="shrink-0"
                        />
                      </button>

                      {/* Copy Text */}
                      <button
                        onClick={() => copyAyahText(ayah, idx)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                          copiedAyahIdx === idx
                            ? "text-emerald-500 bg-emerald-500/15 border border-emerald-500/30"
                            : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"
                        }`}
                        title={copiedAyahIdx === idx ? "Copied to Clipboard!" : "Copy Arabic & Translation"}
                      >
                        {copiedAyahIdx === idx ? (
                          <Check size={15} className="shrink-0 text-emerald-500 animate-bounce" />
                        ) : (
                          <Copy size={14} className="shrink-0" />
                        )}
                      </button>

                      {/* Share Link */}
                      <button
                        onClick={() => shareAyah(ayah, idx)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                          sharedAyahIdx === idx
                            ? "text-teal-500 bg-teal-500/15 border border-teal-500/30"
                            : "text-gray-400 hover:text-teal-500 hover:bg-teal-500/10"
                        }`}
                        title={sharedAyahIdx === idx ? "Link Copied!" : "Share Ayah Link"}
                      >
                        {sharedAyahIdx === idx ? (
                          <Check size={15} className="shrink-0 text-teal-500 animate-bounce" />
                        ) : (
                          <Share2 size={14} className="shrink-0" />
                        )}
                      </button>

                      {/* Tafsirs Pill */}
                      <button
                        onClick={() =>
                          setTafsirModalData({
                            isOpen: true,
                            surahId: pageId,
                            ayahNumber: idx + 1,
                            verseKey: `${pageId}:${idx + 1}`,
                            arabicText:
                              text ||
                              ayah?.words
                                ?.map((w) => w.text_qpc_hafs || w.text_uthmani || w.text)
                                .join(" "),
                            translationText: englishTrans[idx]?.text,
                          })
                        }
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-500/15 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-xl border border-emerald-500/25 transition-all cursor-pointer shadow-2xs ml-1"
                        title="Read Detailed Commentary & Tafsir"
                      >
                        <BookOpen size={13} className="text-emerald-500" />
                        <span>Tafsir</span>
                      </button>
                    </div>
                  </div>

                  {/* ── Arabic Verses & Word-by-Word Tokens ── */}
                  <div className="w-full min-w-0 pt-1">
                    {ayah.words && ayah.words.length > 0 ? (
                      (() => {
                        const activeWordIndex = getActiveWordIndex(ayah, audioCurrentTime);
                        return (
                          <div
                            className="flex flex-wrap gap-x-1.5 sm:gap-x-2 gap-y-3 sm:gap-y-4 justify-start w-full pb-4"
                            dir="rtl"
                          >
                            {ayah.words.map((word, wIdx) => {
                              const isWord = word.char_type_name === "word";
                              const wordText =
                                arabicTextType === "indopak"
                                  ? word.text_indopak || word.text
                                  : arabicTextType === "tajweed"
                                  ? word.text_uthmani_tajweed || word.text_qpc_hafs || word.text
                                  : word.text_qpc_hafs || word.text_uthmani || word.text;
                              const wordTrans = word.translation?.text;
                              const wordTranslit = word.transliteration?.text;

                              const isActiveWord = isPlaying && activeWordIndex === wIdx;
                              const isWordAudioPlaying = playingWordAudio === `${idx}_${wIdx}`;
                              const isCurrentlyHighlighted = isActiveWord || isWordAudioPlaying;

                              const isDimmedStyle =
                                isPlaying && activeWordIndex !== -1 && !isCurrentlyHighlighted;

                              return (
                                <div
                                  key={wIdx}
                                  onClick={() => isWord && playWordAudio(word, wIdx, idx, ayah)}
                                  className={`relative flex flex-col items-center justify-center px-1.5 py-1 rounded-xl transition-all duration-200 group cursor-pointer outline-none focus:outline-none ${
                                    isCurrentlyHighlighted
                                      ? "z-10 bg-emerald-500/20 dark:bg-emerald-400/20 shadow-sm ring-1 ring-emerald-500/40"
                                      : isDimmedStyle
                                      ? "opacity-40 hover:opacity-100"
                                      : "hover:bg-emerald-500/5 dark:hover:bg-slate-800/60"
                                  }`}
                                >
                                  {/* Arabic word token */}
                                  {arabicTextType === "tajweed" ? (
                                    <span
                                      className={`font-bold select-none transition-all duration-150 font-arabic ayah-arabic-text ${
                                        isCurrentlyHighlighted
                                          ? "text-emerald-600 dark:text-emerald-300 font-extrabold scale-105 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]"
                                          : isDimmedStyle
                                          ? "text-slate-900/40 dark:text-slate-100/40"
                                          : "text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                      }`}
                                      dir="rtl"
                                      dangerouslySetInnerHTML={{ __html: wordText }}
                                    />
                                  ) : (
                                    <span
                                      className={`font-bold select-none transition-all duration-150 font-arabic ayah-arabic-text ${
                                        isCurrentlyHighlighted
                                          ? "text-emerald-600 dark:text-emerald-300 font-extrabold scale-105 drop-shadow-[0_2px_10px_rgba(16,185,129,0.4)]"
                                          : isDimmedStyle
                                          ? "text-slate-900/40 dark:text-slate-100/40"
                                          : "text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
                                      }`}
                                      dir="rtl"
                                    >
                                      {wordText}
                                    </span>
                                  )}

                                  {/* Tooltip Card on Hover / Active Highlight */}
                                  {isWord && showWordTooltips && (wordTrans || wordTranslit) && (
                                    <div
                                      className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 flex-col items-center bg-slate-950/95 dark:bg-slate-900/95 backdrop-blur-xl text-white text-[11px] px-2.5 py-1.5 rounded-xl shadow-2xl z-30 pointer-events-none whitespace-nowrap min-w-[70px] border border-emerald-500/40 transition-all duration-200 ${
                                        isActiveWord ? "flex animate-fadeIn" : "hidden group-hover:flex"
                                      }`}
                                    >
                                      {wordTranslit && (
                                        <span
                                          className="font-bold text-emerald-300 font-sans tracking-wide mb-0.5 text-center"
                                          dir="ltr"
                                        >
                                          {wordTranslit}
                                        </span>
                                      )}
                                      {wordTrans && (
                                        <span
                                          className="text-gray-200 font-sans text-center font-normal leading-tight"
                                          dir="ltr"
                                        >
                                          {wordTrans}
                                        </span>
                                      )}
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-950 dark:border-t-slate-900"></div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()
                    ) : (
                      <div
                        className={`font-bold text-end font-arabic ayah-arabic-text pb-4 leading-loose ${
                          isPlaying ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"
                        }`}
                      >
                        {text}
                      </div>
                    )}

                    {/* Gradient separator */}
                    <div className="verse-divider my-2.5"></div>

                    {/* Multi-Translation List */}
                    <div className="flex flex-col gap-3 pt-1">
                      {Array.isArray(englishTrans[idx]) ? (
                        englishTrans[idx].map((transItem, tIdx) => (
                          <div key={tIdx} className="flex flex-col gap-1">
                            {englishTrans[idx].length > 1 && (
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md w-max border border-emerald-500/20">
                                {transItem.name || `Translation ${tIdx + 1}`}
                              </span>
                            )}
                            <p className="text-slate-800 dark:text-slate-200 ayah-text leading-relaxed font-normal">
                              {transItem.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-800 dark:text-slate-200 ayah-text leading-relaxed font-normal">
                          {englishTrans[idx]?.text || englishTrans[idx]}
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tafsir Modal */}
      <TafsirModal
        isOpen={tafsirModalData.isOpen}
        onClose={() => setTafsirModalData((prev) => ({ ...prev, isOpen: false }))}
        surahId={tafsirModalData.surahId}
        ayahNumber={tafsirModalData.ayahNumber}
        verseKey={tafsirModalData.verseKey}
        arabicText={tafsirModalData.arabicText}
        translationText={tafsirModalData.translationText}
      />
    </>
  );
}

