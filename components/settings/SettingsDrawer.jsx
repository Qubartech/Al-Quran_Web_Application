"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ThemeToggle from "@/components/settings/ThemeToggle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import getLanguages from "@/lib/api/getLanguages";
import getTranslationEditions from "@/lib/api/getTranslationEditions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "next-themes";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export default function SettingsDrawer({ open, onClose }) {
  const { resolvedTheme, setTheme } = useTheme();
  const router = useRouter();
  const [themeChoice, setThemeChoice] = React.useState("system");
  const [languages, setLanguages] = React.useState([]);
  const [language, setLanguage] = React.useState("bn");
  const [editions, setEditions] = React.useState([]);
  const [filteredEditions, setFilteredEditions] = React.useState([]);
  // Translation edition identifier user explicitly selected; blank means none chosen yet
  const [identifier, setIdentifier] = React.useState("");

  React.useEffect(() => {
    try {
      const cookie = document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith("__theme__="));
      const value = cookie ? cookie.split("=")[1] : "system";
      setThemeChoice(value || "system");
    } catch (e) {
      setThemeChoice("system");
    }
    // Restore language from localStorage
    try {
      const savedLang = localStorage.getItem("app_language");
      if (savedLang) setLanguage(savedLang);
    } catch {}
    // Fetch languages list
    (async () => {
      const langs = await getLanguages();
      if (langs?.length) setLanguages(langs);
    })();
    // Fetch all translation editions once and initialize identifier (only if user previously selected one)
    (async () => {
      try {
        const eds = await getTranslationEditions();
        setEditions(eds);
        const lang = localStorage.getItem("app_language") || "bn";
        const initial = eds.filter(
          (e) => e.language === lang && e.format === "text"
        );
        setFilteredEditions(initial);
        const savedId = localStorage.getItem("app_translation_identifier");
        if (savedId) setIdentifier(savedId);
      } catch {}
    })();
  }, []);

  React.useEffect(() => {
    // Update filtered editions when language changes; do NOT auto-select a fallback.
    const next = editions.filter(
      (e) => e.language === language && e.format === "text"
    );
    setFilteredEditions(next);
    try {
      const savedId = localStorage.getItem("app_translation_identifier");
      if (savedId && savedId.startsWith(`${language}.`)) {
        setIdentifier(savedId);
      } else {
        // Auto-select first identifier for this language if available
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

  const updateTheme = (next) => {
    // Update local state first so the toggle animates immediately
    setThemeChoice(next);
    // Delay global theme switch until after the 350ms toggle animation completes
    setTimeout(() => {
      setTheme(next);
      setCookie("__theme__", next, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        path: "/",
      });
    }, 360);
  };

  const handleThemeChange = (_e, value) => {
    if (!value) return;
    updateTheme(value);
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
    // Allow identifier auto-select effect to run, then refresh to re-fetch server data
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
    // Refresh page to pull new translation edition server-side
    setTimeout(() => {
      try {
        router.refresh();
      } catch {
        if (typeof window !== "undefined") window.location.reload();
      }
    }, 120);
  };

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: { mode: resolvedTheme === "dark" ? "dark" : "light" },
      }),
    [resolvedTheme]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: (t) => ({
            bgcolor: t.palette.mode === "dark" ? "#141D2F" : "background.paper",
            color: t.palette.mode === "dark" ? "#E5E7EB" : "text.primary",
          }),
        }}
      >
        <Box sx={{ width: 350 }} role="presentation">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
            }}
          >
            <Typography variant="h6">Settings</Typography>
            <IconButton aria-label="Close settings" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Appearance
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <ThemeToggle value={themeChoice} onChange={handleThemeChange} />
            </Box>
          </Box>
          <Divider />
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Language
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel id="settings-language-label">Language</InputLabel>
              <Select
                labelId="settings-language-label"
                value={language}
                label="Language"
                onChange={handleLanguageChange}
              >
                {languages.length === 0 && (
                  <MenuItem value={language}>{language}</MenuItem>
                )}
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mt: 2 }}>
              <InputLabel id="settings-translation-label">
                Translation
              </InputLabel>
              <Select
                labelId="settings-translation-label"
                value={identifier}
                label="Translation"
                onChange={handleIdentifierChange}
                displayEmpty
                renderValue={(val) => {
                  if (!val) return "";
                  // Prefer englishName in display; fallback to native name; then identifier
                  const edition =
                    editions.find((e) => e.identifier === val) ||
                    filteredEditions.find((e) => e.identifier === val);
                  if (!edition) return val;
                  return edition.englishName || edition.name || val;
                }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                {filteredEditions.map((e) => {
                  const hasBoth =
                    e.englishName && e.name && e.englishName !== e.name;
                  const label = hasBoth
                    ? `${e.englishName} — ${e.name}`
                    : e.englishName || e.name || e.identifier;
                  return (
                    <MenuItem key={e.identifier} value={e.identifier}>
                      {label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}
