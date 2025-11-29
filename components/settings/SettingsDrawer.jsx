"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ThemeToggle from "@/components/settings/ThemeToggle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "next-themes";
import { setCookie } from "cookies-next";

export default function SettingsDrawer({ open, onClose }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [themeChoice, setThemeChoice] = React.useState("system");

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
  }, []);

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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ThemeToggle value={themeChoice} onChange={handleThemeChange} />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
}
