"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookOpen } from "lucide-react";

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
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Translation Edition
        </label>
      </div>
      <Select
        value={value}
        onValueChange={(val) => onChange({ target: { value: val } })}
      >
        <SelectTrigger className="w-full rounded-xl border border-gray-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 truncate">
          <SelectValue placeholder="Select edition" />
        </SelectTrigger>
        <SelectContent className="max-h-[260px] rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {editions.map((e) => (
            <SelectItem key={e.identifier} value={e.identifier} className="text-xs font-medium cursor-pointer">
              {renderLabel(e)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
