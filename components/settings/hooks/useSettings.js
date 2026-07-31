"use client";

import * as React from "react";
import { setCookie } from "cookies-next";
import { useTheme } from "next-themes";
import getLanguages from "@/lib/api/getLanguages";
import getTranslationEditions from "@/lib/api/getTranslationEditions";
import { useRouter } from "next/navigation";
import { useAudio } from "@/context/AudioProvider";
import { useUser } from "@/context/UserProvider";

export default function useSettings() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { session } = useUser() || {};
  const audio = useAudio();

  const [themeChoice, setThemeChoice] = React.useState("system");
  const [languages, setLanguages] = React.useState([]);
  const [language, setLanguage] = React.useState("bn");
  const [editions, setEditions] = React.useState([]);
  const [filteredEditions, setFilteredEditions] = React.useState([]);
  const [identifier, setIdentifier] = React.useState("");
  const [fontSize, setFontSize] = React.useState(18);
  const [arabicFontSize, setArabicFontSize] = React.useState(24);
  const [reciterId, setReciterId] = React.useState("7");

  // Initial load
  React.useEffect(() => {
    // Theme
    try {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const sel = cookies.find((c) => c.startsWith("__theme_selected__="));
      const cookie = cookies.find((c) => c.startsWith("__theme__="));
      const value = sel
        ? sel.split("=")[1]
        : cookie
        ? cookie.split("=")[1]
        : "system";
      setThemeChoice(value || "system");
      if (sel) {
        setCookie("__theme_selected__", "", { expires: new Date(0), path: "/" });
      }
    } catch {}

    // Language
    try {
      const savedLang = localStorage.getItem("app_language");
      if (savedLang) setLanguage(savedLang);
    } catch {}

    // Font sizes
    try {
      const savedFont = parseInt(localStorage.getItem("app_font_size") || "", 10);
      if (!isNaN(savedFont) && savedFont >= 14 && savedFont <= 36) {
        setFontSize(savedFont);
        document.documentElement.style.setProperty("--ayah-font-size", `${savedFont}px`);
      }
    } catch {}
    try {
      const savedArabic = parseInt(localStorage.getItem("app_arabic_font_size") || "", 10);
      if (!isNaN(savedArabic) && savedArabic >= 18 && savedArabic <= 48) {
        setArabicFontSize(savedArabic);
        document.documentElement.style.setProperty("--ayah-arabic-font-size", `${savedArabic}px`);
      } else {
        const defaultArabic = typeof window !== "undefined" && window.innerWidth >= 768 ? 29 : 24;
        setArabicFontSize(defaultArabic);
        document.documentElement.style.setProperty("--ayah-arabic-font-size", `${defaultArabic}px`);
      }
    } catch {
      const fallbackArabic = typeof window !== "undefined" && window.innerWidth >= 768 ? 29 : 24;
      setArabicFontSize(fallbackArabic);
      document.documentElement.style.setProperty("--ayah-arabic-font-size", `${fallbackArabic}px`);
    }

    // Reciter ID
    try {
      const savedReciter = localStorage.getItem("app_reciter_id");
      if (savedReciter) {
        setReciterId(savedReciter);
        setCookie("__reciter_id__", savedReciter, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          path: "/",
        });
      } else {
        setReciterId("7");
        setCookie("__reciter_id__", "7", {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          path: "/",
        });
      }
    } catch {}

    // Fetch languages
    (async () => {
      const langs = await getLanguages();
      if (langs?.length) setLanguages(langs);
    })();

    // Fetch editions
    (async () => {
      try {
        const eds = await getTranslationEditions();
        setEditions(eds);
        const lang = localStorage.getItem("app_language") || "bn";
        const initial = eds.filter((e) => e.language === lang && e.format === "text");
        setFilteredEditions(initial);
        const savedId = localStorage.getItem("app_translation_identifier");
        if (savedId) setIdentifier(savedId);
      } catch {}
    })();
  }, []);

  // Sync reciter from user profile if logged in
  React.useEffect(() => {
    if (session?.access_token) {
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.preferredReciter) {
            const val = data.preferredReciter === "mishari_al_afasy" ? "7" : String(data.preferredReciter);
            setReciterId(val);
            localStorage.setItem("app_reciter_id", val);
            setCookie("__reciter_id__", val, {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
              path: "/",
            });
          }
        })
        .catch((err) => console.error("Error loading profile settings:", err));
    }
  }, [session?.access_token]);

  // Refilter on language change
  React.useEffect(() => {
    const next = editions.filter((e) => e.language === language && e.format === "text");
    setFilteredEditions(next);
    try {
      const savedId = localStorage.getItem("app_translation_identifier");
      const exists = next.some((e) => e.identifier === savedId);
      if (savedId && exists) {
        setIdentifier(savedId);
      } else {
        const first = next[0]?.identifier || "";
        setIdentifier(first);
        if (first) {
          try {
            localStorage.setItem("app_translation_identifier", first);
            setCookie("__translation_identifier__", first, {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
              path: "/",
            });
          } catch {}
        }
      }
    } catch {
      const first = next[0]?.identifier || "";
      setIdentifier(first);
    }
  }, [language, editions]);

  // Handlers
  const handleThemeChange = (_e, value) => {
    if (!value) return;
    setThemeChoice(value);
    setTimeout(() => {
      setTheme(value);
      setCookie("__theme__", value, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    }, 360);
  };

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    setLanguage(val);
    try {
      localStorage.setItem("app_language", val);
      setCookie("__language__", val, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    } catch {}
    setTimeout(() => {
      try {
        router.refresh();
      } catch {
        if (typeof window !== "undefined") window.location.reload();
      }
    }, 150);
  };

  const handleIdentifierChange = (e) => {
    const val = e.target.value;
    setIdentifier(val);
    try {
      localStorage.setItem("app_translation_identifier", val);
      setCookie("__translation_identifier__", val, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    } catch {}
    setTimeout(() => {
      try {
        router.refresh();
      } catch {
        if (typeof window !== "undefined") window.location.reload();
      }
    }, 120);
  };

  const handleFontSizeChange = (_e, val) => {
    const size = Array.isArray(val) ? val[0] : val;
    const clamped = Math.max(14, Math.min(36, size));
    setFontSize(clamped);
    try {
      localStorage.setItem("app_font_size", String(clamped));
      setCookie("__font_size__", String(clamped), {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    } catch {}
    document.documentElement.style.setProperty("--ayah-font-size", `${clamped}px`);
  };

  const handleArabicFontSizeChange = (_e, val) => {
    const size = Array.isArray(val) ? val[0] : val;
    const clamped = Math.max(18, Math.min(48, size));
    setArabicFontSize(clamped);
    try {
      localStorage.setItem("app_arabic_font_size", String(clamped));
      setCookie("__arabic_font_size__", String(clamped), {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    } catch {}
    document.documentElement.style.setProperty("--ayah-arabic-font-size", `${clamped}px`);
  };

  const handleReciterIdChange = (val) => {
    const stringVal = String(val);
    setReciterId(stringVal);
    try {
      localStorage.setItem("app_reciter_id", stringVal);
      setCookie("__reciter_id__", stringVal, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    } catch {}

    // Sync to user profile if logged in
    if (session?.access_token) {
      fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ preferredReciter: stringVal }),
      }).catch((err) => console.error("Error syncing reciter change:", err));
    }

    // Hot-swap playing audio if any Surah is currently playing
    if (audio?.playlistId) {
      let num = null;
      if (typeof audio.playlistId === "string" && audio.playlistId.startsWith("surah_")) {
        num = parseInt(audio.playlistId.replace("surah_", ""), 10);
      } else if (!isNaN(Number(audio.playlistId))) {
        num = parseInt(audio.playlistId, 10);
      }
      if (num) {
        const currentPos = audio?.currentTime || 0;
        audio.playSurah(num, audio.title || "", currentPos);
      }
    }

    setTimeout(() => {
      try {
        router.refresh();
      } catch {
        if (typeof window !== "undefined") window.location.reload();
      }
    }, 150);
  };

  const resetAll = () => {
    try {
      localStorage.removeItem("app_language");
      localStorage.removeItem("app_translation_identifier");
      localStorage.removeItem("app_font_size");
      localStorage.removeItem("app_arabic_font_size");
      localStorage.removeItem("app_reciter_id");
      setThemeChoice("system");
      document.documentElement.style.setProperty("--ayah-font-size", "18px");
      const defaultArabic = typeof window !== "undefined" && window.innerWidth >= 768 ? 32 : 24;
      document.documentElement.style.setProperty("--ayah-arabic-font-size", `${defaultArabic}px`);
      setCookie("__language__", "", { expires: new Date(0), path: "/" });
      setCookie("__translation_identifier__", "", { expires: new Date(0), path: "/" });
      setCookie("__font_size__", "", { expires: new Date(0), path: "/" });
      setCookie("__arabic_font_size__", "", { expires: new Date(0), path: "/" });
      setCookie("__reciter_id__", "", { expires: new Date(0), path: "/" });
      setCookie("__theme__", "system", {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    } catch {}
    setLanguage("bn");
    setIdentifier("");
    setFontSize(18);
    const defaultArabic = typeof window !== "undefined" && window.innerWidth >= 768 ? 32 : 24;
    setArabicFontSize(defaultArabic);
    setReciterId("7");
    setTimeout(() => {
      try {
        router.refresh();
      } catch {
        if (typeof window !== "undefined") window.location.reload();
      }
    }, 150);
  };

  return {
    // state
    themeChoice,
    resolvedTheme,
    languages,
    language,
    filteredEditions,
    identifier,
    fontSize,
    arabicFontSize,
    reciterId,
    // handlers
    handleThemeChange,
    handleLanguageChange,
    handleIdentifierChange,
    handleFontSizeChange,
    handleArabicFontSizeChange,
    handleReciterIdChange,
    resetAll,
  };
}
