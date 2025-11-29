"use client";

import * as React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export default function TranslationSelect({
  editions = [],
  value = "",
  onChange,
  sx,
  labelId = "settings-translation-label",
}) {
  const renderValue = React.useCallback(
    (val) => {
      if (!val) return "";
      const edition = editions.find((e) => e.identifier === val);
      if (!edition) return val;
      return edition.englishName || edition.name || val;
    },
    [editions]
  );

  return (
    <React.Fragment>
      {/* <Typography variant="subtitle1" sx={{ mb: 1, mt:1 }}>
        Translation
      </Typography> */}
      <FormControl fullWidth size="small" sx={{mt: 2}}>
        <InputLabel id={labelId}>Translation</InputLabel>
        <Select
          labelId={labelId}
          value={value}
          label="Translation"
          onChange={onChange}
          displayEmpty
          renderValue={renderValue}
        >
          <MenuItem value="">
            <em></em>
          </MenuItem>
          {editions.map((e) => {
            const hasBoth = e.englishName && e.name && e.englishName !== e.name;
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
    </React.Fragment>
  );
}
