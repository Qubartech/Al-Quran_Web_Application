"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TranslationSelect({
  editions = [],
  value = "",
  onChange = () => {},
}) {
  const renderLabel = React.useCallback((e) => {
    const hasBoth = e.englishName && e.name && e.englishName !== e.name;
    return hasBoth
      ? `${e.englishName} — ${e.name}`
      : e.englishName || e.name || e.identifier;
  }, []);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        Translation Edition
      </label>
      <Select
        value={value}
        onValueChange={(val) => onChange({ target: { value: val } })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select edition" />
        </SelectTrigger>
        <SelectContent>
          {editions.map((e) => (
            <SelectItem key={e.identifier} value={e.identifier}>
              {renderLabel(e)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
