"use client";

import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export default function LanguageSelect({
  languages = [],
  value = "bn",
  onChange,
  sx,
  labelId = "settings-language-label",
}) {
  return (
    <React.Fragment>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Language
      </Typography>
      <FormControl fullWidth size="small" sx={sx}>
        <InputLabel id={labelId}>Language</InputLabel>
        <Select
          labelId={labelId}
          value={value}
          label="Language"
          onChange={onChange}
        >
          {languages.length === 0 && <MenuItem value={value}>{value}</MenuItem>}
          {languages.map((lang) => (
            <MenuItem key={lang} value={lang}>
              {lang}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </React.Fragment>
  );
}
