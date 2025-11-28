"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "next-themes";
import { setCookie } from "cookies-next";

export default function SettingsDrawer({ open, onClose }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [darkChecked, setDarkChecked] = React.useState(
    resolvedTheme === "dark"
  );

  React.useEffect(() => {
    setDarkChecked(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const handleDarkToggle = (event) => {
    const next = event.target.checked ? "dark" : "light";
    setDarkChecked(event.target.checked);
    setTheme(next);
    setCookie("__theme__", next, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
    });
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
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 280 }} role="presentation">
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
          <FormControlLabel
            control={
              <Switch checked={darkChecked} onChange={handleDarkToggle} />
            }
            label="Dark Mode"
          />
        </Box>
        {/* Add more settings sections here as needed */}
      </Box>
    </Drawer>
    </ThemeProvider>
  );
}
