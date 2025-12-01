"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ThemeToggle from "@/components/settings/ThemeToggle";
import LanguageSelect from "@/components/settings/LanguageSelect";
import TranslationSelect from "@/components/settings/TranslationSelect";
import FontSizeControls from "@/components/settings/FontSizeControls";
import SettingsResetButton from "@/components/settings/SettingsResetButton";
import useSettings from "@/components/settings/hooks/useSettings";

export default function SettingsDrawer({ open, onClose }) {
  const {
    themeChoice,
    resolvedTheme,
    languages,
    language,
    filteredEditions,
    identifier,
    fontSize,
    arabicFontSize,
    handleThemeChange,
    handleLanguageChange,
    handleIdentifierChange,
    handleFontSizeChange,
    handleArabicFontSizeChange,
    resetAll,
  } = useSettings();

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: { mode: resolvedTheme === "dark" ? "dark" : "light" },
      }),
    [resolvedTheme]
  );

  return (
    <ThemeProvider theme={muiTheme}>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 340,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">Settings</Typography>
            <IconButton
              aria-label="close settings"
              onClick={onClose}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider />
          <ThemeToggle value={themeChoice} onChange={handleThemeChange} />
          <LanguageSelect
            languages={languages}
            value={language}
            onChange={handleLanguageChange}
          />
          <TranslationSelect
            editions={filteredEditions}
            value={identifier}
            onChange={handleIdentifierChange}
          />
          <FontSizeControls
            fontSize={fontSize}
            arabicFontSize={arabicFontSize}
            onFontSizeChange={handleFontSizeChange}
            onArabicFontSizeChange={handleArabicFontSizeChange}
          />
          <Divider />
          <SettingsResetButton onReset={resetAll} />
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}
