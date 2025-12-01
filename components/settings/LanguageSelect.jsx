"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LanguageSelect({
  languages = [],
  value = "bn",
  onChange = () => {},
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">
        Translation Language
      </label>
      <Select 
        value={value} 
        onValueChange={(val) => onChange({ target: { value: val } })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.length === 0 ? (
            <SelectItem value={value}>{value}</SelectItem>
          ) : (
            languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}