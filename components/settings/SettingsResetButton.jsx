"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function SettingsResetButton({ onReset }) {
  return (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
      <Button variant="outlined" color="error" onClick={onReset}>
        Reset Settings
      </Button>
    </Box>
  );
}
